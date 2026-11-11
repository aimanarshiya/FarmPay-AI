import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchOrder } from "../api/orders";

export default function OrderEscrowTracker() {
  const { order_id, orderId } = useParams();
  const activeOrderId = order_id || orderId || "ORD-8841-902";

  const [realOrder, setRealOrder] = useState(null);
  const [activeStep, setActiveStep] = useState(4);
  const [dualSigConfirmed, setDualSigConfirmed] = useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");

  useEffect(() => {
    let mounted = true;
    if (activeOrderId && !activeOrderId.startsWith("ORD-8841")) {
      fetchOrder(activeOrderId)
        .then((res) => {
          if (mounted && res && res.order) {
            setRealOrder(res.order);
          }
        })
        .catch(() => {});
    }
    return () => {
      mounted = false;
    };
  }, [activeOrderId]);

  // Derived or demo metrics
  const lotNumber = realOrder ? `LOT-${realOrder.order_id?.slice(-8) || "884"}` : "Lot #FP-2024-884";
  const cropTitle = realOrder?.crop_name || realOrder?.crop || "Sona Masoori Paddy (Grade A)";
  const quantity = realOrder?.quantity_kg ? `${(realOrder.quantity_kg / 100).toFixed(0)} Quintals (${realOrder.quantity_kg} kg)` : "150 Quintals • 300 Bags (50kg)";
  const buyerName = realOrder?.buyer_name || "AgroCorp Processing Mills Pvt. Ltd.";
  const escrowAmount = realOrder?.total_amount ? `₹${Number(realOrder.total_amount).toLocaleString("en-IN")}` : "₹3,73,464";

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen py-8 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 mb-4 border-b border-outline-variant/30">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant flex-wrap">
            <Link to="/orders" className="hover:text-primary transition">Orders & Payouts</Link>
            <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
            <span>Active Fulfillments</span>
            <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
            <span className="text-tertiary font-bold tracking-tight">Order #{activeOrderId}</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-[11px] font-mono text-on-surface-variant">
              {lotNumber}
            </span>
            {realOrder ? (
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                Live DB Sync
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                Demonstration Lot
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="text-2xl lg:text-3xl font-headline font-bold text-on-surface tracking-tight">
              {cropTitle}
            </h1>
            <span className="text-sm font-semibold text-on-surface-variant">{quantity}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">store</span>
              Buyer: <strong className="text-on-surface font-semibold">{buyerName}</strong>
              <span className="px-1.5 py-0.2 rounded bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[10px]">Score 98.4 (AAA)</span>
            </span>
            <span className="text-outline-variant">•</span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-tertiary">potted_plant</span>
              Origin: <strong className="text-on-surface font-semibold">Rajesh Patel & Nizamabad Kisan FPO</strong> (Bodhan Cluster)
            </span>
          </div>
        </div>

        {/* Live Status & Instant Escrow Badge */}
        <div className="flex flex-row md:flex-col items-start md:items-end justify-between md:justify-center gap-2.5 bg-surface-container-low p-4 rounded-xl shadow-sm border border-outline-variant/40">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-primary -ml-3"></span>
            IN TRANSIT • TARE & WEIGHBRIDGE CLEARED
          </div>
          <div className="flex items-baseline gap-2 text-right">
            <span className="text-[11px] uppercase tracking-wider text-outline font-bold">Locked Escrow Vault</span>
            <span className="font-headline text-xl lg:text-2xl font-bold text-on-surface tracking-tight font-mono">
              {escrowAmount}
            </span>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 mb-6 rounded-xl bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button type="button" onClick={() => setActionSuccess("")} className="text-primary hover:underline">Dismiss</button>
        </div>
      )}

      {/* Primary Escrow Guarantee Banner */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container p-6 mb-8 shadow-sm border border-outline-variant/40">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[26px]">verified_user</span>
            </div>
            <div className="flex flex-col gap-1 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-on-surface font-headline">100% Escrow Vault Secured & Irrevocable</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest text-primary text-[10px] font-bold shadow-xs">
                  ICICI Bank Node #ESC-9082
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-semibold">
                  RBI Agri-Fintech Regulated
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface font-semibold">{escrowAmount}</strong> is locked under multi-signature protocol. Buyer cannot revoke or modify funds unilaterally. Disbursal executes automatically to your linked SBI account upon electronic mill-inbound QR scan.
              </p>
              <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-tertiary">
                <span className="material-symbols-outlined text-[14px]">key</span>
                <span>Dual-Sig Hash: 0x9f32...884a-ts09-verified</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setActionSuccess("Smart Contract Cryptographic Attestation downloaded.")}
              className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition text-xs font-bold shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px] text-tertiary">description</span>
              Smart Contract
            </button>
            <button
              type="button"
              onClick={() => setActionSuccess("Inspection Pass exported as certified digital PDF.")}
              className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition text-xs font-bold shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">download</span>
              Inspection Pass
            </button>
            <button
              type="button"
              onClick={() => setDisputeModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-error-container/60 hover:bg-error-container text-on-error-container transition text-xs font-bold"
              title="Freeze payouts under formal mandi inspector audit"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              Dispute Hold
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Step Interactive Milestone Progress Tracker */}
      <div className="rounded-xl bg-surface-container-low p-6 mb-8 shadow-sm border border-outline-variant/30">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">route</span>
            <h2 className="text-base font-headline font-bold text-on-surface">Agri-Fulfillment & Automated Disbursal Pipeline</h2>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            Estimated Final Settlement: <strong className="text-on-surface">Today, ~07:15 PM</strong>
          </span>
        </div>

        {/* Stepper Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 relative">
          {/* Step 1 */}
          <div
            onClick={() => setActiveStep(1)}
            className={`cursor-pointer flex flex-col p-4 rounded-xl transition ${
              activeStep >= 1 ? "bg-surface-container-lowest shadow-sm" : "bg-surface-container opacity-70"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">done</span>
              </span>
              <span className="text-[10px] font-bold text-on-surface-variant">Step 1</span>
            </div>
            <span className="text-xs font-bold text-on-surface">Escrow Locked</span>
            <span className="text-[11px] text-on-surface-variant mt-0.5">Oct 24 • 09:15 AM</span>
            <p className="text-[11px] text-on-surface-variant leading-tight mt-2.5">
              ₹3.73 Lakh funded by AgroCorp. Cryptographic smart pledge issued.
            </p>
            <div className="mt-3 pt-2 text-[10px] text-primary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span> Node Verified
            </div>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => setActiveStep(2)}
            className={`cursor-pointer flex flex-col p-4 rounded-xl transition ${
              activeStep >= 2 ? "bg-surface-container-lowest shadow-sm" : "bg-surface-container opacity-70"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">done</span>
              </span>
              <span className="text-[10px] font-bold text-on-surface-variant">Step 2</span>
            </div>
            <span className="text-xs font-bold text-on-surface">Assay & QR Bagging</span>
            <span className="text-[11px] text-on-surface-variant mt-0.5">Oct 24 • 11:30 AM</span>
            <p className="text-[11px] text-on-surface-variant leading-tight mt-2.5">
              Moisture: <strong className="text-on-surface">13.5%</strong> (&lt;14%). 300 geotagged gunny bags sealed.
            </p>
            <div className="mt-3 pt-2 text-[10px] text-primary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">qr_code_2</span> Tagged #NIZ-300
            </div>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => setActiveStep(3)}
            className={`cursor-pointer flex flex-col p-4 rounded-xl transition ${
              activeStep >= 3 ? "bg-surface-container-lowest shadow-sm" : "bg-surface-container opacity-70"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">done</span>
              </span>
              <span className="text-[10px] font-bold text-on-surface-variant">Step 3</span>
            </div>
            <span className="text-xs font-bold text-on-surface">Farmgate Dispatch</span>
            <span className="text-[11px] text-on-surface-variant mt-0.5">Oct 24 • 02:45 PM</span>
            <p className="text-[11px] text-on-surface-variant leading-tight mt-2.5">
              Vehicle <strong className="text-on-surface">#TS-09-UB-4421</strong> loaded. Zero farmer freight deduction.
            </p>
            <div className="mt-3 pt-2 text-[10px] text-primary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">local_shipping</span> Driver Verified
            </div>
          </div>

          {/* Step 4 (Active) */}
          <div
            onClick={() => setActiveStep(4)}
            className={`cursor-pointer flex flex-col p-4 rounded-xl transition ${
              activeStep === 4 ? "bg-surface-container-highest ring-2 ring-primary shadow-sm" : "bg-surface-container-lowest shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold animate-pulse">
                <span className="material-symbols-outlined text-[16px]">scale</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-primary text-on-primary text-[9px] font-bold uppercase tracking-wider">Active</span>
            </div>
            <span className="text-xs font-bold text-on-surface">Weighbridge Cleared</span>
            <span className="text-[11px] text-on-surface-variant mt-0.5">Oct 24 • 05:20 PM</span>
            <p className="text-[11px] text-on-surface-variant leading-tight mt-2.5">
              Gross: 22,480 kg | Net: <strong className="text-on-surface">15,060 kg</strong>. Verified +60kg yield advantage.
            </p>
            <div className="mt-3 pt-2 text-[10px] text-primary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">task_alt</span> Slip #EWB-4491
            </div>
          </div>

          {/* Step 5 */}
          <div
            onClick={() => setActiveStep(5)}
            className={`cursor-pointer flex flex-col p-4 rounded-xl transition ${
              activeStep === 5 ? "bg-surface-container-highest shadow-sm" : "bg-surface-container opacity-90"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-7 h-7 rounded-full bg-surface-dim text-outline flex items-center justify-center text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
              </span>
              <span className="text-[10px] font-bold text-outline">Step 5</span>
            </div>
            <span className="text-xs font-bold text-on-surface">Mill QC & Disbursal</span>
            <span className="text-[11px] text-outline mt-0.5">Est. Today • ~07:00 PM</span>
            <p className="text-[11px] text-on-surface-variant leading-tight mt-2.5">
              Gate-in check initiates instant RBI T+0 RTGS settlement straight to your bank account.
            </p>
            <div className="mt-3 pt-2 text-[10px] text-tertiary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span> Pending Gate-In
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Live Telemetry & Verification Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Left Column: Transit GPS & Telemetry (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="rounded-xl bg-surface-container-low p-6 shadow-sm flex flex-col gap-4 border border-outline-variant/30">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">navigation</span>
                <div>
                  <h3 className="text-sm font-headline font-bold text-on-surface">Live Transit Telemetry & Route Guard</h3>
                  <p className="text-[11px] text-on-surface-variant">Bodhan Cluster, Nizamabad → AgroCorp Processing Mills, Miryalaguda Unit</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Speed: 52 km/h
              </span>
            </div>

            {/* Map Telemetry Box */}
            <div className="w-full h-72 rounded-xl relative overflow-hidden bg-surface-container-high flex flex-col justify-between p-4 border border-outline-variant/40 bg-gradient-to-br from-[#e4e0d8] to-[#dbd7cf]">
              <div className="bg-surface/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md text-xs self-start max-w-xs">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Current Waypoint</span>
                <span className="font-bold text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">pin_drop</span> Near Choutuppal Toll Plaza (NH 65)
                </span>
              </div>

              <div className="bg-surface/90 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-md text-xs self-end flex items-center gap-4">
                <div>
                  <span className="text-[10px] font-bold text-outline uppercase block">Estimated Arrival</span>
                  <span className="font-bold text-primary text-sm font-headline">06:45 PM (1h 25m)</span>
                </div>
                <div className="w-px h-7 bg-outline-variant"></div>
                <div>
                  <span className="text-[10px] font-bold text-outline uppercase block">Distance Remaining</span>
                  <span className="font-bold text-on-surface text-sm font-headline font-mono">74.2 km</span>
                </div>
              </div>
            </div>

            {/* Driver Details */}
            <div className="p-3.5 rounded-xl bg-surface-container flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold font-headline">
                  SY
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface">Suresh Yadav (Driver)</span>
                  <span className="text-[11px] text-on-surface-variant font-mono">TS-09-UB-4421 • Tata Signa 2823</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-lg">
                  E-Way #EW-882190-TS
                </span>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-surface-tint transition"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  Call Driver
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Settlement Breakdown (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-xl bg-surface-container-low p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-headline font-bold text-on-surface">Escrow Disbursement Breakdown</h3>
              <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold">Verified Net</span>
            </div>

            <div className="flex flex-col divide-y divide-outline-variant/20 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-on-surface-variant">Gross AgroCorp Contract (150 Qtl @ ₹2,480)</span>
                <span className="font-bold text-on-surface font-mono">₹3,72,000.00</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-on-surface-variant">Weighbridge Bonus (+60 kg Net Gain)</span>
                <span className="font-bold text-primary font-mono">+₹1,488.00</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-on-surface-variant">Buyer-Sponsored Freight (Subsidized)</span>
                <span className="font-semibold text-on-surface-variant font-mono">₹0.00</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-on-surface-variant">Mandi User Cess (0.2% APMC Portal)</span>
                <span className="font-mono text-outline">-₹24.00</span>
              </div>
              <div className="pt-3 pb-1 flex items-center justify-between text-sm">
                <span className="font-bold text-on-surface font-headline">Net Farmer Bank Payout</span>
                <span className="font-bold text-primary text-base font-mono">₹3,73,464.00</span>
              </div>
            </div>

            {/* Dual Authorization Release Box */}
            <div className="p-4 rounded-xl bg-surface-container flex flex-col gap-3 mt-2 border border-outline-variant/30">
              <span className="text-xs font-bold text-on-surface">Dual-Authorization Gate Release</span>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Both Farmer and AgroCorp receiving officer approve final weighbridge tally. Confirming now marks digital acceptance.
              </p>
              <button
                type="button"
                onClick={() => {
                  setDualSigConfirmed(true);
                  setActionSuccess("Dual-Authorization signed. RBI T+0 RTGS settlement queued for mill gate-in.");
                }}
                disabled={dualSigConfirmed}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                  dualSigConfirmed
                    ? "bg-primary-fixed text-on-primary-fixed-variant cursor-default"
                    : "bg-primary text-on-primary hover:bg-surface-tint"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {dualSigConfirmed ? "check_circle" : "fingerprint"}
                </span>
                {dualSigConfirmed ? "Farmer Authorization Registered" : "Sign Dual-Key Release (Farmer Side)"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dispute Modal */}
      {disputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-xl border border-outline-variant flex flex-col gap-4">
            <div className="flex items-center gap-2 text-error">
              <span className="material-symbols-outlined">warning</span>
              <h3 className="font-headline font-bold text-base text-on-surface">Place Formal Escrow Hold?</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Filing a dispute hold will immediately freeze ₹3,73,464 in the ICICI Escrow Vault. An authorized Mandi Nodal Officer will be assigned to review weighbridge calibration tickets and mill inbound moisture logs.
            </p>
            <div className="flex gap-3 justify-end mt-2">
              <button
                type="button"
                onClick={() => setDisputeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-surface-container hover:bg-surface-container-high text-on-surface"
              >
                Cancel
              </button>
              <Link
                to="/disputes"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-error text-on-error hover:bg-error/90 flex items-center gap-1.5"
              >
                Proceed to Dispute Shield →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
