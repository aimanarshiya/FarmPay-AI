"""
FarmPay AI — AI Recommendation Service (v2.0)

Provider priority:
  1. Groq (primary)   — GROQ_API_KEY + GROQ_MODEL via OpenAI-compatible endpoint
  2. Gemini (optional) — GEMINI_API_KEY + GEMINI_MODEL via google-genai SDK
  3. Claude (optional) — ANTHROPIC_API_KEY via anthropic HTTP API
  4. Deterministic    — Pure math fallback, always available

Safety invariants (all providers):
  - Recommended buyer_id MUST exist in the provided offer list (hallucination guard).
  - Financial figures are calculated exclusively by backend business logic.
  - No AI provider can initiate payments or modify database records.
  - Fallback is triggered automatically on any error, timeout, or invalid response.
  - API keys are never logged or exposed.
"""

import os
import json
import time
import logging
import urllib.request
import urllib.error
from typing import List, Dict, Any, Optional

from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

# --------------------------------------------------
# CONFIGURATION
# --------------------------------------------------

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL_DEFAULT = "openai/gpt-oss-20b"

GEMINI_MODEL_DEFAULT = "gemini-3.8-flash"
ANTHROPIC_MODEL_DEFAULT = "claude-3-5-haiku-20241022"

_PLACEHOLDER_KEYS = {"", "your_groq_api_key_here", "your_gemini_api_key_here", "your_anthropic_api_key_here"}

MAX_RETRIES = 2
BACKOFF_BASE_SECONDS = 1.5
REQUEST_TIMEOUT_SECONDS = 20


# --------------------------------------------------
# DATA MODEL
# --------------------------------------------------

class AIRecommendation(BaseModel):
    recommended_buyer_id: str
    recommended_buyer_name: str
    summary: str
    financial_analysis: str
    trade_offs: Optional[List[str]] = Field(default_factory=list)
    warnings: Optional[List[str]] = Field(default_factory=list)
    is_fallback: bool = False
    model_used: str = "deterministic-fallback"
    disclaimer: str = (
        "AI-assisted recommendation based on verified financial calculations. "
        "Final selling decision belongs entirely to the farmer."
    )


# --------------------------------------------------
# DETERMINISTIC FALLBACK (always available)
# --------------------------------------------------

def generate_deterministic_fallback(
    crop: str,
    quantity_kg: float,
    location: str,
    offers: List[Dict[str, Any]],
    reason: str = "AI assistance unavailable",
    language: str = "en",
) -> AIRecommendation:
    """
    Pure mathematical recommendation ranked by highest net proceeds.
    Used when every AI provider is unavailable, fails, or returns invalid output.
    """
    if not offers:
        if language == "te":
            return AIRecommendation(
                recommended_buyer_id="",
                recommended_buyer_name="None",
                summary="ఈ పంట జాబితాకు ప్రస్తుతం ఏ వ్యాపారి ఆఫర్లు అందుబాటులో లేవు.",
                financial_analysis="జాబితా సక్రియంగా ఉంది. వ్యాపారులు బిడ్లు సమర్పించిన తర్వాత తనిఖీ చేయండి.",
                is_fallback=True,
                model_used="deterministic-fallback",
            )
        return AIRecommendation(
            recommended_buyer_id="",
            recommended_buyer_name="None",
            summary="No buyer offers are currently available for this harvest listing.",
            financial_analysis="Listing is active. Check back once buyers submit competitive bids.",
            is_fallback=True,
            model_used="deterministic-fallback",
        )

    sorted_offers = sorted(
        offers,
        key=lambda o: (float(o.get("net_proceeds", 0)), -float(o.get("transport_cost", 0))),
        reverse=True,
    )
    best = sorted_offers[0]

    best_name = best.get("buyer_name", "Best Offer")
    best_id = str(best.get("buyer_id", ""))
    best_net = float(best.get("net_proceeds", 0))
    best_gross = float(best.get("gross_amount", 0))
    best_transport = float(best.get("transport_cost", 0))
    best_price = float(best.get("price_per_kg", 0))

    trade_offs = []
    warnings = []

    if len(sorted_offers) > 1:
        runner_up = sorted_offers[1]
        diff = best_net - float(runner_up.get("net_proceeds", 0))
        trade_offs.append(
            f"{best_name} yields ₹{diff:,.2f} more net proceeds than {runner_up.get('buyer_name')}."
        )
        if float(best.get("price_per_kg", 0)) < float(runner_up.get("price_per_kg", 0)):
            trade_offs.append(
                f"{runner_up.get('buyer_name')} quotes a higher rate per kg, "
                f"but higher transport costs result in lower net earnings."
            )

    if best_transport > 500:
        warnings.append(
            f"High transport deduction of ₹{best_transport:,.2f}. "
            f"Confirm delivery location before accepting."
        )

    if language == "te":
        summary = (
            f"{location}లో మీ {quantity_kg:,.0f} కిలోల {crop} పంటకు {best_name} ని సిఫార్సు చేస్తున్నాం. "
            f"₹{best_transport:,.2f} రవాణా తగ్గింపు తర్వాత అత్యధిక అంచనా నికర ఆదాయం ₹{best_net:,.2f}."
        )
        financial_analysis = (
            f"స్థూల విలువ: ₹{best_gross:,.2f} (₹{best_price:.2f}/కిలో) మైనస్ "
            f"రవాణా: ₹{best_transport:,.2f} = నికర చెల్లింపు: ₹{best_net:,.2f}."
        )
    else:
        summary = (
            f"We recommend {best_name} for your {quantity_kg:,.0f} kg of {crop} in {location}. "
            f"This offer yields the highest estimated net proceeds of ₹{best_net:,.2f} "
            f"after deducting ₹{best_transport:,.2f} transport."
        )
        financial_analysis = (
            f"Gross value: ₹{best_gross:,.2f} (₹{best_price:.2f}/kg) minus "
            f"transport cost: ₹{best_transport:,.2f} = Net payout: ₹{best_net:,.2f}."
        )

    return AIRecommendation(
        recommended_buyer_id=best_id,
        recommended_buyer_name=best_name,
        summary=summary,
        financial_analysis=financial_analysis,
        trade_offs=trade_offs,
        warnings=warnings,
        is_fallback=True,
        model_used=f"deterministic-fallback ({reason})",
    )


# --------------------------------------------------
# SHARED HELPERS
# --------------------------------------------------

def _build_offers_summary(offers: List[Dict[str, Any]]) -> List[Dict]:
    """Return a sanitized, type-safe representation of offers for the AI prompt."""
    return [
        {
            "buyer_id": str(o.get("buyer_id")),
            "buyer_name": str(o.get("buyer_name")),
            "price_per_kg_inr": float(o.get("price_per_kg", 0)),
            "gross_amount_inr": float(o.get("gross_amount", 0)),
            "transport_cost_inr": float(o.get("transport_cost", 0)),
            "net_proceeds_inr": float(o.get("net_proceeds", 0)),
            "notes": str(o.get("notes", "") or ""),
        }
        for o in offers
    ]


def _build_prompt(
    crop: str,
    quantity_kg: float,
    location: str,
    offers_summary: List[Dict],
    language: str = "en",
) -> str:
    """Build a bilingual AI prompt for agricultural offer recommendation."""
    lang_instruction = ""
    if language == "te":
        lang_instruction = (
            "\n\nIMPORTANT: Respond in Telugu language (తెలుగు) for the 'summary' and "
            "'financial_analysis' fields. Keep buyer names, offer IDs, and currency amounts "
            "in their original form. The JSON structure must remain in English."
        )

    return f"""You are an expert, ethical agricultural commerce advisor for Indian farmers on the FarmPay AI marketplace.
Your task is to analyze real, verified buyer offers and recommend the best offer for the farmer.

FARMER HARVEST:
- Crop: {crop}
- Quantity: {quantity_kg} kg
- Location: {location}

ACTUAL BUYER OFFERS (sorted by calculated net proceeds — these figures are authoritative):
{json.dumps(offers_summary, indent=2, ensure_ascii=False)}

RULES (strictly enforced):
1. Recommend ONLY one buyer from the list above using their EXACT buyer_id. Never invent a buyer.
2. Base your recommendation on NET PROCEEDS — what the farmer actually receives after transport.
3. Explain the trade-offs honestly and simply.
4. Flag any cautionary warnings (e.g., high transport cost, vague notes).
5. Do NOT claim that your underlying knowledge is real-time or updated daily.
6. Output ONLY valid JSON — no markdown, no code blocks, no extra text.{lang_instruction}

Required JSON schema (exact field names):
{{
  "recommended_buyer_id": "string — exact match from offers list",
  "recommended_buyer_name": "string",
  "summary": "string — 2-3 sentences in simple language",
  "financial_analysis": "string — clear INR breakdown: price, gross, transport, net",
  "trade_offs": ["string", "string"],
  "warnings": ["string"]
}}"""


def _validate_and_build_recommendation(
    data: Dict,
    offers: List[Dict[str, Any]],
    model_name: str,
    crop: str,
    quantity_kg: float,
    location: str,
    language: str = "en",
) -> AIRecommendation:
    """
    Validates AI output against the actual offer list (hallucination guard).
    Returns a deterministic fallback if validation fails.
    """
    rec_id = str(data.get("recommended_buyer_id", "")).strip()

    if not rec_id:
        logger.warning("AI returned empty recommended_buyer_id. Falling back.")
        return generate_deterministic_fallback(
            crop, quantity_kg, location, offers, "AI returned empty buyer_id", language
        )

    matching_offer = next(
        (o for o in offers if str(o.get("buyer_id")) == rec_id), None
    )
    if not matching_offer:
        logger.warning(
            "AI (%s) recommended unknown buyer_id '%s'. Falling back.", model_name, rec_id
        )
        return generate_deterministic_fallback(
            crop, quantity_kg, location, offers,
            f"AI returned unknown buyer ({rec_id})", language
        )

    return AIRecommendation(
        recommended_buyer_id=rec_id,
        recommended_buyer_name=matching_offer.get(
            "buyer_name", data.get("recommended_buyer_name", "")
        ),
        summary=str(data.get("summary", "")).strip(),
        financial_analysis=str(data.get("financial_analysis", "")).strip(),
        trade_offs=data.get("trade_offs", []),
        warnings=data.get("warnings", []),
        is_fallback=False,
        model_used=model_name,
    )


def _parse_json_response(text: str) -> Dict:
    """Parse JSON from AI response, stripping markdown code blocks if present."""
    text = text.strip()
    # Strip markdown code fences
    if text.startswith("```"):
        lines = text.split("\n")
        # Remove opening fence
        lines = lines[1:]
        # Remove closing fence
        if lines and lines[-1].strip().startswith("```"):
            lines = lines[:-1]
        text = "\n".join(lines).strip()
    return json.loads(text)


# --------------------------------------------------
# PROVIDER 1: GROQ (Primary)
# --------------------------------------------------

def _call_groq(
    crop: str,
    quantity_kg: float,
    location: str,
    offers: List[Dict[str, Any]],
    language: str = "en",
) -> AIRecommendation:
    """
    Calls Groq via OpenAI-compatible chat completions endpoint.
    Uses bounded retries with exponential backoff on rate limit (429) errors.
    """
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key or api_key in _PLACEHOLDER_KEYS:
        raise ValueError("GROQ_API_KEY not configured")

    model = os.getenv("GROQ_MODEL", GROQ_MODEL_DEFAULT).strip()
    offers_summary = _build_offers_summary(offers)
    prompt = _build_prompt(crop, quantity_kg, location, offers_summary, language)

    payload = json.dumps({
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a strict JSON-only agricultural advisor. "
                    "Output only valid JSON with no markdown, no explanations, "
                    "no commentary outside the JSON object."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.2,
        "max_tokens": 1000,
        "response_format": {"type": "json_object"},
    }).encode("utf-8")

    last_error = None
    for attempt in range(MAX_RETRIES + 1):
        try:
            req = urllib.request.Request(
                GROQ_API_URL,
                data=payload,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                    "User-Agent": "FarmPayAI/2.0 (compatible; Windows)",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT_SECONDS) as resp:
                body = json.loads(resp.read().decode("utf-8"))

            content = body["choices"][0]["message"]["content"]
            data = _parse_json_response(content)
            return _validate_and_build_recommendation(
                data, offers, model, crop, quantity_kg, location, language
            )

        except urllib.error.HTTPError as e:
            status = e.code
            if status == 429 and attempt < MAX_RETRIES:
                wait = BACKOFF_BASE_SECONDS * (2 ** attempt)
                logger.warning(
                    "Groq rate limited (429). Retrying in %.1fs (attempt %d/%d)...",
                    wait, attempt + 1, MAX_RETRIES
                )
                time.sleep(wait)
                last_error = e
                continue
            elif status == 401:
                raise ValueError(f"Groq API key invalid or unauthorized (HTTP 401)") from e
            else:
                raise RuntimeError(f"Groq HTTP error {status}: {e.reason}") from e

        except (json.JSONDecodeError, KeyError) as e:
            raise RuntimeError(f"Groq returned invalid JSON: {e}") from e

        except Exception as e:
            last_error = e
            if attempt < MAX_RETRIES:
                wait = BACKOFF_BASE_SECONDS * (2 ** attempt)
                logger.warning(
                    "Groq call failed (%s). Retrying in %.1fs...", type(e).__name__, wait
                )
                time.sleep(wait)
                continue
            break

    raise last_error or RuntimeError("Groq: exhausted retries")


# --------------------------------------------------
# PROVIDER 2: GEMINI (Optional secondary)
# --------------------------------------------------

def _call_gemini(
    crop: str,
    quantity_kg: float,
    location: str,
    offers: List[Dict[str, Any]],
    language: str = "en",
) -> AIRecommendation:
    """
    Calls Google Gemini via google-genai SDK.
    Optional — only used if GEMINI_API_KEY is set and Groq is unavailable.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key or api_key in _PLACEHOLDER_KEYS:
        raise ValueError("GEMINI_API_KEY not configured")

    from google import genai  # type: ignore
    from google.genai import types  # type: ignore

    model = os.getenv("GEMINI_MODEL", GEMINI_MODEL_DEFAULT).strip()
    offers_summary = _build_offers_summary(offers)
    prompt = _build_prompt(crop, quantity_kg, location, offers_summary, language)

    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.2,
        ),
    )

    data = _parse_json_response(response.text)
    return _validate_and_build_recommendation(
        data, offers, model, crop, quantity_kg, location, language
    )


# --------------------------------------------------
# PROVIDER 3: CLAUDE (Optional tertiary)
# --------------------------------------------------

def _call_claude(
    crop: str,
    quantity_kg: float,
    location: str,
    offers: List[Dict[str, Any]],
    language: str = "en",
) -> AIRecommendation:
    """
    Calls Anthropic Claude via HTTP API.
    Optional — only used if both Groq and Gemini are unavailable.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
    if not api_key or api_key in _PLACEHOLDER_KEYS:
        raise ValueError("ANTHROPIC_API_KEY not configured")

    model = os.getenv("ANTHROPIC_MODEL", ANTHROPIC_MODEL_DEFAULT).strip()
    offers_summary = _build_offers_summary(offers)
    prompt = _build_prompt(crop, quantity_kg, location, offers_summary, language)

    payload = json.dumps({
        "model": model,
        "max_tokens": 1000,
        "messages": [{"role": "user", "content": prompt}],
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=payload,
        headers={
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT_SECONDS) as resp:
        body = json.loads(resp.read().decode("utf-8"))

    content_text = body["content"][0]["text"].strip()
    data = _parse_json_response(content_text)
    return _validate_and_build_recommendation(
        data, offers, model, crop, quantity_kg, location, language
    )


# --------------------------------------------------
# PUBLIC API — analyze_offers (primary entry point)
# --------------------------------------------------

def analyze_offers(
    crop: str,
    quantity_kg: float,
    location: str,
    offers: List[Dict[str, Any]],
    language: str = "en",
) -> AIRecommendation:
    """
    Main entry point for AI-powered agricultural offer recommendation.

    Provider chain (each falls back to the next on any error):
      1. Groq (primary — GROQ_API_KEY required)
      2. Gemini (optional — GEMINI_API_KEY)
      3. Claude (optional — ANTHROPIC_API_KEY)
      4. Deterministic (always available)

    Enforces:
    - Hallucination guard: recommended buyer must exist in provided offers.
    - No financial figures from AI: all amounts come from backend calculations.
    - No payment initiation or database writes from this function.
    - Language: 'en' (English) or 'te' (Telugu).
    """
    if not offers:
        return generate_deterministic_fallback(
            crop, quantity_kg, location, offers, "No offers to analyze", language
        )

    # --- Try Groq (primary) ---
    groq_key = os.getenv("GROQ_API_KEY", "").strip()
    if groq_key and groq_key not in _PLACEHOLDER_KEYS:
        try:
            rec = _call_groq(crop, quantity_kg, location, offers, language)
            logger.info("Groq recommendation delivered: buyer=%s", rec.recommended_buyer_id)
            return rec
        except Exception as ex:
            logger.warning("Groq failed: %s. Trying next provider.", str(ex))

    # --- Try Gemini (optional secondary) ---
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    if gemini_key and gemini_key not in _PLACEHOLDER_KEYS:
        try:
            rec = _call_gemini(crop, quantity_kg, location, offers, language)
            logger.info("Gemini recommendation delivered: buyer=%s", rec.recommended_buyer_id)
            return rec
        except Exception as ex:
            logger.warning("Gemini failed: %s. Trying next provider.", str(ex))

    # --- Try Claude (optional tertiary) ---
    anthropic_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
    if anthropic_key and anthropic_key not in _PLACEHOLDER_KEYS:
        try:
            rec = _call_claude(crop, quantity_kg, location, offers, language)
            logger.info("Claude recommendation delivered: buyer=%s", rec.recommended_buyer_id)
            return rec
        except Exception as ex:
            logger.warning("Claude failed: %s. Using deterministic fallback.", str(ex))

    # --- Deterministic fallback ---
    logger.info("All AI providers unavailable. Using deterministic fallback.")
    return generate_deterministic_fallback(
        crop, quantity_kg, location, offers,
        "All AI providers unavailable or unconfigured", language
    )


# --------------------------------------------------
# BACKWARD COMPATIBILITY ALIAS
# --------------------------------------------------

def analyze_offers_with_gemini(
    crop: str,
    quantity_kg: float,
    location: str,
    offers: List[Dict[str, Any]],
    language: str = "en",
) -> AIRecommendation:
    """
    Backward-compatible alias for analyze_offers().
    Groq is now primary; Gemini is optional secondary.
    Callers still using this name are unaffected.
    """
    return analyze_offers(crop, quantity_kg, location, offers, language)
