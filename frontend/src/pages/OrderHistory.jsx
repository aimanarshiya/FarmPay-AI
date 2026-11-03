import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchOrders } from "../api/orders";
import LoadingState from "../components/LoadingState";
import ErrorMessage from "../components/ErrorMessage";
import PaymentStatusBadge from "../components/PaymentStatusBadge";
import { formatINR } from "../utils/currency";

const PAGE_SIZE = 10;

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      try {
        const data = await fetchOrders({
          limit: PAGE_SIZE,
          offset,
        });

        if (isCurrent) {
          setOrders(data.orders || []);
          setTotal(data.total || 0);
          setError("");
        }
      } catch (err) {
        if (isCurrent) {
          setError(err.message || "Failed to load order history.");
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
  }, [offset]);

  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

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

  return (
    <div className="order-history-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">ORDER RECORDS</span>
          <h1>Order History</h1>
          <p>
            Track your confirmed harvest orders and simulated digital payment
            records.
          </p>
        </div>

        <Link to="/" className="primary-button">
          <span>+ New Harvest Order</span>
        </Link>
      </div>

      <div className="phase-note">
        <span>ℹ️ Note:</span> Phase 1 displays orders stored in the local
        database. Multi-user authentication and farmer account isolation are
        scheduled for Phase 2.
      </div>

      {loading && <LoadingState message="Loading your orders..." />}

      <ErrorMessage message={error} />

      {!loading && !error && orders.length === 0 && (
        <section className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No orders found</h3>
          <p>
            You haven't confirmed any harvest orders yet. Start by exploring
            buyer offers.
          </p>
          <Link to="/" className="primary-button" style={{ marginTop: "20px" }}>
            Explore Buyer Offers
            <span aria-hidden="true">→</span>
          </Link>
        </section>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Crop & Quantity</th>
                <th>Buyer</th>
                <th>Net Proceeds</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const hasCapture = Boolean(order.paypal_capture_id);

                return (
                  <tr key={order.order_id}>
                    <td>
                      <Link
                        to={`/orders/${order.order_id}`}
                        className="order-id-link"
                      >
                        {order.order_id}
                      </Link>
                    </td>
                    <td className="text-muted">
                      {formatDate(order.created_at)}
                    </td>
                    <td>
                      <strong>{order.crop}</strong>
                      <span className="subtext">{order.quantity_kg} kg</span>
                    </td>
                    <td>
                      <span>{order.buyer_name}</span>
                      <span className="subtext">{order.location}</span>
                    </td>
                    <td>
                      <strong className="text-green">
                        {formatINR(order.net_proceeds)}
                      </strong>
                    </td>
                    <td>
                      <PaymentStatusBadge
                        paymentStatus={order.payment_status}
                        captureId={order.paypal_capture_id}
                        paypalOrderId={order.paypal_order_id}
                      />
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/orders/${order.order_id}`}
                          className="action-link"
                        >
                          View
                        </Link>
                        {!hasCapture && (
                          <Link
                            to={`/orders/${order.order_id}`}
                            className="pay-link"
                          >
                            Pay Test
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="page-button"
                disabled={offset === 0}
                onClick={() => {
                  setLoading(true);
                  setOffset(Math.max(0, offset - PAGE_SIZE));
                }}
              >
                ← Previous
              </button>
              <span className="page-indicator">
                Page {currentPage} of {totalPages} ({total} orders)
              </span>
              <button
                type="button"
                className="page-button"
                disabled={currentPage >= totalPages}
                onClick={() => {
                  setLoading(true);
                  setOffset(offset + PAGE_SIZE);
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
