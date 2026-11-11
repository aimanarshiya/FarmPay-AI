# FARMPAY AI — FINAL SPRINT TEST REPORT
**Date:** 2026-11-10
**Test Suite:** PyTest 9.2.0 (Python 3.13.12) & Vite Production Build
**Environment:** Windows 10 / Node 20 / MySQL 8.0
**Result:** **91/91 Passed (100% Pass Rate)**

---

## 1. Automated Test Execution Summary

Command executed:
```powershell
cd backend
.\.venv\Scripts\pytest -v
```

### Module Breakdown:

| Test Module | Tests | Passed | Failed | Duration | Coverage Focus |
|:---|:---:|:---:|:---:|:---:|:---|
| `tests/test_orders_api.py` | 11 | 11 | 0 | 1.82s | Order history scoping, pagination bounds, order details retrieval, net proceeds calculation, demo offer restrictions |
| `tests/test_payments_api.py` | 34 | 34 | 0 | 6.20s | PayPal Sandbox identity validation, currency verification, amount matching, capture idempotency, invalid token rejection |
| `tests/test_auth_and_ai.py` | 29 | 29 | 0 | 6.54s | JWT creation/expiry, PBKDF2 password hashing, RBAC role guards, Groq/Gemini fallback logic, Telugu translation fallback |
| `tests/test_role_workflows.py` | 17 | 17 | 0 | 4.12s | Marketplace write permissions, cross-tenant offer isolation, admin oversight access, unauthenticated request rejection |
| **Total** | **91** | **91** | **0** | **18.68s** | **100% Passing** |

---

## 2. Complete Test Case Inventory

### A. Orders API Suite (`test_orders_api.py` - 11 Tests)
1. `TestOrdersAPI::test_buyer_order_history_is_scoped_to_buyer_id` — **PASSED**
2. `TestOrdersAPI::test_create_order_invalid_buyer` — **PASSED**
3. `TestOrdersAPI::test_demo_offer_cannot_create_an_order` — **PASSED**
4. `TestOrdersAPI::test_farmer_order_history_is_scoped_to_farmer_id` — **PASSED**
5. `TestOrdersAPI::test_farmer_request_validation` — **PASSED**
6. `TestOrdersAPI::test_get_buyer_offers_calculation_and_sorting` — **PASSED**
7. `TestOrdersAPI::test_get_order_found` — **PASSED**
8. `TestOrdersAPI::test_get_order_not_found` — **PASSED**
9. `TestOrdersAPI::test_home_and_health` — **PASSED**
10. `TestOrdersAPI::test_list_orders_invalid_bounds` — **PASSED**
11. `TestOrdersAPI::test_list_orders_pagination` — **PASSED**

### B. Payments & PayPal Suite (`test_payments_api.py` - 34 Tests)
1. `TestValidatePaypalIdentity::test_both_identifiers_absent_raises_400` — **PASSED**
2. `TestValidatePaypalIdentity::test_both_identifiers_match` — **PASSED**
3. `TestValidatePaypalIdentity::test_custom_id_matches_reference_id_is_default` — **PASSED**
4. `TestValidatePaypalIdentity::test_custom_id_mismatch_raises_400` — **PASSED**
5. `TestValidatePaypalIdentity::test_multiple_purchase_units_raises_400` — **PASSED**
6. `TestValidatePaypalIdentity::test_reference_id_default_and_custom_id_absent_raises_400` — **PASSED**
7. `TestValidatePaypalIdentity::test_reference_id_matches_custom_id_absent` — **PASSED**
8. `TestValidatePaypalIdentity::test_reference_id_mismatch_non_placeholder_raises_400` — **PASSED**
9. `TestValidatePaypalOrder::test_amount_in_captures_passes_when_unit_amount_absent` — **PASSED**
10. `TestValidatePaypalOrder::test_amount_key_absent_raises_400` — **PASSED**
11. `TestValidatePaypalOrder::test_amount_missing_raises_400` — **PASSED**
12. `TestValidatePaypalOrder::test_correct_amount_and_identity_passes` — **PASSED**
13. `TestValidatePaypalOrder::test_custom_id_in_captures_passes_when_unit_custom_id_absent` — **PASSED**
14. `TestValidatePaypalOrder::test_identity_mismatch_raises_400` — **PASSED**
15. `TestValidatePaypalOrder::test_wrong_amount_raises_400` — **PASSED**
16. `TestValidatePaypalOrder::test_wrong_currency_raises_400` — **PASSED**
17. `TestCreatePayment::test_already_paid_raises_409` — **PASSED**
18. `TestCreatePayment::test_create_payment_success` — **PASSED**
19. `TestCreatePayment::test_order_not_found_raises_404` — **PASSED**
20. `TestCapturePayment::test_capture_id_mismatch_on_capture_response_raises_400` — **PASSED**
21. `TestCapturePayment::test_capture_idempotent_when_already_completed` — **PASSED**
22. `TestCapturePayment::test_capture_response_wrong_amount_raises_400` — **PASSED**
23. `TestCapturePayment::test_capture_response_wrong_currency_raises_400` — **PASSED**
24. `TestCapturePayment::test_capture_succeeds_with_both_ids_matching` — **PASSED**
25. `TestCapturePayment::test_capture_succeeds_with_default_reference_id_on_get` — **PASSED**
26. `TestCapturePayment::test_capture_success_when_capture_response_lacks_unit_level_amount` — **PASSED**
27. `TestCapturePayment::test_farmpay_id_mismatch_on_get_raises_400` — **PASSED**
28. `TestCapturePayment::test_farmpay_order_not_found_raises_404` — **PASSED**
29. `TestCapturePayment::test_inr_order_payment_status_never_set_to_paid` — **PASSED**
30. `TestCapturePayment::test_missing_capture_id_raises_402` — **PASSED**
31. `TestCapturePayment::test_no_completed_captures_raises_402` — **PASSED**
32. `TestCapturePayment::test_no_paypal_order_id_saved_raises_400` — **PASSED**
33. `TestCapturePayment::test_non_approved_non_completed_status_raises_409` — **PASSED**
34. `TestCapturePayment::test_paypal_order_id_mismatch_on_get_raises_400` — **PASSED**

### C. Authentication & AI Suite (`test_auth_and_ai.py` - 29 Tests)
- All 29 tests verified for PBKDF2 hash strength, token expiry enforcement, deterministic fallback, Telugu localization, Groq timeout/rate limit handling, and cross-user data isolation. — **PASSED**

### D. Role Workflows Suite (`test_role_workflows.py` - 17 Tests)
- All 17 RBAC tests verified for farmer listing creation, buyer bid creation, admin metrics access, and unauthorized route blocking. — **PASSED**

---

## 3. Frontend Production Build Output

```
> frontend@0.0.0 build
> vite build

vite v8.3.5 building client environment for production...
transforming...
✓ 74 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                 3.91 kB │ gzip:   1.22 kB
dist/assets/farmpay-rice-fields-B7VFXPfp.jpg  309.28 kB
dist/assets/index-_DmQhLQx.css                 50.13 kB │ gzip:   9.56 kB
dist/assets/index-BmExCkIM.js                 771.37 kB │ gzip: 176.29 kB
✓ built in 1.09s
```
- **Exit Status:** 0 (Clean production build)
- **ESLint Status:** 0 errors, 0 warnings
