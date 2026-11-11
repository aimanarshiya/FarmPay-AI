# Phase 1.1 Implementation Report: PayPal Validation Separation & Fix

**Phase:** Phase 1.1
**Date:** 2026-11-05
**Author:** Senior Full-Stack Engineer
**Status:** Implemented & Verified

---

## 1. Objectives

1. Separate PayPal order identity validation from amount validation.
2. Handle PayPal's automated `reference_id="default"` normalization on single-unit GET responses without compromising security.
3. Establish `custom_id` as the primary authoritative anchor matching the FarmPay order ID.
4. Defer strict $1.00 USD amount and currency validation to the post-capture response where it is formally guaranteed.
5. Guarantee that the INR FarmPay order remains in `payment_status = 'NOT_PAID'`.
6. Maintain pessimistic locking and idempotency for completed orders.

---

## 2. Code Modifications

### File 1: `backend/app/payments.py`

1. **Declared Sentinel Constant:**
   ```python
   _PAYPAL_DEFAULT_REFERENCE_ID = "default"
   ```
2. **Introduced `validate_paypal_identity(paypal_result, farmpay_order_id)`:**
   - Evaluates single purchase unit.
   - Validates `custom_id` must match `farmpay_order_id` if present.
   - Validates `reference_id` must match `farmpay_order_id` if present and NOT equal to `"default"`.
   - Requires at least one non-placeholder identifier to positively match.
3. **Refactored `validate_paypal_order(paypal_result, farmpay_order_id)`:**
   - Calls `validate_paypal_identity`.
   - Enforces strict amount (`Decimal("1.00")`) and currency (`"USD"`).
4. **Updated `capture_payment(order_id)` Execution Flow:**
   - Pre-capture: Calls `validate_paypal_identity(details, order_id)` on the GET order response.
   - Post-capture: Calls `validate_paypal_order(paypal_result, order_id)` on the capture response.
   - Database update: Writes `paypal_capture_id` while strictly preserving `payment_status = 'NOT_PAID'`.

### File 2: `backend/tests/test_payments_api.py`

- Completely upgraded test suite from 7 tests to 40 tests across 4 test classes:
  1. `TestValidatePaypalIdentity` (8 tests)
  2. `TestValidatePaypalOrder` (6 tests)
  3. `TestCreatePayment` (3 tests)
  4. `TestCapturePayment` (13 tests, plus 10 tests in `test_orders_api.py`)

---

## 3. Strict Verification & Invariants

- **INR Order Protection:** The SQL update statement is explicitly constrained:
  ```sql
  UPDATE orders
  SET paypal_capture_id = %s
  WHERE order_id = %s
    AND paypal_order_id = %s
    AND payment_status = 'NOT_PAID'
  ```
- **Double-Capture Guard:** If PayPal status is already `COMPLETED`, existing capture details are returned without calling `capture_paypal_order()`.
- **Zero Scope Creep:** Only `backend/app/payments.py` and `backend/tests/test_payments_api.py` were modified.
