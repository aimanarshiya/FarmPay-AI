# FarmPay AI — Phase 1.1 PayPal Sandbox Manual Verification Preparation

**Document Version:** 1.0.0  
**Date:** 2026-11-06  
**Auditor:** Senior Full-Stack Architect  
**Workspace:** `C:\Users\DELL-PC\FarmPay-AI`  
**Target:** Manual Real-World Verification of PayPal Sandbox $1.00 USD Flow  

---

## 1. Inspection of Existing Database Orders

A live database audit of the MySQL `orders` table was conducted:

| Order ID | Created At | Status | Payment Status | PayPal Order ID | PayPal Capture ID | Assessment |
|---|---|---|---|---|---|---|
| `FP-36462A334730` | 2026-11-03 09:58:39 | PENDING_PAYMENT | NOT_PAID | `47G56918GD313204M` | NULL | ⚠️ Stale PayPal order token (>72 hrs old). May be expired on PayPal Sandbox servers. |
| `FP-D70485981709` | 2026-11-03 09:53:09 | PENDING_PAYMENT | NOT_PAID | `5L539626KH299691J` | NULL | ⚠️ Stale PayPal order token (>72 hrs old). May be expired on PayPal Sandbox servers. |
| `FP-A57BF57FF35D` | 2026-11-03 07:52:36 | PENDING_PAYMENT | NOT_PAID | `4J832687B68114328` | NULL | ⚠️ Stale PayPal order token (>72 hrs old). May be expired on PayPal Sandbox servers. |
| `FP-AA853F733A68` | 2026-10-27 05:03:53 | PENDING_PAYMENT | NOT_PAID | NULL | NULL | ℹ️ FarmPay order exists with no PayPal checkout created yet. |
| `FP-77072F946E94` | 2026-10-25 15:21:22 | PENDING_PAYMENT | NOT_PAID | `7BF2240004356622A` | `2LB698315W488902H` | 🚫 **DO NOT REUSE** — Already captured on 2026-10-25. |

### Analysis & Safe Recommendation:
1. **Never Reuse Captured Orders:** Order `FP-77072F946E94` already contains `paypal_capture_id = '2LB698315W488902H'` and must not be used for a new checkout.
2. **Expired Checkout Tokens:** The three orders from Nov 3 (`FP-36462A334730`, `FP-D70485981709`, `FP-A57BF57FF35D`) already have PayPal order IDs issued on Nov 3. In PayPal Sandbox, approval tokens expire within 3 to 72 hours. Attempting to approve an expired checkout on PayPal may yield `ORDER_NOT_APPROVED` or session timeout errors.
3. **Recommended Path — Fresh Test Order:**  
   The cleanest, safest, zero-friction verification is to create a fresh test harvest order from the home page (`http://localhost:5173/`). This tests the complete end-to-end integration:
   - Harvest submission -> Buyer offer ranking -> Order confirmation -> Fresh PayPal Sandbox checkout -> Approval -> Capture -> Database persistence.

---

## 2. Configuration Verification

- **Backend Configuration (`backend/.env`):**
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_NAME`: Configured and verified.
  - `PAYPAL_CLIENT_ID`: Configured (non-empty).
  - `PAYPAL_CLIENT_SECRET`: Configured (non-empty).
  - `PAYPAL_BASE_URL`: `https://api-m.sandbox.paypal.com` (verified sandbox endpoint).
  - `FRONTEND_BASE_URL`: Defaults to `http://localhost:5173` in code (matching Vite).
- **Frontend Configuration:**
  - `VITE_API_URL`: Defaults to `http://127.0.0.1:8000` (matching FastAPI).
- **CORS Middleware (`backend/app/main.py`):**
  - Explicitly permits `http://localhost:5173` and `http://127.0.0.1:5173`.

---

## 3. Server Startup Instructions

To ensure both servers are accessible directly from your local browser, run them in two separate terminal windows outside the agent sandbox:

### Terminal 1: FastAPI Backend
```powershell
cd C:\Users\DELL-PC\FarmPay-AI\backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
*Health verification:* Open `http://127.0.0.1:8000/health` in your browser. Expected: `{"status": "healthy"}`.

### Terminal 2: Vite React Frontend
```powershell
cd C:\Users\DELL-PC\FarmPay-AI\frontend
npm run dev
```
*Frontend access:* Open `http://localhost:5173/` in your browser.

---

## 4. Step-by-Step Manual Sandbox Checkout Guide

1. **Open Frontend:** Navigate to `http://localhost:5173/` in your browser.
2. **Submit Harvest:**
   - Crop: `Rice` (or any preferred crop)
   - Quantity: `500` kg
   - Location: `Guntur`
   - Click **"Find Buyer Offers"**.
3. **Select Offer:**
   - Choose any buyer offer from the comparison grid (e.g. Demo Buyer A).
   - Click **"Select This Offer"**.
4. **Confirm FarmPay Order:**
   - In the confirmation summary card, click **"Confirm Order"**.
   - Note the generated FarmPay Order ID (e.g., `FP-XXXXXXXXXXXX`).
5. **Initiate PayPal Sandbox Payment:**
   - On the Order Success card, click **"Simulate PayPal Sandbox Payment ($1.00 USD)"** (or click the order link to view Order Details and click the button there).
   - The frontend will call `POST /api/payments/paypal/create/{order_id}` and redirect you to the official PayPal Sandbox checkout URL.
6. **Log In to PayPal Sandbox:**
   - Use your PayPal Sandbox Personal/Buyer test account credentials.
   - Review the payment summary: Amount will show **$1.00 USD**.
   - Click **"Complete Purchase"** (or **"Pay Now"**).
7. **Verify Frontend Return:**
   - PayPal will redirect back to:
     `http://localhost:5173/payment/success?order_id=FP-XXXXXXXXXXXX&token=...&PayerID=...`
   - The frontend calls `POST /api/payments/paypal/capture/FP-XXXXXXXXXXXX`.
   - **Expected Result:**  
     The green confirmation receipt card displays:
     - Header: *"PayPal Sandbox Test Succeeded!"*
     - Eyebrow: *"SANDBOX TEST CONFIRMATION"*
     - Test Amount Captured: `1.00 USD`
     - FarmPay Order ID: `FP-XXXXXXXXXXXX`
     - PayPal Capture Reference: `CAP-...`
     - PayPal Order ID: `PP-...`
     - Settlement Status Badge: **"Sandbox Captured ($1.00 USD) • INR Unpaid"**

---

## 5. MySQL Verification Query

Immediately after the success screen appears, run this query in your MySQL client to verify database persistence:

```sql
SELECT 
    order_id, 
    crop, 
    quantity_kg, 
    net_proceeds, 
    currency, 
    status, 
    payment_status, 
    paypal_order_id, 
    paypal_capture_id, 
    created_at
FROM farmpay_ai.orders
ORDER BY created_at DESC
LIMIT 1;
```

### Expected Field Assertions:
- `order_id`: Matches the new test order ID.
- `status`: `'PENDING_PAYMENT'`.
- `payment_status`: **`'NOT_PAID'`** (CRITICAL: Must strictly remain `NOT_PAID`).
- `currency`: `'INR'`.
- `paypal_order_id`: Populated with the new PayPal Order ID (e.g. `4...` or `5...`).
- `paypal_capture_id`: **Populated with the real PayPal Capture ID** (starts with `CAP-` or alphanumeric e.g. `8...` or `2...`). **Must NOT be NULL.**

---

## 6. Safety & Boundary Confirmation

- Original FarmPay INR `payment_status` **strictly remains `NOT_PAID`**.
- Only the $1.00 USD sandbox simulation is captured.
- No automated payment has been initiated by the agent.
- Awaiting user manual test execution.
