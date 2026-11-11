import { useState } from "react";
import { Link } from "react-router-dom";

export default function DisputeShield() {
  const [evidenceUploaded, setEvidenceUploaded] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // overview, evidence, resolution
  const [escalateSuccess, setEscalateSuccess] = useState("");

  function handleUpload(e) {
    e.preventDefault();
    setEvidenceUploaded(true);
    setEscalateSuccess("Certified laboratory moisture oven test log attached to docket.");
  }

  function handleEscalate() {
    setEscalateSuccess("Emergency APMC Mandi Nodal Tribunal session convened. Case escalated under APMC §14.");
  }

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen py-8 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Top Navigation & Header Panel */}
      <section className="mb-8 border-b border-outline-variant/30 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary flex-wrap">
            <Link to="/" className="hover:text-primary transition">Farmer Innovations</Link>
            <span className="text-outline-variant">•</span>
            <span className="text-tertiary">Dispute Shield</span>
            <span className="text-outline-variant">•</span>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-mono text-[11px] font-bold">
              Case #DSP-2024-041
            </span>
            <span className="text-on-surface-variant font-medium">(Order #FP-2024-884)</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>SafeEscrow Protocol v4.2 Active</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="font-headline text-3xl md:text-4xl text-on-surface font-bold tracking-tight leading-tight mb-2">
              Dispute Shield <span className="font-normal italic text-secondary">— Order Arbitration & Escrow Vault</span>
            </h1>
            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
              Neutral, data-backed arbitration room ensuring safe transactions. Every dispute is resolved strictly against immutable weighbridge logs, IoT assay records, and multi-sig escrow contracts.
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low shadow-sm self-start lg:self-auto min-w-[300px] border border-outline-variant/30">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary flex-shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[26px]">lock_clock</span>
            </div>
            <div className="flex flex-col">
              <div className="text-[11px] uppercase tracking-wider font-bold text-tertiary">SafeEscrow Locked Liquidity</div>
              <div className="text-xl font-headline font-bold text-on-surface font-mono">
                ₹3,74,976 <span className="text-xs font-body font-normal text-secondary">Secured</span>
              </div>
              <div className="text-[11px] font-semibold text-primary flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">verified_user</span>
                Zero Unauthorized Disbursal
              </div>
            </div>
          </div>
        </div>
      </section>

      {escalateSuccess && (
        <div className="p-4 mb-6 rounded-xl bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold flex items-center justify-between shadow-sm">
          <span>{escalateSuccess}</span>
          <button type="button" onClick={() => setEscalateSuccess("")} className="text-primary hover:underline font-bold">Dismiss</button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/30 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 text-xs font-bold transition border-b-2 ${
            activeTab === "overview"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Case Dossier & Evidence
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("evidence")}
          className={`px-4 py-2 text-xs font-bold transition border-b-2 ${
            activeTab === "evidence"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Submit Telemetry Proof
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Main Case Dossier Card (8 Cols) */}
          <div className="lg:col-span-8 p-6 md:p-8 rounded-2xl bg-surface-container-low shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface text-xs font-bold">
                    LOT: Sona Masoori Paddy (150 Qtl)
                  </span>
                  <span className="text-xs text-secondary font-mono">APMC Nizamabad G-11</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  Active Arbitration • Step 3 of 4
                </span>
              </div>

              {/* Disputing Entities Split View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-surface-container flex items-start gap-3 border border-outline-variant/20">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant font-bold text-sm shrink-0">
                    RP
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-primary">Seller (Farmer / FPO)</span>
                    <span className="font-headline font-bold text-base text-on-surface truncate">Rajesh Patel</span>
                    <span className="text-xs text-secondary">Nizamabad Farmers Producer Co.</span>
                    <span className="text-[11px] text-on-surface-variant font-mono mt-0.5">Origin Node #NZM-4819</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-container flex items-start gap-3 border border-outline-variant/20">
                  <div className="w-10 h-10 rounded-full bg-surface-dim flex items-center justify-center text-on-surface font-bold text-sm shrink-0">
                    AC
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-secondary">Buyer (Aggregator / Mill)</span>
                    <span className="font-headline font-bold text-base text-on-surface truncate">AgroCorp Processing Mills</span>
                    <span className="text-xs text-secondary">Secunderabad Mill Hub 02</span>
                    <span className="text-[11px] text-on-surface-variant font-mono mt-0.5">Buyer Node #SEC-MILL-09</span>
                  </div>
                </div>
              </div>

              {/* Dispute Cause Highlight */}
              <div className="p-5 rounded-xl bg-surface-container-high/70 border border-outline-variant/20 mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-error mb-1.5 uppercase tracking-wide">
                  <span className="material-symbols-outlined text-[16px]">report_problem</span>
                  Buyer Intake Dispute Notice
                </div>
                <p className="font-headline text-base md:text-lg text-on-surface font-semibold leading-snug">
                  “Moisture Discrepancy at Intake Gate (Buyer claimed 14.2% vs Mandi certified 13.5%)”
                </p>
                <div className="mt-2 text-xs text-on-surface-variant flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>Claim Origin: <strong className="text-on-surface font-semibold">Mill Gate Weighbridge Berth 2</strong></span>
                  <span>Recorded: <strong className="text-on-surface font-semibold">Oct 24, 07:15 PM</strong></span>
                  <span>Variance Claimed: <strong className="text-error font-semibold">+0.7% Moisture</strong></span>
                </div>
              </div>

              {/* Lock notice */}
              <div className="flex items-center gap-3 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-[22px] shrink-0">security</span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  <strong className="text-on-surface font-semibold">Automatic SafeEscrow Lock Active:</strong> Escrow vault freeze activated automatically. Payout cannot be cancelled, reversed, or deducted unilaterally by either party until an authorized APMC Nodal resolution certificate is submitted.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-on-surface-variant">Statutory Arbitrator: Dr. Anand Verma (ID #APMC-704)</span>
              <Link
                to="/disputes/arbitration/ARB-2024-041"
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-surface-tint transition flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">gavel</span>
                Enter Mandi Arbitration Bench →
              </Link>
            </div>
          </div>

          {/* Escrow Breakdown & Floor Guarantee (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-2xl bg-surface-container-low shadow-sm border border-outline-variant/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary">Contract Escrow Vault</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-[11px] font-mono font-bold text-on-surface-variant">MULTI-SIG 2/3</span>
                </div>
                <div className="text-3xl font-headline font-bold text-on-surface mb-1 font-mono">
                  ₹3,74,976.00
                </div>
                <p className="text-xs text-secondary mb-6">Total contract funds held securely in State Reserve Agro-Escrow Node.</p>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                    <span className="text-on-surface-variant">Base Commodity Value</span>
                    <span className="font-bold font-mono text-on-surface">₹3,78,000.00</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                    <span className="text-on-surface-variant">Mandi Cess (0.8%)</span>
                    <span className="font-bold font-mono text-secondary">- ₹3,024.00</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                    <span className="text-on-surface-variant">Contested Margin (Buyer)</span>
                    <span className="font-bold font-mono text-tertiary">₹15,120.00 (4%)</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-on-surface">Guaranteed Uncontested Floor</span>
                    <span className="font-bold font-mono text-primary text-sm">₹3,59,856.00</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={handleEscalate}
                  className="w-full py-2.5 rounded-xl bg-error text-on-error hover:bg-error/90 font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">emergency</span>
                  Escalate to Mandi Board Tribunal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "evidence" && (
        <div className="max-w-3xl rounded-2xl bg-surface-container-low p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-6 mb-8">
          <h2 className="text-lg font-headline font-bold text-on-surface">Submit Telemetry & Test Proof</h2>
          <p className="text-xs text-on-surface-variant">
            Upload certified digital moisture sensor readings, weighbridge weight slip tickets, or Mandi lab certificates to support your claim.
          </p>

          <form onSubmit={handleUpload} className="flex flex-col gap-4 text-xs">
            <div>
              <label className="font-bold text-on-surface block mb-1">Evidence Type</label>
              <select className="w-full p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface">
                <option>NABL Accredited Laboratory Assay Report (Moisture/Foreign Matter)</option>
                <option>Electronic Weighbridge Gross & Tare Slip</option>
                <option>Gate CCTV Intake Timestamp Photo</option>
                <option>GPS Geofence Transit Telemetry Log</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">Notes / Field Statement</label>
              <textarea
                rows={3}
                defaultValue="Field assay conducted at Bodhan Mandi using certified calibrated meter #MET-994 confirmed 13.5% moisture at loading."
                className="w-full p-3 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface"
              />
            </div>

            <div className="p-6 border-2 border-dashed border-outline-variant rounded-xl text-center bg-surface-container-lowest">
              <span className="material-symbols-outlined text-3xl text-primary mb-2">upload_file</span>
              <p className="font-bold text-on-surface">Drag & drop lab test certificate or click to browse</p>
              <p className="text-[11px] text-on-surface-variant mt-1">PDF, JPG, PNG up to 10MB</p>
            </div>

            {evidenceUploaded && (
              <div className="p-3 rounded-xl bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                Evidence sealed to Docket #DSP-2024-041 with SHA-256 timestamp.
              </div>
            )}

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-primary text-on-primary font-bold text-xs self-start hover:bg-surface-tint transition shadow-sm"
            >
              Upload & Seal Evidence to Docket
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
