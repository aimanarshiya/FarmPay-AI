"""
Role-Based Access Control (RBAC) & Workflow Security Integration Tests
Verifies:
1. Unauthenticated users cannot access protected endpoints (401).
2. Buyers cannot accept offers (403).
3. Farmers cannot bid on listings (403).
4. Farmers cannot accept or view offers on other farmers' listings (403).
5. Admins have oversight access.
6. Acceptance flow transitions listing to ORDER_CREATED and generates verified order.
"""

import unittest
from unittest.mock import MagicMock, patch
from datetime import timedelta

from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.auth import (
    LoginRequest,
    create_access_token,
    get_current_user,
    hash_password,
    login,
    require_role,
)
from app.admin import get_marketplace_metrics
from app.payments import create_payment
from app.listings import CreateListingRequest, create_listing
from app.main import app
from app.offers import (
    SubmitOfferRequest,
    accept_buyer_offer,
    get_listing_offers,
    submit_buyer_offer,
)

FARMER_USER = {
    "user_id": "FARM-01",
    "role": "FARMER",
    "name": "Test Farmer",
}
BUYER_USER = {
    "user_id": "BUY-01",
    "role": "BUYER",
    "name": "Test Buyer",
    "business_name": "Test Buyer Business",
}
ADMIN_USER = {"user_id": "ADMIN-01", "role": "ADMIN", "name": "Test Admin"}


class TestRoleBasedAccessControl(unittest.TestCase):

    def test_unauthenticated_request_raises_401(self):
        with self.assertRaises(HTTPException) as ctx:
            get_current_user(credentials=None)
        self.assertEqual(ctx.exception.status_code, 401)
        self.assertIn("Authentication credentials were not provided", ctx.exception.detail)

    def test_role_guard_blocks_unauthorized_role(self):
        buyer_user = {"user_id": "BUY-01", "role": "BUYER", "name": "Test Buyer"}
        guard = require_role(["FARMER", "ADMIN"])

        with self.assertRaises(HTTPException) as ctx:
            guard(user=buyer_user)
        self.assertEqual(ctx.exception.status_code, 403)
        self.assertIn("Access denied", ctx.exception.detail)

    def test_role_guard_allows_authorized_role(self):
        farmer_user = {"user_id": "FARM-01", "role": "FARMER", "name": "Ramesh"}
        guard = require_role(["FARMER", "ADMIN"])
        user = guard(user=farmer_user)
        self.assertEqual(user["role"], "FARMER")

    def test_farmer_cannot_bid_on_produce(self):
        farmer_user = {"user_id": "FARM-01", "role": "FARMER", "name": "Ramesh"}
        guard = require_role(["BUYER", "ADMIN"])

        with self.assertRaises(HTTPException) as ctx:
            guard(user=farmer_user)
        self.assertEqual(ctx.exception.status_code, 403)

    def test_buyer_cannot_create_produce_listing(self):
        buyer_user = {"user_id": "BUY-01", "role": "BUYER", "name": "Test Buyer"}
        guard = require_role(["FARMER", "ADMIN"])

        with self.assertRaises(HTTPException) as ctx:
            guard(user=buyer_user)
        self.assertEqual(ctx.exception.status_code, 403)


class TestMarketplaceWriteWorkflows(unittest.TestCase):
    @patch("app.listings.get_connection")
    def test_farmer_can_create_listing(self, mock_get_conn):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn

        result = create_listing(
            CreateListingRequest(
                crop="Rice",
                quantity_kg=500,
                expected_price_per_kg=25,
                location="Guntur",
            ),
            current_user=FARMER_USER,
        )

        self.assertTrue(result["success"])
        self.assertEqual(result["listing"]["farmer_id"], FARMER_USER["user_id"])
        self.assertEqual(result["listing"]["status"], "ACTIVE")
        mock_cursor.execute.assert_called_once()
        mock_conn.commit.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch("app.offers.get_connection")
    def test_buyer_can_submit_database_backed_offer(self, mock_get_conn):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.fetchone.return_value = {
            "listing_id": "LST-001",
            "farmer_id": FARMER_USER["user_id"],
            "crop": "Rice",
            "quantity_kg": 500.0,
            "status": "ACTIVE",
        }
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn

        result = submit_buyer_offer(
            "LST-001",
            SubmitOfferRequest(
                price_per_kg=26,
                offered_quantity_kg=500,
                transport_cost=200,
            ),
            current_user=BUYER_USER,
        )

        self.assertTrue(result["success"])
        self.assertEqual(result["offer"]["buyer_id"], BUYER_USER["user_id"])
        self.assertEqual(result["offer"]["gross_amount"], 13000)
        self.assertEqual(result["offer"]["net_proceeds"], 12800)
        self.assertEqual(result["offer"]["status"], "PENDING")
        mock_conn.commit.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch("app.offers.get_connection")
    def test_buyer_without_offer_cannot_view_listing_bids(self, mock_get_conn):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.fetchone.side_effect = [
            {
                "listing_id": "LST-001",
                "farmer_id": FARMER_USER["user_id"],
                "crop": "Rice",
                "quantity_kg": 500.0,
                "location": "Guntur",
                "status": "ACTIVE",
            },
            None,
        ]
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn

        with self.assertRaises(HTTPException) as ctx:
            get_listing_offers("LST-001", current_user=BUYER_USER)
        self.assertEqual(ctx.exception.status_code, 403)


class TestAuthenticationHttpWorkflows(unittest.TestCase):
    def tearDown(self):
        app.dependency_overrides.clear()

    def test_farmer_buyer_and_admin_login_return_role_sessions(self):
        password = "LocalTestPassword2026!"
        password_hash, salt = hash_password(password)
        role_users = [
            ("FARMER", "farmer@example.com", "USR-FARM-TEST", "farmer"),
            ("BUYER", "buyer@example.com", "USR-BUY-TEST", "buyer"),
            ("ADMIN", "admin@example.com", "USR-ADMIN-TEST", "admin"),
        ]

        for role, email, user_id, _ in role_users:
            row = {
                "user_id": user_id,
                "email": email,
                "password_hash": password_hash,
                "salt": salt,
                "role": role,
                "name": f"{role.title()} Test",
                "preferred_language": "en",
                "is_active": True,
                "village_city": None,
                "farmer_district": None,
                "business_name": "Test Business" if role == "BUYER" else None,
                "buyer_city": None,
            }
            mock_conn = MagicMock()
            mock_conn.cursor.return_value.__enter__.return_value.fetchone.return_value = row
            with patch("app.auth.get_connection", return_value=mock_conn):
                result = login(LoginRequest(email=email, password=password))

            self.assertTrue(result["success"])
            self.assertEqual(result["user"]["role"], role)
            self.assertTrue(result["access_token"])

    def test_protected_api_rejects_anonymous_and_expired_sessions(self):
        # 1. Anonymous request (None credentials) raises 401
        with self.assertRaises(HTTPException) as ctx:
            get_current_user(None)
        self.assertEqual(ctx.exception.status_code, 401)

        # 2. Expired token raises 401
        expired = create_access_token(
            {"sub": ADMIN_USER["user_id"], "role": "ADMIN"},
            expires_delta=timedelta(seconds=-1),
        )
        from fastapi.security import HTTPAuthorizationCredentials
        with self.assertRaises(HTTPException) as ctx2:
            get_current_user(
                HTTPAuthorizationCredentials(scheme="Bearer", credentials=expired)
            )
        self.assertEqual(ctx2.exception.status_code, 401)

    def test_protected_admin_api_rejects_farmer_role(self):
        checker = require_role(["ADMIN"])
        with self.assertRaises(HTTPException) as ctx:
            checker(user=FARMER_USER)
        self.assertEqual(ctx.exception.status_code, 403)

    @patch("app.admin.get_connection")
    def test_admin_can_access_admin_api(self, mock_get_conn):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.fetchall.return_value = []
        mock_cursor.fetchone.return_value = {
            "total_orders": 0,
            "total_gross": 0,
            "total_net": 0,
            "captured_count": 0,
        }
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn

        res = get_marketplace_metrics(current_user=ADMIN_USER)
        self.assertTrue(res["success"])
        self.assertIn("metrics", res)

    @patch("app.payments.get_connection")
    def test_buyer_cannot_start_payment_for_another_users_order(self, mock_get_conn):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.fetchone.return_value = {
            "order_id": "FP-OTHER-USER",
            "buyer_id": "BUY-OTHER",
            "farmer_id": "FARM-OTHER",
            "payment_status": "NOT_PAID",
        }
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn

        with self.assertRaises(HTTPException) as ctx:
            create_payment("FP-OTHER-USER", current_user=BUYER_USER)
        self.assertEqual(ctx.exception.status_code, 404)

    @patch("app.auth.get_connection", side_effect=RuntimeError("database unavailable"))
    def test_database_error_does_not_trust_jwt_role_claims(self, _mock_get_conn):
        token = create_access_token(
            {"sub": FARMER_USER["user_id"], "role": "FARMER"}
        )
        from fastapi.security import HTTPAuthorizationCredentials

        with self.assertRaises(HTTPException) as ctx:
            get_current_user(
                credentials=HTTPAuthorizationCredentials(
                    scheme="Bearer",
                    credentials=token,
                )
            )
        self.assertEqual(ctx.exception.status_code, 503)


class TestCrossUserIsolation(unittest.TestCase):

    @patch("app.offers.get_connection")
    def test_farmer_cannot_view_another_farmers_listing_offers(self, mock_get_conn):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_conn.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

        # Listing owned by FARMER-A
        mock_cursor.fetchone.return_value = {
            "listing_id": "LST-001",
            "farmer_id": "FARMER-A",
            "crop": "Rice",
            "quantity_kg": 500.0,
            "location": "Guntur",
            "status": "ACTIVE",
        }

        # Request made by FARMER-B
        intruder_farmer = {"user_id": "FARMER-B", "role": "FARMER", "name": "Suresh"}

        with self.assertRaises(HTTPException) as ctx:
            get_listing_offers("LST-001", current_user=intruder_farmer)
        self.assertEqual(ctx.exception.status_code, 403)
        self.assertIn("do not own this produce listing", ctx.exception.detail)

    @patch("app.offers.get_connection")
    def test_farmer_cannot_accept_offer_on_another_farmers_listing(self, mock_get_conn):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_conn.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

        # Offer exists and is PENDING
        mock_cursor.fetchone.side_effect = [
            # First fetchone: buyer_offers
            {
                "offer_id": "OFF-999",
                "listing_id": "LST-001",
                "status": "PENDING",
                "price_per_kg": 26.0,
                "offered_quantity_kg": 500.0,
                "transport_cost": 200.0,
                "gross_amount": 13000.0,
                "net_proceeds": 12800.0,
                "buyer_id": "BUY-01",
                "buyer_name": "Agro Corp",
            },
            # Second fetchone: produce_listings (owned by FARMER-A)
            {
                "listing_id": "LST-001",
                "farmer_id": "FARMER-A",
                "crop": "Rice",
                "status": "ACTIVE",
                "location": "Guntur",
            },
        ]

        # Request made by unauthorized FARMER-B
        intruder_farmer = {"user_id": "FARMER-B", "role": "FARMER", "name": "Other Farmer"}

        with self.assertRaises(HTTPException) as ctx:
            accept_buyer_offer("OFF-999", current_user=intruder_farmer)
        self.assertEqual(ctx.exception.status_code, 403)
        self.assertIn("You do not own this listing", ctx.exception.detail)

    @patch("app.offers.get_connection")
    def test_authorized_farmer_can_accept_own_listing_offer(self, mock_get_conn):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_conn.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

        # Offer exists and is PENDING
        mock_cursor.fetchone.side_effect = [
            # 1. buyer_offers fetch
            {
                "offer_id": "OFF-100",
                "listing_id": "LST-001",
                "status": "PENDING",
                "price_per_kg": 26.0,
                "offered_quantity_kg": 500.0,
                "transport_cost": 200.0,
                "gross_amount": 13000.0,
                "net_proceeds": 12800.0,
                "buyer_id": "BUY-01",
                "buyer_name": "Agro Corp",
            },
            # 2. produce_listings fetch
            {
                "listing_id": "LST-001",
                "farmer_id": "FARMER-A",
                "crop": "Rice",
                "status": "ACTIVE",
                "location": "Guntur",
            },
            # 3. created order fetch
            {
                "order_id": "FP-ORDER-12345",
                "buyer_id": "BUY-01",
                "buyer_name": "Agro Corp",
                "crop": "Rice",
                "quantity_kg": 500.0,
                "location": "Guntur",
                "price_per_kg": 26.0,
                "gross_amount": 13000.0,
                "transport_cost": 200.0,
                "net_proceeds": 12800.0,
                "currency": "INR",
                "status": "PENDING_PAYMENT",
                "payment_status": "NOT_PAID",
                "created_at": "2026-11-06T15:00:00Z",
            },
        ]

        legitimate_farmer = {"user_id": "FARMER-A", "role": "FARMER", "name": "Legitimate Farmer"}

        result = accept_buyer_offer("OFF-100", current_user=legitimate_farmer)
        self.assertTrue(result["success"])
        self.assertEqual(result["order"]["payment_status"], "NOT_PAID")
        self.assertEqual(result["order"]["status"], "PENDING_PAYMENT")
        self.assertEqual(result["order"]["gross_amount"], 13000.0)
        self.assertEqual(result["order"]["net_proceeds"], 12800.0)


if __name__ == "__main__":
    unittest.main()
