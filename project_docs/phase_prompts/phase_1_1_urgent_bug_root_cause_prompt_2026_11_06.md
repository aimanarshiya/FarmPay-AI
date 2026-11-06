# FarmPay AI — Phase 1.1 Urgent Bug Prompt (2026-11-06)

## Prompt Text

```text
# URGENT: PHASE 1.1 PAYPAL SANDBOX BUG — ROOT CAUSE AND PERMANENT FIX

Time limit: 10 minutes. Do not move to Phase 2 until this issue is resolved or a precise blocker is identified.

The PayPal Sandbox checkout is STILL failing after the previous Phase 1.1 implementation.

1. Actual failure evidence

A fresh FarmPay order was created:
- FarmPay Order ID: FP-B51C04800616
- Crop: Rice
- Quantity: 500 kg
- Location: Guntur
- Gross amount: ₹13,000
- Transport cost: ₹200
- Net proceeds: ₹12,800
- Original FarmPay payment status: NOT_PAID

The frontend successfully initiated PayPal Sandbox checkout. PayPal redirected the browser back to:
/payment/success?order_id=FP-B51C04800616&token=...&PayerID=...

However, the success page displays:
"PayPal order amount is missing or invalid."

Backend log:
POST /api/payments/paypal/capture/FP-B51C04800616 HTTP/1.1" 400 Bad Request

2. Investigation & Action Plan
- Inspect the database record for FP-B51C04800616.
- Check the exact payload returned by PayPal Orders v2 for capture.
- Determine why validate_paypal_order rejected the amount.
- Implement permanent fix in backend/app/payments.py and backend/app/paypal_service.py.
- Add regression unit tests in backend/tests/test_payments_api.py.
- Run test suite, build, and linter.
- Update documentation and audit trail.
```
