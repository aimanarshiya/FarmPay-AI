import { useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function NegotiationCopilot() {
  const { offer_id } = useParams();
  const navigate = useNavigate();

  const lotVolume = 150; // Quintals
  const mandiFeeRate = 0.008; // 0.8%
  const baselinePayout = 359142; // baseline from Kaveri's unbundled offer

  const [unitPrice, setUnitPrice] = useState(2540);
  const [transportMode, setTransportMode] = useState("buyer"); // 'buyer', 'shared', 'farmer'
  const [moistureValue, setMoistureValue] = useState("13.5");
  const [attachAssay, setAttachAssay] = useState(true);
  const [attachRoute, setAttachRoute] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [dispatchMemo, setDispatchMemo] = useState(
    "Respected Procurement Desk, based on our lot's verified 13.5% moisture assay and ready loading at Bodhan cluster, we propose ₹2,540/qtl with buyer-borne transport, adhering to APMC zero-penalty band. Offer valid for 24 hours."
  );

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handlePriceAdjust = (delta) => {
    setUnitPrice((prev) => {
      const next = prev + delta;
      if (next < 1800) return 1800;
      if (next > 3500) return 3500;
      return next;
    });
  };

  const applyStrategy = (stratId) => {
    if (stratId === 1) {
      setUnitPrice(2560);
      setTransportMode("buyer");
      setMoistureValue("13.5");
      setDispatchMemo(
        "Respected Kaveri Procurement Desk: We are prepared to lock Lot #FP-2024-884 at your headline rate of ₹2,560/Qtl, conditional upon farmgate loading with buyer-arranged free freight, matching prevailing corporate benchmarks. Verified 13.5% assay ready."
      );
      showToast("Strategy 1 (Demand Farmgate Free Transport) applied.");
    } else if (stratId === 2) {
      setUnitPrice(2580);
      setTransportMode("shared");
      setMoistureValue("13.5");
      setDispatchMemo(
        "Respected Procurement Team: In view of immediate 4,500 Qtl regional deficit and superior lot drying (13.5% moisture certificate attached), we propose revised firm rate of ₹2,580/Qtl under 50/50 shared cluster logistics. Offer valid 24 hours."
      );
      showToast("Strategy 2 (Propose Rate Revision to ₹2,580) applied.");
    }
  };

  const regenerateMemo = () => {
    const transportTxt =
      transportMode === "buyer"
        ? "buyer-borne transport"
        : transportMode === "shared"
          ? "50/50 shared freight"
          : "farmer-arranged dispatch";
    setDispatchMemo(
      `Respected Procurement Desk, based on our lot's verified 13.5% moisture assay and ready loading at Bodhan cluster, we propose ₹${unitPrice}/qtl with ${transportTxt}, adhering to APMC zero-penalty band. Offer valid for 24 hours.`
    );
    showToast("Dispatch memo regenerated with current studio parameters.");
  };

  // Financial calculations
  const transportDeduction = useMemo(() => {
    if (transportMode === "farmer") return 95;
    if (transportMode === "shared") return 47.5;
    return 0;
  }, [transportMode]);

  const moisturePenalty = useMemo(() => {
    return moistureValue === "14.0" ? 15 : 0;
  }, [moistureValue]);

  const mandiFee = useMemo(() => {
    return unitPrice * mandiFeeRate;
  }, [unitPrice]);

  const realizedPerQtl = useMemo(() => {
    return unitPrice - transportDeduction - moisturePenalty - mandiFee;
  }, [unitPrice, transportDeduction, moisturePenalty, mandiFee]);

  const totalBankPayout = useMemo(() => {
    return Math.round(realizedPerQtl * lotVolume);
  }, [realizedPerQtl, lotVolume]);

  const gainDelta = totalBankPayout - baselinePayout;

  return (
    <div className="w-full min-h-screen bg-surface font-body text-on-surface py-6 px-4 sm:px-8 max-w-7xl mx-auto relative">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs sm:text-sm font-medium animate-bounce">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Live Mandi Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-secondary uppercase">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to="/listings" className="hover:text-primary transition-colors">Farmer Innovations</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold">AI Negotiation Copilot (Screen 03)</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-mono font-bold">
            {offer_id ? `Offer #${offer_id}` : "Lot #FP-2024-884"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-xs font-medium text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            Live Mandi Telemetry Active
          </span>
          <div className="text-xs font-mono font-semibold text-tertiary bg-tertiary-fixed/40 px-3 py-1 rounded-full">
            Yield: 150 Qtl • Sona Masoori
          </div>
        </div>
      </div>

      {/* Page Title & Strategic Premise */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-6">
        <div className="lg:col-span-8 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-primary text-on-primary shadow-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">neurology</span>
            </span>
            <h1 className="font-headline text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-on-surface">
              AI Negotiation Copilot <span className="font-normal italic text-secondary">— FairBid Studio</span>
            </h1>
          </div>
          <p className="text-sm md:text-base text-on-surface-variant max-w-3xl leading-relaxed mt-1">
            Intelligent negotiation advisor analyzing competing buyer offers, unbundled transport deductions, and regional supply shortfalls to help you compose compelling, evidence-backed counteroffers.
          </p>
        </div>

        <div className="lg:col-span-4 flex justify-start lg:justify-end">
          <div className="bg-surface-container-low p-4 rounded-xl shadow-sm border border-outline-variant/30 flex items-center gap-4 w-full lg:w-auto">
            <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">balance</span>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-outline">Detected Leverage Spread</div>
              <div className="text-xl font-headline font-bold text-primary">
                +₹95.48 <span className="text-xs font-body font-normal text-secondary">/ Qtl latent room</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="w-full bg-surface-container-highest/80 rounded-xl p-4 shadow-sm border border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-tertiary-container/30 text-on-tertiary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">gavel</span>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-tertiary">Advisory Mode Only</span>
            <p className="text-xs sm:text-sm text-on-surface leading-snug">
              FarmPay AI never automatically accepts or rejects offers on your behalf. All counteroffers require your explicit review and confirmation.
            </p>
          </div>
        </div>
        <div className="shrink-0 self-end sm:self-center">
          <span className="text-[11px] font-mono px-3 py-1 rounded-md bg-surface-container text-on-surface-variant font-medium">
            SafeEscrow v3.2 Protocol
          </span>
        </div>
      </div>

      {/* Primary Asymmetric Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start mb-12">
        {/* LEFT COLUMN (7 Cols): Active Offer Audit & Conversational Strategy */}
        <div className="xl:col-span-7 flex flex-col gap-8">
          {/* Section 1: Active Offer Under Review */}
          <div className="bg-surface-container-lowest rounded-xl shadow-md p-6 sm:p-7 flex flex-col gap-6 border border-outline-variant/30">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-outline">Offer Under Scrutiny</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-error-container text-on-error-container text-xs font-bold tracking-tight">
                Clause Warning: Transit Shifted
              </span>
            </div>

            {/* Buyer Spotlight */}
            <div className="bg-surface-container-low rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-outline-variant/20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-secondary-container flex items-center justify-center font-headline font-bold text-xl text-on-secondary-container shrink-0">
                  KA
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline font-bold text-lg text-on-surface">Kaveri Agri Trading</h3>
                    <span className="text-xs text-secondary font-medium">(Warangal Desk)</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-1">
                    <span>Lot Volume: <strong>150 Qtl</strong></span>
                    <span>•</span>
                    <span>Payment: <strong>SafeEscrow 24H</strong></span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:items-end w-full sm:w-auto pt-3 sm:pt-0">
                <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">Headline Quoted Bid</span>
                <div className="text-2xl sm:text-3xl font-headline font-bold text-on-surface">
                  ₹2,560 <span className="text-sm font-body font-normal text-secondary">/ Qtl</span>
                </div>
                <span className="text-xs font-mono text-secondary">Gross: ₹3,84,000</span>
              </div>
            </div>

            {/* Forensic Net Breakdown */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase text-outline tracking-wider">
                <span>Hidden Deduction Audit (Fine Print Clause 4.2 & 7.1)</span>
                <span className="text-error font-bold">Total Drag: -₹165.72 / Qtl</span>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="p-3 rounded-lg bg-surface-container flex items-center justify-between">
                  <span className="font-medium text-on-surface">Headline Bid Valuation</span>
                  <span className="font-mono font-bold text-on-surface">₹3,84,000.00</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container/60 flex items-center justify-between text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-error">local_shipping</span>
                    <span>Transit Freight (Buyer shifted to farmer, Warangal hub)</span>
                  </div>
                  <span className="font-mono font-semibold text-error">-₹14,250.00 (-₹95.00/Qtl)</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container/60 flex items-center justify-between text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-error">water_drop</span>
                    <span>Strict 12% Moisture Penalty clause (Assay reads 13.5%)</span>
                  </div>
                  <span className="font-mono font-semibold text-error">-₹3,750.00 (-₹25.00/Qtl)</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container/60 flex items-center justify-between text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-error">forklift</span>
                    <span>Hamali & Yard Unloading cess</span>
                  </div>
                  <span className="font-mono font-semibold text-error">-₹2,250.00 (-₹15.00/Qtl)</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container/60 flex items-center justify-between text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-outline">calculate</span>
                    <span>Standard Mandi User Charge (0.8%)</span>
                  </div>
                  <span className="font-mono font-semibold text-secondary">-₹4,608.00 (-₹30.72/Qtl)</span>
                </div>
              </div>

              {/* Net realization */}
              <div className="p-4 rounded-xl bg-surface-container-high flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold text-outline uppercase tracking-wider">Actual Net Bank Realization</div>
                  <div className="text-xl sm:text-2xl font-headline font-bold text-on-surface">
                    ₹2,394.28 <span className="text-xs font-body font-normal text-secondary">/ Qtl (Total: ₹3,59,142)</span>
                  </div>
                </div>
                <div className="text-xs text-error font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">warning</span>
                  Effective Loss vs Headline: ₹24,858
                </div>
              </div>
            </div>

            {/* Benchmark Comparison against AgroCorp */}
            <div className="p-4 rounded-xl bg-secondary-fixed/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-outline-variant/30">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-surface-container-lowest text-primary mt-0.5 shadow-xs">
                  <span className="material-symbols-outlined text-xl">compare_arrows</span>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-on-secondary-fixed">Live Benchmark Comparison</div>
                  <div className="text-sm font-semibold text-on-secondary-fixed-variant mt-0.5">
                    AgroCorp's Bid: ₹2,520 / Qtl with Free Farmgate Logistics
                  </div>
                  <p className="text-xs text-secondary mt-1">
                    AgroCorp provides ₹14,322 <span className="font-bold text-primary">MORE</span> net bank deposit despite showing a ₹40 lower headline rate.
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-mono font-bold text-primary">AgroCorp Net: ₹2,489.76 / Qtl</div>
                <span className="text-[11px] text-outline">Zero hidden transport cut</span>
              </div>
            </div>
          </div>

          {/* Section 2: Conversational Copilot Dialogue */}
          <div className="bg-surface-container-lowest rounded-xl shadow-md p-6 sm:p-7 flex flex-col gap-6 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-lg">forum</span>
                </div>
                <div>
                  <h2 className="font-headline font-bold text-lg text-on-surface">Strategic Copilot Dialogue</h2>
                  <p className="text-xs text-secondary">Real-time dialectical negotiation modeling</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-primary bg-primary-fixed px-3 py-1 rounded-full">
                Reasoning Engine v4.8
              </span>
            </div>

            {/* Chat Stream */}
            <div className="flex flex-col gap-5 pt-2">
              <div className="flex items-start gap-3.5 max-w-xl self-end flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 font-bold text-xs ring-2 ring-surface-container-highest">
                  RP
                </div>
                <div className="bg-surface-container-high rounded-2xl rounded-tr-sm p-4 text-xs sm:text-sm text-on-surface shadow-sm">
                  <div className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Farmer Rajesh Patel</div>
                  Kaveri offered ₹2,560, which looks higher than AgroCorp's ₹2,520. Should I accept this Warangal offer today?
                </div>
              </div>

              <div className="flex items-start gap-3.5 max-w-2xl self-start">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">
                  AI
                </div>
                <div className="bg-surface-container-low rounded-2xl rounded-tl-sm p-5 text-xs sm:text-sm text-on-surface shadow-sm flex flex-col gap-3 border border-outline-variant/30">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">FarmPay Strategic Advisor</span>
                    <span className="text-[10px] font-mono text-outline">Confidence 96.4%</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-error-container text-on-error-container text-xs font-bold w-fit">
                    <span className="material-symbols-outlined text-sm">block</span> Do Not Accept Yet
                  </div>
                  <p className="leading-relaxed text-on-surface-variant">
                    While Kaveri quotes <strong className="text-on-surface">₹40 higher on paper</strong>, fine-print clause 4.2 shifts transit cost (<strong className="text-error">₹95/Qtl</strong>) onto you, resulting in an immediate net loss. Furthermore, our <strong className="text-on-surface">Demand Radar</strong> shows Miryalaguda and Nizamabad rice mills face an immediate <strong className="text-tertiary">4,500 Qtl deficit</strong> over the next 72 hours.
                  </p>

                  <div className="pt-2 flex flex-col gap-2.5">
                    <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Recommended Playbook Options:</span>

                    {/* Strategy 1 */}
                    <div
                      onClick={() => applyStrategy(1)}
                      className="p-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-all flex items-start justify-between gap-3 cursor-pointer group border border-outline-variant/20"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-on-surface group-hover:text-primary transition-colors">
                            Demand Farmgate Free Transport
                          </div>
                          <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                            Compel Kaveri to match AgroCorp's free freight policy. Preserves their ₹2,560 bid and returns ₹14,250 to your pocket.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="shrink-0 px-2.5 py-1 rounded-md bg-surface-container-high group-hover:bg-primary group-hover:text-on-primary text-[11px] font-bold text-on-surface transition-all"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Strategy 2 */}
                    <div
                      onClick={() => applyStrategy(2)}
                      className="p-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-all flex items-start justify-between gap-3 cursor-pointer group border border-outline-variant/20"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-tertiary-container/30 text-tertiary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-on-surface group-hover:text-tertiary transition-colors">
                            Propose Rate Revision to ₹2,580 + APMC Tolerance
                          </div>
                          <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                            Standardize moisture allowance to 13.5% zero penalty while leveraging local supply deficits.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="shrink-0 px-2.5 py-1 rounded-md bg-surface-container-high group-hover:bg-tertiary group-hover:text-on-tertiary text-[11px] font-bold text-on-surface transition-all"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 Cols): Counteroffer Studio & Decision Impact */}
        <div className="xl:col-span-5 flex flex-col gap-8">
          {/* Section 3: Counteroffer Studio */}
          <div className="bg-surface-container-lowest rounded-xl shadow-md p-6 sm:p-7 flex flex-col gap-6 border border-outline-variant/30">
            <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">tune</span>
                <h2 className="font-headline font-bold text-lg text-on-surface">Counteroffer Studio</h2>
              </div>
              <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-outline">Target: Kaveri Desk</span>
            </div>

            <div className="flex flex-col gap-5">
              {/* Recipient */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider">Recipient Entity</label>
                <div className="p-3 rounded-xl bg-surface-container-low text-xs sm:text-sm font-semibold text-on-surface flex items-center justify-between border border-outline-variant/20">
                  <span>Kaveri Agri Trading Pvt. Ltd. (APMC Warangal)</span>
                  <span className="material-symbols-outlined text-base text-primary">verified</span>
                </div>
              </div>

              {/* Unit Price Adjustment */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider">Proposed Unit Price (₹ / Qtl)</label>
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full transition-all ${gainDelta >= 0
                      ? "text-primary bg-primary-fixed"
                      : "text-error bg-error-container"
                      }`}
                  >
                    {gainDelta >= 0 ? `+₹${gainDelta.toLocaleString("en-IN")}` : `-₹${Math.abs(gainDelta).toLocaleString("en-IN")}`} vs current offer
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handlePriceAdjust(-10)}
                    className="w-11 h-11 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center font-bold text-lg text-on-surface transition-all"
                  >
                    -
                  </button>
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-headline font-bold text-base text-secondary">₹</span>
                    <input
                      type="number"
                      step="5"
                      min="1800"
                      max="3500"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(parseInt(e.target.value) || 2000)}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-headline font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all border border-outline-variant/30"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePriceAdjust(10)}
                    className="w-11 h-11 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center font-bold text-lg text-on-surface transition-all"
                  >
                    +
                  </button>
                </div>
                <div className="text-[11px] text-secondary flex items-center justify-between px-1">
                  <span>Initial Quoted Bid: ₹2,560</span>
                  <span>Regional Modal Average: ₹2,475</span>
                </div>
              </div>

              {/* Transport Terms */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider">Transport Terms Stipulation</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransportMode("buyer")}
                    className={`p-2.5 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all ${transportMode === "buyer"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                      }`}
                  >
                    <span className="material-symbols-outlined text-base">local_shipping</span>
                    <span>Buyer Paid</span>
                    <span className="text-[9px] font-normal opacity-90">Recommended</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTransportMode("shared")}
                    className={`p-2.5 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all ${transportMode === "shared"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                      }`}
                  >
                    <span className="material-symbols-outlined text-base">share</span>
                    <span>Shared 50/50</span>
                    <span className="text-[9px] text-secondary">FPO Pool</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTransportMode("farmer")}
                    className={`p-2.5 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all ${transportMode === "farmer"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                      }`}
                  >
                    <span className="material-symbols-outlined text-base">agriculture</span>
                    <span>Farmer Paid</span>
                    <span className="text-[9px] text-secondary">Self Arranged</span>
                  </button>
                </div>
              </div>

              {/* Moisture Clause */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider">Moisture Tolerance Clause</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="p-3 rounded-xl bg-surface-container-low cursor-pointer flex items-center gap-2.5 hover:bg-surface-container transition-all border border-outline-variant/20">
                    <input
                      type="radio"
                      name="moisture"
                      value="13.5"
                      checked={moistureValue === "13.5"}
                      onChange={() => setMoistureValue("13.5")}
                      className="accent-primary w-4 h-4"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-on-surface">Standard Mandi (13.5%)</span>
                      <span className="text-[10px] text-primary font-medium">Zero penalty tier</span>
                    </div>
                  </label>

                  <label className="p-3 rounded-xl bg-surface-container-low cursor-pointer flex items-center gap-2.5 hover:bg-surface-container transition-all border border-outline-variant/20">
                    <input
                      type="radio"
                      name="moisture"
                      value="14.0"
                      checked={moistureValue === "14.0"}
                      onChange={() => setMoistureValue("14.0")}
                      className="accent-primary w-4 h-4"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-on-surface">Custom Band (14.0%)</span>
                      <span className="text-[10px] text-secondary">Flexible deduction</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Evidence Checklist */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider">Evidence Attachments</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer border border-outline-variant/20">
                    <input
                      type="checkbox"
                      checked={attachAssay}
                      onChange={(e) => setAttachAssay(e.target.checked)}
                      className="accent-primary w-4 h-4 rounded"
                    />
                    <div className="flex items-center justify-between w-full text-xs">
                      <span className="font-medium text-on-surface">Include Mandi Node #04 Moisture Assay Certificate</span>
                      <span className="text-[10px] font-mono text-tertiary font-bold">PDF • Verified</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer border border-outline-variant/20">
                    <input
                      type="checkbox"
                      checked={attachRoute}
                      onChange={(e) => setAttachRoute(e.target.checked)}
                      className="accent-primary w-4 h-4 rounded"
                    />
                    <div className="flex items-center justify-between w-full text-xs">
                      <span className="font-medium text-on-surface">Attach Bodhan Cluster Aggregation Route Sheet</span>
                      <span className="text-[10px] font-mono text-tertiary font-bold">Logistics Hub</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Dispatch Memo */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider">Counter-Bid Dispatch Memo</label>
                  <button
                    type="button"
                    onClick={regenerateMemo}
                    className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">autorenew</span> Re-generate
                  </button>
                </div>
                <textarea
                  rows="4"
                  value={dispatchMemo}
                  onChange={(e) => setDispatchMemo(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed font-body border border-outline-variant/30"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => showToast("Draft saved locally in FairBid registry.")}
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">bookmark_border</span>
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast("Counteroffer formally signed & transmitted via SafeEscrow gateway. Redirecting to FairBid...");
                    setTimeout(() => navigate("/fairbid"), 1800);
                  }}
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-primary hover:opacity-95 text-on-primary font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  Review & Transmit
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Decision Impact Preview */}
          <div className="bg-surface-container rounded-xl shadow-sm p-6 flex flex-col gap-4 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">insights</span>
                <h3 className="font-headline font-bold text-base text-on-surface">Decision Impact Analysis</h3>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-secondary">Realized Delta</span>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-4 overflow-hidden border border-outline-variant/20">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-secondary border-b border-outline-variant/20">
                    <th className="pb-3 font-semibold uppercase text-[10px] tracking-wider">Metrics</th>
                    <th className="pb-3 font-semibold uppercase text-[10px] tracking-wider text-right">Original Offer</th>
                    <th className="pb-3 font-semibold uppercase text-[10px] tracking-wider text-right text-primary">After Counter</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="font-medium text-on-surface">
                    <td className="py-2 text-on-surface-variant">Stated Unit Rate</td>
                    <td className="py-2 text-right font-mono">₹2,560 / Qtl</td>
                    <td className="py-2 text-right font-mono font-bold text-on-surface">₹{unitPrice} / Qtl</td>
                  </tr>
                  <tr className="font-medium">
                    <td className="py-2 text-on-surface-variant">Transport Cost Burden</td>
                    <td className="py-2 text-right font-mono text-error">-₹95.00 / Qtl</td>
                    <td className="py-2 text-right font-mono font-bold text-primary">
                      {transportDeduction === 0 ? "₹0.00 / Qtl" : `-₹${transportDeduction.toFixed(2)} / Qtl`}
                    </td>
                  </tr>
                  <tr className="font-medium">
                    <td className="py-2 text-on-surface-variant">Moisture Penalty</td>
                    <td className="py-2 text-right font-mono text-error">-₹25.00 / Qtl</td>
                    <td className="py-2 text-right font-mono font-bold text-primary">
                      {moisturePenalty === 0 ? "₹0.00 / Qtl" : `-₹${moisturePenalty.toFixed(2)} / Qtl`}
                    </td>
                  </tr>
                  <tr className="font-headline font-bold text-sm bg-surface-container-low">
                    <td className="p-2.5 rounded-l-lg text-on-surface">Projected Net Payout</td>
                    <td className="p-2.5 text-right font-mono text-secondary">₹3,59,142</td>
                    <td className="p-2.5 rounded-r-lg text-right font-mono text-primary text-base">
                      ₹{totalBankPayout.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-highest/60 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-tertiary text-lg shrink-0">tips_and_updates</span>
              <span>By shifting transport onto the buyer, you make ₹18,500 more even with a ₹20 lower headline ask.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
