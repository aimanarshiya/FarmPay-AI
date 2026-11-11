import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { fetchActiveListings } from "../api/listings";
import { submitBuyerOffer, fetchMyBuyerOffers } from "../api/negotiations";
import LoadingState from "../components/LoadingState";
import ErrorMessage from "../components/ErrorMessage";
import { formatINR } from "../utils/currency";
import riceFieldImg from "../assets/farmpay-rice-fields.jpg";
import ruralMarketImg from "../assets/farmpay-rural-market.jpg";

export default function BuyerMarketplace() {
  const { user, t, language } = useAuth();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(() => ["browse", "my_bids", "profile"].includes(tabFromUrl) ? tabFromUrl : "browse");
  const [dbListings, setDbListings] = useState([]);
  const [myBids, setMyBids] = useState([]);

  // Search & Filter state
  const [cropFilter, setCropFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Bidding Modal / Drawer state
  const [biddingListing, setBiddingListing] = useState(null);
  const [bidPrice, setBidPrice] = useState("");
  const [bidQuantity, setBidQuantity] = useState("");
  const [transportCost, setTransportCost] = useState("300");
  const [notes, setNotes] = useState("");
  const [submittingBid, setSubmittingBid] = useState(false);
  const [demoNoticeListing, setDemoNoticeListing] = useState(null);

  // High-fidelity illustrative demo listings across standard AP/Telangana crops
  const sampleDemoListings = useMemo(() => [
    {
      listing_id: "DEMO-LST-101",
      crop: "Rice",
      crop_name: "Paddy Sona Masoori (BPT 5204)",
      farmer_name: "Rameshwar Rao",
      quantity_kg: 12000,
      expected_price_per_kg: 25.50,
      location: "Miryalaguda Mandi Hub",
      district: "Nalgonda",
      status: "ACTIVE",
      is_demo: true,
      category: "Cereal Grain",
      spec: "Moisture 13.5% • FAQ Grade 1",
      image_type: "rice",
    },
    {
      listing_id: "DEMO-LST-102",
      crop: "Chilli",
      crop_name: "Guntur Teja Lal Mirch (Export AAA)",
      farmer_name: "K. Venkateshwarlu",
      quantity_kg: 3500,
      expected_price_per_kg: 188.00,
      location: "Guntur Yard-3 Terminal",
      district: "Guntur",
      status: "ACTIVE",
      is_demo: true,
      category: "Cash Spice",
      spec: "Moisture < 9.8% • High Capsaicin",
      image_type: "chilli",
    },
    {
      listing_id: "DEMO-LST-103",
      crop: "Cotton",
      crop_name: "Cotton MCU-5 (Long Staple)",
      farmer_name: "Mallikarjun Reddy",
      quantity_kg: 8500,
      expected_price_per_kg: 64.00,
      location: "Warangal Ginning Yard",
      district: "Warangal",
      status: "ACTIVE",
      is_demo: true,
      category: "Fibre Crop",
      spec: "30-32mm Staple • Mic 4.0",
      image_type: "cotton",
    },
    {
      listing_id: "DEMO-LST-104",
      crop: "Turmeric",
      crop_name: "Salem Curcumin Finger Turmeric",
      farmer_name: "Srinivasa Chary",
      quantity_kg: 4200,
      expected_price_per_kg: 148.00,
      location: "Nizamabad Market Yard",
      district: "Nizamabad",
      status: "ACTIVE",
      is_demo: true,
      category: "Export Spice",
      spec: "Curcumin > 4.2% • Double Polished",
      image_type: "turmeric",
    },
    {
      listing_id: "DEMO-LST-105",
      crop: "Maize",
      crop_name: "Hybrid Yellow Feed Maize",
      farmer_name: "Bhanu Prasad",
      quantity_kg: 15000,
      expected_price_per_kg: 22.40,
      location: "Karimnagar Aggregation Hub",
      district: "Karimnagar",
      status: "ACTIVE",
      is_demo: true,
      category: "Feed Grain",
      spec: "Moisture < 12.5% • Aflatoxin Free",
      image_type: "maize",
    },
  ], []);

  const loadListings = useCallback(async () => {
    try {
      const res = await fetchActiveListings({
        crop: cropFilter,
        location: locationFilter,
        status: "ACTIVE",
      });
      setDbListings(res.listings || []);
    } catch (err) {
      setError(err.message || "Failed to load marketplace listings.");
    }
  }, [cropFilter, locationFilter]);

  useEffect(() => {
    let active = true;
    fetchActiveListings({
      crop: cropFilter,
      location: locationFilter,
      status: "ACTIVE",
    })
      .then((res) => {
        if (active) {
          setDbListings(res.listings || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Failed to load listings.");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [cropFilter, locationFilter]);

  // Combined listings: Real database records first, supplemented by labelled illustrative demo listings
  const combinedListings = useMemo(() => {
    const list = [...dbListings];
    // Filter sample demo listings by current search/filter if present
    const filteredDemos = sampleDemoListings.filter((demo) => {
      if (cropFilter && !demo.crop.toLowerCase().includes(cropFilter.toLowerCase()) && !demo.crop_name.toLowerCase().includes(cropFilter.toLowerCase())) {
        return false;
      }
      if (locationFilter && !demo.location.toLowerCase().includes(locationFilter.toLowerCase()) && !demo.district.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }
      return true;
    });

    // If real listings are fewer than 5, supplement with demo listings up to 5-6 total
    const needed = Math.max(0, 5 - list.length);
    const addedDemos = filteredDemos.slice(0, Math.max(needed, filteredDemos.length));

    return [...list, ...addedDemos];
  }, [dbListings, sampleDemoListings, cropFilter, locationFilter]);

  useEffect(() => {
    let active = true;
    if (activeTab === "my_bids" && user) {
      fetchMyBuyerOffers()
        .then((res) => {
          if (active) {
            setMyBids(res.offers || []);
          }
        })
        .catch((err) => {
          if (active) {
            setError(err.message || "Could not retrieve your bids.");
          }
        });
    }
    return () => {
      active = false;
    };
  }, [activeTab, user]);

  function openBidModal(listing) {
    if (listing.is_demo) {
      setDemoNoticeListing(listing);
      return;
    }
    setBiddingListing(listing);
    setBidPrice(listing.expected_price_per_kg?.toString() || "");
    setBidQuantity(listing.quantity_kg?.toString() || "");
    setTransportCost(Math.round(listing.quantity_kg * 0.4).toString() || "300");
    setNotes("Farmgate pickup arranged with verified weighing scales.");
    setError("");
    setSuccessMsg("");
  }

  function closeBidModal() {
    setBiddingListing(null);
    setSubmittingBid(false);
  }

  async function handleBidSubmit(e) {
    e.preventDefault();
    if (!biddingListing) return;

    setSubmittingBid(true);
    setError("");
    setSuccessMsg("");

    try {
      await submitBuyerOffer(biddingListing.listing_id, {
        price_per_kg: parseFloat(bidPrice),
        offered_quantity_kg: parseFloat(bidQuantity),
        transport_cost: parseFloat(transportCost) || 0,
        notes,
      });

      setSuccessMsg(`Offer of ₹${bidPrice}/kg submitted successfully to ${biddingListing.farmer_name}!`);
      closeBidModal();
      await loadListings();
    } catch (err) {
      setError(err.message || "Could not submit offer.");
      setSubmittingBid(false);
    }
  }

  // Calculated Preview Figures
  const previewGross = (parseFloat(bidPrice) || 0) * (parseFloat(bidQuantity) || 0);
  const previewTransport = parseFloat(transportCost) || 0;
  const previewNet = Math.max(0, previewGross - previewTransport);

  // Helper to render authentic crop photograph or thematic visual representation
  function renderCropPhotograph(lst) {
    if (lst.crop?.toLowerCase().includes("rice") || lst.image_type === "rice") {
      return (
        <div className="w-full h-44 relative overflow-hidden bg-[#244b34]">
          <img
            src={riceFieldImg}
            alt={lst.crop_name || lst.crop}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>
      );
    }

    if (lst.crop?.toLowerCase().includes("chilli") || lst.image_type === "chilli") {
      return (
        <div className="w-full h-44 relative overflow-hidden bg-gradient-to-br from-[#801313] via-[#b83230] to-[#5a0c0c] flex items-center justify-center">
          <img
            src={ruralMarketImg}
            alt={lst.crop_name || lst.crop}
            className="w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
            <span className="text-2xl">🌶️</span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">Guntur Red Chilli</span>
          </div>
        </div>
      );
    }

    if (lst.crop?.toLowerCase().includes("cotton") || lst.image_type === "cotton") {
      return (
        <div className="w-full h-44 relative overflow-hidden bg-gradient-to-br from-[#3b5249] via-[#4a7c59] to-[#293d35] flex items-center justify-center">
          <img
            src={riceFieldImg}
            alt={lst.crop_name || lst.crop}
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
            <span className="text-2xl">☁️</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-150">Warangal White Cotton</span>
          </div>
        </div>
      );
    }

    if (lst.crop?.toLowerCase().includes("turmeric") || lst.image_type === "turmeric") {
      return (
        <div className="w-full h-44 relative overflow-hidden bg-gradient-to-br from-[#9c782b] via-[#c49b38] to-[#6d5218] flex items-center justify-center">
          <img
            src={ruralMarketImg}
            alt={lst.crop_name || lst.crop}
            className="w-full h-full object-cover opacity-50 mix-blend-overlay group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
            <span className="text-2xl">🟨</span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Salem Finger Turmeric</span>
          </div>
        </div>
      );
    }

    // Default / Maize
    return (
      <div className="w-full h-44 relative overflow-hidden bg-gradient-to-br from-[#8a6519] via-[#b88c22] to-[#59420e] flex items-center justify-center">
        <img
          src={ruralMarketImg}
          alt={lst.crop_name || lst.crop}
          className="w-full h-full object-cover opacity-45 mix-blend-soft-light group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
          <span className="text-2xl">🌽</span>
          <span className="text-xs font-bold uppercase tracking-wider text-yellow-100">Hybrid Yellow Maize</span>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-dashboard-page">
      {/* 1. BUYER DASHBOARD HEADER */}
      <header className="portal-dashboard-header">
        <div className="header-meta-row">
          <span className="portal-category-badge buyer-badge">🤝 COMMERCIAL BUYER PORTAL</span>
          <span className="portal-state-tag">Verified Mandi Merchants & Millers</span>
        </div>
        <div className="header-main-row">
          <div>
            <h1>{user?.business_name || user?.name || "Commercial Buyer Marketplace"}</h1>
            <p className="header-subtext">
              {language === "te"
                ? "రైతుల తాజా పంట జాబితాలను కనుగొనండి, పారదర్శక రవాణా నిబంధనలతో బిడ్లను సమర్పించండి."
                : "Discover active farmgate harvest listings, inspect crop specifications, and submit binding price bids."}
            </p>
          </div>
          <div className="header-action-slot">
            <Link to="/orders" className="btn-service outline">
              📦 View Purchase Contracts
            </Link>
          </div>
        </div>

        {/* TABS */}
        <div className="portal-tab-bar" role="tablist">
          <button
            type="button"
            className={`portal-tab-btn ${activeTab === "browse" ? "active" : ""}`}
            onClick={() => setActiveTab("browse")}
          >
            {t("bm_tab_browse")} ({combinedListings.length})
          </button>
          <button
            type="button"
            className={`portal-tab-btn ${activeTab === "my_bids" ? "active" : ""}`}
            onClick={() => setActiveTab("my_bids")}
          >
            {t("bm_tab_my_bids")} ({myBids.length})
          </button>
          <Link to="/orders" className="portal-tab-btn link-tab">
            📦 Purchases & Orders
          </Link>
          <button
            type="button"
            className={`portal-tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            🏢 Buyer Enterprise Profile
          </button>
        </div>
      </header>

      <nav className="portal-quick-actions-box" aria-label="Buyer tools">
        <h3>Buyer tools</h3>
        <div className="actions-button-row">
          <button type="button" className="btn-service outline" onClick={() => setActiveTab("browse")}>🌾 Browse produce</button>
          <button type="button" className="btn-service outline" onClick={() => setActiveTab("my_bids")}>📑 My submitted offers</button>
          <Link to="/orders" className="btn-service outline">📦 Orders & tracking</Link>
          <Link to="/buyer/trust-passport" className="btn-service outline">🛡️ Trust Passport</Link>
          <Link to="/profile" className="btn-service outline">👤 Buyer profile</Link>
        </div>
      </nav>

      <ErrorMessage message={error} />
      {successMsg && <div className="portal-alert-success">✓ {successMsg}</div>}

      {/* TAB 1: BROWSE PRODUCE LISTINGS */}
      {activeTab === "browse" && (
        <section className="marketplace-browse-flow">
          {/* SEARCH & FILTERS BAR */}
          <div className="marketplace-filter-card">
            <div className="filter-input-wrapper">
              <span className="filter-icon">🔍</span>
              <input
                type="text"
                className="filter-text-input"
                placeholder={t("bm_filter_crop")}
                value={cropFilter}
                onChange={(e) => setCropFilter(e.target.value)}
              />
            </div>

            <div className="filter-input-wrapper">
              <span className="filter-icon">📍</span>
              <input
                type="text"
                className="filter-text-input"
                placeholder={t("bm_filter_loc")}
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>

            {(cropFilter || locationFilter) && (
              <button
                type="button"
                className="btn-clear-filters"
                onClick={() => {
                  setCropFilter("");
                  setLocationFilter("");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>

          {loading && <LoadingState message="Discovering farmgate produce listings..." />}

          {!loading && combinedListings.length === 0 && (
            <div className="portal-empty-card">
              <span className="empty-icon">🌾</span>
              <h3>No Listings Found</h3>
              <p>There are currently no active harvest listings matching your filter criteria.</p>
            </div>
          )}

          {/* LISTINGS GRID (3 Columns Desktop, 2 Medium, 1 Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {combinedListings.map((lst) => (
              <div
                key={lst.listing_id}
                className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Real Agricultural Crop Photograph Banner */}
                  <div className="relative">
                    {renderCropPhotograph(lst)}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-md">
                        {lst.crop}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      {lst.is_demo ? (
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/90 text-white shadow-xs">
                          Demo Spec
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                          Verified Farmer
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Main Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors leading-snug">
                        {lst.crop_name || lst.crop}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-4">
                      <span className="material-symbols-outlined text-[15px] text-primary">person</span>
                      <span className="font-semibold text-on-surface">Farmer: {lst.farmer_name}</span>
                      {lst.is_demo && (
                        <span className="text-[10px] text-tertiary italic">(Illustrative Specimen)</span>
                      )}
                    </div>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 mb-4 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-outline block">Available Quantity</span>
                        <strong className="text-sm font-bold text-on-surface">
                          {lst.quantity_kg?.toLocaleString()} kg
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-outline block">Target Price</span>
                        <strong className="text-sm font-bold text-primary">
                          ₹{lst.expected_price_per_kg}/kg
                        </strong>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-outline-variant/15 flex items-center gap-1 text-on-surface-variant text-[11px]">
                        <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
                        <span>{lst.location} ({lst.district || "Guntur"})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 pt-0 border-t border-outline-variant/15 mt-auto flex items-center justify-between gap-2 bg-surface-container-lowest">
                  <span className="text-[11px] font-mono text-outline">
                    {lst.listing_id}
                  </span>
                  <div className="flex items-center gap-2">
                    {lst.is_demo ? (
                      <button
                        type="button"
                        onClick={() => setDemoNoticeListing(lst)}
                        className="px-3 py-1.5 rounded-lg border border-outline-variant/40 text-xs font-bold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                    ) : (
                      <Link
                        to={`/listings/${encodeURIComponent(lst.listing_id)}`}
                        className="px-3 py-1.5 rounded-lg border border-outline-variant/40 text-xs font-bold text-on-surface hover:bg-surface-container transition-colors"
                      >
                        Details
                      </Link>
                    )}

                    {user ? (
                      <button
                        type="button"
                        className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-deep text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center gap-1"
                        onClick={() => openBidModal(lst)}
                        disabled={lst.status !== "ACTIVE"}
                      >
                        <span>Submit Bid</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        className="px-3.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold transition-colors"
                      >
                        Sign In to Bid
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Demo Notice Modal */}
      {demoNoticeListing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl border border-outline-variant/40 shadow-xl p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-amber-600">
                <span className="material-symbols-outlined">info</span>
                <h3 className="font-bold text-base text-on-surface">Illustrative Demonstration Listing</h3>
              </div>
              <button
                type="button"
                onClick={() => setDemoNoticeListing(null)}
                className="text-outline hover:text-on-surface text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs text-on-surface-variant leading-relaxed">
              <p>
                <strong>{demoNoticeListing.crop_name}</strong> ({demoNoticeListing.listing_id}) is an illustrative demonstration record provided to showcase available crop categories (Rice, Chilli, Cotton, Turmeric, Maize).
              </p>
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
                <div><strong>Farmer:</strong> {demoNoticeListing.farmer_name}</div>
                <div><strong>Location:</strong> {demoNoticeListing.location}</div>
                <div><strong>Expected Rate:</strong> ₹{demoNoticeListing.expected_price_per_kg}/kg</div>
                <div><strong>Lot Size:</strong> {demoNoticeListing.quantity_kg?.toLocaleString()} kg</div>
              </div>
              <p className="text-[11px] italic text-outline">
                To preserve trading integrity, commercial binding bids can only be placed on verified real farmer harvest listings.
              </p>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setDemoNoticeListing(null)}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY SUBMITTED BIDS */}
      {activeTab === "my_bids" && (
        <section className="marketplace-mybids-flow">
          <div className="card-header-block">
            <h3>My Active Bids & Procurement Offers</h3>
            <p>Track the status of your offers sent to farmers and monitor accepted procurement orders.</p>
          </div>

          {myBids.length === 0 ? (
            <div className="portal-empty-card">
              <span className="empty-icon">📑</span>
              <h3>No Bids Submitted Yet</h3>
              <p>Browse available farm produce in the marketplace and place your first competitive offer.</p>
              <button
                type="button"
                className="btn-service primary"
                onClick={() => setActiveTab("browse")}
              >
                Browse Harvest Listings
              </button>
            </div>
          ) : (
            <div className="bids-table-wrapper">
              <table className="portal-data-table">
                <thead>
                  <tr>
                    <th>Offer ID</th>
                    <th>Crop & Farmer</th>
                    <th>Price Quoted</th>
                    <th>Quantity</th>
                    <th>Gross Amount</th>
                    <th>Transport Deduct</th>
                    <th>Farmer Net</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myBids.map((b) => (
                    <tr key={b.offer_id}>
                      <td><code>{b.offer_id}</code></td>
                      <td>
                        <strong>{b.crop || "Harvest"}</strong>
                        <div className="table-sub">{b.farmer_name || b.location}</div>
                      </td>
                      <td>₹{b.price_per_kg?.toFixed(2)}/kg</td>
                      <td>{b.offered_quantity_kg?.toLocaleString()} kg</td>
                      <td>{formatINR(b.gross_amount)}</td>
                      <td className="text-deduct">- {formatINR(b.transport_cost)}</td>
                      <td><strong className="text-green">{formatINR(b.net_proceeds)}</strong></td>
                      <td>
                        <span className={`status-pill pill-${b.status.toLowerCase()}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB 3: BUYER PROFILE */}
      {activeTab === "profile" && (
        <section className="portal-card-container">
          <div className="card-header-block">
            <h3>Enterprise Procurement Profile</h3>
            <p>Verified business credentials for farmgate procurement and Mandi settlements.</p>
          </div>

          <div className="profile-details-grid">
            <div className="profile-field">
              <span className="profile-lbl">Buyer ID:</span>
              <strong>{user?.user_id}</strong>
            </div>
            <div className="profile-field">
              <span className="profile-lbl">Enterprise Name:</span>
              <strong>{user?.business_name || user?.name}</strong>
            </div>
            <div className="profile-field">
              <span className="profile-lbl">Representative:</span>
              <strong>{user?.name}</strong>
            </div>
            <div className="profile-field">
              <span className="profile-lbl">Business Type:</span>
              <strong>{user?.business_type || "Mandi Trader & Processor"}</strong>
            </div>
            <div className="profile-field">
              <span className="profile-lbl">Official Email:</span>
              <strong>{user?.email}</strong>
            </div>
            <div className="profile-field">
              <span className="profile-lbl">Mandi Center:</span>
              <strong>{user?.city || "Guntur Mandi Yard"}</strong>
            </div>
          </div>
        </section>
      )}

      {/* BIDDING MODAL DRAWER */}
      {biddingListing && (
        <div className="modal-overlay-backdrop" onClick={closeBidModal}>
          <div className="bid-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-strip">
              <div>
                <span className="modal-eyebrow">SUBMIT BINDING BID</span>
                <h3>{biddingListing.crop} — {biddingListing.farmer_name}</h3>
                <p className="modal-sub">
                  Listing: <code>{biddingListing.listing_id}</code> • Expected: ₹{biddingListing.expected_price_per_kg}/kg
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={closeBidModal}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBidSubmit} className="modal-form-flow">
              <div className="modal-fields-row">
                <div className="form-field-group">
                  <label htmlFor="bidPrice" className="field-label">
                    Price Offered (₹/kg) <span className="required-mark">*</span>
                  </label>
                  <input
                    id="bidPrice"
                    type="number"
                    step="0.25"
                    required
                    min="1"
                    className="form-input"
                    value={bidPrice}
                    onChange={(e) => setBidPrice(e.target.value)}
                  />
                </div>

                <div className="form-field-group">
                  <label htmlFor="bidQuantity" className="field-label">
                    Quantity Sourced (kg) <span className="required-mark">*</span>
                  </label>
                  <input
                    id="bidQuantity"
                    type="number"
                    required
                    min="1"
                    max={biddingListing.quantity_kg}
                    className="form-input"
                    value={bidQuantity}
                    onChange={(e) => setBidQuantity(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label htmlFor="transportCost" className="field-label">
                  Estimated Transport & Freight Deduction (₹)
                </label>
                <input
                  id="transportCost"
                  type="number"
                  step="10"
                  min="0"
                  className="form-input"
                  value={transportCost}
                  onChange={(e) => setTransportCost(e.target.value)}
                />
                <small className="field-hint">
                  Enter 0 for free farmgate pickup by your fleet.
                </small>
              </div>

              <div className="form-field-group">
                <label htmlFor="notes" className="field-label">
                  Logistics & Payment Notes for Farmer
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  className="form-textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* LIVE MATHEMATICAL NET PREVIEW */}
              <div className="modal-preview-box">
                <div className="preview-heading">Calculated Offer Net Proceeds</div>
                <div className="preview-math-row">
                  <span>Gross Sourcing Value:</span>
                  <strong>{formatINR(previewGross)}</strong>
                </div>
                <div className="preview-math-row text-deduct">
                  <span>Transport Deduction:</span>
                  <span>- {formatINR(previewTransport)}</span>
                </div>
                <div className="preview-divider" />
                <div className="preview-math-row preview-total">
                  <span>Farmer's Net Take-Home:</span>
                  <strong className="text-green">{formatINR(previewNet)}</strong>
                </div>
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn-cancel-modal"
                  onClick={closeBidModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit-modal"
                  disabled={submittingBid}
                >
                  {submittingBid ? "Transmitting Bid..." : "Submit Offer to Farmer →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
