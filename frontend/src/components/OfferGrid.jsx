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
          <span className="eyebrow">DEMO ONLY</span>
          <h2>Compare illustrative sample offers</h2>
          <p>These examples are not real buyer bids and cannot be accepted as orders.</p>
        </div>

        <span className="offer-count">{offers.length} sample offers</span>
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
        Real listings and binding offers are available in the authenticated database-backed marketplace.
      </p>
    </section>
  );
}
