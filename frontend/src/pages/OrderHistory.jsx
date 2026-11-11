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
    <div className="portal-dashboard-page">
      <header className="portal-dashboard-header">
        <div className="header-meta-row">
          <span className="portal-category-badge">📦 PROCUREMENT REGISTRY</span>
          <span className="portal-state-tag">Digital Agricultural Contracts</span>
        </div>
        <div className="header-main-row">
          <div>
            <h1>Agricultural Order & Settlement Registry</h1>
            <p className="header-subtext">
              Comprehensive record of accepted harvest procurement agreements, delivery logistics, and verified digital payment status.
            </p>
          </div>
          <div className="header-action-slot">
            <Link to="/farmer" className="btn-primary-action">
              + New Produce Listing
            </Link>
          </div>
        </div>
      </header>

      {/* INFORMATIONAL SETTLEMENT NOTICE */}
      <div className="portal-info-banner">
        <span className="info-icon">ℹ️</span>
        <div>
          <strong>Agricultural Settlement Architecture:</strong> Harvest contracts are established in Indian Rupees (INR). Digital payment verification via PayPal Sandbox ($1.00 USD simulated authorization) is integrated for checkout gateway testing, keeping agricultural settlement strictly separate.
        </div>
      </div>

      {loading && <LoadingState message="Loading procurement orders..." />}
      <ErrorMessage message={error} />

      {!loading && !error && orders.length === 0 && (
        <section className="portal-empty-card">
          <span className="empty-icon">📋</span>
          <h3>No Orders Found</h3>
          <p>Orders are generated when a farmer accepts a buyer's competitive bid.</p>
          <Link to="/farmer" className="btn-service primary">
            Open Farmer Portal
          </Link>
        </section>
      )}

      {!loading && !error && orders.length > 0 && (
        <section className="portal-card-container">
          <div className="bids-table-wrapper">
            <table className="portal-data-table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Harvest & Buyer</th>
                  <th>Quantity</th>
                  <th>Net Payout (INR)</th>
                  <th>Order Status</th>
                  <th>INR Payment</th>
                  <th>PayPal Test</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const hasCapture = Boolean(order.paypal_capture_id);
                  return (
                    <tr key={order.order_id}>
                      <td>
                        <code>{order.order_id}</code>
                        {order.offer_type === "DEMO" && (
                          <span className="type-badge-mini">SIMULATOR</span>
                        )}
                      </td>
                      <td>
                        <strong>{order.crop}</strong>
                        <div className="table-sub">{order.buyer_name}</div>
                      </td>
                      <td>{order.quantity_kg?.toLocaleString()} kg</td>
                      <td>
                        <strong className="text-green">{formatINR(order.net_proceeds)}</strong>
                      </td>
                      <td>
                        <span className={`status-pill pill-${order.status?.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <PaymentStatusBadge status={order.payment_status} />
                      </td>
                      <td>
                        {hasCapture ? (
                          <span className="paypal-verified-tag" title={`Capture: ${order.paypal_capture_id}`}>
                            ✓ Captured
                          </span>
                        ) : (
                          <span className="paypal-unverified-tag">
                            Uncaptured
                          </span>
                        )}
                      </td>
                      <td>
                        <small>{formatDate(order.created_at)}</small>
                      </td>
                      <td>
                        <Link
                          to={`/orders/${order.order_id}`}
                          className="table-action-btn"
                        >
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="portal-pagination-bar">
              <span className="page-summary">
                Showing {offset + 1} – {Math.min(offset + PAGE_SIZE, total)} of {total} orders
              </span>
              <div className="page-buttons">
                <button
                  type="button"
                  className="btn-page"
                  disabled={offset === 0}
                  onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
                >
                  ← Previous
                </button>
                <span className="page-indicator">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  className="btn-page"
                  disabled={offset + PAGE_SIZE >= total}
                  onClick={() => setOffset(offset + PAGE_SIZE)}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
