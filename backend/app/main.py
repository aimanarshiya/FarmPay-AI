from app.payments import router as paypal_router
from uuid import uuid4
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.database import get_connection


app = FastAPI(title="FarmPay AI API")
app.include_router(paypal_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# EXISTING ENDPOINTS
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
# FARMER REQUEST
# --------------------------------------------------

class FarmerRequest(BaseModel):
    crop: str = Field(min_length=2, max_length=50)
    quantity_kg: float = Field(gt=0, le=100000)
    location: str = Field(min_length=2, max_length=100)


# --------------------------------------------------
# DEMO BUYERS
# --------------------------------------------------

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
# BUYER OFFER ENGINE
# --------------------------------------------------

@app.post("/api/offers")
def get_buyer_offers(request: FarmerRequest):

    crop = request.crop.strip().title()
    location = request.location.strip()
    quantity = request.quantity_kg

    offers = []

    for buyer in DEMO_BUYERS:

        gross_amount = round(
            quantity * buyer["price_per_kg"],
            2,
        )

        transport_cost = round(
            buyer["transport_cost"],
            2,
        )

        net_proceeds = round(
            gross_amount - transport_cost,
            2,
        )

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

    offers.sort(
        key=lambda offer: offer["net_proceeds"],
        reverse=True,
    )

    return {
        "success": True,
        "message": "Demo buyer offers generated successfully",
        "data_type": "DEMO",
        "disclaimer": (
            "Illustrative buyer offers only. "
            "Prices and transport costs are not live market data."
        ),
        "farmer_request": {
            "crop": crop,
            "quantity_kg": quantity,
            "location": location,
        },
        "offers": offers,
    }


# --------------------------------------------------
# ORDER REQUEST
# --------------------------------------------------

class OrderRequest(BaseModel):
    crop: str = Field(min_length=2, max_length=50)
    quantity_kg: float = Field(gt=0, le=100000)
    location: str = Field(min_length=2, max_length=100)
    buyer_id: str


# --------------------------------------------------
# CREATE ORDER - MYSQL PERSISTENCE
# --------------------------------------------------

@app.post("/api/orders")
def create_order(request: OrderRequest):

    crop = request.crop.strip().title()
    location = request.location.strip()

    buyer = next(
        (
            buyer
            for buyer in DEMO_BUYERS
            if buyer["buyer_id"] == request.buyer_id
        ),
        None,
    )

    if buyer is None:
        raise HTTPException(
            status_code=404,
            detail="Buyer offer not found.",
        )

    quantity = request.quantity_kg

    # Backend recalculates all monetary values.
    gross_amount = round(
        quantity * buyer["price_per_kg"],
        2,
    )

    transport_cost = round(
        buyer["transport_cost"],
        2,
    )

    net_proceeds = round(
        gross_amount - transport_cost,
        2,
    )

    order_id = f"FP-{uuid4().hex[:12].upper()}"

    created_at = datetime.now(timezone.utc)

    # MySQL DATETIME does not store timezone information.
    # Store the UTC timestamp as a naive datetime.
    db_created_at = created_at.replace(tzinfo=None)

    order = {
        "order_id": order_id,
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
        "status": "PENDING_PAYMENT",
        "payment_status": "NOT_PAID",
        "created_at": created_at.isoformat(),
    }

    connection = None

    try:

        connection = get_connection()

        with connection.cursor() as cursor:

            cursor.execute(
                """
                INSERT INTO orders (
                    order_id,
                    buyer_id,
                    buyer_name,
                    crop,
                    quantity_kg,
                    location,
                    price_per_kg,
                    gross_amount,
                    transport_cost,
                    net_proceeds,
                    currency,
                    offer_type,
                    status,
                    payment_status,
                    created_at
                )
                VALUES (
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s
                )
                """,
                (
                    order["order_id"],
                    order["buyer_id"],
                    order["buyer_name"],
                    order["crop"],
                    order["quantity_kg"],
                    order["location"],
                    order["price_per_kg"],
                    order["gross_amount"],
                    order["transport_cost"],
                    order["net_proceeds"],
                    order["currency"],
                    order["offer_type"],
                    order["status"],
                    order["payment_status"],
                    db_created_at,
                ),
            )

        connection.commit()

    except Exception:

        if connection is not None:
            connection.rollback()

        raise HTTPException(
            status_code=500,
            detail="Could not save order. Please try again.",
        )

    finally:

        if connection is not None:
            connection.close()

    return {
        "success": True,
        "message": "Order created successfully.",
        "order": order,
    }


# --------------------------------------------------
# GET ORDER - MYSQL PERSISTENCE
# --------------------------------------------------

@app.get("/api/orders/{order_id}")
def get_order(order_id: str):

    connection = None

    try:

        connection = get_connection()

        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    order_id,
                    buyer_id,
                    buyer_name,
                    crop,
                    quantity_kg,
                    location,
                    price_per_kg,
                    gross_amount,
                    transport_cost,
                    net_proceeds,
                    currency,
                    offer_type,
                    status,
                    payment_status,
                    created_at
                FROM orders
                WHERE order_id = %s
                """,
                (order_id,),
            )

            order = cursor.fetchone()

    except Exception:

        raise HTTPException(
            status_code=500,
            detail="Could not retrieve order. Please try again.",
        )

    finally:

        if connection is not None:
            connection.close()

    if order is None:

        raise HTTPException(
            status_code=404,
            detail="Order not found.",
        )

    # Convert MySQL Decimal values to JSON-friendly numbers.
    numeric_fields = [
        "quantity_kg",
        "price_per_kg",
        "gross_amount",
        "transport_cost",
        "net_proceeds",
    ]

    for field in numeric_fields:

        if order[field] is not None:
            order[field] = float(order[field])

    # MySQL DATETIME is returned without timezone information.
    # Our stored timestamps are UTC.
    if order["created_at"] is not None:

        order["created_at"] = (
            order["created_at"]
            .replace(tzinfo=timezone.utc)
            .isoformat()
        )

    return {
        "success": True,
        "order": order,
    }
