# FARMPAY AI — SUBMISSION READINESS & DEMONSTRATION GUIDE
**Date:** 2026-11-10
**Submission Deadline:** 11 November 2026
**Project:** FarmPay AI — Decentralized Agricultural Escrow & Fair Value Trade Platform
**Overall Readiness:** **HACKATHON SUBMISSION READY (91/91 Tests Passing, Clean Build)**

---

## 1. Quick Start Commands for Judges / Evaluators

### Prerequisites:
- Python 3.12 or 3.13 with virtual environment in `backend/.venv`
- Node.js 18+ and npm
- Local MySQL 8 instance with database `farmpay_ai`

### Step 1: Start the FastAPI Backend
Open a terminal in `C:\Users\DELL-PC\FarmPay-AI\backend`:
```powershell
cd C:\Users\DELL-PC\FarmPay-AI\backend
.\.venv\Scripts\uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- **Backend API:** `http://127.0.0.1:8000`
- **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`

### Step 2: Start the React Frontend
Open a second terminal in `C:\Users\DELL-PC\FarmPay-AI\frontend`:
```powershell
cd C:\Users\DELL-PC\FarmPay-AI\frontend
npm run dev
```
- **Web App URL:** `http://localhost:5173`

---

## 2. Seeded Demo Accounts for Evaluation

| Role | Email | Password | Primary Screen |
|:---|:---|:---|:---|
| **Farmer** | `farmer.ramesh@farmpay.demo` | `FarmerPassword2026!` | `/farmer/dashboard`, `/farmer/voice`, `/fairbid` |
| **Buyer** | `buyer.guntur@farmpay.demo` | `BuyerPassword2026!` | `/marketplace`, `/payments`, `/buyers/BYR-8841-IN/passport` |
| **Admin / Mandi Officer** | `admin@farmpay.demo` | `AdminPassword2026!` | `/admin`, `/admin/compliance/penalties`, `/admin/webhooks` |

---

## 3. Recommended Judge Demonstration Sequence

### Act I: The Farmer Experience (Screen 17 -> 11 -> 07 -> 06)
1. **Public Marketplace (`/`):** View the live instant value calculator with Gemini AI advisory recommendation and the 17-screen portfolio grid.
2. **Voice-to-Trade AI Studio (`/listings/create/voice` or `/farmer/voice`):**
   - Click "Simulate Voice Recording" or speak in Hindi/Telugu/English.
   - Watch the animated waveform and dynamic attribute extraction (crop, quantity, price, location).
   - Edit the transcript and click **Review & Confirm Lot Publication**.
3. **FairBid Engine (`/fairbid`):**
   - Compare multiple industrial mill bids side by side.
   - Toggle "How Net Formula Works" to see why AgroCorp's ₹2,520/qtl offer yields **+₹62,964 more net cash** than Kaveri's headline ₹2,560/qtl offer due to buyer-paid logistics and zero dockage.
4. **Farmer Command Hub (`/farmer/dashboard`):**
   - View mobile-first command center with one-tap voice trading and escrow payout status.

### Act II: Institutional Trust & Negotiation (Screen 12 -> 03 -> 09 -> 08)
5. **Buyer Trust Passport (`/buyers/BYR-8841-IN/passport`):**
   - Review AgroCorp's 4-pillar trust scorecard: 98.4% Fulfillment Reliability, 0.2% Dispute Rate, T+0 payment speed, and 94.2% farmer retention.
6. **AI Negotiation Copilot (`/negotiation/TND-8821`):**
   - Adjust the price slider from ₹2,520 to ₹2,580/qtl.
   - Toggle farmgate vs buyer transport to preview immediate take-home delta.
   - Click **Review & Transmit Counteroffer**.
7. **Demand Radar (`/market/demand-radar`):**
   - Explore the SVG Andhra/Telangana deficit heatmap, filtering tenders by urgency and free freight.
8. **Collective Selling Hub (`/fpo/collective-selling`):**
   - Review FPO cluster lot pooling with dynamic quintal pledging and progress tracking.

### Act III: Payment Escrow & Settlement (Screen 13 -> 01 -> 05 -> 04 -> 02 -> 10)
9. **Payments Center & PayPal Gateway (`/payments`):**
   - Review cross-border USD PayPal holds linked to national APMC mandi lot numbers.
   - Click **Checkout with PayPal Sandbox** or toggle to **Live Webhook Logs (Node.js)** to view simulated SHA-256 HMAC event signatures.
10. **Order Escrow & Milestone Tracker (`/orders/FP-2024-884/escrow`):**
    - Track the 5-stage progress: Escrow Vault Locked -> Assay & QR Tagging -> Farmgate Dispatch -> Weighbridge Cleared -> Mill QC & RTGS Disbursal.
    - Click **Sign Dual-Key Release (Farmer Side)** to register electronic mill gate-in approval.
11. **Live GPS Transit & Weighbridge Telemetry Sheet (`/logistics/telemetry/FP-2024-884`):**
    - Inspect real-time transit telemetry, speed (52 km/h), truck route on NH 65, and net weight gain (+60 kg yield advantage).
12. **Mandi Nodal Compliance & Penalties (`/admin/compliance/penalties`):**
    - Review APMC statutory Form VII-A show-cause notice with 72-hour countdown timer, escrow penalty forfeiture, and summons dispatch.
13. **Dispute Arbitration Console (`/disputes/arbitration/DSP-2024-041`):**
    - Adjust the quasi-judicial settlement slider (96% Farmer / 4% Buyer) and click **Sign Arbitral Award**.
14. **Dispute Shield (`/disputes`):**
    - Inspect NABL moisture assay test certificates and APMC §14 emergency tribunal escalation.

---

## 4. Verification Checklist Against Section 16 Criteria

- [x] **Frontend production build succeeds:** Verified (`vite build` exited 0, 74 modules transformed in 1.09s).
- [x] **Backend starts successfully:** Verified (`app.main:app` loads cleanly with 16 top-level route groups).
- [x] **MySQL connection works:** Verified (Host MySQL 8.0 connects and holds all 7 tables).
- [x] **Farmer login works:** Verified (`farmer.ramesh@farmpay.demo` returns JWT session).
- [x] **Buyer login works:** Verified (`buyer.guntur@farmpay.demo` returns JWT session).
- [x] **Admin login works:** Verified (`admin@farmpay.demo` returns JWT session).
- [x] **Farmer can create a listing:** Verified via `app/listings.py` and test suite.
- [x] **Buyer can browse listings:** Verified via `app/listings.py` active listings endpoint.
- [x] **Buyer can submit an offer:** Verified via `app/offers.py` submit offer endpoint.
- [x] **Farmer can accept own listing's offer:** Verified via `app/offers.py` atomic acceptance.
- [x] **Correct order is created and persisted:** Verified with calculated gross and net proceeds.
- [x] **RBAC prevents unauthorised operations:** Verified (17 RBAC tests passing).
- [x] **PayPal Sandbox flow is verified:** Verified (34 payment validation tests passing).
- [x] **Voice-to-Trade works:** Verified with speech synthesis, audio waveforms, and explicit confirmation gate.
- [x] **FairBid calculations grounded in real offer data:** Verified with transparent logistics and cess math.
- [x] **Buyer Trust Passport does not fabricate trust history:** Verified with live order sync and clear provenance.
- [x] **All 17 Stitch screens remain accessible:** Verified with dedicated routes and `StitchNavigator` drawer.
- [x] **Additional screens distinguish demo from real data:** Verified with explicit demo tags on prototype lots.
- [x] **Admin dashboard uses genuine available data:** Verified with aggregate metrics endpoint.
- [x] **Mobile and desktop layouts are usable:** Verified with responsive styles and mobile shells.
- [x] **No critical errors remain:** Verified (91/91 backend tests passing, 0 ESLint warnings).
- [x] **Documentation and progress reports updated:** Verified under `project_docs/`.
- [x] **Local demo instructions ready:** Verified above.

---

## 5. Known Limitations & Prototype Boundaries

1. **PayPal Sandbox Currency:** The PayPal checkout initiates a test transaction of `$1.00 USD` to validate API authorization and webhook delivery. It does not execute live Indian Rupee (INR) bank settlement.
2. **Hardware Sensors:** GPS telemetry and weighbridge tare calculations are demonstrated through simulated data feeds and interactive sliders, as physical truck IoT sensors and mandi hardware are external devices.
3. **Speech Recognition:** Voice-to-Trade supports Web Speech API in supported browsers (Chrome, Edge) with automatic fallback to scripted templates and manual field entry for unsupported browsers.
