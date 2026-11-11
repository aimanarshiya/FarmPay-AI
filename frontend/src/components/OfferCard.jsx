import { formatINR } from "../utils/currency";

export default function OfferCard({
  offer,
  index,
  isSelected,
  onSelect,
  disabled,
}) {
  return (
    <article
      className={`offer-card ${index === 0 ? "best-offer" : ""} ${
        isSelected ? "selected-offer" : ""
      }`}
    >
      {index === 0 && (
        <div className="best-label">Highest demo net proceeds</div>
      )}

      <div className="offer-top">
        <div className="buyer-avatar">
          {offer.buyer_name.slice(-1)}
        </div>

        <div>
          <h3>{offer.buyer_name}</h3>
          <span className="buyer-location">{offer.location}</span>
        </div>
      </div>

      <div className="net-amount">
        <span>Estimated net proceeds</span>
        <strong>{formatINR(offer.net_proceeds)}</strong>
      </div>

      <div className="offer-details">
        <div>
          <span>Price per kg</span>
          <strong>{formatINR(offer.price_per_kg)}</strong>
        </div>

        <div>
          <span>Gross amount</span>
          <strong>{formatINR(offer.gross_amount)}</strong>
        </div>

        <div>
          <span>Transport cost</span>
          <strong>{formatINR(offer.transport_cost)}</strong>
        </div>

        <div>
          <span>Quantity</span>
          <strong>{offer.quantity_kg} kg</strong>
        </div>
      </div>

      <div className="offer-footer">
        <span className="demo-tag">DEMO OFFER</span>
        <span className="offer-crop">{offer.crop}</span>
      </div>

      <button
        className={
          isSelected
            ? "select-offer-button selected-button"
            : "select-offer-button"
        }
        type="button"
        disabled={disabled}
        onClick={() => onSelect(offer)}
      >
        {isSelected ? "Selected ✓" : "Select offer"}
      </button>
    </article>
  );
}
