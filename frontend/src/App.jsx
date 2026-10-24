
import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function formatINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function App() {
  const [crop, setCrop] = useState("Rice");
  const [quantity, setQuantity] = useState("500");
  const [location, setLocation] = useState("Guntur");

  const [offers, setOffers] = useState([]);
  const [disclaimer, setDisclaimer] = useState("");

  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [error, setError] = useState("");

  async function findBuyers(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setOffers([]);
    setDisclaimer("");
    setSelectedBuyer(null);
    setOrder(null);

    try {
      const response = await fetch(`${API_URL}/api/offers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          crop,
          quantity_kg: Number(quantity),
          location,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail || "Could not retrieve buyer offers."
        );
      }

      setOffers(result.offers || []);
      setDisclaimer(result.disclaimer || "");
    } catch (err) {
      setError(
        err.message ||
          "Could not connect to FarmPay AI. Check the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  function selectBuyer(offer) {
    setSelectedBuyer(offer);
    setOrder(null);
    setError("");
  }

  async function confirmOrder() {
    if (!selectedBuyer) {
      setError("Please select a buyer offer first.");
      return;
    }

    setCreatingOrder(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          crop: selectedBuyer.crop,
          quantity_kg: selectedBuyer.quantity_kg,
          location: selectedBuyer.location,
          buyer_id: selectedBuyer.buyer_id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail || "Could not create the order."
        );
      }

      setOrder(result.order);
    } catch (err) {
      setError(
        err.message ||
          "Could not create the order. Please try again."
      );
    } finally {
      setCreatingOrder(false);
    }
  }

  function startNewOrder() {
    setSelectedBuyer(null);
    setOrder(null);
    setError("");
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="/">
          <span className="brand-icon">🌾</span>
          <span>FarmPay AI</span>
        </a>

        <span className="nav-label">Farmer Marketplace</span>

        <span className="demo-badge">Prototype</span>
      </header>

      <main className="dashboard">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">
              SMARTER AGRICULTURAL COMMERCE
            </span>

            <h1>
              Your harvest.
              <br />
              <span>Better selling opportunities.</span>
            </h1>

            <p>
              Discover buyer offers, compare your earnings, and
              make informed selling decisions.
            </p>
          </div>

          <div className="hero-icon" aria-hidden="true">
            🌾
          </div>
        </section>

        <section className="request-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">STEP 01</span>
              <h2>Tell us about your harvest</h2>
              <p>
                Enter your crop details to explore buyer offers.
              </p>
            </div>
          </div>

          <form className="request-form" onSubmit={findBuyers}>
            <div className="form-grid">
              <label className="field">
                <span>Crop</span>

                <select
                  value={crop}
                  onChange={(event) => setCrop(event.target.value)}
                  required
                >
                  <option value="Rice">Rice</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Maize">Maize</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Groundnut">Groundnut</option>
                </select>
              </label>

              <label className="field">
                <span>Quantity (kg)</span>

                <input
                  type="number"
                  min="1"
                  max="100000"
                  step="0.01"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(event.target.value)
                  }
                  required
                />
              </label>

              <label className="field">
                <span>Farm location</span>

                <input
                  type="text"
                  minLength="2"
                  maxLength="100"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  placeholder="Enter your location"
                  required
                />
              </label>
            </div>

            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Finding offers..." : "Find Buyer Offers"}
              <span aria-hidden="true">→</span>
            </button>
          </form>
        </section>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {offers.length > 0 && (
          <section className="offers-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">STEP 02</span>
                <h2>Compare buyer offers</h2>
                <p>
                  Offers are ranked by estimated net proceeds.
                </p>
              </div>

              <span className="offer-count">
                {offers.length} offers
              </span>
            </div>

            <div className="demo-warning">
              <span>ⓘ</span>
              <p>{disclaimer}</p>
            </div>

            <div className="offers-grid">
              {offers.map((offer, index) => {
                const isSelected =
                  selectedBuyer?.buyer_id === offer.buyer_id;

                return (
                  <article
                    className={`offer-card ${
                      index === 0 ? "best-offer" : ""
                    } ${isSelected ? "selected-offer" : ""}`}
                    key={offer.buyer_id}
                  >
                    {index === 0 && (
                      <div className="best-label">
                        Highest demo net proceeds
                      </div>
                    )}

                    <div className="offer-top">
                      <div className="buyer-avatar">
                        {offer.buyer_name.slice(-1)}
                      </div>

                      <div>
                        <h3>{offer.buyer_name}</h3>
                        <span className="buyer-location">
                          {offer.location}
                        </span>
                      </div>
                    </div>

                    <div className="net-amount">
                      <span>Estimated net proceeds</span>

                      <strong>
                        {formatINR(offer.net_proceeds)}
                      </strong>
                    </div>

                    <div className="offer-details">
                      <div>
                        <span>Price per kg</span>
                        <strong>
                          {formatINR(offer.price_per_kg)}
                        </strong>
                      </div>

                      <div>
                        <span>Gross amount</span>
                        <strong>
                          {formatINR(offer.gross_amount)}
                        </strong>
                      </div>

                      <div>
                        <span>Transport cost</span>
                        <strong>
                          {formatINR(offer.transport_cost)}
                        </strong>
                      </div>

                      <div>
                        <span>Quantity</span>
                        <strong>{offer.quantity_kg} kg</strong>
                      </div>
                    </div>

                    <div className="offer-footer">
                      <span className="demo-tag">DEMO OFFER</span>

                      <span className="offer-crop">
                        {offer.crop}
                      </span>
                    </div>

                    <button
                      className={
                        isSelected
                          ? "select-offer-button selected-button"
                          : "select-offer-button"
                      }
                      type="button"
                      disabled={Boolean(order)}
                      onClick={() => selectBuyer(offer)}
                    >
                      {isSelected ? "Selected ✓" : "Select offer"}
                    </button>
                  </article>
                );
              })}
            </div>

            <p className="results-note">
              These offers use illustrative values. They are not
              verified buyer quotations or live market prices.
            </p>
          </section>
        )}

        {selectedBuyer && !order && (
          <section className="confirmation-section">
            <span className="eyebrow">STEP 03</span>

            <h2>Review your order</h2>

            <p>
              Check the selected buyer and estimated proceeds
              before creating your order.
            </p>

            <div className="confirmation-card">
              <div className="confirmation-row">
                <span>Buyer</span>
                <strong>{selectedBuyer.buyer_name}</strong>
              </div>

              <div className="confirmation-row">
                <span>Crop</span>
                <strong>{selectedBuyer.crop}</strong>
              </div>

              <div className="confirmation-row">
                <span>Quantity</span>
                <strong>{selectedBuyer.quantity_kg} kg</strong>
              </div>

              <div className="confirmation-row">
                <span>Location</span>
                <strong>{selectedBuyer.location}</strong>
              </div>

              <div className="confirmation-row">
                <span>Gross amount</span>
                <strong>
                  {formatINR(selectedBuyer.gross_amount)}
                </strong>
              </div>

              <div className="confirmation-row">
                <span>Transport cost</span>
                <strong>
                  {formatINR(selectedBuyer.transport_cost)}
                </strong>
              </div>

              <div className="confirmation-total">
                <span>Estimated net proceeds</span>

                <strong>
                  {formatINR(selectedBuyer.net_proceeds)}
                </strong>
              </div>

              <div className="confirmation-disclaimer">
                This is a demo offer. Confirming creates a
                pending order only. No payment will be taken.
              </div>

              <button
                className="primary-button confirm-button"
                type="button"
                disabled={creatingOrder}
                onClick={confirmOrder}
              >
                {creatingOrder
                  ? "Creating order..."
                  : "Confirm Order"}
                <span aria-hidden="true">→</span>
              </button>

              <button
                className="cancel-button"
                type="button"
                disabled={creatingOrder}
                onClick={startNewOrder}
              >
                Cancel selection
              </button>
            </div>
          </section>
        )}

        {order && (
          <section className="order-success">
            <div className="success-icon">✓</div>

            <span className="eyebrow">ORDER CREATED</span>

            <h2>Your order is ready for payment</h2>

            <p>
              Your order was created successfully. Payment has
              not been completed.
            </p>

            <div className="confirmation-card">
              <div className="confirmation-row">
                <span>Order ID</span>
                <strong>{order.order_id}</strong>
              </div>

              <div className="confirmation-row">
                <span>Buyer</span>
                <strong>{order.buyer_name}</strong>
              </div>

              <div className="confirmation-row">
                <span>Crop</span>
                <strong>{order.crop}</strong>
              </div>

              <div className="confirmation-row">
                <span>Quantity</span>
                <strong>{order.quantity_kg} kg</strong>
              </div>

              <div className="confirmation-row">
                <span>Estimated net proceeds</span>
                <strong>
                  {formatINR(order.net_proceeds)}
                </strong>
              </div>

              <div className="confirmation-row">
                <span>Order status</span>
                <strong>{order.status}</strong>
              </div>

              <div className="confirmation-row">
                <span>Payment status</span>
                <strong>{order.payment_status}</strong>
              </div>

              <div className="confirmation-disclaimer">
                This is a temporary prototype order. It is
                stored in backend memory and will be lost if
                the backend restarts.
              </div>
            </div>

            <button
              className="primary-button"
              type="button"
              onClick={startNewOrder}
            >
              Start New Order
              <span aria-hidden="true">→</span>
            </button>
          </section>
        )}

        {!loading && offers.length === 0 && !error && (
          <section className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3>Your selling journey starts here</h3>
            <p>
              Submit your harvest details to see a comparison
              of illustrative buyer offers.
            </p>
          </section>
        )}

        <footer className="footer">
          <span>🌾 FarmPay AI</span>
          <span>
            Smarter Farming. Better Selling. Simpler Payments.
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
