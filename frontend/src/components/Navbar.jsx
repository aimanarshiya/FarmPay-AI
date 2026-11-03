import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <span className="brand-icon">🌾</span>
        <span>FarmPay AI</span>
      </Link>

      <nav className="nav-links" aria-label="Main Navigation">
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "nav-link-active" : ""}`}
        >
          Marketplace
        </Link>
        <Link
          to="/orders"
          className={`nav-link ${location.pathname.startsWith("/orders") ? "nav-link-active" : ""}`}
        >
          Order History
        </Link>
      </nav>

      <div className="nav-badge-container">
        <span className="demo-badge">Phase 1 Sandbox</span>
      </div>
    </header>
  );
}

