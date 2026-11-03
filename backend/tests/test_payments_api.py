"""
Unit and integration tests for FarmPay AI PayPal Sandbox payments flow.
Uses mocked PayPal API responses to ensure zero external calls.
"""

import unittest
from unittest.mock import MagicMock, patch
from decimal import Decimal
from datetime import datetime

from fastapi import HTTPException

from app.payments import (
    create_payment,
    capture_payment,
    validate_paypal_order,
    SANDBOX_TEST_AMOUNT,
    SANDBOX_TEST_CURRENCY,
)


class TestPaymentsAPI(unittest.TestCase):

    def setUp(self):
        self.sample_order = {
            "order_id": "FP-TESTORDER001",
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

    # ----------------------------------------------------------------------
    # Create Payment Tests
    # ----------------------------------------------------------------------

    @patch("app.payments.get_connection")
    def test_create_payment_order_not_found(self, mock_get_conn):
        """Creating checkout for non-existent order raises 404."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.fetchone.return_value = None
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn

        with self.assertRaises(HTTPException) as ctx:
            create_payment("FP-UNKNOWN")
        self.assertEqual(ctx.exception.status_code, 404)

    @patch("app.payments.get_connection")
    def test_create_payment_already_paid(self, mock_get_conn):
        """Creating checkout for already PAID order raises 409 Conflict."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        paid_order = dict(self.sample_order)
        paid_order["payment_status"] = "PAID"
        mock_cursor.fetchone.return_value = paid_order
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn

        with self.assertRaises(HTTPException) as ctx:
            create_payment("FP-TESTORDER001")
        self.assertEqual(ctx.exception.status_code, 409)

    @patch("app.payments.create_paypal_order")
    @patch("app.payments.get_connection")
    def test_create_payment_success(self, mock_get_conn, mock_paypal_create):
        """Verify checkout creation, approval URL, and PayPal order ID persistence."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        # 1st fetchone: SELECT FOR UPDATE
        # 2nd fetchone: SELECT verification
        mock_cursor.fetchone.side_effect = [
            self.sample_order,
            {
                "payment_status": "NOT_PAID",
                "paypal_order_id": "PP-ORDER-XYZ123",
            },
        ]
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn

        mock_paypal_create.return_value = {
            "id": "PP-ORDER-XYZ123",
            "status": "CREATED",
            "links": [
                {
                    "href": "https://www.sandbox.paypal.com/checkoutnow?token=PP-ORDER-XYZ123",
                    "rel": "approve",
                }
            ],
        }

        result = create_payment("FP-TESTORDER001")
        self.assertTrue(result["success"])
        self.assertEqual(result["order_id"], "FP-TESTORDER001")
        self.assertEqual(result["paypal_order_id"], "PP-ORDER-XYZ123")
        self.assertEqual(
            result["approval_url"],
            "https://www.sandbox.paypal.com/checkoutnow?token=PP-ORDER-XYZ123",
        )
        self.assertEqual(result["amount"], 1.0)
        self.assertEqual(result["currency"], "USD")
        self.assertTrue(result["test_mode"])

        # Verify UPDATE was called and transaction committed
        mock_conn.commit.assert_called_once()
        mock_conn.close.assert_called_once()

    # ----------------------------------------------------------------------
    # Validation Guard Tests
    # ----------------------------------------------------------------------

    def test_validate_paypal_order_id_mismatch(self):
        """validate_paypal_order raises 400 if custom_id does not match FarmPay order."""
        fake_paypal_payload = {
            "id": "PP-123",
            "purchase_units": [
                {
                    "reference_id": "FP-WRONGORDER",
                    "custom_id": "FP-WRONGORDER",
                    "amount": {"value": "1.00", "currency_code": "USD"},
                }
            ],
        }
        with self.assertRaises(HTTPException) as ctx:
            validate_paypal_order(fake_paypal_payload, "FP-RIGHTORDER")
        self.assertEqual(ctx.exception.status_code, 400)

    def test_validate_paypal_order_amount_mismatch(self):
        """validate_paypal_order raises 400 if test amount is not $1.00 USD."""
        fake_paypal_payload = {
            "id": "PP-123",
            "purchase_units": [
                {
                    "reference_id": "FP-RIGHTORDER",
                    "custom_id": "FP-RIGHTORDER",
                    "amount": {"value": "50.00", "currency_code": "USD"},
                }
            ],
        }
        with self.assertRaises(HTTPException) as ctx:
            validate_paypal_order(fake_paypal_payload, "FP-RIGHTORDER")
        self.assertEqual(ctx.exception.status_code, 400)

    # ----------------------------------------------------------------------
    # Capture Payment Tests
    # ----------------------------------------------------------------------

    @patch("app.payments.get_paypal_order_details")
    @patch("app.payments.capture_paypal_order")
    @patch("app.payments.get_connection")
    def test_capture_payment_success_and_preserves_not_paid(
        self,
        mock_get_conn,
        mock_capture_api,
        mock_details_api,
    ):
        """
        CRITICAL TEST:
        Validates that capturing an approved PayPal Sandbox test checkout:
        1. Records the paypal_capture_id.
        2. Leaves payment_status as 'NOT_PAID' on the INR order.
        """
        mock_conn = MagicMock()
        mock_cursor = MagicMock()

        order_with_paypal_id = dict(self.sample_order)
        order_with_paypal_id["paypal_order_id"] = "PP-ORDER-XYZ123"

        updated_order_after_capture = dict(order_with_paypal_id)
        updated_order_after_capture["paypal_capture_id"] = "CAP-999888777"
        updated_order_after_capture["payment_status"] = "NOT_PAID"  # MUST REMAIN NOT_PAID

        # 1st fetchone: initial SELECT FOR UPDATE
        # 2nd fetchone: post-capture SELECT
        mock_cursor.fetchone.side_effect = [
            order_with_paypal_id,
            updated_order_after_capture,
        ]
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn

        # Mock order lookup from PayPal
        mock_details_api.return_value = {
            "id": "PP-ORDER-XYZ123",
            "status": "APPROVED",
            "purchase_units": [
                {
                    "reference_id": "FP-TESTORDER001",
                    "custom_id": "FP-TESTORDER001",
                    "amount": {"value": "1.00", "currency_code": "USD"},
                }
            ],
        }

        # Mock PayPal capture response
        mock_capture_api.return_value = {
            "id": "PP-ORDER-XYZ123",
            "status": "COMPLETED",
            "purchase_units": [
                {
                    "reference_id": "FP-TESTORDER001",
                    "custom_id": "FP-TESTORDER001",
                    "amount": {"value": "1.00", "currency_code": "USD"},
                    "payments": {
                        "captures": [
                            {
                                "id": "CAP-999888777",
                                "status": "COMPLETED",
                                "amount": {"value": "1.00", "currency_code": "USD"},
                            }
                        ]
                    },
                }
            ],
        }

        result = capture_payment("FP-TESTORDER001")
        self.assertTrue(result["success"])
        self.assertTrue(result["sandbox_test_payment"])
        self.assertEqual(result["capture_id"], "CAP-999888777")
        self.assertEqual(result["test_amount"], 1.0)
        self.assertEqual(result["test_currency"], "USD")

        # Crucial assertion: the INR order payment_status remains NOT_PAID
        self.assertEqual(result["farm_pay_order_payment_status"], "NOT_PAID")
        self.assertEqual(result["order"]["payment_status"], "NOT_PAID")
        self.assertIn("remains unpaid", result["message"])

        mock_conn.commit.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch("app.payments.get_paypal_order_details")
    @patch("app.payments.get_connection")
    def test_capture_payment_idempotent_when_already_completed(
        self,
        mock_get_conn,
        mock_details_api,
    ):
        """
        If PayPal status is already COMPLETED (e.g. callback retry or browser refresh),
        capture endpoint reuses existing details rather than attempting double capture.
        """
        mock_conn = MagicMock()
        mock_cursor = MagicMock()

        order_with_paypal = dict(self.sample_order)
        order_with_paypal["paypal_order_id"] = "PP-ORDER-XYZ123"

        post_update_order = dict(order_with_paypal)
        post_update_order["paypal_capture_id"] = "CAP-EXISTING123"
        post_update_order["payment_status"] = "NOT_PAID"

        mock_cursor.fetchone.side_effect = [
            order_with_paypal,
            post_update_order,
        ]
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn

        mock_details_api.return_value = {
            "id": "PP-ORDER-XYZ123",
            "status": "COMPLETED",
            "purchase_units": [
                {
                    "reference_id": "FP-TESTORDER001",
                    "custom_id": "FP-TESTORDER001",
                    "amount": {"value": "1.00", "currency_code": "USD"},
                    "payments": {
                        "captures": [
                            {
                                "id": "CAP-EXISTING123",
                                "status": "COMPLETED",
                                "amount": {"value": "1.00", "currency_code": "USD"},
                            }
                        ]
                    },
                }
            ],
        }

        # Should NOT raise error and should return existing capture ID
        result = capture_payment("FP-TESTORDER001")
        self.assertTrue(result["success"])
        self.assertEqual(result["capture_id"], "CAP-EXISTING123")
        self.assertEqual(result["farm_pay_order_payment_status"], "NOT_PAID")


if __name__ == "__main__":
    unittest.main()
