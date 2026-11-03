import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchOrder } from "../api/orders";
import { createPayPalPayment } from "../api/payments";
import LoadingState from "../components/LoadingState";
import ErrorMessage from "../components/ErrorMessage";
import PaymentStatusBadge from "../components/PaymentStatusBadge";
import { formatINR } from "../utils/currency";

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [initiatingPayment, setInitiatingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      try {
        const data = await fetchOrder(orderId);
        if (isCurrent) {
          setOrder(data.order);
          setError("");
        }
      } catch (err) {
        if (isCurrent) {
          setError(err.message || "Failed to load order details.");
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isCurrent = false;
    };
  }, [orderId]);

  async function handlePayPalCheckout() {
    setInitiatingPayment(true);
    setPaymentError("");

    try {
      sessionStorage.setItem("active_farmpay_order_id", order.order_id);
      const result = await createPayPalPayment(order.order_id);

      if (!result.approval_url) {
        throw new Error("PayPal did not return an approval URL.");
      }

      window.location.href = result.approval_url;
    } catch (err) {
      setPaymentError(
        err.message || "Failed to initiate PayPal checkout. Please try again."
      );
      setInitiatingPayment(false);
    }
  }

  function formatDate(isoString) {
    if (!isoString) return "N/A";
    try {
      return new Date(isoString).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  }

  if (loading) {
    return <LoadingState message="Loading order details..." />;
  }

  return (
    <div className="order-details-page">
      <div className="page-breadcrumb">
        <Link to="/orders">← Back to Order History</Link>
      </div>

      <ErrorMessage message={error} />

      {order && (
        <div className="order-details-container">
          <div className="details-header">
            <div>
              <span className="eyebrow">ORDER BREAKDOWN</span>
              <h2>Order #{order.order_id}</h2>
              <p className="order-timestamp">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>

            <PaymentStatusBadge
              paymentStatus={order.payment_status}
              captureId={order.paypal_capture_id}
              paypalOrderId={order.paypal_order_id}
            />
          </div>

          {paymentError && (
            <div className="error-message" role="alert">
              <span>⚠️ </span>
              {paymentError}
            </div>
          )}

          <div className="details-grid">
            <section className="details-card">
              <h3>🌾 Harvest & Delivery</h3>
              <div className="details-row">
                <span>Crop</span>
                <strong>{order.crop}</strong>
              </div>
              <div className="details-row">
                <span>Quantity</span>
                <strong>{order.quantity_kg} kg</strong>
              </div>
              <div className="details-row">
                <span>Farm Location</span>
                <strong>{order.location}</strong>
              </div>
              <div className="details-row">
                <span>Order Status</span>
                <span className="status-pill pill-status">{order.status}</span>
              </div>
            </section>

            <section className="details-card">
              <h3>🤝 Buyer & Financials</h3>
              <div className="details-row">
                <span>Buyer Name</span>
                <strong>{order.buyer_name}</strong>
              </div>
              <div className="details-row">
                <span>Price per kg</span>
                <strong>{formatINR(order.price_per_kg)}</strong>
              </div>
              <div className="details-row">
                <span>Gross Amount</span>
                <strong>{formatINR(order.gross_amount)}</strong>
              </div>
              <div className="details-row">
                <span>Transport Cost</span>
                <strong>{formatINR(order.transport_cost)}</strong>
              </div>
              <div className="details-row total">
                <span>Estimated Net Proceeds</span>
                <strong className="text-green">
                  {formatINR(order.net_proceeds)}
                </strong>
              </div>
            </section>
          </div>

          {/* Payment Section: either PayPal Sandbox CTA or Captured Receipt */}
          <section className="details-payment-section">
            {!order.paypal_capture_id ? (
              <div className="paypal-cta-box">
                <div className="paypal-header">
                  <span className="paypal-badge">PayPal Sandbox Test</span>
                  <span className="paypal-amount">$1.00 USD (Test Charge)</span>
                </div>

                <p className="paypal-description">
                  This order has not yet been checked out in PayPal Sandbox.
                  Click below to test the payment authorization and capture
                  flow.
                </p>

                <button
                  className="paypal-button"
                  type="button"
                  disabled={initiatingPayment}
                  onClick={handlePayPalCheckout}
                >
                  {initiatingPayment ? (
                    <span>Connecting to PayPal Sandbox...</span>
                  ) : (
                    <>
                      <span className="paypal-icon">🅿</span>
                      <span>Pay $1.00 USD with PayPal Sandbox</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="verified-receipt-box">
                <div className="verified-badge">✓ Sandbox Test Verified</div>
                <h4>PayPal Sandbox Test Capture</h4>
                <div className="receipt-row">
                  <span>PayPal Order ID</span>
                  <code className="code-badge">{order.paypal_order_id}</code>
                </div>
                <div className="receipt-row">
                  <span>PayPal Capture Reference</span>
                  <code className="code-badge">{order.paypal_capture_id}</code>
                </div>
                <div className="receipt-row">
                  <span>Simulated Charge</span>
                  <strong>$1.00 USD</strong>
                </div>
                <p className="receipt-note">
                  This simulated payment test was captured and recorded in
                  MySQL. The original INR order remains marked as{" "}
                  <code>NOT_PAID</code>.
                </p>
              </div>
            )}
          </section>

          <div className="details-footer-actions">
            <Link to="/orders" className="secondary-button">
              View All Orders
            </Link>
            <Link to="/" className="primary-button">
              Start New Order
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
