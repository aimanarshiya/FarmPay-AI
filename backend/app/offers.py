import uuid
from datetime import datetime, timezone
from typing import Optional, List
from decimal import Decimal

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field

from app.database import get_connection
from app.auth import get_current_user, require_role
from app.ai_service import analyze_offers

router = APIRouter(prefix="/api", tags=["Offers & Negotiations"])


class SubmitOfferRequest(BaseModel):
    price_per_kg: float = Field(gt=0, description="Price offered per kg in INR")
    offered_quantity_kg: float = Field(gt=0, description="Quantity buyer wants to purchase")
    transport_cost: Optional[float] = Field(default=None, ge=0, description="Estimated transport deduction")
    notes: Optional[str] = Field(default=None, max_length=500)


def normalize_offer(row: dict) -> dict:
    if not row:
        return None
    res = dict(row)
    for k in ("price_per_kg", "offered_quantity_kg", "transport_cost", "gross_amount", "net_proceeds"):
        if res.get(k) is not None:
            res[k] = float(res[k])
    if res.get("created_at") and hasattr(res["created_at"], "isoformat"):
        res["created_at"] = res["created_at"].isoformat() + "Z"
    return res


@router.post("/listings/{listing_id}/offers", status_code=status.HTTP_201_CREATED)
def submit_buyer_offer(
    listing_id: str,
    req: SubmitOfferRequest,
    current_user: dict = Depends(require_role(["BUYER", "ADMIN"])),
):
    """Allows a registered buyer to submit a binding bid on a farmer's produce listing."""
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM produce_listings WHERE listing_id = %s FOR UPDATE",
                (listing_id,),
            )
            listing = cursor.fetchone()

            if not listing:
                raise HTTPException(status_code=404, detail="Produce listing not found.")

            if listing["status"] != "ACTIVE":
                raise HTTPException(
                    status_code=400,
                    detail=f"Cannot submit offer; listing is currently '{listing['status']}'.",
                )

            # Deterministic financial calculations on the backend
            gross = round(req.offered_quantity_kg * req.price_per_kg, 2)
            # Default transport calculation if not explicitly provided: ~₹0.50 per kg or minimum ₹200
            transport = round(
                req.transport_cost if req.transport_cost is not None else max(200.0, req.offered_quantity_kg * 0.4),
                2,
            )
            net = round(gross - transport, 2)

            offer_id = f"OFF-{uuid.uuid4().hex[:10].upper()}"
            now = datetime.now(timezone.utc).replace(tzinfo=None)

            buyer_name = current_user.get("business_name") or current_user.get("name")

            cursor.execute(
                """
                INSERT INTO buyer_offers (
                    offer_id, listing_id, buyer_id, buyer_name,
                    price_per_kg, offered_quantity_kg, transport_cost,
                    gross_amount, net_proceeds, notes, status, created_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'PENDING', %s)
                """,
                (
                    offer_id,
                    listing_id,
                    current_user["user_id"],
                    buyer_name,
                    req.price_per_kg,
                    req.offered_quantity_kg,
                    transport,
                    gross,
                    net,
                    req.notes or "",
                    now,
                ),
            )

        connection.commit()

        return {
            "success": True,
            "message": "Offer submitted successfully to the farmer.",
            "offer": {
                "offer_id": offer_id,
                "listing_id": listing_id,
                "buyer_id": current_user["user_id"],
                "buyer_name": buyer_name,
                "price_per_kg": req.price_per_kg,
                "offered_quantity_kg": req.offered_quantity_kg,
                "gross_amount": gross,
                "transport_cost": transport,
                "net_proceeds": net,
                "status": "PENDING",
                "created_at": now.isoformat() + "Z",
            },
        }
    except HTTPException:
        connection.rollback()
        raise
    except Exception as ex:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to submit offer: {str(ex)}")
    finally:
        connection.close()


@router.get("/listings/{listing_id}/offers")
def get_listing_offers(
    listing_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Retrieves all offers for a specific listing (sorted by highest net proceeds)."""
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM produce_listings WHERE listing_id = %s",
                (listing_id,),
            )
            listing = cursor.fetchone()

            if not listing:
                raise HTTPException(status_code=404, detail="Produce listing not found.")

            # Access control: only listing owner, buyers who made an offer, or admin
            if current_user["role"] == "FARMER" and listing["farmer_id"] != current_user["user_id"]:
                raise HTTPException(status_code=403, detail="You do not own this produce listing.")

            if current_user["role"] == "BUYER":
                cursor.execute(
                    """
                    SELECT offer_id FROM buyer_offers
                    WHERE listing_id = %s AND buyer_id = %s
                    LIMIT 1
                    """,
                    (listing_id, current_user["user_id"]),
                )
                if not cursor.fetchone():
                    raise HTTPException(
                        status_code=403,
                        detail="Submit an offer on this listing before viewing its bids.",
                    )

            cursor.execute(
                """
                SELECT * FROM buyer_offers
                WHERE listing_id = %s
                ORDER BY net_proceeds DESC, created_at DESC
                """,
                (listing_id,),
            )
            rows = cursor.fetchall() or []

        return {
            "success": True,
            "listing": {
                "listing_id": listing["listing_id"],
                "crop": listing["crop"],
                "quantity_kg": float(listing["quantity_kg"]),
                "location": listing["location"],
                "status": listing["status"],
            },
            "offers": [normalize_offer(r) for r in rows],
        }
    finally:
        connection.close()


@router.get("/listings/{listing_id}/ai-recommendation")
def get_ai_offer_recommendation(
    listing_id: str,
    current_user: dict = Depends(require_role(["FARMER", "ADMIN"])),
):
    """
    Invokes the FarmPay AI recommendation engine to analyze actual buyer offers for this listing.
    Provider chain: Groq (primary) → Gemini → Claude → Deterministic fallback.
    Ensures recommendations are grounded in reality and records audit metadata.
    """
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM produce_listings WHERE listing_id = %s", (listing_id,))
            listing = cursor.fetchone()

            if not listing:
                raise HTTPException(status_code=404, detail="Produce listing not found.")

            if current_user["role"] == "FARMER" and listing["farmer_id"] != current_user["user_id"]:
                raise HTTPException(status_code=403, detail="You do not own this produce listing.")

            cursor.execute(
                """
                SELECT * FROM buyer_offers
                WHERE listing_id = %s AND status = 'PENDING'
                ORDER BY net_proceeds DESC
                """,
                (listing_id,),
            )
            offers = cursor.fetchall() or []

        # Determine language from authenticated farmer's preference
        language = current_user.get("preferred_language", "en") or "en"

        # Analyze using the AI recommendation engine (Groq primary)
        recommendation = analyze_offers(
            crop=listing["crop"],
            quantity_kg=float(listing["quantity_kg"]),
            location=listing["location"],
            offers=[normalize_offer(o) for o in offers],
            language=language,
        )

        # Audit trail persistence
        rec_id = f"REC-{uuid.uuid4().hex[:10].upper()}"
        now = datetime.now(timezone.utc).replace(tzinfo=None)

        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO ai_recommendations (
                        recommendation_id, listing_id, recommended_buyer_id,
                        explanation, financial_analysis, trade_offs, warnings,
                        model_used, is_fallback, created_at
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        rec_id,
                        listing_id,
                        recommendation.recommended_buyer_id,
                        recommendation.summary,
                        recommendation.financial_analysis,
                        "\n".join(recommendation.trade_offs or []),
                        "\n".join(recommendation.warnings or []),
                        recommendation.model_used,
                        recommendation.is_fallback,
                        now,
                    ),
                )
            connection.commit()
        except Exception:
            # Audit log failure should not break farmer's advice
            pass

        return {
            "success": True,
            "listing_id": listing_id,
            "crop": listing["crop"],
            "recommendation": recommendation.model_dump(),
        }
    finally:
        connection.close()


@router.post("/offers/{offer_id}/accept")
def accept_buyer_offer(
    offer_id: str,
    current_user: dict = Depends(require_role(["FARMER", "ADMIN"])),
):
    """
    Farmer explicitly accepts a buyer's offer.
    Executes transactionally:
    1. Locks listing and offer rows.
    2. Marks accepted offer as ACCEPTED.
    3. Rejects competing pending offers for this listing.
    4. Marks listing as ORDER_CREATED.
    5. Creates Order record in orders table ready for digital payment.
    """
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM buyer_offers WHERE offer_id = %s FOR UPDATE",
                (offer_id,),
            )
            offer = cursor.fetchone()

            if not offer:
                raise HTTPException(status_code=404, detail="Offer not found.")

            if offer["status"] != "PENDING":
                raise HTTPException(
                    status_code=400,
                    detail=f"This offer is already '{offer['status']}' and cannot be accepted.",
                )

            cursor.execute(
                "SELECT * FROM produce_listings WHERE listing_id = %s FOR UPDATE",
                (offer["listing_id"],),
            )
            listing = cursor.fetchone()

            if not listing:
                raise HTTPException(status_code=404, detail="Underlying listing not found.")

            if current_user["role"] == "FARMER" and listing["farmer_id"] != current_user["user_id"]:
                raise HTTPException(status_code=403, detail="You do not own this listing.")

            if listing["status"] != "ACTIVE":
                raise HTTPException(
                    status_code=409,
                    detail=f"Listing is no longer active (status: {listing['status']}).",
                )

            # Update accepted offer
            cursor.execute(
                "UPDATE buyer_offers SET status = 'ACCEPTED' WHERE offer_id = %s",
                (offer_id,),
            )

            # Reject other pending offers on this listing
            cursor.execute(
                """
                UPDATE buyer_offers
                SET status = 'REJECTED'
                WHERE listing_id = %s AND offer_id != %s AND status = 'PENDING'
                """,
                (offer["listing_id"], offer_id),
            )

            # Update listing status
            cursor.execute(
                "UPDATE produce_listings SET status = 'ORDER_CREATED' WHERE listing_id = %s",
                (offer["listing_id"],),
            )

            # Create Order in orders table (preserving schema & invariants)
            order_id = f"FP-{uuid.uuid4().hex[:12].upper()}"
            now = datetime.now(timezone.utc).replace(tzinfo=None)

            cursor.execute(
                """
                INSERT INTO orders (
                    order_id, farmer_id, listing_id, offer_id,
                    buyer_id, buyer_name, crop, quantity_kg, location,
                    price_per_kg, gross_amount, transport_cost, net_proceeds,
                    currency, offer_type, status, payment_status, created_at
                )
                VALUES (
                    %s, %s, %s, %s,
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s,
                    'INR', 'LIVE', 'PENDING_PAYMENT', 'NOT_PAID', %s
                )
                """,
                (
                    order_id,
                    listing["farmer_id"],
                    listing["listing_id"],
                    offer_id,
                    offer["buyer_id"],
                    offer["buyer_name"],
                    listing["crop"],
                    offer["offered_quantity_kg"],
                    listing["location"],
                    offer["price_per_kg"],
                    offer["gross_amount"],
                    offer["transport_cost"],
                    offer["net_proceeds"],
                    now,
                ),
            )

            cursor.execute("SELECT * FROM orders WHERE order_id = %s", (order_id,))
            created_order = cursor.fetchone()

        connection.commit()

        # Format order response
        res_order = dict(created_order)
        for k in ("quantity_kg", "price_per_kg", "gross_amount", "transport_cost", "net_proceeds"):
            if res_order.get(k) is not None:
                res_order[k] = float(res_order[k])
        if res_order.get("created_at") and hasattr(res_order["created_at"], "isoformat"):
            res_order["created_at"] = res_order["created_at"].isoformat() + "Z"
        elif res_order.get("created_at"):
            res_order["created_at"] = str(res_order["created_at"])

        return {
            "success": True,
            "message": "Offer accepted! Order created. Ready for PayPal Sandbox payment testing.",
            "order": res_order,
        }
    except HTTPException:
        connection.rollback()
        raise
    except Exception as ex:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to accept offer: {str(ex)}")
    finally:
        connection.close()


@router.post("/offers/{offer_id}/reject")
def reject_buyer_offer(
    offer_id: str,
    current_user: dict = Depends(require_role(["FARMER", "ADMIN"])),
):
    """Allows farmer to decline an unviable offer."""
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT o.*, l.farmer_id
                FROM buyer_offers o
                JOIN produce_listings l ON o.listing_id = l.listing_id
                WHERE o.offer_id = %s
                """,
                (offer_id,),
            )
            offer = cursor.fetchone()

            if not offer:
                raise HTTPException(status_code=404, detail="Offer not found.")

            if current_user["role"] == "FARMER" and offer["farmer_id"] != current_user["user_id"]:
                raise HTTPException(status_code=403, detail="You do not own the listing for this offer.")

            cursor.execute(
                "UPDATE buyer_offers SET status = 'REJECTED' WHERE offer_id = %s",
                (offer_id,),
            )
        connection.commit()

        return {"success": True, "message": "Offer rejected."}
    finally:
        connection.close()


@router.get("/buyer/my-offers")
def get_buyer_submitted_offers(
    current_user: dict = Depends(require_role(["BUYER", "ADMIN"])),
):
    """Retrieves all bids submitted by the logged-in buyer along with listing context."""
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT o.*, l.crop, l.location, l.farmer_name
                FROM buyer_offers o
                JOIN produce_listings l ON o.listing_id = l.listing_id
                WHERE o.buyer_id = %s
                ORDER BY o.created_at DESC
                """,
                (current_user["user_id"],),
            )
            rows = cursor.fetchall() or []

        return {
            "success": True,
            "offers": [normalize_offer(r) for r in rows],
        }
    finally:
        connection.close()
