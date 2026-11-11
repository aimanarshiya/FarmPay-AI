import { useAuth } from "../context/useAuth";

export default function AIRecommendationCard({ recommendation }) {
  const { t } = useAuth();

  if (!recommendation) return null;

  const isFallback = recommendation.is_fallback;
  const buyerName = recommendation.recommended_buyer_name || "Optimal Buyer";
  const modelUsed = recommendation.model_used || "AI Advisor";

  return (
    <section className="ai-recommendation-card" aria-label="AI Recommendation">
      <div className="ai-card-header">
        <div className="ai-badge-row">
          <span className={`ai-provider-pill ${isFallback ? "fallback-pill" : "active-ai-pill"}`}>
            <span className="sparkle-icon" aria-hidden="true">{isFallback ? "⚙️" : "⚡"}</span>
            <span>{isFallback ? t("ai_fallback_badge") : `Groq AI • ${modelUsed}`}</span>
          </span>
          <span className="verification-pill">
            ✓ Grounded in Verified Calculations
          </span>
        </div>
        <h3 className="ai-card-heading">{t("ai_advisor_title")}</h3>
        <p className="ai-lead-text">{t("ai_advisor_subtitle")}</p>
      </div>

      <div className="ai-card-body">
        {/* Recommended Buyer Banner */}
        <div className="recommended-highlight-box">
          <div className="highlight-tag">
            <span className="tag-icon">🏆</span> {t("ai_recommended_buyer")}
          </div>
          <div className="recommended-name">{buyerName}</div>
          <p className="recommendation-summary">{recommendation.summary}</p>
        </div>

        {/* Financial Net Breakdown */}
        {recommendation.financial_analysis && (
          <div className="ai-detail-block financial-block">
            <h4 className="detail-heading">
              <span className="heading-icon">📊</span> {t("ai_analysis_label")}
            </h4>
            <div className="financial-text-box">
              {recommendation.financial_analysis}
            </div>
          </div>
        )}

        {/* Key Trade-Offs */}
        {recommendation.trade_offs && recommendation.trade_offs.length > 0 && (
          <div className="ai-detail-block tradeoffs-block">
            <h4 className="detail-heading">
              <span className="heading-icon">⚖️</span> {t("ai_tradeoffs_label")}
            </h4>
            <ul className="tradeoff-list">
              {recommendation.trade_offs.map((item, idx) => (
                <li key={idx} className="tradeoff-item">
                  <span className="bullet-point">▸</span> {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cautionary Warnings */}
        {recommendation.warnings && recommendation.warnings.length > 0 && (
          <div className="ai-detail-block warnings-block">
            <h4 className="detail-heading warnings-heading">
              <span className="heading-icon">⚠️</span> {t("ai_warnings_label")}
            </h4>
            <ul className="warnings-list">
              {recommendation.warnings.map((warn, idx) => (
                <li key={idx} className="warning-item">
                  <span className="bullet-point">!</span> {warn}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Ethical AI & Farmer Autonomy Disclaimer */}
      <div className="ai-disclaimer-footer">
        <span className="info-icon" aria-hidden="true">ℹ️</span>
        <small className="disclaimer-text">
          {recommendation.disclaimer || t("ai_disclaimer")}
        </small>
      </div>
    </section>
  );
}
