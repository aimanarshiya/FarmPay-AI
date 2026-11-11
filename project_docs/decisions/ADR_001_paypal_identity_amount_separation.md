# ADR 001: Separation of PayPal Order Identity and Amount Validation

**Status:** Accepted
**Date:** 2026-11-05
**Deciders:** Senior Full-Stack Architect, AI Systems Engineer

---

## Context
During Phase 1.1 PayPal Sandbox integration testing, approving a simulated $1.00 USD payment resulted in frontend errors: `"PayPal order amount is missing or invalid."`

Investigation of PayPal Orders v2 REST API behavior revealed:
1. For single-purchase-unit orders, PayPal automatically normalizes `purchase_units[0].reference_id` to `"default"` in `GET /v2/checkout/orders/{id}` responses.
2. The original implementation compared both `custom_id` and `reference_id` against the FarmPay order ID (`FP-...`). When `reference_id` was `"default"`, validation failed immediately.
3. Pre-capture validation coupled identity verification with strict amount checking on a preliminary GET response.

## Decision
1. **Split Validation Concerns:** Create `validate_paypal_identity()` for pre-capture verification and keep `validate_paypal_order()` for post-capture verification.
2. **Handle Placeholder Reference ID:** Treat `reference_id == "default"` as a known PayPal sentinel placeholder rather than an identity mismatch.
3. **Establish Primary Anchor:** Treat `custom_id` as the authoritative anchor matching the FarmPay order ID, as PayPal preserves it unmodified.
4. **Enforce At Least One Match:** Require that at least one non-placeholder identifier positively equals `farmpay_order_id` (preventing validation from passing if both are absent).
5. **Defer Strict Amount Checking:** Validate the exact $1.00 USD amount and currency code strictly on the capture response, where PayPal's v2 specification guarantees amount completeness.

## Consequences
- **Positive:** Resolves Sandbox failure; permits clean approvals; eliminates fragile assumptions about PayPal's internal normalization.
- **Positive:** Protects the INR order integrity; prevents unintended status transitions to `PAID`.
- **Negative / Trade-off:** Requires developers to be aware that `reference_id` can be `"default"`. Documented via `_PAYPAL_DEFAULT_REFERENCE_ID`.
