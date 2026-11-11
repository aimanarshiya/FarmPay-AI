import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function WebhookResilienceConsole() {
  const [retryTimer, setRetryTimer] = useState(42);
  const [rawLogsVisible, setRawLogsVisible] = useState(false);
  const [replaySuccess, setReplaySuccess] = useState("");
  const [refundExecuted, setRefundExecuted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setRetryTimer((prev) => (prev > 0 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function handleReplay() {
    setReplaySuccess("Simulated Webhook TLS 1.3 Replay dispatched. Ingress signature HMAC verified.");
    setTimeout(() => setReplaySuccess(""), 4500);
  }

  function handleRefund() {
    setRefundExecuted(true);
    setReplaySuccess("Bilateral Mandi Statutory Escrow Reversal executed. Refund transaction ID #REF-8841-TS logged.");
  }

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen py-8 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Top Command Bar & Status Ribbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 pt-2 border-b border-outline-variant/30 mb-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Link to="/" className="text-xs text-on-surface-variant hover:text-primary font-bold mr-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">arrow_back</span> Home
            </Link>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-error-container text-on-error-container">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
              Fault Injected: HTTP 504 Timeout
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-tertiary-fixed text-on-tertiary-fixed">
              <span className="material-symbols-outlined text-sm">shield</span>
              Quarantine Layer Active
            </span>
            <span className="text-xs text-on-surface-variant hidden md:inline-flex">
              PayPal Sandbox v2.14 • Escrow Multi-Sig v3.8
            </span>
          </div>
          <h1 className="font-headline text-2xl lg:text-3xl font-bold tracking-tight text-on-surface">
            PayPal Webhook Telemetry & Dispute Escrow Refund Studio
          </h1>
          <p className="text-sm text-on-surface-variant max-w-4xl mt-1 leading-relaxed">
            Asynchronous event recovery, SHA-256 HMAC signature verification diagnostics, and bilateral APMC statutory reversal console for <strong className="text-on-surface font-semibold">Lot #FP-2024-884 (Sona Masoori)</strong>.
          </p>
        </div>

        {/* Global Sandbox Actions */}
        <div className="flex items-center gap-2.5 self-start lg:self-center flex-wrap">
          <button
            type="button"
            onClick={() => setRawLogsVisible(!rawLogsVisible)}
            className="px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-xs font-semibold text-on-surface transition flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm text-primary">terminal</span>
            <span>{rawLogsVisible ? "Hide Raw DLQ Logs" : "Toggle Raw DLQ Logs"}</span>
          </button>
          <button
            type="button"
            onClick={handleReplay}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-surface-tint text-on-primary text-xs font-bold transition shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            <span>Replay Webhook (TLS 1.3)</span>
          </button>
        </div>
      </div>

      {replaySuccess && (
        <div className="p-3 mb-6 rounded-xl bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold flex items-center justify-between shadow-sm">
          <span>{replaySuccess}</span>
          <button type="button" onClick={() => setReplaySuccess("")} className="text-primary hover:underline">Dismiss</button>
        </div>
      )}

      {/* Telemetry Metrics Bento Ribbon */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {/* Card 1 */}
        <div className="bg-surface-container rounded-xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-error">Simulated Webhook Ingress</span>
              <div className="font-headline text-lg font-bold text-on-surface mt-1">
                504 Gateway Timeout
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-error-container text-on-error-container flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">cloud_off</span>
            </div>
          </div>
          <div className="mt-4 pt-3 bg-surface-container-low rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
              <span className="text-xs font-medium text-on-surface">Auto-Retry #3 in</span>
            </div>
            <span className="font-headline text-sm font-bold text-error font-mono">{retryTimer}s</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container rounded-xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Escrow Vault In Quarantine</span>
              <div className="font-headline text-lg font-bold text-on-surface mt-1 font-mono">
                $4,746.70 <span className="text-xs font-normal text-on-surface-variant">(₹3,74,976)</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">lock_clock</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Lot #FP-2024-884 • 150 Qtl Rice</span>
            <span className="font-bold text-tertiary">Multi-Sig Locked</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container rounded-xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Idempotency Guard Engine</span>
              <div className="font-headline text-lg font-bold text-on-surface mt-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                <span>ACTIVE: Zero-Debit</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">fingerprint</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <code className="text-[10px] text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded truncate max-w-[170px]">
              idemp-884-99410-sec
            </code>
            <span className="text-primary font-bold">100% Guarded</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container rounded-xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-tertiary">Statutory APMC Docket</span>
              <div className="font-headline text-lg font-bold text-on-surface mt-1">
                Case #ARB-2024-041
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">gavel</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Mandi Nodal Court Hub 04</span>
            <span className="px-2 py-0.5 rounded bg-tertiary-container text-on-tertiary-container font-semibold text-[10px]">
              Rescission Order
            </span>
          </div>
        </div>
      </section>

      {/* Raw DLQ Logs Drawer */}
      {rawLogsVisible && (
        <div className="mb-8 p-5 rounded-2xl bg-surface-container-highest font-mono text-xs text-on-surface border border-outline-variant/50 shadow-inner">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40 mb-3">
            <span className="font-bold text-error flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">terminal</span>
              DEAD LETTER QUEUE (DLQ) EVENT TRACE #DLQ-WH-981249
            </span>
            <span className="text-[10px] text-on-surface-variant">Payload Size: 1.42 KB • TLS 1.3 AES_256_GCM</span>
          </div>
          <pre className="overflow-x-auto text-[11px] leading-relaxed text-on-surface-variant">
{`{
  "id": "WH-981249-PAYPAL-V2",
  "event_version": "2.0",
  "create_time": "2024-10-24T14:48:19Z",
  "resource_type": "dispute_refund",
  "event_type": "CUSTOMER.DISPUTE.RESOLVED",
  "summary": "APMC Mandi Arbitration Ruling: Full Escrow Rescission executed for Lot #FP-2024-884",
  "resource": {
    "dispute_id": "ARB-2024-041",
    "order_id": "ORD-8841-902",
    "amount": { "value": "4746.70", "currency_code": "USD" },
    "inr_equivalent": "374976.00",
    "idempotency_key": "idemp-884-99410-sec",
    "signature_verification": "SUCCESS_SHA256_HMAC",
    "status": "HELD_IN_QUARANTINE"
  }
}`}
          </pre>
        </div>
      )}

      {/* Asynchronous Event Delivery & Backoff Pipeline */}
      <section className="mb-8 rounded-2xl bg-surface-container-low p-6 shadow-sm border border-outline-variant/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-outline-variant/20 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-surface-container-high text-on-surface-variant">
                Pipeline Trace
              </span>
              <span className="text-xs font-bold text-tertiary font-mono">Event: WH-981249-PAYPAL-V2</span>
            </div>
            <h2 className="font-headline text-xl font-bold text-on-surface mt-1">
              Asynchronous Event Delivery & Backoff Pipeline
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Completed</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-error"></span> Ingress Drop</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span> Scheduled Backoff</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
            <span className="text-[10px] font-bold text-primary block uppercase">Stage 1</span>
            <span className="font-bold text-xs text-on-surface mt-0.5 block">PayPal Ingress</span>
            <p className="text-[11px] text-on-surface-variant mt-1.5 leading-snug">
              Encrypted webhook received over TLS 1.3.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-primary">
              <span className="material-symbols-outlined text-[14px]">done</span> ACK Received
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
            <span className="text-[10px] font-bold text-primary block uppercase">Stage 2</span>
            <span className="font-bold text-xs text-on-surface mt-0.5 block">HMAC Signature</span>
            <p className="text-[11px] text-on-surface-variant mt-1.5 leading-snug">
              SHA-256 cert validated against PayPal root CA.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-primary">
              <span className="material-symbols-outlined text-[14px]">verified</span> Validated
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
            <span className="text-[10px] font-bold text-primary block uppercase">Stage 3</span>
            <span className="font-bold text-xs text-on-surface mt-0.5 block">Idempotency Lock</span>
            <p className="text-[11px] text-on-surface-variant mt-1.5 leading-snug">
              Redis / MySQL unique key matched; replay guarded.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-primary">
              <span className="material-symbols-outlined text-[14px]">lock</span> Zero-Double-Debit
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-highest border border-error/30 ring-1 ring-error/40">
            <span className="text-[10px] font-bold text-error block uppercase">Stage 4 (Quarantined)</span>
            <span className="font-bold text-xs text-on-surface mt-0.5 block">Gateway Timeout</span>
            <p className="text-[11px] text-on-surface-variant mt-1.5 leading-snug">
              Downstream bank node delayed; backoff queued.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-error">
              <span className="material-symbols-outlined text-[14px]">sync</span> Retry #{retryTimer > 0 ? "2" : "3"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
            <span className="text-[10px] font-bold text-tertiary block uppercase">Stage 5</span>
            <span className="font-bold text-xs text-on-surface mt-0.5 block">Statutory Reversal</span>
            <p className="text-[11px] text-on-surface-variant mt-1.5 leading-snug">
              Dispute arbitration split released to escrow parties.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-tertiary">
              <span className="material-symbols-outlined text-[14px]">pending</span> Pending Exec
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-6 pt-4 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-on-surface-variant">
            Authorized Nodal Officers can manually force execution of APMC Dispute Resolution #ARB-2024-041.
          </span>
          <button
            type="button"
            onClick={handleRefund}
            disabled={refundExecuted}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              refundExecuted
                ? "bg-primary-fixed text-on-primary-fixed-variant cursor-default"
                : "bg-primary text-on-primary hover:bg-surface-tint shadow-sm"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {refundExecuted ? "check_circle" : "assignment_return"}
            </span>
            {refundExecuted ? "Statutory Escrow Reversal Executed" : "Execute Formal Dispute Refund Reversal"}
          </button>
        </div>
      </section>
    </div>
  );
}
