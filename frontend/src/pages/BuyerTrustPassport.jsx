import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchOrders } from "../api/orders";

export default function BuyerTrustPassport() {
  const { buyer_id } = useParams();
  const activeBuyerId = buyer_id || "BYR-8841-IN";
  const [orders, setOrders] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    fetchOrders({ limit: 20, offset: 0 })
      .then((res) => {
        if (res && res.orders) {
          setOrders(res.orders);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full min-h-screen bg-surface font-body text-on-surface py-6 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs sm:text-sm font-medium animate-bounce">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Context Navigation Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
          <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">security</span>
            Trust Registry
          </Link>
          <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
          <span>Institutional Buyers</span>
          <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
          <span className="text-on-surface font-bold bg-surface-container-high px-2 py-0.5 rounded-md">
            AgroCorp Mills ({buyer_id || "#BYR-8841-IN"})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Direct Banking Node Online (RBI Settlement Pool T+0)
          </div>
          <button
            type="button"
            onClick={() => showToast("Exported verifiable cryptographic trust dossier.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high text-xs font-bold text-on-surface shadow-sm transition-all border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[16px] text-tertiary">share</span>
            Share Audit Dossier
          </button>
        </div>
      </div>

      {/* Hero Profile Banner */}
      <div className="relative w-full rounded-2xl bg-surface-container-lowest shadow-md overflow-hidden p-6 lg:p-8 mb-6 border border-outline-variant/30">
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-surface-container-high overflow-hidden shadow-inner flex items-center justify-center shrink-0 border border-outline-variant/20">
              <div className="w-full h-full bg-primary-container/30 flex items-center justify-center text-primary font-headline font-bold text-2xl">
                AC
              </div>
              <span className="absolute bottom-1 right-1 p-1 bg-surface-container-lowest text-primary rounded-full shadow">
                <span className="material-symbols-outlined text-[16px] leading-none">verified</span>
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="font-headline font-bold text-2xl lg:text-3xl text-on-surface tracking-tight">
                  AgroCorp Processing Mills Pvt. Ltd.
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-wide">
                  {activeBuyerId}
                </span>
                {orders.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
                    {orders.length} Live Settlements Synced
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-on-surface-variant font-medium mb-3">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">location_on</span>
                  HQ: Hyderabad, Telangana
                </span>
                <span className="inline-block w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">domain</span>
                  Suryapet • Nalgonda • Miryalaguda Units
                </span>
                <span className="inline-block w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-outline">history</span>
                  Verified Corporate Buyer since Nov 2022
                </span>
              </div>

              {/* Compliance Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-high text-[11px] font-bold text-on-surface">
                  <span className="material-symbols-outlined text-[14px] text-primary">verified_user</span>
                  Tier 1 Institutional Miller
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-high text-[11px] font-bold text-on-surface">
                  <span className="material-symbols-outlined text-[14px] text-tertiary">assignment_turned_in</span>
                  FSSAI & GST Compliant
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-fixed text-[11px] font-bold text-on-primary-fixed-variant">
                  <span className="material-symbols-outlined text-[14px]">account_balance</span>
                  RBI Escrow Linked (State Bank of India Pool)
                </span>
              </div>
            </div>
          </div>

          {/* Trust Score Widget */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center p-4 rounded-xl bg-surface-container-low shrink-0 min-w-[240px] border border-outline-variant/20">
            <div className="flex flex-col text-left lg:text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-outline">FarmPay Algorithmic Score</span>
              <div className="flex items-baseline gap-1 lg:justify-end">
                <span className="font-headline font-black text-4xl lg:text-5xl text-primary tracking-tight">98.4</span>
                <span className="text-sm font-bold text-on-surface-variant">/ 100</span>
              </div>
              <span className="text-xs font-bold text-tertiary">Grade AAA Institutional Buyer</span>
            </div>
            <div className="mt-0 lg:mt-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-lowest text-[10px] font-semibold text-on-surface shadow-xs">
              <span className="material-symbols-outlined text-[14px] text-primary">data_check</span>
              <span>142 Bank-Settled Trades</span>
            </div>
          </div>
        </div>

        {/* Integrity Disclaimer Banner */}
        <div className="mt-5 pt-4 bg-surface-container/60 rounded-xl p-3 flex items-center gap-3 border border-outline-variant/10">
          <span className="material-symbols-outlined text-primary text-xl shrink-0">shield</span>
          <p className="text-xs text-on-surface leading-relaxed">
            <strong className="font-bold">Cryptographically Verified Metrics:</strong> All passport figures are computed directly from on-chain escrow locking timestamps, automated mandi weighbridge weigh-slips, and RBI RTGS settlement nodes. Zero subjective reviews, zero sponsor boosts.
          </p>
        </div>
      </div>

      {/* 4 Algorithmic Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {/* Pillar 1 */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed/40 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">schedule</span>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant">
                SLA Leading
              </span>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-outline mb-1">Escrow Deposit Punctuality</div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-headline font-bold text-3xl text-on-surface">99.8%</span>
              <span className="text-xs font-semibold text-primary">On-Time</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              Locks full procurement value into safe dual-sig escrow in average <strong>1.4 hrs</strong> after bid confirmation (industry benchmark: 6.0 hrs).
            </p>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: "99.8%" }}></div>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[22px]">scale</span>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                141/142 Pure Lots
              </span>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-outline mb-1">Dispute & Deduction Rate</div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-headline font-bold text-3xl text-on-surface">0.7%</span>
              <span className="text-xs font-semibold text-primary">Zero Dockage Arbitrage</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              Accepts certified APMC moisture reading without unilateral down-grading or post-arrival price gouging.
            </p>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: "99.3%" }}></div>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-tertiary-fixed/40 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[22px]">bolt</span>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
                T+0 Instant
              </span>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-outline mb-1">Average Payout Velocity</div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-headline font-bold text-3xl text-on-surface">38 min</span>
              <span className="text-xs font-semibold text-primary">Post-Tare Scale</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              Dual-signature release triggers immediately once driver FastTag clears mandi outgate weighbridge.
            </p>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div className="bg-tertiary h-full rounded-full" style={{ width: "94%" }}></div>
          </div>
        </div>

        {/* Pillar 4 */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[22px]">repeat</span>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                Retention Leader
              </span>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-outline mb-1">Farmer Retention Index</div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-headline font-bold text-3xl text-on-surface">94.2%</span>
              <span className="text-xs font-semibold text-primary">Repeat Sellers</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              FPOs in Nizamabad and Suryapet consistently route repeat seasonal harvests through AgroCorp contracts.
            </p>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: "94.2%" }}></div>
          </div>
        </div>
      </div>

      {/* Active Buyer Procurement Tenders */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">storefront</span>
            <h3 className="font-headline font-bold text-base text-on-surface">
              Active Procurement Mandates by AgroCorp Mills
            </h3>
          </div>
          <Link to="/market/demand-radar" className="text-xs font-bold text-primary hover:underline">
            View All in Demand Radar →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-on-surface">Paddy Sona Masoori (FAQ Grade 1)</span>
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">100% Free Freight</span>
              </div>
              <p className="text-on-surface-variant mt-1">Target Volume: 1,200 Quintals • Miryalaguda Hub</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
              <span className="font-headline font-bold text-base text-primary">₹2,580 - ₹2,640 / Qtl</span>
              <Link to="/negotiation/TND-8821" className="px-3 py-1.5 bg-primary text-on-primary rounded-lg font-bold">
                Negotiate
              </Link>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-on-surface">Sharbati Wheat Grade A</span>
                <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">Advance Escrow</span>
              </div>
              <p className="text-on-surface-variant mt-1">Target Volume: 800 Quintals • Hyderabad Metro Terminal</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
              <span className="font-headline font-bold text-base text-primary">₹2,420 - ₹2,480 / Qtl</span>
              <Link to="/negotiation/TND-8794" className="px-3 py-1.5 bg-primary text-on-primary rounded-lg font-bold">
                Negotiate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
