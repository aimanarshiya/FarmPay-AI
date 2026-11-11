# FarmPay AI — Hackathon Judge Evaluation Guide

Welcome Judges! This guide provides an accelerated walkthrough to evaluate **FarmPay AI**, a public-service inspired agricultural marketplace connecting smallholder Indian farmers directly with commercial buyers, powered by **Groq Cloud AI LPU inference** (`openai/gpt-oss-20b`), native bilingual reasoning (English & Telugu), and verified PayPal Sandbox digital settlement.

---

## 1. Quick Architecture & Sponsor Tool Mapping

| Hackathon Requirement / Sponsor Tool | Implementation in FarmPay AI | File Reference |
|---|---|---|
| **Meaningful AI Integration** | **Groq Cloud AI** (`openai/gpt-oss-20b` via OpenAI-compatible endpoint) delivers sub-second economic offer analysis, calculating net proceeds, validating logistics deductions, grounding recommendations to verified buyers, and explaining trade-offs in English or Telugu. Supported by a 4-tier cascade (Groq $\rightarrow$ Gemini $\rightarrow$ Claude $\rightarrow$ Deterministic Math). | [`backend/app/ai_service.py`](file:///C:/Users/DELL-PC/FarmPay-AI/backend/app/ai_service.py)<br>[`frontend/src/components/AIRecommendationCard.jsx`](file:///C:/Users/DELL-PC/FarmPay-AI/frontend/src/components/AIRecommendationCard.jsx) |
| **Meaningful PayPal Integration** | **PayPal REST API v2 Sandbox Checkout & Capture**. End-to-end $1.00 USD authorization & capture flow with strict identity anchoring via `custom_id`, dual-amount validation, and tamper prevention. Preserves the original INR order status (`NOT_PAID`) while recording immutable PayPal capture IDs (ADR-001). | [`backend/app/payments.py`](file:///C:/Users/DELL-PC/FarmPay-AI/backend/app/payments.py)<br>[`backend/app/paypal_service.py`](file:///C:/Users/DELL-PC/FarmPay-AI/backend/app/paypal_service.py) |
| **Public Service UI/UX** | **My Bharat Inspired Redesign**: Authoritative digital portal aesthetic, citizen helpline simulator (1800-FARMPAY), font sizers ($A-/A/A+$), one-click High Contrast mode, responsive from 360px up, with zero deceptive government emblems. | [`frontend/src/App.css`](file:///C:/Users/DELL-PC/FarmPay-AI/frontend/src/App.css)<br>[`frontend/src/components/Navbar.jsx`](file:///C:/Users/DELL-PC/FarmPay-AI/frontend/src/components/Navbar.jsx)<br>[`frontend/src/pages/Home.jsx`](file:///C:/Users/DELL-PC/FarmPay-AI/frontend/src/pages/Home.jsx) |
| **Authentication & RBAC** | PBKDF2-HMAC-SHA256 password hashing, configured HS256 JWT signing secret, database-validated sessions, and role guards (`FARMER`, `BUYER`, `ADMIN`) on frontend and API. | [`backend/app/auth.py`](file:///C:/Users/DELL-PC/FarmPay-AI/backend/app/auth.py) |
| **Marketplace Negotiation** | MySQL-backed farmer listings and buyer bids, offer visibility scoped to participants, and transactional acceptance creating participant-scoped orders. The homepage calculator is a clearly labelled example simulator only. | [`backend/app/listings.py`](file:///C:/Users/DELL-PC/FarmPay-AI/backend/app/listings.py)<br>[`backend/app/offers.py`](file:///C:/Users/DELL-PC/FarmPay-AI/backend/app/offers.py) |

### 1.1 Implementation Transparency: Live Workflows vs. Prototype Screens

To facilitate evaluation, FarmPay AI explicitly distinguishes live database-backed systems from interactive prototype screens:

- **Live Database & API-Backed Workflows (Primary Evaluation Path):**
  - **Farmer Produce Listings & Inventory:** (`/farmer`, `/farmer/dashboard`, `/farmer/create-listing`)
  - **Buyer Marketplace & Bidding:** (`/marketplace`, `/listings/:id`)
  - **FairBid Groq AI Recommendation Engine:** (`/listings/:listing_id/offers`)
  - **Atomic Offer Acceptance & Escrow Order Creation:** (`POST /api/offers/:id/accept`)
  - **Buyer Procurement Orders & Status Tracking:** (`/orders`, `/orders/:id`)
  - **PayPal REST API v2 Sandbox Checkout & Capture:** (`/payments`)
  - **Voice-to-Trade Listing Creation:** (`/listings/create/voice`)
  - **Admin Platform Oversight & AI Inference Audit Logs:** (`/admin`)
  - **Public Marketplace Directory & Benchmark Rates:** (`/`)

- **Interactive UI Prototypes (Illustrative Vision Demonstrators):**
  - Order Escrow Milestones (`/orders/:id/escrow`), Buyer Penalty Management (`/admin/compliance/penalties`), AI Negotiation Copilot (`/negotiation/:id`), Webhook Resilience Console (`/admin/webhooks`), Logistics Telemetry (`/logistics/telemetry/:id`), Collective Selling Hub (`/fpo/collective-selling`), Demand Radar (`/market/demand-radar`), Dispute Arbitration Console (`/disputes/arbitration/:id`), Logistics Intelligence (`/logistics`), Digital Crop Passport (`/passport/lot/:id`), Dispute Shield (`/disputes`).

---

## 2. 60-Second Setup & Startup

### Step 0: Prerequisites
- Windows, macOS, or Linux
- Node.js 20+ LTS
- Python 3.11+
- MySQL 8.0 running locally on port 3306

### Step 1: Demo Environment
Use an isolated judge/demo database that already contains demo users and listings. The seed script writes database records; run it only against a designated demo database after confirming that it is safe to modify. Do not use a production or personal data store for judging.

Generate and configure a unique backend JWT secret in `backend/.env` (do not commit it):
```powershell
python -c "import secrets; print(secrets.token_urlsafe(48))"
```
Set `APP_ENV=development` and use the generated value for `JWT_SECRET`.

For optional login quick-fill, copy `frontend/.env.example` to the ignored `frontend/.env.local`, set `VITE_DEMO_MODE=true`, and provide the demo account emails/passwords from the isolated demo environment. Quick-fill is only rendered by Vite's development server; production builds do not include it. Never place production or privileged real-account credentials in frontend configuration.

### Step 2: Launch the Services

#### Terminal 1 — Backend API (FastAPI)
```powershell
cd C:\Users\DELL-PC\FarmPay-AI\backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
*API will run at `http://127.0.0.1:8000` with Swagger docs at `http://127.0.0.1:8000/docs`.*

#### Terminal 2 — Frontend (React 19 + Vite)
```powershell
cd C:\Users\DELL-PC\FarmPay-AI\frontend
npm run dev
```
*Web application will open at `http://localhost:5173`.*

---

## 3. Demo Login

When local demo mode is enabled as described above, the Login page shows quick-fill buttons for the configured farmer, buyer, and admin demo accounts. The email/password values are read from the ignored local frontend environment file and are not hard-coded in frontend source. If demo mode is disabled, judges can sign in using credentials supplied securely by the demo-environment operator.

The public homepage offer calculator uses illustrative demo values only. It cannot create an order. To demonstrate a real workflow, use a farmer account to create a listing, submit a bid as a buyer, and accept the database-backed bid as the listing owner.

---

## 4. 5-Minute Guided Evaluation Walkthrough

### Step 1: Explore Public Portal & Accessibility Features
1. Open `http://localhost:5173` in your browser.
2. In the top utility bar:
   - Click **A+** to scale typography dynamically for accessibility.
   - Click **"High Contrast"** to preview the high-contrast accessible mode.
   - Click **"తెలుగు"** (Telugu) to experience seamless regional language localization.
3. Scroll down on the homepage to explore:
   - **Service Directory:** 4 quick action tiles (Sell Produce, Marketplace, Compare Bids, Track Orders).
   - **Live Mandi Benchmark Ticker:** Real-time benchmark rates for Rice, Wheat, Cotton, Maize, and Turmeric.
   - **Net Proceeds Calculator:** Input 250 Quintals and ₹3,200 rate to preview instant transport deductions and net take-home pay.

### Step 2: Login as Farmer
1. Click **"Sign In"** or navigate to `http://localhost:5173/login`.
2. Click **"Demo Farmer (Ramesh)"** and click **Sign In**.
3. You will land on the **Farmer Dashboard** (`/farmer`).

### Step 3: Review Harvest Listings & Competing Bids
1. In the **"My Harvest Listings"** panel on the left, select **Sona Masoori Rice (250 Quintals)**.
2. The right panel will load the competing buyer bids:
   - **Kisan Agro Traders**: ₹32.00/kg (₹3,200/Q), ₹8,000 transport cost.
   - **Coastal Grain Corp**: ₹31.50/kg (₹3,150/Q), ₹5,000 transport cost.
   - **Guntur Wholesale Co**: ₹30.50/kg (₹3,050/Q), ₹2,500 transport cost.

### Step 4: Inspect Real-Time Groq AI Recommendation
1. Look at the **"Groq AI Smart Advisor"** card above the bids:
   - Notice the badge showing **"Model: openai/gpt-oss-20b"** with **"Grounded in real transaction bids"**.
   - Groq calculates the **Gross Amount**, **Transport Logistics Deduction**, and **Net Proceeds**.
   - Groq explains why Kisan Agro Traders yields the highest net proceeds (₹7,92,000) despite higher transport costs.
   - Toggle language to **"తెలుగు"** in the top bar: the AI explanation dynamically displays natural Telugu guidance.

### Step 5: Accept Offer & Trigger Escrow Order
1. Click **"Accept Offer"** on Kisan Agro Traders' bid.
2. Observe immediate atomic updates:
   - Winning offer status updates to `ACCEPTED`.
   - Competing offers are automatically marked `REJECTED`.
   - Listing transitions to `MATCHED`.
   - An escrow order is created in MySQL with status `PENDING` and payment status `NOT_PAID`.

### Step 6: Log in as Buyer & Verify Order
1. Log out and click **"Demo Buyer (Kisan Agro)"** on `/login`.
2. Navigate to **"Orders"** (`/orders`).
3. Observe the newly created order in the Procurement Registry:
   - Demonstrates official INR escrow tracking.
   - Option to launch the PayPal Sandbox checkout simulation ($1.00 USD fixed test unit, ADR-001 compliant).

### Step 7: Log in as Admin & Review AI Audit Trail
1. Log out and click **"Demo Admin"** on `/login`.
2. Navigate to **"Admin"** (`/admin`).
3. View platform metrics, the full User Registry, and the **Live AI Inference Audit Trail** showing timestamps, model used (`openai/gpt-oss-20b`), and prompt language.

---

## 5. Automated Verification Suites

To independently run the full test suite and verify frontend quality:

```powershell
# Run all 78 backend unit & integration tests
cd backend
.\.venv\Scripts\Activate.ps1
python -m unittest discover -s tests -v

# Run frontend ESLint check (0 errors, 0 warnings)
cd ..\frontend
npm run lint

# Run frontend production build
npm run build
```

Thank you for reviewing **FarmPay AI**!
