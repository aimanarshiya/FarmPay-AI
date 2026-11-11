import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function BuyerPenaltyManagement() {
  const [timeLeft, setTimeLeft] = useState({ hours: 68, minutes: 14, seconds: 38 });
  const [forfeitureConfirmed, setForfeitureConfirmed] = useState(false);
  const [summonsIssued, setSummonsIssued] = useState(false);
  const [bannerAlert, setBannerAlert] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function handleForfeit() {
    setForfeitureConfirmed(true);
    setBannerAlert("Statutory Escrow Forfeiture of ₹75,000 executed. Funds credited to Nizamabad Farmer Welfare Redressal Pool.");
  }

  function handleSummons() {
    setSummonsIssued(true);
    setBannerAlert("Formal Form VII-B Legal Summons dispatched via registered APMC digital notice node.");
  }

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen py-8 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="mb-6 rounded-2xl bg-surface-container-low p-6 shadow-sm border border-outline-variant/30 relative overflow-hidden">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-error-container text-on-error-container shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">gavel</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-error text-on-error">
                  Statutory Show-Cause Notice
                </span>
                <span className="text-xs font-mono font-bold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-md">
                  FORM VII-A • SCN/TS-APMC-NZB/2024/089
                </span>
                <span className="text-xs font-mono text-tertiary bg-secondary-container px-2 py-0.5 rounded-md font-semibold">
                  Ref: ARB-2024-041 (Lot #FP-2024-884)
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-headline font-bold text-on-surface tracking-tight leading-snug">
                In Re: Fraudulent Sensor Calibration, Arbitrary Dockage Cuts & Demurrage Coercion
              </h1>
              <p className="text-xs text-on-surface-variant font-medium mt-1">
                Issued under Sec 17-C & 23(1) Telangana Agricultural Produce Markets Act, 1966 r/w SafeEscrow Rule 9.4 • Nizamabad Dist Zone-II Bench
              </p>
            </div>
          </div>

          {/* Right SLA Countdown */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 bg-surface-container p-4 rounded-xl shrink-0 border border-outline-variant/20">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Statutory Response Window</span>
              <span className="text-xs font-bold text-error flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                72-Hr Mandatory Clock Running
              </span>
              <span className="text-[11px] text-on-surface-variant">Lapse triggers automatic license revocation</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <div className="bg-surface-container-lowest px-3 py-2 rounded-lg text-center shadow-sm">
                <span className="block text-xl font-bold text-on-surface leading-none">{timeLeft.hours}</span>
                <span className="text-[9px] uppercase tracking-wider text-outline">Hours</span>
              </div>
              <span className="text-lg font-bold text-outline">:</span>
              <div className="bg-surface-container-lowest px-3 py-2 rounded-lg text-center shadow-sm">
                <span className="block text-xl font-bold text-on-surface leading-none">{timeLeft.minutes}</span>
                <span className="text-[9px] uppercase tracking-wider text-outline">Mins</span>
              </div>
              <span className="text-lg font-bold text-outline">:</span>
              <div className="bg-surface-container-lowest px-3 py-2 rounded-lg text-center shadow-sm">
                <span className="block text-xl font-bold text-error leading-none">{timeLeft.seconds}</span>
                <span className="text-[9px] uppercase tracking-wider text-outline">Secs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Targeted Buyer Bio-Strip */}
        <div className="mt-5 pt-4 bg-surface-container-high/40 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs border border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-headline">
              AP
            </div>
            <div>
              <span className="font-bold text-on-surface text-sm">AgroCorp Processing Mills Pvt Ltd</span>
              <span className="text-on-surface-variant ml-2">License: <strong className="font-mono text-on-surface">#TS-NZM-MILL-4019</strong></span>
              <span className="text-on-surface-variant ml-2">• Miryalaguda Hub</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono flex-wrap">
            <span className="text-on-surface-variant">GSTIN: <span className="text-on-surface font-semibold">36AAACA1122K1Z9</span></span>
            <span className="text-on-surface-variant">Floating Escrow Reserve: <span className="text-primary font-bold">₹10,00,000.00</span></span>
            <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-bold uppercase tracking-wider text-[10px]">Passport: BBB- (Downgraded)</span>
          </div>
        </div>
      </div>

      {bannerAlert && (
        <div className="p-3.5 mb-6 rounded-xl bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold flex items-center justify-between shadow-sm">
          <span>{bannerAlert}</span>
          <button type="button" onClick={() => setBannerAlert("")} className="text-primary hover:underline font-bold">Dismiss</button>
        </div>
      )}

      {/* Main Grid: Evidence & Infractions vs Penalties & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Left Column: 3 Citations of Infraction (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-tertiary">balance</span>
                <h2 className="text-lg font-headline font-bold text-on-surface">Registered Citations & Evidentiary Findings</h2>
              </div>
              <span className="text-xs font-mono font-medium px-2 py-1 rounded bg-surface-container text-on-surface-variant">
                3 Violations Charged
              </span>
            </div>

            {/* Citation 1 */}
            <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3 border border-outline-variant/20">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-error text-on-error text-[10px] font-bold tracking-wide uppercase">Tier 1 • Critical</span>
                  <span className="font-mono text-xs font-bold text-on-surface">APMC R.14-B / Metrology Act §24</span>
                </div>
                <span className="text-[11px] font-bold text-error bg-error-container px-2 py-0.5 rounded">Penalty: ₹50,000 + Tech Sanction</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">Delinquent & Fraudulent Intake Instrumentation</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                  Use of uncertified digital moisture probe (S/N: MP-8812) whose statutory calibration certificate expired 18 days prior. Proven systematic positive bias of +0.65% (14.20% recorded vs Nodal blind oven standard 13.55%) deliberately used to force spurious 4% dockage cuts against Lot #FP-2024-884.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-primary pt-1">
                <span className="material-symbols-outlined text-[14px]">attachment</span>
                <span>Audit Memo #MET-TS-2024-89.pdf Verified</span>
              </div>
            </div>

            {/* Citation 2 */}
            <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3 border border-outline-variant/20">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container text-[10px] font-bold tracking-wide uppercase">Tier 2 • Serious</span>
                  <span className="font-mono text-xs font-bold text-on-surface">APMC Rule 21(3)</span>
                </div>
                <span className="text-[11px] font-bold text-on-secondary-container bg-secondary-container px-2 py-0.5 rounded">Compensatory: ₹25,000 + Demurrage</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">Coercive Unloading Delay & Unlawful Demurrage Threat</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                  Refusal to issue inward electronic gate-receipt for contracted vehicle TS-09-UB-4421. Driver unlawfully detained at mill intake perimeter for 4h 12m under predatory coercion to accept dockage discount, inflicting biological deterioration risk to perishable Sonamasuri paddy stock.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-primary pt-1">
                <span className="material-symbols-outlined text-[14px]">satellite_alt</span>
                <span>Geofence Telemetry Log #TF-899 Confirmed</span>
              </div>
            </div>

            {/* Citation 3 */}
            <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3 border border-outline-variant/20">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px] font-bold tracking-wide uppercase">Aggravating Circumstance</span>
                  <span className="font-mono text-xs font-bold text-on-surface">SafeEscrow Rule 11.2</span>
                </div>
                <span className="text-[11px] font-bold text-error bg-error-container px-2 py-0.5 rounded">Passport Degradation: AAA → BBB-</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">Patterned Escrow Delay across Nizamabad Cluster</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                  Prior record of 3 similar dockage controversies in current fiscal quarter. Buyer Trust Passport algorithmic health index downgraded to BBB- with automatic warning banner placed on public trade gateway.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Penalties & Statutory Enforcement (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-headline font-bold text-on-surface">Enforcement & Penalty Ledger</h2>
              <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container text-[10px] font-bold">
                Action Required
              </span>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between">
                <div>
                  <span className="font-bold text-on-surface block">Statutory Fine (Metrology Act)</span>
                  <span className="text-on-surface-variant text-[11px]">Uncalibrated moisture meter</span>
                </div>
                <span className="font-bold text-error text-sm font-mono">₹50,000.00</span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between">
                <div>
                  <span className="font-bold text-on-surface block">Direct Farmer Indemnity (Lot #884)</span>
                  <span className="text-on-surface-variant text-[11px]">Compensatory demurrage relief</span>
                </div>
                <span className="font-bold text-primary text-sm font-mono">₹25,000.00</span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container flex items-center justify-between border-t border-outline-variant/30 pt-3">
                <span className="font-bold text-on-surface font-headline text-sm">Total Mandatory Forfeiture</span>
                <span className="font-bold text-error text-base font-mono">₹75,000.00</span>
              </div>
            </div>

            {/* Statutory Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                type="button"
                onClick={handleForfeit}
                disabled={forfeitureConfirmed}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                  forfeitureConfirmed
                    ? "bg-primary-fixed text-on-primary-fixed-variant cursor-default"
                    : "bg-error text-on-error hover:bg-error/90"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {forfeitureConfirmed ? "check" : "account_balance"}
                </span>
                {forfeitureConfirmed
                  ? "₹75,000 Security Forfeited to Farmer Pool"
                  : "Execute Forfeiture from Escrow Reserve (₹75,000)"}
              </button>

              <button
                type="button"
                onClick={handleSummons}
                disabled={summonsIssued}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                  summonsIssued
                    ? "bg-surface-container text-on-surface-variant cursor-default"
                    : "bg-surface-container-high hover:bg-surface-container-highest text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">mail</span>
                {summonsIssued ? "Form VII-B Legal Summons Dispatched" : "Issue Formal Mandi Board Summons"}
              </button>

              <Link
                to="/disputes/arbitration/ARB-2024-041"
                className="w-full py-2.5 rounded-xl font-bold text-xs text-center border border-outline-variant hover:bg-surface-container transition text-on-surface flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px] text-tertiary">gavel</span>
                Open Judicial Arbitration Bench Docket →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
