import { useState } from "react";
import OfferCard from "./OfferCard";
import FairBidOfferGrid from "./FairBidOfferGrid";

export default function OfferGrid({
  offers,
  disclaimer,
  selectedBuyer,
  onSelectBuyer,
  disabled,
}) {
  const [viewMode, setViewMode] = useState("grid"); // "grid" (AG Grid) or "cards"

  if (!offers || offers.length === 0) return null;

  return (
    <section className="offers-section">
      <div className="section-heading flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <span className="eyebrow">FAIRBID COMPARISON</span>
          <h2>Compare Realtime Buyer Offers</h2>
          <p>
            Interactive financial take-home evaluation with deduction transparency and CSV export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-surface-container p-1 border border-outline-variant/30 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">table_rows</span>
              <span>AG Grid Community</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "cards"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">grid_view</span>
              <span>Card Cards</span>
            </button>
          </div>
        </div>
      </div>

      {disclaimer && (
        <div className="demo-warning mb-4">
          <span>ⓘ</span>
          <p>{disclaimer}</p>
        </div>
      )}

      {viewMode === "grid" ? (
        <FairBidOfferGrid
          offers={offers}
          selectedBuyer={selectedBuyer}
          onSelectBuyer={onSelectBuyer}
          disabled={disabled}
          title="FairBid Instant Offer Analysis Matrix"
          subtitle="Realtime net take-home comparison powered by AG Grid Community v36."
        />
      ) : (
        <div className="offers-grid">
          {offers.map((offer, index) => (
            <OfferCard
              key={offer.buyer_id || index}
              offer={offer}
              index={index}
              isSelected={selectedBuyer?.buyer_id === offer.buyer_id}
              onSelect={onSelectBuyer}
              disabled={disabled}
            />
          ))}
        </div>
      )}

      <p className="results-note mt-3">
        Real listings and binding offers are securely recorded in the authenticated database-backed marketplace.
      </p>
    </section>
  );
}
