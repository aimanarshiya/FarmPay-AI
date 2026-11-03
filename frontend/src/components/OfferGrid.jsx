import OfferCard from "./OfferCard";

export default function OfferGrid({
  offers,
  disclaimer,
  selectedBuyer,
  onSelectBuyer,
  disabled,
}) {
  if (!offers || offers.length === 0) return null;

  return (
    <section className="offers-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">STEP 02</span>
          <h2>Compare buyer offers</h2>
          <p>Offers are ranked by estimated net proceeds.</p>
        </div>

        <span className="offer-count">{offers.length} offers</span>
      </div>

      {disclaimer && (
        <div className="demo-warning">
          <span>ⓘ</span>
          <p>{disclaimer}</p>
        </div>
      )}

      <div className="offers-grid">
        {offers.map((offer, index) => (
          <OfferCard
            key={offer.buyer_id}
            offer={offer}
            index={index}
            isSelected={selectedBuyer?.buyer_id === offer.buyer_id}
            onSelect={onSelectBuyer}
            disabled={disabled}
          />
        ))}
      </div>

      <p className="results-note">
        These offers use illustrative values. They are not verified buyer
        quotations or live market prices.
      </p>
    </section>
  );
}

