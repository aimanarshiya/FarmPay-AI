"""
Unit and integration tests for FarmPay AI Orders API and Offer Engine.
"""

import unittest
from unittest.mock import MagicMock, patch
from datetime import datetime, timezone
from decimal import Decimal

from fastapi import HTTPException
from pydantic import ValidationError

from app.main import (
    home,
    health_check,
    get_message,
    get_buyer_offers,
    create_order,
    get_order,
    list_orders,
    FarmerRequest,
    OrderRequest,
    normalize_order,
)


class TestOrdersAPI(unittest.TestCase):

    def test_home_and_health(self):
        """Verify baseline health check and home response."""
        self.assertEqual(home(), {"message": "Welcome to FarmPay AI"})
        self.assertEqual(health_check(), {"status": "healthy"})
        msg = get_message()
        self.assertIn("message", msg)
        self.assertIn("backend", msg)

    def test_farmer_request_validation(self):
        """Ensure input constraints on FarmerRequest."""
        # Valid
        req = FarmerRequest(crop="Rice", quantity_kg=100.0, location="Guntur")
        self.assertEqual(req.crop, "Rice")
        self.assertEqual(req.quantity_kg, 100.0)

        # Invalid: crop too short
        with self.assertRaises(ValidationError):
            FarmerRequest(crop="R", quantity_kg=100.0, location="Guntur")

        # Invalid: quantity <= 0
        with self.assertRaises(ValidationError):
            FarmerRequest(crop="Rice", quantity_kg=0.0, location="Guntur")

        # Invalid: location too short
        with self.assertRaises(ValidationError):
            FarmerRequest(crop="Rice", quantity_kg=100.0, location="A")

    def test_get_buyer_offers_calculation_and_sorting(self):
        """Test gross, transport, net calculations and desc sorting."""
        req = FarmerRequest(crop="Wheat", quantity_kg=500.0, location="Punjab")
        result = get_buyer_offers(req)

        self.assertTrue(result["success"])
        self.assertEqual(len(result["offers"]), 3)

        # Verify net proceeds math for each offer
        for offer in result["offers"]:
            expected_gross = round(500.0 * offer["price_per_kg"], 2)
            expected_net = round(expected_gross - offer["transport_cost"], 2)
            self.assertEqual(offer["gross_amount"], expected_gross)
            self.assertEqual(offer["net_proceeds"], expected_net)
            self.assertEqual(offer["crop"], "Wheat")
            self.assertEqual(offer["offer_type"], "DEMO")

        # Verify descending order by net proceeds
        offers = result["offers"]
        self.assertGreaterEqual(offers[0]["net_proceeds"], offers[1]["net_proceeds"])
        self.assertGreaterEqual(offers[1]["net_proceeds"], offers[2]["net_proceeds"])

    @patch("app.main.get_connection")
    def test_create_order_success(self, mock_get_conn):
        """Verify order creation, ID generation, and database insert."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn

        req = OrderRequest(
            crop="Rice",
            quantity_kg=250.0,
            location="Guntur",
            buyer_id="BUYER001",
        )

        res = create_order(req)
        self.assertTrue(res["success"])
        order = res["order"]

        self.assertTrue(order["order_id"].startswith("FP-"))
        self.assertEqual(order["crop"], "Rice")
        self.assertEqual(order["buyer_id"], "BUYER001")
        self.assertEqual(order["buyer_name"], "Demo Buyer A")
        self.assertEqual(order["status"], "PENDING_PAYMENT")
        self.assertEqual(order["payment_status"], "NOT_PAID")

        # Recalculated values check
        self.assertEqual(order["gross_amount"], 250.0 * 25.0)  # 6250.0
        self.assertEqual(order["transport_cost"], 300.0)
        self.assertEqual(order["net_proceeds"], 5950.0)

        # Check SQL execution
        mock_cursor.execute.assert_called_once()
        mock_conn.commit.assert_called_once()
        mock_conn.close.assert_called_once()

    def test_create_order_invalid_buyer(self):
        """Attempting to order with non-existent buyer raises 404."""
        req = OrderRequest(
            crop="Rice",
            quantity_kg=100.0,
            location="Guntur",
            buyer_id="NON_EXISTENT_BUYER",
        )
        with self.assertRaises(HTTPException) as ctx:
            create_order(req)
        self.assertEqual(ctx.exception.status_code, 404)

    @patch("app.main.get_connection")
    def test_get_order_found(self, mock_get_conn):
        """Verify single order retrieval and decimal normalization."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.fetchone.return_value = {
            "order_id": "FP-1234567890AB",
            "buyer_id": "BUYER001",
            "buyer_name": "Demo Buyer A",
            "crop": "Rice",
            "quantity_kg": Decimal("500.00"),
            "location": "Guntur",
            "price_per_kg": Decimal("25.00"),
            "gross_amount": Decimal("12500.00"),
            "transport_cost": Decimal("300.00"),
            "net_proceeds": Decimal("12200.00"),
            "currency": "INR",
            "offer_type": "DEMO",
            "status": "PENDING_PAYMENT",
            "payment_status": "NOT_PAID",
            "created_at": datetime(2026, 11, 3, 10, 0, 0),
            "paypal_order_id": None,
            "paypal_capture_id": None,
        }
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn

        res = get_order("FP-1234567890AB")
        self.assertTrue(res["success"])
        order = res["order"]

        self.assertEqual(order["order_id"], "FP-1234567890AB")
        self.assertIsInstance(order["net_proceeds"], float)
        self.assertEqual(order["net_proceeds"], 12200.0)
        self.assertIn("2026-11-03", order["created_at"])

    @patch("app.main.get_connection")
    def test_get_order_not_found(self, mock_get_conn):
        """Requesting an unknown order_id raises 404."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.fetchone.return_value = None
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn

        with self.assertRaises(HTTPException) as ctx:
            get_order("FP-NOTFOUND0000")
        self.assertEqual(ctx.exception.status_code, 404)

    @patch("app.main.get_connection")
    def test_list_orders_pagination(self, mock_get_conn):
        """Verify list_orders returns paginated list with total."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.fetchone.return_value = {"total": 42}
        mock_cursor.fetchall.return_value = [
            {
                "order_id": f"FP-{i:012d}",
                "buyer_id": "BUYER001",
                "buyer_name": "Demo Buyer A",
                "crop": "Rice",
                "quantity_kg": Decimal("100.00"),
                "location": "Guntur",
                "price_per_kg": Decimal("25.00"),
                "gross_amount": Decimal("2500.00"),
                "transport_cost": Decimal("300.00"),
                "net_proceeds": Decimal("2200.00"),
                "currency": "INR",
                "offer_type": "DEMO",
                "status": "PENDING_PAYMENT",
                "payment_status": "NOT_PAID",
                "created_at": datetime(2026, 11, 3, 10, 0, 0),
                "paypal_order_id": None,
                "paypal_capture_id": None,
            }
            for i in range(5)
        ]
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn

        res = list_orders(limit=10, offset=0)
        self.assertTrue(res["success"])
        self.assertEqual(res["total"], 42)
        self.assertEqual(len(res["orders"]), 5)
        self.assertEqual(res["limit"], 10)
        self.assertEqual(res["offset"], 0)

    def test_list_orders_invalid_bounds(self):
        """Verify limit and offset boundary validation."""
        with self.assertRaises(HTTPException) as ctx:
            list_orders(limit=0)
        self.assertEqual(ctx.exception.status_code, 400)

        with self.assertRaises(HTTPException) as ctx:
            list_orders(limit=101)
        self.assertEqual(ctx.exception.status_code, 400)

        with self.assertRaises(HTTPException) as ctx:
            list_orders(offset=-1)
        self.assertEqual(ctx.exception.status_code, 400)


if __name__ == "__main__":
    unittest.main()

