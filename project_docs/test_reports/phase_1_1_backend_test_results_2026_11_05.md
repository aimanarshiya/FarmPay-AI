# Phase 1.1 Test Execution Report

**Phase:** Phase 1.1  
**Execution Timestamp:** 2026-11-05T18:32:13+05:30  
**Test Runner:** Python `unittest` (`.venv\Scripts\python.exe -m unittest discover -s tests -v`)  
**Status:** All Tests Passed (40/40)  

---

## 1. Test Command & Environment

```powershell
Set-Location c:\Users\DELL-PC\FarmPay-AI\backend
.venv\Scripts\python.exe -m unittest discover -s tests -v
```

---

## 2. Actual Test Output

```
test_create_order_invalid_buyer (test_orders_api.TestOrdersAPI.test_create_order_invalid_buyer)
Attempting to order with non-existent buyer raises 404. ... ok
test_create_order_success (test_orders_api.TestOrdersAPI.test_create_order_success)
Verify order creation, ID generation, and database insert. ... ok
test_farmer_request_validation (test_orders_api.TestOrdersAPI.test_farmer_request_validation)
Ensure input constraints on FarmerRequest. ... ok
test_get_buyer_offers_calculation_and_sorting (test_orders_api.TestOrdersAPI.test_get_buyer_offers_calculation_and_sorting)
Test gross, transport, net calculations and desc sorting. ... ok
test_get_order_found (test_orders_api.TestOrdersAPI.test_get_order_found)
Verify single order retrieval and decimal normalization. ... ok
test_get_order_not_found (test_orders_api.TestOrdersAPI.test_get_order_not_found)
Requesting an unknown order_id raises 404. ... ok
test_home_and_health (test_orders_api.TestOrdersAPI.test_home_and_health)
Verify baseline health check and home response. ... ok
test_list_orders_invalid_bounds (test_orders_api.TestOrdersAPI.test_list_orders_invalid_bounds)
Verify limit and offset boundary validation. ... ok
test_list_orders_pagination (test_orders_api.TestOrdersAPI.test_list_orders_pagination)
Verify list_orders returns paginated list with total. ... ok
test_capture_id_mismatch_on_capture_response_raises_400 (test_payments_api.TestCapturePayment.test_capture_id_mismatch_on_capture_response_raises_400)
Capture response PayPal order ID differs from the stored ID -> 400. ... ok
test_capture_idempotent_when_already_completed (test_payments_api.TestCapturePayment.test_capture_idempotent_when_already_completed)
If PayPal status is already COMPLETED (e.g. browser refresh or retry), reuses details. ... ok
test_capture_response_wrong_amount_raises_400 (test_payments_api.TestCapturePayment.test_capture_response_wrong_amount_raises_400)
Capture response amount other than $1.00 raises 400. ... ok
test_capture_response_wrong_currency_raises_400 (test_payments_api.TestCapturePayment.test_capture_response_wrong_currency_raises_400)
Capture response with non-USD currency raises 400. ... ok
test_capture_succeeds_with_both_ids_matching (test_payments_api.TestCapturePayment.test_capture_succeeds_with_both_ids_matching)
CRITICAL TEST: When both reference_id and custom_id match, capture succeeds. ... ok
test_capture_succeeds_with_default_reference_id_on_get (test_payments_api.TestCapturePayment.test_capture_succeeds_with_default_reference_id_on_get)
REGRESSION TEST: reference_id='default' on GET succeeds using custom_id anchor. ... ok
test_farmpay_id_mismatch_on_get_raises_400 (test_payments_api.TestCapturePayment.test_farmpay_id_mismatch_on_get_raises_400)
GET response custom_id does not match stored FarmPay order ID -> 400. ... ok
test_farmpay_order_not_found_raises_404 (test_payments_api.TestCapturePayment.test_farmpay_order_not_found_raises_404)
FarmPay order absent -> 404. ... ok
test_inr_order_payment_status_never_set_to_paid (test_payments_api.TestCapturePayment.test_inr_order_payment_status_never_set_to_paid)
BUSINESS RULE: The original INR FarmPay order must NEVER be marked PAID after $1 capture. ... ok
test_missing_capture_id_raises_402 (test_payments_api.TestCapturePayment.test_missing_capture_id_raises_402)
Completed capture with no capture id raises 402. ... ok
test_no_completed_captures_raises_402 (test_payments_api.TestCapturePayment.test_no_completed_captures_raises_402)
Zero completed captures in the capture response -> 402. ... ok
test_no_paypal_order_id_saved_raises_400 (test_payments_api.TestCapturePayment.test_no_paypal_order_id_saved_raises_400)
No paypal_order_id stored -> 400 (checkout not created yet). ... ok
test_non_approved_non_completed_status_raises_409 (test_payments_api.TestCapturePayment.test_non_approved_non_completed_status_raises_409)
PayPal status is CREATED (not yet approved) -> 409. ... ok
test_paypal_order_id_mismatch_on_get_raises_400 (test_payments_api.TestCapturePayment.test_paypal_order_id_mismatch_on_get_raises_400)
PayPal GET returns a different order ID -> 400, capture not attempted. ... ok
test_already_paid_raises_409 (test_payments_api.TestCreatePayment.test_already_paid_raises_409)
Creating checkout for already-PAID order raises 409 Conflict. ... ok
test_create_payment_success (test_payments_api.TestCreatePayment.test_create_payment_success)
Checkout creation returns approval URL and correct metadata. ... ok
test_order_not_found_raises_404 (test_payments_api.TestCreatePayment.test_order_not_found_raises_404)
Creating checkout for non-existent order raises 404. ... ok
test_both_identifiers_absent_raises_400 (test_payments_api.TestValidatePaypalIdentity.test_both_identifiers_absent_raises_400)
Neither custom_id nor reference_id present -> 400. ... ok
test_both_identifiers_match (test_payments_api.TestValidatePaypalIdentity.test_both_identifiers_match)
Both custom_id and reference_id match (e.g. in capture responses). ... ok
test_custom_id_matches_reference_id_is_default (test_payments_api.TestValidatePaypalIdentity.test_custom_id_matches_reference_id_is_default)
Real Sandbox GET response: reference_id='default', custom_id correct -> passes. ... ok
test_custom_id_mismatch_raises_400 (test_payments_api.TestValidatePaypalIdentity.test_custom_id_mismatch_raises_400)
custom_id present and wrong -> 400. ... ok
test_multiple_purchase_units_raises_400 (test_payments_api.TestValidatePaypalIdentity.test_multiple_purchase_units_raises_400)
More than one purchase unit is rejected. ... ok
test_reference_id_default_and_custom_id_absent_raises_400 (test_payments_api.TestValidatePaypalIdentity.test_reference_id_default_and_custom_id_absent_raises_400)
reference_id='default' (placeholder) and no custom_id -> 400 (no positive match). ... ok
test_reference_id_matches_custom_id_absent (test_payments_api.TestValidatePaypalIdentity.test_reference_id_matches_custom_id_absent)
reference_id matches when custom_id is absent. ... ok
test_reference_id_mismatch_non_placeholder_raises_400 (test_payments_api.TestValidatePaypalIdentity.test_reference_id_mismatch_non_placeholder_raises_400)
reference_id is a real non-default value that does not match -> 400. ... ok
test_amount_key_absent_raises_400 (test_payments_api.TestValidatePaypalOrder.test_amount_key_absent_raises_400)
Absent amount key raises 400. ... ok
test_amount_missing_raises_400 (test_payments_api.TestValidatePaypalOrder.test_amount_missing_raises_400)
Missing amount value raises 400 with the standard error message. ... ok
test_correct_amount_and_identity_passes (test_payments_api.TestValidatePaypalOrder.test_correct_amount_and_identity_passes)
$1.00 USD with matching identifiers passes. ... ok
test_identity_mismatch_raises_400 (test_payments_api.TestValidatePaypalOrder.test_identity_mismatch_raises_400)
Identity mismatch is caught before amount check. ... ok
test_wrong_amount_raises_400 (test_payments_api.TestValidatePaypalOrder.test_wrong_amount_raises_400)
Amount other than $1.00 raises 400. ... ok
test_wrong_currency_raises_400 (test_payments_api.TestValidatePaypalOrder.test_wrong_currency_raises_400)
Non-USD currency raises 400. ... ok

----------------------------------------------------------------------
Ran 40 tests in 0.156s

OK
```

---

## 3. Frontend Build & Lint Verification

### Vite Build Execution:
```powershell
Set-Location c:\Users\DELL-PC\FarmPay-AI\frontend
node_modules\.bin\vite build
```
Output:
```
vite v8.3.5 building client environment for production...
transforming...
✓ 43 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.49 kB │ gzip:  0.32 kB
dist/assets/index-o9Or-1Fq.css   18.24 kB │ gzip:  4.60 kB
dist/assets/index-BTlHbpkW.js   290.76 kB │ gzip: 89.07 kB
✓ built in 439ms
```

### ESLint Execution:
```powershell
Set-Location c:\Users\DELL-PC\FarmPay-AI\frontend
node_modules\.bin\eslint src --ext .js,.jsx --max-warnings 0
```
Output:
```
ESLint exit: 0 (0 warnings, 0 errors)
```
