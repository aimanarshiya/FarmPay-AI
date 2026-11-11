# FarmPay AI — Phase 1.1 PayPal Sandbox Root Cause Analysis & Permanent Fix Report

**Date:** 2026-11-06
**Investigated Order:** `FP-B51C04800616`
**PayPal Order ID:** `3RB96396D6519315P`
**Status:** RESOLVED & VERIFIED

---

## 1. Executive Summary

During manual verification of Phase 1.1, order `FP-B51C04800616` failed upon return from PayPal Sandbox approval with HTTP 400 and frontend message:
`"PayPal order amount is missing or invalid."`

A deep technical investigation into live PayPal Sandbox API responses and application code uncovered the true root cause:
1. When PayPal redirects to `/payment/success`, the backend checks the order with `GET /v2/checkout/orders/{id}`. If the order is `APPROVED`, it executes `POST /v2/checkout/orders/{id}/capture`.
2. In PayPal Orders v2 API, the standard capture response places the captured amount inside `purchase_units[0]["payments"]["captures"][0]["amount"]` and omits `purchase_units[0]["amount"]` unless the explicit request header `"Prefer": "return=representation"` is supplied.
3. The backend method `validate_paypal_order()` previously read only `unit.get("amount", {})`. Because `unit["amount"]` was absent in the raw capture response, `amount_info["value"]` threw `KeyError: 'value'`, which was caught and returned HTTP 400 `"PayPal order amount is missing or invalid."`.
4. Even worse, PayPal had already captured the money ($1.00 USD, capture ID `14R03450529691153`), but because FastAPI crashed with HTTP 400 before the database update, MySQL rolled back and left `paypal_capture_id = NULL`.
5. Previous unit tests failed to detect this bug because test fixtures artificially injected `"amount"` at the top level of `purchase_units[0]`, diverging from actual PayPal capture behavior.

---

## 2. Changes Implemented

### A. `backend/app/paypal_service.py`
Added `"Prefer": "return=representation"` header to `capture_paypal_order()`:
```python
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json",
    "PayPal-Request-Id": f"capture-{paypal_order_id}",
    "Prefer": "return=representation",
}
```

### B. `backend/app/payments.py`
1. Enhanced `validate_paypal_identity()`:
   If `custom_id` is omitted from `purchase_units[0]` in a capture response, fallback to `purchase_units[0]["payments"]["captures"][0]["custom_id"]`.
2. Enhanced `validate_paypal_order()`:
   If `unit.get("amount")` is missing or missing `"value"`, fallback to extracting the amount from `unit.get("payments", {}).get("captures", [{}])[0].get("amount")`.
   Strict validation remains: exactly `$1.00 USD`.

### C. `backend/tests/test_payments_api.py`
Added regression tests:
- `test_amount_in_captures_passes_when_unit_amount_absent`: Verifies amount extraction directly from captures.
- `test_custom_id_in_captures_passes_when_unit_custom_id_absent`: Verifies identifier resolution from captures.
- `test_capture_success_when_capture_response_lacks_unit_level_amount`: Tests end-to-end `capture_payment` when the capture API response omits unit-level amount.

---

## 3. Verification & Live Evidence

1. **Live PayPal API Query:**
   Live call confirmed order `3RB96396D6519315P` completed with capture ID `14R03450529691153` ($1.00 USD).
2. **Database State for `FP-B51C04800616`:**
   ```json
   {
     "order_id": "FP-B51C04800616",
     "buyer_name": "Demo Buyer C",
     "crop": "Rice",
     "status": "PENDING_PAYMENT",
     "payment_status": "NOT_PAID",
     "paypal_order_id": "3RB96396D6519315P",
     "paypal_capture_id": "14R03450529691153"
   }
   ```
   - Invariant verified: `payment_status` strictly remains `NOT_PAID`.
   - `paypal_capture_id` is successfully persisted.
3. **Automated Backend Tests:**
   43 out of 43 unit and integration tests passed (`OK`).
4. **Frontend Production Build:**
   Vite v8.3.5 build completed with 0 errors.
5. **Frontend Linting:**
   ESLint passed with 0 errors and 0 warnings.
