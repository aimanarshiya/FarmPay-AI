import logging

from fastapi import APIRouter, HTTPException, Depends
from app.database import get_connection
from app.auth import require_role

router = APIRouter(prefix="/api/admin", tags=["Administrator Dashboard"])
logger = logging.getLogger(__name__)


@router.get("/metrics")
def get_marketplace_metrics(
    current_user: dict = Depends(require_role(["ADMIN"])),
):
    """Provides high-level marketplace activity, transaction volume, and user metrics for judges and admins."""
    connection = None
    try:
        connection = get_connection()
        metrics = {
            "users": {"total": 0, "farmers": 0, "buyers": 0, "admins": 0},
            "listings": {"total": 0, "active": 0, "order_created": 0},
            "offers": {"total": 0, "pending": 0, "accepted": 0, "rejected": 0},
            "orders": {
                "total": 0,
                "total_gross_inr": 0.0,
                "total_net_inr": 0.0,
                "paypal_sandbox_captured": 0,
            },
        }

        with connection.cursor() as cursor:
            # Users
            cursor.execute("SELECT role, COUNT(*) as cnt FROM users GROUP BY role")
            for row in cursor.fetchall() or []:
                role = row["role"]
                cnt = row["cnt"]
                metrics["users"]["total"] += cnt
                if role == "FARMER":
                    metrics["users"]["farmers"] = cnt
                elif role == "BUYER":
                    metrics["users"]["buyers"] = cnt
                elif role == "ADMIN":
                    metrics["users"]["admins"] = cnt

            # Listings
            cursor.execute("SELECT status, COUNT(*) as cnt FROM produce_listings GROUP BY status")
            for row in cursor.fetchall() or []:
                st = row["status"]
                cnt = row["cnt"]
                metrics["listings"]["total"] += cnt
                if st == "ACTIVE":
                    metrics["listings"]["active"] = cnt
                elif st == "ORDER_CREATED":
                    metrics["listings"]["order_created"] = cnt

            # Offers
            cursor.execute("SELECT status, COUNT(*) as cnt FROM buyer_offers GROUP BY status")
            for row in cursor.fetchall() or []:
                st = row["status"]
                cnt = row["cnt"]
                metrics["offers"]["total"] += cnt
                if st == "PENDING":
                    metrics["offers"]["pending"] = cnt
                elif st == "ACCEPTED":
                    metrics["offers"]["accepted"] = cnt
                elif st == "REJECTED":
                    metrics["offers"]["rejected"] = cnt

            # Orders & PayPal captures
            cursor.execute(
                """
                SELECT COUNT(*) as total_orders,
                       COALESCE(SUM(gross_amount), 0) as total_gross,
                       COALESCE(SUM(net_proceeds), 0) as total_net,
                       COUNT(paypal_capture_id) as captured_count
                FROM orders
                """
            )
            order_stats = cursor.fetchone()
            if order_stats:
                metrics["orders"]["total"] = order_stats["total_orders"]
                metrics["orders"]["total_gross_inr"] = float(order_stats["total_gross"])
                metrics["orders"]["total_net_inr"] = float(order_stats["total_net"])
                metrics["orders"]["paypal_sandbox_captured"] = order_stats["captured_count"]

        return {"success": True, "metrics": metrics}
    except Exception as exc:
        logger.exception("Could not retrieve admin metrics")
        raise HTTPException(
            status_code=503,
            detail="Administrative metrics are temporarily unavailable.",
        ) from exc
    finally:
        if connection is not None:
            connection.close()


@router.get("/users")
def get_admin_users(
    current_user: dict = Depends(require_role(["ADMIN"])),
):
    """Retrieves all registered farmers, buyers, and admins for administration monitoring."""
    connection = None
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT u.user_id, u.email, u.name, u.role, u.preferred_language, u.is_active, u.created_at,
                       f.village_city, f.district, f.primary_crop,
                       b.business_name, b.business_type, b.verified
                FROM users u
                LEFT JOIN farmer_profiles f ON u.user_id = f.user_id
                LEFT JOIN buyer_profiles b ON u.user_id = b.user_id
                ORDER BY u.created_at DESC
                """
            )
            rows = cursor.fetchall() or []

        users = []
        for r in rows:
            u = dict(r)
            if u.get("created_at") and hasattr(u["created_at"], "isoformat"):
                u["created_at"] = u["created_at"].isoformat() + "Z"
            elif u.get("created_at"):
                u["created_at"] = str(u["created_at"])
            users.append(u)

        return {"success": True, "users": users}
    except Exception as exc:
        logger.exception("Could not retrieve administrative user list")
        raise HTTPException(
            status_code=503,
            detail="Administrative user data is temporarily unavailable.",
        ) from exc
    finally:
        if connection is not None:
            connection.close()


@router.get("/ai-activity")
def get_admin_ai_activity(
    current_user: dict = Depends(require_role(["ADMIN"])),
):
    """Retrieves recent AI recommendations generated across listings with audit metadata."""
    connection = None
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT a.*, l.crop, l.farmer_name
                FROM ai_recommendations a
                LEFT JOIN produce_listings l ON a.listing_id = l.listing_id
                ORDER BY a.created_at DESC
                LIMIT 50
                """
            )
            rows = cursor.fetchall() or []

        records = []
        for r in rows:
            item = dict(r)
            if item.get("created_at") and hasattr(item["created_at"], "isoformat"):
                item["created_at"] = item["created_at"].isoformat() + "Z"
            records.append(item)

        return {"success": True, "activity": records}
    except Exception as exc:
        logger.exception("Could not retrieve administrative AI activity")
        raise HTTPException(
            status_code=503,
            detail="AI activity data is temporarily unavailable.",
        ) from exc
    finally:
        if connection is not None:
            connection.close()
