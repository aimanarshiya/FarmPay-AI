import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LogisticsIntelligence() {
  const navigate = useNavigate();
  const [selectedBuyer, setSelectedBuyer] = useState("A");
  const [bookedSlot, setBookedSlot] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="w-full min-h-screen bg-surface font-body text-on-surface py-6 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Toast notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs sm:text-sm font-medium animate-bounce">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-6">
        <div className="flex flex-col gap-2 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-tertiary">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Farmer Operations</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-extrabold">Logistics Intelligence (Screen 14)</span>
          </div>
          <h1 className="font-headline text-3xl md:text-4xl text-on-surface font-semibold tracking-tight leading-tight">
            Logistics Intelligence & Multi-Buyer Freight Optimizer
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
            Compare real transport costs, weighbridge waypoints, and shared freight pooling across competing buyer locations to calculate your true net take-home realization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high text-xs font-medium text-on-surface border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-[18px]">inventory_2</span>
            <span>Lot <strong className="font-bold">#FP-2024-884</strong> (150 Qtl Sona Masoori)</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Freight Estimates Certified by Vahan Fleet API</span>
          </div>
        </div>
      </div>

      {/* Comparative Matrix Banner Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-secondary font-bold">Optimal Take-Home</span>
            <span className="text-2xl font-headline font-bold text-on-surface mt-1">₹3,73,464</span>
            <span className="text-[11px] text-primary font-bold mt-0.5">AgroCorp Mills (Buyer-Borne)</span>
          </div>
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-secondary font-bold">Apparent Top Bid</span>
            <span className="text-2xl font-headline font-bold text-on-surface mt-1">
              ₹2,560 <span className="text-xs font-normal text-secondary">/ Qtl</span>
            </span>
            <span className="text-[11px] text-error font-bold mt-0.5">Kaveri Agri (-₹2,022 vs Realized)</span>
          </div>
          <div className="w-11 h-11 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-2xl">trending_up</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-secondary font-bold">Transit Fuel Benchmark</span>
            <span className="text-2xl font-headline font-bold text-on-surface mt-1">
              ₹94.20 <span className="text-xs font-normal text-secondary">/ L</span>
            </span>
            <span className="text-[11px] text-tertiary font-bold mt-0.5">Nizamabad NH-65 Diesel Index</span>
          </div>
          <div className="w-11 h-11 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined text-2xl">local_gas_station</span>
          </div>
        </div>
      </div>

      {/* Section 1: Multi-Buyer 3-Way Comparative Payout Matrix */}
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">compare_arrows</span>
            <h2 className="font-headline text-xl text-on-surface font-semibold tracking-tight">3-Way Comparative Payout Matrix</h2>
          </div>
          <span className="text-xs text-secondary hidden sm:inline">Calculation Basis: 150 Quintals Sona Masoori Grade-A</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* BUYER A: AgroCorp Mills (Optimal) */}
          <div className={`relative bg-surface-container-lowest rounded-xl shadow-md p-6 flex flex-col justify-between overflow-hidden border ${selectedBuyer === "A" ? "border-primary ring-2 ring-primary/20" : "border-outline-variant/30"}`}>
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-primary"></div>
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-primary uppercase tracking-widest">Buyer A • 186 km</span>
                  <h3 className="font-headline text-xl font-bold text-on-surface">AgroCorp Mills</h3>
                  <p className="text-xs text-secondary">Miryalaguda Milling Hub</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold tracking-tight">
                  Recommended
                </span>
              </div>

              <div className="bg-surface-container-low p-3.5 rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                <span className="text-[11px] text-secondary">Gross Quoted Bid</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-headline font-bold text-on-surface">₹2,520</span>
                  <span className="text-xs text-secondary font-medium">/ Qtl</span>
                </div>
                <span className="text-xs text-on-surface-variant font-medium">Nominal Contract: ₹3,78,000</span>
              </div>

              <div className="flex flex-col gap-2.5 py-2 text-xs">
                <div className="flex items-center justify-between text-on-surface">
                  <span className="text-secondary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-primary">local_shipping</span>
                    Freight Arrangement
                  </span>
                  <span className="font-bold text-primary text-right">100% Buyer-Borne Fleet</span>
                </div>
                <div className="flex items-center justify-between text-on-surface">
                  <span className="text-secondary">Toll & Handling</span>
                  <span className="font-bold text-primary">₹0.00 (Buyer absorbed)</span>
                </div>
                <div className="flex items-center justify-between text-on-surface">
                  <span className="text-secondary">Weighbridge Node</span>
                  <span className="font-medium text-right">Node #04 (±0.2% calib.)</span>
                </div>
                <div className="flex items-center justify-between text-on-surface">
                  <span className="text-secondary">Mandi Cess / Statutory</span>
                  <span className="font-medium">-₹30.24 / Qtl</span>
                </div>
              </div>

              <div className="bg-secondary-container/40 p-3 rounded-lg flex items-center gap-2 border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                <span className="text-[11px] text-on-secondary-container font-semibold leading-snug">
                  Optimal Net Yield • Highest Security Escrow
                </span>
              </div>
            </div>

            <div className="pt-5 mt-4 flex flex-col gap-3 bg-surface-container-high/40 -mx-6 -mb-6 p-6 border-t border-outline-variant/20">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block">True Net Realization</span>
                  <span className="text-xl font-headline font-bold text-primary">
                    ₹2,489.76 <span className="text-xs text-secondary font-normal">/ Qtl</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block">Bank Disbursal</span>
                  <span className="text-lg font-headline font-bold text-on-surface">₹3,73,464</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedBuyer("A");
                  showToast("Locked AgroCorp Buyer-Borne Transit. Ready for Escrow dispatch.");
                  navigate("/orders/FP-2024-884/escrow");
                }}
                className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Accept & Lock Buyer Transit</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* BUYER B: Hyderabad Food Park (Warning) */}
          <div className={`relative bg-surface-container-lowest rounded-xl shadow-md p-6 flex flex-col justify-between overflow-hidden border ${selectedBuyer === "B" ? "border-error ring-2 ring-error/20" : "border-outline-variant/30"}`}>
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-secondary uppercase tracking-widest">Buyer B • 142 km</span>
                  <h3 className="font-headline text-xl font-bold text-on-surface">Hyderabad Food Park</h3>
                  <p className="text-xs text-secondary">Medchal Terminal</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-error-container text-error text-[10px] font-bold tracking-tight">
                  Net Leakage
                </span>
              </div>

              <div className="bg-surface-container-low p-3.5 rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                <span className="text-[11px] text-secondary">Gross Quoted Bid</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-headline font-bold text-on-surface">₹2,550</span>
                  <span className="text-xs text-secondary font-medium">/ Qtl</span>
                </div>
                <span className="text-xs text-on-surface-variant font-medium">Nominal Contract: ₹3,82,500</span>
              </div>

              <div className="flex flex-col gap-2.5 py-2 text-xs">
                <div className="flex items-center justify-between text-on-surface">
                  <span className="text-secondary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-secondary">local_shipping</span>
                    Freight Arrangement
                  </span>
                  <span className="font-bold text-on-surface text-right">Farmer Arranged (16T)</span>
                </div>
                <div className="flex items-center justify-between text-on-surface">
                  <span className="text-secondary">Estimated Freight</span>
                  <span className="font-bold text-error">-₹62.00 / Qtl (-₹9,300)</span>
                </div>
                <div className="flex items-center justify-between text-on-surface">
                  <span className="text-secondary">Toll & Loading Gate</span>
                  <span className="font-bold text-error">-₹18.00 / Qtl (-₹2,700)</span>
                </div>
                <div className="flex items-center justify-between text-on-surface">
                  <span className="text-secondary">Statutory Deductions</span>
                  <span className="font-medium">-₹31.60 / Qtl</span>
                </div>
              </div>

              <div className="bg-error-container/40 p-3 rounded-lg flex items-center gap-2 border border-outline-variant/20">
                <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                <span className="text-[11px] text-on-surface font-semibold leading-snug">
                  ₹7,704 lower net return despite higher nominal bid!
                </span>
              </div>
            </div>

            <div className="pt-5 mt-4 flex flex-col gap-3 bg-surface-container-high/20 -mx-6 -mb-6 p-6 border-t border-outline-variant/20">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block">True Net Realization</span>
                  <span className="text-xl font-headline font-bold text-error">
                    ₹2,438.40 <span className="text-xs text-secondary font-normal">/ Qtl</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block">Bank Disbursal</span>
                  <span className="text-lg font-headline font-bold text-on-surface">₹3,65,760</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedBuyer("B");
                  showToast("Identified route penalties for Medchal Terminal.");
                }}
                className="w-full py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>View Route Penalties</span>
                <span className="material-symbols-outlined text-[16px]">info</span>
              </button>
            </div>
          </div>

          {/* BUYER C: Kaveri Agri Trading (Shared) */}
          <div className={`relative bg-surface-container-lowest rounded-xl shadow-md p-6 flex flex-col justify-between overflow-hidden border ${selectedBuyer === "C" ? "border-tertiary ring-2 ring-tertiary/20" : "border-outline-variant/30"}`}>
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-secondary uppercase tracking-widest">Buyer C • 210 km</span>
                  <h3 className="font-headline text-xl font-bold text-on-surface">Kaveri Agri Trading</h3>
                  <p className="text-xs text-secondary">Warangal Agri Corridor</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[11px] font-bold tracking-tight">
                  Shared Pool
                </span>
              </div>

              <div className="bg-surface-container-low p-3.5 rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                <span className="text-[11px] text-secondary">Gross Quoted Bid</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-headline font-bold text-on-surface">₹2,560</span>
                  <span className="text-xs text-secondary font-medium">/ Qtl</span>
                </div>
                <span className="text-xs text-on-surface-variant font-medium">Nominal Contract: ₹3,84,000</span>
              </div>

              <div className="flex flex-col gap-2.5 py-2 text-xs">
                <div className="flex items-center justify-between text-on-surface">
                  <span className="text-secondary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-tertiary">hub</span>
                    Freight Arrangement
                  </span>
                  <span className="font-bold text-on-surface text-right">Armoor FPO Pool Share</span>
                </div>
                <div className="flex items-center justify-between text-on-surface">
                  <span className="text-secondary">Shared Freight Cost</span>
                  <span className="font-medium text-error">-₹38.00 / Qtl (-₹5,700)</span>
                </div>
                <div className="flex items-center justify-between text-on-surface">
                  <span className="text-secondary">Unloading / Hamali</span>
                  <span className="font-medium text-error">-₹15.00 / Qtl (-₹2,250)</span>
                </div>
                <div className="flex items-center justify-between text-on-surface">
                  <span className="text-secondary">Statutory Deductions</span>
                  <span className="font-medium">-₹30.72 / Qtl</span>
                </div>
              </div>

              <div className="bg-secondary-container/40 p-3 rounded-lg flex items-center gap-2 border border-outline-variant/20">
                <span className="material-symbols-outlined text-secondary text-[18px]">group_work</span>
                <span className="text-[11px] text-on-surface font-semibold leading-snug">
                  Co-loaded with 90 Qtl Maize from Armoor FPO
                </span>
              </div>
            </div>

            <div className="pt-5 mt-4 flex flex-col gap-3 bg-surface-container-high/20 -mx-6 -mb-6 p-6 border-t border-outline-variant/20">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block">True Net Realization</span>
                  <span className="text-xl font-headline font-bold text-on-surface">
                    ₹2,476.28 <span className="text-xs text-secondary font-normal">/ Qtl</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block">Bank Disbursal</span>
                  <span className="text-lg font-headline font-bold text-on-surface">₹3,71,442</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedBuyer("C");
                  navigate("/fpo/collective-selling");
                }}
                className="w-full py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Inspect FPO Pool Hub</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 & 3: Corridor Telemetry & Shared Backhaul */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
        {/* Left Column: Corridor Telemetry (7 Cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-6 rounded-xl shadow-md border border-outline-variant/30 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">route</span>
                <h2 className="font-headline text-lg font-bold text-on-surface">Corridor Telemetry & Waypoint Inspection</h2>
              </div>
              <span className="text-xs text-secondary">Optimal Route: Bodhan Cluster → Choutuppal Toll → Miryalaguda</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-xs font-semibold text-on-surface border border-outline-variant/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>186 km • NH 65 • 3h 45m Transit</span>
            </div>
          </div>

          {/* Waypoint Corridor Graphic */}
          <div className="relative bg-surface-container-low p-6 rounded-xl overflow-hidden border border-outline-variant/20">
            <div className="relative z-10 flex flex-col gap-6">
              {/* Node 1 */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shadow-sm">
                    1
                  </div>
                  <div className="w-0.5 h-12 bg-primary/40 my-1"></div>
                </div>
                <div className="flex-1 bg-surface-container-lowest p-3 rounded-lg shadow-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface">Bodhan Aggregation Yard (Source)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-bold">KM 0</span>
                  </div>
                  <p className="text-[11px] text-secondary mt-1">Farm gate loading • Moisture audit certified at 13.1%</p>
                </div>
              </div>

              {/* Node 2 */}
              <div className="flex items-start gap-4 -mt-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center text-xs font-bold shadow-sm">
                    2
                  </div>
                  <div className="w-0.5 h-12 bg-outline-variant my-1"></div>
                </div>
                <div className="flex-1 bg-surface-container-lowest p-3 rounded-lg shadow-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface">Designated Mandi Weighbridge Node #04</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-bold">KM 42</span>
                  </div>
                  <p className="text-[11px] text-secondary mt-1">Automated electronic tare scale • Tolerance locked within ±0.2%</p>
                </div>
              </div>

              {/* Node 3 */}
              <div className="flex items-start gap-4 -mt-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold shadow-sm">
                    3
                  </div>
                  <div className="w-0.5 h-12 bg-outline-variant my-1"></div>
                </div>
                <div className="flex-1 bg-surface-container-lowest p-3 rounded-lg shadow-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface">Choutuppal Plaza FASTag Auto-Log</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-bold">KM 118</span>
                  </div>
                  <p className="text-[11px] text-secondary mt-1">Dual RFID scan checkpoint • ₹480 Toll (Buyer absorb active)</p>
                </div>
              </div>

              {/* Node 4 */}
              <div className="flex items-start gap-4 -mt-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shadow-sm">
                    4
                  </div>
                </div>
                <div className="flex-1 bg-surface-container-lowest p-3 rounded-lg shadow-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface">AgroCorp Miryalaguda Gate #2</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-bold">KM 186</span>
                  </div>
                  <p className="text-[11px] text-secondary mt-1">Final physical Mandi QC unseal & SafeEscrow disbursement trigger</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick telemetry link */}
          <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
            <span className="text-on-surface-variant font-medium">Have an active truck in transit?</span>
            <Link
              to="/logistics/telemetry/FP-2024-884"
              className="text-primary font-bold flex items-center gap-1 hover:underline"
            >
              Open Live GPS Telemetry Sheet (Screen 05) <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Shared Transport Capacity & Distribution (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-md border border-outline-variant/30 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-xl">rv_hookup</span>
                  <h3 className="font-headline text-lg font-bold text-on-surface">Shared Transport Capacity</h3>
                </div>
                <span className="text-xs text-secondary">Verified backhaul routes matching your cluster</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[10px] uppercase">
                50% Discount
              </span>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-3 border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
                  <span className="text-sm font-bold text-on-surface">Truck TS-08-KL-9921</span>
                </div>
                <span className="text-xs font-bold text-primary">Returning Empty</span>
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                Consolidation link returning empty from <strong className="text-on-surface">Nizamabad</strong> to <strong className="text-on-surface">Hyderabad</strong>. Ready to haul 80–120 Qtl.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-surface-container-lowest p-2.5 rounded-lg flex flex-col border border-outline-variant/20">
                  <span className="text-[10px] uppercase text-secondary font-bold">Pooled Rate</span>
                  <span className="text-base font-headline font-bold text-primary">
                    ₹32 <span className="text-xs font-normal text-secondary">/ Qtl</span>
                  </span>
                  <span className="text-[10px] text-tertiary font-bold">vs ₹64/Qtl standard</span>
                </div>
                <div className="bg-surface-container-lowest p-2.5 rounded-lg flex flex-col border border-outline-variant/20">
                  <span className="text-[10px] uppercase text-secondary font-bold">Available Bay</span>
                  <span className="text-base font-headline font-bold text-on-surface">95 Qtl</span>
                  <span className="text-[10px] text-secondary">Ashok Leyland 16T</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1">
                <span>Driver: Rameshwar G. (Rating: 4.8★)</span>
                <span className="text-tertiary font-semibold">Departs 05:30 PM</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setBookedSlot(true);
                  showToast("Booked Pooled Freight Slot on TS-08-KL-9921.");
                }}
                className={`mt-2 w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm ${
                  bookedSlot
                    ? "bg-primary text-on-primary"
                    : "bg-tertiary text-on-tertiary hover:bg-tertiary/90"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {bookedSlot ? "check" : "bookmark_add"}
                </span>
                <span>{bookedSlot ? "Slot Reserved (Token #FL-882)" : "Book Pooled Freight Slot"}</span>
              </button>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between gap-3 border border-outline-variant/20">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">Armoor FPO Return Fleet (TS-16-AA-4011)</span>
                <span className="text-[11px] text-secondary">En route Warangal • 60 Qtl spare dry capacity</span>
              </div>
              <button
                type="button"
                onClick={() => showToast("Direct connection initiated to Armoor FPO fleet coordinator.")}
                className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold whitespace-nowrap transition-colors"
              >
                Inquire
              </button>
            </div>
          </div>

          {/* Freight Leakage Distribution */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-md border border-outline-variant/30 flex flex-col gap-4">
            <span className="font-headline text-sm font-bold text-on-surface">Freight Cost Leakage by Buyer Scenario</span>
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-on-surface">Buyer A: AgroCorp (0% Freight Burden)</span>
                  <span className="text-primary font-bold">₹0 Cost</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "2%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-on-surface">Buyer C: Kaveri Shared (Co-load Pool)</span>
                  <span className="text-tertiary font-bold">₹7,950 Deductions</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary rounded-full" style={{ width: "48%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-on-surface">Buyer B: Hyderabad Food Park (Full Transit)</span>
                  <span className="text-error font-bold">₹12,000 Deductions</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-error rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-secondary">
              <span className="material-symbols-outlined text-[15px] text-primary">lightbulb</span>
              <span>Choosing Buyer A yields ₹7,704 higher real profit than nominal top bidder.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Footer */}
      <div className="p-4 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 flex items-start gap-3.5">
        <span className="material-symbols-outlined text-secondary text-xl mt-0.5">info</span>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-on-surface uppercase tracking-wide">Freight Calculation & Indexing Notice</span>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            All transport freight rates, toll charges, and transit times are calculated estimates based on current diesel index and regional truck union schedules. Actual freight is locked upon driver assignment. SafeEscrow dual-signature protocol guarantees zero deductions past confirmed agreement parameters.
          </p>
        </div>
      </div>
    </div>
  );
}
