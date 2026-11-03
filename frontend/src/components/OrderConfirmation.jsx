import { formatINR } from "../utils/currency";

export default function OrderConfirmation({
  selectedBuyer,
  creatingOrder,
  onConfirmOrder,
  onCancel,
}) {
  if (!selectedBuyer) return null;

  return (
    <section className="confirmation-section">
      <span className="eyebrow">STEP 03</span>

      <h2>Review your order</h2>

      <p>
        Check the selected buyer and estimated proceeds before creating your
        order.
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
          <strong>{formatINR(selectedBuyer.gross_amount)}</strong>
        </div>

        <div className="confirmation-row">
          <span>Transport cost</span>
          <strong>{formatINR(selectedBuyer.transport_cost)}</strong>
        </div>

        <div className="confirmation-total">
          <span>Estimated net proceeds</span>
          <strong>{formatINR(selectedBuyer.net_proceeds)}</strong>
        </div>

        <div className="confirmation-disclaimer">
          Your order will be stored securely in FarmPay AI. Payment is not yet
          completed. After confirmation, you can initiate a $1.00 USD PayPal
          Sandbox test transaction.
        </div>

        <button
          className="primary-button confirm-button"
          type="button"
          disabled={creatingOrder}
          onClick={onConfirmOrder}
        >
          {creatingOrder ? "Creating order..." : "Confirm Order"}
          <span aria-hidden="true">→</span>
        </button>

        <button
          className="cancel-button"
          type="button"
          disabled={creatingOrder}
          onClick={onCancel}
        >
          Cancel selection
        </button>
      </div>
    </section>
  );
}

