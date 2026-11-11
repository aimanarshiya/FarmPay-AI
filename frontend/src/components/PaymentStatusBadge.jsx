/**
 * Component that explicitly separates:
 * 1. FarmPay Order Payment Status (NOT_PAID vs PAID)
 * 2. PayPal Sandbox Test Status (COMPLETED, CREATED, CANCELLED, NOT_STARTED, FAILED)
 */
export default function PaymentStatusBadge({ paymentStatus, captureId, paypalOrderId, testStatus }) {
  // Derive sandbox status if not explicitly passed
  let sandboxBadge = testStatus;
  if (!sandboxBadge) {
    if (captureId) {
      sandboxBadge = "COMPLETED";
    } else if (paypalOrderId) {
      sandboxBadge = "CREATED";
    } else {
      sandboxBadge = "NOT_STARTED";
    }
  }

  const isPaid = paymentStatus === "PAID";

  return (
    <div className="status-badge-group">
      <div className="status-badge-item">
        <span className="status-label">Order Payment:</span>
        <span className={`status-pill ${isPaid ? "pill-paid" : "pill-unpaid"}`}>
          {isPaid ? "PAID" : "NOT_PAID (INR)"}
        </span>
      </div>

      <div className="status-badge-item">
        <span className="status-label">Sandbox Test:</span>
        <span className={`status-pill pill-sandbox-${sandboxBadge.toLowerCase()}`}>
          {sandboxBadge === "COMPLETED" && "TEST CAPTURED ✓ ($1.00 USD)"}
          {sandboxBadge === "CREATED" && "CHECKOUT CREATED"}
          {sandboxBadge === "NOT_STARTED" && "NOT TESTED"}
          {sandboxBadge === "CANCELLED" && "CHECKOUT CANCELLED"}
          {sandboxBadge === "FAILED" && "TEST FAILED"}
        </span>
      </div>
    </div>
  );
}
