import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { capturePayPalPayment } from "../api/payments";
import { fetchOrder } from "../api/orders";
import LoadingState from "../components/LoadingState";
import ErrorMessage from "../components/ErrorMessage";
import PaymentStatusBadge from "../components/PaymentStatusBadge";
import { formatINR, formatUSD } from "../utils/currency";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();

  // Extract order context safely from query parameters or session storage
  const queryOrderId = searchParams.get("order_id");
  const sessionOrderId = sessionStorage.getItem("active_farmpay_order_id");
  const orderId = queryOrderId || sessionOrderId;
  const paypalToken = searchParams.get("token"); // PayPal Order ID
  const payerId = searchParams.get("PayerID");

  const [loading, setLoading] = useState(Boolean(orderId));
  const [error, setError] = useState(
    !orderId
      ? "Missing FarmPay order context. Could not determine which order was approved. Please check Order History."
      : ""
  );
  const [captureData, setCaptureData] = useState(null);
  const [order, setOrder] = useState(null);

  // Prevent double-invocation in React StrictMode
  const hasCaptured = useRef(false);

  useEffect(() => {
    if (!orderId || hasCaptured.current) return;
    hasCaptured.current = true;

    async function executeCapture() {
      try {
        // First, attempt capture via backend PayPal capture endpoint
        const captureResult = await capturePayPalPayment(orderId);
        setCaptureData(captureResult);

        // Fetch refreshed order details
        const orderResult = await fetchOrder(orderId);
        setOrder(orderResult.order);

        // Clear active order from session once captured
        sessionStorage.removeItem("active_farmpay_order_id");
      } catch (err) {
        // If capture failed, check if the order was already captured previously (e.g. on page refresh)
        try {
          const checkOrderResult = await fetchOrder(orderId);
          if (checkOrderResult?.order?.paypal_capture_id) {
            setOrder(checkOrderResult.order);
            setCaptureData({
              success: true,
              sandbox_test_payment: true,
              paypal_order_id: checkOrderResult.order.paypal_order_id,
              capture_id: checkOrderResult.order.paypal_capture_id,
              test_amount: 1.0,
              test_currency: "USD",
              order: checkOrderResult.order,
              message:
                "This Sandbox test payment was previously captured and verified.",
            });
            setLoading(false);
            return;
          }
        } catch {
          // Ignore secondary error and show primary error
        }

        setError(
          err.message ||
            "Failed to complete PayPal capture. Please check backend logs."
        );
      } finally {
        setLoading(false);
      }
    }

    executeCapture();
  }, [orderId]);

  return (
    <div className="payment-result-page">
      {loading && (
        <LoadingState message="Verifying and capturing PayPal Sandbox checkout..." />
      )}

      <ErrorMessage message={error} />

      {!loading && captureData && (
        <section className="payment-receipt-card">
          <div className="receipt-header">
            <div className="receipt-icon success">✓</div>
            <span className="eyebrow">SANDBOX TEST CONFIRMATION</span>
            <h2>PayPal Sandbox Test Succeeded!</h2>
            <p>
              Your simulated checkout was approved and verified by the backend.
            </p>
          </div>

          <div className="receipt-body">
            <div className="receipt-row highlight">
              <span>Test Amount Captured</span>
              <strong>
                {formatUSD(captureData.test_amount || 1.0)}{" "}
                <span className="currency-pill">SANDBOX</span>
              </strong>
            </div>

            <div className="receipt-row">
              <span>FarmPay Order ID</span>
              <strong>{orderId}</strong>
            </div>

            {captureData.capture_id && (
              <div className="receipt-row">
                <span>PayPal Capture Reference</span>
                <code className="code-badge">{captureData.capture_id}</code>
              </div>
            )}

            {(captureData.paypal_order_id || paypalToken) && (
              <div className="receipt-row">
                <span>PayPal Order ID</span>
                <code className="code-badge">
                  {captureData.paypal_order_id || paypalToken}
                </code>
              </div>
            )}

            {payerId && (
              <div className="receipt-row">
                <span>Payer ID</span>
                <span className="text-muted">{payerId}</span>
              </div>
            )}

            {order && (
              <>
                <div className="receipt-divider" />

                <div className="receipt-row">
                  <span>Harvest Crop</span>
                  <strong>
                    {order.crop} ({order.quantity_kg} kg)
                  </strong>
                </div>

                <div className="receipt-row">
                  <span>Assigned Buyer</span>
                  <strong>{order.buyer_name}</strong>
                </div>

                <div className="receipt-row">
                  <span>Farm Location</span>
                  <strong>{order.location}</strong>
                </div>

                <div className="receipt-row">
                  <span>Estimated Net Proceeds</span>
                  <strong>{formatINR(order.net_proceeds)}</strong>
                </div>

                <div className="receipt-row">
                  <span>Order Settlement Status</span>
                  <PaymentStatusBadge
                    paymentStatus={order.payment_status}
                    captureId={order.paypal_capture_id}
                    paypalOrderId={order.paypal_order_id}
                  />
                </div>
              </>
            )}

            <div className="sandbox-info-box">
              <h4>ℹ️ Understanding Sandbox Payment Status</h4>
              <p>
                <strong>Test Capture:</strong> Verified and recorded with ID{" "}
                <code>{captureData.capture_id}</code>.
              </p>
              <p>
                <strong>FarmPay Order:</strong> Remains marked as{" "}
                <code>NOT_PAID</code>. Real-money INR settlement will be
                supported in a future phase.
              </p>
            </div>
          </div>

          <div className="receipt-actions">
            <Link to={`/orders/${orderId}`} className="primary-button">
              View Order Details
              <span aria-hidden="true">→</span>
            </Link>
            <Link to="/orders" className="secondary-button">
              Go to Order History
            </Link>
            <Link to="/" className="text-link">
              Return to Marketplace
            </Link>
          </div>
        </section>
      )}

      {!loading && error && (
        <div className="error-fallback-actions">
          <Link to={orderId ? `/orders/${orderId}` : "/orders"} className="primary-button">
            View Order Status
          </Link>
          <Link to="/" className="secondary-button">
            Return to Marketplace
          </Link>
        </div>
      )}
    </div>
  );
}
