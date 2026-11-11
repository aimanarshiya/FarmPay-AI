import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { createProduceListing, fetchMyFarmerListings } from "../api/listings";
import { fetchListingOffers, fetchAIOfferRecommendation, acceptOffer, rejectOffer } from "../api/negotiations";
import AIRecommendationCard from "../components/AIRecommendationCard";
import LoadingState from "../components/LoadingState";
import ErrorMessage from "../components/ErrorMessage";
import { formatINR } from "../utils/currency";

export default function FarmerDashboard() {
  const { user, t, language, toggleLanguage } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(() => {
    const requestedTab = searchParams.get("tab");
    return ["overview", "listings", "create", "profile"].includes(requestedTab) ? requestedTab : "overview";
  });
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [offers, setOffers] = useState([]);
  const [aiRecommendation, setAiRecommendation] = useState(null);

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Create Listing form state
  const [crop, setCrop] = useState("Rice");
  const [quantityKg, setQuantityKg] = useState("500");
  const [expectedPrice, setExpectedPrice] = useState("26.00");
  const [location, setLocation] = useState(user?.village_city || "Tenali, Guntur");
  const [submitting, setSubmitting] = useState(false);

  const selectListingForReview = useCallback(async (listing) => {
    setSelectedListing(listing);
    setAiRecommendation(null);
    setOffers([]);
    setError("");
    setAiLoading(true);

    try {
      const offerRes = await fetchListingOffers(listing.listing_id);
      setOffers(offerRes.offers || []);

      if (offerRes.offers && offerRes.offers.length > 0) {
        try {
          const aiRes = await fetchAIOfferRecommendation(listing.listing_id);
          setAiRecommendation(aiRes.recommendation);
        } catch {
          // Gracefully handled if AI is unreachable
        }
      }
    } catch (err) {
      setError(err.message || "Could not retrieve offers for listing.");
    } finally {
      setAiLoading(false);
    }
  }, []);

  const loadListings = useCallback(async () => {
    try {
      const res = await fetchMyFarmerListings();
      setListings(res.listings || []);
      if (res.listings && res.listings.length > 0 && !selectedListing) {
        selectListingForReview(res.listings[0]);
      }
    } catch (err) {
      setError(err.message || "Failed to load harvest listings.");
    }
  }, [selectedListing, selectListingForReview]);

  useEffect(() => {
    let active = true;
    fetchMyFarmerListings()
      .then((res) => {
        if (active) {
          const list = res.listings || [];
          setListings(list);
          setLoading(false);
          if (list.length > 0) {
            selectListingForReview(list[0]);
          }
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Failed to load harvest listings.");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectListingForReview]);

  async function handleCreateListing(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMsg("");

    try {
      await createProduceListing({
        crop,
        quantity_kg: parseFloat(quantityKg),
        expected_price_per_kg: parseFloat(expectedPrice),
        location,
      });
      setSuccessMsg("Harvest produce listing published successfully!");
      setActiveTab("listings");
      await loadListings();
    } catch (err) {
      setError(err.message || "Could not publish listing.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAccept(offerId) {
    if (!window.confirm("Accept this buyer offer and create a binding order?")) return;
    setError("");
    setLoading(true);

    try {
      const res = await acceptOffer(offerId);
      navigate(`/orders/${res.order.order_id}`);
    } catch (err) {
      setError(err.message || "Failed to accept offer.");
      setLoading(false);
    }
  }

  async function handleReject(offerId) {
    setError("");
    try {
      await rejectOffer(offerId);
      if (selectedListing) {
        selectListingForReview(selectedListing);
      }
    } catch (err) {
      setError(err.message || "Failed to reject offer.");
    }
  }

  // Calculate overview metrics
  const totalQuantityListed = listings.reduce((acc, l) => acc + (parseFloat(l.quantity_kg) || 0), 0);
  const activeListingsCount = listings.filter((l) => l.status === "ACTIVE").length;
  const totalOffersReceived = listings.reduce((acc, l) => acc + (parseInt(l.offer_count, 10) || 0), 0);

  return (
    <div className="portal-dashboard-page">
      {/* 1. DASHBOARD TOP HEADER */}
      <header className="portal-dashboard-header">
        <div className="header-meta-row">
          <span className="portal-category-badge">🌾 FARMER SELLING HUB</span>
          <span className="portal-state-tag">State: {user?.state || "Andhra Pradesh"}</span>
        </div>
        <div className="header-main-row">
          <div>
            <h1>{user?.name || "Farmer dashboard"}</h1>
            <p className="header-subtext">
              {language === "te"
                ? "మీ పంట వివరాలు నమోదు చేయండి, నిజమైన వ్యాపారి ఆఫర్లను సమీక్షించండి మరియు Groq AI సిఫార్సులను పొందండి."
                : "Manage harvest listings, review competitive buyer offers, and make data-driven sales decisions with Groq AI."}
            </p>
          </div>
          <div className="header-action-slot">
            <button
              type="button"
              className="btn-primary-action"
              onClick={() => setActiveTab("create")}
            >
              + List New Produce
            </button>
          </div>
        </div>

        {/* TAB CONTROLS */}
        <div className="portal-tab-bar" role="tablist">
          <button
            type="button"
            className={`portal-tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            {t("fd_tab_overview")}
          </button>
          <button
            type="button"
            className={`portal-tab-btn ${activeTab === "listings" ? "active" : ""}`}
            onClick={() => setActiveTab("listings")}
          >
            {t("fd_tab_my_listings")} ({listings.length})
          </button>
          <button
            type="button"
            className={`portal-tab-btn ${activeTab === "create" ? "active" : ""}`}
            onClick={() => setActiveTab("create")}
          >
            {t("fd_tab_create")}
          </button>
          <Link
            to="/orders"
            className="portal-tab-btn link-tab"
          >
            {t("fd_tab_orders")}
          </Link>
          <button
            type="button"
            className={`portal-tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            {t("fd_tab_profile")}
          </button>
        </div>
      </header>

      <nav className="portal-quick-actions-box" aria-label="Farmer tools">
        <h3>Farmer tools</h3>
        <div className="actions-button-row">
          <Link to="/farmer/voice" className="btn-service outline">🎙️ Voice-to-Trade</Link>
          <Link to="/fairbid" className="btn-service outline">⚖️ FairBid</Link>
          <Link to="/offers" className="btn-service outline">🤝 Received offers</Link>
          <Link to="/payments" className="btn-service outline">💳 Payment status</Link>
          <Link to="/profile" className="btn-service outline">👤 Profile & language</Link>
        </div>
      </nav>

      <ErrorMessage message={error} />
      {successMsg && <div className="portal-alert-success">✓ {successMsg}</div>}

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === "overview" && (
        <section className="portal-overview-pane">
          <div className="metrics-kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon">🌾</div>
              <div className="kpi-title">Active Harvests</div>
              <div className="kpi-value">{activeListingsCount}</div>
              <div className="kpi-sub">Total {listings.length} listed</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">⚖️</div>
              <div className="kpi-title">Total Produce Sourced</div>
              <div className="kpi-value">{totalQuantityListed.toLocaleString()} kg</div>
              <div className="kpi-sub">Across all registered crops</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">🤝</div>
              <div className="kpi-title">Offers Received</div>
              <div className="kpi-value">{totalOffersReceived}</div>
              <div className="kpi-sub">Direct commercial bids</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">🤖</div>
              <div className="kpi-title">AI Advisory Status</div>
              <div className="kpi-value active-val">Groq Active</div>
              <div className="kpi-sub">Bilingual net proceeds model</div>
            </div>
          </div>

          <div className="portal-quick-actions-box">
            <h3>Quick Actions</h3>
            <div className="actions-button-row">
              <button
                type="button"
                className="btn-service primary"
                onClick={() => setActiveTab("create")}
              >
                🌾 Post a New Harvest Listing
              </button>
              <button
                type="button"
                className="btn-service secondary"
                onClick={() => setActiveTab("listings")}
              >
                📋 Review Bids on Current Listings
              </button>
              <Link to="/orders" className="btn-service outline">
                📦 View Payment & Order History
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: CREATE LISTING */}
      {activeTab === "create" && (
        <section className="portal-card-container">
          <div className="card-header-block">
            <h3>Publish Harvest Produce for Sale</h3>
            <p>Post your crop variety and target rate to verified commercial buyers across the network.</p>
          </div>

          <form onSubmit={handleCreateListing} className="portal-form-grid">
            <div className="form-field-group">
              <label htmlFor="crop" className="field-label">
                Crop Variety <span className="required-mark">*</span>
              </label>
              <select
                id="crop"
                className="form-select"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
              >
                <option value="Rice">Sona Masoori Rice (వరి)</option>
                <option value="Cotton">Raw Cotton / Kapas (పత్తి)</option>
                <option value="Chilli">Guntur Red Chilli (ఎర్ర మిరప)</option>
                <option value="Maize">Yellow Corn / Maize (మొక్కజొన్న)</option>
                <option value="Pulses">Red Gram / Toor Dal (కందులు)</option>
                <option value="Turmeric">Haldi / Turmeric (పసుపు)</option>
              </select>
            </div>

            <div className="form-field-group">
              <label htmlFor="quantity" className="field-label">
                Harvest Quantity (kg) <span className="required-mark">*</span>
              </label>
              <input
                id="quantity"
                type="number"
                required
                min="1"
                max="1000000"
                className="form-input"
                placeholder="e.g. 500"
                value={quantityKg}
                onChange={(e) => setQuantityKg(e.target.value)}
              />
            </div>

            <div className="form-field-group">
              <label htmlFor="expectedPrice" className="field-label">
                Expected Minimum Price (₹/kg) <span className="required-mark">*</span>
              </label>
              <input
                id="expectedPrice"
                type="number"
                step="0.25"
                required
                min="1"
                className="form-input"
                placeholder="e.g. 26.00"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(e.target.value)}
              />
            </div>

            <div className="form-field-group">
              <label htmlFor="location" className="field-label">
                Farmgate Village / Mandi Location <span className="required-mark">*</span>
              </label>
              <input
                id="location"
                type="text"
                required
                className="form-input"
                placeholder="e.g. Tenali, Guntur"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-full-width">
              <button
                type="submit"
                className="btn-submit-action"
                disabled={submitting}
              >
                {submitting ? "Publishing to Marketplace..." : "Publish Produce Listing →"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* TAB 3: MY LISTINGS & REVIEW OFFERS */}
      {activeTab === "listings" && (
        <div className="farmer-split-layout">
          {/* LEFT SIDEBAR: LISTINGS LIST */}
          <aside className="portal-sidebar-pane">
            <div className="sidebar-title-row">
              <h4>My Harvest Listings</h4>
              <button
                type="button"
                className="btn-tiny-add"
                onClick={() => setActiveTab("create")}
                title="Create New Listing"
              >
                + New
              </button>
            </div>

            {loading && <LoadingState message="Loading your listings..." />}

            {!loading && listings.length === 0 && (
              <div className="sidebar-empty-box">
                <p>No listings published yet.</p>
                <button
                  type="button"
                  className="btn-small-primary"
                  onClick={() => setActiveTab("create")}
                >
                  Create First Listing
                </button>
              </div>
            )}

            <div className="sidebar-card-stack">
              {listings.map((lst) => {
                const isSelected = selectedListing?.listing_id === lst.listing_id;
                return (
                  <div
                    key={lst.listing_id}
                    className={`sidebar-item-card ${isSelected ? "selected" : ""}`}
                    onClick={() => selectListingForReview(lst)}
                  >
                    <div className="card-top-row">
                      <strong className="crop-title">{lst.crop}</strong>
                      <span className={`status-pill pill-${lst.status.toLowerCase()}`}>
                        {lst.status}
                      </span>
                    </div>
                    <div className="card-sub-row">
                      <span>{lst.quantity_kg?.toLocaleString()} kg</span>
                      <span>Target: ₹{lst.expected_price_per_kg}/kg</span>
                    </div>
                    <div className="card-bottom-row">
                      <span className="badge-offer-count">🤝 {lst.offer_count || 0} Offers</span>
                      <span className="badge-loc">📍 {lst.location}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* RIGHT MAIN PANEL: OFFERS & AI ADVISORY */}
          <main className="portal-main-pane">
            {selectedListing ? (
              <div className="listing-detail-flow">
                {/* LISTING HEADER */}
                <div className="selected-listing-banner">
                  <div>
                    <span className="meta-breadcrumb">SELECTED HARVEST FOR REVIEW</span>
                    <h2>
                      {selectedListing.crop} — {selectedListing.quantity_kg?.toLocaleString()} kg
                    </h2>
                    <p className="meta-sub">
                      ID: <code>{selectedListing.listing_id}</code> • Location: {selectedListing.location} • Target Rate: ₹{selectedListing.expected_price_per_kg}/kg
                    </p>
                  </div>
                  <div className="banner-status-box">
                    <span>Listing Status:</span>
                    <strong className={`status-pill pill-${selectedListing.status.toLowerCase()}`}>
                      {selectedListing.status}
                    </strong>
                  </div>
                </div>

                {/* AI ADVISOR CARD */}
                {aiLoading && (
                  <LoadingState message="Groq AI is evaluating calculated net proceeds across buyer bids..." />
                )}
                {!aiLoading && aiRecommendation && (
                  <div className="ai-advisory-slot">
                    <AIRecommendationCard recommendation={aiRecommendation} />
                  </div>
                )}

                {/* RECEIVED OFFERS LIST */}
                <div className="bids-section-container">
                  <div className="bids-header-row">
                    <h3>Commercial Buyer Bids ({offers.length})</h3>
                    <span className="bids-sort-note">Sorted by Highest Net Take-Home Proceeds</span>
                  </div>

                  {offers.length === 0 && !aiLoading && (
                    <div className="no-bids-card">
                      <span className="no-bids-icon">⏳</span>
                      <h4>No Bids Received Yet</h4>
                      <p>Buyers are discovering this harvest on the Marketplace. Check back shortly for competitive bids.</p>
                    </div>
                  )}

                  <div className="bids-cards-grid">
                    {offers.map((offer) => {
                      const isRecommended = aiRecommendation?.recommended_buyer_id === offer.buyer_id;
                      const isPending = offer.status === "PENDING";

                      return (
                        <div
                          key={offer.offer_id}
                          className={`bid-card ${isRecommended ? "ai-top-choice" : ""}`}
                        >
                          {isRecommended && (
                            <div className="ai-choice-badge">
                              ⭐ Groq AI Top Recommended Offer
                            </div>
                          )}

                          <div className="bid-card-head">
                            <div>
                              <h4>{offer.buyer_name}</h4>
                              <div className="bid-rate-tag">
                                ₹{offer.price_per_kg?.toFixed(2)}/kg
                              </div>
                            </div>
                            <span className={`status-pill pill-${offer.status.toLowerCase()}`}>
                              {offer.status}
                            </span>
                          </div>

                          {/* FINANCIAL BREAKDOWN */}
                          <div className="bid-math-table">
                            <div className="math-row">
                              <span>Gross Value:</span>
                              <span>{formatINR(offer.gross_amount)}</span>
                            </div>
                            <div className="math-row text-deduct">
                              <span>Transport Deduction:</span>
                              <span>- {formatINR(offer.transport_cost)}</span>
                            </div>
                            <div className="math-divider" />
                            <div className="math-row math-total">
                              <span>Net Farmer Proceeds:</span>
                              <strong className="net-highlight">{formatINR(offer.net_proceeds)}</strong>
                            </div>
                          </div>

                          {offer.notes && (
                            <div className="bid-buyer-note">
                              <strong>Buyer Logistics:</strong> "{offer.notes}"
                            </div>
                          )}

                          {isPending && selectedListing.status === "ACTIVE" && (
                            <div className="bid-actions-row">
                              <button
                                type="button"
                                className="btn-accept-offer"
                                onClick={() => handleAccept(offer.offer_id)}
                              >
                                Accept & Generate Order →
                              </button>
                              <button
                                type="button"
                                className="btn-reject-offer"
                                onClick={() => handleReject(offer.offer_id)}
                              >
                                Decline
                              </button>
                            </div>
                          )}

                          {offer.status === "ACCEPTED" && (
                            <div className="accepted-alert-banner">
                              ✓ Accepted! Contract generated. Ready for payment verification.
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-selection-box">
                <span className="select-icon">👈</span>
                <h4>Select a Produce Listing</h4>
                <p>Click on any harvest listing in the left column to inspect incoming buyer bids and Groq AI recommendation.</p>
              </div>
            )}
          </main>
        </div>
      )}

      {/* TAB 4: PROFILE SETTINGS */}
      {activeTab === "profile" && (
        <section className="portal-card-container">
          <div className="card-header-block">
            <h3>Farmer Profile & Portal Settings</h3>
            <p>Review your registered farmer credentials and preferred interface language.</p>
          </div>

          <div className="profile-details-grid">
            <div className="profile-field">
              <span className="profile-lbl">Farmer ID:</span>
              <strong>{user?.user_id}</strong>
            </div>
            <div className="profile-field">
              <span className="profile-lbl">Full Name:</span>
              <strong>{user?.name}</strong>
            </div>
            <div className="profile-field">
              <span className="profile-lbl">Email Address:</span>
              <strong>{user?.email}</strong>
            </div>
            <div className="profile-field">
              <span className="profile-lbl">Village / Mandi:</span>
              <strong>{user?.village_city || user?.location || "Tenali"}</strong>
            </div>
            <div className="profile-field">
              <span className="profile-lbl">State:</span>
              <strong>{user?.state || "Andhra Pradesh"}</strong>
            </div>
            <div className="profile-field">
              <span className="profile-lbl">Active Language:</span>
              <div className="lang-toggle-box">
                <button
                  type="button"
                  className={`btn-toggle-lang ${language === "en" ? "active" : ""}`}
                  onClick={() => toggleLanguage("en")}
                >
                  English
                </button>
                <button
                  type="button"
                  className={`btn-toggle-lang ${language === "te" ? "active" : ""}`}
                  onClick={() => toggleLanguage("te")}
                >
                  తెలుగు (Telugu)
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
