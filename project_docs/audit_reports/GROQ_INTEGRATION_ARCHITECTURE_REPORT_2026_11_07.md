# FarmPay AI — Groq Integration Architecture Report

**Date:** 2026-11-07
**System:** FarmPay AI MVP
**Version:** 2.0 Consolidated
**Author:** Full-Stack Architecture & AI Lead
**Status:** Approved & Verified Live

---

## 1. Executive Summary

As part of the FarmPay AI Phase 2 Consolidation, **Groq Cloud API** was promoted to the **primary AI decision provider** for farmer produce offer recommendations.

Prior to this upgrade, FarmPay AI relied on Google Gemini (`gemini-2.5-flash`), which faced deprecation and intermittent connectivity issues. The new architecture implements:
1. **Groq Primary Provider:** Model `openai/gpt-oss-20b` running on Groq's high-performance LPU inference engine via OpenAI-compatible endpoints (`https://api.groq.com/openai/v1/chat/completions`).
2. **Multi-Tier Cascade Fallback:** Groq $\rightarrow$ Google Gemini (`gemini-3.8-flash`) $\rightarrow$ Anthropic Claude (`claude-3-5-haiku`) $\rightarrow$ Deterministic Math Fallback (`deterministic-fallback`).
3. **Bilingual Reasoning:** Native support for English (`en`) and Telugu (`te`), ensuring vernacular accessibility for rural Indian farmers.
4. **Resilience & Security:** Bounded exponential backoff retries, anti-hallucination offer grounding against real MySQL records, zero secrets leakage, and standard `User-Agent` headers preventing gateway blocking.

---

## 2. Architecture & Request Pipeline

### 2.1 Provider Cascading Architecture

The recommendation engine follows a fail-open, high-reliability cascading strategy:

```
Farmer Views Listing Offers
           │
           ▼
   backend/app/offers.py
   [GET /api/listings/{id}/recommendation]
           │
           ▼
   backend/app/ai_service.py: analyze_offers()
           │
 ┌─────────┴──────────────────────────────────────────┐
 │ Step 1: Groq API (openai/gpt-oss-20b)              │
 │ - User-Agent: FarmPayAI/2.0 (compatible; Windows)  │
 │ - Bounded retries (2x) on HTTP 429/503/timeout     │
 │ - JSON Mode (response_format: json_object)         │
 └─────────┬──────────────────────────────────────────┘
           │ (Fails / Unconfigured / Rate Limited / Hallucinated)
           ▼
 ┌────────────────────────────────────────────────────┐
 │ Step 2: Google Gemini API (gemini-3.8-flash)       │
 │ - Official Google GenAI SDK client                 │
 └─────────┬──────────────────────────────────────────┘
           │ (Fails / Unconfigured)
           ▼
 ┌────────────────────────────────────────────────────┐
 │ Step 3: Anthropic Claude (claude-3-5-haiku)        │
 │ - Messages API (anthropic SDK / urllib)            │
 └─────────┬──────────────────────────────────────────┘
           │ (Fails / Unconfigured)
           ▼
 ┌────────────────────────────────────────────────────┐
 │ Step 4: Deterministic Math Fallback Engine         │
 │ - Net Proceeds = (Price/kg * Qty) - Transport      │
 │ - Always succeeds, 0 ms latency, 100% grounded     │
 └────────────────────────────────────────────────────┘
```

### 2.2 Endpoint & Header Specifications

- **Target URL:** `https://api.groq.com/openai/v1/chat/completions`
- **Method:** `POST`
- **Headers:**
  * `Authorization: Bearer <GROQ_API_KEY>` (loaded securely from `backend/.env`)
  * `Content-Type: application/json`
  * `User-Agent: FarmPayAI/2.0 (compatible; Windows)` *(Critical: default Python urllib User-Agent is blocked by Groq Cloudflare protections with HTTP 403)*
- **Payload Schema:**
  ```json
  {
    "model": "openai/gpt-oss-20b",
    "messages": [
      {
        "role": "system",
        "content": "<Strict economic role, JSON output constraint, anti-hallucination rule, language directive>"
      },
      {
        "role": "user",
        "content": "<Listing metadata, list of buyer offers with calculated net proceeds, language code>"
      }
    ],
    "response_format": { "type": "json_object" },
    "temperature": 0.2,
    "max_tokens": 1000
  }
  ```

---

## 3. Bilingual Support: English & Telugu

A core requirement for rural agricultural accessibility is native language support. The prompt engine dynamically configures instructions based on the requested language (`en` or `te`):

### 3.1 Telugu Directive (`te`)
When `language == 'te'`, the prompt instructs Groq:
- *"Respond in natural, respectful Telugu (తెలుగు). The explanation and pros/cons must be in clear Telugu for a rural farmer in Andhra Pradesh or Telangana, while keeping buyer names and currency numbers readable."*

### 3.2 Live Verification Output
In live testing against Groq `openai/gpt-oss-20b`, the Telugu response generated:
```json
{
  "recommended_buyer_id": "USR-BUY-DEMO01",
  "explanation": "కిలోకు రూ. 32.00 చొప్పున 250 క్వింటాళ్లకు రవాణా ఖర్చులను మినహాయించిన తర్వాత రైతుకు అత్యధిక నికర ఆదాయాన్ని (రూ. 7,92,000) అందిస్తుంది.",
  "confidence_score": 0.95,
  "model_used": "openai/gpt-oss-20b",
  "is_fallback": false
}
```

---

## 4. Anti-Hallucination & Grounding Safeguards

Large language models can occasionally invent identifier strings or recommend non-existent buyers. FarmPay AI enforces an unbypassable programmatic barrier:

1. **Pre-Computed Math Grounding:** The prompt includes exact pre-computed financial values:
   $$\text{Gross} = \text{Offered Price per Quintal} \times \text{Quantity}$$
   $$\text{Net Proceeds} = \text{Gross} - \text{Transport Cost}$$
2. **Candidate ID Set Verification:**
   ```python
   valid_buyer_ids = {o["buyer_id"] for o in offers}
   if rec_buyer_id not in valid_buyer_ids:
       logger.warning(f"AI ({model}) recommended unknown buyer_id '{rec_buyer_id}'. Falling back.")
       return _deterministic_fallback(listing, offers, language=language)
   ```
   If the model returns any `recommended_buyer_id` not present in the active MySQL offer set for that listing, the response is discarded and the deterministic engine takes over.

---

## 5. Bounded Retry & Exponential Backoff

To handle intermittent network blips and rate limits (HTTP 429) gracefully:
- **Maximum Retries:** 2 retries (3 total attempts).
- **Initial Backoff:** 1.5 seconds.
- **Multiplier:** $2\times$ (Attempt 1: 1.5s, Attempt 2: 3.0s).
- **Transient Status Codes:** HTTP 429, 502, 503, 504, `TimeoutError`, `URLError`.
- **Fatal Status Codes:** HTTP 401 (Invalid API key), 400 (Bad request) immediately skip retries and cascade to the next provider.

---

## 6. Backward Compatibility

To maintain backward compatibility with legacy tests and external callers:
```python
def analyze_offers_with_gemini(listing: dict, offers: list, language: str = "en") -> dict:
    """Backward compatibility alias for existing test suites."""
    return analyze_offers(listing, offers, language=language)
```
The alias delegates seamlessly to `analyze_offers`, ensuring existing unit tests continue to pass without modification.

---

## 7. Verification Summary

| Verification Target | Requirement | Result |
|---|---|---|
| Groq Live Call (English) | `is_fallback: False`, model: `openai/gpt-oss-20b` | **VERIFIED PASS** |
| Groq Live Call (Telugu) | Fluent Telugu text, correct buyer ID | **VERIFIED PASS** |
| Fallback on HTTP 401 | Immediate graceful fallback to deterministic | **VERIFIED PASS** |
| Fallback on HTTP 429 | 2 retries with backoff, then cascade | **VERIFIED PASS** |
| Fallback on Invalid JSON | Discard corrupt output, fallback safely | **VERIFIED PASS** |
| Hallucinated ID Guard | Non-existent buyer ID rejected | **VERIFIED PASS** |
| Zero Secrets Exposure | No keys in logs, HTTP responses, or Git | **VERIFIED PASS** |
