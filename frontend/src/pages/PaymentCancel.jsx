import { useSearchParams, Link } from "react-router-dom";

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();

  const queryOrderId = searchParams.get("order_id");
  const sessionOrderId = sessionStorage.getItem("active_farmpay_order_id");
  const orderId = queryOrderId || sessionOrderId;

  return (
    <div className="payment-result-page">
      <section className="payment-receipt-card cancel-card">
        <div className="receipt-header">
          <div className="receipt-icon warning">✕</div>
          <span className="eyebrow">SANDBOX TEST CANCELLED</span>
          <h2>PayPal Checkout Cancelled</h2>
          <p>
            You cancelled the PayPal Sandbox test transaction. No test charges
            were captured.
          </p>
        </div>

        <div className="receipt-body">
          {orderId && (
            <div className="receipt-row">
              <span>FarmPay Order ID</span>
              <strong>{orderId}</strong>
            </div>
          )}

          <div className="receipt-row">
            <span>Order Payment Status</span>
            <span className="status-pill pill-unpaid">NOT_PAID</span>
          </div>

          <div className="receipt-row">
            <span>Sandbox Test Status</span>
            <span className="status-pill pill-sandbox-cancelled">
              CHECKOUT CANCELLED
            </span>
          </div>

          <div className="sandbox-info-box">
            <h4>ℹ️ Your Harvest Order is Safe</h4>
            <p>
              Your order remains saved in the system with status{" "}
              <code>PENDING_PAYMENT</code>. You can review the order details and
              re-initiate the payment test at any time.
            </p>
          </div>
        </div>

        <div className="receipt-actions">
          {orderId && (
            <Link to={`/orders/${orderId}`} className="primary-button">
              Return to Order & Retry Payment
              <span aria-hidden="true">→</span>
            </Link>
          )}
          <Link to="/orders" className="secondary-button">
            View All Orders
          </Link>
          <Link to="/" className="text-link">
            Return to Marketplace
          </Link>
        </div>
      </section>
    </div>
  );
}
