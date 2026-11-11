# FARMPAY AI — MASTER PROJECT COMPLETION & INTEGRATION ASSIGNMENT

You are the lead full-stack engineer responsible for completing my existing FarmPay AI application.

I have two codebases:

**1. Main application (the source of truth)**
`C:\Users\DELL-PC\FarmPay-AI`

**2. Lovable-generated frontend design (reference and source code)**
`C:\Users\DELL-PC\FarmPay-Lovable-Design`

Your responsibility is to inspect both projects, preserve the best parts of the Lovable design, and integrate them into the existing FarmPay AI application to produce one complete, professional, functional product.

This is a continuation of an existing project, NOT a new project.

---

# PHASE A — COMPLETE CODEBASE AUDIT BEFORE CHANGING ANYTHING

First, inspect both directories thoroughly.

### Main FarmPay AI application
Inspect:
- Existing React frontend and routing.
- FastAPI backend and all API endpoints.
- MySQL schema, migrations and database connectivity.
- Authentication, authorization and user roles.
- Existing farmer, buyer and admin workflows.
- AI integration and recommendation logic.
- PayPal Sandbox payment integration.
- Existing tests, configuration and environment variables.
- Current Git status and uncommitted changes.
- Existing project documentation.

### Lovable design project
Inspect:
- Every page, route and component.
- All layouts, styling, CSS, Tailwind configuration and themes.
- Images, icons, illustrations and static assets.
- Navigation and responsive behaviour.
- Language selector and translations.
- Forms, buttons, menus, modals and interactions.
- Existing TypeScript/JSX errors, including the known error in `src/components/farmpay.tsx`, in `LocaleSelect`.
- Dependencies and package configuration.

Produce a detailed comparison identifying:
1. What is already implemented in FarmPay AI.
2. What Lovable has designed.
3. What is missing in both.
4. What can be safely reused.
5. What needs modification before integration.
6. What existing working functionality must not be broken.

Save the audit under `project_docs/audit_reports/`.

Do not begin blindly replacing files.

# PHASE B — INTEGRATE THE LOVABLE DESIGN INTO THE REAL APPLICATION

Use the Lovable project as the primary visual reference.

I want the finished FarmPay AI website to retain the professional visual direction, page layouts, visual components, images, typography, spacing, backgrounds and design details already created in Lovable.

However, do not blindly copy its entire project over the existing frontend.

Instead:
- Reuse and adapt suitable Lovable components.
- Preserve the existing React application architecture wherever practical.
- Integrate its pages with the existing React Router setup.
- Connect components to actual FastAPI endpoints.
- Replace mock data with real backend data wherever the corresponding functionality exists.
- Preserve existing authentication and PayPal integration.
- Fix all JSX, TypeScript, dependency and build issues.
- Remove duplicate components and conflicting CSS.
- Maintain a consistent design system across all pages.

Do not introduce a separate Supabase backend or replace FastAPI/MySQL.

Do not introduce a second independent application.

The final result must run as one application.

# PHASE C — COMPLETE WEBSITE DESIGN AND USER EXPERIENCE

Build a professional, polished agricultural service platform.

Design inspiration: trustworthy, accessible Indian public-service websites and platforms such as My Bharat and e-NAM.

Do not copy government logos, emblems, branding or imply government affiliation.

### Design requirements

- Full-width, responsive layouts.
- Professional homepage with clear navigation.
- Attractive agricultural imagery and appropriate backgrounds.
- Spacious layouts instead of cramped cards.
- Consistent typography, colours, spacing and buttons.
- Clear visual hierarchy.
- Mobile-first design.
- Minimum 48px touch targets where practical.
- Accessible contrast and readable text.
- Loading, success, error and empty states.
- Useful confirmation messages.
- Responsive layouts for desktop, tablet and mobile.

Do not create a generic AI dashboard.

The website must feel like a complete, trustworthy agricultural marketplace that a real farmer can use.

### Required pages

1. Public homepage.
2. Language selection.
3. Login.
4. Farmer registration.
5. Buyer registration.
6. Farmer dashboard.
7. Buyer dashboard / marketplace.
8. Farmer profile.
9. Buyer profile.
10. Admin dashboard.
11. Create produce listing.
12. Voice-to-Trade.
13. FairBid recommendation and offer comparison.
14. Listing details.
15. Offer management.
16. Order details and tracking.
17. Payment history.
18. Notifications and account settings.

Retain and adapt any other useful pages already present.

# PHASE D — COMPLETE MULTILINGUAL IMPLEMENTATION

Implement English, Telugu and Hindi throughout the application.

The language selector must be available before login and remain accessible after login.

Translations must cover:
- Navigation.
- Homepage.
- Login and registration.
- Forms and field labels.
- Validation messages.
- Error messages.
- Success notifications.
- Farmer dashboard.
- Buyer dashboard.
- Admin dashboard.
- Profiles.
- Tables and filters.
- Listing and offer information.
- AI recommendation explanations.
- Voice-to-Trade instructions.
- Order and payment information.
- Modals and confirmation dialogs.

Requirements:
- Centralised translation architecture.
- No scattered hardcoded user-facing strings.
- Persist the selected language.
- Save the preferred language in the user's profile.
- Restore the preference after login.
- Handle missing translations gracefully.
- Display AI explanations in the selected language.
- Do not translate IDs, API field names or database values in a way that breaks functionality.

Test each language across all major workflows.

# PHASE E — AUTHENTICATION AND USER PROFILES

Complete role-based authentication for:

- FARMER
- BUYER
- ADMIN

Use the existing FastAPI authentication system.

Requirements:
- Secure registration and login.
- Password hashing.
- JWT-based authentication.
- Role-based authorization.
- Protected frontend routes.
- Correct logout behaviour.
- Session handling.
- Appropriate error messages.

### Farmer profile

Include:
- Full name.
- Mobile number.
- Email.
- Village.
- District.
- State.
- Preferred language.
- Farming information.
- Profile editing.

### Buyer profile

Include:
- Buyer / business name.
- Contact person.
- Mobile number.
- Email.
- Business address.
- District and state.
- Buyer type.
- Verification status.
- Preferred crops.
- Profile editing.

### Admin profile

Include:
- Admin identity.
- Contact details.
- Role and permissions.
- Account settings.

Do not expose private user information to other roles.

# PHASE F — FARMER MARKETPLACE WORKFLOW

The farmer experience must be extremely simple.

A farmer should be able to:

1. Register or log in.
2. Select Telugu, Hindi or English.
3. View a simple dashboard.
4. Create a produce listing.
5. Enter crop, quantity, quality/grade, expected price and location.
6. Review the information.
7. Publish the listing.
8. Receive buyer offers.
9. Compare offers.
10. View estimated net earnings.
11. Accept or reject an offer.
12. View order information.
13. Track delivery and payment status.
14. View transaction history.

Build clear step-by-step forms.

Avoid overwhelming farmers with unnecessary information.

Use plain language and clear action buttons.

# PHASE G — BUYER MARKETPLACE WORKFLOW

Buyers must be able to:

1. Register and log in.
2. Complete their buyer profile.
3. Browse active produce listings.
4. Filter by crop, location, quantity and price.
5. View listing details.
6. Submit an offer.
7. View their submitted offers.
8. Update or withdraw offers where permitted.
9. View offer acceptance or rejection.
10. Track confirmed orders.
11. View their transaction history.

Enforce all business rules on the backend.

Do not trust frontend-supplied buyer IDs, roles or financial values.

# PHASE H — FARMPAY FAIRBID INTELLIGENCE

Implement FarmPay FairBid as the main decision-support feature.

Its purpose is to help farmers compare offers based on actual expected earnings rather than simply selecting the highest quoted price.

Compare:
- Gross offer amount.
- Known transport charges.
- Other verified charges, where applicable.
- Net proceeds.
- Net earnings per kilogram.
- Quantity and quality requirements.
- Collection arrangements.
- Verified buyer transaction history.
- Farmer preferences.

Example:

Buyer A:
- Gross amount: ₹13,000.
- Transport: ₹200.
- Net proceeds: ₹12,800.

Buyer B:
- Gross amount: ₹12,750.
- Transport: ₹0.
- Net proceeds: ₹12,750.

Explain why the offers differ and which one better matches the farmer's selected preference.

### Strict rules

- Financial calculations must be performed by deterministic backend code.
- AI must not invent offers, buyer IDs, prices or transaction history.
- AI must not accept offers.
- AI must not execute payments.
- AI must not change transaction records.
- A new buyer without sufficient history must be labelled "Insufficient transaction history".
- Do not create fake reliability scores.
- Clearly distinguish verified facts from estimates.

The farmer must make the final decision.

# PHASE I — BUYER TRUST PASSPORT

Create a buyer transparency section.

Show only information supported by verified platform records:
- Account verification status.
- Completed orders.
- Fulfilment history.
- Cancellation history.
- Payment performance, where recorded.
- Relevant transaction history.

Do not invent ratings or reputation scores.

If a buyer is new, clearly state that there is insufficient history.

# PHASE J — VOICE-TO-TRADE

Implement real voice-based produce listing assistance.

The farmer should be able to speak in Telugu, Hindi or English.

Example Telugu input:

"నాకు 500 కిలోల వరి అమ్మాలి. కిలోకు 25 రూపాయలు కావాలి. గుంటూరులో ఉంది."

Expected flow:

1. User selects their language.
2. User taps the microphone.
3. Browser speech recognition captures speech, where supported.
4. Convert speech into editable text.
5. Extract crop, quantity, expected price and location.
6. Identify missing required fields.
7. Ask the farmer for missing information.
8. Show a complete listing summary.
9. Read back or explain the summary where speech synthesis is supported.
10. Ask the farmer to confirm.
11. Publish only after explicit confirmation.

Technical requirements:
- Use browser speech recognition where available.
- Check browser compatibility.
- Provide manual text entry as a fallback.
- Allow transcript editing.
- Do not automatically publish speech-recognised content.
- Do not pretend voice recognition works when browser support is unavailable.
- Use the selected language for recognition and responses.
- Provide meaningful error and permission messages.

# PHASE K — AI INTEGRATION

Use the existing AI service architecture.

Primary provider:
- Groq API.
- Model: `openai/gpt-oss-20b`.

Use the existing environment configuration.

Never expose API keys in frontend code.

Do not hardcode API keys.

AI may:
- Explain FairBid recommendations.
- Summarise offers.
- Help interpret voice transcripts.
- Explain listing and marketplace information.
- Answer agricultural marketplace workflow questions.

AI must not:
- Invent real-time mandi prices.
- Invent buyer histories.
- Invent offer IDs.
- Modify financial calculations.
- Accept or reject offers.
- Execute payment operations.
- Bypass authentication or backend business rules.

Implement graceful rate-limit and provider-failure handling.

Keep deterministic fallback functionality available if Groq is unavailable.

Gemini or any other provider must remain optional and must not be required for the application to run.

Do not introduce paid API dependencies.

# PHASE L — ADMIN DASHBOARD

Build a genuine operational admin dashboard.

Remove the irrelevant Judge Verification Checklist from the application interface. Judging information belongs in `JUDGE_GUIDE.md`.

Admin capabilities:
- View registered farmers.
- View registered buyers.
- Review verification status.
- Manage accounts and roles within authorised permissions.
- View produce listings.
- Monitor offers.
- Monitor orders.
- View payment records.
- Manage crop categories where supported.
- Monitor AI service status.
- View platform activity and useful operational analytics.
- Review disputes or reported issues if the supporting workflow is implemented.

Security:
- Admin-only endpoints.
- Server-side role verification.
- Audit logs for sensitive administrative actions.
- No fake dashboard metrics.
- No fabricated user or transaction counts.

# PHASE M — PAYMENT AND ORDER INTEGRATION

Preserve the existing PayPal Sandbox integration.

Do not break the Phase 1.1 capture validation fix.

Maintain the distinction between:
- FarmPay marketplace orders and INR values.
- PayPal Sandbox test payments in USD.

Do not falsely claim that a PayPal Sandbox payment settles an INR marketplace order.

Requirements:
- Preserve payment creation and capture validation.
- Preserve PayPal order identity validation.
- Preserve capture ID persistence.
- Prevent duplicate capture processing.
- Maintain correct payment statuses.
- Display payment history and order status accurately.
- Handle cancellation and failure states.
- Never mark an order paid without verified payment confirmation.

Do not claim that production UPI, escrow or domestic INR settlement is implemented unless an actual supported payment integration exists.

# PHASE N — DATABASE AND BACKEND INTEGRATION

Keep the existing stack:

Frontend:
- React.
- Vite.
- Existing routing and styling architecture.

Backend:
- Python.
- FastAPI.
- Pydantic.
- JWT authentication.

Database:
- MySQL 8.
- PyMySQL.

Do not migrate to PostgreSQL.

Inspect the current schema before changing it.

Requirements:
- Preserve existing orders and payment records.
- Use proper relational constraints.
- Use transactions for important operations.
- Validate all incoming data.
- Enforce role permissions.
- Use parameterised database queries.
- Add indexes where justified.
- Create safe incremental migrations.
- Avoid destructive migrations.
- Do not delete existing user or transaction data.

# PHASE O — SECURITY, ACCESSIBILITY AND RELIABILITY

Perform a security review covering:
- Authentication.
- Authorisation.
- Password storage.
- JWT handling.
- Input validation.
- SQL injection.
- Cross-origin configuration.
- Secret management.
- Error handling.
- Sensitive information exposure.
- Payment verification.
- Administrative access.

Do not put secrets in Git.

Preserve `.env` and `.env.local` exclusions.

Ensure the application does not expose stack traces or sensitive configuration to end users.

Accessibility:
- Keyboard navigation.
- Labels for form fields.
- Accessible contrast.
- Responsive layouts.
- Clear focus states.
- Screen-reader-friendly controls where practical.

# PHASE P — TESTING AND END-TO-END VERIFICATION

Test the actual application, not just individual components.

### Backend
- Registration.
- Login.
- Role-based permissions.
- Profile retrieval and updates.
- Listing creation.
- Listing discovery.
- Offer submission.
- Offer management.
- FairBid recommendation.
- Offer acceptance.
- Order creation.
- Payment validation.
- Admin access restrictions.

### Frontend
- Build.
- Lint.
- Routing.
- Language switching.
- Forms and validation.
- Responsive layouts.
- Authentication state.
- Farmer workflows.
- Buyer workflows.
- Admin workflows.
- Voice-to-Trade with supported and unsupported browser scenarios.

### End-to-end
Verify this complete journey:

1. Farmer registers.
2. Farmer creates a produce listing.
3. Buyer logs in.
4. Buyer discovers the listing.
5. Buyer submits an offer.
6. Another buyer submits a competing offer.
7. Farmer views competing offers.
8. FairBid compares net proceeds.
9. Farmer accepts an offer.
10. Order is generated.
11. Farmer and buyer can see the order.
12. Payment flow is handled correctly using the existing Sandbox integration.
13. Admin can monitor the relevant records.

Test Telugu, Hindi and English for all major journeys.

Do not use production payment credentials or real financial transactions.

Report exact test counts and failures. Never claim a test passed unless it was actually executed.

# PHASE Q — DOCUMENTATION AND DELIVERY

Documentation is mandatory.

Store all work under `project_docs/`.

Create dated reports for:
- Initial dual-codebase audit.
- Lovable design assessment.
- Integration architecture.
- Design-system decisions.
- Frontend implementation.
- Backend implementation.
- Database changes.
- AI architecture.
- Voice-to-Trade implementation.
- Security audit.
- Accessibility review.
- Test results.
- End-to-end verification.
- Known issues.
- Final completion assessment.

Do not overwrite historical reports. Create new dated files.

Update:
- `CURRENT_PROGRESS.md`
- `README.md`
- `JUDGE_GUIDE.md`
- `.env.example` files, where necessary.

Create a `phase_prompts/` folder and save this complete approved assignment in it.

The documentation must distinguish:
- Implemented and verified.
- Implemented but not fully verified.
- Partially implemented.
- Not implemented.
- Blocked by external configuration.

Provide clear local run instructions for Windows.

# PHASE R — FINAL DELIVERY REQUIREMENTS

At completion, provide:

1. Summary of the Lovable design successfully integrated.
2. List of all completed pages.
3. List of completed farmer, buyer and admin workflows.
4. Multilingual implementation status.
5. Voice-to-Trade implementation status.
6. FairBid and Buyer Trust Passport implementation status.
7. AI provider and fallback status.
8. Payment integration status.
9. Database changes.
10. Security findings.
11. Exact test results.
12. Build and lint results.
13. Remaining limitations.
14. Files changed and created.
15. Exact commands to run the application locally.
16. Recommended next steps before hackathon submission.

### STRICT WORKING RULES

- Work inside the existing `FarmPay-AI` project.
- Treat Lovable as the visual reference and reusable source code.
- Do not overwrite the existing backend.
- Do not remove working PayPal functionality.
- Do not migrate MySQL to another database.
- Do not introduce unnecessary paid services.
- Do not fabricate data, metrics, phone numbers, helplines, market prices or service claims.
- Do not add fake government affiliation.
- Do not commit or push changes without my explicit approval.
- Do not delete existing reports or data.
- Do not stop after fixing the JSX error.
- Do not simply produce a plan: implement, test and document the work.
- Prioritise a complete, reliable MVP over decorative features.
- If a requirement cannot be completed, document the exact blocker instead of pretending it is complete.

**Final objective:** Transform the existing FarmPay AI application and the saved Lovable design into one polished, responsive, multilingual, AI-assisted agricultural marketplace that a farmer can genuinely use, with working backend integration, MySQL persistence, role-based access, FairBid intelligence, Voice-to-Trade, buyer transparency and verified payment workflows.
