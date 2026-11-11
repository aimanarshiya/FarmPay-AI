# Phase 1.1 Approved Prompts Record

**Phase:** Phase 1.1: PayPal Sandbox Failure Investigation & Validation Fix
**Date Recorded:** 2026-11-05

---

## Prompt 1: Phase 1.1 Investigation (Read-Only)
```text
# FarmPay AI – Phase 1.1: PayPal Sandbox Failure Investigation

You are working on my existing FarmPay AI project.
Project location: C:\Users\DELL-PC\FarmPay-AI
GitHub repository: https://github.com/aimanarshiya/FarmPay-AI

## Your role
Act as a senior full-stack engineer specializing in FastAPI, React, MySQL and PayPal REST API integration.

## Current problem
PayPal checkout creation and redirection to PayPal work.
After approving the Sandbox payment, PayPal redirects to:
/payment/success?order_id=...&token=...&PayerID=...
But the frontend displays: "PayPal order amount is missing or invalid."
The order remains in its existing state, and no successful capture has been confirmed.

## Important payment rules
1. The PayPal Sandbox transaction is a fixed $1.00 USD test transaction.
2. The original FarmPay order is priced in INR.
3. A successful $1 Sandbox capture must NEVER automatically mark the original INR FarmPay order as PAID.
4. Existing payment validation must not be weakened or bypassed.
5. Never expose API credentials or print .env secrets.
6. Do not perform real payments or create additional test transactions during investigation.

## Tasks - investigation only
1. Inspect complete payment flow.
2. Trace exact execution path.
3. Identify calls to PayPal amount validation.
4. Compare PayPal response structure with current implementation.
5. Check callback token match with stored order ID.
6. Identify whether issue is response parsing, missing amount, etc.
7. Examine relevant logs without secrets.
8. Check if capture might already exist.
Restrictions: Read-only investigation.
```

---

## Prompt 2: Phase 1.1 Implementation
```text
# FarmPay AI – Phase 1.1: Implement PayPal Validation Fix

The read-only investigation has identified a likely issue in backend/app/payments.py.
Before changing code, verify the exact PayPal GET-order response behavior using available sanitized evidence and the official API documentation. Do not assume that an APPROVED order always omits its amount.

## Implementation requirements
1. Modify only backend/app/payments.py and the relevant payment tests if necessary.
2. Separate PayPal order identity validation from amount validation.
3. During the pre-capture GET-order stage:
   - Validate the PayPal order ID against the stored order ID.
   - Validate the FarmPay order ID using custom_id/reference_id according to the existing trusted mapping.
   - Do not require an amount field if the verified response genuinely does not provide it.
   - If an amount is present, validate it rather than ignoring it.
4. After capture:
   - Strictly validate the captured amount as exactly 1.00 USD.
   - Validate currency, capture ID, capture status and order identity.
   - Require exactly one valid completed capture, consistent with existing business rules.
5. Preserve idempotency and database transaction handling.
6. Never change original FarmPay INR order status to PAID after the $1 Sandbox transaction.
7. Do not weaken any security checks or silently accept malformed responses.

## Tests
Add or update tests covering all edge cases. Run complete backend test suite, frontend build and lint checks.
```

---

## Prompt 3: Phase 1.1 Final Code Review
```text
# FarmPay AI – Phase 1.1 Final Code Review

Review the implemented PayPal fix before committing.
Do not modify any files unless you discover a specific defect. Do not commit or push.
Verify 10 core checks (identity mismatch, default placeholder, amount validation, INR preservation, row locking).
Run all backend tests, frontend build, ESLint, inspect git diff and status.
Return a final verification report with exact test counts and command outputs.
Do not commit or push.
```
