import { useState } from "react";
import HarvestForm from "../components/HarvestForm";
import OfferGrid from "../components/OfferGrid";
import OrderConfirmation from "../components/OrderConfirmation";
import OrderSuccess from "../components/OrderSuccess";
import ErrorMessage from "../components/ErrorMessage";
import { fetchOffers } from "../api/offers";
import { createOrder } from "../api/orders";

export default function Home() {
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

  async function handleFindBuyers(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setOffers([]);
    setDisclaimer("");
    setSelectedBuyer(null);
    setOrder(null);

    try {
      const result = await fetchOffers({
        crop,
        quantityKg: quantity,
        location,
      });

      setOffers(result.offers || []);
      setDisclaimer(result.disclaimer || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectBuyer(offer) {
    setSelectedBuyer(offer);
    setOrder(null);
    setError("");
  }

  async function handleConfirmOrder() {
    if (!selectedBuyer) {
      setError("Please select a buyer offer first.");
      return;
    }

    setCreatingOrder(true);
    setError("");

    try {
      const result = await createOrder({
        crop: selectedBuyer.crop,
        quantityKg: selectedBuyer.quantity_kg,
        location: selectedBuyer.location,
        buyerId: selectedBuyer.buyer_id,
      });

      setOrder(result.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreatingOrder(false);
    }
  }

  function handleStartNewOrder() {
    setSelectedBuyer(null);
    setOrder(null);
    setError("");
  }

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">SMARTER AGRICULTURAL COMMERCE</span>

          <h1>
            Your harvest.
            <br />
            <span>Better selling opportunities.</span>
          </h1>

          <p>
            Discover buyer offers, compare your earnings, and make informed
            selling decisions with verified digital payments.
          </p>
        </div>

        <div className="hero-icon" aria-hidden="true">
          🌾
        </div>
      </section>

      <HarvestForm
        crop={crop}
        setCrop={setCrop}
        quantity={quantity}
        setQuantity={setQuantity}
        location={location}
        setLocation={setLocation}
        onSubmit={handleFindBuyers}
        loading={loading}
      />

      <ErrorMessage message={error} />

      <OfferGrid
        offers={offers}
        disclaimer={disclaimer}
        selectedBuyer={selectedBuyer}
        onSelectBuyer={handleSelectBuyer}
        disabled={Boolean(order)}
      />

      {selectedBuyer && !order && (
        <OrderConfirmation
          selectedBuyer={selectedBuyer}
          creatingOrder={creatingOrder}
          onConfirmOrder={handleConfirmOrder}
          onCancel={handleStartNewOrder}
        />
      )}

      {order && (
        <OrderSuccess order={order} onStartNewOrder={handleStartNewOrder} />
      )}

      {!loading && offers.length === 0 && !error && !order && (
        <section className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>Your selling journey starts here</h3>
          <p>
            Submit your harvest details above to see a transparent comparison
            of buyer offers.
          </p>
        </section>
      )}
    </div>
  );
}

