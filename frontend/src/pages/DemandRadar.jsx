import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function DemandRadar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("ALL");
  const [selectedCluster, setSelectedCluster] = useState("ALL");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const mapNodes = useMemo(() => [
    {
      id: "hyderabad",
      name: "Hyderabad Central",
      state: "Telangana",
      type: "HIGH_DEMAND",
      typeLabel: "High Demand",
      commodity: "Sharbati Wheat & Milling Grains",
      volume: "3,200 Qtl Active Tender",
      statusText: "High Commercial Intake (+₹180/Qtl)",
      cx: 195,
      cy: 190,
      r: 24,
      color: "#2d5a3f",
      badgeColor: "bg-emerald-100 text-emerald-800",
      details: "Deccan Flour Mills & metro wheat intake hubs with 48h turnarounds. 100% buyer-funded logistics arranged.",
      highway: "NH-65 / NH-44 Junction",
      mandiRate: "₹2,450 / Qtl",
    },
    {
      id: "miryalaguda",
      name: "Miryalaguda Parboiled Belt",
      state: "Telangana",
      type: "CRITICAL_DEFICIT",
      typeLabel: "Critical Deficit",
      commodity: "Paddy Sona Masoori (BPT 5204)",
      volume: "Shortfall: -4,500 Qtl Deficit",
      statusText: "Critical Supply Deficit (Urgent)",
      cx: 295,
      cy: 250,
      r: 32,
      color: "#dc2626",
      badgeColor: "bg-red-100 text-red-800",
      details: "Severe milling supply shortage. Exporters competing aggressively for incoming export consignments with spot premiums.",
      isDeficit: true,
      highway: "NH-167 / Krishna Basin",
      mandiRate: "₹2,640 / Qtl (Spot High)",
    },
    {
      id: "warangal",
      name: "Warangal Cotton Hub",
      state: "Telangana",
      type: "SUPPLY_AVAILABILITY",
      typeLabel: "Supply Availability",
      commodity: "Cotton (MCU-5 Long Staple)",
      volume: "500 Bales MCU-5 In-Yard",
      statusText: "High Supply Availability",
      cx: 315,
      cy: 130,
      r: 22,
      color: "#d97706",
      badgeColor: "bg-amber-100 text-amber-800",
      details: "Major regional cotton trading yard with APMC electronic weighbridge linkage and 100% advance escrow funding.",
      highway: "NH-163 Warangal Corridor",
      mandiRate: "₹61,000 / Candy",
    },
    {
      id: "guntur",
      name: "Guntur Terminal Yard",
      state: "Andhra Pradesh",
      type: "HIGH_DEMAND",
      typeLabel: "High Demand",
      commodity: "Teja Lal Mirch & Haldi",
      volume: "250 Qtl Export AAA Mandate",
      statusText: "High Export Demand (+₹450/Qtl)",
      cx: 390,
      cy: 300,
      r: 26,
      color: "#2d5a3f",
      badgeColor: "bg-emerald-100 text-emerald-800",
      details: "Asia's largest spice terminal with direct export cold-chain infrastructure and NABL laboratory testing assay.",
      highway: "NH-16 Coastal Corridor",
      mandiRate: "₹15,500 / Qtl",
    },
    {
      id: "vijayawada",
      name: "Vijayawada Riverine Agro-Port",
      state: "Andhra Pradesh",
      type: "PROCUREMENT_HUB",
      typeLabel: "Procurement Hub",
      commodity: "Multimodal Grain & Pulse Depot",
      volume: "Multi-Commodity Transit Depot",
      statusText: "Primary Procurement Hub",
      cx: 410,
      cy: 260,
      r: 20,
      color: "#2563eb",
      badgeColor: "bg-blue-100 text-blue-800",
      details: "Strategic riverine transit hub connecting Coastal Andhra with Telangana corridors and southern sea terminals.",
      highway: "NH-65 / NH-16 Interchange",
      mandiRate: "₹2,520 / Qtl (Weighted)",
    },
    {
      id: "nizamabad",
      name: "Nizamabad Turmeric Yard",
      state: "Telangana",
      type: "SUPPLY_AVAILABILITY",
      typeLabel: "Supply Availability",
      commodity: "Salem Curcumin Haldi",
      volume: "1,800 Qtl Finger Haldi",
      statusText: "Supply Accumulation Active",
      cx: 160,
      cy: 80,
      r: 18,
      color: "#d97706",
      badgeColor: "bg-amber-100 text-amber-800",
      details: "Regulated turmeric trading center with active FPO pooling groups and authenticated curcumin assay testing.",
      highway: "NH-44 North-South",
      mandiRate: "₹14,800 / Qtl",
    },
    {
      id: "kurnool",
      name: "Kurnool Rayalaseema Mandi",
      state: "Andhra Pradesh",
      type: "PROCUREMENT_HUB",
      typeLabel: "Procurement Hub",
      commodity: "Desi Chana & Oilseeds",
      volume: "1,200 Qtl Desi Chana Intake",
      statusText: "Regional Procurement Hub",
      cx: 165,
      cy: 340,
      r: 18,
      color: "#2563eb",
      badgeColor: "bg-blue-100 text-blue-800",
      details: "Major Rayalaseema pulse & oilseed market with certified state warehouse storage and rail rake siding.",
      highway: "NH-44 Rayalaseema",
      mandiRate: "₹5,400 / Qtl",
    },
  ], []);

  const tenders = useMemo(() => [
    {
      id: "TND-8821",
      buyer: "AgroCorp Processing Mills",
      initials: "AC",
      badgeColor: "bg-primary-fixed text-on-primary-fixed",
      location: "Miryalaguda Hub",
      freightBenefit: "100% Free Farmgate Freight",
      offerMin: 2580,
      offerMax: 2640,
      unit: "Qtl",
      commodity: "Paddy Sona Masoori",
      cropCode: "PADDY",
      targetVolume: "1,200 Quintals",
      grade: "FAQ Grade 1",
      spec: "< 14.0% max moisture",
      escrowBank: "ICICI Bank",
      escrowAmount: "₹31.5 Lakhs",
      state: "Telangana",
      urgent: true,
    },
    {
      id: "TND-8794",
      buyer: "Deccan Flour & Grain Mills",
      initials: "DF",
      badgeColor: "bg-secondary-fixed text-on-secondary-fixed",
      location: "Hyderabad Metro",
      freightBenefit: "Buyer Arranged Logistics",
      offerMin: 2420,
      offerMax: 2480,
      unit: "Qtl",
      commodity: "Sharbati Wheat",
      cropCode: "WHEAT",
      targetVolume: "800 Quintals",
      grade: "Luster Grade A",
      spec: "> 12.5% protein",
      escrowBank: "State Bank of India",
      escrowAmount: "₹19.6 Lakhs",
      state: "Telangana",
      urgent: false,
    },
    {
      id: "TND-8910",
      buyer: "Warangal Cotton Ginning Corp",
      initials: "WC",
      badgeColor: "bg-tertiary-fixed text-on-tertiary-fixed",
      location: "Warangal Hub",
      freightBenefit: "Pickup at Taluka Ginning Yard",
      offerMin: 60500,
      offerMax: 61000,
      unit: "Candy",
      commodity: "Cotton (MCU-5)",
      cropCode: "COTTON",
      targetVolume: "500 Bales",
      grade: "30-32mm Staple",
      spec: "Micronaire 3.8-4.2",
      escrowBank: "Bank of Baroda",
      escrowAmount: "₹3.05 Cr",
      state: "Telangana",
      urgent: false,
    },
    {
      id: "TND-8650",
      buyer: "Guntur Spice Exporters Ltd",
      initials: "GS",
      badgeColor: "bg-error-container text-error",
      location: "Guntur AP",
      freightBenefit: "Cold Storage In-Gate Delivery",
      offerMin: 15200,
      offerMax: 15500,
      unit: "Qtl",
      commodity: "Teja Lal Mirch / Haldi",
      cropCode: "SPICES",
      targetVolume: "250 Quintals",
      grade: "Export Grade AAA",
      spec: "< 10.0% moisture max",
      escrowBank: "HDFC Bank",
      escrowAmount: "₹38.7 Lakhs",
      state: "Andhra Pradesh",
      urgent: true,
    },
  ], []);

  const filteredTenders = useMemo(() => {
    return tenders.filter((t) => {
      const matchSearch =
        searchQuery === "" ||
        t.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCrop =
        selectedCrop === "ALL" || t.cropCode === selectedCrop;

      const matchCluster =
        selectedCluster === "ALL" ||
        (selectedCluster === "TELANGANA" && t.state === "Telangana") ||
        (selectedCluster === "ANDHRA" && t.state === "Andhra Pradesh");

      const matchFilter =
        activeFilter === "ALL" ||
        (activeFilter === "FREIGHT" && t.freightBenefit.includes("Free")) ||
        (activeFilter === "URGENT" && t.urgent) ||
        (activeFilter === "ESCROW" && t.escrowAmount);

      return matchSearch && matchCrop && matchCluster && matchFilter;
    });
  }, [searchQuery, selectedCrop, selectedCluster, activeFilter, tenders]);

  return (
    <div className="w-full min-h-screen bg-surface font-body text-on-surface py-6 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Live Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-on-surface">Market Intelligence</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold">Demand Radar (Screen 09)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            Tender Stream Live • 14 Verified Millers Active
          </span>
          <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-medium">
            Illustrative Demand Projections
          </span>
        </div>
      </div>

      {/* Hero Header Zone */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container p-6 sm:p-8 shadow-sm mb-8 border border-outline-variant/30">
        <div className="max-w-4xl">
          <h1 className="font-headline font-bold text-2xl sm:text-3xl lg:text-4xl text-on-surface tracking-tight leading-tight">
            Marketplace Demand Radar — Institutional Procurement Heatmap
          </h1>
          <p className="mt-2 text-sm sm:text-base text-on-surface-variant font-normal leading-relaxed">
            Explore real-time buyer procurement tenders, grain demand volumes, quality grade requirements, and regional deficit hotspots across Telangana, Andhra Pradesh, and Maharashtra.
          </p>
        </div>

        {/* Live Macro Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-5 mt-2">
          <div className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm border border-outline-variant/20">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Unfulfilled Volume</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-headline text-2xl font-bold text-on-surface">18,450</span>
              <span className="text-xs font-semibold text-primary">Quintals</span>
            </div>
            <span className="text-[10px] text-on-surface-variant mt-0.5 block">Across 22 Mandated Millers</span>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm border border-outline-variant/20">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Max Price Spread</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-headline text-2xl font-bold text-tertiary">+₹450</span>
              <span className="text-xs font-semibold text-on-surface">/ Qtl premium</span>
            </div>
            <span className="text-[10px] text-on-surface-variant mt-0.5 block">High Curcumin Spices</span>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm border border-outline-variant/20">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Peak Deficit Zone</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-headline text-lg font-bold text-error truncate">Nalgonda-Suryapet</span>
            </div>
            <span className="text-[10px] text-on-surface-variant mt-0.5 block">4,500 Qtl shortfall</span>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm border border-outline-variant/20">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Avg Escrow Lock</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-headline text-2xl font-bold text-primary">98.2%</span>
              <span className="text-xs font-semibold text-on-surface">Funded</span>
            </div>
            <span className="text-[10px] text-on-surface-variant mt-0.5 block">ICICI & SBI Escrows</span>
          </div>
        </div>
      </div>

      {/* Filter & Query Controls */}
      <section className="bg-surface-container-low rounded-2xl p-5 mb-8 shadow-sm border border-outline-variant/30">
        <div className="flex flex-col gap-4">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              type="text"
              className="w-full bg-surface-container-lowest rounded-xl pl-12 pr-4 py-3.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
              placeholder="Search buyers by name, processing mill location, or crop spec (e.g., Sona Masoori, Miryalaguda, BPT 5204)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Crop Portfolio</label>
              <select
                className="w-full bg-surface-container-lowest text-on-surface text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm font-medium border border-outline-variant/30"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                <option value="ALL">All Commodities</option>
                <option value="PADDY">Paddy Sona Masoori (BPT 5204)</option>
                <option value="WHEAT">Sharbati Wheat Grade-A</option>
                <option value="COTTON">Cotton MCU-5 (Long Staple)</option>
                <option value="SPICES">Teja Lal Mirch / Haldi</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Procurement Cluster</label>
              <select
                className="w-full bg-surface-container-lowest text-on-surface text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm font-medium border border-outline-variant/30"
                value={selectedCluster}
                onChange={(e) => setSelectedCluster(e.target.value)}
              >
                <option value="ALL">All Regional Hubs</option>
                <option value="TELANGANA">Telangana Hubs (Nalgonda / Warangal / Hyderabad)</option>
                <option value="ANDHRA">Coastal Andhra (Guntur / Krishna)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Intake Timeline</label>
              <select className="w-full bg-surface-container-lowest text-on-surface text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm font-medium border border-outline-variant/30">
                <option>Next 48 Hours (Urgent Inflow)</option>
                <option>7 Days (Rolling Tenders)</option>
                <option>Harvest Season Contract (30 Days)</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-on-surface-variant font-bold">Quick Filters:</span>
            <button
              onClick={() => setActiveFilter(activeFilter === "FREIGHT" ? "ALL" : "FREIGHT")}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                activeFilter === "FREIGHT"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
              }`}
            >
              100% Free Farmgate Freight
            </button>
            <button
              onClick={() => setActiveFilter(activeFilter === "ESCROW" ? "ALL" : "ESCROW")}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                activeFilter === "ESCROW"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
              }`}
            >
              Advance Escrow Funded
            </button>
            <button
              onClick={() => setActiveFilter(activeFilter === "URGENT" ? "ALL" : "URGENT")}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                activeFilter === "URGENT"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
              }`}
            >
              Urgent 48h Intake
            </button>
            {activeFilter !== "ALL" && (
              <button
                onClick={() => setActiveFilter("ALL")}
                className="text-xs text-on-surface-variant underline ml-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Highlights & Trend Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-6 flex flex-col justify-between shadow-sm border-t-4 border-primary">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> High Surge Alert
              </span>
              <span className="text-xs font-mono font-bold text-on-surface-variant">BDI 9.4/10</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-on-surface">Paddy (Sona Masoori BPT 5204)</h3>
            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              Aggressive bulk procurement by Miryalaguda parboiled exporters due to incoming vessel orders at Kakinada Port.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2.5 pt-3 bg-surface-container rounded-xl p-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-outline">7-Day Trajectory</div>
                <div className="text-base font-bold text-primary mt-0.5 flex items-center">
                  +24.0%
                  <span className="material-symbols-outlined text-sm ml-0.5">north_east</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-outline">Preferred Moisture</div>
                <div className="text-base font-bold text-on-surface mt-0.5">&lt; 13.5%</div>
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between text-xs pt-3 border-t border-outline-variant/30">
            <span className="text-on-surface-variant font-medium">8 Verified Millers Competing</span>
            <button
              onClick={() => setSelectedCrop("PADDY")}
              className="font-bold text-primary flex items-center gap-1 hover:underline"
            >
              Filter Tenders <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-6 flex flex-col justify-between shadow-sm border-t-4 border-error">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-error uppercase tracking-wider bg-error-container px-2.5 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[14px]">warning</span> Supply Deficit Zone
              </span>
              <span className="text-xs font-mono font-bold text-error">Shortfall Alert</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-on-surface">Suryapet & Nalgonda Mill Belt</h3>
            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              Immediate procurement deficit facing processing units with idle capacity over the upcoming weekend.
            </p>
            <div className="mt-4 bg-surface-container rounded-xl p-3">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-bold text-on-surface">Deficit Volume Gap</span>
                <span className="font-bold text-error">4,500 Qtl</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
                <div className="bg-error h-2.5 rounded-full" style={{ width: "72%" }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-on-surface-variant mt-1">
                <span>Buffer Stock: Low</span>
                <span>Target: 6,250 Qtl</span>
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between text-xs pt-3 border-t border-outline-variant/30">
            <span className="text-on-surface-variant font-medium">Transit Subsidies Offered</span>
            <Link to="/logistics" className="font-bold text-error flex items-center gap-1 hover:underline">
              Logistics Dispatch <span className="material-symbols-outlined text-sm">route</span>
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-6 flex flex-col justify-between shadow-sm border-t-4 border-tertiary">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-tertiary uppercase tracking-wider bg-tertiary-fixed px-2.5 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[14px]">workspace_premium</span> Quality Premium
              </span>
              <span className="text-xs font-mono font-bold text-tertiary">Grade Spec +</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-on-surface">Organic Finger Turmeric</h3>
            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              European nutraceutical exporters actively paying spot incentives for lab-certified high curcumin rhizomes.
            </p>
            <div className="mt-4 bg-surface-container rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant">Spot Incentive</span>
                <span className="font-headline font-bold text-base text-tertiary">+₹450 / Quintal</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Required Standard</span>
                <span className="font-bold text-on-surface bg-surface-container-high px-2 py-0.5 rounded">Curcumin &gt; 4.0%</span>
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between text-xs pt-3 border-t border-outline-variant/30">
            <span className="text-on-surface-variant font-medium">Nizamabad & Sangareddy FPOs</span>
            <button
              onClick={() => setSelectedCrop("SPICES")}
              className="font-bold text-tertiary flex items-center gap-1 hover:underline"
            >
              View Spice Tenders <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Split: Regional Map & Procurement Matrix */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-10">
        {/* Left Column: Realistic Regional Geographic Map & Geo Intel */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-low rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between h-full">
            <div>
              {/* Map Title & Zoom Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">map</span>
                    <h2 className="font-headline font-bold text-lg text-on-surface">Regional Procurement Basemap</h2>
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-medium">
                    Telangana & Andhra Pradesh Commercial Agricultural Corridors
                  </span>
                </div>

                {/* Interactive Zoom Bar */}
                <div className="flex items-center gap-1 bg-surface-container-high rounded-xl p-1 border border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(1.8, +(z + 0.2).toFixed(1)))}
                    className="w-7 h-7 rounded-lg bg-surface-container hover:bg-surface-container-highest text-on-surface flex items-center justify-center font-bold text-sm shadow-xs transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    +
                  </button>
                  <span className="text-[10px] font-mono font-bold px-1.5 text-on-surface-variant">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(0.8, +(z - 0.2).toFixed(1)))}
                    className="w-7 h-7 rounded-lg bg-surface-container hover:bg-surface-container-highest text-on-surface flex items-center justify-center font-bold text-sm shadow-xs transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setZoomLevel(1);
                      setSelectedNode(null);
                    }}
                    className="px-2 h-7 rounded-lg bg-surface-container hover:bg-surface-container-highest text-[10px] font-bold text-primary transition-colors cursor-pointer"
                    title="Reset to Default Overview"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Realistic Geographic Basemap Canvas */}
              <div className="relative bg-[#f4f1ea] rounded-xl overflow-hidden border border-outline-variant/40 shadow-inner">
                {/* Compass Rose */}
                <div className="absolute top-3 left-3 z-10 bg-white/85 backdrop-blur-xs px-2 py-1 rounded-md border border-outline-variant/20 shadow-xs flex items-center gap-1 text-[10px] font-bold text-on-surface font-mono pointer-events-none">
                  <span className="text-primary font-bold">▲ N</span>
                  <span className="text-outline">| 78°-81°E</span>
                </div>

                {/* Scale Bar */}
                <div className="absolute bottom-3 left-3 z-10 bg-white/85 backdrop-blur-xs px-2.5 py-1 rounded-md border border-outline-variant/20 shadow-xs text-[9px] font-mono font-bold text-on-surface pointer-events-none">
                  <span>0 ── 50 ── 100 km</span>
                </div>

                <div className="w-full h-[380px] sm:h-[430px] overflow-hidden flex items-center justify-center relative">
                  <svg
                    className="w-full h-full select-none transition-transform duration-300 ease-out"
                    style={{ transform: `scale(${zoomLevel})` }}
                    viewBox="0 0 540 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Background Graticule / Coordinates */}
                    <path d="M 0 100 L 540 100 M 0 200 L 540 200 M 0 300 L 540 300" stroke="#000000" strokeOpacity="0.04" strokeWidth="1" strokeDasharray="3 3" />
                    <path d="M 140 0 L 140 400 M 270 0 L 270 400 M 400 0 L 400 400" stroke="#000000" strokeOpacity="0.04" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Bay of Bengal Ocean Surface (Eastern side) */}
                    <path
                      d="M 450 0 C 460 70, 480 150, 475 220 C 470 290, 490 350, 520 400 L 540 400 L 540 0 Z"
                      fill="#e0eff5"
                    />
                    <path
                      d="M 452 0 C 462 70, 482 150, 477 220 C 472 290, 492 350, 522 400"
                      stroke="#8dc4d8"
                      strokeWidth="2"
                    />
                    <text x="500" y="190" fill="#6ba7bc" fontFamily="Nunito Sans" fontSize="10" fontWeight="700" letterSpacing="2" transform="rotate(75 500 190)">
                      BAY OF BENGAL
                    </text>

                    {/* Regional Landmass Shape (Telangana & Andhra Pradesh) */}
                    <path
                      d="M 60 50 C 120 20, 200 30, 270 50 C 350 40, 410 70, 448 110 C 455 170, 470 230, 465 290 C 450 340, 400 370, 320 380 C 220 390, 140 370, 100 330 C 60 270, 50 170, 60 50 Z"
                      fill="#ebe5d8"
                      stroke="#b5ad9e"
                      strokeWidth="1.5"
                    />

                    {/* State Demarcation Border (Telangana / AP Line) */}
                    <path
                      d="M 230 240 C 270 230, 330 240, 370 220 C 400 200, 430 180, 460 160"
                      stroke="#8a8070"
                      strokeWidth="1.5"
                      strokeDasharray="5 3"
                    />
                    <text x="210" y="145" fill="#8c8272" fontFamily="Nunito Sans" fontSize="11" fontWeight="800" opacity="0.65" letterSpacing="1">
                      TELANGANA
                    </text>
                    <text x="350" y="345" fill="#8c8272" fontFamily="Nunito Sans" fontSize="11" fontWeight="800" opacity="0.65" letterSpacing="1">
                      ANDHRA PRADESH
                    </text>

                    {/* Major River Courses: Godavari & Krishna */}
                    {/* Godavari River Course (North to East coast) */}
                    <path
                      d="M 120 40 C 180 75, 270 65, 340 100 C 400 115, 435 150, 465 175"
                      stroke="#60a5fa"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                    <text x="315" y="85" fill="#3b82f6" fontFamily="Nunito Sans" fontSize="8" fontWeight="700">
                      Godavari River
                    </text>

                    {/* Krishna River Course (West through Nalgonda/Guntur to delta) */}
                    <path
                      d="M 120 280 C 180 275, 250 260, 310 270 C 370 280, 420 290, 470 310"
                      stroke="#60a5fa"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                    <text x="220" y="280" fill="#3b82f6" fontFamily="Nunito Sans" fontSize="8" fontWeight="700">
                      Krishna River
                    </text>

                    {/* National Highway Network */}
                    {/* NH-44 (North-South: Nizamabad -> Hyderabad -> Kurnool) */}
                    <path
                      d="M 160 80 L 195 190 L 165 340"
                      stroke="#78716c"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* NH-65 (Hyderabad -> Miryalaguda Corridor -> Vijayawada) */}
                    <path
                      d="M 195 190 L 295 250 L 410 260"
                      stroke="#059669"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* NH-16 (Coastal Corridor: Guntur -> Vijayawada -> North) */}
                    <path
                      d="M 390 300 L 410 260 L 450 160"
                      stroke="#2563eb"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* NH-163 (Hyderabad -> Warangal) */}
                    <path
                      d="M 195 190 L 315 130"
                      stroke="#d97706"
                      strokeWidth="2.2"
                      strokeDasharray="4 2"
                      strokeLinecap="round"
                    />

                    {/* Highway Labels */}
                    <g transform="translate(230, 210) rotate(22)">
                      <rect x="-14" y="-7" width="28" height="14" rx="3" fill="#059669" />
                      <text x="0" y="3" fill="#ffffff" fontFamily="Nunito Sans" fontSize="7" fontWeight="800" textAnchor="middle">NH-65</text>
                    </g>
                    <g transform="translate(170, 260) rotate(80)">
                      <rect x="-14" y="-7" width="28" height="14" rx="3" fill="#78716c" />
                      <text x="0" y="3" fill="#ffffff" fontFamily="Nunito Sans" fontSize="7" fontWeight="800" textAnchor="middle">NH-44</text>
                    </g>
                    <g transform="translate(425, 205) rotate(-65)">
                      <rect x="-14" y="-7" width="28" height="14" rx="3" fill="#2563eb" />
                      <text x="0" y="3" fill="#ffffff" fontFamily="Nunito Sans" fontSize="7" fontWeight="800" textAnchor="middle">NH-16</text>
                    </g>

                    {/* Render Interactive Nodes */}
                    {mapNodes.map((node) => {
                      const isSelected = selectedNode?.id === node.id;
                      return (
                        <g
                          key={node.id}
                          className="cursor-pointer group"
                          onClick={() => setSelectedNode(node)}
                        >
                          {/* Pulsing Outer Rings for Critical Deficit or Selected Nodes */}
                          {(node.isDeficit || isSelected) && (
                            <circle
                              cx={node.cx}
                              cy={node.cy}
                              r={node.r + (isSelected ? 8 : 4)}
                              fill={node.color}
                              fillOpacity={node.isDeficit ? "0.22" : "0.15"}
                              className={node.isDeficit ? "animate-ping" : ""}
                              style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
                            />
                          )}

                          {/* Radar Halo */}
                          <circle
                            cx={node.cx}
                            cy={node.cy}
                            r={node.r}
                            fill={node.color}
                            fillOpacity={isSelected ? "0.3" : "0.14"}
                            stroke={node.color}
                            strokeWidth={isSelected ? "2" : "1"}
                            strokeDasharray={node.isDeficit ? "none" : "3 2"}
                          />

                          {/* Center Node Pin */}
                          <circle
                            cx={node.cx}
                            cy={node.cy}
                            r={isSelected ? 11 : 9}
                            fill={node.color}
                            className="shadow-sm transition-all"
                          />
                          <circle cx={node.cx} cy={node.cy} r={3.5} fill="#ffffff" />

                          {/* Node City Label with Shadow Box */}
                          <g transform={`translate(${node.cx}, ${node.cy - 16})`}>
                            <rect
                              x={-node.name.length * 3.2 - 6}
                              y="-12"
                              width={node.name.length * 6.4 + 12}
                              height="16"
                              rx="4"
                              fill="#ffffff"
                              fillOpacity="0.92"
                              stroke={isSelected ? node.color : "#d1d5db"}
                              strokeWidth={isSelected ? "1.5" : "0.8"}
                            />
                            <text
                              x="0"
                              y="0"
                              textAnchor="middle"
                              fill="#1f2937"
                              fontFamily="Nunito Sans"
                              fontSize="9.5"
                              fontWeight="800"
                            >
                              {node.name}
                            </text>
                          </g>

                          {/* Demand Badge Indicator */}
                          <g transform={`translate(${node.cx}, ${node.cy + 18})`}>
                            <rect
                              x={-node.volume.length * 2.8 - 4}
                              y="-9"
                              width={node.volume.length * 5.6 + 8}
                              height="14"
                              rx="3"
                              fill={node.isDeficit ? "#fee2e2" : node.type === "HIGH_DEMAND" ? "#d1fae5" : "#fef3c7"}
                              stroke={node.color}
                              strokeWidth="0.8"
                            />
                            <text
                              x="0"
                              y="1.5"
                              textAnchor="middle"
                              fill={node.color}
                              fontFamily="Nunito Sans"
                              fontSize="8"
                              fontWeight="800"
                            >
                              {node.volume}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Map Type Legend Bar */}
                <div className="bg-surface-container-lowest/95 backdrop-blur-md p-3 border-t border-outline-variant/30 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                    <span className="text-on-surface font-bold">Critical Deficit</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2d5a3f]"></span>
                    <span className="text-on-surface font-bold">High Demand</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                    <span className="text-on-surface font-bold">Supply Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    <span className="text-on-surface font-bold">Procurement Hub</span>
                  </div>
                </div>
              </div>

              {/* Selected Node Details Panel */}
              {selectedNode ? (
                <div className="mt-4 p-4 rounded-xl bg-surface-container-lowest border-2 border-primary/40 shadow-sm animate-fade-in">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedNode.color }}></span>
                        <h4 className="font-headline font-bold text-sm text-on-surface">
                          {selectedNode.name}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedNode.badgeColor}`}>
                          {selectedNode.typeLabel}
                        </span>
                      </div>
                      <span className="text-[11px] text-outline font-medium">
                        {selectedNode.state} • {selectedNode.highway}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedNode(null)}
                      className="text-outline hover:text-on-surface text-sm font-bold p-1 cursor-pointer"
                      title="Close Panel"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-lg bg-surface-container-low text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-outline block">Commodity Focus</span>
                      <strong className="text-on-surface">{selectedNode.commodity}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-outline block">Mandi Rate Baseline</span>
                      <strong className="text-primary">{selectedNode.mandiRate}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {selectedNode.details}
                  </p>

                  <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px]">
                    <span className="text-amber-700 italic font-medium">
                      *Illustrative regional agricultural intelligence demonstration based on APMC nodal reports.
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedCrop(selectedNode.commodity.includes("Paddy") ? "PADDY" : selectedNode.commodity.includes("Wheat") ? "WHEAT" : selectedNode.commodity.includes("Cotton") ? "COTTON" : "SPICES")}
                      className="font-bold text-primary hover:underline shrink-0 ml-2"
                    >
                      Filter Matching Tenders →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 p-3 rounded-xl bg-surface-container/60 border border-outline-variant/20 text-xs text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">touch_app</span>
                  <span>Click any city cluster node above to view crop deficit metrics and intake telemetry.</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between text-xs border-t border-outline-variant/30">
              <div className="flex items-center gap-1.5 text-on-surface-variant font-medium">
                <span className="material-symbols-outlined text-[16px] text-primary">local_shipping</span>
                <span>Corridor Radius: <strong>85 km APMC cluster</strong></span>
              </div>
              <Link to="/logistics" className="text-primary font-bold hover:underline flex items-center gap-1">
                Logistics Dispatch <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Institutional Procurement Matrix */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline font-bold text-xl text-on-surface">Verified Procurement Mandates</h2>
              <p className="text-xs text-on-surface-variant">Live institutional bids backed by audited escrow guarantees</p>
            </div>
            <span className="text-xs font-bold text-primary bg-primary-fixed px-2.5 py-1 rounded-full">
              {filteredTenders.length} Mandate{filteredTenders.length !== 1 ? "s" : ""} Available
            </span>
          </div>

          {filteredTenders.length === 0 ? (
            <div className="p-8 text-center bg-surface-container-low rounded-2xl border border-outline-variant/30">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">search_off</span>
              <p className="text-sm font-bold text-on-surface">No procurement tenders match your filters</p>
              <p className="text-xs text-on-surface-variant mt-1">Try resetting your crop or cluster selections.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCrop("ALL");
                  setSelectedCluster("ALL");
                  setActiveFilter("ALL");
                }}
                className="mt-3 px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredTenders.map((tender) => (
              <div
                key={tender.id}
                className="bg-surface-container-low rounded-2xl p-5 shadow-sm border border-outline-variant/30 hover:shadow-md transition-all flex flex-col gap-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-headline font-bold text-lg shadow-xs ${tender.badgeColor}`}>
                      {tender.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-headline font-bold text-base text-on-surface">{tender.buyer}</h3>
                        <span className="material-symbols-outlined text-primary text-[18px]" title="Escrow Verified Corporate Buyer">verified</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">location_on</span> {tender.location}
                        </span>
                        <span>•</span>
                        <span>ID: #{tender.id}</span>
                        <span>•</span>
                        <span className="text-primary font-bold">{tender.freightBenefit}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-outline uppercase tracking-wider">Offer Range</div>
                    <div className="font-headline font-bold text-xl text-primary mt-0.5">
                      ₹{tender.offerMin.toLocaleString()} - ₹{tender.offerMax.toLocaleString()}{" "}
                      <span className="text-xs font-sans text-on-surface-variant font-normal">/ {tender.unit}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-surface-container rounded-xl p-3 text-xs">
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Commodity</span>
                    <span className="font-bold text-on-surface">{tender.commodity}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Target Volume</span>
                    <span className="font-bold text-on-surface">{tender.targetVolume}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Quality Grade</span>
                    <span className="font-bold text-on-surface">{tender.grade}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Standard</span>
                    <span className="font-bold text-primary">{tender.spec}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-outline-variant/20">
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm text-tertiary">lock_clock</span>
                    <span>Escrow Locked in {tender.escrowBank}: <strong>{tender.escrowAmount}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate("/farmer/voice")}
                      className="px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-xs font-bold text-on-surface transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">mic</span> Express Voice Listing
                    </button>
                    <button
                      onClick={() => navigate(`/negotiation/${tender.id}`)}
                      className="px-4 py-2 rounded-xl bg-primary hover:opacity-95 text-xs font-bold text-on-primary transition-all shadow-xs flex items-center gap-1.5"
                    >
                      Negotiate Mandate <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Data Provenance & Ethics Notice */}
      <section className="rounded-2xl bg-surface-container p-6 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
            <span className="material-symbols-outlined">verified_user</span>
          </div>
          <div>
            <h4 className="font-headline font-bold text-sm text-on-surface">Data Provenance & Institutional Feeds</h4>
            <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed max-w-4xl">
              <strong>Illustrative Demand Data:</strong> Tenders and price bands shown are simulated institutional RFP fixtures for prototype validation. In production, feeds connect directly to APMC e-NAM, audited institutional mill ERPs, and the Unified Agriculture Market Protocol via real-time WebSockets.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          <span className="text-[11px] font-bold text-on-surface-variant">Sync: 18s ago</span>
          <Link
            to="/admin/webhooks"
            className="px-3 py-1.5 rounded-lg bg-surface-container-highest hover:bg-surface-dim text-xs font-bold text-on-surface transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-xs">refresh</span> Audit Stream
          </Link>
        </div>
      </section>
    </div>
  );
}
