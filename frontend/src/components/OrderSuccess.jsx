import { useState } from "react";
import { Link } from "react-router-dom";
import { formatINR } from "../utils/currency";
import { createPayPalPayment } from "../api/payments";
import PaymentStatusBadge from "./PaymentStatusBadge";

export default function OrderSuccess({ order, onStartNewOrder }) {
  const [initiatingPayment, setInitiatingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  if (!order) return null;

  async function handlePayPalCheckout() {
    setInitiatingPayment(true);
    setPaymentError("");

    try {
      // Store session context before departing for PayPal
      sessionStorage.setItem("active_farmpay_order_id", order.order_id);
      sessionStorage.setItem("active_farmpay_order_time", new Date().toISOString());

      const result = await createPayPalPayment(order.order_id);

      if (!result.approval_url) {
        throw new Error("PayPal did not return an approval URL.");
      }

      // Redirect the farmer's browser to the official PayPal Sandbox checkout URL
      window.location.href = result.approval_url;
    } catch (err) {
      setPaymentError(
        err.message || "Failed to initiate PayPal Sandbox checkout. Please try again."
      );
      setInitiatingPayment(false);
    }
  }

  return (
    <section className="order-success">
      <div className="success-icon">✓</div>

      <span className="eyebrow">ORDER CREATED</span>

      <h2>Your order is ready for payment</h2>

      <p>
        Your harvest order has been recorded in FarmPay AI. You can now test the
        digital payment flow using PayPal Sandbox.
      </p>

      {paymentError && (
        <div className="error-message" role="alert">
          <span>⚠️ </span>
          {paymentError}
        </div>
      )}

      <div className="confirmation-card">
        <div className="confirmation-row">
          <span>Order ID</span>
          <strong>{order.order_id}</strong>
        </div>

        <div className="confirmation-row">
          <span>Buyer</span>
          <strong>{order.buyer_name}</strong>
        </div>

        <div className="confirmation-row">
          <span>Crop</span>
          <strong>{order.crop}</strong>
        </div>

        <div className="confirmation-row">
          <span>Quantity</span>
          <strong>{order.quantity_kg} kg</strong>
        </div>

        <div className="confirmation-row">
          <span>Estimated net proceeds</span>
          <strong>{formatINR(order.net_proceeds)}</strong>
        </div>

        <div className="confirmation-row">
          <span>Payment Status</span>
          <PaymentStatusBadge
            paymentStatus={order.payment_status}
            paypalOrderId={order.paypal_order_id}
            captureId={order.paypal_capture_id}
          />
        </div>

        <div className="paypal-cta-box">
          <div className="paypal-header">
            <span className="paypal-badge">Sandbox Checkout</span>
            <span className="paypal-amount">$1.00 USD (Test Charge)</span>
          </div>

          <p className="paypal-description">
            Complete a simulated $1.00 USD transaction in PayPal Sandbox. This
            tests payment authorization and capture without moving live money or
            settling the INR order.
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

        <div className="confirmation-disclaimer">
          <strong>Important Sandbox Disclaimer:</strong> This test checkout
          simulates digital payment. Approved captures are recorded as verified
          test receipts, but the underlying INR harvest order remains marked
          as <code>NOT_PAID</code> until live multi-currency settlement is
          supported.
        </div>
      </div>

      <div className="action-buttons-group">
        <Link to={`/orders/${order.order_id}`} className="secondary-button">
          View Order Details
        </Link>
        <button
          className="primary-button"
          type="button"
          onClick={onStartNewOrder}
        >
          Start New Order
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
