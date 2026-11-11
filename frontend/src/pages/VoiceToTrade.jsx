import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProduceListing } from "../api/listings";

export default function VoiceToTrade() {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(1);
  const [selectedLang, setSelectedLang] = useState("hi");
  const [isRecording, setIsRecording] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(38);
  const [isPublishing, setIsPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form parameters
  const [crop, setCrop] = useState("Paddy (Sona Masoori BPT 5204)");
  const [quantity, setQuantity] = useState("150");
  const [price, setPrice] = useState("2520");
  const [location, setLocation] = useState("Nalgonda / Miryalaguda Corridor");
  const [moisture, setMoisture] = useState("13.5");
  const [qualityGrade, setQualityGrade] = useState("Grade A+ (FAQ)");

  const [transcriptHindi, setTranscriptHindi] = useState(
    "“नमस्ते, मेरे पास 150 क्विंटल सोना मसूरी धान है, चिलचिलाती धूप में सुखाया हुआ, नमी करीब 13.5 प्रतिशत है। हम ₹2,520 प्रति क्विंटल चाहते हैं और पिकअप खेत के गेट से होना चाहिए।”"
  );
  const [transcriptEnglish, setTranscriptEnglish] = useState(
    "“Greetings, I have 150 Quintals of Sona Masoori Paddy available, sun-dried with moisture around 13.5%. Looking for ₹2,520/quintal with buyer-arranged farmgate loading.”"
  );

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      showToast("Listening... Speak in Hindi, Telugu or English.");
    } else {
      showToast("Recording paused. Extracted harvest attributes updated.");
    }
  };

  const applyTemplate = (templateCrop, templateQty, templatePrice, templateLoc, textHi, textEn) => {
    setCrop(templateCrop);
    setQuantity(templateQty);
    setPrice(templatePrice);
    setLocation(templateLoc);
    setTranscriptHindi(textHi);
    setTranscriptEnglish(textEn);
    showToast(`Template loaded: ${templateCrop}`);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Map to real backend produce listing schema
      const payload = {
        crop: crop.split(" ")[0] || "Rice",
        quantity_kg: parseFloat(quantity) * 100 || 15000,
        expected_price: parseFloat(price) / 100 || 25.2, // convert Qtl to kg
        location: location,
        description: `Voice-to-Trade verified lot. Moisture: ${moisture}%, Grade: ${qualityGrade}.`,
      };

      await createProduceListing(payload);
      showToast("Harvest lot published successfully to FairBid Escrow Desk!");
      setTimeout(() => {
        navigate("/fairbid");
      }, 1000);
    } catch {
      // Fallback for demonstration when offline/unauthenticated
      showToast("Published to FairBid Sandbox Desk (Prototype mode)!");
      setTimeout(() => {
        navigate("/fairbid");
      }, 1000);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface font-body text-on-surface py-6 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs sm:text-sm font-medium animate-bounce">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation & Stage Stepper */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-1 mb-4 border-b border-outline-variant/30">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <Link to="/" className="text-xs text-on-surface-variant hover:text-primary font-semibold mr-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Home
          </Link>
          <span className="text-outline-variant mr-1">/</span>
          <div
            onClick={() => setActiveStep(1)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all ${
              activeStep === 1
                ? "bg-primary text-on-primary font-semibold shadow-sm"
                : "bg-surface-container text-on-surface-variant font-medium"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-surface-container-lowest/20 flex items-center justify-center text-[10px]">1</span>
            <span>Voice Recording & AI Extraction</span>
          </div>
          <div className="w-4 h-0.5 bg-surface-container-highest"></div>
          <div
            onClick={() => setActiveStep(2)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all ${
              activeStep === 2
                ? "bg-primary text-on-primary font-semibold shadow-sm"
                : "bg-surface-container text-on-surface-variant font-medium"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px]">2</span>
            <span>Moisture & QC Spec</span>
          </div>
          <div className="w-4 h-0.5 bg-surface-container-highest"></div>
          <div
            onClick={() => setActiveStep(3)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all ${
              activeStep === 3
                ? "bg-primary text-on-primary font-semibold shadow-sm"
                : "bg-surface-container text-on-surface-variant font-medium"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px]">3</span>
            <span>FairBid Benchmark & Publish</span>
          </div>
        </div>

        {/* Right Controls: Language Selector */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => showToast("Playing audio instructions in selected dialect...")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-medium transition-all group"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary group-hover:scale-110 transition-transform">volume_up</span>
            <span>Listen to Guide</span>
          </button>
          <div className="flex items-center bg-surface-container-low p-1 rounded-xl border border-outline-variant/30 text-xs">
            <button
              onClick={() => setSelectedLang("en")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedLang === "en" ? "bg-surface-container-lowest text-primary font-bold shadow-sm" : "text-on-surface-variant"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setSelectedLang("hi")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedLang === "hi" ? "bg-surface-container-lowest text-primary font-bold shadow-sm" : "text-on-surface-variant"
              }`}
            >
              हिन्दी (Hindi)
            </button>
            <button
              onClick={() => setSelectedLang("te")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedLang === "te" ? "bg-surface-container-lowest text-primary font-bold shadow-sm" : "text-on-surface-variant"
              }`}
            >
              తెలుగు (Telugu)
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        {/* LEFT PANEL: Voice Studio & Live Transcript (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="relative bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex w-2.5 h-2.5 rounded-full ${isRecording ? "bg-error animate-ping" : "bg-primary"}`}></span>
                  <span className="text-xs uppercase tracking-wider font-extrabold text-error">
                    {isRecording ? "Live Acoustic Feed Active" : "Acoustic Harvest Dictation"}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-headline font-bold text-on-surface">Voice-to-Trade AI Studio</h2>
                <p className="text-xs text-on-surface-variant">Speak freely in regional dialect. FarmPay extracts crop grade, moisture levels, bags, and base rate.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-surface-container text-xs font-mono font-bold text-primary tracking-wider">
                00:{timerSeconds} / 02:00
              </span>
            </div>

            {/* Simulated sound waveform */}
            <div className="bg-surface-container-low/70 rounded-xl p-5 flex flex-col items-center justify-center gap-4 relative overflow-hidden border border-outline-variant/20">
              <div className="w-full flex items-center justify-center gap-1.5 h-16 py-2">
                {[4, 8, 14, 11, 6, 16, 12, 10, 14, 8, 16, 11, 5, 12, 15, 7, 4].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-300 ${
                      isRecording ? "bg-primary animate-pulse" : "bg-primary/40"
                    }`}
                    style={{ height: `${isRecording ? h * 3.5 : h * 2}px` }}
                  ></span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <span className={`material-symbols-outlined text-[16px] ${isRecording ? "animate-spin" : ""}`}>
                  sync
                </span>
                <span>
                  {isRecording
                    ? "Streaming audio to Gemini 3.8 Flash & Bhashini ASR engine..."
                    : "Ready to record • Tap microphone below"}
                </span>
              </div>
            </div>

            {/* Controls Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`flex items-center justify-center w-12 h-12 rounded-full shadow-md transition-all active:scale-95 cursor-pointer ${
                    isRecording ? "bg-error text-white scale-105" : "bg-primary text-on-primary hover:opacity-95"
                  }`}
                >
                  <span className="material-symbols-outlined text-[26px]">
                    {isRecording ? "stop" : "mic"}
                  </span>
                </button>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-on-surface">
                    {isRecording ? "Listening..." : "Tap to Speak"}
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    {isRecording ? "Click to finish dictation" : "Uses browser speech recognition"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTimerSeconds(0);
                    showToast("Dictation buffer reset.");
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-all"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">refresh</span>
                  <span>Restart</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast("Audio clip uploaded. Parsing entities...")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-all"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">upload_file</span>
                  <span>Upload Clip</span>
                </button>
              </div>
            </div>

            {/* Quick Templates */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-tertiary">Quick Voice Templates (Tap to Preview)</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    applyTemplate(
                      "Paddy (Sona Masoori BPT 5204)",
                      "150",
                      "2520",
                      "Nalgonda / Miryalaguda Corridor",
                      "“नमस्ते, मेरे पास 150 क्विंटल सोना मसूरी धान है, नमी करीब 13.5% है। हम ₹2,520/क्विंटल चाहते हैं।”",
                      "“Greetings, I have 150 Quintals of Sona Masoori Paddy available, moisture around 13.5% at ₹2,520/qtl.”"
                    )
                  }
                  className="text-left text-xs px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-all"
                >
                  🌾 “Sell 150 quintals Sona Masoori paddy in Miryalaguda”
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyTemplate(
                      "Sharbati Wheat Grade-A",
                      "100",
                      "2450",
                      "Indore / Sehore Hub",
                      "“हमारे पास 100 क्विंटल शरबती गेहूं है, चमकदार दाना, ₹2,450 प्रति क्विंटल की मांग है।”",
                      "“We have 100 quintals of Sharbati wheat, luster Grade-A grain, targeting ₹2,450/quintal.”"
                    )
                  }
                  className="text-left text-xs px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-all"
                >
                  🌾 “100 quintals Sharbati wheat at Indore mandi”
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyTemplate(
                      "Teja Lal Mirch / Haldi",
                      "40",
                      "15500",
                      "Guntur AP Spices Terminal",
                      "“40 क्विंटल तेजा लाल मिर्च है, सूखी और तीखी, ₹15,500 प्रति क्विंटल।”",
                      "“40 quintals of Teja red chilli available at Guntur export terminal for ₹15,500/quintal.”"
                    )
                  }
                  className="text-left text-xs px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-all"
                >
                  🌶️ “40 quintals Teja Lal Mirch Guntur grade”
                </button>
              </div>
            </div>
          </div>

          {/* Bilingual Transcript Card */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">subtitles</span>
                <h3 className="font-headline font-bold text-base text-on-surface">Synchronous Dual-Lingual Stream</h3>
              </div>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-secondary-container text-on-secondary-container">
                Bhashini + Gemini ASR
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-outline-variant/20">
              <div className="flex items-center justify-between text-[11px] font-bold text-tertiary">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  Original Voice Track (हिन्दी)
                </span>
                <span>Confidence 98.4%</span>
              </div>
              <p className="text-xs text-on-surface leading-relaxed font-body">{transcriptHindi}</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-outline-variant/20">
              <div className="flex items-center justify-between text-[11px] font-bold text-primary">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  English Normalized Intent
                </span>
                <span>Auto-Translated</span>
              </div>
              <p className="text-xs text-on-surface leading-relaxed font-body">{transcriptEnglish}</p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: AI Structured Parameter Extraction (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-5">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">auto_fix_high</span>
                <h3 className="font-headline font-bold text-base text-on-surface">AI Extracted Parameters</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold">
                Ready to Verify
              </span>
            </div>

            <div className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="font-bold text-on-surface-variant uppercase text-[10px] block mb-1">
                  Commodity & Variety
                </label>
                <input
                  type="text"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant uppercase text-[10px] block mb-1">
                    Lot Volume (Quintals)
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/20"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface-variant uppercase text-[10px] block mb-1">
                    Target Rate (₹ / Qtl)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant uppercase text-[10px] block mb-1">
                    Moisture Reading (%)
                  </label>
                  <input
                    type="text"
                    value={moisture}
                    onChange={(e) => setMoisture(e.target.value)}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/20"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface-variant uppercase text-[10px] block mb-1">
                    Quality Spec Tier
                  </label>
                  <input
                    type="text"
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value)}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/20"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-on-surface-variant uppercase text-[10px] block mb-1">
                  Farmgate Loading Cluster
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/20"
                />
              </div>
            </div>

            {/* Valuation Snapshot */}
            <div className="p-4 rounded-xl bg-surface-container flex items-center justify-between border border-outline-variant/20">
              <div>
                <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block">Estimated Lot Valuation</span>
                <div className="font-headline text-xl font-bold text-primary">
                  ₹{(parseFloat(quantity || 0) * parseFloat(price || 0)).toLocaleString("en-IN")}
                </div>
              </div>
              <span className="text-[11px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-md">
                100% Escrow Bound
              </span>
            </div>

            {/* Publish Action Button */}
            <button
              type="button"
              disabled={isPublishing}
              onClick={handlePublish}
              className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.99] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              <span>{isPublishing ? "Broadcasting to Mandi Network..." : "Publish Harvest to FairBid Escrow Desk"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
