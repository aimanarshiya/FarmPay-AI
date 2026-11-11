# FarmPay AI — End-to-End Workflow Verification Report

**Date:** 2026-11-07
**Test Runner:** Live Integration Suite via FastAPI TestClient & MySQL 8.0
**Status:** 13 of 13 Workflows Verified Successfully

---

## 1. Executive Summary

This report documents the live, unmocked end-to-end execution of the 13 core operational workflows of the FarmPay AI platform. Every workflow was verified against the real running backend, active MySQL database schema, and live Groq AI cloud inference.

---

## 2. Comprehensive 13-Workflow Execution Log

### Workflow 1: Farmer Registration & Authentication
- **Action:** Post registration data for farmer Ramesh Kumar.
- **Payload:** Name, email, phone, location (Guntur, AP), crop types.
- **Result:** User record created in `users` with hashed password; profile created in `farmer_profiles`. JWT generated with role `FARMER`.
- **Status:** **PASS**

### Workflow 2: Farmer Produce Listing Creation
- **Action:** Farmer Ramesh lists 150 quintals of Sona Masoori Rice.
- **Endpoint:** `POST /api/listings`
- **Payload:** `crop_type: "Rice (Sona Masoori)"`, `quantity_quintals: 150.0`, `base_price_per_quintal: 3100.0`.
- **Result:** Listing `LST-B849764516` created in status `OPEN`.
- **Status:** **PASS**

### Workflow 3: Buyer Marketplace Discovery
- **Action:** Commercial buyer searches active marketplace.
- **Endpoint:** `GET /api/listings?status=OPEN`
- **Result:** Listing `LST-B849764516` retrieved with full farmer details and minimum asking price.
- **Status:** **PASS**

### Workflow 4: Buyer 1 Submits Competing Offer
- **Action:** Buyer 1 (Kisan Agro Traders) submits a competitive bid.
- **Endpoint:** `POST /api/listings/{id}/offers`
- **Offer Details:** ₹3,250/Q, ₹6,000 transport deduction.
- **Result:** Offer `OFF-B7C9B8658B` recorded in MySQL with status `PENDING`.
- **Status:** **PASS**

### Workflow 5: Buyer 2 Submits Counter Offer
- **Action:** Buyer 2 (Coastal Grain Corp) submits a second bid.
- **Endpoint:** `POST /api/listings/{id}/offers`
- **Offer Details:** ₹3,180/Q, ₹2,000 transport deduction.
- **Result:** Offer `OFF-364CF55BA8` recorded in MySQL with status `PENDING`.
- **Status:** **PASS**

### Workflow 6: Farmer Inspects Received Offers
- **Action:** Farmer queries bids submitted for their listing.
- **Endpoint:** `GET /api/listings/{id}/offers`
- **Result:** 2 pending offers retrieved, sorted by gross amount with pre-computed net proceeds calculated.
- **Status:** **PASS**

### Workflow 7: Groq AI Recommendation Engine Execution
- **Action:** Farmer requests AI analysis in Telugu (`te`).
- **Endpoint:** `GET /api/listings/{id}/recommendation?language=te`
- **Inference Provider:** Groq Cloud (`openai/gpt-oss-20b`)
- **Result:**
  * `recommended_buyer_id`: `USR-BUY-DEMO01`
  * `is_fallback`: `False`
  * `confidence_score`: `0.95`
  * `explanation`: Fluent Telugu economic breakdown comparing net yield ₹4,81,500 vs ₹4,75,000.
- **Status:** **PASS**

### Workflow 8: Farmer Accepts Winning Offer
- **Action:** Farmer clicks Accept on Buyer 1's offer.
- **Endpoint:** `POST /api/offers/{id}/accept`
- **Result:** Offer status updated to `ACCEPTED`.
- **Status:** **PASS**

### Workflow 9: Order Generation in MySQL
- **Action:** Acceptance automatically generates a legally binding procurement order.
- **Order ID:** `ORD-AEBD03FE1C`
- **Order Values:** 150 Quintals, Total Amount ₹4,87,500, Status `PENDING`, Payment Status `NOT_PAID`.
- **Status:** **PASS**

### Workflow 10: Competing Offers Automatically Rejected
- **Action:** Database trigger/logic checks competing offers on the same listing.
- **Result:** Buyer 2's offer (`OFF-364CF55BA8`) automatically transitioned from `PENDING` $\rightarrow$ `REJECTED`. Listing marked `MATCHED`.
- **Status:** **PASS**

### Workflow 11: Buyer Retrieves Order & Initiates Escrow
- **Action:** Buyer 1 logs in and views pending orders in Procurement Registry.
- **Endpoint:** `GET /api/orders`
- **Result:** Order `ORD-AEBD03FE1C` retrieved with payment status `NOT_PAID` and prompt to complete escrow deposit.
- **Status:** **PASS**

### Workflow 12: PayPal Sandbox Checkout Test
- **Action:** International buyer tests checkout flow using PayPal REST API Sandbox.
- **Endpoint:** `POST /api/orders/{id}/payments/create-order`
- **Result:** Order `PAYPAL-TEST-...` created in Sandbox with approval URL returned. ADR-001 separation verified ($1.00 USD unit test amount, INR order untouched).
- **Status:** **PASS**

### Workflow 13: Administrator Monitoring & Security Guards
- **Action 13A (Admin Oversight):** Admin queries `GET /api/admin/users` and `GET /api/admin/ai-activity`. Complete system registry and AI audit log returned.
- **Action 13B (RBAC Guard):** Unauthorized buyer attempting to create a harvest listing receives `HTTP 403 Forbidden`.
- **Action 13C (Anonymous Guard):** Unauthenticated request without JWT header receives `HTTP 401 Unauthorized`.
- **Status:** **PASS**

---

## 3. Summary Scorecard

$$\text{Total Workflows Tested} = 13 \quad\Big|\quad \text{Passed} = 13 \quad\Big|\quad \text{Failed} = 0 \quad\Big|\quad \text{Success Rate} = 100\%$$

All core journeys across Farmer, Buyer, Admin, Groq AI, and Database state persistence operate reliably and predictably.
