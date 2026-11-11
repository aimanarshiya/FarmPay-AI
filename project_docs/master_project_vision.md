# FARM PAY AI – MASTER PRODUCT DEFINITION AND ARCHITECTURE AUDIT

## Role

Act as a senior product architect, full-stack engineer, database architect, AI systems engineer and professional UI/UX designer.

You are working on the existing FarmPay AI project.

Your responsibility is to help build a reliable, user-centric agricultural marketplace that solves real problems faced by Indian farmers.

This is a long-term, phase-by-phase development project. Do not attempt to generate the entire application in one operation.

## 1. Project vision

FarmPay AI is an intelligent agricultural marketplace designed to connect farmers directly with genuine buyers.

The platform should simplify the process of selling agricultural produce, finding buyers, comparing offers, negotiating prices, arranging transportation and tracking payments.

The most important target users are farmers in rural India.

Many farmers may:
- Not own or regularly use a laptop.
- Have limited experience with digital applications.
- Prefer Telugu or other regional languages over English.
- Find lengthy registration forms and complicated dashboards difficult.
- Prefer speaking rather than typing.

Therefore, the application must be as simple to use as booking an LPG gas cylinder through a mobile application.

The farmer should be able to complete essential tasks using a smartphone with minimal effort.

## 2. Core product principles

1. Farmer-first design.
2. Mobile-first application.
3. Multilingual access.
4. Voice-assisted interaction.
5. Real and verified marketplace participants.
6. Transparent pricing and transaction information.
7. Farmer retains control over selling decisions.
8. Secure user accounts and transactions.
9. Functional frontend-backend-database integration.
10. Scalable and maintainable architecture.
11. AI recommendations must be explainable and bounded.
12. Quantum optimization must be benchmarked against classical approaches.

Do not prioritize decorative features over working functionality.

## 3. User roles

Design the application around three roles.

### Farmer
- Registration and login.
- Profile and location management.
- Crop listing creation.
- Voice-assisted listing.
- Listing management.
- Buyer discovery.
- Offer comparison.
- Offer acceptance or rejection.
- Order tracking.
- Delivery information.
- Payment status.
- Transaction history.

### Buyer
- Registration and verification.
- Buyer profile.
- Crop requirements.
- Farmer listing discovery.
- Offer submission.
- Negotiation.
- Order confirmation.
- Delivery tracking.
- Transaction records.

### Administrator
- Farmer and buyer verification.
- User management.
- Crop category management.
- Listing and order monitoring.
- Dispute management.
- Transaction monitoring.
- System analytics.
- AI activity monitoring.

## 4. Final technology foundation

Preserve the existing working technology stack.

Frontend:
- React 19.
- Vite.
- JavaScript.
- Responsive component-based architecture.
- PWA-ready structure.

Backend:
- Python FastAPI.
- REST API architecture.
- Pydantic validation.
- Secure authentication and role-based authorization.

Database:
- MySQL 8.
- PyMySQL.
- Proper relational schema.
- Foreign keys, indexes and constraints where appropriate.

AI:
- Gemini API for language understanding and AI-assisted workflows.
- Controlled agent orchestration.
- Human confirmation for important decisions.

Quantum:
- Qiskit.
- QAOA-based experiments.
- Classical optimization baselines.
- Objective, feasibility and runtime comparisons.

Other integrations:
- Mapping and geolocation.
- Speech recognition and text-to-speech.
- Notification services.
- Payment gateway integration.

Do not migrate MySQL to PostgreSQL.
Do not replace FastAPI or React without explicit approval.

## 5. Frontend and UI/UX requirements

Design a professional, production-oriented agricultural marketplace.

The interface must:
- Be mobile-first.
- Work on small Android screens.
- Have clear visual hierarchy.
- Use readable typography.
- Have large touch-friendly controls.
- Use simple language.
- Minimize the number of steps required for important actions.
- Provide meaningful loading, empty, success and error states.
- Have consistent colors, spacing, components and navigation.
- Avoid unnecessary animations and clutter.
- Provide clear confirmation before important actions.

The farmer dashboard should prioritize:
1. Sell produce.
2. My listings.
3. Buyer offers.
4. My orders.
5. Payments.
6. Help and language settings.

Do not design a complicated enterprise dashboard for farmers.

Buyer and admin dashboards can contain more detailed information appropriate to their roles.

## 6. Multilingual requirements

Support:
- Telugu.
- English.
- Hindi.

Use a centralized internationalization system.

Do not hardcode user-facing text throughout React components.

Language selection must apply consistently to:
- Navigation.
- Forms.
- Validation.
- Notifications.
- Order statuses.
- AI-generated messages.
- Voice interactions.

Store user language preferences.

Test Telugu Unicode rendering and mobile layouts.

Verify the actual language capabilities of speech recognition and text-to-speech integrations before promising functionality.

## 7. Mobile application readiness

Build the web application so it can later be converted into an Android/iOS application.

Prioritize:
- Progressive Web App architecture.
- Responsive layouts.
- API-first design.
- Reusable UI components.
- Secure authentication.
- Mobile navigation.
- Touch-friendly controls.
- Fast loading.
- Suitable offline support.
- Notification readiness.

Keep future Capacitor integration possible.

## 8. Backend and database integration

Every important user action must be connected to a real backend API and persisted where appropriate.

Do not use hardcoded arrays as substitutes for production business data.

Define:
- API contracts.
- Database relationships.
- Input validation.
- Error handling.
- Authorization rules.
- Transaction boundaries.
- Auditability.
- Pagination and filtering.

Ensure farmers can access only their own private information and authorized marketplace data.

Ensure buyers can access only the information permitted by their role.

Ensure administrators have explicitly authorized privileges.

## 9. AI and innovation requirements

AI should solve meaningful agricultural marketplace problems.

Planned capabilities include:

1. Voice-based crop listing creation.
2. Automatic extraction of crop, quantity, location and expected price.
3. Missing-information detection and clarification.
4. Registered buyer discovery.
5. Offer ranking based on farmer net proceeds, logistics, feasibility and reliability.
6. Bounded negotiation within farmer-defined limits.
7. Supply allocation optimization.
8. Multilingual farmer assistance.

AI must not invent buyers, prices, offers or completed transactions.

Use verified application data for recommendations.

Critical operations such as accepting an offer, confirming an order and recording payments must remain under deterministic backend control.

## 10. Quantum optimization

Implement quantum functionality only after establishing a working classical baseline.

Potential applications:
- Farmer-to-buyer supply allocation.
- Crop quantity allocation.
- Delivery route optimization.

Use QUBO formulations and Qiskit QAOA experiments on suitable small problem instances.

Compare:
- Objective value.
- Constraint satisfaction.
- Feasibility.
- Runtime.
- Solution quality.

Never claim quantum advantage without experimental evidence.

## 11. Existing project preservation

The current project already contains:
- React and Vite frontend.
- FastAPI backend.
- MySQL database.
- Farmer selling workflow.
- Buyer offers.
- Order history and details.
- PayPal Sandbox integration.
- API modules and frontend components.

Preserve the existing implementation.

Do not rewrite working features unnecessarily.

The current Phase 1.1 PayPal fix is undergoing verification. Keep the original INR FarmPay order payment status separate from the $1 USD PayPal Sandbox test transaction.

## 12. Current assignment: Product and architecture audit only

Do not implement the entire application.

Inspect the existing repository and produce the following documents:

A. Final product requirements document.

B. Complete user journeys for farmer, buyer and admin.

C. End-to-end system workflow.

D. Frontend architecture and page hierarchy.

E. Backend module and API architecture.

F. MySQL entity relationship design.

G. Frontend-backend-database integration map.

H. Multilingual and voice interaction architecture.

I. PWA and future mobile application architecture.

J. AI and quantum implementation roadmap.

K. Security and authorization requirements.

L. Phase-wise implementation plan with dependencies and acceptance criteria.

M. Existing functionality audit showing what is implemented, incomplete or missing.

## 13. Strict execution rules

- Do not modify application code during this assignment.
- Do not delete or overwrite existing files.
- Do not modify database records.
- Do not change payment integration.
- Do not expose credentials.
- Do not commit or push.
- Do not create fake production data.
- Clearly distinguish existing functionality from planned functionality.
- Identify technical limitations honestly.
- Avoid unnecessary libraries and architectural complexity.

## Final objective

Produce a clear, implementation-ready product and architecture specification.

The result must describe a feasible, farmer-friendly, multilingual, mobile-first agricultural marketplace with actual frontend, backend, database and AI integration.

We will use this specification as the reference for all future Antigravity implementation prompts.

Wait for explicit approval before starting the next implementation phase.
