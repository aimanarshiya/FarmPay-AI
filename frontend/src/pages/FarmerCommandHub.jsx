import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function FarmerCommandHub() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isGuiding, setIsGuiding] = useState(false);
  const [activeLang, setActiveLang] = useState("hi");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleMicRecord = () => {
    const next = !isListening;
    setIsListening(next);
    if (next) {
      showToast("Listening... Speak your crop and expected rate in Hindi, Telugu or English.");
      setTimeout(() => {
        setIsListening(false);
        showToast("Voice captured! Redirecting to Voice-to-Trade studio...");
        navigate("/farmer/voice");
      }, 2500);
    }
  };

  const toggleVoiceGuide = () => {
    const next = !isGuiding;
    setIsGuiding(next);
    if (next) {
      showToast("Voice Guidance: 'Aapka ₹3,73,464 Escrow me surakshit hai...'");
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface font-body text-on-surface antialiased flex flex-col max-w-lg mx-auto pb-24 px-4 pt-4 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in w-11/12 max-w-sm">
          <span className="material-symbols-outlined text-primary text-base">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header / Viewport Switcher */}
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-3 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-tertiary uppercase tracking-wider text-[11px]">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-primary">Farmer Mobile Hub (Screen 06)</span>
        </div>
        <Link
          to="/farmer"
          className="text-[11px] font-bold text-on-surface-variant hover:text-primary flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-md"
        >
          <span className="material-symbols-outlined text-[13px]">desktop_windows</span> Desktop View
        </Link>
      </div>

      {/* 1. Farmer Profile & Live Status Header */}
      <section className="pt-1 flex flex-col space-y-2.5 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-tertiary">Kharif Season 2024</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span className="text-xs font-medium text-on-surface-variant">Live Mandi</span>
            </div>
            <h1 className="text-2xl font-bold font-headline text-on-surface tracking-tight mt-0.5">
              Namaste, Rajesh Ji <span className="inline-block animate-bounce text-xl">🙏</span>
            </h1>
            <div className="flex items-center space-x-1 mt-0.5 text-xs text-on-surface-variant font-medium">
              <span className="material-symbols-outlined text-[15px] text-primary">storefront</span>
              <span>Nizamabad Kisan FPO</span>
              <span className="text-outline-variant">•</span>
              <span className="text-primary font-semibold">Gold Member</span>
            </div>
          </div>

          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-high overflow-hidden shadow-sm flex items-center justify-center p-0.5 border border-outline-variant/30">
              <div className="w-full h-full rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold font-headline text-base">
                RP
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-surface-container-lowest px-1 rounded-full shadow-sm flex items-center space-x-0.5 border border-outline-variant/20">
              <span className="material-symbols-outlined text-[13px] text-primary">shield</span>
              <span className="text-[10px] font-bold text-on-surface">100%</span>
            </div>
          </div>
        </div>

        {/* Audio Assistance Toggle Pill */}
        <div className="w-full">
          <button
            type="button"
            onClick={toggleVoiceGuide}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed shadow-sm active:scale-[0.99] transition-all cursor-pointer border border-tertiary/20"
          >
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-tertiary-container flex items-center justify-center text-on-tertiary-container shadow-xs">
                <span className="material-symbols-outlined text-[18px]">
                  {isGuiding ? "record_voice_over" : "volume_up"}
                </span>
              </div>
              <span className="text-xs font-bold font-body">
                {isGuiding
                  ? "Voice Guide Active (Hindi/Telugu)"
                  : "Tap for Voice Guidance (Hindi/Telugu/English)"}
              </span>
            </div>
            <div className="flex items-center space-x-1 bg-on-tertiary-fixed/10 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide">
              <span className={`w-2 h-2 rounded-full ${isGuiding ? "bg-primary animate-ping" : "bg-tertiary"}`}></span>
              <span>{isGuiding ? "Playing" : "Ready"}</span>
            </div>
          </button>
        </div>
      </section>

      {/* 2. Active Locked Escrow Hero Card */}
      <section className="relative w-full rounded-2xl bg-primary text-on-primary p-5 shadow-md overflow-hidden mb-4">
        <div className="relative z-10 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-extrabold tracking-wider uppercase shadow-xs">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              <span>Locked Escrow Vault • Secured</span>
            </div>
            <span className="text-[11px] font-bold text-primary-fixed-dim uppercase tracking-wide bg-on-primary/10 px-2 py-0.5 rounded-md">
              ICICI Bank Node
            </span>
          </div>

          <div className="flex flex-col mt-1">
            <span className="text-xs text-primary-fixed-dim font-medium tracking-wide">Guaranteed Payout Amount</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-extrabold font-headline tracking-tight text-surface-container-lowest">₹3,73,464</span>
              <span className="text-xs text-primary-fixed-dim font-semibold">.00</span>
            </div>
            <p className="text-xs text-primary-fixed text-opacity-95 font-medium mt-0.5">
              Lot #FP-2024-884 • Sona Masoori Paddy (150 Qtl)
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-on-primary/10 backdrop-blur-xs flex items-start space-x-2.5">
            <div className="relative mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed-dim block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed-dim animate-ping absolute inset-0"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-surface-container-lowest leading-snug">
                In Transit: Mandi Weighbridge Cleared (+60kg bonus)
              </p>
              <p className="text-[11px] text-primary-fixed-dim mt-0.5">
                Truck TS-16-UB-9042 • Driver Ramesh Naik (+91 98480...)
              </p>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-[11px] font-semibold text-primary-fixed">
              <span>Escrow Milestones</span>
              <span>Step 4 of 5 (80%)</span>
            </div>
            <div className="w-full bg-on-primary/20 h-2 rounded-full overflow-hidden flex">
              <div className="bg-tertiary-fixed h-full rounded-full transition-all duration-500" style={{ width: "80%" }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-primary-fixed-dim font-medium pt-0.5">
              <span className="text-surface-container-lowest font-bold">1. Sealed</span>
              <span className="text-surface-container-lowest font-bold">2. Loaded</span>
              <span className="text-surface-container-lowest font-bold">3. Weighed</span>
              <span className="text-surface-container-lowest font-bold text-tertiary-fixed underline underline-offset-2">4. In Transit</span>
              <span className="opacity-60">5. Released</span>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={() => navigate("/orders/FP-2024-884/escrow")}
              className="w-full py-2.5 px-4 rounded-xl bg-tertiary-fixed hover:bg-tertiary-fixed-dim text-on-tertiary-fixed font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>View Transit GPS & Bank Payout Details</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. One-Tap 'Voice-to-Trade' Mic Action Card */}
      <section className="relative w-full rounded-2xl bg-surface-container-low p-4 shadow-sm border border-outline-variant/30 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-2">
            <div className="inline-flex items-center space-x-1 bg-surface-container-highest px-2 py-0.5 rounded text-[11px] font-bold text-on-surface-variant mb-1">
              <span className="material-symbols-outlined text-[14px] text-primary animate-pulse">graphic_eq</span>
              <span>Bhashini AI Voice Engine</span>
            </div>
            <h2 className="text-lg font-bold font-headline text-on-surface leading-tight">
              Bol Kar Fasal Becho
            </h2>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">
              Speak to sell crop in your native tongue
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            {isListening && (
              <span className="absolute w-16 h-16 rounded-full bg-error/30 animate-ping opacity-75 pointer-events-none"></span>
            )}
            <button
              type="button"
              onClick={toggleMicRecord}
              className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer ${isListening
                  ? "bg-error text-white shadow-error/40 scale-110"
                  : "bg-primary text-on-primary shadow-primary/30"
                }`}
            >
              <span className="material-symbols-outlined text-[30px]">
                {isListening ? "graphic_eq" : "mic"}
              </span>
            </button>
          </div>
        </div>

        <div className={`mt-3 p-3 rounded-xl border-0 flex items-start space-x-2 transition-colors ${isListening ? "bg-error-container text-on-error-container" : "bg-surface-container"}`}>
          <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">chat_bubble</span>
          <p className="text-xs italic leading-relaxed">
            {isListening
              ? "Sun rahe hain... (Listening in Telugu/Hindi): Speak your crop and desired price now..."
              : "“Tap mic and speak: 'Sell 80 bags wheat in Indore' or '150 quintals Sona Masoori paddy at ₹2,500'”"}
          </p>
        </div>

        {/* Dialect Chips */}
        <div className="flex items-center space-x-1.5 mt-3 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-on-surface-variant shrink-0 mr-1">Select:</span>
          {["hi", "te", "kn", "en"].map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${activeLang === lang
                  ? "bg-primary text-on-primary shadow-xs"
                  : "bg-surface-container text-on-surface-variant"
                }`}
            >
              {lang === "hi" && "हिन्दी (Hindi)"}
              {lang === "te" && "తెలుగు (Telugu)"}
              {lang === "kn" && "ಕನ್ನಡ (Kannada)"}
              {lang === "en" && "English"}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Today's Local APMC Mandi Benchmark Ticker */}
      <section className="w-full bg-secondary-container text-on-secondary-container rounded-2xl p-3.5 shadow-xs space-y-2 mb-4 border border-outline-variant/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-tertiary text-[18px]">trending_up</span>
            <span className="text-xs font-bold uppercase tracking-wider font-headline">Live APMC Mandi vs FarmPay</span>
          </div>
          <span className="text-[10px] font-bold bg-primary text-on-primary px-2 py-0.5 rounded-full">
            +₹210/qtl FarmPay Edge
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 pt-0.5">
          <div className="p-2 rounded-xl bg-surface-container-lowest text-center shadow-xs flex flex-col justify-center border border-outline-variant/10">
            <span className="text-[10px] font-bold text-on-surface-variant truncate">Nizamabad APMC</span>
            <span className="text-sm font-black text-on-surface mt-0.5">₹2,280</span>
            <span className="text-[9px] font-semibold text-secondary">Delayed 30m</span>
          </div>
          <div className="p-2 rounded-xl bg-surface-container-lowest text-center shadow-xs flex flex-col justify-center border border-outline-variant/10">
            <span className="text-[10px] font-bold text-on-surface-variant truncate">Suryapet Mandi</span>
            <span className="text-sm font-black text-on-surface mt-0.5">₹2,250</span>
            <span className="text-[9px] font-semibold text-secondary">Minus cess 2.5%</span>
          </div>
          <div className="p-2 rounded-xl bg-primary-fixed text-center shadow-xs flex flex-col justify-center border border-primary/20">
            <span className="text-[10px] font-bold text-on-primary-fixed truncate">FarmPay Net</span>
            <span className="text-sm font-black text-primary font-headline mt-0.5">₹2,490</span>
            <span className="text-[9px] font-extrabold text-on-primary-fixed-variant">Instant Bank Payout</span>
          </div>
        </div>
      </section>

      {/* 5. Highest Verified Buyer Bids */}
      <section className="space-y-3 mb-4">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center space-x-1.5">
            <h3 className="font-headline font-bold text-base text-on-surface">Highest Verified Buyer Bids</h3>
            <span className="w-5 h-5 rounded-full bg-error text-on-error text-[11px] font-extrabold flex items-center justify-center">
              2
            </span>
          </div>
          <Link to="/fairbid" className="text-xs font-bold text-primary flex items-center hover:underline">
            <span>FairBid Matrix</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </Link>
        </div>

        {/* Bid Card 1: AgroCorp */}
        <div className="w-full rounded-2xl bg-surface-container-lowest p-4 shadow-sm flex flex-col space-y-3 border border-outline-variant/30">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary-container/40 flex items-center justify-center text-primary font-bold text-sm">
                AC
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <h4 className="text-sm font-bold text-on-surface font-headline">AgroCorp Processing Mills</h4>
                  <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] text-on-surface-variant font-medium">
                  <span className="bg-surface-container px-1.5 py-0.2 rounded font-bold text-tertiary">AAA Rated</span>
                  <span>•</span>
                  <span className="text-primary font-bold">98.4% Trust</span>
                  <span>•</span>
                  <span>Hyderabad Hub</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low flex flex-col space-y-1.5 border border-outline-variant/20">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-on-surface-variant font-medium">Buyer's Gross Offer:</span>
              <span className="text-sm font-bold text-on-surface line-through opacity-70">₹2,520 / qtl</span>
            </div>
            <div className="flex justify-between items-baseline pt-0.5">
              <span className="text-xs font-bold text-primary flex items-center space-x-1">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                <span>FairBid Net In-Hand:</span>
              </span>
              <span className="text-lg font-black font-headline text-primary">
                ₹2,489.76 <span className="text-[11px] font-normal text-on-surface-variant">/ qtl</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-on-surface-variant">Zero hidden cuts • Mandi cess waived</span>
              <span className="font-extrabold text-primary bg-primary-fixed px-2 py-0.5 rounded-full">
                +₹419/qtl higher net gain
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => navigate("/negotiation/TND-8821")}
              className="py-2.5 px-3 rounded-xl bg-surface-container text-on-surface font-bold text-xs hover:bg-surface-container-high transition-colors flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Counter Offer</span>
            </button>
            <button
              type="button"
              onClick={() => {
                showToast("Accepted AgroCorp Bid! Escrow vault locked.");
                navigate("/orders/FP-2024-884/escrow");
              }}
              className="py-2.5 px-3 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-sm active:scale-[0.98] transition-transform flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>Accept & Escrow</span>
            </button>
          </div>
        </div>

        {/* Bid Card 2: Kaveri with Warning */}
        <div className="w-full rounded-2xl bg-surface-container-lowest p-4 shadow-sm flex flex-col space-y-3 border border-outline-variant/30">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold text-sm">
                KA
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <h4 className="text-sm font-bold text-on-surface font-headline">Kaveri Agri Trading</h4>
                  <span className="text-[10px] bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.2 rounded font-semibold">B+ Rated</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] text-on-surface-variant font-medium">
                  <span>Offer: ₹2,480/qtl</span>
                  <span>•</span>
                  <span>Warangal</span>
                </div>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-on-surface-variant">22m ago</span>
          </div>

          <div className="p-2.5 rounded-xl bg-error-container text-on-error-container flex items-start space-x-2">
            <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">warning</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold leading-tight">Hidden Cost Warning Detected</p>
              <p className="text-[11px] mt-0.5 leading-snug text-on-error-container/90">
                Deducts ₹95 freight + 2% moisture dockage. Actual net is <strong>₹95/qtl lower</strong> than AgroCorp!
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => showToast("Bid declined.")}
              className="text-xs font-bold text-error underline underline-offset-2"
            >
              Decline Bid
            </button>
            <button
              type="button"
              onClick={() => navigate("/negotiation/TND-8910")}
              className="py-2 px-3 rounded-xl bg-surface-container text-on-surface font-semibold text-xs flex items-center space-x-1 hover:bg-surface-container-high"
            >
              <span>Negotiate with Copilot</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. Quick Farmer Utilities Grid (2x2) */}
      <section className="space-y-2.5 mb-4">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="font-headline font-bold text-base text-on-surface">Kisan Smart Tooling</h3>
          <span className="text-xs text-on-surface-variant font-medium">All Tools Active</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => navigate("/passport/lot/FP-2024-884")}
            className="p-3.5 rounded-2xl bg-surface-container text-left flex flex-col justify-between space-y-2 active:scale-[0.98] transition-all shadow-xs border border-outline-variant/20 cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-tertiary-fixed text-on-tertiary-fixed px-1.5 py-0.5 rounded">Passport</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-on-surface">Digital Crop Passport</h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5">APMC & NABL certified QR</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate("/market/demand-radar")}
            className="p-3.5 rounded-2xl bg-surface-container text-left flex flex-col justify-between space-y-2 active:scale-[0.98] transition-all shadow-xs border border-outline-variant/20 cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-surface-container-highest text-primary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[20px]">radar</span>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary-fixed px-1.5 py-0.5 rounded">Live Map</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-on-surface">Demand Radar</h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Regional deficit heatmap</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate("/logistics/telemetry/FP-2024-884")}
            className="p-3.5 rounded-2xl bg-surface-container text-left flex flex-col justify-between space-y-2 active:scale-[0.98] transition-all shadow-xs border border-outline-variant/20 cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-surface-container-highest text-tertiary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[20px]">scale</span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-outline">local_shipping</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-on-surface">Weighbridge Slips</h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Digital tare weight logs</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate("/disputes")}
            className="p-3.5 rounded-2xl bg-surface-container text-left flex flex-col justify-between space-y-2 active:scale-[0.98] transition-all shadow-xs border border-outline-variant/20 cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-surface-container-highest text-secondary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[20px]">shield</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-surface"></span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-on-surface">Dispute Shield</h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Floor payout guarantee</p>
            </div>
          </button>
        </div>
      </section>

      {/* Community Impact Stamp */}
      <section className="p-3.5 rounded-xl bg-surface-container-low flex items-center space-x-3 border border-outline-variant/20 mb-6">
        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[20px]">handshake</span>
        </div>
        <p className="text-[11px] text-on-surface-variant font-medium leading-tight">
          Over <strong className="text-on-surface">₹42.8 Crores</strong> securely disbursed to 14,200+ Telangana farmers through FarmPay AI Escrows this harvest season.
        </p>
      </section>

      {/* Mobile Bottom Floating Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 py-2 shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto px-2">
          <Link
            to="/farmer/dashboard"
            className="flex flex-col items-center justify-center text-primary font-bold min-w-[56px]"
          >
            <span className="material-symbols-outlined text-[24px]">agriculture</span>
            <span className="text-[10px] mt-0.5">Command</span>
          </Link>

          <Link
            to="/farmer/voice"
            className="flex flex-col items-center justify-center -mt-6 group"
          >
            <div className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/25 ring-4 ring-surface active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[28px]">mic</span>
            </div>
            <span className="text-[10px] mt-1 text-primary font-bold">Voice Trade</span>
          </Link>

          <Link
            to="/fairbid"
            className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary min-w-[56px]"
          >
            <span className="material-symbols-outlined text-[24px]">gavel</span>
            <span className="text-[10px] mt-0.5">FairBid</span>
          </Link>

          <Link
            to="/orders/FP-2024-884/escrow"
            className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary min-w-[56px]"
          >
            <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
            <span className="text-[10px] mt-0.5">Escrow</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
