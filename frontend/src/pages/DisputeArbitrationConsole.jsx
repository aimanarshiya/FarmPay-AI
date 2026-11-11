import { useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function DisputeArbitrationConsole() {
  const { dispute_id, disputeId } = useParams();
  const activeDisputeId = dispute_id || disputeId || "ARB-2024-041";

  const [farmerSplitPercent, setFarmerSplitPercent] = useState(96);
  const totalAmount = 374976;
  const farmerAmount = Math.round((totalAmount * farmerSplitPercent) / 100);
  const buyerAmount = totalAmount - farmerAmount;

  const [rulingSigned, setRulingSigned] = useState(false);
  const [successBanner, setSuccessBanner] = useState("");

  function handleSignRuling() {
    setRulingSigned(true);
    setSuccessBanner(
      `Quasi-Judicial Mandi Arbitral Award signed by Chief Arbitrator. Escrow release of ₹${farmerAmount.toLocaleString("en-IN")} to Farmer and ₹${buyerAmount.toLocaleString("en-IN")} to Buyer queued.`
    );
  }

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen py-8 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Metadata Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 mb-4 border-b border-outline-variant/30">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-secondary">
          <Link to="/disputes" className="hover:text-primary transition">Dispute Shield</Link>
          <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
          <span>APMC §14 Grievance Bench</span>
          <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
          <span className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-mono font-bold">
            DOCKET #{activeDisputeId}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-error-container text-on-error-container text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
            <span>Statutory SLA: 41m 28s remaining</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold">
            <span className="material-symbols-outlined text-[15px]">verified_user</span>
            <span>Multi-Sig: {rulingSigned ? "2 of 2 Verified" : "1 of 2 Verified"}</span>
          </div>
        </div>
      </div>

      {successBanner && (
        <div className="p-4 mb-6 rounded-xl bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold flex items-center justify-between shadow-sm">
          <span>{successBanner}</span>
          <button type="button" onClick={() => setSuccessBanner("")} className="text-primary hover:underline">Dismiss</button>
        </div>
      )}

      {/* Judicial Authority Banner & Escrow Lock Status */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container p-6 sm:p-8 shadow-sm mb-8 border border-outline-variant/30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-full bg-primary text-on-primary text-[11px] font-bold tracking-wide uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">gavel</span> Statutory Mandi Bench
              </span>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-bold">
                Officer ID: APMC-NZB-NODAL-09
              </span>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-tertiary text-[11px] font-bold shadow-xs">
                Nizamabad Zone Division II
              </span>
            </div>

            <div>
              <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface tracking-tight leading-snug">
                APMC Dispute Arbitration & Multi-Sig Decision Console
              </h1>
              <p className="text-sm text-secondary mt-1.5 leading-relaxed max-w-3xl">
                Quasi-judicial evidentiary bench and smart contract escrow settlement authority under Section 14 of the Telangana Agricultural Produce Markets Act, 1966 read with SafeEscrow Protocol Governance Guidelines.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-secondary pt-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[17px]">inventory_2</span>
                <span className="font-bold text-on-surface">Lot:</span> #FP-2024-884 (150 Qtl Sona Masoori)
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[17px]">badge</span>
                <span className="font-bold text-on-surface">Arbitrator:</span> Dr. Anand Verma (#APMC-704)
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-error text-[17px]">balance</span>
                <span className="font-bold text-on-surface">Contested Margin:</span> ₹15,120.00 (+0.7% Moisture Claim)
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 w-full">
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between gap-4 border border-outline-variant/30">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">ICICI Agri-Escrow Vault</span>
                  <span className="font-mono text-xs font-semibold text-primary block truncate max-w-[170px]">Node 0x4F...77e9</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-fixed text-on-primary-fixed-variant flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Vault Locked
                </span>
              </div>
              <div>
                <div className="text-[11px] text-secondary font-medium">Contested Principal Amount</div>
                <div className="font-headline text-3xl font-bold text-on-surface tracking-tight mt-0.5 font-mono">
                  ₹3,74,976<span className="text-lg font-normal text-secondary">.00</span>
                </div>
                <div className="text-[11px] text-primary font-semibold mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">lock</span> 100% Encumbered in Multi-Signature Smart Contract
                </div>
              </div>
              <div className="pt-3 bg-surface-container-low rounded-lg p-3">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-secondary font-medium">Arbitration Quorum</span>
                  <span className="font-bold text-on-surface font-mono">{rulingSigned ? "100% (2/2 Signatures)" : "50% (1/2 Signatures)"}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                  <div className={`h-full bg-primary rounded-full transition-all duration-500 ${rulingSigned ? "w-full" : "w-1/2"}`}></div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-secondary mt-1.5">
                  <span className="text-primary font-bold">✓ APMC Assessor Verified</span>
                  <span className={`font-semibold ${rulingSigned ? "text-primary font-bold" : "text-tertiary"}`}>
                    {rulingSigned ? "✓ Nodal Signed" : "Nodal Sign-off Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tripartite Evidence Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Baseline Contract */}
        <div className="bg-surface-container-low rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Contract Baseline</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">Mutual Terms</span>
            </div>
            <h3 className="font-headline text-base font-bold text-on-surface">Smart Contract #SC-884</h3>
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 px-2.5 rounded bg-surface-container">
                <span className="text-secondary">Base Price Agreed</span>
                <span className="font-bold font-mono">₹2,520 / Qtl</span>
              </div>
              <div className="flex justify-between py-1.5 px-2.5 rounded bg-surface-container">
                <span className="text-secondary">Moisture Cap</span>
                <span className="font-bold font-mono">14.0% Max</span>
              </div>
              <div className="flex justify-between py-1.5 px-2.5 rounded bg-surface-container">
                <span className="text-secondary">Origin Weight</span>
                <span className="font-bold font-mono">15,060 kg</span>
              </div>
              <div className="flex justify-between py-1.5 px-2.5 rounded bg-surface-container">
                <span className="text-secondary">Freight Allocation</span>
                <span className="font-bold text-primary">100% Buyer Borne</span>
              </div>
            </div>
          </div>
        </div>

        {/* Farmer Claim */}
        <div className="bg-surface-container-low rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Farmer Claim</span>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">FPO Backed</span>
            </div>
            <h3 className="font-headline text-base font-bold text-on-surface">Rajesh Patel & Nizamabad FPO</h3>
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 px-2.5 rounded bg-surface-container">
                <span className="text-secondary">Assay Moisture</span>
                <span className="font-bold text-primary font-mono">13.55% (Certified)</span>
              </div>
              <div className="flex justify-between py-1.5 px-2.5 rounded bg-surface-container">
                <span className="text-secondary">Weighbridge Net</span>
                <span className="font-bold text-primary font-mono">15,060 kg (+60kg gain)</span>
              </div>
              <div className="flex justify-between py-1.5 px-2.5 rounded bg-surface-container">
                <span className="text-secondary">Demanded Settlement</span>
                <span className="font-bold text-primary font-mono">₹3,74,976 (100%)</span>
              </div>
              <div className="flex justify-between py-1.5 px-2.5 rounded bg-surface-container">
                <span className="text-secondary">Evidence Filed</span>
                <span className="font-bold text-on-surface">GPS Log + Oven Test</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buyer Claim */}
        <div className="bg-surface-container-low rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-error">Buyer Contest</span>
              <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[10px] font-bold">Mill Claim</span>
            </div>
            <h3 className="font-headline text-base font-bold text-on-surface">AgroCorp Processing Mills</h3>
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 px-2.5 rounded bg-surface-container">
                <span className="text-secondary">Recorded Moisture</span>
                <span className="font-bold text-error font-mono">14.20% (+0.65% cut)</span>
              </div>
              <div className="flex justify-between py-1.5 px-2.5 rounded bg-surface-container">
                <span className="text-secondary">Dockage Deduction</span>
                <span className="font-bold text-error font-mono">4% Dockage Cut</span>
              </div>
              <div className="flex justify-between py-1.5 px-2.5 rounded bg-surface-container">
                <span className="text-secondary">Contested Margin</span>
                <span className="font-bold text-error font-mono">₹15,120.00</span>
              </div>
              <div className="flex justify-between py-1.5 px-2.5 rounded bg-surface-container">
                <span className="text-secondary">Audit Metrology</span>
                <span className="font-bold text-error">Calibration Expired</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Adjudication Split & Order Builder */}
      <div className="rounded-2xl bg-surface-container-low p-6 sm:p-8 shadow-sm border border-outline-variant/30 flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
          <div>
            <h2 className="font-headline text-xl font-bold text-on-surface">
              Statutory Arbitral Adjudication & Escrow Split
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Based on Metrology Memo #MET-TS-2024-89 showing uncalibrated buyer probes, Mandi bench issues 96% payout to farmer with nominal 4% processing dockage.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-on-surface">Farmer Split: {farmerSplitPercent}%</span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="flex flex-col gap-2">
          <input
            type="range"
            min="50"
            max="100"
            value={farmerSplitPercent}
            onChange={(e) => setFarmerSplitPercent(Number(e.target.value))}
            className="w-full accent-primary h-2 rounded-lg bg-surface-container cursor-pointer"
          />
          <div className="flex justify-between text-xs text-secondary font-mono">
            <span>50% Equal Split</span>
            <span>75% Compromise</span>
            <span className="text-primary font-bold">96% Bench Recommendation</span>
            <span>100% Full Farmer Payout</span>
          </div>
        </div>

        {/* Calculated Financial Split */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-primary/30 flex flex-col justify-between">
            <span className="text-xs text-secondary font-bold uppercase">To Farmer Bank Account (SBI #...9041)</span>
            <div className="text-2xl font-bold text-primary font-headline mt-2 font-mono">
              ₹{farmerAmount.toLocaleString("en-IN")}.00
            </div>
            <span className="text-[11px] text-primary mt-1">Includes produce payout + +60kg weighbridge gain</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col justify-between">
            <span className="text-xs text-secondary font-bold uppercase">Refund to AgroCorp Vault Account</span>
            <div className="text-2xl font-bold text-secondary font-headline mt-2 font-mono">
              ₹{buyerAmount.toLocaleString("en-IN")}.00
            </div>
            <span className="text-[11px] text-secondary mt-1">Contractual moisture variance adjustment</span>
          </div>
        </div>

        {/* Sign & Ratify */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant/20">
          <span className="text-xs text-on-surface-variant max-w-xl">
            Issuing this arbitral award executes multi-sig release on the ICICI Escrow smart contract under APMC Act statutory authority.
          </span>
          <button
            type="button"
            onClick={handleSignRuling}
            disabled={rulingSigned}
            className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              rulingSigned
                ? "bg-primary-fixed text-on-primary-fixed-variant cursor-default"
                : "bg-primary text-on-primary hover:bg-surface-tint shadow-md"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {rulingSigned ? "verified" : "draw"}
            </span>
            {rulingSigned ? "Statutory Arbitral Award Issued & Executed" : "Affix Digital Signature & Issue Award"}
          </button>
        </div>
      </div>
    </div>
  );
}
