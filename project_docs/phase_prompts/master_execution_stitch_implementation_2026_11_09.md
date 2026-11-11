# MASTER EXECUTION PROMPT — FARM PAY AI COMPLETE STITCH-TO-FUNCTIONAL-APPLICATION IMPLEMENTATION

Act as a senior full-stack architect, frontend engineer, backend engineer, UI/UX implementation specialist and QA engineer.

Your task is to transform the existing FarmPay AI application into a complete, polished, responsive, hackathon-ready agricultural commerce platform using the exported Google Stitch designs.

This is an implementation task. Do not stop after planning, auditing or writing documentation.

# 1. EXISTING PROJECT

Project directory:

C:\Users\DELL-PC\FarmPay-AI

The Stitch project has already been successfully retrieved and exported.

Read these files first:

- DESIGN.md
- project_docs/stitch_reference/SCREEN_INVENTORY.md
- project_docs/stitch_reference/screens_manifest.json
- project_docs/stitch_reference/design_theme.json
- project_docs/stitch_reference/design_theme.md
- project_docs/stitch_reference/project_metadata.json

All 17 screens have exported HTML, screenshots and metadata.

Use the existing exported files. Do not unnecessarily retrieve or regenerate the Stitch project.

# 2. ABSOLUTE REQUIREMENT — PRESERVE ALL 17 APPROVED SCREENS

I personally selected and approved all the screens in Stitch.

Every one of the 17 screens MUST be included in the final website.

THIS REQUIREMENT IS NON-NEGOTIABLE.

Do not:
- Remove any screen.
- Ignore screens because backend APIs do not exist.
- Hide screens because database tables are unavailable.
- Replace advanced screens with simplified versions.
- Merge separate screens and lose their unique functionality.
- Decide independently that some screens are unnecessary.
- Remove a screen because its user role is not yet implemented.
- Replace an approved screen with a generic dashboard.

All 17 screens must have:
- A real frontend implementation.
- Their own intended route.
- Navigation or an appropriate contextual entry point.
- Responsive desktop and mobile layouts where applicable.
- Working buttons, forms, filters, tabs and interactions where represented.
- Loading, empty, error and unavailable states where appropriate.

Use the exported Stitch HTML and screenshots as the design reference.

# 3. IMPORTANT — WHAT TO DO WHEN BACKEND DATA IS UNAVAILABLE

A screen must NEVER be removed just because its backend is incomplete.

Implement two clearly distinguishable layers:

A. Frontend screen implementation:
- Preserve the complete Stitch design.
- Implement its layout and components.
- Implement its frontend interactions.
- Provide meaningful empty states.
- Provide realistic illustrative demonstration data when needed.
- Ensure the page can be opened and demonstrated.

B. Backend integration:
- Connect actual API functionality where it exists.
- Where an API does not exist, keep the frontend screen intact.
- Show a clear message such as "Backend integration pending" or "Demo data".
- Use an explicitly labelled demonstration mode where appropriate.
- Never present fabricated records, transactions, telemetry, penalties, inspections or analytics as real.
- Never claim an operation succeeded when no backend operation occurred.

For missing backend functionality, build the UI and document the required API/database work for a subsequent implementation phase.

Where useful, implement frontend-only interactions using controlled local state and clearly labelled prototype data. Do not silently save fake records as genuine transactions.

A missing backend must never be used as an excuse to remove an approved screen.

# 4. THE 17 SCREENS TO IMPLEMENT

Implement every screen from the existing screen inventory.

1. Order Escrow & Fulfillment Milestone Tracker
   Route: /orders/:order_id/escrow

2. Buyer Show-Cause Notice & Penalty Management
   Route: /admin/compliance/penalties

3. FarmPay AI Negotiation Copilot
   Route: /negotiation/:offer_id

4. Webhook Resilience & Dispute Refund Console
   Route: /admin/webhooks

5. Live GPS Transit & Weighbridge Telemetry Sheet
   Route: /logistics/telemetry/:lot_id

6. Farmer Mobile Command Hub
   Route: /farmer/dashboard

7. FairBid Engine — Transparent Net Earnings Comparison
   Route: /listings/:listing_id/offers

8. Collective Selling Hub — FPO Pools
   Route: /fpo/collective-selling

9. Demand Radar
   Route: /market/demand-radar

10. Mandi Nodal Officer — Dispute Arbitration Decision Console
    Route: /disputes/arbitration/:dispute_id

11. Voice-to-Trade AI — Voice Listing Studio
    Route: /listings/create/voice

12. Buyer Trust Passport
    Route: /buyers/:buyer_id/passport

13. Payments Center & PayPal Sandbox Gateway
    Route: /payments

14. Logistics Intelligence
    Route: /logistics

15. Digital Crop Passport
    Route: /passport/lot/:lot_id

16. Dispute Shield
    Route: /disputes

17. Public Marketplace & Trade Gateway
    Route: /

Verify every route against the existing React Router setup before implementation.

Do not duplicate routes or break existing working routes.

# 5. DESIGN SYSTEM — FOLLOW STITCH EXACTLY

The approved Stitch design uses Terra — Organic Design, with the concept "Rooted Warmth".

Preserve the design language:

- Primary forest green: #4a7c59
- Background warm cream: #faf6f0
- Tertiary/escrow warm amber: #705c30 and #c4a66a
- Dispute/error terracotta: #b83230
- Layered cream surfaces.
- Literata for headings.
- Nunito Sans for body text and UI labels.
- Monospace for financial values and lot identifiers.
- 12px standard corner radius.
- Generous spacing and minimum 48px touch targets.

Do not introduce an unrelated blue SaaS theme.

Do not redesign the approved screens unnecessarily.

Match the Stitch screenshots as closely as possible, including:
- Page structure.
- Sidebar and navigation.
- Card dimensions.
- Typography hierarchy.
- Tables.
- Buttons.
- Icons.
- Colors.
- Spacing.
- Charts.
- Responsive behaviour.

Use actual exported assets wherever possible.

# 6. PRESERVE THE EXISTING TECHNOLOGY STACK

Mandatory existing architecture:

Frontend:
- React
- Vite
- Existing React Router
- Existing frontend dependencies where suitable.

Backend:
- Python
- FastAPI
- MySQL 8
- PyMySQL.

Do not migrate to PostgreSQL, Next.js, TanStack Router or another framework.

Do not scaffold a second application.

Do not create a separate frontend that is disconnected from the existing application.

# 7. CONNECT THE EXISTING BACKEND

Inspect the current backend before implementing integrations.

Preserve existing:
- Authentication.
- JWT validation.
- Role-based permissions.
- Marketplace APIs.
- Listing APIs.
- Offer APIs.
- Order APIs.
- Payment APIs.
- AI integration.
- MySQL database operations.

Connect actual API data to the appropriate screens.

Do not invent API endpoints, database columns or table names without inspecting the codebase and current database integration.

If a required endpoint does not exist, document it and implement it carefully using the existing architecture.

Do not execute database migrations, alter existing schema, seed data or perform destructive SQL operations without explicit approval.

# 8. PAYPAL — CRITICAL PRIORITY

The PayPal Payments Center is one of the most important approved screens.

Preserve and enhance the existing PayPal Sandbox integration.

Implement and verify:

1. PayPal order creation.
2. Correct order amount.
3. PayPal Sandbox checkout.
4. Buyer authorization.
5. Backend payment capture.
6. Server-side capture validation.
7. Amount and currency validation.
8. Transaction ID persistence.
9. Correct association with the FarmPay order.
10. Duplicate capture protection.
11. Pending, successful, failed and cancelled states.
12. Payment history for buyer and farmer.
13. Admin transaction monitoring.
14. Transaction details and receipts.

The website must prominently display the PayPal payment experience.

Clearly label Sandbox payments as test transactions.

Do not claim real INR settlement or live-money processing unless implemented and verified.

Never expose PayPal secrets or credentials in frontend code.

Preserve existing payment security logic.

# 9. IMPLEMENT THE THREE CORE INNOVATIONS

VOICE-TO-TRADE:
- Real browser speech recognition where supported.
- English, Telugu and Hindi language selection.
- Editable transcript.
- Crop, quantity, price and location extraction.
- Missing-field handling.
- Explicit confirmation before publishing.
- Manual entry fallback.

FAIRBID:
- Actual available offers.
- Deterministic net-realisation calculations.
- Gross amount.
- Known deductions.
- Transport charges.
- Net proceeds.
- Net amount per kilogram.
- Explainable comparisons.
- Honest handling of missing information.

BUYER TRUST PASSPORT:
- Actual transaction history.
- Completed orders.
- Cancellations.
- Fulfilment history.
- Payment history.
- Insufficient-history state.
- No fabricated trust scores or verification claims.

# 10. IMPLEMENT ALL ADVANCED APPROVED FEATURES

Keep and implement the following screens and features even if some integrations are initially demonstration-only:

- Collective Selling and FPO pools.
- Buyer demand intelligence.
- AI negotiation assistant.
- Escrow and fulfilment milestones.
- GPS transit telemetry.
- Weighbridge telemetry.
- Digital crop traceability.
- Logistics planning.
- Dispute evidence submission.
- Dispute arbitration.
- Buyer penalty management.
- Webhook monitoring.
- Refund management.

For screens involving Mandi Officers, FPO Leads, Transporters, Inspectors or other roles not currently supported by authentication, preserve the screens and their routes.

Do not silently invent privileged access or bypass security.

Provide a clear, honest prototype or role-access-pending state until the actual role and authorization are implemented.

# 11. COMPLETE THE MAIN MARKETPLACE WORKFLOW

Verify this end-to-end:

Farmer registers.
→ Farmer logs in.
→ Farmer creates a crop listing.
→ Listing is saved in MySQL.
→ Buyer discovers the listing.
→ Buyer submits an offer.
→ Farmer compares offers using FairBid.
→ Farmer accepts an offer.
→ FarmPay order is created.
→ Buyer completes PayPal Sandbox checkout.
→ Backend captures and validates payment.
→ Transaction is saved.
→ Farmer and buyer can view order and payment status.
→ Admin can monitor the transaction.

Use real application data and test accounts where available.

# 12. VISUAL QUALITY AND RESPONSIVENESS

The final website must be:
- Premium.
- Professional.
- Consistent.
- Responsive.
- Mobile-friendly.
- Easy for farmers to understand.
- Suitable for a hackathon demonstration.

Test desktop and mobile layouts.

Check:
- Horizontal overflow.
- Broken navigation.
- Inconsistent cards.
- Missing images.
- Incorrect spacing.
- Text wrapping.
- Forms.
- Loading states.
- Empty states.
- Error states.
- Console errors.

Compare implemented screens with the actual exported Stitch screenshots.

# 13. CLEAN THE PROJECT SAFELY

After implementation:
- Remove genuinely unused components only after checking references.
- Remove duplicate styles where safe.
- Remove dead imports.
- Remove unnecessary dependencies only after verifying usage.
- Consolidate reusable UI components.
- Keep code organized.
- Keep API calls centralized.
- Keep configuration secure.
- Do not expose credentials.
- Do not break existing working features.

Do not perform destructive Git operations.

Do not use:
- git reset --hard
- git clean -fd
- destructive checkout operations.

The existing worktree contains prior work. Preserve all uncommitted changes.

Do not commit or push without explicit approval.

# 14. TESTING AND VERIFICATION

Run:
- Frontend lint.
- Frontend production build.
- Backend tests.
- Actual browser tests.
- API integration checks.
- MySQL connectivity checks where available.
- Responsive checks.

Test all 17 routes.

For every screen record:
- Route.
- Render status.
- Design implementation status.
- Interactions tested.
- Backend integration status.
- Screenshot evidence.
- Known limitations.

Do not mark a feature verified based only on code inspection.

# 15. MANDATORY DOCUMENTATION

Save the exact prompt under:

project_docs/phase_prompts/

Save all:
- Audits.
- Implementation reports.
- Test results.
- Screenshots.
- API findings.
- Database findings.
- Security findings.
- Decisions.
- Known issues.
- Phase completion records.

Use dated and versioned report filenames.

Never overwrite previous reports.

Update:

project_docs/current_progress.md

after each implementation phase.

For every feature use one of these exact statuses:

- IMPLEMENTED AND VERIFIED
- IMPLEMENTED BUT UNVERIFIED
- PARTIALLY IMPLEMENTED
- NOT IMPLEMENTED
- BLOCKED

Maintain a complete 17-screen implementation matrix.

# 16. EXECUTION STRATEGY

Work in the following phases:

Phase 1: Inspect existing application and map all 17 Stitch screens.

Phase 2: Establish reusable design system and implement all 17 frontend screens and routes.

Phase 3: Connect existing authentication, marketplace, listings, offers and orders.

Phase 4: Complete PayPal Sandbox integration and payment monitoring.

Phase 5: Integrate Voice-to-Trade, FairBid and Buyer Trust Passport.

Phase 6: Implement advanced features and their backend integrations where possible. Preserve all screens if integrations are pending.

Phase 7: Complete browser testing, responsive corrections, cleanup and documentation.

Do not stop after Phase 1.

Do not produce only a plan.

Make actual code changes and verify them.

If a phase encounters an external API, quota, network or dependency issue, continue with independent tasks and preserve the affected screen using a clearly labelled fallback state.

# FINAL DEFINITION OF DONE

The final result must be the existing FarmPay AI project, not a newly scaffolded replacement.

All 17 approved Stitch screens must remain present and accessible through their intended routes.

Every screen must have a complete frontend implementation, even if its backend integration is pending.

Existing working backend integrations must be preserved.

The core farmer-to-buyer workflow and PayPal Sandbox workflow must be tested.

No fake live data, fake payment confirmations or fabricated verification claims.

The final project must build, be responsive, be organized, and be ready for a credible hackathon demonstration.

Start implementation now. Prioritize visible website improvements and actual working functionality. Do not stop at audits or documentation.
