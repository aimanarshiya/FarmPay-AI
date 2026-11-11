import { useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function DigitalCropPassport() {
  const { lot_id, lotId } = useParams();
  const activeLotId = lot_id || lotId || "FP-2024-884";

  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState("");

  const passportId = `#PASSPORT-${activeLotId.toUpperCase()}-TS`;

  function handleCopy() {
    navigator.clipboard.writeText(passportId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handleDownloadPDF() {
    setDownloadSuccess("Signed Digital Crop Passport PDF exported successfully.");
    setTimeout(() => setDownloadSuccess(""), 4000);
  }

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen py-8 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Top Operational Banner & Meta Ledger */}
      <div className="flex flex-col gap-4 mb-8 border-b border-outline-variant/30 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant uppercase tracking-wider flex-wrap">
          <Link to="/" className="hover:text-primary transition">Farmer Innovations</Link>
          <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
          <span>Digital Crop Passport</span>
          <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
          <span className="text-primary font-bold">Lot #{activeLotId}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="font-headline text-3xl md:text-4xl text-on-surface font-bold tracking-tight leading-tight">
              Digital Crop Passport — Verifiable Provenance
            </h1>
            <p className="text-on-surface-variant text-sm md:text-base mt-2 leading-relaxed">
              Cryptographically secured identity record tracking crop origin, field assay metrics, farmer declarations, independent inspection audits, and escrow transaction history.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Passport Status: Authenticated & Mandi Certified</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-mono">
              <span className="material-symbols-outlined text-[15px] text-tertiary">fingerprint</span>
              <span>SHA-256: 8a4c172d89b0...e0</span>
            </div>
          </div>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 mb-6 rounded-xl bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold flex items-center justify-between">
          <span>{downloadSuccess}</span>
          <button type="button" onClick={() => setDownloadSuccess("")} className="text-primary hover:underline">Dismiss</button>
        </div>
      )}

      {/* Hero Document Card */}
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-md p-6 lg:p-8 mb-10 overflow-hidden border border-outline-variant/40">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-primary-container to-tertiary"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
          {/* Left: Official Stamp & QR Code Card */}
          <div className="lg:col-span-4 bg-surface-container-low rounded-xl p-6 flex flex-col justify-between items-center text-center shadow-sm border border-outline-variant/30">
            <div className="w-full flex items-center justify-between pb-3">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[20px]">token</span>
                <span className="text-[11px] font-bold tracking-widest text-on-surface uppercase font-headline">National Registry</span>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-surface-container text-tertiary">SECURE-ID</span>
            </div>

            {/* QR Vector Illustration */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm my-3 flex flex-col items-center border border-outline-variant/30">
              <svg className="w-40 h-40 text-on-surface" fill="none" viewBox="0 0 160 160">
                <rect fill="currentColor" height="44" rx="4" width="44" x="10" y="10" />
                <rect fill="#faf6f0" height="28" rx="2" width="28" x="18" y="18" />
                <rect fill="currentColor" height="16" rx="2" width="16" x="24" y="24" />
                <rect fill="currentColor" height="44" rx="4" width="44" x="106" y="10" />
                <rect fill="#faf6f0" height="28" rx="2" width="28" x="114" y="18" />
                <rect fill="currentColor" height="16" rx="2" width="16" x="120" y="24" />
                <rect fill="currentColor" height="44" rx="4" width="44" x="10" y="106" />
                <rect fill="#faf6f0" height="28" rx="2" width="28" x="18" y="114" />
                <rect fill="currentColor" height="16" rx="2" width="16" x="24" y="120" />
                <rect fill="currentColor" height="8" width="8" x="62" y="14" />
                <rect fill="currentColor" height="8" width="16" x="76" y="14" />
                <rect fill="currentColor" height="8" width="16" x="62" y="28" />
                <rect fill="currentColor" height="14" width="8" x="84" y="28" />
                <rect fill="currentColor" height="10" width="8" x="62" y="44" />
                <rect fill="currentColor" height="8" width="14" x="78" y="44" />
                <rect fill="#4a7c59" height="22" rx="4" width="22" x="69" y="69" />
                <path d="M75 80L78 83L85 76" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </div>

            <p className="text-xs text-on-surface-variant font-medium leading-snug px-2">
              Scan with any mobile camera to verify immutable harvest provenance & assay records.
            </p>

            <div className="mt-4 pt-3 w-full flex items-center justify-between text-[11px] text-on-surface-variant border-t border-outline-variant/30">
              <span className="flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>L2 Certified
              </span>
              <span className="font-bold text-on-surface">Epoch #14,921</span>
            </div>
          </div>

          {/* Right: Sovereign Lot Core Dossier */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-outline-variant/20">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-tertiary">Official Agricultural Deed</span>
                  <div className="text-xl md:text-2xl font-headline font-bold text-on-surface flex items-center gap-2">
                    <span>{passportId}</span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="text-outline hover:text-primary transition text-sm"
                      title="Copy Passport ID"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {copied ? "done" : "content_copy"}
                      </span>
                    </button>
                    {copied && <span className="text-xs text-primary font-bold">Copied!</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-secondary-container px-3 py-1.5 rounded-lg text-on-secondary-container text-xs font-semibold">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">gavel</span>
                  <span>APMC Act Sec. 12 Compliant</span>
                </div>
              </div>

              {/* Grid of Key Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide block">Commodity & Variety</span>
                  <span className="font-headline font-bold text-on-surface text-base block mt-0.5">Paddy (Sona Masoori)</span>
                  <span className="text-xs text-primary font-medium">BPT 5204 Super Fine</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide block">Producer / FPO</span>
                  <span className="font-headline font-bold text-on-surface text-base block mt-0.5">Rajesh Patel</span>
                  <span className="text-xs text-tertiary font-medium">Nizamabad Kisan FPO #04</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide block">Declared Harvest Date</span>
                  <span className="font-headline font-bold text-on-surface text-base block mt-0.5">18 October 2024</span>
                  <span className="text-xs text-on-surface-variant font-medium">Kharif Season Cycle</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide block">Geographic Origin</span>
                  <span className="font-headline font-bold text-on-surface text-base block mt-0.5">Bodhan Cluster</span>
                  <span className="text-xs text-on-surface-variant font-medium">Nizamabad Dist, Telangana</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide block">Lot Volume</span>
                  <span className="font-headline font-bold text-on-surface text-base block mt-0.5">150 Quintals</span>
                  <span className="text-xs text-on-surface-variant font-medium">300 Gunny Bags (50kg)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide block">Escrow Reference</span>
                  <span className="font-headline font-bold text-on-surface text-base block mt-0.5 font-mono">₹3,73,464</span>
                  <span className="text-xs text-primary font-medium">ICICI Vault #ESC-9082</span>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-wrap gap-3 items-center justify-between border-t border-outline-variant/20 mt-6">
              <div className="text-xs text-on-surface-variant">
                <span>Verified by APMC Grader: <strong>M. Ramachandran (#MND-7712)</strong></span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-surface-tint transition flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                  Download Certified Passport PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Laboratory Assay & Quality Analysis Table */}
      <div className="rounded-2xl bg-surface-container-low p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">science</span>
            <h2 className="text-base font-headline font-bold text-on-surface">Certified Laboratory Quality Assay</h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant">
            NABL Accredited Lab #HYD-NABL-4401
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Moisture Content</span>
            <span className="text-lg font-bold text-primary font-mono">13.5%</span>
            <span className="text-[11px] text-on-surface-variant">Standard limit: ≤14.0%</span>
            <span className="mt-1 text-[10px] font-bold text-primary">PASSED (Optimal for Storage)</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Broken Grains</span>
            <span className="text-lg font-bold text-on-surface font-mono">4.2%</span>
            <span className="text-[11px] text-on-surface-variant">Standard limit: ≤8.0%</span>
            <span className="mt-1 text-[10px] font-bold text-primary">PASSED (Super Fine Grade)</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Foreign Organic Matter</span>
            <span className="text-lg font-bold text-on-surface font-mono">0.8%</span>
            <span className="text-[11px] text-on-surface-variant">Standard limit: ≤2.0%</span>
            <span className="mt-1 text-[10px] font-bold text-primary">PASSED (Cleaned & De-stoned)</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Pesticide Residue</span>
            <span className="text-lg font-bold text-primary font-mono">ND (&lt;0.01 ppm)</span>
            <span className="text-[11px] text-on-surface-variant">FSSAI Permissible Residue</span>
            <span className="mt-1 text-[10px] font-bold text-primary">PASSED (Green Category)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
