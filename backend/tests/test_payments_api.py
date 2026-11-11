"""
Unit and integration tests for FarmPay AI PayPal Sandbox payments flow.
Uses mocked PayPal API responses to ensure zero external calls.

Test coverage:
  - Create payment: order-not-found, already-paid, success
  - validate_paypal_identity: custom_id mismatch, reference_id mismatch (non-
    placeholder), reference_id="default" accepted as placeholder, both absent,
    neither matches
  - validate_paypal_order: amount missing, amount/currency mismatch, success
  - capture_payment: success (APPROVED path, INR stays NOT_PAID), idempotent
    when COMPLETED, non-approved status, missing PayPal order ID, PayPal order
    ID mismatch on GET, bad capture amount, bad capture currency, no completed
    captures, missing capture ID, capture response ID mismatch
  - GET response with reference_id="default" (real Sandbox behaviour):
    capture must succeed using custom_id as anchor
"""

import unittest
from unittest.mock import MagicMock, patch
from decimal import Decimal
from datetime import datetime

from fastapi import HTTPException

from app.payments import (
    create_payment as _create_payment,
    capture_payment as _capture_payment,
    validate_paypal_identity,
    validate_paypal_order,
    SANDBOX_TEST_AMOUNT,
    SANDBOX_TEST_CURRENCY,
)

TEST_ADMIN = {"user_id": "ADMIN-TEST", "role": "ADMIN"}


def create_payment(order_id):
    return _create_payment(order_id, current_user=TEST_ADMIN)


def capture_payment(order_id):
    return _capture_payment(order_id, current_user=TEST_ADMIN)


# ---------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------

def _make_approved_get_response(
    paypal_order_id="PP-ORDER-XYZ123",
    farmpay_order_id="FP-TESTORDER001",
    *,
    reference_id_override=None,
    amount_value="1.00",
    include_amount=True,
):
    """
    Build a mock PayPal GET /v2/checkout/orders/{id} APPROVED response.

    reference_id defaults to "default" (the real Sandbox behaviour for
    single-purchase-unit orders as confirmed by the PayPal Orders v2 API
    documentation).
    """
    unit = {
        "reference_id": reference_id_override if reference_id_override is not None else "default",
        "custom_id": farmpay_order_id,
    }
    if include_amount:
        unit["amount"] = {"value": amount_value, "currency_code": "USD"}

    return {
        "id": paypal_order_id,
        "status": "APPROVED",
        "purchase_units": [unit],
    }


def _make_capture_response(
    paypal_order_id="PP-ORDER-XYZ123",
    farmpay_order_id="FP-TESTORDER001",
    capture_id="CAP-999888777",
    amount_value="1.00",
    currency_code="USD",
    capture_status="COMPLETED",
):
    """Build a mock PayPal POST /v2/checkout/orders/{id}/capture response."""
    return {
        "id": paypal_order_id,
        "status": "COMPLETED",
        "purchase_units": [
            {
                "reference_id": "default",
                "custom_id": farmpay_order_id,
                "amount": {"value": amount_value, "currency_code": currency_code},
                "payments": {
                    "captures": [
                        {
                            "id": capture_id,
                            "status": capture_status,
                            "amount": {"value": amount_value, "currency_code": currency_code},
                        }
                    ]
                },
            }
        ],
    }


def _make_db_order(
    paypal_order_id="PP-ORDER-XYZ123",
    paypal_capture_id=None,
    payment_status="NOT_PAID",
):
    return {
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
        "payment_status": payment_status,
        "created_at": datetime(2026, 11, 3, 10, 0, 0),
        "paypal_order_id": paypal_order_id,
        "paypal_capture_id": paypal_capture_id,
    }


def _mock_conn(fetchone_side_effects):
    """Return a fully-mocked MySQL connection with predictable fetchone values."""
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_cursor.fetchone.side_effect = fetchone_side_effects
    mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
    return mock_conn


# ===========================================================================
# Tests for validate_paypal_identity()
# ===========================================================================

class TestValidatePaypalIdentity(unittest.TestCase):

    def _payload(self, custom_id, reference_id, paypal_id="PP-123"):
        return {
            "id": paypal_id,
            "purchase_units": [
                {"custom_id": custom_id, "reference_id": reference_id,
                 "amount": {"value": "1.00", "currency_code": "USD"}}
            ],
        }

    # --- Passing cases -------------------------------------------------------

    def test_custom_id_matches_reference_id_is_default(self):
        """Real Sandbox GET response: reference_id='default', custom_id correct."""
        payload = self._payload("FP-RIGHTORDER", "default")
        unit = validate_paypal_identity(payload, "FP-RIGHTORDER")
        self.assertEqual(unit["custom_id"], "FP-RIGHTORDER")

    def test_both_identifiers_match(self):
        """Both custom_id and reference_id match (e.g. in capture responses)."""
        payload = self._payload("FP-RIGHTORDER", "FP-RIGHTORDER")
        unit = validate_paypal_identity(payload, "FP-RIGHTORDER")
        self.assertEqual(unit["custom_id"], "FP-RIGHTORDER")

    def test_reference_id_matches_custom_id_absent(self):
        """reference_id matches when custom_id is absent."""
        payload = {
            "id": "PP-123",
            "purchase_units": [
                {"reference_id": "FP-RIGHTORDER",
                 "amount": {"value": "1.00", "currency_code": "USD"}}
            ],
        }
        unit = validate_paypal_identity(payload, "FP-RIGHTORDER")
        self.assertEqual(unit["reference_id"], "FP-RIGHTORDER")

    # --- Failing cases -------------------------------------------------------

    def test_custom_id_mismatch_raises_400(self):
        """custom_id present and wrong → 400."""
        payload = self._payload("FP-WRONGORDER", "default")
        with self.assertRaises(HTTPException) as ctx:
            validate_paypal_identity(payload, "FP-RIGHTORDER")
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("custom_id mismatch", ctx.exception.detail["message"])

    def test_reference_id_mismatch_non_placeholder_raises_400(self):
        """reference_id is a real non-default value that does not match → 400."""
        payload = self._payload("FP-RIGHTORDER", "FP-WRONGORDER")
        with self.assertRaises(HTTPException) as ctx:
            validate_paypal_identity(payload, "FP-RIGHTORDER")
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("reference_id mismatch", ctx.exception.detail["message"])

    def test_both_identifiers_absent_raises_400(self):
        """Neither custom_id nor reference_id present → 400."""
        payload = {
            "id": "PP-123",
            "purchase_units": [
                {"amount": {"value": "1.00", "currency_code": "USD"}}
            ],
        }
        with self.assertRaises(HTTPException) as ctx:
            validate_paypal_identity(payload, "FP-RIGHTORDER")
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("Neither", ctx.exception.detail["message"])

    def test_reference_id_default_and_custom_id_absent_raises_400(self):
        """reference_id='default' (placeholder) and no custom_id → 400 (no positive match)."""
        payload = {
            "id": "PP-123",
            "purchase_units": [
                {"reference_id": "default",
                 "amount": {"value": "1.00", "currency_code": "USD"}}
            ],
        }
        with self.assertRaises(HTTPException) as ctx:
            validate_paypal_identity(payload, "FP-RIGHTORDER")
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("Neither", ctx.exception.detail["message"])

    def test_multiple_purchase_units_raises_400(self):
        """More than one purchase unit is rejected."""
        payload = {
            "id": "PP-123",
            "purchase_units": [
                {"custom_id": "FP-A", "reference_id": "FP-A"},
                {"custom_id": "FP-B", "reference_id": "FP-B"},
            ],
        }
        with self.assertRaises(HTTPException) as ctx:
            validate_paypal_identity(payload, "FP-A")
        self.assertEqual(ctx.exception.status_code, 400)


# ===========================================================================
# Tests for validate_paypal_order() — adds amount validation on top of identity
# ===========================================================================

class TestValidatePaypalOrder(unittest.TestCase):

    def _payload(self, custom_id, reference_id, amount_value, currency="USD"):
        return {
            "id": "PP-123",
            "purchase_units": [
                {
                    "custom_id": custom_id,
                    "reference_id": reference_id,
                    "amount": {"value": amount_value, "currency_code": currency},
                }
            ],
        }

    def test_correct_amount_and_identity_passes(self):
        """$1.00 USD with matching identifiers passes."""
        payload = self._payload("FP-RIGHTORDER", "default", "1.00")
        unit = validate_paypal_order(payload, "FP-RIGHTORDER")
        self.assertEqual(unit["custom_id"], "FP-RIGHTORDER")

    def test_identity_mismatch_raises_400(self):
        """Identity mismatch is caught before amount check."""
        payload = self._payload("FP-WRONGORDER", "default", "1.00")
        with self.assertRaises(HTTPException) as ctx:
            validate_paypal_order(payload, "FP-RIGHTORDER")
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("custom_id mismatch", ctx.exception.detail["message"])

    def test_wrong_amount_raises_400(self):
        """Amount other than $1.00 raises 400."""
        payload = self._payload("FP-RIGHTORDER", "default", "50.00")
        with self.assertRaises(HTTPException) as ctx:
            validate_paypal_order(payload, "FP-RIGHTORDER")
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("amount/currency mismatch", ctx.exception.detail["message"])

    def test_wrong_currency_raises_400(self):
        """Non-USD currency raises 400."""
        payload = self._payload("FP-RIGHTORDER", "default", "1.00", "INR")
        with self.assertRaises(HTTPException) as ctx:
            validate_paypal_order(payload, "FP-RIGHTORDER")
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("amount/currency mismatch", ctx.exception.detail["message"])

    def test_amount_missing_raises_400(self):
        """Missing amount value raises 400 with the standard error message."""
        payload = {
            "id": "PP-123",
            "purchase_units": [
                {"custom_id": "FP-RIGHTORDER", "reference_id": "default", "amount": {}}
            ],
        }
        with self.assertRaises(HTTPException) as ctx:
            validate_paypal_order(payload, "FP-RIGHTORDER")
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("missing or invalid", ctx.exception.detail)

    def test_amount_key_absent_raises_400(self):
        """Absent amount key raises 400 when no captures either."""
        payload = {
            "id": "PP-123",
            "purchase_units": [
                {"custom_id": "FP-RIGHTORDER", "reference_id": "default"}
            ],
        }
        with self.assertRaises(HTTPException) as ctx:
            validate_paypal_order(payload, "FP-RIGHTORDER")
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("missing or invalid", ctx.exception.detail)

    def test_amount_in_captures_passes_when_unit_amount_absent(self):
        """When purchase_units[0].amount is absent, amount from captures[0] is accepted."""
        payload = {
            "id": "PP-123",
            "purchase_units": [
                {
                    "custom_id": "FP-RIGHTORDER",
                    "reference_id": "default",
                    "payments": {
                        "captures": [
                            {
                                "id": "CAP-12345",
                                "status": "COMPLETED",
                                "amount": {"value": "1.00", "currency_code": "USD"},
                            }
                        ]
                    },
                }
            ],
        }
        unit = validate_paypal_order(payload, "FP-RIGHTORDER")
        self.assertEqual(unit["custom_id"], "FP-RIGHTORDER")

    def test_custom_id_in_captures_passes_when_unit_custom_id_absent(self):
        """When purchase_units[0].custom_id is absent, custom_id from captures[0] is accepted."""
        payload = {
            "id": "PP-123",
            "purchase_units": [
                {
                    "reference_id": "default",
                    "payments": {
                        "captures": [
                            {
                                "id": "CAP-12345",
                                "status": "COMPLETED",
                                "custom_id": "FP-RIGHTORDER",
                                "amount": {"value": "1.00", "currency_code": "USD"},
                            }
                        ]
                    },
                }
            ],
        }
        unit = validate_paypal_order(payload, "FP-RIGHTORDER")
        self.assertEqual(unit["reference_id"], "default")


# ===========================================================================
# Tests for create_payment()
# ===========================================================================

class TestCreatePayment(unittest.TestCase):

    def _base_order(self):
        return {
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

    @patch("app.payments.get_connection")
    def test_order_not_found_raises_404(self, mock_get_conn):
        """Creating checkout for non-existent order raises 404."""
        mock_get_conn.return_value = _mock_conn([None])
        with self.assertRaises(HTTPException) as ctx:
            create_payment("FP-UNKNOWN")
        self.assertEqual(ctx.exception.status_code, 404)

    @patch("app.payments.get_connection")
    def test_already_paid_raises_409(self, mock_get_conn):
        """Creating checkout for already-PAID order raises 409 Conflict."""
        order = self._base_order()
        order["payment_status"] = "PAID"
        mock_get_conn.return_value = _mock_conn([order])
        with self.assertRaises(HTTPException) as ctx:
            create_payment("FP-TESTORDER001")
        self.assertEqual(ctx.exception.status_code, 409)

    @patch("app.payments.create_paypal_order")
    @patch("app.payments.get_connection")
    def test_create_payment_success(self, mock_get_conn, mock_paypal_create):
        """Checkout creation returns approval URL and correct metadata."""
        mock_get_conn.return_value = _mock_conn([
            self._base_order(),
            {"payment_status": "NOT_PAID", "paypal_order_id": "PP-ORDER-XYZ123"},
        ])
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
        mock_get_conn.return_value.commit.assert_called_once()
        mock_get_conn.return_value.close.assert_called_once()


# ===========================================================================
# Tests for capture_payment()
# ===========================================================================

class TestCapturePayment(unittest.TestCase):

    # -----------------------------------------------------------------------
    # SUCCESS PATH — real Sandbox GET behaviour (reference_id="default")
    # -----------------------------------------------------------------------

    @patch("app.payments.get_paypal_order_details")
    @patch("app.payments.capture_paypal_order")
    @patch("app.payments.get_connection")
    def test_capture_succeeds_with_default_reference_id_on_get(
        self,
        mock_get_conn,
        mock_capture_api,
        mock_details_api,
    ):
        """
        REGRESSION TEST (primary bug fix):
        PayPal GET-order response returns reference_id='default' for single-unit
        orders (confirmed PayPal v2 API behaviour).  capture_payment() must
        succeed using custom_id as the identity anchor.
        The INR FarmPay order must remain NOT_PAID.
        """
        db_order = _make_db_order()
        updated_order = _make_db_order(paypal_capture_id="CAP-999888777")

        mock_get_conn.return_value = _mock_conn([db_order, updated_order])
        mock_details_api.return_value = _make_approved_get_response()   # reference_id="default"
        mock_capture_api.return_value = _make_capture_response()

        result = capture_payment("FP-TESTORDER001")

        self.assertTrue(result["success"])
        self.assertTrue(result["sandbox_test_payment"])
        self.assertEqual(result["capture_id"], "CAP-999888777")
        self.assertEqual(result["test_amount"], 1.0)
        self.assertEqual(result["test_currency"], "USD")
        # Critical: INR order remains NOT_PAID
        self.assertEqual(result["farm_pay_order_payment_status"], "NOT_PAID")
        self.assertEqual(result["order"]["payment_status"], "NOT_PAID")
        self.assertIn("remains unpaid", result["message"])
        mock_get_conn.return_value.commit.assert_called_once()
        mock_get_conn.return_value.close.assert_called_once()

    @patch("app.payments.get_paypal_order_details")
    @patch("app.payments.capture_paypal_order")
    @patch("app.payments.get_connection")
    def test_capture_succeeds_with_both_ids_matching(
        self,
        mock_get_conn,
        mock_capture_api,
        mock_details_api,
    ):
        """
        CRITICAL TEST:
        When both reference_id and custom_id are set correctly on the GET response
        (non-default reference_id), capture must succeed and INR order stays NOT_PAID.
        """
        db_order = _make_db_order()
        updated_order = _make_db_order(paypal_capture_id="CAP-999888777")

        mock_get_conn.return_value = _mock_conn([db_order, updated_order])
        mock_details_api.return_value = _make_approved_get_response(
            reference_id_override="FP-TESTORDER001"
        )
        mock_capture_api.return_value = _make_capture_response()

        result = capture_payment("FP-TESTORDER001")
        self.assertTrue(result["success"])
        self.assertEqual(result["farm_pay_order_payment_status"], "NOT_PAID")

    @patch("app.payments.capture_paypal_order")
    @patch("app.payments.get_paypal_order_details")
    @patch("app.payments.get_connection")
    def test_capture_success_when_capture_response_lacks_unit_level_amount(
        self,
        mock_get_conn,
        mock_details_api,
        mock_capture_api,
    ):
        """
        Real PayPal Orders v2 capture responses may omit 'amount' from purchase_units[0]
        and only include it inside purchase_units[0].payments.captures[0].amount.
        Verify that capture_payment succeeds and correctly extracts the amount.
        """
        db_order = _make_db_order()
        updated_order = _make_db_order(paypal_capture_id="CAP-999888777")

        mock_get_conn.return_value = _mock_conn([db_order, updated_order])
        mock_details_api.return_value = _make_approved_get_response()
        mock_capture_api.return_value = {
            "id": "PP-ORDER-XYZ123",
            "status": "COMPLETED",
            "purchase_units": [
                {
                    "reference_id": "default",
                    "custom_id": "FP-TESTORDER001",
                    # No top-level "amount" key!
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
        self.assertEqual(result["capture_id"], "CAP-999888777")
        self.assertEqual(result["farm_pay_order_payment_status"], "NOT_PAID")

    # -----------------------------------------------------------------------
    # IDEMPOTENCY — already COMPLETED
    # -----------------------------------------------------------------------

    @patch("app.payments.get_paypal_order_details")
    @patch("app.payments.get_connection")
    def test_capture_idempotent_when_already_completed(
        self,
        mock_get_conn,
        mock_details_api,
    ):
        """
        If PayPal status is already COMPLETED (e.g. browser refresh or retry),
        the endpoint reuses existing details without attempting a second capture.
        """
        db_order = _make_db_order()
        updated_order = _make_db_order(paypal_capture_id="CAP-EXISTING123")

        mock_get_conn.return_value = _mock_conn([db_order, updated_order])
        mock_details_api.return_value = {
            "id": "PP-ORDER-XYZ123",
            "status": "COMPLETED",
            "purchase_units": [
                {
                    "reference_id": "default",
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

        result = capture_payment("FP-TESTORDER001")
        self.assertTrue(result["success"])
        self.assertEqual(result["capture_id"], "CAP-EXISTING123")
        self.assertEqual(result["farm_pay_order_payment_status"], "NOT_PAID")

    # -----------------------------------------------------------------------
    # PRE-CAPTURE GUARD FAILURES
    # -----------------------------------------------------------------------

    @patch("app.payments.get_connection")
    def test_farmpay_order_not_found_raises_404(self, mock_get_conn):
        """FarmPay order absent → 404."""
        mock_get_conn.return_value = _mock_conn([None])
        with self.assertRaises(HTTPException) as ctx:
            capture_payment("FP-UNKNOWN")
        self.assertEqual(ctx.exception.status_code, 404)

    @patch("app.payments.get_connection")
    def test_no_paypal_order_id_saved_raises_400(self, mock_get_conn):
        """No paypal_order_id stored → 400 (checkout not created yet)."""
        order = _make_db_order(paypal_order_id=None)
        mock_get_conn.return_value = _mock_conn([order])
        with self.assertRaises(HTTPException) as ctx:
            capture_payment("FP-TESTORDER001")
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("Create a checkout first", ctx.exception.detail)

    @patch("app.payments.get_paypal_order_details")
    @patch("app.payments.get_connection")
    def test_paypal_order_id_mismatch_on_get_raises_400(
        self, mock_get_conn, mock_details_api
    ):
        """PayPal GET returns a different order ID → 400, capture not attempted."""
        mock_get_conn.return_value = _mock_conn([_make_db_order()])
        mock_details_api.return_value = {"id": "PP-DIFFERENT-ID", "status": "APPROVED",
                                         "purchase_units": []}
        with self.assertRaises(HTTPException) as ctx:
            capture_payment("FP-TESTORDER001")
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("different order ID", ctx.exception.detail)

    @patch("app.payments.get_paypal_order_details")
    @patch("app.payments.get_connection")
    def test_farmpay_id_mismatch_on_get_raises_400(
        self, mock_get_conn, mock_details_api
    ):
        """GET response custom_id does not match stored FarmPay order ID → 400."""
        mock_get_conn.return_value = _mock_conn([_make_db_order()])
        mock_details_api.return_value = _make_approved_get_response(
            farmpay_order_id="FP-DIFFERENT-ORDER"  # custom_id set to wrong order
        )
        with self.assertRaises(HTTPException) as ctx:
            capture_payment("FP-TESTORDER001")
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("custom_id mismatch", ctx.exception.detail["message"])

    @patch("app.payments.get_paypal_order_details")
    @patch("app.payments.get_connection")
    def test_non_approved_non_completed_status_raises_409(
        self, mock_get_conn, mock_details_api
    ):
        """PayPal status is CREATED (not yet approved) → 409."""
        mock_get_conn.return_value = _mock_conn([_make_db_order()])
        mock_details_api.return_value = {
            "id": "PP-ORDER-XYZ123",
            "status": "CREATED",
            "purchase_units": [
                {"reference_id": "default", "custom_id": "FP-TESTORDER001",
                 "amount": {"value": "1.00", "currency_code": "USD"}}
            ],
        }
        with self.assertRaises(HTTPException) as ctx:
            capture_payment("FP-TESTORDER001")
        self.assertEqual(ctx.exception.status_code, 409)
        self.assertIn("not approved", ctx.exception.detail["message"])

    # -----------------------------------------------------------------------
    # POST-CAPTURE AMOUNT / CURRENCY CHECKS
    # -----------------------------------------------------------------------

    @patch("app.payments.get_paypal_order_details")
    @patch("app.payments.capture_paypal_order")
    @patch("app.payments.get_connection")
    def test_capture_response_wrong_amount_raises_400(
        self, mock_get_conn, mock_capture_api, mock_details_api
    ):
        """Capture response amount other than $1.00 raises 400."""
        mock_get_conn.return_value = _mock_conn([_make_db_order()])
        mock_details_api.return_value = _make_approved_get_response()
        mock_capture_api.return_value = _make_capture_response(amount_value="50.00")

        with self.assertRaises(HTTPException) as ctx:
            capture_payment("FP-TESTORDER001")
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("amount/currency mismatch", ctx.exception.detail["message"])

    @patch("app.payments.get_paypal_order_details")
    @patch("app.payments.capture_paypal_order")
    @patch("app.payments.get_connection")
    def test_capture_response_wrong_currency_raises_400(
        self, mock_get_conn, mock_capture_api, mock_details_api
    ):
        """Capture response with non-USD currency raises 400."""
        mock_get_conn.return_value = _mock_conn([_make_db_order()])
        mock_details_api.return_value = _make_approved_get_response()
        mock_capture_api.return_value = _make_capture_response(currency_code="INR")

        with self.assertRaises(HTTPException) as ctx:
            capture_payment("FP-TESTORDER001")
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("amount/currency mismatch", ctx.exception.detail["message"])

    @patch("app.payments.get_paypal_order_details")
    @patch("app.payments.capture_paypal_order")
    @patch("app.payments.get_connection")
    def test_capture_id_mismatch_on_capture_response_raises_400(
        self, mock_get_conn, mock_capture_api, mock_details_api
    ):
        """Capture response PayPal order ID differs from the stored ID → 400."""
        mock_get_conn.return_value = _mock_conn([_make_db_order()])
        mock_details_api.return_value = _make_approved_get_response()
        capture_resp = _make_capture_response()
        capture_resp["id"] = "PP-DIFFERENT-ORDER-ID"  # tampered
        mock_capture_api.return_value = capture_resp

        with self.assertRaises(HTTPException) as ctx:
            capture_payment("FP-TESTORDER001")
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("does not match", ctx.exception.detail)

    @patch("app.payments.get_paypal_order_details")
    @patch("app.payments.capture_paypal_order")
    @patch("app.payments.get_connection")
    def test_no_completed_captures_raises_402(
        self, mock_get_conn, mock_capture_api, mock_details_api
    ):
        """Zero completed captures in the capture response → 402."""
        mock_get_conn.return_value = _mock_conn([_make_db_order()])
        mock_details_api.return_value = _make_approved_get_response()
        mock_capture_api.return_value = _make_capture_response(capture_status="PENDING")

        with self.assertRaises(HTTPException) as ctx:
            capture_payment("FP-TESTORDER001")
        self.assertEqual(ctx.exception.status_code, 402)
        self.assertIn("exactly one completed", ctx.exception.detail)

    @patch("app.payments.get_paypal_order_details")
    @patch("app.payments.capture_paypal_order")
    @patch("app.payments.get_connection")
    def test_missing_capture_id_raises_402(
        self, mock_get_conn, mock_capture_api, mock_details_api
    ):
        """Completed capture with no capture id raises 402."""
        mock_get_conn.return_value = _mock_conn([_make_db_order()])
        mock_details_api.return_value = _make_approved_get_response()
        capture_resp = _make_capture_response()
        capture_resp["purchase_units"][0]["payments"]["captures"][0].pop("id")
        mock_capture_api.return_value = capture_resp

        with self.assertRaises(HTTPException) as ctx:
            capture_payment("FP-TESTORDER001")
        self.assertEqual(ctx.exception.status_code, 402)
        self.assertIn("capture ID is missing", ctx.exception.detail)

    # -----------------------------------------------------------------------
    # INR ORDER SAFETY
    # -----------------------------------------------------------------------

    @patch("app.payments.get_paypal_order_details")
    @patch("app.payments.capture_paypal_order")
    @patch("app.payments.get_connection")
    def test_inr_order_payment_status_never_set_to_paid(
        self, mock_get_conn, mock_capture_api, mock_details_api
    ):
        """
        BUSINESS RULE: The original INR FarmPay order must NEVER be marked PAID
        after a $1 Sandbox capture.
        """
        db_order = _make_db_order()
        # Simulate what the DB actually contains post-UPDATE
        updated_order = _make_db_order(paypal_capture_id="CAP-999888777",
                                       payment_status="NOT_PAID")

        mock_get_conn.return_value = _mock_conn([db_order, updated_order])
        mock_details_api.return_value = _make_approved_get_response()
        mock_capture_api.return_value = _make_capture_response()

        result = capture_payment("FP-TESTORDER001")

        self.assertNotEqual(result["farm_pay_order_payment_status"], "PAID")
        self.assertNotEqual(result["order"]["payment_status"], "PAID")
        self.assertEqual(result["farm_pay_order_payment_status"], "NOT_PAID")
        self.assertIn("remains unpaid", result["message"])


if __name__ == "__main__":
    unittest.main()
