export default function HarvestForm({
  crop,
  setCrop,
  quantity,
  setQuantity,
  location,
  setLocation,
  onSubmit,
  loading,
}) {
  return (
    <section className="request-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">STEP 01</span>
          <h2>Tell us about your harvest</h2>
          <p>Enter your crop details to explore buyer offers.</p>
        </div>
      </div>

      <form className="request-form" onSubmit={onSubmit}>
        <div className="form-grid">
          <label className="field">
            <span>Crop</span>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              required
              disabled={loading}
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
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 500"
              required
              disabled={loading}
            />
          </label>

          <label className="field">
            <span>Farm location</span>
            <input
              type="text"
              minLength="2"
              maxLength="100"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Guntur"
              required
              disabled={loading}
            />
          </label>
        </div>

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Finding offers..." : "Find Buyer Offers"}
          <span aria-hidden="true">→</span>
        </button>
      </form>
    </section>
  );
}

