# FarmPay AI — Phased Development Roadmap

**Version:** 2.0.0  
**Updated:** 2026-11-05  

---

## Roadmap Overview

Development is organized into discrete, verifiable phases. Every phase must complete its implementation, automated test suite, and architectural documentation before proceeding.

---

### Phase 1: Core Marketplace & Test Checkout (Baseline)
- ✅ Farmer selling workflow (`HarvestForm.jsx`).
- ✅ In-memory buyer offer calculation.
- ✅ Order creation and persistence in MySQL (`orders` table).
- ✅ Paginated order history and order details view.
- ✅ Phase 1.1: PayPal Sandbox failure resolution & 40-test validation harness.

---

### Phase 2: User Identity, Auth & RBAC
- **Scope:** Mobile phone OTP authentication, JWT token issuance, multi-tenant database isolation.
- **Tables:** `users`, `farmer_profiles`, `buyer_profiles`.
- **Key Invariant:** Farmers can only access their own orders (`WHERE user_id = %s`).

---

### Phase 3: Dynamic Buyers & Live Marketplace
- **Scope:** Relational buyer demand management replacing `DEMO_BUYERS`.
- **Tables:** `crops`, `buyers`, `buyer_demands`.
- **Key Invariant:** Verified mandi baseline pricing bounds prevent predatory bidding.

---

### Phase 4: Multilingual & Voice Integration
- **Scope:** Centralized i18n dictionary (Telugu `te-IN`, Hindi `hi-IN`, English `en-IN`), Web Speech API, Gemini structured entity extraction.
- **Key Invariant:** Zero hardcoded English strings in JSX; Telugu Unicode glyphs properly buffered.

---

### Phase 5: PWA & Offline Support
- **Scope:** Service worker app shell caching, Web App Manifest, IndexedDB offline harvest submission queue, Capacitor Android packaging.
- **Key Invariant:** Farmers can record harvests offline; transactions sync automatically on reconnection.

---

### Phase 6: Quantum Logistics Optimization
- **Scope:** QUBO formulation of constrained agricultural allocation, Qiskit QAOA execution, comparative benchmarking against classical ILP.
- **Key Invariant:** Empirical benchmarking metrics (runtime, approximation ratio, constraint feasibility) required for all claims.
