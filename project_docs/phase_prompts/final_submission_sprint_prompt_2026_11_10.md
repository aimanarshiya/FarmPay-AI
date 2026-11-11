# FARM PAY AI — FINAL SUBMISSION SPRINT
## Deadline: 11 November 2026 | Priority: Complete ASAP

Act as the **Senior Full-Stack Engineer, QA Lead, Security Reviewer, and Technical Lead** responsible for getting the existing FarmPay AI project ready for hackathon submission.

Your mission is to inspect the current project, continue from its actual state, fix existing problems, complete the essential workflows, thoroughly test the application, and prepare a stable, demonstrable submission.

**Do not spend time planning what could be built. Start inspecting and implementing immediately.**

---

# 1. PROJECT DETAILS — PRESERVE THE EXISTING ARCHITECTURE

Main project:
`C:\Users\DELL-PC\FarmPay-AI`

Lovable visual reference:
`C:\Users\DELL-PC\FarmPay-Lovable-Design`

Main GitHub:
`https://github.com/aimanarshiya/FarmPay-AI`

Lovable reference GitHub:
`https://github.com/aimanarshiya/farmpay-field-preview`

Existing technology stack:

- Frontend: React, Vite, React Router
- Backend: Python, FastAPI
- Database: MySQL 8
- Database driver: PyMySQL
- Payments: PayPal Sandbox
- AI: Existing Groq integration, with honest fallback behaviour
- Frontend URL: `http://localhost:5173`
- Backend URL: `http://127.0.0.1:8000`
- Database: `farmpay_ai`

**Mandatory architecture rules:**

1. Continue using the existing React Router architecture.
2. Do not migrate to Next.js, TanStack Router, PostgreSQL, or another framework.
3. Preserve existing backend modules and database structure.
4. Do not create additional backend modules for the 17 newly added Stitch screens.
5. Do not remove existing functionality or replace working implementations unnecessarily.
6. Do not ask for API keys, passwords, or `.env` contents.
7. Never expose secrets in frontend code, logs, screenshots, or documentation.
8. Do not upgrade paid services or purchase anything.
9. Preserve all existing uncommitted changes and untracked files.

---

# 2. FIRST PRIORITY — INSPECT THE PROJECT AND FIX THE BUILD

The previous frontend production build failed twice, and work was interrupted by the coding-agent quota.

Before making further changes:

1. Inspect the entire current project structure.
2. Check Git status and preserve all existing modifications.
3. Inspect `package.json`, dependencies, Vite configuration, React Router configuration, and entry points.
4. Inspect all recently created and modified frontend components.
5. Identify the exact reason for the previous production build failure.
6. Reproduce the error and record the complete error output.
7. Fix the actual root cause instead of applying random changes.
8. Run the production build again.

Check specifically for:

- Incorrect imports and exports.
- Missing components and dependencies.
- Incorrect file paths and casing.
- Invalid JSX or TypeScript syntax.
- Broken route definitions.
- Duplicate routes.
- Missing CSS imports.
- Incorrect component props.
- Invalid environment-variable references.
- Broken navigation links.
- Runtime errors caused by missing data.
- Dependency version conflicts.

Do not report the build as successful unless the actual command exits successfully.

**Acceptance criterion:** The frontend production build completes successfully.

---

# 3. COMPLETE AND VERIFY ALL 17 STITCH SCREENS

The project contains 17 approved Stitch screens exported into:

`project_docs/stitch_reference/`

Use the exported HTML, screenshots, design documentation, and screen inventory as the visual reference.

Keep all 17 screens in the website. Do not delete, hide, skip, or simplify any of them.

Verify these exact routes:

| No. | Screen | Route |
|---|---|---|
| 1 | Order Escrow & Fulfillment Milestone Tracker | `/orders/:order_id/escrow` |
| 2 | Buyer Show-Cause Notice & Penalty Management | `/admin/compliance/penalties` |
| 3 | AI Negotiation Copilot | `/negotiation/:offer_id` |
| 4 | Webhook Resilience & Dispute Refund Console | `/admin/webhooks` |
| 5 | Live GPS Transit & Weighbridge Telemetry Sheet | `/logistics/telemetry/:lot_id` |
| 6 | Farmer Mobile Command Hub | `/farmer/dashboard` |
| 7 | FairBid Engine | `/listings/:listing_id/offers` |
| 8 | Collective Selling Hub | `/fpo/collective-selling` |
| 9 | Demand Radar | `/market/demand-radar` |
| 10 | Mandi Nodal Officer Arbitration Console | `/disputes/arbitration/:dispute_id` |
| 11 | Voice-to-Trade AI | `/listings/create/voice` |
| 12 | Buyer Trust Passport | `/buyers/:buyer_id/passport` |
| 13 | Payments Center & PayPal Sandbox Gateway | `/payments` |
| 14 | Logistics Intelligence | `/logistics` |
| 15 | Digital Crop Passport | `/passport/lot/:lot_id` |
| 16 | Dispute Shield | `/disputes` |
| 17 | Public Marketplace & Trade Gateway | `/` |

For every screen:

- Confirm the route loads.
- Confirm the page is accessible through appropriate navigation.
- Confirm it has no blank sections or broken components.
- Confirm buttons and navigation behave appropriately.
- Confirm responsive behaviour.
- Preserve the Stitch visual design as closely as practical.
- Check browser console errors.
- Check that the screen does not crash when data is unavailable.

**Important backend decision:**

Do not build new backend modules for these additional screens.

Use existing APIs wherever they already support the functionality. Where an API does not exist, retain the complete frontend screen and use clearly labelled prototype/demo or integration-pending states with illustrative data.

Do not present illustrative data as real transactions, verified telemetry, actual GPS tracking, or completed backend operations.

---

# 4. COMPLETE THE EXISTING FARMER-TO-BUYER MARKETPLACE WORKFLOW

This is the most important end-to-end functionality.

Use the existing FastAPI backend and MySQL database. Do not redesign the database or run migrations without explicit approval.

Verify the following workflow:

### A. Authentication

- Farmer login.
- Buyer login.
- Admin login.
- Correct role-based redirection.
- Protected routes.
- Logout.
- Expired-token handling.
- Session persistence and validation.
- Correct handling of unauthorized requests.

### B. Farmer workflow

- Farmer can access the dashboard.
- Farmer can create a produce listing.
- Listing is stored in MySQL.
- Farmer can view their own listings.
- Farmer can edit or deactivate listings where supported.
- Farmer can view offers received on their own listings.
- Farmer can accept an offer on their own listing.

### C. Buyer workflow

- Buyer can access the marketplace.
- Buyer can browse active listings.
- Buyer can inspect listing details.
- Buyer can submit an offer.
- Offer is persisted in MySQL.
- Buyer can view their own offers and orders.
- Buyer cannot access another buyer's private information.

### D. Offer acceptance and order creation

Verify:

- Farmer can accept an offer on their own listing.
- Listing transitions to the appropriate order-created state.
- A real order record is created in MySQL.
- Correct buyer and farmer IDs are associated.
- Crop, quantity, price, transport cost, gross amount, and net proceeds are correct.
- Duplicate acceptance is prevented.
- The buyer and farmer can see the correct order.
- Unrelated users cannot access the order.

Do not use fake success messages to hide API failures.

---

# 5. ROLE-BASED ACCESS CONTROL AND SECURITY

Review the existing authentication and authorization implementation.

Use the existing RBAC tests and test coverage as a reference, including the supplied RBAC test material if it is available in the project.

Verify the following:

1. Unauthenticated users cannot access protected endpoints.
2. Buyers cannot accept farmer offers.
3. Farmers cannot submit buyer offers.
4. Farmers cannot view offers belonging to other farmers.
5. Farmers cannot accept offers on other farmers' listings.
6. Buyers cannot create farmer listings.
7. Admins have authorised oversight access.
8. Buyers cannot initiate payments for another buyer's order.
9. Expired JWT tokens are rejected.
10. Database errors must not cause the application to trust unverified JWT role claims.

Also verify:

- Passwords are securely hashed.
- JWT secrets are configured through environment variables.
- No hardcoded production secrets.
- CORS is appropriately restricted.
- API errors do not expose sensitive internal details.
- User data is scoped to the authenticated user.
- Admin-only routes are protected.
- Frontend role guards are not treated as a substitute for backend authorization.

**Important:** A hidden frontend button is not security. The backend must enforce permissions.

---

# 6. PAYPAL SANDBOX — VERIFY THE COMPLETE PAYMENT FLOW

PayPal is an important feature and must be demonstrated if the existing integration works.

Preserve the existing PayPal Sandbox integration.

Verify the complete flow:

1. Buyer selects an eligible order.
2. Backend validates order ownership and payment status.
3. Backend creates a PayPal Sandbox order.
4. Buyer is redirected to or shown the PayPal checkout flow.
5. Buyer authorizes the payment.
6. Backend captures the payment.
7. Backend validates the captured amount and currency against the FarmPay order.
8. Capture ID and transaction details are persisted.
9. Correct FarmPay order is marked with the appropriate payment status.
10. Buyer and farmer can see the updated status.
11. Duplicate capture attempts are safely handled.
12. Cancelled and failed payments are handled correctly.

Check the existing PayPal implementation for:

- Capture ID persistence.
- Correct association with the FarmPay order.
- PayPal response variations.
- Amount and currency validation.
- Duplicate processing.
- Failure and cancellation paths.

**Do not claim real INR settlement.**

The current integration is PayPal Sandbox using test checkout. Clearly label it as a sandbox demonstration, not a production payment gateway.

If PayPal credentials or external services are unavailable, document the exact blocker and ensure the rest of the marketplace still works.

---

# 7. VERIFY THE THREE CORE FARM PAY INNOVATIONS

Do not add new AI features. Complete and verify the existing ones.

### A. Voice-to-Trade AI

Route: `/listings/create/voice`

Verify:

- Browser microphone permission handling.
- Speech recognition where supported.
- English, Telugu, and Hindi support where available.
- Editable speech transcript.
- Extraction of crop, quantity, price, and location.
- Missing-field prompts.
- Manual text fallback.
- User confirmation before publishing.
- Successful listing creation through the existing API.

Never publish a listing without the user's explicit confirmation.

### B. FarmPay FairBid

Route: `/listings/:listing_id/offers`

Verify the comparison uses actual available offer information:

- Quoted price.
- Offered quantity.
- Gross amount.
- Transport cost.
- Known deductions.
- Net proceeds.
- Net realisation per kg.
- Collection feasibility and other available relevant factors.

The system must explain why an offer is preferable.

Do not simply recommend the highest quoted price.

Do not invent missing numbers or claim that illustrative offers are real offers.

### C. Buyer Trust Passport

Route: `/buyers/:buyer_id/passport`

Verify that the screen uses actual available buyer and transaction records.

Display available information such as:

- Completed orders.
- Fulfilment history.
- Payment history.
- Cancellations.
- Transaction records.

Do not generate fake buyer trust scores.

For new buyers without transaction history, clearly show that insufficient history is available.

### D. AI Negotiation Copilot and Demand Radar

Retain both screens and verify the existing frontend behaviour.

Use the existing AI integration where available.

If the AI provider is unavailable:

- Display a clear fallback state.
- Do not crash the screen.
- Do not invent AI-generated results.
- Clearly distinguish suggestions from verified marketplace information.

---

# 8. ALL OTHER STITCH SCREENS — KEEP AS ADDITIONAL FEATURES

Retain the following screens as additional features:

- Order Escrow.
- Buyer Penalty Management.
- Webhook Resilience.
- Logistics Telemetry.
- Collective Selling.
- Mandi Arbitration.
- Logistics Intelligence.
- Digital Crop Passport.
- Dispute Shield.
- Farmer Command Hub.

These screens must remain accessible and visually complete.

Use existing backend functionality where available. Otherwise, provide a clearly labelled prototype/demo state.

Do not spend the remaining deadline creating additional backend services for these screens.

---

# 9. FRONTEND QUALITY AND RESPONSIVENESS

Review the entire website.

Check:

- Landing page.
- Navbar.
- Footer.
- Login and registration.
- Farmer dashboard.
- Buyer dashboard.
- Admin dashboard.
- Marketplace.
- Listing details.
- Offer management.
- Order management.
- Payment centre.
- All additional Stitch screens.

Requirements:

- Consistent FarmPay design.
- Forest green, warm cream, amber, and terracotta visual palette.
- Clear typography and readable financial information.
- Responsive desktop and mobile layouts.
- Functional navigation.
- Loading states.
- Empty states.
- Error states.
- Form validation.
- Confirmation before important actions.
- No broken images.
- No horizontal overflow on mobile.
- No blank pages.
- No dead-end navigation.

Do not unnecessarily redesign already working pages.

---

# 10. ADMIN DASHBOARD

Verify the existing admin dashboard.

It should correctly display available database-backed information, such as:

- Total users.
- Farmers.
- Buyers.
- Active listings.
- Orders.
- Payment status.
- Marketplace activity.

Do not use fake fallback metrics.

If a metric is unavailable, display an appropriate unavailable state rather than fabricating a value.

Verify admin-only access at the backend.

---

# 11. TESTING — ACTUALLY RUN THE TESTS

Do not rely on code inspection alone.

### Frontend

- Run the production build.
- Check all routes.
- Check authentication flows.
- Check forms and buttons.
- Check API integration.
- Check responsive layouts.
- Check browser console errors.
- Check network failures.

### Backend

Run the existing automated test suite.

Include the RBAC and workflow scenarios described above.

Verify:

- Authentication.
- Authorization.
- Listing creation.
- Offer submission.
- Offer acceptance.
- Order creation.
- Order ownership.
- Payment authorization.
- PayPal capture behaviour.
- Error handling.

### Database

Verify existing MySQL connectivity and persistence.

Use the existing schema. Do not run destructive SQL, migrations, or seed scripts.

### End-to-end demo

Test this complete sequence:

1. Farmer logs in.
2. Farmer creates a produce listing.
3. Buyer logs in.
4. Buyer views the listing.
5. Buyer submits an offer.
6. Farmer views the offer.
7. Farmer accepts the offer.
8. FarmPay creates an order.
9. Buyer completes PayPal Sandbox checkout if available.
10. Payment status is updated.
11. Farmer and buyer can view their order.
12. Admin can view the authorised marketplace information.

Record which steps were genuinely tested and which remain blocked.

---

# 12. DEPLOYMENT AND SUBMISSION READINESS

If the project can be deployed safely using existing configuration and available free resources, prepare deployment.

Do not spend excessive time on deployment if it risks breaking the working local prototype.

If deployment is blocked, provide:

- Exact blocker.
- Required configuration names (never their secret values).
- Commands to run frontend and backend.
- MySQL setup requirements.
- Local demo instructions.
- A clear explanation of what judges can demonstrate.

Ensure the application can run reliably on the local machine.

---

# 13. MANDATORY PROJECT DOCUMENTATION

This is compulsory.

All reports and records must be saved under:

`project_docs/`

Create and maintain:

- `project_docs/phase_prompts/`
- `project_docs/audits/`
- `project_docs/test_reports/`
- `project_docs/implementation_reports/`
- `project_docs/submission/`

For every phase:

1. Save the exact prompt used.
2. Save the audit findings.
3. Save implementation details.
4. Save test results.
5. Save security findings.
6. Record decisions.
7. Record known issues.
8. Record blockers.
9. Record phase completion status.
10. Update `project_docs/current_progress.md`.

Use dated filenames, for example:

`final_sprint_audit_2026_11_10.md`

`final_sprint_test_report_2026_11_10.md`

`final_sprint_implementation_report_2026_11_10.md`

`submission_readiness_2026_11_10.md`

Never overwrite previous audit reports or historical records.

Maintain a 17-screen acceptance matrix showing the route, implementation status, build status, navigation status, testing status, and known issues.

Use only these completion labels:

- IMPLEMENTED AND VERIFIED
- IMPLEMENTED BUT UNVERIFIED
- PARTIALLY IMPLEMENTED
- NOT IMPLEMENTED
- BLOCKED

Never mark a task complete based only on creating a file or component.

---

# 14. GIT AND DATA SAFETY

Mandatory:

- Preserve the current working tree.
- Do not discard uncommitted modifications.
- Do not delete untracked files without approval.
- Do not run `git reset --hard`.
- Do not run `git clean -fd`.
- Do not perform destructive checkout operations.
- Do not overwrite existing project documentation.
- Do not change the database schema without approval.
- Do not run destructive SQL.
- Do not run database migrations or seed scripts.
- Do not commit or push without my explicit approval.

Before making changes, inspect `git status` and record the starting state.

---

# 15. EXECUTION ORDER — WORK IN THIS ORDER

Do not spend time implementing low-priority screens before the core workflow works.

**Priority 1:** Inspect the project and fix the frontend build failure.

**Priority 2:** Verify all 17 routes and navigation.

**Priority 3:** Complete the farmer-to-buyer listing, offer, acceptance, and order workflow.

**Priority 4:** Verify PayPal Sandbox end to end.

**Priority 5:** Verify Voice-to-Trade, FairBid, and Buyer Trust Passport.

**Priority 6:** Verify authentication, RBAC, and data isolation.

**Priority 7:** Verify the additional Stitch screens and their honest prototype states.

**Priority 8:** Run backend tests, frontend build, and end-to-end checks.

**Priority 9:** Prepare deployment or a reliable local demo.

**Priority 10:** Prepare submission documentation and the final demonstration checklist.

If time becomes limited, prioritise a stable working marketplace and payment demonstration over cosmetic changes.

---

# 16. FINAL ACCEPTANCE CRITERIA

The project is ready for hackathon demonstration only when the following are verified:

- [ ] Frontend production build succeeds.
- [ ] Backend starts successfully.
- [ ] MySQL connection works.
- [ ] Farmer login works.
- [ ] Buyer login works.
- [ ] Admin login works.
- [ ] Farmer can create a listing.
- [ ] Buyer can browse listings.
- [ ] Buyer can submit an offer.
- [ ] Farmer can accept their own listing's offer.
- [ ] Correct order is created and persisted.
- [ ] RBAC prevents unauthorised operations.
- [ ] PayPal Sandbox flow is verified or its blocker is documented.
- [ ] Voice-to-Trade works or its browser/provider limitation is documented.
- [ ] FairBid calculations are grounded in actual offer data.
- [ ] Buyer Trust Passport does not fabricate trust history.
- [ ] All 17 Stitch screens remain accessible.
- [ ] Additional screens clearly distinguish demo data from real data.
- [ ] Admin dashboard uses genuine available data.
- [ ] Mobile and desktop layouts are usable.
- [ ] No critical frontend or backend errors remain.
- [ ] Documentation and progress reports are updated.
- [ ] Local demo instructions are ready.
- [ ] Final known issues are documented.

---

# 17. FINAL REPORT — REQUIRED BEFORE STOPPING

At the end, provide a concise but complete report containing:

1. What you inspected.
2. What you fixed.
3. Exact cause of the original build failure.
4. Frontend production build result.
5. Backend test result and number of tests passed/failed.
6. Farmer workflow result.
7. Buyer workflow result.
8. Offer acceptance and order creation result.
9. PayPal Sandbox result.
10. AI feature verification results.
11. RBAC and security verification results.
12. Status of all 17 Stitch screens.
13. Deployment status.
14. Remaining blockers and known issues.
15. Exact commands to start the application.
16. Recommended demonstration sequence for judges.
17. Overall submission readiness.

Clearly distinguish **verified functionality** from **unverified or prototype functionality**.

Do not claim that the application is production-ready if it is only a hackathon prototype.

## FINAL INSTRUCTION

Start by inspecting the actual current project and reproducing the failed build. Then fix and verify the application in the priority order above.

**Do not ask me to repeat project details already provided. Do not add new features. Do not create unnecessary backend modules. Do not waste time rewriting working code. Preserve existing work and focus entirely on delivering a stable, fully demonstrable FarmPay AI prototype before the 11 November 2026 submission deadline.**
