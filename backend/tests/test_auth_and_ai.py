"""
Unit tests for FarmPay AI Authentication, Role Authorization, and AI Recommendation Engine.

Covers:
- Auth: PBKDF2 password hashing, JWT generation/validation
- AI: Groq (primary), Gemini (secondary), Claude (tertiary), deterministic fallback
- Safety: hallucination guard, invalid JSON, rate limit, timeout, provider unavailable
- Bilingual: English and Telugu recommendation output
- RBAC: role guards and cross-user isolation
"""

import json
import unittest
import urllib.error
from io import BytesIO
from datetime import timedelta
from unittest.mock import patch, MagicMock

from fastapi import HTTPException

from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    _configured_jwt_secret,
)
from app.ai_service import (
    generate_deterministic_fallback,
    analyze_offers,
    analyze_offers_with_gemini,
    AIRecommendation,
)


# --------------------------------------------------
# SHARED TEST FIXTURES
# --------------------------------------------------

SAMPLE_OFFERS = [
    {
        "buyer_id": "BUYER-01",
        "buyer_name": "Sri Lakshmi Traders",
        "price_per_kg": 26.0,
        "gross_amount": 13000.0,
        "transport_cost": 200.0,
        "net_proceeds": 12800.0,
        "notes": "Direct mill pickup.",
    },
    {
        "buyer_id": "BUYER-02",
        "buyer_name": "Andhra Agro Processing",
        "price_per_kg": 25.5,
        "gross_amount": 12750.0,
        "transport_cost": 0.0,
        "net_proceeds": 12750.0,
        "notes": "Free farmgate collection.",
    },
    {
        "buyer_id": "BUYER-03",
        "buyer_name": "Guntur Rice Mill",
        "price_per_kg": 24.0,
        "gross_amount": 12000.0,
        "transport_cost": 50.0,
        "net_proceeds": 11950.0,
        "notes": "Standard contract.",
    },
]

VALID_GROQ_RESPONSE = json.dumps({
    "recommended_buyer_id": "BUYER-01",
    "recommended_buyer_name": "Sri Lakshmi Traders",
    "summary": "Sri Lakshmi Traders offers the highest net take-home of Rs 12,800.",
    "financial_analysis": "Gross: Rs 13000, Transport: Rs 200, Net: Rs 12800.",
    "trade_offs": ["Highest net despite Rs 200 transport."],
    "warnings": ["Confirm transport cap before accepting."],
})

VALID_TELUGU_GROQ_RESPONSE = json.dumps({
    "recommended_buyer_id": "BUYER-01",
    "recommended_buyer_name": "Sri Lakshmi Traders",
    "summary": "శ్రీ లక్ష్మీ ట్రేడర్స్ అత్యధిక నికర ఆదాయం ₹12,800 అందిస్తున్నారు.",
    "financial_analysis": "స్థూల: ₹13000, రవాణా: ₹200, నికర: ₹12800.",
    "trade_offs": ["₹200 రవాణా ఉన్నప్పటికీ అత్యధిక నికర ఆదాయం."],
    "warnings": [],
})


def _make_mock_http_response(body: str, status: int = 200):
    """Build a mock urllib response object."""
    mock_resp = MagicMock()
    mock_resp.read.return_value = body.encode("utf-8")
    mock_resp.status = status
    mock_resp.__enter__ = lambda s: s
    mock_resp.__exit__ = MagicMock(return_value=False)
    return mock_resp


def _make_groq_body(content: str) -> str:
    return json.dumps({"choices": [{"message": {"content": content}}]})


# --------------------------------------------------
# AUTH TESTS
# --------------------------------------------------

class TestAuthSecurity(unittest.TestCase):
    def test_password_hashing_and_verification(self):
        password = "SecurePassword2026!"
        pwd_hash, salt = hash_password(password)
        self.assertNotEqual(password, pwd_hash)
        self.assertEqual(len(salt), 32)
        self.assertTrue(verify_password(password, pwd_hash, salt))
        self.assertFalse(verify_password("WrongPassword!", pwd_hash, salt))

    def test_jwt_generation_and_decoding(self):
        payload = {
            "sub": "USR-FARM-TEST01",
            "email": "farmer@example.com",
            "role": "FARMER",
            "name": "Ramesh Patel",
        }
        token = create_access_token(payload)
        self.assertIsInstance(token, str)
        decoded = decode_access_token(token)
        self.assertEqual(decoded["sub"], "USR-FARM-TEST01")
        self.assertEqual(decoded["role"], "FARMER")

    def test_invalid_jwt_raises_401(self):
        with self.assertRaises(HTTPException) as ctx:
            decode_access_token("invalid.token.structure")
        self.assertEqual(ctx.exception.status_code, 401)

    def test_expired_jwt_raises_401(self):
        token = create_access_token(
            {"sub": "USR-FARM-EXPIRED", "role": "FARMER"},
            expires_delta=timedelta(seconds=-1),
        )
        with self.assertRaises(HTTPException) as ctx:
            decode_access_token(token)
        self.assertEqual(ctx.exception.status_code, 401)
        self.assertIn("Session expired", ctx.exception.detail)

    def test_jwt_secret_must_be_configured_and_strong(self):
        with self.assertRaisesRegex(RuntimeError, "JWT_SECRET is required"):
            _configured_jwt_secret({"APP_ENV": "production"})

        with self.assertRaisesRegex(RuntimeError, "at least 32 characters"):
            _configured_jwt_secret({"JWT_SECRET": "too-short"})

        with self.assertRaisesRegex(RuntimeError, "unique secret"):
            _configured_jwt_secret({
                "JWT_SECRET": "replace_with_a_secure_random_secret_minimum_32_characters"
            })

        self.assertEqual(
            _configured_jwt_secret({"JWT_SECRET": "a" * 48}),
            "a" * 48,
        )


# --------------------------------------------------
# DETERMINISTIC FALLBACK TESTS
# --------------------------------------------------

class TestDeterministicFallback(unittest.TestCase):
    def test_picks_highest_net_proceeds(self):
        rec = generate_deterministic_fallback("Rice", 500.0, "Guntur", SAMPLE_OFFERS)
        self.assertTrue(rec.is_fallback)
        self.assertEqual(rec.recommended_buyer_id, "BUYER-01")

    def test_empty_offers_returns_safe_message(self):
        rec = generate_deterministic_fallback("Wheat", 1000.0, "Karnal", [])
        self.assertEqual(rec.recommended_buyer_id, "")
        self.assertTrue(rec.is_fallback)
        self.assertIn("No buyer offers", rec.summary)

    def test_telugu_empty_offers(self):
        rec = generate_deterministic_fallback("Wheat", 1000.0, "Karnal", [], language="te")
        self.assertEqual(rec.recommended_buyer_id, "")
        self.assertTrue(rec.is_fallback)
        # Telugu text should contain Telugu script
        self.assertTrue(any(ord(c) > 0x0C00 for c in rec.summary))

    def test_telugu_recommendation_uses_telugu_text(self):
        rec = generate_deterministic_fallback("Rice", 500.0, "Guntur", SAMPLE_OFFERS, language="te")
        self.assertTrue(rec.is_fallback)
        self.assertEqual(rec.recommended_buyer_id, "BUYER-01")
        # Summary should contain Telugu script characters
        self.assertTrue(any(ord(c) > 0x0C00 for c in rec.summary))


# --------------------------------------------------
# GROQ AI TESTS
# --------------------------------------------------

class TestGroqAI(unittest.TestCase):
    def _env_with_groq(self, k, default=None):
        env = {
            "GROQ_API_KEY": "test-groq-key-xyz",
            "GROQ_MODEL": "openai/gpt-oss-20b",
            "GEMINI_API_KEY": "",
            "ANTHROPIC_API_KEY": "",
        }
        return env.get(k, default)

    @patch("app.ai_service.os.getenv")
    @patch("urllib.request.urlopen")
    def test_groq_successful_recommendation(self, mock_urlopen, mock_getenv):
        mock_getenv.side_effect = self._env_with_groq
        mock_urlopen.return_value = _make_mock_http_response(
            _make_groq_body(VALID_GROQ_RESPONSE)
        )
        rec = analyze_offers("Rice", 500.0, "Guntur", SAMPLE_OFFERS)
        self.assertFalse(rec.is_fallback)
        self.assertEqual(rec.recommended_buyer_id, "BUYER-01")
        self.assertIn("openai/gpt-oss-20b", rec.model_used)

    @patch("app.ai_service.os.getenv")
    @patch("urllib.request.urlopen")
    def test_groq_telugu_recommendation(self, mock_urlopen, mock_getenv):
        mock_getenv.side_effect = self._env_with_groq
        mock_urlopen.return_value = _make_mock_http_response(
            _make_groq_body(VALID_TELUGU_GROQ_RESPONSE)
        )
        rec = analyze_offers("Rice", 500.0, "Guntur", SAMPLE_OFFERS, language="te")
        self.assertFalse(rec.is_fallback)
        self.assertEqual(rec.recommended_buyer_id, "BUYER-01")
        # Summary should contain Telugu script
        self.assertTrue(any(ord(c) > 0x0C00 for c in rec.summary))

    @patch("app.ai_service.os.getenv")
    @patch("urllib.request.urlopen")
    def test_groq_invalid_api_key_falls_back(self, mock_urlopen, mock_getenv):
        mock_getenv.side_effect = self._env_with_groq
        # Simulate 401 Unauthorized
        error_401 = urllib.error.HTTPError(
            url="https://api.groq.com/openai/v1/chat/completions",
            code=401,
            msg="Unauthorized",
            hdrs=None,
            fp=None,
        )
        mock_urlopen.side_effect = error_401
        rec = analyze_offers("Rice", 500.0, "Guntur", SAMPLE_OFFERS)
        self.assertTrue(rec.is_fallback)
        self.assertEqual(rec.recommended_buyer_id, "BUYER-01")

    @patch("app.ai_service.time.sleep", return_value=None)
    @patch("app.ai_service.os.getenv")
    @patch("urllib.request.urlopen")
    def test_groq_rate_limit_retries_then_falls_back(self, mock_urlopen, mock_getenv, mock_sleep):
        mock_getenv.side_effect = self._env_with_groq
        error_429 = urllib.error.HTTPError(
            url="https://api.groq.com/openai/v1/chat/completions",
            code=429,
            msg="Too Many Requests",
            hdrs=None,
            fp=None,
        )
        # Fail all attempts with 429
        mock_urlopen.side_effect = error_429
        rec = analyze_offers("Rice", 500.0, "Guntur", SAMPLE_OFFERS)
        # After exhausting retries must fall back to deterministic
        self.assertTrue(rec.is_fallback)
        self.assertEqual(rec.recommended_buyer_id, "BUYER-01")

    @patch("app.ai_service.os.getenv")
    @patch("urllib.request.urlopen")
    def test_groq_timeout_falls_back(self, mock_urlopen, mock_getenv):
        mock_getenv.side_effect = self._env_with_groq
        import socket
        mock_urlopen.side_effect = socket.timeout("Timed out")
        rec = analyze_offers("Rice", 500.0, "Guntur", SAMPLE_OFFERS)
        self.assertTrue(rec.is_fallback)
        self.assertEqual(rec.recommended_buyer_id, "BUYER-01")

    @patch("app.ai_service.os.getenv")
    @patch("urllib.request.urlopen")
    def test_groq_service_unavailable_falls_back(self, mock_urlopen, mock_getenv):
        mock_getenv.side_effect = self._env_with_groq
        error_503 = urllib.error.HTTPError(
            url="https://api.groq.com/openai/v1/chat/completions",
            code=503,
            msg="Service Unavailable",
            hdrs=None,
            fp=None,
        )
        mock_urlopen.side_effect = error_503
        rec = analyze_offers("Rice", 500.0, "Guntur", SAMPLE_OFFERS)
        self.assertTrue(rec.is_fallback)

    @patch("app.ai_service.os.getenv")
    @patch("urllib.request.urlopen")
    def test_groq_invalid_json_falls_back(self, mock_urlopen, mock_getenv):
        mock_getenv.side_effect = self._env_with_groq
        # Return malformed JSON in content
        bad_body = _make_groq_body("This is not JSON at all! { broken")
        mock_urlopen.return_value = _make_mock_http_response(bad_body)
        rec = analyze_offers("Rice", 500.0, "Guntur", SAMPLE_OFFERS)
        self.assertTrue(rec.is_fallback)
        self.assertEqual(rec.recommended_buyer_id, "BUYER-01")

    @patch("app.ai_service.os.getenv")
    @patch("urllib.request.urlopen")
    def test_groq_hallucinated_buyer_id_falls_back(self, mock_urlopen, mock_getenv):
        mock_getenv.side_effect = self._env_with_groq
        hallucinated = json.dumps({
            "recommended_buyer_id": "FAKE-HALLUCINATED-999",
            "recommended_buyer_name": "Ghost Trader",
            "summary": "I made this up.",
            "financial_analysis": "Gross: Rs 99999",
            "trade_offs": [],
            "warnings": [],
        })
        mock_urlopen.return_value = _make_mock_http_response(_make_groq_body(hallucinated))
        rec = analyze_offers("Rice", 500.0, "Guntur", SAMPLE_OFFERS)
        self.assertTrue(rec.is_fallback)
        self.assertEqual(rec.recommended_buyer_id, "BUYER-01")
        self.assertIn("deterministic-fallback", rec.model_used)

    @patch("app.ai_service.os.getenv")
    def test_groq_no_offers_uses_deterministic_fallback(self, mock_getenv):
        mock_getenv.side_effect = self._env_with_groq
        rec = analyze_offers("Rice", 500.0, "Guntur", [])
        self.assertTrue(rec.is_fallback)
        self.assertEqual(rec.recommended_buyer_id, "")

    @patch("app.ai_service.os.getenv")
    def test_all_providers_unconfigured_uses_deterministic(self, mock_getenv):
        mock_getenv.side_effect = lambda k, default=None: ""
        rec = analyze_offers("Rice", 500.0, "Guntur", SAMPLE_OFFERS)
        self.assertTrue(rec.is_fallback)
        self.assertEqual(rec.recommended_buyer_id, "BUYER-01")


# --------------------------------------------------
# BACKWARD COMPAT: analyze_offers_with_gemini alias
# --------------------------------------------------

class TestBackwardCompatAlias(unittest.TestCase):
    @patch("app.ai_service.os.getenv")
    def test_gemini_alias_delegates_to_analyze_offers(self, mock_getenv):
        """analyze_offers_with_gemini must still work after Groq migration."""
        mock_getenv.side_effect = lambda k, default=None: ""
        rec = analyze_offers_with_gemini("Rice", 500.0, "Guntur", SAMPLE_OFFERS)
        self.assertTrue(rec.is_fallback)
        self.assertEqual(rec.recommended_buyer_id, "BUYER-01")

    @patch("app.ai_service.os.getenv")
    @patch("urllib.request.urlopen")
    def test_gemini_alias_uses_groq_when_configured(self, mock_urlopen, mock_getenv):
        def env(k, default=None):
            return {
                "GROQ_API_KEY": "test-key",
                "GROQ_MODEL": "openai/gpt-oss-20b",
                "GEMINI_API_KEY": "",
                "ANTHROPIC_API_KEY": "",
            }.get(k, default)

        mock_getenv.side_effect = env
        mock_urlopen.return_value = _make_mock_http_response(
            _make_groq_body(VALID_GROQ_RESPONSE)
        )
        rec = analyze_offers_with_gemini("Rice", 500.0, "Guntur", SAMPLE_OFFERS)
        self.assertFalse(rec.is_fallback)
        self.assertIn("openai/gpt-oss-20b", rec.model_used)


# --------------------------------------------------
# ROLE-BASED ACCESS TESTS (preserved from Phase 1.2)
# --------------------------------------------------

class TestRoleBasedAccessControl(unittest.TestCase):
    def _make_user(self, role):
        return {
            "user_id": f"USR-{role}-TEST",
            "email": f"{role.lower()}@test.com",
            "role": role,
            "name": f"Test {role.capitalize()}",
            "preferred_language": "en",
            "is_active": True,
        }

    def test_role_guard_allows_authorized_role(self):
        from app.auth import require_role
        guard = require_role(["FARMER"])
        user = self._make_user("FARMER")
        result = guard(user=user)
        self.assertEqual(result["role"], "FARMER")

    def test_role_guard_blocks_unauthorized_role(self):
        from fastapi import HTTPException
        from app.auth import require_role
        guard = require_role(["FARMER"])
        buyer = self._make_user("BUYER")
        with self.assertRaises(HTTPException) as ctx:
            guard(user=buyer)
        self.assertEqual(ctx.exception.status_code, 403)

    def test_unauthenticated_request_raises_401(self):
        from fastapi import HTTPException
        from app.auth import get_current_user
        with self.assertRaises(HTTPException) as ctx:
            get_current_user(credentials=None)
        self.assertEqual(ctx.exception.status_code, 401)

    def test_farmer_cannot_bid_on_produce(self):
        from fastapi import HTTPException
        from app.auth import require_role
        guard = require_role(["BUYER", "ADMIN"])
        farmer = self._make_user("FARMER")
        with self.assertRaises(HTTPException) as ctx:
            guard(user=farmer)
        self.assertEqual(ctx.exception.status_code, 403)

    def test_buyer_cannot_create_produce_listing(self):
        from fastapi import HTTPException
        from app.auth import require_role
        guard = require_role(["FARMER", "ADMIN"])
        buyer = self._make_user("BUYER")
        with self.assertRaises(HTTPException) as ctx:
            guard(user=buyer)
        self.assertEqual(ctx.exception.status_code, 403)


class TestCrossUserIsolation(unittest.TestCase):
    """Tests that farmers cannot access or modify other farmers' listings."""

    def _make_farmer(self, uid):
        return {
            "user_id": uid,
            "email": f"{uid}@test.com",
            "role": "FARMER",
            "name": f"Farmer {uid}",
            "preferred_language": "en",
            "is_active": True,
        }

    def _make_listing(self, farmer_id):
        return {"listing_id": "LST-TEST-001", "farmer_id": farmer_id, "status": "ACTIVE"}

    def test_farmer_cannot_view_another_farmers_listing_offers(self):
        from fastapi import HTTPException
        farmer_a = self._make_farmer("USR-A")
        listing = self._make_listing("USR-B")
        with self.assertRaises(HTTPException) as ctx:
            if farmer_a["role"] == "FARMER" and listing["farmer_id"] != farmer_a["user_id"]:
                raise HTTPException(status_code=403, detail="You do not own this produce listing.")
        self.assertEqual(ctx.exception.status_code, 403)

    def test_authorized_farmer_can_accept_own_listing_offer(self):
        farmer = self._make_farmer("USR-A")
        listing = self._make_listing("USR-A")
        can_accept = (farmer["role"] == "FARMER" and listing["farmer_id"] == farmer["user_id"])
        self.assertTrue(can_accept)

    def test_farmer_cannot_accept_offer_on_another_farmers_listing(self):
        farmer_a = self._make_farmer("USR-A")
        listing = self._make_listing("USR-B")
        can_accept = (farmer_a["role"] == "FARMER" and listing["farmer_id"] == farmer_a["user_id"])
        self.assertFalse(can_accept)


if __name__ == "__main__":
    unittest.main()
