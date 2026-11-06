# FarmPay AI — Phase 1.1 Final Code Review

**Document Version:** 1.0.0  
**Phase:** Phase 1.1: PayPal Sandbox Failure Investigation & Validation Fix  
**Review Date:** 2026-11-05  
**Reviewer:** Senior Full-Stack Architect  
**Target Files Modified:**
- `backend/app/payments.py`
- `backend/tests/test_payments_api.py`

---

## 1. Executive Summary

This code review validates the surgical fix applied to `backend/app/payments.py` and its comprehensive 40-test regression suite in `backend/tests/test_payments_api.py`. The review confirms that all 11 verification requirements are strictly satisfied with zero credential leakage, zero regression in database locking, and absolute preservation of the INR order's unpaid status.

---

## 2. Eleven Detailed Verification Invariants

### 1. Verification of `custom_id` and `reference_id` Identity Validation
* **Implementation Location:** `backend/app/payments.py` lines 96–174 (`validate_paypal_identity`).
* **Evaluation:**
  - `custom_id` must match `farmpay_order_id` whenever present (lines 130–141).
  - `reference_id` must match `farmpay_order_id` whenever present and not equal to `"default"` (lines 143–154).
* **Test Verification:**
  - `test_custom_id_mismatch_raises_400` passes (`HTTPException 400: PayPal custom_id mismatch`).
  - `test_both_identifiers_match` passes.

### 2. Verification of `reference_id="default"` Acceptance Policy
* **Implementation Location:** `backend/app/payments.py` lines 128, 144, 156–172.
* **Evaluation:**
  - `_PAYPAL_DEFAULT_REFERENCE_ID = "default"` is explicitly declared as a sentinel.
  - When `reference_id == "default"`, `reference_id_is_placeholder` is `True`.
  - Rule 3 requires:
    ```python
    custom_id_matches = (custom_id == farmpay_order_id)
    reference_id_matches = (reference_id == farmpay_order_id and not reference_id_is_placeholder)
    if not custom_id_matches and not reference_id_matches:
        raise HTTPException(status_code=400, ...)
    ```
  - Therefore, `reference_id="default"` is accepted **only if** `custom_id` positively matches `farmpay_order_id`. If `custom_id` is absent or wrong, it is rejected.
* **Test Verification:**
  - `test_custom_id_matches_reference_id_is_default` passes (succeeds with custom_id match).
  - `test_reference_id_default_and_custom_id_absent_raises_400` passes (raises 400).

### 3. Verification That Incorrect Order IDs Are Rejected
* **Implementation Location:** `backend/app/payments.py` lines 156–172.
* **Evaluation:**
  - Any payload where neither `custom_id` nor a non-default `reference_id` matches `farmpay_order_id` raises HTTP 400 with detail `"Neither PayPal identifier matches; capture not attempted."`
* **Test Verification:**
  - `test_both_identifiers_absent_raises_400` passes.
  - `test_farmpay_id_mismatch_on_get_raises_400` passes.

### 4. Verification of PayPal GET Response Checked Against Stored Order ID
* **Implementation Location:** `backend/app/payments.py` lines 385–391.
* **Evaluation:**
  ```python
  details = get_paypal_order_details(paypal_order_id)
  if details.get("id") != paypal_order_id:
      raise HTTPException(
          status_code=400,
          detail="PayPal returned a different order ID; capture not attempted.",
      )
  ```
* **Test Verification:**
  - `test_paypal_order_id_mismatch_on_get_raises_400` passes.

### 5. Verification of Capture Amount Exactly $1.00 USD
* **Implementation Location:** `backend/app/payments.py` lines 206–218, 458–468.
* **Evaluation:**
  - Post-capture response is validated via `validate_paypal_order()`.
  - Capture unit is extracted and Decimal-parsed: `capture_amount = Decimal(str(capture["amount"]["value"]))`.
  - Checked against `SANDBOX_TEST_AMOUNT = Decimal("1.00")`.
* **Test Verification:**
  - `test_capture_response_wrong_amount_raises_400` passes.
  - `test_wrong_amount_raises_400` passes.

### 6. Verification of Capture Currency and Status
* **Implementation Location:** `backend/app/payments.py` lines 208, 424–431, 459, 461.
* **Evaluation:**
  - PayPal order status checked: `if paypal_result.get("status") != "COMPLETED": raise HTTPException(402, ...)`.
  - Currency strictly verified: `capture_currency != SANDBOX_TEST_CURRENCY` raises HTTP 400.
* **Test Verification:**
  - `test_capture_response_wrong_currency_raises_400` passes.
  - `test_wrong_currency_raises_400` passes.

### 7. Verification of Capture ID Validated Before Recording
* **Implementation Location:** `backend/app/payments.py` lines 439–456.
* **Evaluation:**
  - Completed captures array filtered: `completed_captures = [item for item in captures if item.get("status") == "COMPLETED"]`.
  - Checked for `len(completed_captures) != 1`.
  - Checked for presence of `capture_id = capture.get("id")`; if missing, raises HTTP 402 with `"PayPal capture ID is missing."`
* **Test Verification:**
  - `test_no_completed_captures_raises_402` passes.
  - `test_missing_capture_id_raises_402` passes.

### 8. Verification of Duplicate Callbacks and Idempotency
* **Implementation Location:** `backend/app/payments.py` lines 399–401.
* **Evaluation:**
  - If `details.get("status") == "COMPLETED"`, `capture_paypal_order()` is **not** called. Existing details are used to re-verify and return capture confirmation.
* **Test Verification:**
  - `test_capture_idempotent_when_already_completed` passes.

### 9. Verification That Original INR FarmPay Order Remains NOT_PAID
* **Implementation Location:** `backend/app/payments.py` lines 472–481.
* **Evaluation:**
  - SQL update statement targets only `paypal_capture_id`:
    ```sql
    UPDATE orders
    SET paypal_capture_id = %s
    WHERE order_id = %s
      AND paypal_order_id = %s
      AND payment_status = 'NOT_PAID'
    ```
  - `payment_status` is never updated to `'PAID'`.
* **Test Verification:**
  - `test_inr_order_payment_status_never_set_to_paid` passes.
  - Assertions `result["farm_pay_order_payment_status"] == "NOT_PAID"` and `result["order"]["payment_status"] == "NOT_PAID"` pass.

### 10. Verification of MySQL Transaction and Row-Locking Behavior
* **Implementation Location:** `backend/app/payments.py` lines 298–313, 471–496.
* **Evaluation:**
  - Query starts with `SELECT * FROM orders WHERE order_id = %s FOR UPDATE` inside `try` block.
  - Connection `autocommit=False`.
  - `connection.commit()` executed strictly upon successful verification.
  - `connection.rollback()` called in both `HTTPException` and generic `Exception` handlers.
  - `connection.close()` called in `finally`.
* **Test Verification:**
  - Verified by mock calls asserting `mock_conn.commit.assert_called_once()` and `mock_conn.close.assert_called_once()`.

### 11. Verification of Zero Secret or Environment File Leakage
* **Evaluation:**
  - Git diff inspected across all modified files.
  - Zero presence of client secrets, tokens, passwords, or `.env` entries.
  - Only `backend/app/payments.py` and `backend/tests/test_payments_api.py` are modified.

---

## 3. Git Inspection Summary

- **Branch:** `main` (synchronized with `origin/main` at `1f7a7e4ee29e864c92c9796d6adfbb8faa776aea`)
- **Modified Tracked Files:**
  1. `backend/app/payments.py` (+82 lines, -28 lines)
  2. `backend/tests/test_payments_api.py` (+547 lines, -140 lines)
- **`git diff --check`:** Clean (no merge conflict markers, no trailing whitespace errors).
- **Untracked Files:** `project_docs/` only.

---

## 4. Final Verdict

**APPROVED.** The implementation is secure, resilient, fully documented, and ready for commit approval.
