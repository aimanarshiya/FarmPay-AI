import uuid
from datetime import datetime, timezone
from typing import Optional, List
from decimal import Decimal

from fastapi import APIRouter, HTTPException, Depends, Query, status
from pydantic import BaseModel, Field

from app.database import get_connection
from app.auth import get_current_user, require_role

router = APIRouter(prefix="/api/listings", tags=["Produce Listings"])


class CreateListingRequest(BaseModel):
    crop: str = Field(min_length=2, max_length=100)
    quantity_kg: float = Field(gt=0, le=1000000)
    expected_price_per_kg: float = Field(gt=0)
    location: str = Field(min_length=2, max_length=150)
    village: Optional[str] = Field(default=None, max_length=100)
    district: Optional[str] = Field(default=None, max_length=100)
    state: Optional[str] = Field(default="Andhra Pradesh", max_length=100)


def normalize_listing(row: dict) -> dict:
    if not row:
        return None
    res = dict(row)
    for k in ("quantity_kg", "expected_price_per_kg"):
        if res.get(k) is not None:
            res[k] = float(res[k])
    if res.get("created_at") and hasattr(res["created_at"], "isoformat"):
        res["created_at"] = res["created_at"].isoformat() + "Z"
    return res


@router.post("", status_code=status.HTTP_201_CREATED)
def create_listing(
    req: CreateListingRequest,
    current_user: dict = Depends(require_role(["FARMER", "ADMIN"])),
):
    """Allows a registered farmer to list their harvested crop for sale."""
    listing_id = f"LST-{uuid.uuid4().hex[:10].upper()}"
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    crop = req.crop.strip().title()

    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO produce_listings (
                    listing_id, farmer_id, farmer_name, crop, quantity_kg,
                    expected_price_per_kg, location, village, district, state,
                    status, created_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'ACTIVE', %s)
                """,
                (
                    listing_id,
                    current_user["user_id"],
                    current_user["name"],
                    crop,
                    req.quantity_kg,
                    req.expected_price_per_kg,
                    req.location.strip(),
                    req.village or req.location,
                    req.district or "Guntur",
                    req.state or "Andhra Pradesh",
                    now,
                ),
            )
        connection.commit()

        return {
            "success": True,
            "message": "Harvest listing created successfully.",
            "listing": {
                "listing_id": listing_id,
                "farmer_id": current_user["user_id"],
                "farmer_name": current_user["name"],
                "crop": crop,
                "quantity_kg": req.quantity_kg,
                "expected_price_per_kg": req.expected_price_per_kg,
                "location": req.location,
                "status": "ACTIVE",
                "created_at": now.isoformat() + "Z",
            },
        }
    except Exception as ex:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create listing: {str(ex)}")
    finally:
        connection.close()


@router.get("")
def list_active_produce(
    crop: Optional[str] = None,
    location: Optional[str] = None,
    status_filter: Optional[str] = Query(default="ACTIVE", alias="status"),
    limit: int = 50,
    offset: int = 0,
):
    """Public marketplace endpoint for buyers to search and filter available listings."""
    connection = get_connection()
    try:
        query = "SELECT * FROM produce_listings WHERE 1=1"
        params = []

        if status_filter:
            query += " AND status = %s"
            params.append(status_filter)
        if crop:
            query += " AND crop LIKE %s"
            params.append(f"%{crop.strip()}%")
        if location:
            query += " AND (location LIKE %s OR district LIKE %s)"
            params.extend([f"%{location.strip()}%", f"%{location.strip()}%"])

        query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        with connection.cursor() as cursor:
            cursor.execute(query, tuple(params))
            rows = cursor.fetchall() or []

        return {
            "success": True,
            "listings": [normalize_listing(r) for r in rows],
            "count": len(rows),
        }
    except Exception as ex:
        # Fallback for when produce_listings table is not created yet
        return {"success": True, "listings": [], "count": 0, "message": str(ex)}
    finally:
        connection.close()


@router.get("/farmer/my-listings")
def get_farmer_listings(
    current_user: dict = Depends(require_role(["FARMER", "ADMIN"])),
):
    """Retrieves all listings posted by the logged-in farmer, with count of offers received."""
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT l.*,
                       COUNT(o.offer_id) AS offer_count,
                       MAX(o.net_proceeds) AS highest_net_proceeds
                FROM produce_listings l
                LEFT JOIN buyer_offers o ON l.listing_id = o.listing_id
                WHERE l.farmer_id = %s
                GROUP BY l.listing_id
                ORDER BY l.created_at DESC
                """,
                (current_user["user_id"],),
            )
            rows = cursor.fetchall() or []

        results = []
        for r in rows:
            item = normalize_listing(r)
            item["offer_count"] = r.get("offer_count", 0)
            item["highest_net_proceeds"] = float(r["highest_net_proceeds"]) if r.get("highest_net_proceeds") else None
            results.append(item)

        return {"success": True, "listings": results}
    finally:
        connection.close()


@router.get("/{listing_id}")
def get_listing_by_id(listing_id: str):
    """Retrieves a single listing and its detailed profile."""
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM produce_listings WHERE listing_id = %s",
                (listing_id,),
            )
            row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Produce listing not found.")

        return {"success": True, "listing": normalize_listing(row)}
    finally:
        connection.close()
