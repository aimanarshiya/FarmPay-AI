import { useState } from "react";
import { Link } from "react-router-dom";

export default function CollectiveSellingHub() {
  const [pledged, setPledged] = useState(false);
  const [pledgeAmount, setPledgeAmount] = useState(25);
  const [successMsg, setSuccessMsg] = useState("");

  const totalPool = 420 + (pledged ? Number(pledgeAmount) : 0);
  const targetPool = 500;
  const progressPercent = Math.min(100, Math.round((totalPool / targetPool) * 100));

  function handlePledge(e) {
    e.preventDefault();
    setPledged(true);
    setSuccessMsg(`Pledge of ${pledgeAmount} Quintals successfully committed to Nizamabad Cluster Pool Lot #FP-COLL-104.`);
  }

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen py-8 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Prototype Notice */}
      <div className="flex items-center justify-between px-5 py-3 rounded-xl bg-secondary-container text-on-secondary-container">
        <div className="flex items-center gap-2.5 text-xs font-semibold">
          <span className="material-symbols-outlined text-[18px] text-tertiary">info</span>
          <span>Cluster Pooling & FPO Aggregation Module • Verified FPO Quorum Demo</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-tertiary">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span>Simulated SafeEscrow Grid</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant flex-wrap">
          <Link to="/" className="hover:text-primary transition">Farmer Innovations</Link>
          <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
          <span>Collective Selling</span>
          <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
          <span className="text-on-surface font-bold">Nizamabad Paddy Cluster Lot #FP-COLL-104</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-1">
          <div className="space-y-1.5 max-w-3xl">
            <h1 className="font-headline font-bold text-2xl lg:text-3xl text-on-surface tracking-tight">
              Collective Selling Hub — Cluster Lot Pooling
            </h1>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Aggregate harvest with verified neighboring farmers to command Tier-1 institutional mill pricing, unlock bulk freight discounts, and share transport costs.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold shadow-sm">
              <span className="material-symbols-outlined text-[15px]">timer</span>
              Active Pooling Window • 38h Remaining
            </span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold flex items-center justify-between shadow-sm">
          <span>{successMsg}</span>
          <button type="button" onClick={() => setSuccessMsg("")} className="text-primary hover:underline">Dismiss</button>
        </div>
      )}

      {/* Bento Grid: Pool Overview vs Institutional Bids */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Main Pool Progress Card (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-surface-container-low p-6 lg:p-7 flex flex-col justify-between shadow-sm border border-outline-variant/30 relative overflow-hidden">
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold uppercase tracking-wider">
                    Lot #FP-COLL-104
                  </span>
                  <span className="text-xs font-bold text-tertiary">Verified Cluster Pool</span>
                </div>
                <h2 className="font-headline font-bold text-xl lg:text-2xl text-on-surface mt-1.5">
                  Sona Masoori Paddy (Grade A)
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-tertiary">location_on</span>
                  Nizamabad South (Bodhan & Armoor Mandals)
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-on-surface-variant font-medium block">Current Pool Fill</span>
                <span className="font-headline font-bold text-2xl lg:text-3xl text-primary font-mono">
                  {totalPool} <span className="text-sm font-body font-semibold text-on-surface">/ {targetPool} Qtl</span>
                </span>
              </div>
            </div>

            {/* Progress Gauge */}
            <div className="space-y-2 mt-5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-on-surface-variant">
                  Capacity Progress: <strong className="text-on-surface font-bold">{progressPercent}% Filled</strong>
                </span>
                <span className="text-primary font-bold">{Math.max(0, targetPool - totalPool)} Quintals Remaining to Close</span>
              </div>
              <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-outline font-medium">
                <span>Minimum Viable Lot: 350 Qtl (Met)</span>
                <span>Target Batch: 500 Qtl (25 MT Multi-Axle)</span>
              </div>
            </div>
          </div>

          {/* Benchmarks Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-outline-variant/20">
            <div className="p-3.5 rounded-xl bg-surface-container flex flex-col">
              <span className="text-[11px] font-medium text-on-surface-variant">Target Floor Price</span>
              <span className="font-headline font-bold text-lg text-on-surface mt-0.5 font-mono">
                ₹2,600 <span className="text-[11px] font-normal text-outline">/ Qtl</span>
              </span>
              <span className="text-[10px] text-primary font-bold mt-1 inline-flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[13px]">arrow_upward</span>+₹320 vs Solo Mandi
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container flex flex-col">
              <span className="text-[11px] font-medium text-on-surface-variant">Local Solo Mandi Avg</span>
              <span className="font-headline font-semibold text-lg text-outline mt-0.5 font-mono">
                ₹2,280 <span className="text-[11px] font-normal text-outline">/ Qtl</span>
              </span>
              <span className="text-[10px] text-secondary font-medium mt-1">Armoor Mandi Spot</span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container flex flex-col col-span-2 sm:col-span-1">
              <span className="text-[11px] font-medium text-on-surface-variant">Bulk Freight Savings</span>
              <span className="font-headline font-bold text-lg text-primary mt-0.5 font-mono">
                ₹38 <span className="text-[11px] font-normal text-outline">/ Qtl</span>
              </span>
              <span className="text-[10px] text-on-surface-variant font-medium mt-1">Via 20T Multi-Axle Split</span>
            </div>
          </div>
        </div>

        {/* Institutional Buyer Live Bids (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-surface-container-low p-6 lg:p-7 flex flex-col justify-between shadow-sm border border-outline-variant/30">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">apartment</span>
                <h3 className="font-headline font-bold text-lg text-on-surface">Institutional Mill Bids</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold">
                2 Live Bids
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Direct purchase intent locked in automated escrow upon achieving batch target quota.
            </p>

            {/* Top Bid */}
            <div className="p-4 rounded-xl bg-surface-container mb-3 border border-outline-variant/20">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-on-surface">AgroCorp Processing Mills Ltd.</span>
                    <span className="material-symbols-outlined text-primary text-[14px]">verified</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant">Miryalaguda Unit • Tier-1 Institutional</span>
                </div>
                <div className="text-right">
                  <span className="font-headline font-bold text-lg text-primary font-mono">₹2,620</span>
                  <span className="text-[10px] text-on-surface-variant block">per Quintal</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-on-surface-variant mt-3 pt-2.5 border-t border-outline-variant/20">
                <span className="inline-flex items-center gap-1 text-primary font-bold">
                  <span className="material-symbols-outlined text-[14px]">thumb_up</span> +₹20 above floor price
                </span>
                <span className="bg-surface-container-lowest px-2 py-0.5 rounded text-[10px] font-bold text-on-surface">
                  Escrow Deposit: 100%
                </span>
              </div>
            </div>

            {/* Second Bid */}
            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-on-surface">Sri Venkateswara Rice Tech</span>
                    <span className="material-symbols-outlined text-primary text-[14px]">verified</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant">Nizamabad Industrial Zone</span>
                </div>
                <div className="text-right">
                  <span className="font-headline font-bold text-lg text-on-surface font-mono">₹2,580</span>
                  <span className="text-[10px] text-on-surface-variant block">per Quintal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Farmer Pledge Action Box */}
          <form onSubmit={handlePledge} className="mt-5 p-4 rounded-xl bg-surface-container flex flex-col gap-3 border border-outline-variant/30">
            <span className="text-xs font-bold text-on-surface">Pledge Harvest to this Collective Lot</span>
            <div className="flex gap-2">
              <input
                type="number"
                min="5"
                max="80"
                value={pledgeAmount}
                onChange={(e) => setPledgeAmount(e.target.value)}
                disabled={pledged}
                className="w-24 p-2 rounded-xl bg-surface-container-lowest border border-outline-variant text-center text-xs font-bold font-mono"
              />
              <span className="self-center text-xs text-on-surface-variant">Quintals</span>
              <button
                type="submit"
                disabled={pledged}
                className={`flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                  pledged
                    ? "bg-primary-fixed text-on-primary-fixed-variant"
                    : "bg-primary text-on-primary hover:bg-surface-tint"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {pledged ? "check" : "add_task"}
                </span>
                {pledged ? "Pledged 25 Qtl" : "Confirm Pool Pledge"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
