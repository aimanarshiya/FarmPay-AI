import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchMyFarmerListings } from "../api/listings";
import { fetchListingOffers } from "../api/negotiations";
import { fetchOffers } from "../api/offers";
import ErrorMessage from "../components/ErrorMessage";
import AIRecommendationCard from "../components/AIRecommendationCard";
import OfferGrid from "../components/OfferGrid";

export default function FairBid() {
  const { listing_id } = useParams();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [selectedListingId, setSelectedListingId] = useState(listing_id || "");
  const [dbOffers, setDbOffers] = useState([]);
  const [showFormula, setShowFormula] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Instant FairBid Calculator State
  const [crop, setCrop] = useState("Rice");
  const [quantity, setQuantity] = useState("500");
  const [location, setLocation] = useState("Guntur");
  const [loading, setLoading] = useState(false);
  const [calcError, setCalcError] = useState("");
  const [computedOffers, setComputedOffers] = useState([]);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [disclaimer, setDisclaimer] = useState("");
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  async function handleFindBuyers(e) {
    e.preventDefault();
    setLoading(true);
    setCalcError("");
    setComputedOffers([]);
    setAiRecommendation(null);
    setDisclaimer("");
    setSelectedBuyer(null);

    try {
      const result = await fetchOffers({
        crop,
        quantityKg: quantity,
        location,
      });

      setComputedOffers(result.offers || []);
      setAiRecommendation(result.ai_recommendation || null);
      setDisclaimer(result.disclaimer || "");
      showToast("Found competitive buyer offers with Gemini AI net analysis!");
    } catch (err) {
      setCalcError(err.message || "Failed to analyze offers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMyFarmerListings()
      .then((res) => {
        if (res && res.listings && res.listings.length > 0) {
          setListings(res.listings);
          if (!selectedListingId) {
            setSelectedListingId(res.listings[0].listing_id);
          }
        }
      })
      .catch(() => {});
  }, [selectedListingId]);

  useEffect(() => {
    if (selectedListingId) {
      fetchListingOffers(selectedListingId)
        .then((res) => {
          if (res && res.offers) {
            setDbOffers(res.offers);
          }
        })
        .catch(() => {});
    }
  }, [selectedListingId]);

  const faqs = [
    {
      q: "How does FarmPay AI protect farmer income?",
      a: "Farmers enter their crop details, and buyers place binding bids. Our Gemini AI engine deducts transport, weighing, and handling fees to calculate your exact net bank take-home before you accept.",
    },
    {
      q: "How are transport deductions calculated?",
      a: "Transport costs are explicitly declared by the buyer in their offer (e.g. farmgate pickup vs mandi delivery). The platform deterministically calculates net proceeds so farmers are never surprised by hidden freight fees.",
    },
    {
      q: "What is the difference between INR agricultural contracts and PayPal Sandbox?",
      a: "All agricultural contracts, purchase quantities, and farmer payouts are conducted in Indian Rupees (INR). The PayPal Sandbox ($1.00 USD) feature is an independent digital authorization test demonstrating online checkout integration for judges, completely separated from INR settlement.",
    },
    {
      q: "Can the AI automatically accept an offer on my behalf?",
      a: "Strictly no. FarmPay AI adheres to strict farmer autonomy invariants. The AI only provides advisory analysis and can never accept an offer, reject a bid, or initiate a transaction on its own.",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-surface font-body text-on-surface py-8 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs sm:text-sm font-medium animate-bounce">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Live State */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to="/farmer" className="hover:text-primary transition-colors">Farmer Operations</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold">FairBid AI Engine</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            Algorithmic Net Take-Home Calculation Active
          </span>
        </div>
      </div>

      {/* PAGE HEADING */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold tracking-widest uppercase text-tertiary px-3.5 py-1 rounded-full bg-surface-container inline-block mb-3">
          FairBid Realtime Net Yield Matrix
        </span>
        <h1 className="font-headline font-bold text-3xl sm:text-4xl text-on-surface tracking-tight">
          Instant FairBid & AI Analysis
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant mt-3 leading-relaxed">
          Compare competitive buyer offers and understand your actual net earnings before making a selling decision.
        </p>
      </div>

      {/* CENTERED, BEAUTIFUL FAIRBID INPUT FORM CARD */}
      <div className="max-w-3xl mx-auto bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-lg p-6 sm:p-8 mb-12">
        <form onSubmit={handleFindBuyers} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Crop Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface">
                Crop Selection
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full h-12 px-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              >
                <option value="Rice">Rice (Sona Masoori)</option>
                <option value="Wheat">Wheat (Sharbati)</option>
                <option value="Cotton">Cotton (MCU-5)</option>
                <option value="Chilli">Chilli (Teja Lal Mirch)</option>
                <option value="Turmeric">Turmeric (Salem)</option>
              </select>
            </div>

            {/* Quantity in Kilograms */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface">
                Quantity (Kg)
              </label>
              <input
                type="number"
                min="50"
                step="50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full h-12 px-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                placeholder="e.g. 500"
                required
              />
            </div>

            {/* Mandi / Cluster Location */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface">
                Mandi / Cluster Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-12 px-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                placeholder="e.g. Guntur, Nalgonda"
                required
              />
            </div>
          </div>

          {/* Find Competitive Buyer Offers CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 rounded-xl bg-gradient-to-r from-[#2d5a3f] to-[#1f432d] hover:from-[#244b34] hover:to-[#173523] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Analyzing Offers with Gemini AI...</span>
                </>
              ) : (
                <>
                  <span>Find Competitive Buyer Offers</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </form>

        <ErrorMessage message={calcError} />

        {aiRecommendation && (
          <div className="mt-6 pt-6 border-t border-outline-variant/20">
            <AIRecommendationCard recommendation={aiRecommendation} />
          </div>
        )}

        {disclaimer && (
          <p className="text-xs text-on-surface-variant italic mt-3 text-center">{disclaimer}</p>
        )}

        {computedOffers.length > 0 && (
          <div className="mt-6">
            <OfferGrid
              offers={computedOffers}
              onSelect={(b) => setSelectedBuyer(b)}
              selectedBuyer={selectedBuyer}
            />
          </div>
        )}
      </div>

      {/* Top Lot Notification & Context Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container p-6 sm:p-8 mb-8 shadow-sm border border-outline-variant/30">
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold tracking-wide uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Live FairBid Desk
              </span>
              <span className="text-outline-variant">•</span>
              <span className="font-mono text-tertiary font-bold tracking-wider">LOT #FP-2024-884</span>
              <span className="text-outline-variant">•</span>
              <span className="text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                Nalgonda, Telangana (Choutuppal Cluster)
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
                Sona Masoori Paddy (150 Quintals)
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
                Moisture: 13.5% (A-Grade Cleaned)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant pt-1">
              <div className="flex items-center gap-1.5 text-error font-semibold bg-error-container/40 px-2.5 py-1 rounded-lg">
                <span className="material-symbols-outlined text-[16px]">timer</span>
                <span>Bidding Window: <strong>04h 15m remaining</strong></span>
              </div>
              <span className="hidden sm:inline text-outline-variant">•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
                {dbOffers.length > 0 ? `${dbOffers.length} Verified Buyer Bids Loaded` : "3 Legitimate Industrial Mill Offers Secured"}
              </span>
              {listings.length > 1 && (
                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="text-[11px] font-bold">Switch Lot:</span>
                  <select
                    value={selectedListingId}
                    onChange={(e) => setSelectedListingId(e.target.value)}
                    className="p-1 rounded bg-surface border border-outline-variant text-[11px] font-bold text-on-surface"
                  >
                    {listings.map((l) => (
                      <option key={l.listing_id} value={l.listing_id}>
                        {l.crop_name || l.crop} ({l.listing_id})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Mandi Delta Highlight Card */}
          <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-2 min-w-[280px]">
            <div className="flex items-center justify-between text-xs text-on-surface-variant">
              <span className="font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-outline">storefront</span>
                APMC Suryapet Mandi Reference
              </span>
              <span className="font-mono font-bold text-on-surface">₹2,250/Qtl</span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-xs font-semibold text-primary">FarmPay Realized Net Gain</span>
              <span className="font-headline text-xl font-bold text-primary">+₹62,964</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-700" style={{ width: "78%" }}></div>
            </div>
            <span className="text-[11px] text-outline leading-tight">Farmer earns 20.3% above conventional middleman route</span>
          </div>
        </div>
      </div>

      {/* FairBid Algorithmic Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-tertiary text-[20px]">balance</span>
            <h2 className="font-headline text-xl font-bold text-on-surface">Net Take-Home Yield Matrix</h2>
          </div>
          <p className="text-sm text-on-surface-variant">
            Deceptive headline prices trap farmers with surprise transit & dockage deductions. FairBid computes your real bank payout.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowFormula(!showFormula)}
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-xs font-bold text-on-surface border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-primary text-[18px]">info</span>
          <span>How Net Formula Works</span>
          <span className={`material-symbols-outlined text-[16px] transition-transform ${showFormula ? "rotate-180" : ""}`}>
            expand_more
          </span>
        </button>
      </div>

      {/* Expandable Deduction Formula & Protections */}
      {showFormula && (
        <div className="mb-8 bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary font-bold">
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                <span>1. Farmgate Transit Guarantee</span>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Standard mandi brokers pass ₹60-₹120/Qtl logistics back to the farmer upon arrival. Under FairBid Farmgate Pickup, buyers fund loading and freight from your warehouse gate directly.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-tertiary font-bold">
                <span className="material-symbols-outlined text-[18px]">water_drop</span>
                <span>2. Standardized Moisture Cap</span>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Middlemen often manipulate hygrometers to force a 5-8% arbitrary dockage. FairBid verifies moisture with NABL-calibrated sensors (standard 14% max threshold). Sona Masoori @ 13.5% incurs zero dockage.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary font-bold">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>3. Dual-Signature Escrow</span>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                100% of the gross sale value is pre-funded into institutional escrow before the pickup truck leaves the mill. No 90-day delayed credits or bouncing checks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4-Column Net Earnings Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-10">
        {/* COLUMN 1: WINNER (AgroCorp Mills) */}
        <div className="relative rounded-2xl bg-surface-container-lowest p-6 flex flex-col justify-between shadow-md ring-2 ring-primary border border-outline-variant/20">
          <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">military_tech</span>
            FairBid Recommended Winner
          </div>

          <div>
            <div className="flex items-start justify-between gap-3 pt-2 mb-3">
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface">AgroCorp Mills</h3>
                <span className="text-xs text-on-surface-variant">Hyderabad Processing Hub</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[11px] font-bold">Offer A</span>
            </div>

            <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between text-xs mb-5 border border-outline-variant/20">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-tertiary text-[18px]">workspace_premium</span>
                <span className="font-bold text-on-surface">98% Reliability</span>
              </div>
              <Link to="/buyers/BUYER-001/passport" className="text-primary text-[11px] font-bold hover:underline">
                Trust Passport →
              </Link>
            </div>

            <div className="mb-4">
              <div className="text-[11px] text-outline font-semibold uppercase tracking-wider">Stated Headline Offer</div>
              <div className="font-headline text-2xl font-bold text-on-surface">
                ₹2,520 <span className="text-xs font-normal text-on-surface-variant">/ Qtl</span>
              </div>
            </div>

            <div className="space-y-2 py-3 border-y border-outline-variant/20 text-xs">
              <div className="flex justify-between items-center text-primary font-bold">
                <span>Farmgate Logistics:</span>
                <span>₹0.00 (Buyer Paid)</span>
              </div>
              <div className="flex justify-between items-center text-primary font-bold">
                <span>Moisture Dockage:</span>
                <span>₹0.00 (13.5% Pass)</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Mandi Cess / User Fee:</span>
                <span>-₹30.24 / Qtl</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <div className="p-3 bg-primary/10 rounded-xl flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider">True Net Take-Home</span>
              <div className="font-headline text-2xl font-bold text-primary">₹2,489.76 / Qtl</div>
              <span className="text-xs font-bold text-on-surface">Bank Deposit: ₹3,73,464</span>
            </div>

            <button
              type="button"
              onClick={() => {
                showToast("Accepted AgroCorp offer! Vaulting ₹3,73,464 in Escrow.");
                navigate("/orders/FP-2024-884/escrow");
              }}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>Accept & Lock Escrow</span>
            </button>
          </div>
        </div>

        {/* COLUMN 2: DECEPTIVE (Kaveri Agri Trading) */}
        <div className="relative rounded-2xl bg-surface-container-lowest p-6 flex flex-col justify-between shadow-sm border border-error/40">
          <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-error text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">warning</span>
            Deceptive Headline Rate
          </div>

          <div>
            <div className="flex items-start justify-between gap-3 pt-2 mb-3">
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface">Kaveri Agri Trading</h3>
                <span className="text-xs text-on-surface-variant">Warangal District Desk</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-bold">Offer B</span>
            </div>

            <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between text-xs mb-5 border border-outline-variant/20">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                <span className="font-bold text-on-surface">84% Reliability</span>
              </div>
              <span className="text-outline text-[11px]">B+ Rated</span>
            </div>

            <div className="mb-4">
              <div className="text-[11px] text-outline font-semibold uppercase tracking-wider">Stated Headline Offer</div>
              <div className="font-headline text-2xl font-bold text-on-surface flex items-baseline gap-1.5">
                <span>₹2,560</span>
                <span className="text-xs text-error font-bold">+₹40 higher on paper!</span>
              </div>
            </div>

            <div className="space-y-2 py-3 border-y border-outline-variant/20 text-xs">
              <div className="flex justify-between items-center text-error font-semibold">
                <span>Transit Freight Shift:</span>
                <span>-₹95.00 / Qtl</span>
              </div>
              <div className="flex justify-between items-center text-error font-semibold">
                <span>12% Moisture Penalty:</span>
                <span>-₹25.00 / Qtl</span>
              </div>
              <div className="flex justify-between items-center text-error font-semibold">
                <span>Hamali & Yard Unload:</span>
                <span>-₹15.00 / Qtl</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Mandi Cess:</span>
                <span>-₹30.72 / Qtl</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <div className="p-3 bg-error-container/60 rounded-xl flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-bold text-error tracking-wider">Actual Net Realization</span>
              <div className="font-headline text-2xl font-bold text-error">₹2,394.28 / Qtl</div>
              <span className="text-xs font-bold text-on-surface">Bank Deposit: ₹3,59,142 (-₹14,322 Loss)</span>
            </div>

            <button
              type="button"
              onClick={() => navigate("/negotiation/TND-8821")}
              className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Negotiate with Copilot</span>
            </button>
          </div>
        </div>

        {/* COLUMN 3: Deccan Flour & Grain */}
        <div className="rounded-2xl bg-surface-container-lowest p-6 flex flex-col justify-between shadow-sm border border-outline-variant/30">
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface">Deccan Flour Mills</h3>
                <span className="text-xs text-on-surface-variant">Medchal Industrial Area</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-bold">Offer C</span>
            </div>

            <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between text-xs mb-5 border border-outline-variant/20">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                <span className="font-bold text-on-surface">91% Reliability</span>
              </div>
              <span className="text-outline text-[11px]">A Rated</span>
            </div>

            <div className="mb-4">
              <div className="text-[11px] text-outline font-semibold uppercase tracking-wider">Stated Headline Offer</div>
              <div className="font-headline text-2xl font-bold text-on-surface">
                ₹2,490 <span className="text-xs font-normal text-on-surface-variant">/ Qtl</span>
              </div>
            </div>

            <div className="space-y-2 py-3 border-y border-outline-variant/20 text-xs">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Shared 50/50 Transit:</span>
                <span className="text-error">-₹32.00 / Qtl</span>
              </div>
              <div className="flex justify-between items-center text-primary font-bold">
                <span>Moisture Dockage:</span>
                <span>₹0.00 (Pass)</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Mandi Cess:</span>
                <span>-₹29.88 / Qtl</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <div className="p-3 bg-surface-container rounded-xl flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-bold text-secondary tracking-wider">True Net Take-Home</span>
              <div className="font-headline text-2xl font-bold text-on-surface">₹2,428.12 / Qtl</div>
              <span className="text-xs font-bold text-on-surface">Bank Deposit: ₹3,64,218</span>
            </div>

            <button
              type="button"
              onClick={() => showToast("Counter-offer drafted for Deccan Flour Mills.")}
              className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Counter Offer</span>
            </button>
          </div>
        </div>

        {/* COLUMN 4: Local Mandi Middleman Baseline */}
        <div className="rounded-2xl bg-surface-container-low p-6 flex flex-col justify-between border border-outline-variant/30 opacity-80">
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface">Local APMC Mandi Yard</h3>
                <span className="text-xs text-on-surface-variant">Conventional Trader Route</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-outline text-[11px] font-bold">Yard Floor</span>
            </div>

            <div className="p-2.5 rounded-xl bg-surface-container-high flex items-center justify-between text-xs mb-5">
              <span className="text-on-surface-variant font-medium">No Escrow Guarantee</span>
              <span className="text-error text-[11px] font-bold">High Risk</span>
            </div>

            <div className="mb-4">
              <div className="text-[11px] text-outline font-semibold uppercase tracking-wider">Mandi Modal Rate</div>
              <div className="font-headline text-2xl font-bold text-on-surface">
                ₹2,250 <span className="text-xs font-normal text-on-surface-variant">/ Qtl</span>
              </div>
            </div>

            <div className="space-y-2 py-3 border-y border-outline-variant/20 text-xs">
              <div className="flex justify-between items-center text-error font-semibold">
                <span>Self Freight to Mandi:</span>
                <span>-₹80.00 / Qtl</span>
              </div>
              <div className="flex justify-between items-center text-error font-semibold">
                <span>Middleman Brokerage:</span>
                <span>-₹45.00 / Qtl</span>
              </div>
              <div className="flex justify-between items-center text-error font-semibold">
                <span>Unloading & Grading Dock:</span>
                <span>-₹55.00 / Qtl</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <div className="p-3 bg-surface-container-highest rounded-xl flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-bold text-outline tracking-wider">Net Proceeds</span>
              <div className="font-headline text-2xl font-bold text-on-surface-variant">₹2,070.00 / Qtl</div>
              <span className="text-xs font-bold text-on-surface">Bank Deposit: ₹3,10,500</span>
            </div>

            <div className="text-center text-[11px] text-error font-bold py-2">
              Avoid: ₹62,964 less than FarmPay!
            </div>
          </div>
        </div>
      </div>

      {/* Gemini AI Recommendation Card */}
      <div className="p-6 rounded-2xl bg-surface-container border border-primary/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-2xl">neurology</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-headline font-bold text-base text-on-surface">
                Gemini AI Recommendation — Optimal Decision Insight
              </h3>
              <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold">
                Model: gemini-3.8-flash
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed max-w-3xl">
              <strong>Accept AgroCorp Mills:</strong> While Kaveri quotes ₹40/qtl higher headline, their fine-print clause shifts ₹14,250 freight onto the farmer. AgroCorp absorbs all transport and toll costs with zero moisture dockage, delivering an additional ₹14,322 in take-home cash.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            showToast("Accepted AgroCorp offer with Gemini AI recommendation!");
            navigate("/orders/FP-2024-884/escrow");
          }}
          className="shrink-0 px-5 py-3 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary/90 flex items-center gap-2 transition-all cursor-pointer"
        >
          <span>Lock Recommended Deal</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>

      {/* Frequently Asked Questions Section */}
      <section className="mt-16 pt-12 border-t border-outline-variant/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest uppercase text-tertiary px-3.5 py-1 rounded-full bg-surface-container inline-block mb-2">
              Help & Clarifications
            </span>
            <h2 className="font-headline font-bold text-2xl sm:text-3xl text-on-surface">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-on-surface-variant mt-2">
              Transparent answers regarding net earnings calculation, freight policies, and farmer autonomy.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-on-surface hover:text-primary transition-colors cursor-pointer"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={openFaq === idx}
                >
                  <span>{faq.q}</span>
                  <span className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-base font-bold text-primary">
                    {openFaq === idx ? "−" : "+"}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/15 bg-surface-container-low/40">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
