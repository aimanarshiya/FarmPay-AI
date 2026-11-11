# Phase 1.1 Audit Report: PayPal Sandbox Failure Investigation

**Phase:** Phase 1.1
**Date:** 2026-11-05
**Author:** Senior Full-Stack Engineer & Architect
**Status:** Completed & Verified

---

## 1. Problem Description

During PayPal Sandbox testing on FarmPay AI:
- Checkout order creation and redirection to PayPal Sandbox functioned properly.
- Upon approving the $1.00 USD test transaction, PayPal redirected to `/payment/success?order_id=...&token=...&PayerID=...`.
- The frontend display rendered the error: `"PayPal order amount is missing or invalid."`
- The order remained in `PENDING_PAYMENT` with `payment_status = 'NOT_PAID'`.
- No capture was recorded in MySQL.

---

## 2. Codebase Investigation Summary

The payment flow was traced across:
- `backend/app/payments.py`
- `backend/app/paypal_service.py`
- `frontend/src/pages/PaymentSuccess.jsx`
- `backend/app/schema.sql`

### Trace of Execution Path:
1. Client redirected to `http://localhost:5173/payment/success?order_id=FP-...&token=...&PayerID=...`
2. `PaymentSuccess.jsx` extracts `orderId` and triggers `capturePayPalPayment(orderId)` via `POST /api/payments/paypal/capture/{orderId}`.
3. `capture_payment()` locks order row via `SELECT * FROM orders WHERE order_id = %s FOR UPDATE`.
4. Retrieves `paypal_order_id` from MySQL.
5. Invokes `get_paypal_order_details(paypal_order_id)` via `GET https://api-m.sandbox.paypal.com/v2/checkout/orders/{id}`.
6. Calls `validate_paypal_order(details, order_id)`.

---

## 3. Root Cause Identification

Two compounding factors were isolated:
1. **Primary Root Cause — `reference_id="default"` Normalization:**
   PayPal Orders v2 REST API automatically normalizes `purchase_units[0].reference_id` to the string `"default"` for single-purchase-unit orders on `GET` requests, even when a custom `reference_id` was supplied during order creation.
   The existing check in `validate_paypal_order`:
   ```python
   if reference_id and reference_id != farmpay_order_id:
       raise HTTPException(400, detail={"message": "PayPal reference_id mismatch; capture not attempted.", ...})
   ```
   evaluated `"default" != farmpay_order_id` to `True`, prematurely raising HTTP 400.
2. **Amount Validation Coupling:**
   The pre-capture identity check was coupled with strict amount validation before `POST /capture` was ever called. While PayPal's v2 spec returns amount on APPROVED orders, grouping identity with amount checks caused fragile pre-capture rejection.

---

## 4. Capture Status Verification

* **Did a capture occur prior to failure?**
  **No.** Execution terminated at the pre-capture validation step (line 331 of `payments.py`), before `capture_paypal_order()` was called.
  MySQL check confirmed `paypal_capture_id IS NULL`. The order and sandbox states were completely clean.

---

## 5. Security & Boundary Compliance

- No real money or live transactions were used.
- PayPal credentials remained strictly isolated in `.env`.
- Original INR FarmPay order remained in `payment_status = 'NOT_PAID'`.
- The $1.00 USD transaction was strictly isolated as a sandbox simulation.
