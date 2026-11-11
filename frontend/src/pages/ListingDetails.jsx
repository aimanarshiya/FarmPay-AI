import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchListingDetails } from "../api/listings";
import { submitBuyerOffer } from "../api/negotiations";
import ErrorMessage from "../components/ErrorMessage";
import LoadingState from "../components/LoadingState";
import { useAuth } from "../context/useAuth";
import { formatINR } from "../utils/currency";

function ListingOfferForm({ listing }) {
  const [price, setPrice] = useState(String(listing.expected_price_per_kg || ""));
  const [quantity, setQuantity] = useState(String(listing.quantity_kg || ""));
  const [transport, setTransport] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const gross = (Number(price) || 0) * (Number(quantity) || 0);
  const net = Math.max(0, gross - (Number(transport) || 0));

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await submitBuyerOffer(listing.listing_id, {
        price_per_kg: Number(price),
        offered_quantity_kg: Number(quantity),
        transport_cost: Number(transport),
        notes: notes.trim(),
      });
      setSuccess("Your offer was submitted to the farmer.");
    } catch (requestError) {
      setError(requestError.message || "Unable to submit your offer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="portal-form" onSubmit={handleSubmit}>
      <ErrorMessage message={error} />
      {success && <div className="portal-alert-success" role="status">{success}</div>}
      <div className="form-field-group">
        <label className="field-label" htmlFor="detail-offer-price">Offer price (₹/kg)</label>
        <input id="detail-offer-price" className="form-input" type="number" min="0.01" step="0.01" required value={price} onChange={(event) => setPrice(event.target.value)} />
      </div>
      <div className="form-field-group">
        <label className="field-label" htmlFor="detail-offer-quantity">Quantity (kg)</label>
        <input id="detail-offer-quantity" className="form-input" type="number" min="0.01" max={listing.quantity_kg} step="0.01" required value={quantity} onChange={(event) => setQuantity(event.target.value)} />
      </div>
      <div className="form-field-group">
        <label className="field-label" htmlFor="detail-offer-transport">Disclosed transport cost (₹)</label>
        <input id="detail-offer-transport" className="form-input" type="number" min="0" step="0.01" required value={transport} onChange={(event) => setTransport(event.target.value)} />
      </div>
      <div className="form-field-group">
        <label className="field-label" htmlFor="detail-offer-notes">Pickup / delivery notes</label>
        <textarea id="detail-offer-notes" className="form-input" rows="3" value={notes} onChange={(event) => setNotes(event.target.value)} />
      </div>
      <p className="header-subtext">Preview: {formatINR(gross)} gross − {formatINR(Number(transport) || 0)} transport = {formatINR(net)} estimated net.</p>
      <button type="submit" className="btn-primary-action" disabled={submitting}>
        {submitting ? "Submitting offer..." : "Submit offer to farmer"}
      </button>
    </form>
  );
}

export default function ListingDetails() {
  const { listingId } = useParams();
  const { role } = useAuth();
  const backPath = role === "FARMER" ? "/farmer?tab=listings" : role === "ADMIN" ? "/admin?tab=listings" : "/marketplace";
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchListingDetails(listingId)
      .then((response) => {
        if (active) setListing(response.listing || null);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load this produce listing.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [listingId]);

  return (
    <div className="portal-dashboard-page">
      <div className="page-breadcrumb"><Link to={backPath}>← Back to listings</Link></div>
      {loading && <LoadingState message="Loading listing details..." />}
      <ErrorMessage message={error} />

      {!loading && !error && !listing && (
        <section className="portal-empty-card" role="status">
          <span className="empty-icon" aria-hidden="true">🌾</span>
          <h2>Listing unavailable</h2>
          <p>This listing could not be found or is no longer available.</p>
          <Link to="/marketplace" className="btn-service primary">Return to marketplace</Link>
        </section>
      )}

      {!loading && listing && (
        <>
          <header className="portal-dashboard-header">
            <div className="header-meta-row">
              <span className="portal-category-badge">🌾 PRODUCE LISTING</span>
              <span className="portal-state-tag">Listing reference: {listing.listing_id}</span>
            </div>
            <div className="header-main-row">
              <div>
                <h1>{listing.crop}</h1>
                <p className="header-subtext">Harvest offered by {listing.farmer_name || "a FarmPay farmer"} in {listing.location || "the listed region"}.</p>
              </div>
              <span className={`status-pill pill-${String(listing.status || "active").toLowerCase()}`}>{listing.status || "Available"}</span>
            </div>
          </header>

          <div className="listing-detail-layout">
            <section className="listing-detail-card">
              <h2>Harvest details</h2>
              <p className="header-subtext">Review the farmer's stated quantity, location and target price before making an offer.</p>
              <div className="listing-detail-facts">
                <div className="listing-detail-fact"><span>Available quantity</span><strong>{Number(listing.quantity_kg || 0).toLocaleString()} kg</strong></div>
                <div className="listing-detail-fact"><span>Target minimum price</span><strong>{formatINR(listing.expected_price_per_kg)} / kg</strong></div>
                <div className="listing-detail-fact"><span>Location</span><strong>{listing.location || "Not provided"}</strong></div>
                <div className="listing-detail-fact"><span>District</span><strong>{listing.district || "Not provided"}</strong></div>
              </div>
              <p className="header-subtext">Offer amount, transport deductions and net proceeds are shown for review before an offer is submitted.</p>
            </section>
            <aside className="listing-detail-card">
              <h2>Interested in this harvest?</h2>
              <p className="header-subtext">State your price and transport cost clearly. The offer is sent to the farmer for review.</p>
              {role === "BUYER" ? (
                listing.status === "ACTIVE"
                  ? <ListingOfferForm listing={listing} />
                  : <div className="portal-info-banner" role="status">This listing is not accepting new offers.</div>
              ) : role === "FARMER" ? (
                <Link to="/farmer?tab=listings" className="btn-service outline">Return to my listings</Link>
              ) : (
                <Link to="/admin?tab=listings" className="btn-service outline">Return to listings</Link>
              )}
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
