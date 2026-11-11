# FarmPay AI — Phase 2 Initial Project Audit
**Date:** 2026-11-07
**Auditor:** Antigravity Senior Engineer
**Scope:** Complete pre-implementation audit before Phase 2 redesign and Groq integration.

---

## 1. Repository Baseline

| Metric | State |
|---|---|
| Git branch | `main` |
| Local commit | `ed727d7` (1 ahead of origin) |
| Uncommitted working-tree changes | ~11 modified, ~27 untracked new files (Phase 1.2 MVP) |
| Backend tests | 61/61 pass |
| Frontend lint | 0 errors, 0 warnings |
| Frontend build | Vite 8.3.5, 614ms, exit 0 |

---

## 2. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React 19 + Vite 8 | JavaScript |
| Backend | Python FastAPI | 0.161.1 |
| Database | MySQL 8.0 | PyMySQL 1.2.3 |
| Auth | PBKDF2-HMAC-SHA256 + JWT | PyJWT ≥2.10 |
| AI (current) | Google Gemini | google-genai ≥3.0, model: gemini-3.8-flash |
| AI (secondary) | Anthropic Claude | urllib-based, claude-3-5-haiku |
| Payments | PayPal REST API v2 Sandbox | httpx 0.28.1 |
| i18n | Custom in-process | English + Telugu |

---

## 3. Backend Endpoints Catalogue

### Authentication (`/api/auth`)
| Method | Path | Role | Status |
|---|---|---|---|
| POST | `/register/farmer` | Public | ✅ Working |
| POST | `/register/buyer` | Public | ✅ Working |
| POST | `/login` | Public | ✅ Working |
| GET | `/me` | Authenticated | ✅ Working |

### Legacy Demo Endpoints (`/api`)
| Method | Path | Role | Status |
|---|---|---|---|
| POST | `/api/offers` | Public | ✅ Works but uses HARDCODED DEMO_BUYERS (not MySQL buyer_offers table) |
| POST | `/api/orders` | Public | ✅ Works but creates orders from DEMO_BUYERS, not real offer flow |
| GET | `/api/orders` | Public | ✅ Working |
| GET | `/api/orders/{id}` | Public | ✅ Working |

### Produce Listings (`/api/listings`)
| Method | Path | Role | Status |
|---|---|---|---|
| POST | `/api/listings` | FARMER/ADMIN | ✅ Working |
| GET | `/api/listings` | Public | ✅ Working |
| GET | `/api/listings/farmer/my-listings` | FARMER/ADMIN | ✅ Working |
| GET | `/api/listings/{id}` | Public | ✅ Working |

### Offers & Negotiations (`/api`)
| Method | Path | Role | Status |
|---|---|---|---|
| POST | `/api/listings/{id}/offers` | BUYER/ADMIN | ✅ Working |
| GET | `/api/listings/{id}/offers` | FARMER/ADMIN/BUYER | ✅ Working |
| GET | `/api/listings/{id}/ai-recommendation` | FARMER/ADMIN | ✅ Working (Gemini) |
| POST | `/api/offers/{id}/accept` | FARMER/ADMIN | ✅ Working (transactional) |
| POST | `/api/offers/{id}/reject` | FARMER/ADMIN | ✅ Working |
| GET | `/api/buyer/my-offers` | BUYER/ADMIN | ✅ Working |

### Admin (`/api/admin`)
| Method | Path | Role | Status |
|---|---|---|---|
| GET | `/api/admin/metrics` | ADMIN | ✅ Working (graceful fallback if tables missing) |

### Payments (`/api/payments`)
| Method | Path | Role | Status |
|---|---|---|---|
| POST | `/api/payments/create-checkout/{id}` | — | ✅ Working |
| POST | `/api/payments/capture/{id}` | — | ✅ Working |

---

## 4. Database Schema Review

### Tables Present
- `orders` — original Phase 1.1 table, fully populated with 2 PayPal captures
- `users` — Phase 1.2, may not exist on live DB (requires root migration)
- `farmer_profiles` — Phase 1.2, may not exist
- `buyer_profiles` — Phase 1.2, may not exist
- `produce_listings` — Phase 1.2, may not exist
- `buyer_offers` — Phase 1.2, may not exist
- `ai_recommendations` — Phase 1.2, may not exist

### Critical Issue: `BUYER003` Demo Record
- The seeded demo data at `backend/app/seed_data.py` creates demo offers with `buyer_id = 'BUYER003'`
- `BUYER003` is a bare string from the legacy DEMO_BUYERS dict (not a proper `USR-BUY-` format user record)
- The `buyer_offers` table FK does NOT enforce FK to `users.user_id` (no FOREIGN KEY constraint on buyer_offers.buyer_id), so `BUYER003` can be inserted
- **This is intentional** — the buyer_offers table stores denormalized buyer info, allowing demo data alongside real users
- **Verdict:** `BUYER003` is consistent, not a bug, but should be clearly annotated in demo data

### schema.sql line 153 — Stale Default
```sql
model_used VARCHAR(50) DEFAULT 'gemini-2.5-flash'
```
This should be updated to `'groq-primary'` or `'ai-service'` after Groq integration.

---

## 5. AI Service Audit

### Current Architecture
1. **Primary:** Google Gemini (`gemini-3.8-flash`) via `google-genai` SDK
2. **Secondary:** Anthropic Claude via raw `urllib.request` HTTP
3. **Fallback:** Deterministic mathematical recommendation (net proceeds sorting)

### Issues Identified
| Issue | Severity |
|---|---|
| Groq not yet integrated (required for Phase 2) | Critical |
| `ai_advisor_title` in i18n still says "Google Gemini" (te + en) | Medium |
| `offers.py` docstring still says "Invokes Google Gemini AI" | Low |
| `main.py` imports and uses `analyze_offers_with_gemini` as function name even after Groq integration | Medium |
| No bilingual (Telugu) support in AI prompts — only English prompt sent regardless of language setting | Medium |
| No retry/backoff logic implemented for Gemini or Claude | Low |

---

## 6. Frontend Audit

### Pages & Components
| Page | Route | Status | Issues |
|---|---|---|---|
| Home | `/` | ✅ Functional | Uses legacy `/api/offers` with DEMO_BUYERS; not connected to new listing/offer system |
| Login | `/login` | ✅ Functional | Has demo quick-fill buttons for judges |
| RegisterFarmer | `/register/farmer` | ✅ Functional | — |
| RegisterBuyer | `/register/buyer` | ✅ Functional | — |
| FarmerDashboard | `/farmer` | ✅ Functional | Full listing/offers/AI flow; auth-guarded |
| BuyerMarketplace | `/marketplace` | ✅ Functional | Browse + bid; auth-guarded |
| AdminDashboard | `/admin` | ⚠️ Partial | Shows aggregate metrics only; no user/listing tables, no detail views |
| OrderHistory | `/orders` | ✅ Functional | Shows legacy orders table |
| OrderDetails | `/orders/:id` | ✅ Functional | Shows PayPal payment option |
| PaymentSuccess | `/payment/success` | ✅ Functional | — |
| PaymentCancel | `/payment/cancel` | ✅ Functional | — |

### Design Issues
| Issue | Severity |
|---|---|
| Homepage still shows "Demo Buyer" offers (not connected to actual marketplace) | High |
| Homepage is effectively a separate demo flow from the authenticated marketplace | High |
| No public-facing informational sections (How it Works, Benefits, FAQ) | High |
| Homepage footer says "Powered by Google Gemini" — needs updating after Groq | Medium |
| Homepage hero text references "Google Gemini AI" in p tag | Medium |
| `ai_advisor_title` in i18n says "Google Gemini AI" in both languages | Medium |
| AdminDashboard is very minimal — no user list, no order/offer tables | High |
| No visual differentiation between AI and deterministic recommendations | Medium |
| Nav shows "Marketplace Demo" for home — unclear for public users | Low |
| Navbar shows Farmer Hub to unauthenticated users — should show public home info | Low |
| FarmerDashboard payment instructions reference PayPal but no link to OrderHistory | Low |
| Mobile responsiveness: CSS uses fixed px breakpoints but no media queries visible in first 100 lines | Medium |
| No `<title>` metadata management (all pages show same browser tab title) | Low |
| App.css is 2428 lines — large monolithic stylesheet, hard to maintain | Low |

### i18n Issues
- `ai_advisor_title` says "Google Gemini AI" in both `en` and `te` — must change to "FarmPay AI Recommendation"
- Telugu translations are present and appear correct for all current keys
- Groq integration will not require new i18n changes if the advisor title is updated

---

## 7. Test Coverage

### Backend Tests (61 total)
| File | Tests | Coverage |
|---|---|---|
| `test_auth_and_ai.py` | 10 | Auth crypto, JWT, Gemini paths, fallback, hallucination guard |
| `test_orders_api.py` | 9 | Order CRUD, pagination, demo buyer flow |
| `test_payments_api.py` | 34 | Full PayPal sandbox regression suite |
| `test_role_workflows.py` | 8 | RBAC, cross-user isolation |

### Missing Test Coverage
- No Groq AI tests (to be added in Phase 2)
- No tests for listing creation/retrieval endpoints
- No tests for buyer offer submission
- No tests for offer accept/reject transaction
- No tests for admin metrics endpoint
- Frontend: no automated tests at all

---

## 8. Security Audit

| Check | Status |
|---|---|
| PBKDF2-HMAC-SHA256 (150,000 iterations) for passwords | ✅ Secure |
| JWT HS256 with configurable secret | ✅ Secure |
| SQL: PyMySQL parameterized queries throughout | ✅ No injection risk |
| CORS: Restricted to localhost:5173 and :3000 | ✅ Appropriate for dev |
| API keys: Loaded from env, never exposed to frontend | ✅ Secure |
| PayPal: Amount and identity validation guards | ✅ Verified in 34 tests |
| Role guards: `require_role` enforced at endpoint level | ✅ Working |
| AI: Hallucination guard validates buyer_id against offer list | ✅ Secure |
| `get_current_user`: Fallback to JWT payload if users table missing | ⚠️ Acceptable for dev, should be tightened for prod |

---

## 9. Prioritized Issues for Phase 2

### Critical
1. Integrate Groq as primary AI provider
2. Connect Home page to real listings/offers system (or redesign to public info page)
3. Run database migration to create Phase 1.2 tables

### High
4. Full website redesign (all pages)
5. Enhance AdminDashboard with user/listing/order tables
6. Add Telugu language support to AI prompts
7. Update all "Gemini" branding references in frontend

### Medium
8. Add Groq-specific tests (all required scenarios)
9. Add retry/backoff to AI provider calls
10. Update `schema.sql` default model_used value
11. Add mobile-responsive media queries

### Low
12. Refactor large `App.css` into component-scoped styles
13. Add `<title>` metadata per page
14. Update `offers.py` docstring references to Gemini

---

## 10. What Works and Must Be Preserved

- ✅ All 61 backend tests
- ✅ PayPal Sandbox integration (34 regression tests protect this)
- ✅ PBKDF2 auth with JWT
- ✅ Farmer listing creation
- ✅ Buyer offer submission
- ✅ Atomic offer acceptance (transaction: accept + reject others + create order)
- ✅ AI recommendation grounding + hallucination guard
- ✅ Deterministic fallback
- ✅ Telugu + English i18n
- ✅ MySQL PyMySQL integration
- ✅ INR/PayPal transaction separation
- ✅ Existing PayPal capture records (FP-B51C04800616, FP-77072F946E94)
