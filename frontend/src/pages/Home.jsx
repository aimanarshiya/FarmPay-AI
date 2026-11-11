import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import OfferGrid from "../components/OfferGrid";
import ErrorMessage from "../components/ErrorMessage";
import AIRecommendationCard from "../components/AIRecommendationCard";
import { fetchOffers } from "../api/offers";

export default function Home() {
  const { t, language } = useAuth();

  // Instant Calculator / Demo State
  const [crop, setCrop] = useState("Rice");
  const [quantity, setQuantity] = useState("500");
  const [location, setLocation] = useState("Guntur");

  const [offers, setOffers] = useState([]);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [disclaimer, setDisclaimer] = useState("");
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  function toggleFaq(idx) {
    setOpenFaq(openFaq === idx ? null : idx);
  }

  function handleSelectBuyer(buyer) {
    setSelectedBuyer(buyer);
  }

  async function handleFindBuyers(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setOffers([]);
    setAiRecommendation(null);
    setDisclaimer("");
    setSelectedBuyer(null);

    try {
      const result = await fetchOffers({
        crop,
        quantityKg: quantity,
        location,
      });

      setOffers(result.offers || []);
      setAiRecommendation(result.ai_recommendation || null);
      setDisclaimer(result.disclaimer || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const coreFeatures = [
    {
      id: "voice",
      title: "Voice-to-Trade",
      tag: "Multilingual Voice AI",
      desc: "Create produce listings in Telugu, Hindi, or English using voice dictation and automated harvest attribute extraction.",
      path: "/farmer/voice",
      icon: "mic",
      cta: "Try Voice Listing",
    },
    {
      id: "fairbid",
      title: "FarmPay FairBid",
      tag: "Transparent Pricing",
      desc: "Compare buyer offers by actual net bank realisation after transport costs and mandi deductions, eliminating hidden fees.",
      path: "/fairbid",
      icon: "balance",
      cta: "Discover FairBid",
    },
    {
      id: "passport",
      title: "Buyer Trust Passport",
      tag: "Verified Counterparties",
      desc: "Review verified corporate buyer track records, fulfillment scores, and APMC licenses before accepting any contract.",
      path: "/buyer/trust-passport",
      icon: "shield",
      cta: "View Trust Ratings",
    },
    {
      id: "payments",
      title: "Digital Payments",
      tag: "Cryptographic Escrow",
      desc: "Automated cryptographic escrow protection with milestone tracking and PayPal Sandbox international checkout verification.",
      path: "/payments",
      icon: "account_balance_wallet",
      cta: "Open Payments Center",
    },
  ];

  const faqs = [
    {
      q: language === "te" ? "ఫార్మ్‌పే AI ఎలా పనిచేస్తుంది?" : "How does FarmPay AI protect farmer income?",
      a: language === "te"
        ? "రైతులు తమ పంట వివరాలు నమోదు చేస్తే, వ్యాపారులు నేరుగా పోటీ బిడ్లు దాఖలు చేస్తారు. Gemini AI రవాణా ఖర్చులు తీసివేసి అసలు చేతికందే నికర లాభాన్ని లెక్కించి అత్యుత్తమ ఆఫర్‌ను సిఫార్సు చేస్తుంది."
        : "Farmers list their harvest quantity and expected price. Multiple verified buyers submit binding bids. Our Gemini AI engine calculates true net take-home earnings (Gross minus transport deductions) to clearly show which offer pays the farmer the most.",
    },
    {
      q: language === "te" ? "రవాణా ఖర్చులను ఎవరు నిర్ణయిస్తారు?" : "How are transport deductions calculated?",
      a: language === "te"
        ? "రవాణా తగ్గింపులు పారదర్శకంగా కిలోకు లేదా స్థిర రుసుముగా కొనుగోలుదారు ఆఫర్‌లోనే ముందే నిర్దేశించబడతాయి. రైతులు ఆమోదించే వరకు ఎటువంటి ఆకస్మిక ఛార్జీలు విధించబడవు."
        : "Transport costs are explicitly declared by the buyer in their offer beforehand (e.g. farmgate pickup vs mandi delivery). The backend deterministically calculates net proceeds so farmers are never surprised by hidden freight fees.",
    },
    {
      q: language === "te" ? "పేపాల్ సాండ్‌బాక్స్ మరియు INR లావాదేవీల మధ్య తేడా ఏమిటి?" : "What is the difference between INR agricultural contracts and PayPal Sandbox?",
      a: language === "te"
        ? "వ్యవసాయ పంటల వాణిజ్య ఒప్పందాలు పూర్తిగా భారతీయ రూపాయలలో (INR) మాత్రమే చట్టబద్ధంగా అమలు చేయబడతాయి. పేపాల్ సాండ్‌బాక్స్ ($1.00 USD) అనేది అంతర్జాతీయ డిజిటల్ చెల్లింపుల గేట్‌వే ధృవీకరణను పరీక్షించడానికి మాత్రమే ప్రదర్శించబడుతుంది."
        : "All agricultural contracts, purchase quantities, and farmer payouts are conducted in Indian Rupees (INR). The PayPal Sandbox ($1.00 USD) feature is an independent digital authorization test demonstrating online checkout integration for judges, completely separated from INR settlement.",
    },
    {
      q: language === "te" ? "AI నేరుగా పంటను విక్రయించగలదా?" : "Can the AI automatically accept an offer on my behalf?",
      a: language === "te"
        ? "లేదు. AI కేవలం నిష్పాక్షికమైన సలహాదారు మాత్రమే. తుది ఒప్పందాన్ని ఆమోదించే లేదా తిరస్కరించే పూర్తి అధికారం రైతుకే ఉంటుంది."
        : "Strictly no. FarmPay AI adheres to strict farmer autonomy invariants. The AI only provides advisory analysis and can never accept an offer, reject a bid, or initiate a transaction on its own.",
    },
  ];

  return (
    <div className="portal-home-page w-full min-h-screen bg-surface font-body text-on-surface">
      {/* Live Commodity Ticker Ribbon */}
      <div className="portal-mandi-ticker-strip">
        <div className="ticker-track-container">
          <div className="ticker-title-badge">
            <span className="material-symbols-outlined text-sm">show_chart</span>
            <span>Live Mandi Ticker:</span>
          </div>
          <div className="ticker-items-scroller">
            <span className="ticker-item">
              Wheat Sharbati: <strong>₹2,450/qtl (+1.2%)</strong>
            </span>
            <span className="ticker-item">
              Paddy Sona Masoori: <strong>₹2,520/qtl (Firm)</strong>
            </span>
            <span className="ticker-item">
              Chana Desi: <strong>₹5,400/qtl (+0.8%)</strong>
            </span>
            <span className="ticker-item">
              Turmeric Salem: <strong>₹15,500/qtl (+2.4%)</strong>
            </span>
          </div>
        </div>
        <div className="ticker-status-badge">
          <span className="ticker-pulse-dot"></span>
          <span className="ticker-status-text-full">256-Bit Escrow Vault Active • PayPal Gateway Ready</span>
          <span className="ticker-status-text-compact">Escrow Active • PayPal Ready</span>
        </div>
      </div>

      {/* 1. HERO SERVICE BANNER */}
      <section className="portal-hero-section">
        <div className="portal-hero-inner">
          <div className="portal-hero-text">
            <div className="portal-official-tag">
              <span className="shield-icon">🛡️</span>
              <span>{t("home_platform_tag")}</span>
            </div>

            <h1 className="portal-hero-title">
              {t("home_title_line_1")}
              <span className="hero-highlight"> {t("home_title_line_2")}</span>
            </h1>

            <p className="portal-hero-lead">{t("home_hero_lead")}</p>

            <div className="hero-cta-ribbon">
              <Link to="/marketplace" className="btn-service primary">
                <span className="btn-icon">🛒</span>
                <span>Explore Marketplace</span>
                <span className="btn-arrow">→</span>
              </Link>
              <Link to="/farmer/create-listing" className="btn-service secondary">
                <span className="btn-icon">🌾</span>
                <span>Create Produce Listing</span>
              </Link>
              <Link to="/fairbid" className="btn-service outline">
                <span className="btn-icon">⚖️</span>
                <span>Discover FairBid</span>
              </Link>
            </div>
          </div>

          <div className="portal-hero-stats-card">
            <div className="stats-card-header">
              <span className="badge-live">FARMPAY ADVANTAGE</span>
              <span className="stats-date">Direct Digital Commerce</span>
            </div>
            <div className="stats-metrics-grid">
              <div className="stat-unit">
                <div className="stat-num">01</div>
                <div className="stat-lbl">Voice Harvest Listing</div>
              </div>
              <div className="stat-unit">
                <div className="stat-num">02</div>
                <div className="stat-lbl">True Net Bank Compare</div>
              </div>
              <div className="stat-unit">
                <div className="stat-num">03</div>
                <div className="stat-lbl">256-Bit Escrow Vault</div>
              </div>
              <div className="stat-unit">
                <div className="stat-num">04</div>
                <div className="stat-lbl">Instant Fund Release</div>
              </div>
            </div>
            <div className="stats-footer-note">
              <span>Gemini AI advises. Farmers decide. Settlement is guaranteed.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE PLATFORM CAPABILITIES (Minimal 4-Column Layout) */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-tertiary px-3 py-1 rounded-full bg-surface-container inline-block mb-3">
            Core Platform Capabilities
          </span>
          <h2 className="font-headline font-bold text-3xl sm:text-4xl text-on-surface tracking-tight">
            Empowering Transparent Agricultural Trade
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-3 leading-relaxed">
            Built from the ground up to protect farmer net realization, eliminate predatory deductions, and provide institutional-grade settlement guarantees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreFeatures.map((feat) => (
            <Link
              key={feat.id}
              to={feat.path}
              className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary hover:shadow-xl transition-all duration-200 flex flex-col justify-between group text-decoration-none"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center mb-4 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-200">
                  <span className="material-symbols-outlined text-2xl">
                    {feat.icon}
                  </span>
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-tertiary block mb-2 font-mono">
                  {feat.tag}
                </span>
                <h3 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {feat.desc}
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-outline-variant/15 flex items-center justify-between text-xs font-bold text-primary group-hover:text-primary-deep">
                <span>{feat.cta}</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1.5 transition-transform duration-200">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. INSTANT DEMO CALCULATOR */}
      <section className="portal-calculator-section" id="calculator">
        <div className="calculator-container">
          <div className="section-label-center max-w-2xl mx-auto text-center mb-8">
            <span className="section-eyebrow">FAIRBID ADVISORY</span>
            <h2 className="font-headline font-bold text-3xl sm:text-4xl text-on-surface tracking-tight mt-1 mb-3">
              Instant FairBid & AI Analysis
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Compare competitive buyer offers and understand your actual net earnings before making a selling decision.
            </p>
          </div>

          <form onSubmit={handleFindBuyers} className="calc-input-card">
            <div className="calc-inputs-row">
              <div className="calc-field">
                <label>Select Crop</label>
                <select value={crop} onChange={(e) => setCrop(e.target.value)}>
                  <option value="Rice">Rice (Sona Masoori)</option>
                  <option value="Wheat">Wheat (Sharbati)</option>
                  <option value="Cotton">Cotton (MCU-5)</option>
                  <option value="Chilli">Chilli (Teja Lal Mirch)</option>
                  <option value="Turmeric">Turmeric (Salem)</option>
                </select>
              </div>

              <div className="calc-field">
                <label>Quantity (Kg)</label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="calc-field">
                <label>Mandi / Cluster Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Guntur, Nizamabad, Indore"
                />
              </div>
            </div>

            <div className="calc-action-row">
              <button type="submit" className="btn-service primary" disabled={loading}>
                {loading ? "Analyzing with Gemini AI..." : "Find Competitive Buyer Offers →"}
              </button>
            </div>
          </form>

          <ErrorMessage message={error} />

          {aiRecommendation && (
            <div style={{ marginTop: "24px" }}>
              <AIRecommendationCard recommendation={aiRecommendation} />
            </div>
          )}

          {disclaimer && (
            <p className="text-xs text-on-surface-variant italic mt-3 text-center">{disclaimer}</p>
          )}

          {offers.length > 0 && (
            <div style={{ marginTop: "24px" }}>
              <OfferGrid
                offers={offers}
                onSelect={handleSelectBuyer}
                selectedBuyer={selectedBuyer}
              />
            </div>
          )}
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section className="portal-faq-section">
        <div className="faq-container">
          <div className="section-label-center">
            <span className="section-eyebrow">HELP & CLARIFICATIONS</span>
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`faq-item ${openFaq === idx ? "open" : ""}`}>
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={openFaq === idx}
                >
                  <span className="faq-q-text">{faq.q}</span>
                  <span className="faq-icon">{openFaq === idx ? "−" : "+"}</span>
                </button>
                {openFaq === idx && (
                  <div className="faq-answer-pane">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PUBLIC SERVICE FOOTER */}
      <footer className="portal-footer">
        <div className="footer-top-container">
          <div className="footer-col-brand">
            <div className="footer-brand-title">🌾 FarmPay AI</div>
            <p className="footer-tagline">
              Digital Agricultural Commerce, Gemini AI Net Profit Advisory & Transparent Escrow Settlement.
            </p>
            <div className="footer-regulatory-note">
              Independent agricultural commerce platform designed to empower Indian farmers with true net income transparency.
            </div>
          </div>

          <div className="footer-col-links">
            <h4>Trade & Bidding</h4>
            <ul>
              <li><Link to="/marketplace">Buyer Marketplace</Link></li>
              <li><Link to="/fairbid">FairBid Net Comparison</Link></li>
              <li><Link to="/farmer/voice">Voice-to-Trade Studio</Link></li>
              <li><Link to="/fpo/collective-selling">Collective Selling Pool</Link></li>
            </ul>
          </div>

          <div className="footer-col-links">
            <h4>Settlement & Logistics</h4>
            <ul>
              <li><Link to="/payments">Payments Center & Escrow</Link></li>
              <li><Link to="/logistics">Logistics Intelligence</Link></li>
              <li><Link to="/buyer/trust-passport">Buyer Trust Passport</Link></li>
              <li><Link to="/market/demand-radar">Regional Demand Radar</Link></li>
            </ul>
          </div>

          <div className="footer-col-tech">
            <h4>Technology Stack</h4>
            <div className="tech-badge-list">
              <span className="tech-tag">Gemini 3.8 Flash</span>
              <span className="tech-tag">FastAPI Python 3.13</span>
              <span className="tech-tag">React 19 + Vite 8</span>
              <span className="tech-tag">MySQL 8.0 Engine</span>
              <span className="tech-tag">PayPal Sandbox API v2</span>
              <span className="tech-tag">Google Stitch</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="footer-bottom-inner">
            <span>© 2026 FarmPay AI • Transparent Agricultural Digital Settlement</span>
            <span>English • తెలుగు (Telugu) • हिन्दी (Hindi)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
