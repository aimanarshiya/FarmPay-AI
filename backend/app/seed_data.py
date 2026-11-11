"""
FarmPay AI — Seed Demo Data Command
Creates sample demo accounts and listings for judges and testing.
Clearly demarcated as DEMO / illustrative data.

Usage:
    FARMPAY_ENABLE_DEMO_SEED=true \
    DEMO_FARMER_PASSWORD="<password>" \
    DEMO_BUYER_PASSWORD="<password>" \
    DEMO_ADMIN_PASSWORD="<password>" \
    python -m app.seed_data
"""

import os
from datetime import datetime, timezone
from app.database import get_connection
from app.auth import hash_password


DEMO_USERS_TEMPLATE = [
    {
        "user_id": "USR-FARM-DEMO01",
        "email": "farmer.ramesh@farmpay.demo",
        "role": "FARMER",
        "name": "Ramesh Patel (Demo Farmer)",
        "phone": "+91 98765 43210",
        "preferred_language": "te",
        "village_city": "Tenali",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "land_acres": 5.5,
        "primary_crop": "Rice",
    },
    {
        "user_id": "USR-BUY-DEMO01",
        "email": "buyer.guntur@farmpay.demo",
        "role": "BUYER",
        "name": "Suresh Reddy",
        "business_name": "Guntur Agri Mandi Traders (Demo Buyer)",
        "business_type": "Mandi Commission Agent",
        "phone": "+91 91234 56789",
        "preferred_language": "en",
        "city": "Guntur",
        "district": "Guntur",
        "state": "Andhra Pradesh",
    },
    {
        "user_id": "USR-BUY-DEMO02",
        "email": "buyer.krishna@farmpay.demo",
        "role": "BUYER",
        "name": "Venkatesh Rao",
        "business_name": "Krishna Organics Pvt Ltd (Demo Buyer)",
        "business_type": "Organic Wholesaler",
        "phone": "+91 92345 67890",
        "preferred_language": "en",
        "city": "Vijayawada",
        "district": "Krishna",
        "state": "Andhra Pradesh",
    },
    {
        "user_id": "BUYER003",
        "email": "buyer.coastal@farmpay.demo",
        "role": "BUYER",
        "name": "Coastal Grain Representative",
        "business_name": "Coastal Grain Corp (Demo Buyer)",
        "business_type": "Commercial Grain Miller",
        "phone": "+91 93456 78901",
        "preferred_language": "en",
        "city": "Machilipatnam",
        "district": "Krishna",
        "state": "Andhra Pradesh",
    },
    {
        "user_id": "USR-ADMIN-DEMO01",
        "email": "admin@farmpay.demo",
        "role": "ADMIN",
        "name": "FarmPay System Administrator (Demo Admin)",
        "phone": "+91 99999 00000",
        "preferred_language": "en",
    },
]

DEMO_LISTINGS = [
    {
        "listing_id": "LST-DEMO-RICE01",
        "farmer_id": "USR-FARM-DEMO01",
        "farmer_name": "Ramesh Patel (Demo Farmer)",
        "crop": "Rice",
        "quantity_kg": 500.0,
        "expected_price_per_kg": 25.0,
        "location": "Tenali, Guntur",
        "village": "Tenali",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "status": "ACTIVE",
    },
    {
        "listing_id": "LST-DEMO-CHILLI01",
        "farmer_id": "USR-FARM-DEMO01",
        "farmer_name": "Ramesh Patel (Demo Farmer)",
        "crop": "Red Chilli",
        "quantity_kg": 200.0,
        "expected_price_per_kg": 180.0,
        "location": "Guntur Mandi Area",
        "village": "Prathipadu",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "status": "ACTIVE",
    },
]

DEMO_OFFERS = [
    {
        "offer_id": "OFF-DEMO-RICE-01",
        "listing_id": "LST-DEMO-RICE01",
        "buyer_id": "USR-BUY-DEMO01",
        "buyer_name": "Guntur Agri Mandi Traders (Demo Buyer)",
        "price_per_kg": 26.0,
        "offered_quantity_kg": 500.0,
        "transport_cost": 200.0,
        "gross_amount": 13000.0,
        "net_proceeds": 12800.0,
        "notes": "Farm-gate pickup in Tenali. Cash on delivery + digital settlement.",
        "status": "PENDING",
    },
    {
        "offer_id": "OFF-DEMO-RICE-02",
        "listing_id": "LST-DEMO-RICE01",
        "buyer_id": "USR-BUY-DEMO02",
        "buyer_name": "Krishna Organics Pvt Ltd (Demo Buyer)",
        "price_per_kg": 25.5,
        "offered_quantity_kg": 500.0,
        "transport_cost": 0.0,
        "gross_amount": 12750.0,
        "net_proceeds": 12750.0,
        "notes": "Free buyer-arranged transportation. Certified organic handling.",
        "status": "PENDING",
    },
    {
        "offer_id": "OFF-DEMO-RICE-03",
        "listing_id": "LST-DEMO-RICE01",
        "buyer_id": "BUYER003",
        "buyer_name": "Coastal Grain Corp (Demo Buyer)",
        "price_per_kg": 24.0,
        "offered_quantity_kg": 500.0,
        "transport_cost": 50.0,
        "gross_amount": 12000.0,
        "net_proceeds": 11950.0,
        "notes": "Immediate pickup, local warehouse delivery.",
        "status": "PENDING",
    },
]


def _get_demo_password(role: str) -> str:
    env_var = f"DEMO_{role.upper()}_PASSWORD"
    password = os.getenv(env_var)
    if not password:
        raise ValueError(
            f"Explicit password required via '{env_var}' environment variable. "
            f"Please set DEMO_FARMER_PASSWORD, DEMO_BUYER_PASSWORD, and DEMO_ADMIN_PASSWORD before seeding."
        )
    return password


def seed_database():
    opt_in = os.getenv("FARMPAY_ENABLE_DEMO_SEED", "").strip().lower()
    if opt_in != "true":
        print(
            "Demo seeding blocked: FARMPAY_ENABLE_DEMO_SEED is not set to 'true'.\n"
            "To seed demo accounts, explicitly set FARMPAY_ENABLE_DEMO_SEED=true and provide passwords via "
            "DEMO_FARMER_PASSWORD, DEMO_BUYER_PASSWORD, and DEMO_ADMIN_PASSWORD."
        )
        return

    connection = get_connection()
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    print("Seeding FarmPay AI database with demo accounts, listings & competing offers...")

    try:
        with connection.cursor() as cursor:
            for u in DEMO_USERS_TEMPLATE:
                raw_password = _get_demo_password(u["role"])
                pwd_hash, salt = hash_password(raw_password)
                cursor.execute(
                    """
                    INSERT INTO users (user_id, email, phone, password_hash, salt, role, name, preferred_language, is_active, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, TRUE, %s)
                    ON DUPLICATE KEY UPDATE name=VALUES(name), phone=VALUES(phone), preferred_language=VALUES(preferred_language)
                    """,
                    (u["user_id"], u["email"], u["phone"], pwd_hash, salt, u["role"], u["name"], u["preferred_language"], now),
                )

                if u["role"] == "FARMER":
                    cursor.execute(
                        """
                        INSERT INTO farmer_profiles (user_id, village_city, district, state, land_acres, primary_crop, created_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                        ON DUPLICATE KEY UPDATE village_city=VALUES(village_city), district=VALUES(district)
                        """,
                        (u["user_id"], u["village_city"], u["district"], u["state"], u.get("land_acres"), u.get("primary_crop"), now),
                    )
                elif u["role"] == "BUYER":
                    cursor.execute(
                        """
                        INSERT INTO buyer_profiles (user_id, business_name, business_type, city, district, state, verified, created_at)
                        VALUES (%s, %s, %s, %s, %s, %s, FALSE, %s)
                        ON DUPLICATE KEY UPDATE business_name=VALUES(business_name), business_type=VALUES(business_type)
                        """,
                        (u["user_id"], u["business_name"], u["business_type"], u["city"], u["district"], u["state"], now),
                    )

            for lst in DEMO_LISTINGS:
                cursor.execute(
                    """
                    INSERT INTO produce_listings (
                        listing_id, farmer_id, farmer_name, crop, quantity_kg,
                        expected_price_per_kg, location, village, district, state,
                        status, created_at
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE quantity_kg=VALUES(quantity_kg), expected_price_per_kg=VALUES(expected_price_per_kg)
                    """,
                    (
                        lst["listing_id"], lst["farmer_id"], lst["farmer_name"], lst["crop"],
                        lst["quantity_kg"], lst["expected_price_per_kg"], lst["location"],
                        lst["village"], lst["district"], lst["state"], lst["status"], now,
                    ),
                )

            for off in DEMO_OFFERS:
                cursor.execute(
                    """
                    INSERT INTO buyer_offers (
                        offer_id, listing_id, buyer_id, buyer_name, price_per_kg,
                        offered_quantity_kg, transport_cost, gross_amount, net_proceeds,
                        notes, status, created_at
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE
                        price_per_kg=VALUES(price_per_kg),
                        transport_cost=VALUES(transport_cost),
                        gross_amount=VALUES(gross_amount),
                        net_proceeds=VALUES(net_proceeds),
                        notes=VALUES(notes),
                        status=VALUES(status)
                    """,
                    (
                        off["offer_id"], off["listing_id"], off["buyer_id"], off["buyer_name"],
                        off["price_per_kg"], off["offered_quantity_kg"], off["transport_cost"],
                        off["gross_amount"], off["net_proceeds"], off["notes"], off["status"], now,
                    ),
                )

        connection.commit()
        print("Demo seeding completed successfully.")
        print("Seeded demo accounts:")
        print("-----------------------------------------------------------------")
        for u in DEMO_USERS_TEMPLATE:
            print(f"- {u['role']:<7}: {u['email']} ({u['name']})")
        print("-----------------------------------------------------------------")
        print("Note: Passwords were set securely from local environment variables and are never printed.")
    except Exception as ex:
        connection.rollback()
        print(f"Seeding error: {ex}")
    finally:
        connection.close()


if __name__ == "__main__":
    seed_database()
