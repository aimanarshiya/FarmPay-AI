# FarmPay AI — Hackathon Readiness Action Plan
## November 6–12, 2026

**Deadline:** Thursday 2026-11-12, 12:00 PM PST (01:30 AM IST 2026-11-13)
**Working days remaining from audit:** ~6 days
**Blocking requirement:** AI feature must be added before submission.

---

## Priority 1 (Nov 6–7) — AI Integration [CRITICAL BLOCKER]

The hackathon requires "meaningful use of PayPal AND AI". PayPal is verified.
AI is entirely absent from the codebase. Without it the submission fails requirement 1.

### Task 1.1 — Add Gemini AI offer summary to backend

**Effort estimate:** 3–4 hours
**Files:** `backend/requirements.txt`, `backend/.env.example`, `backend/.env`, `backend/app/main.py`
**Risk:** Low — no schema changes, no new routes required (can extend `/api/offers`)

Implementation:
1. Add `google-genai` to `requirements.txt`.
2. Add `GEMINI_API_KEY=your_key_here` to `backend/.env.example`.
3. Add `GEMINI_API_KEY` to `backend/.env` (never commit).
4. In `/api/offers` endpoint, after calculating offers, call Gemini API:
   - Build a structured prompt from the offer data.
   - Request a 2–3 sentence plain-language recommendation for the farmer.
   - Return `ai_recommendation` field alongside `offers` in the response JSON.
5. Add graceful fallback: if Gemini call fails, return `ai_recommendation: null` and log the error. The offer engine must continue working independently.
6. Write 2 unit tests: one mocking a successful Gemini response, one testing the fallback.

**Prompt template (backend, do not expose to frontend):**
```
You are an agricultural market assistant helping Indian farmers choose the best buyer.
Crop: {crop}
Quantity: {quantity_kg} kg
Location: {location}

Buyer offers sorted by net proceeds:
{offer_summary}

Write 2-3 sentences in plain English recommending the best offer and explaining why.
Mention net proceeds in INR. Do not use markdown. Be concise.
```

**Output example:**
> "Demo Buyer C offers the highest net proceeds of ₹12,800 for your 500 kg of Rice in Guntur, with the lowest transport cost of ₹200. Demo Buyer A and Demo Buyer B provide lower net earnings due to higher transport deductions of ₹300 and ₹500 respectively. We recommend Demo Buyer C as the strongest offer."

### Task 1.2 — Add AI summary display to frontend

**Effort estimate:** 1–2 hours
**Files:** `frontend/src/api/offers.js`, `frontend/src/pages/Home.jsx`, `frontend/src/components/AISummary.jsx` (new)

Implementation:
1. Create `AISummary.jsx` component that shows:
   - A "🤖 AI Recommendation" label.
   - The Gemini text in a styled card.
   - "Powered by Google Gemini" attribution.
   - Graceful empty state if `ai_recommendation` is null.
2. Render `<AISummary>` between `<HarvestForm>` and `<OfferGrid>` in `Home.jsx` after offers load.

### Task 1.3 — Update `.env.example` and README for Gemini key

Add to `backend/.env.example`:
```
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
```

Update README Prerequisites to mention Gemini API key.

---

## Priority 2 (Nov 7–8) — README Update + Judge Guide [HIGH]

### Task 2.1 — Update README.md

Accurate description of implemented features:
- Phase 1 (marketplace, orders) — COMPLETE.
- Phase 1.1 (PayPal Sandbox) — COMPLETE.
- Phase 1.2 (AI offer summary) — COMPLETE (once Task 1 done).

Remove "Planned Features" framing for already-built features.

### Task 2.2 — Create JUDGE_GUIDE.md at project root

Content:
1. Prerequisites checklist (MySQL, Python, Node, Gemini API key, PayPal Sandbox credentials).
2. Exact setup commands (3 steps).
3. Demo walkthrough (5 steps: enter crop → find offers → read AI summary → confirm order → PayPal checkout).
4. PayPal Sandbox test buyer account instructions:
   - Direct judge to https://developer.paypal.com/dashboard/ to create their own sandbox buyer account, OR
   - Provide your own sandbox buyer email (sandbox.buyer@example.com) in the guide.
   - **IMPORTANT:** Only share the Sandbox buyer email, never the real PayPal password.
5. Expected results at each step.
6. What NOT to expect (no live INR settlement, no authentication, buyers are demo data).

---

## Priority 3 (Nov 8–9) — Demo Video [HIGH]

### Task 3.1 — Record the demo video

Runtime target: 2:30 (must be under 3:00)

Script: See `HACKATHON_SUBMISSION_READINESS_AUDIT_2026_11_06.md` Section E.

Tool: OBS Studio (free, Windows-compatible), Loom, or screen recorder of choice.

Steps:
1. Start recording with microphone.
2. Walk through the 7-segment storyboard.
3. Edit to remove dead time.
4. Upload to YouTube as "Unlisted" or "Public". Copy the URL.

**Do not record until Task 1 (AI feature) is complete.**

---

## Priority 4 (Nov 8–9) — Repository Publication [REQUIRED]

### Task 4.1 — Confirm GitHub repository is public

Go to: https://github.com/aimanarshiya/FarmPay-AI → Settings → Danger Zone → Make Public (if not already).

### Task 4.2 — Push Phase 1.1 commit to GitHub

```powershell
cd C:\Users\DELL-PC\FarmPay-AI
git push origin main
```

The local commit `ed727d7` is not yet on GitHub. Push it now.

---

## Priority 5 (Nov 9–10) — Submission Form [REQUIRED]

### Task 5.1 — Complete hackathon submission form

Fill in:
- Project name: FarmPay AI
- GitHub URL: https://github.com/aimanarshiya/FarmPay-AI
- YouTube demo video URL.
- Sponsor tools: PayPal, Google.
- Team members (verify acceptance in portal).

### Task 5.2 — Verify teammate invitations accepted

Log in to hackathon portal and confirm all invited teammates show "Accepted" status.

---

## Priority 6 (Nov 10–11) — Final Regression Test [REQUIRED]

### Task 6.1 — Full regression pass

```powershell
# Backend
cd C:\Users\DELL-PC\FarmPay-AI\backend
.\.venv\Scripts\Activate.ps1
python -m unittest discover -s tests -v

# Frontend
cd ..\frontend
npm run build
npm run lint
```

### Task 6.2 — Manual demo walkthrough

Perform the complete 5-step judge demo exactly as described in JUDGE_GUIDE.md.
Verify every step succeeds before submission.

---

## Priority 7 (Nov 11–12) — Submission Freeze [REQUIRED]

- No new features after Nov 11 00:00 IST.
- Final git push.
- Confirm submission form is submitted (not just saved as draft).
- Keep PayPal Sandbox buyer account credentials active through Dec 21.
- Keep Gemini API key active through Dec 21.

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Gemini API quota exceeded during judge demo | Medium | High | Use free tier sparingly; add response caching |
| PayPal Sandbox session expires for judges | Low | High | Provide fresh sandbox buyer credentials in JUDGE_GUIDE |
| GitHub push fails (auth) | Low | High | Run `git push` immediately in Priority 4 |
| Demo video exceeds 3 minutes | Medium | Medium | Script and rehearse before recording |
| Submission form deadline missed | Low | Critical | Submit on Nov 10 to avoid Nov 12 rush |

---

## Daily Target Summary

| Day | Date (IST) | Target |
|---|---|---|
| Day 1 | Nov 6 (today) | Phase 1.1 committed ✅ — Start Gemini backend implementation |
| Day 2 | Nov 7 | Gemini backend + frontend complete; tests passing |
| Day 3 | Nov 8 | README update + JUDGE_GUIDE.md; push to GitHub |
| Day 4 | Nov 9 | Record and upload demo video |
| Day 5 | Nov 10 | Submit hackathon form; full regression test |
| Day 6 | Nov 11 | Buffer day — fix any regressions |
| Day 7 | Nov 12 | Submission freeze by 11:00 AM PST |
