from datetime import timezone
import logging

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.database import get_connection
from app.payments import router as paypal_router
from app.auth import router as auth_router, require_role
from app.listings import router as listings_router
from app.offers import router as offers_router
from app.admin import router as admin_router
from app.ai_service import analyze_offers

logger = logging.getLogger(__name__)

app = FastAPI(
    title="FarmPay AI API",
    description="AI-Enabled Agricultural Commerce & Digital Payment Assistant",
    version="2.0.0",
)

# --------------------------------------------------
# ROUTERS
# --------------------------------------------------
app.include_router(paypal_router)
app.include_router(auth_router)
app.include_router(listings_router)
app.include_router(offers_router)
app.include_router(admin_router)

# --------------------------------------------------
# CORS CONFIGURATION
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# BASE ENDPOINTS
# --------------------------------------------------

@app.get("/")
def home():
    return {"message": "Welcome to FarmPay AI"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/api/message")
def get_message():
    return {
        "message": "Welcome to FarmPay AI!",
        "description": "Smarter Farming. Better Selling. Simpler Payments.",
        "backend": "FastAPI connected successfully",
    }


# --------------------------------------------------
# DEMO-ONLY OFFER SIMULATOR
# --------------------------------------------------

class FarmerRequest(BaseModel):
    crop: str = Field(min_length=2, max_length=50)
    quantity_kg: float = Field(gt=0, le=100000)
    location: str = Field(min_length=2, max_length=100)


DEMO_BUYERS = [
    {
        "buyer_id": "BUYER001",
        "buyer_name": "Demo Buyer A",
        "price_per_kg": 25.00,
        "transport_cost": 300.00,
    },
    {
        "buyer_id": "BUYER002",
        "buyer_name": "Demo Buyer B",
        "price_per_kg": 27.00,
        "transport_cost": 500.00,
    },
    {
        "buyer_id": "BUYER003",
        "buyer_name": "Demo Buyer C",
        "price_per_kg": 26.00,
        "transport_cost": 200.00,
    },
]


# --------------------------------------------------
# Illustrative buyers for the public calculator only. These are not database
# users, verified buyers, or live quotations and cannot be used to create orders.
# --------------------------------------------------

@app.post("/api/offers")
def get_buyer_offers(request: FarmerRequest):
    crop = request.crop.strip().title()
    location = request.location.strip()
    quantity = request.quantity_kg

    offers = []

    for buyer in DEMO_BUYERS:
        gross_amount = round(quantity * buyer["price_per_kg"], 2)
        transport_cost = round(buyer["transport_cost"], 2)
        net_proceeds = round(gross_amount - transport_cost, 2)

        offers.append(
            {
                "buyer_id": buyer["buyer_id"],
                "buyer_name": buyer["buyer_name"],
                "crop": crop,
                "quantity_kg": quantity,
                "location": location,
                "price_per_kg": buyer["price_per_kg"],
                "gross_amount": gross_amount,
                "transport_cost": transport_cost,
                "net_proceeds": net_proceeds,
                "currency": "INR",
                "offer_type": "DEMO",
            }
        )

    offers.sort(key=lambda offer: offer["net_proceeds"], reverse=True)

    # AI compares the illustrative figures only; the result is not a live bid.
    ai_recommendation = analyze_offers(
        crop=crop,
        quantity_kg=quantity,
        location=location,
        offers=offers,
    )

    return {
        "success": True,
        "message": "Illustrative demo offers generated. These are not live buyer bids.",
        "mode": "DEMO_ONLY",
        "data_type": "DEMO",
        "disclaimer": (
            "DEMO ONLY: These sample figures are not real buyer offers, verified quotations, "
            "or live market prices. They are not saved to MySQL and cannot create orders."
        ),
        "farmer_request": {
            "crop": crop,
            "quantity_kg": quantity,
            "location": location,
        },
        "offers": offers,
        "ai_recommendation": ai_recommendation.model_dump(),
    }


# --------------------------------------------------
# ORDER REQUEST & PERSISTENCE
# --------------------------------------------------

class OrderRequest(BaseModel):
    crop: str = Field(min_length=2, max_length=50)
    quantity_kg: float = Field(gt=0, le=100000)
    location: str = Field(min_length=2, max_length=100)
    buyer_id: str


def normalize_order(order: dict) -> dict:
    if not order:
        return None

    result = dict(order)
    numeric_fields = [
        "quantity_kg",
        "price_per_kg",
        "gross_amount",
        "transport_cost",
        "net_proceeds",
    ]

    for field in numeric_fields:
        if result.get(field) is not None:
            result[field] = float(result[field])

    if result.get("created_at") is not None:
        created = result["created_at"]
        if hasattr(created, "replace") and hasattr(created, "isoformat"):
            result["created_at"] = created.replace(tzinfo=timezone.utc).isoformat()
        elif isinstance(created, str) and not created.endswith("Z") and "+" not in created:
            result["created_at"] = f"{created}+00:00"

    return result


@app.post("/api/orders")
def create_order(request: OrderRequest):
    raise HTTPException(
        status_code=status.HTTP_410_GONE,
        detail=(
            "Demo offers cannot create orders. To create a real order, submit and accept "
            "a buyer offer on a MySQL-backed produce listing."
        ),
    )


@app.get("/api/orders")
def list_orders(
    limit: int = 50,
    offset: int = 0,
    current_user: dict = Depends(require_role(["FARMER", "BUYER", "ADMIN"])),
):
    if limit < 1 or limit > 100:
        raise HTTPException(status_code=400, detail="limit must be between 1 and 100")
    if offset < 0:
        raise HTTPException(status_code=400, detail="offset must be greater than or equal to 0")

    connection = None
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            filters = ""
            params = []
            if current_user["role"] == "FARMER":
                filters = " WHERE farmer_id = %s"
                params.append(current_user["user_id"])
            elif current_user["role"] == "BUYER":
                filters = " WHERE buyer_id = %s"
                params.append(current_user["user_id"])

            cursor.execute(f"SELECT COUNT(*) AS total FROM orders{filters}", tuple(params))
            count_row = cursor.fetchone()
            total = count_row["total"] if count_row else 0

            cursor.execute(
                """
                SELECT order_id, buyer_id, buyer_name, crop, quantity_kg,
                       location, price_per_kg, gross_amount, transport_cost,
                       net_proceeds, currency, offer_type, status, payment_status,
                       created_at, paypal_order_id, paypal_capture_id
                FROM orders
                """
                + filters
                + """
                ORDER BY created_at DESC
                LIMIT %s OFFSET %s
                """,
                (*params, limit, offset),
            )
            raw_orders = cursor.fetchall() or []

        orders = [normalize_order(row) for row in raw_orders]
        return {
            "success": True,
            "orders": orders,
            "total": total,
            "limit": limit,
            "offset": offset,
        }
    except Exception:
        logger.exception("list_orders: database error")
        raise HTTPException(
            status_code=500,
            detail="Could not retrieve orders. Please try again.",
        )
    finally:
        if connection is not None:
            connection.close()


@app.get("/api/orders/{order_id}")
def get_order(
    order_id: str,
    current_user: dict = Depends(require_role(["FARMER", "BUYER", "ADMIN"])),
):
    connection = None
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            query = """
                SELECT order_id, buyer_id, buyer_name, crop, quantity_kg,
                       location, price_per_kg, gross_amount, transport_cost,
                       net_proceeds, currency, offer_type, status, payment_status,
                       created_at, paypal_order_id, paypal_capture_id
                FROM orders
                WHERE order_id = %s
            """
            params = [order_id]
            if current_user["role"] == "FARMER":
                query += " AND farmer_id = %s"
                params.append(current_user["user_id"])
            elif current_user["role"] == "BUYER":
                query += " AND buyer_id = %s"
                params.append(current_user["user_id"])
            cursor.execute(query, tuple(params))
            order = cursor.fetchone()

        if order is None:
            raise HTTPException(status_code=404, detail="Order not found.")

        return {"success": True, "order": normalize_order(order)}
    except HTTPException:
        raise
    except Exception:
        logger.exception("get_order: database error")
        raise HTTPException(
            status_code=500,
            detail="Could not retrieve order. Please try again.",
        )
    finally:
        if connection is not None:
            connection.close()
