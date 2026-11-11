import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchOrders } from "../api/orders";

export default function PaymentsCenter() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("modal"); // 'modal' or 'console'
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureStatus, setCaptureStatus] = useState("READY_TO_AUTHORIZE");
  const [toastMessage, setToastMessage] = useState(null);
  const [liveOrders, setLiveOrders] = useState([]);

  useEffect(() => {
    // Attempt to load any live MySQL orders to merge with ledger
    fetchOrders({ limit: 10, offset: 0 })
      .then((res) => {
        if (res && res.orders) {
          setLiveOrders(res.orders);
        }
      })
      .catch(() => {
        // Fall back to prototype ledger
      });
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const executeSandboxCapture = () => {
    setIsCapturing(true);
    setCaptureStatus("CAPTURING_HOLD...");
    setTimeout(() => {
      setIsCapturing(false);
      setCaptureStatus("PAYMENT_CAPTURED_ESCROW_LOCKED");
      showToast("PayPal Sandbox Hold Captured successfully! Escrow vault locked.");
    }, 1200);
  };

  const sampleLedger = [
    {
      id: "FP-ORD-884-2024",
      lot: "Lot #FP-2024-884",
      captureId: "CAP-8841-9920-SANDBOX",
      authId: "9XP40288SL710294J",
      crop: "Sona Masoori Paddy",
      spec: "150 Qtl (Grade A+)",
      buyer: "AgroCorp Processing Mills",
      farmer: "Rajesh Patel (Nizamabad)",
      usdAmount: "$4,746.70 USD",
      inrAmount: "₹3,74,976 INR Net",
      status: "completed",
      statusLabel: "Payment Completed & Escrow Vaulted",
      date: "28 Oct 2024, 02:40 PM IST",
      badgeColor: "bg-primary-fixed text-on-primary-fixed-variant",
    },
    {
      id: "FP-ORD-882-2024",
      lot: "Lot #FP-2024-882",
      captureId: "CAP-8820-4100-SANDBOX",
      authId: "7YK19384LK8812",
      crop: "Sharbati Wheat",
      spec: "100 Qtl (Premium)",
      buyer: "Kaveri Agri Trading Co.",
      farmer: "Devendra Sharma (MP)",
      usdAmount: "$3,120.00 USD",
      inrAmount: "₹2,46,480 INR Net",
      status: "processing",
      statusLabel: "Awaiting Mandi Weight Gate",
      date: "28 Oct 2024, 11:15 AM IST",
      badgeColor: "bg-secondary-container text-on-secondary-container",
    },
    {
      id: "FP-ORD-879-2024",
      lot: "Lot #FP-2024-879",
      captureId: "CAP-7711-2094-SANDBOX",
      authId: "4AA82910GG0012",
      crop: "Organic Salem Turmeric",
      spec: "40 Qtl (Curcumin 5.2%)",
      buyer: "Guntur Spices Exporters",
      farmer: "Lakshmi Narayana (AP)",
      usdAmount: "$1,850.00 USD",
      inrAmount: "₹1,46,150 INR Net",
      status: "completed",
      statusLabel: "Payment Completed & Disbursed",
      date: "27 Oct 2024, 04:22 PM IST",
      badgeColor: "bg-primary-fixed text-on-primary-fixed-variant",
    },
    {
      id: "FP-ORD-875-2024",
      lot: "Lot #FP-2024-875",
      captureId: "EXPIRED_AUTH_TOKEN",
      authId: "TTL 30m Passed",
      crop: "Yellow Soybean",
      spec: "80 Qtl (Standard)",
      buyer: "Venkateshwara Feeds",
      farmer: "Santosh More (Latur)",
      usdAmount: "$2,400.00 USD",
      inrAmount: "Cancelled (Buyer Timeout)",
      status: "cancelled",
      statusLabel: "Authorization Voided",
      date: "26 Oct 2024, 09:12 AM IST",
      badgeColor: "bg-error-container text-on-error-container",
    },
  ];

  const formattedLiveOrders = (liveOrders || []).map((o) => ({
    id: o.order_id || `ORD-${o.id}`,
    lot: `Lot #${o.order_id || o.id}`,
    captureId: o.paypal_capture_id || (o.payment_status === "PAID" ? "CAP-LIVE-SANDBOX" : "PENDING_CAPTURE"),
    authId: o.paypal_order_id || "AUTH-GATEWAY-INIT",
    crop: o.crop_name || o.crop || "Agricultural Produce",
    spec: `${o.quantity_kg ? (o.quantity_kg / 100).toFixed(0) : "100"} Qtl`,
    buyer: o.buyer_name || "Mandi Registered Buyer",
    farmer: o.farmer_name || "Registered Farmer",
    usdAmount: o.paypal_amount_usd ? `$${Number(o.paypal_amount_usd).toFixed(2)} USD` : "$1.00 USD",
    inrAmount: o.total_amount ? `₹${Number(o.total_amount).toLocaleString("en-IN")} INR` : "₹0 INR",
    status: (o.payment_status || "PENDING").toLowerCase(),
    statusLabel: o.payment_status === "PAID" ? "Payment Completed & Escrow Vaulted" : `Status: ${o.status || o.payment_status || "PENDING"}`,
    date: o.created_at ? new Date(o.created_at).toLocaleString("en-IN") : "Recent",
    badgeColor: o.payment_status === "PAID" ? "bg-primary-fixed text-on-primary-fixed-variant" : "bg-secondary-container text-on-secondary-container",
  }));

  const allLedgerItems = [...formattedLiveOrders, ...sampleLedger];

  const filteredLedger = allLedgerItems.filter((item) => {
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    const matchSearch =
      searchQuery === "" ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.captureId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.buyer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="w-full min-h-screen bg-surface font-body text-on-surface py-6 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs sm:text-sm font-medium animate-bounce">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Sandbox Environment Flag */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-tertiary-fixed/30 mb-6 border border-tertiary/20">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-tertiary"></span>
          </span>
          <div className="flex items-center gap-2 text-xs font-semibold text-on-tertiary-container tracking-wide">
            <span className="uppercase tracking-widest text-[11px] font-bold text-tertiary">Environment Flag:</span>
            <span>PayPal Sandbox Gateway v2.1 • Multi-Party Agricultural Test Execution Mode</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-surface-container text-xs font-mono font-bold text-on-surface-variant">
            API: v2/checkout/orders
          </span>
          <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">format_image_left</span>
            Node-JS HMAC SHA-256 Active
          </span>
        </div>
      </div>

      {/* Header & Strategic Context */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 mb-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-tertiary uppercase tracking-wider mb-2">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span>Institutional Settlement Console</span>
            <span>/</span>
            <span className="text-primary">Payments Center & PayPal Sandbox (Screen 13)</span>
          </div>
          <h1 className="font-headline text-3xl lg:text-4xl font-bold text-on-surface tracking-tight leading-tight">
            Secure Digital Payments with PayPal — FarmPay Escrow Hub
          </h1>
          <p className="text-sm lg:text-base text-on-surface-variant font-body mt-2 leading-relaxed">
            End-to-end cryptographic escrow authorization, server-side PayPal Sandbox capture, and instant dual-party settlement ledger synced to APMC mandis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("receiptPreviewCard");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface flex items-center gap-2 transition-all border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[16px] text-tertiary">receipt_long</span>
            Latest Sandbox Slip
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("console");
              showToast("Simulated webhook payload test re-triggered.");
            }}
            className="px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 flex items-center gap-2 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            Re-trigger Webhook Test
          </button>
        </div>
      </div>

      {/* Key Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/20 shadow-sm">
          <div className="flex items-center justify-between text-xs text-on-surface-variant font-semibold">
            <span>Total Sandbox Volume</span>
            <span className="material-symbols-outlined text-primary text-[18px]">account_balance_wallet</span>
          </div>
          <div className="mt-3">
            <div className="font-headline text-2xl font-bold text-on-surface">$4,680.00</div>
            <div className="text-[11px] text-tertiary font-bold tracking-tight mt-0.5">₹3,74,976 Eqv. Settled in Mandi Ledger</div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/20 shadow-sm">
          <div className="flex items-center justify-between text-xs text-on-surface-variant font-semibold">
            <span>Active Escrow Holds</span>
            <span className="material-symbols-outlined text-tertiary text-[18px]">lock_clock</span>
          </div>
          <div className="mt-3">
            <div className="font-headline text-2xl font-bold text-on-surface">1 Live Lot</div>
            <div className="text-[11px] text-on-surface-variant font-medium mt-0.5">Lot #FP-2024-884 (150 Qtl Sona Masoori)</div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/20 shadow-sm">
          <div className="flex items-center justify-between text-xs text-on-surface-variant font-semibold">
            <span>Capture Success Rate</span>
            <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
          </div>
          <div className="mt-3">
            <div className="font-headline text-2xl font-bold text-on-surface">99.8%</div>
            <div className="text-[11px] text-primary font-bold mt-0.5">Simulated Server-Side Webhook Capture</div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/20 shadow-sm">
          <div className="flex items-center justify-between text-xs text-on-surface-variant font-semibold">
            <span>Settlement Velocity</span>
            <span className="material-symbols-outlined text-secondary text-[18px]">bolt</span>
          </div>
          <div className="mt-3">
            <div className="font-headline text-2xl font-bold text-on-surface">Instantaneous</div>
            <div className="text-[11px] text-on-surface-variant font-medium mt-0.5">T+0 Dual-Party Sandbox Release Window</div>
          </div>
        </div>
      </div>

      {/* End-to-End Cryptographic Escrow Topology */}
      <div className="mb-10 p-6 rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6">
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-tertiary">Cryptographic Architecture</span>
            <h2 className="font-headline text-xl font-bold text-on-surface mt-0.5">PayPal Sandbox & FarmPay Dual-Escrow Topology</h2>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary-fixed text-on-primary-fixed-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse"></span>
            Live Synchronized Flow
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-lg bg-surface flex flex-col justify-between border border-outline-variant/20 shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-outline uppercase font-mono">01 / Consensus</span>
                <span className="material-symbols-outlined text-primary text-[18px]">handshake</span>
              </div>
              <h3 className="text-xs font-bold text-on-surface leading-snug">Buyer Accepts Offer</h3>
              <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">FairBid agreement finalized with dynamic APMC price lock.</p>
            </div>
            <div className="mt-3 pt-2 text-[10px] font-semibold text-secondary flex items-center gap-1 border-t border-outline-variant/10">
              <span className="w-1 h-1 rounded-full bg-primary"></span> Lot Confirmed
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface flex flex-col justify-between border border-outline-variant/20 shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-outline uppercase font-mono">02 / Ledger Order</span>
                <span className="material-symbols-outlined text-primary text-[18px]">receipt</span>
              </div>
              <h3 className="text-xs font-bold text-on-surface leading-snug">FarmPay Order Initialized</h3>
              <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">Order #FP-ORD-884-2024 generated with digital crop passport link.</p>
            </div>
            <div className="mt-3 pt-2 text-[10px] font-semibold text-secondary flex items-center gap-1 border-t border-outline-variant/10">
              <span className="w-1 h-1 rounded-full bg-primary"></span> Payload Bundled
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface flex flex-col justify-between border border-outline-variant/20 shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-outline uppercase font-mono">03 / PayPal API</span>
                <span className="material-symbols-outlined text-tertiary text-[18px]">cloud_sync</span>
              </div>
              <h3 className="text-xs font-bold text-on-surface leading-snug">POST /v2/checkout/orders</h3>
              <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">FarmPay relays metadata, mandi cess, and escrow constraints to Sandbox.</p>
            </div>
            <div className="mt-3 pt-2 text-[10px] font-semibold text-secondary flex items-center gap-1 border-t border-outline-variant/10">
              <span className="w-1 h-1 rounded-full bg-tertiary"></span> Order Token Issued
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface flex flex-col justify-between border border-outline-variant/20 shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-outline uppercase font-mono">04 / Auth Modal</span>
                <span className="material-symbols-outlined text-tertiary text-[18px]">verified_user</span>
              </div>
              <h3 className="text-xs font-bold text-on-surface leading-snug">Buyer Authorizes</h3>
              <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">Multi-factor authorization executed via buyer test balance in Sandbox.</p>
            </div>
            <div className="mt-3 pt-2 text-[10px] font-semibold text-secondary flex items-center gap-1 border-t border-outline-variant/10">
              <span className="w-1 h-1 rounded-full bg-primary"></span> Token Approved
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-primary/10 flex flex-col justify-between border border-primary/30 shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-primary uppercase font-mono">05 / Capture Engine</span>
                <span className="material-symbols-outlined text-primary text-[20px] animate-pulse">lock_reset</span>
              </div>
              <h3 className="text-xs font-bold text-on-surface leading-snug">Server Capture & Webhook</h3>
              <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">Backend captures funds; validates SHA-256 HMAC signature.</p>
            </div>
            <div className="mt-3 pt-2 text-[10px] font-bold text-primary flex items-center gap-1.5 border-t border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              <span>CHECKOUT.ORDER.APPROVED</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface flex flex-col justify-between border border-outline-variant/20 shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-outline uppercase font-mono">06 / Settlement</span>
                <span className="material-symbols-outlined text-primary text-[18px]">inventory</span>
              </div>
              <h3 className="text-xs font-bold text-on-surface leading-snug">Escrow Locked & Synced</h3>
              <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">Farmer wallet displays vaulted funds; release triggered upon tare weighbridge.</p>
            </div>
            <div className="mt-3 pt-2 text-[10px] font-semibold text-secondary flex items-center gap-1 border-t border-outline-variant/10">
              <span className="w-1 h-1 rounded-full bg-primary"></span> Ledgers Locked
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Buyer Checkout Experience (Split Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Left: Order Breakdown & Checkout Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-6 rounded-xl bg-surface-container shadow-sm border border-outline-variant/30">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-fixed/60 flex items-center justify-center text-on-primary-fixed-variant">
                  <span className="material-symbols-outlined text-[22px]">shopping_cart_checkout</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">Active Transaction Order</span>
                  <h3 className="font-headline text-lg font-bold text-on-surface">Lot #FP-2024-884</h3>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-bold text-[11px]">
                Ready to Authorize
              </span>
            </div>

            {/* Crop Spec Sheet */}
            <div className="p-4 rounded-xl bg-surface-container-low my-4 flex flex-col gap-2.5 text-xs border border-outline-variant/20">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Commodity:</span>
                <span className="font-bold text-on-surface">Sona Masoori Paddy (Grade A+)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Quantity:</span>
                <span className="font-bold text-on-surface">150 Quintals (15.0 Metric Tonnes)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Farmer Producer:</span>
                <span className="font-bold text-on-surface">Rajesh Patel • Nizamabad Kisan FPO</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Procuring Buyer:</span>
                <span className="font-bold text-on-surface">AgroCorp Processing Mills Pvt Ltd</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Agreed Unit Rate:</span>
                <span className="font-bold text-on-surface">₹2,520 / Qtl ($31.50 USD / Qtl)</span>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="flex flex-col gap-2 pb-4 text-xs font-medium">
              <div className="flex justify-between text-on-surface-variant">
                <span>Crop Baseline Subtotal (150 Qtl × $31.50)</span>
                <span className="text-on-surface font-semibold">$4,725.00</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span className="flex items-center gap-1">
                  Mandi Subsidized Freight
                  <span className="text-[10px] text-primary font-bold">(APMC Rebate)</span>
                </span>
                <span className="text-primary font-semibold">-$35.00</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span className="flex items-center gap-1">
                  FarmPay Escrow Protection Fee
                  <span className="text-[10px] text-tertiary font-bold">(1.2%)</span>
                </span>
                <span className="text-on-surface font-semibold">+$56.70</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Telangana Mandi User Cess & Weigh Charges</span>
                <span className="text-on-surface font-semibold">$0.00 (Waived Sandbox)</span>
              </div>
            </div>

            {/* Total Box */}
            <div className="p-4 rounded-xl bg-surface-container-high flex items-center justify-between mb-6 border border-outline-variant/30">
              <div>
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Total Payable Escrow</span>
                <div className="text-[11px] text-secondary">₹3,78,000 INR Baseline Equiv</div>
              </div>
              <div className="text-right">
                <span className="font-headline text-2xl font-bold text-on-surface">$4,746.70</span>
                <span className="block text-[10px] font-bold text-tertiary">USD (Sandbox Currency)</span>
              </div>
            </div>

            {/* Branded PayPal Button */}
            <div className="flex flex-col gap-3">
              <div className="text-[11px] text-center text-on-surface-variant flex items-center justify-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-primary text-[14px]">lock</span>
                256-Bit Encrypted Multi-Party Escrow Handshake
              </div>

              <button
                type="button"
                onClick={executeSandboxCapture}
                disabled={isCapturing}
                className="w-full py-3.5 px-6 rounded-xl bg-[#ffc439] hover:bg-[#f2ba32] text-[#003087] font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.99] shadow-sm cursor-pointer"
              >
                <span className="font-headline font-bold text-lg italic text-[#003087]">P</span>
                <span className="text-[#003087] font-extrabold text-sm ml-1 tracking-tight">
                  {isCapturing ? "Processing Sandbox Hold..." : "Checkout with PayPal Sandbox"}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    showToast("Simulating $1.00 USD PayPal Sandbox Verification payment...");
                    navigate("/orders/FP-2024-884/escrow");
                  }}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Or Test $1.00 USD Sandbox Micro-Transaction →
                </button>
              </div>

              <p className="text-center text-[10px] text-on-surface-variant">
                By clicking Checkout, you simulate funding to the FarmPay multi-signature vault.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low flex items-start gap-3 border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">verified_user</span>
            <div className="flex flex-col text-xs text-on-surface-variant leading-relaxed">
              <span className="font-bold text-on-surface mb-0.5">APMC & PayPal Sandbox Safeguard</span>
              Farmer Rajesh Patel cannot withdraw funds until physical tare weighbridge slip #NIZ-WB-884 is cryptographically signed at Nizamabad Mandi gate.
            </div>
          </div>
        </div>

        {/* Right: Realistic PayPal Checkout Popup Mockup / Live Webhook Console */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="rounded-xl bg-surface-container p-6 shadow-sm border border-outline-variant/30 flex flex-col h-full">
            <div className="flex items-center justify-between pb-5 border-b border-outline-variant/20 mb-4">
              <div className="inline-flex p-1 rounded-xl bg-surface-container-high">
                <button
                  type="button"
                  onClick={() => setActiveTab("modal")}
                  className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${activeTab === "modal"
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                    }`}
                >
                  <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                  Interactive Sandbox Window
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("console")}
                  className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${activeTab === "console"
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                    }`}
                >
                  <span className="material-symbols-outlined text-[15px]">terminal</span>
                  Live Webhook Logs (Node.js)
                </button>
              </div>
              <span className="text-[11px] font-mono text-on-surface-variant">
                Status: <span className="text-primary font-bold">{captureStatus}</span>
              </span>
            </div>

            {/* TAB A: Interactive Sandbox Window */}
            {activeTab === "modal" ? (
              <div className="flex flex-col flex-1">
                <div className="rounded-t-xl bg-[#002f86] px-4 py-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
                    <span className="ml-2 font-mono text-[11px] opacity-80 truncate max-w-[280px]">
                      sandbox.paypal.com/checkoutnow?token=EC-884902194
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold bg-white/10 px-2 py-0.5 rounded">
                    <span className="material-symbols-outlined text-[13px]">lock</span>
                    PayPal Sandbox SSL
                  </div>
                </div>

                <div className="p-6 rounded-b-xl bg-surface-container-lowest flex flex-col justify-between flex-1 border-x border-b border-outline-variant/30">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#003087] flex items-center justify-center text-white font-bold text-xs">P</div>
                        <div>
                          <div className="text-xs font-bold text-on-surface">AgroCorp Processing Mills Pvt Ltd</div>
                          <div className="text-[11px] font-mono text-on-surface-variant">agrocorp-buyer@sandbox.farmpay.ai</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Pay With</span>
                        <span className="block text-xs font-bold text-primary">PayPal Sandbox Balance</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between border border-outline-variant/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 rounded bg-surface-container-high flex items-center justify-center font-bold text-[10px] text-tertiary">
                          VISA
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-on-surface">Chase Institutional Checking •••• 4892</span>
                          <span className="text-[10px] text-on-surface-variant">Backup: Business Credit Balance ($42,000.00 USD)</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-primary text-[18px]">radio_button_checked</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-1 text-xs border border-outline-variant/20">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Delivery Vault Destination</span>
                      <span className="font-bold text-on-surface">Nizamabad Central Warehouse & Cold Storage, Shed #04</span>
                      <span className="text-on-surface-variant text-[11px]">Consignment Gate: Tare Scale 02 (Telangana State Mandi Registry)</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-surface-container-high/60 flex items-center justify-between text-xs border border-outline-variant/20">
                      <div>
                        <span className="font-bold text-on-surface">FarmPay Escrow Contract</span>
                        <span className="block text-[11px] text-on-surface-variant">Order #FP-ORD-884-2024 (150 Qtl Paddy)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-on-surface">$4,746.70 USD</span>
                        <span className="block text-[10px] text-primary">Instant Sandbox Hold</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 flex flex-col gap-2 border-t border-outline-variant/20">
                    <button
                      type="button"
                      disabled={isCapturing}
                      onClick={executeSandboxCapture}
                      className="w-full py-3 rounded-xl bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">task_alt</span>
                      <span>{isCapturing ? "Capturing Sandbox Hold..." : "Complete Purchase (Capture Sandbox Hold)"}</span>
                    </button>
                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant px-1">
                      <span>Test Gateway: <strong>US-EAST-SANDBOX-CLUSTER</strong></span>
                      <span className="text-tertiary font-medium">Cancel and return to FarmPay</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* TAB B: Live Webhook & Terminal Console */
              <div className="flex flex-col flex-1">
                <div className="p-4 rounded-xl bg-inverse-surface text-inverse-on-surface font-mono text-xs flex-1 flex flex-col justify-between overflow-x-auto min-h-[380px]">
                  <div>
                    <div className="flex items-center justify-between pb-3 text-[11px] text-secondary-fixed-dim border-b border-white/10 mb-3">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        fastapi / paypal-webhook-listener:8000
                      </span>
                      <span>SHA-256 HMAC VALID</span>
                    </div>
                    <div className="space-y-2 text-[11px] text-on-primary-container leading-relaxed">
                      <div className="text-surface-dim">[14:38:02 GMT+5:30] POST /api/payments/create-order HTTP/1.1 (Payload: 150 Qtl Paddy) =&gt; 201 Created</div>
                      <div className="text-surface-dim">[14:38:03 GMT+5:30] Generated PayPal Order ID: 9XP40288SL710294J</div>
                      <div className="text-tertiary-fixed">[14:39:15 GMT+5:30] Webhook Received: CHECKOUT.ORDER.APPROVED</div>
                      <div className="text-tertiary-fixed">[14:39:16 GMT+5:30] Verifying webhook signature against PayPal Sandbox Public Certificate... OK</div>
                      <div className="text-primary-fixed-dim font-bold">[14:40:12 GMT+5:30] Executing /api/payments/capture-order/9XP40288SL710294J... SUCCESS</div>
                      <div className="text-inverse-on-surface">[14:40:12 GMT+5:30] Capture ID: CAP-8841-9920-SANDBOX | Vault State: DUAL_LOCKED</div>
                      <div className="text-inverse-on-surface">[14:40:13 GMT+5:30] Dispatched Mandi Tare Webhook to Telangana APMC Ledger. Awaiting weighbridge.</div>
                    </div>
                  </div>
                  <div className="pt-4 flex items-center justify-between text-[10px] text-outline-variant border-t border-white/10 mt-3">
                    <span>Webhook Event ID: WH-3849102-SANDBOX-AUTH</span>
                    <button
                      type="button"
                      onClick={() => showToast("Log buffer refreshed.")}
                      className="underline hover:text-white"
                    >
                      Clear Log Buffer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Status & Audit Repository Ledger */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-tertiary">Cryptographic Ledger</span>
            <h2 className="font-headline text-2xl font-bold text-on-surface mt-0.5">Transaction Status & Audit Repository</h2>
            <p className="text-xs text-on-surface-variant font-body mt-1">Cross-border PayPal captures matched with National Mandi Lot IDs.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">search</span>
              <input
                type="text"
                placeholder="Search Order ID, PayPal ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-surface-container text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary w-56 md:w-64 border border-outline-variant/30"
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-full transition-all ${statusFilter === "all"
              ? "bg-primary text-on-primary shadow-sm"
              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
          >
            All Transactions ({sampleLedger.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("completed")}
            className={`px-3 py-1.5 rounded-full transition-all ${statusFilter === "completed"
              ? "bg-primary text-on-primary shadow-sm"
              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
          >
            Completed (Captured)
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("processing")}
            className={`px-3 py-1.5 rounded-full transition-all ${statusFilter === "processing"
              ? "bg-primary text-on-primary shadow-sm"
              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
          >
            Processing Escrow
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("cancelled")}
            className={`px-3 py-1.5 rounded-full transition-all ${statusFilter === "cancelled"
              ? "bg-primary text-on-primary shadow-sm"
              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
          >
            Failed / Cancelled
          </button>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto rounded-xl bg-surface-container shadow-sm border border-outline-variant/30">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-high text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                <th className="py-3.5 px-4">FarmPay Order & Lot</th>
                <th className="py-3.5 px-4">PayPal Sandbox Capture ID</th>
                <th className="py-3.5 px-4">Commodity Specs</th>
                <th className="py-3.5 px-4">Counterparties (Buyer → Farmer)</th>
                <th className="py-3.5 px-4">Settlement Amount</th>
                <th className="py-3.5 px-4">Status & Verification</th>
                <th className="py-3.5 px-4 text-right">Ledger Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface">
              {filteredLedger.map((row) => (
                <tr key={row.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-bold text-on-surface">{row.id}</div>
                    <div className="text-[11px] font-mono text-tertiary">{row.lot}</div>
                  </td>
                  <td className="py-4 px-4 font-mono text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-semibold">
                      {row.captureId}
                    </span>
                    <div className="text-[10px] text-on-surface-variant mt-0.5">Auth: {row.authId}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-on-surface">{row.crop}</div>
                    <div className="text-[11px] text-on-surface-variant">{row.spec}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold">{row.buyer}</div>
                    <div className="text-[11px] text-secondary flex items-center gap-1">
                      <span>→ {row.farmer}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-sm text-on-surface">{row.usdAmount}</div>
                    <div className="text-[10px] text-on-surface-variant">{row.inrAmount}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${row.badgeColor}`}>
                      <span className="material-symbols-outlined text-[14px]">shield_with_heart</span>
                      {row.statusLabel}
                    </span>
                    <div className="text-[10px] text-on-surface-variant mt-1">{row.date}</div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById("receiptPreviewCard");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="p-1.5 rounded-lg hover:bg-surface-container-high text-primary"
                        title="View Formal PayPal Receipt"
                      >
                        <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast(`Exported certified Mandi PDF for ${row.id}`)}
                        className="p-1.5 rounded-lg hover:bg-surface-container-high text-secondary"
                        title="Download Mandi PDF"
                      >
                        <span className="material-symbols-outlined text-[18px]">download</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("console");
                          showToast(`Loaded webhook telemetry for ${row.id}`);
                        }}
                        className="p-1.5 rounded-lg hover:bg-surface-container-high text-tertiary"
                        title="Inspect Webhook Payload"
                      >
                        <span className="material-symbols-outlined text-[18px]">data_object</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cryptographic Transaction Confirmation Receipt Preview */}
      <div className="mb-10 p-8 rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/30" id="receiptPreviewCard">
        <div className="max-w-4xl mx-auto bg-surface-container-lowest rounded-xl p-8 shadow-md border border-outline-variant/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4 border-b border-outline-variant/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
                <span className="material-symbols-outlined text-[28px]">check_circle</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Cryptographic Settlement Proof</span>
                  <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[10px] font-mono font-bold">
                    SHA-256 HMAC VERIFIED
                  </span>
                </div>
                <h3 className="font-headline text-xl font-bold text-on-surface mt-0.5">
                  Mandi Statutory Escrow Receipt #FP-ORD-884-2024
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={() => showToast("Certified PDF Tax Invoice downloaded.")}
              className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              Print Mandi Tax Slip
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-outline-variant/20 text-xs">
            <div>
              <span className="text-secondary block font-medium">PayPal Capture ID</span>
              <span className="font-mono font-bold text-on-surface">CAP-8841-9920-SANDBOX</span>
            </div>
            <div>
              <span className="text-secondary block font-medium">APMC Weigh Slip</span>
              <span className="font-mono font-bold text-on-surface">#NIZ-WB-884-02</span>
            </div>
            <div>
              <span className="text-secondary block font-medium">Farmer Settlement</span>
              <span className="font-bold text-primary">₹3,74,976.00 INR</span>
            </div>
            <div>
              <span className="text-secondary block font-medium">Vault Release Key</span>
              <span className="font-mono text-tertiary font-bold">DUAL-SIG-99A1</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Issuing Authority: Telangana Agricultural Produce & Livestock Market Committee (APMC)</span>
            <Link to="/orders/FP-2024-884/escrow" className="text-primary font-bold hover:underline">
              Inspect Full Escrow Lifecycle →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
