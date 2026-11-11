import { useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function LogisticsTelemetrySheet() {
  const { lot_id, lotId } = useParams();
  const activeLotId = lot_id || lotId || "FP-2024-884";

  const [voicePingSent, setVoicePingSent] = useState(false);
  const [qcApproved, setQcApproved] = useState(false);
  const [recenterSpin, setRecenterSpin] = useState(false);

  function triggerVoicePing() {
    setVoicePingSent(true);
    setTimeout(() => setVoicePingSent(false), 4000);
  }

  function handleRecenter() {
    setRecenterSpin(true);
    setTimeout(() => setRecenterSpin(false), 500);
  }

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen py-6 px-4 max-w-2xl mx-auto flex flex-col gap-4">
      {/* Top Mobile Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <Link
            to="/orders"
            aria-label="Back"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface transition"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-base font-headline font-bold text-on-surface">Transit & Weighbridge Telemetry</h1>
            <p className="text-[11px] text-on-surface-variant font-mono">Lot #{activeLotId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Live GPS Active
          </span>
        </div>
      </div>

      {/* Hero Escrow Card */}
      <div className="bg-surface-container rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-outline-variant/30">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">inventory_2</span>
            <span className="font-headline font-bold text-sm text-on-surface">Lot #{activeLotId}</span>
            <span className="text-xs text-on-surface-variant">· Sona Masoori</span>
          </div>
          <div className="flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span className="text-[11px] font-bold text-primary tracking-wide uppercase font-label">
              Tare Cleared (+60kg)
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-lg p-3.5 flex items-center justify-between shadow-sm border border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[22px]">verified_user</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider">
                ICICI SafeEscrow Locked
              </span>
              <span className="text-xl font-headline font-bold text-on-surface font-mono">
                ₹3,74,976.00
              </span>
            </div>
          </div>
          <div className="bg-secondary-container px-2.5 py-1 rounded-full text-on-secondary-container text-xs font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            <span>Guaranteed</span>
          </div>
        </div>
      </div>

      {/* GPS Transit Map Simulation */}
      <div className="relative w-full rounded-xl overflow-hidden bg-surface-container shadow-sm border border-outline-variant/30">
        <div className="relative w-full h-72 bg-gradient-to-br from-[#dbd7cf] to-[#c4c8bc] overflow-hidden flex flex-col justify-between p-4">
          {/* Top Map status */}
          <div className="flex items-center justify-between z-10">
            <div className="bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-bold text-on-surface">At Choutuppal Toll (NH 65)</span>
            </div>
            <button
              type="button"
              onClick={handleRecenter}
              aria-label="Re-center map"
              className={`w-8 h-8 rounded-full bg-surface/90 backdrop-blur-md text-on-surface flex items-center justify-center shadow-sm transition-transform duration-300 ${
                recenterSpin ? "rotate-180" : ""
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">my_location</span>
            </button>
          </div>

          {/* Truck simulation graphic */}
          <div className="flex flex-col items-center justify-center self-center z-10">
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-primary opacity-60"></span>
              <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              </div>
            </div>
            <div className="mt-1 bg-surface-container-lowest/90 text-on-surface px-2.5 py-0.5 rounded text-[10px] font-bold font-mono shadow">
              52 km/h • Smooth Transit
            </div>
          </div>

          {/* Bottom Telemetry Overlay */}
          <div className="grid grid-cols-3 gap-2 z-10">
            <div className="bg-surface/90 backdrop-blur-md p-2 rounded-lg text-center shadow-sm">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Remaining</span>
              <span className="text-xs font-bold text-on-surface font-mono">74.2 km</span>
            </div>
            <div className="bg-surface/90 backdrop-blur-md p-2 rounded-lg text-center shadow-sm">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Arrival ETA</span>
              <span className="text-xs font-bold text-primary font-mono">06:45 PM</span>
            </div>
            <div className="bg-surface/90 backdrop-blur-md p-2 rounded-lg text-center shadow-sm">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Moisture Risk</span>
              <span className="text-xs font-bold text-tertiary font-mono">0.0% (Dry)</span>
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div className="p-3.5 bg-surface-container flex items-center justify-between text-xs border-t border-outline-variant/30">
          <div className="flex items-center gap-2 truncate">
            <span className="material-symbols-outlined text-primary text-[18px]">trip_origin</span>
            <div className="truncate">
              <span className="font-bold text-on-surface">Bodhan Hub</span>
              <span className="text-on-surface-variant"> → AgroCorp Mill, Miryalaguda</span>
            </div>
          </div>
          <span className="text-on-surface-variant font-medium shrink-0 ml-2">186 km total</span>
        </div>
      </div>

      {/* Driver & Truck Details Card */}
      <div className="bg-surface-container rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-outline-variant/30">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-base font-headline">
              SY
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-headline font-bold text-sm text-on-surface">Suresh Yadav</h2>
                <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold px-1.5 py-0.5 rounded">
                  4.9 ★
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">Tata Signa 2823 · TS-09-UB-4421</p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-primary font-bold">
                <span className="material-symbols-outlined text-[14px]">lock_clock</span>
                <span>Covered Container (E-Way #882190)</span>
              </div>
            </div>
          </div>
          <span className="text-[11px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-bold">
            128 Trips
          </span>
        </div>

        {/* Driver action buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <a
            href="tel:+919848022134"
            className="h-11 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-2 hover:bg-surface-tint transition shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
            <span>Call Driver</span>
          </a>
          <button
            type="button"
            onClick={triggerVoicePing}
            className="h-11 rounded-xl bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-2 hover:bg-surface-container-highest transition"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">mic</span>
            <span>Voice Ping (AI)</span>
          </button>
        </div>

        {voicePingSent && (
          <div className="bg-surface-container-highest text-on-surface text-xs p-3 rounded-lg flex items-center gap-2 border border-outline-variant/40 animate-fade-in">
            <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
            <span>Voice advisory dispatched in Telugu & Hindi to truck cabin audio unit.</span>
          </div>
        )}
      </div>

      {/* Weighbridge Tare & Gross Audit Slip */}
      <div className="bg-surface-container-low rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">scale</span>
            <h3 className="font-headline font-bold text-sm text-on-surface">Weighbridge Electronic Slip</h3>
          </div>
          <span className="text-[11px] font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
            Ticket #WB-9042
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-surface-container-lowest">
            <span className="text-[10px] text-on-surface-variant block uppercase font-bold">Gross Laden Weight</span>
            <span className="text-sm font-bold text-on-surface font-mono">22,480 kg</span>
          </div>
          <div className="p-3 rounded-lg bg-surface-container-lowest">
            <span className="text-[10px] text-on-surface-variant block uppercase font-bold">Tare (Empty Truck)</span>
            <span className="text-sm font-bold text-on-surface font-mono">7,420 kg</span>
          </div>
          <div className="p-3 rounded-lg bg-surface-container-lowest">
            <span className="text-[10px] text-on-surface-variant block uppercase font-bold">Net Produce Weight</span>
            <span className="text-sm font-bold text-primary font-mono">15,060 kg</span>
          </div>
          <div className="p-3 rounded-lg bg-surface-container-lowest">
            <span className="text-[10px] text-on-surface-variant block uppercase font-bold">Moisture Content</span>
            <span className="text-sm font-bold text-tertiary font-mono">13.5% (Safe)</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-primary/10 text-primary text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>Weighbridge verified: +60 kg yield gain credited to farmer payout.</span>
        </div>

        {/* Approval action */}
        <button
          type="button"
          onClick={() => setQcApproved(true)}
          disabled={qcApproved}
          className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
            qcApproved
              ? "bg-primary-fixed text-on-primary-fixed-variant"
              : "bg-primary text-on-primary hover:bg-surface-tint"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {qcApproved ? "task_alt" : "done_all"}
          </span>
          {qcApproved ? "Mill Inbound Acknowledged" : "Confirm Weighbridge Acknowledgment"}
        </button>
      </div>
    </div>
  );
}
