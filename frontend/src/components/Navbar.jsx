import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import riceFieldImg from "../assets/farmpay-rice-fields.jpg";

export default function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated, role, logout, language, toggleLanguage, t } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="site-header">
      {/* PRIMARY NAVIGATION BAR */}
      <nav className="main-navbar" aria-label="Primary Navigation">
        <div className="main-nav-container">
          {/* Brand with authentic agricultural crop photograph */}
          <Link className="portal-brand" to="/" aria-label="FarmPay AI Home">
            <div className="portal-brand-crop-badge" aria-hidden="true">
              <img
                src={riceFieldImg}
                alt="Agricultural harvest field"
                className="brand-crop-thumb"
              />
              <span className="brand-crop-overlay-icon">🌾</span>
            </div>
            <div className="portal-brand-text">
              <span className="portal-title">{t("brand")}</span>
              <span className="portal-descriptor">{t("portal_subtitle")}</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="portal-nav-links">
            <Link
              to="/"
              className={`portal-nav-item ${location.pathname === "/" ? "active" : ""}`}
            >
              {t("nav_home")}
            </Link>

            {role === "FARMER" && (
              <Link
                to="/farmer"
                className={`portal-nav-item ${location.pathname === "/farmer" ? "active" : ""}`}
              >
                Farmer Dashboard
              </Link>
            )}

            <Link
              to="/marketplace"
              className={`portal-nav-item ${location.pathname === "/marketplace" ? "active" : ""}`}
            >
              Buyer Marketplace
            </Link>

            <Link
              to="/buyer/trust-passport"
              className={`portal-nav-item ${location.pathname === "/buyer/trust-passport" ? "active" : ""}`}
            >
              Trust Passport
            </Link>

            <Link
              to="/market/demand-radar"
              className={`portal-nav-item ${location.pathname.startsWith("/market") ? "active" : ""}`}
            >
              Demand Radar
            </Link>

            <Link
              to="/payments"
              className={`portal-nav-item ${location.pathname.startsWith("/payments") ? "active" : ""}`}
            >
              Payments & PayPal
            </Link>

            <Link
              to="/logistics"
              className={`portal-nav-item ${location.pathname.startsWith("/logistics") ? "active" : ""}`}
            >
              Logistics
            </Link>

            <Link
              to="/orders"
              className={`portal-nav-item ${location.pathname.startsWith("/orders") ? "active" : ""}`}
            >
              Track Orders
            </Link>

            {role === "ADMIN" && (
              <Link
                to="/admin"
                className={`portal-nav-item ${location.pathname === "/admin" ? "active" : ""}`}
              >
                {t("nav_admin")}
              </Link>
            )}
          </div>

          {/* User Account / Auth Actions */}
          <div className="portal-nav-actions">
            {/* Segmented Control Language Selector */}
            <div
              className="lang-segmented-control"
              role="radiogroup"
              aria-label="Select display language"
            >
              <button
                type="button"
                role="radio"
                aria-checked={language === "en"}
                className={`lang-segment-btn ${language === "en" ? "active" : ""}`}
                onClick={() => toggleLanguage("en")}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={language === "te"}
                className={`lang-segment-btn ${language === "te" ? "active" : ""}`}
                onClick={() => toggleLanguage("te")}
                title="తెలుగు భాషలోకి మారండి"
              >
                TE
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={language === "hi"}
                className={`lang-segment-btn ${language === "hi" ? "active" : ""}`}
                onClick={() => toggleLanguage("hi")}
                title="हिन्दी भाषा में बदलें"
              >
                HI
              </button>
            </div>

            {isAuthenticated && user ? (
              <div className="portal-user-chip">
                <span className={`portal-role-tag tag-${role.toLowerCase()}`}>
                  {role === "FARMER" ? "🌾 FARMER" : role === "BUYER" ? "🤝 BUYER" : "🛡️ ADMIN"}
                </span>
                <span className="portal-user-name" title={user.email}>
                  {user.name?.split(" ")[0]}
                </span>
                <Link to="/profile" className="portal-profile-link" title="Profile and language settings">
                  Profile
                </Link>
                <button
                  type="button"
                  className="portal-signout-btn"
                  onClick={logout}
                  title="Sign out of portal"
                >
                  {t("nav_logout")}
                </button>
              </div>
            ) : (
              <div className="portal-auth-cta-group">
                <Link to="/login" className="portal-login-btn">
                  {t("nav_login")}
                </Link>
                <Link to="/register/farmer" className="portal-register-primary">
                  Get Started →
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Trigger */}
            <button
              type="button"
              className="portal-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="portal-mobile-drawer">
            <Link
              to="/"
              className={`mobile-drawer-link ${location.pathname === "/" ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              🏠 {t("nav_home")}
            </Link>

            {role === "FARMER" && (
              <Link
                to="/farmer"
                className={`mobile-drawer-link ${location.pathname === "/farmer" ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                🌾 Farmer Dashboard
              </Link>
            )}

            <Link
              to="/marketplace"
              className={`mobile-drawer-link ${location.pathname === "/marketplace" ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              🛒 Buyer Marketplace
            </Link>

            <Link
              to="/buyer/trust-passport"
              className={`mobile-drawer-link ${location.pathname === "/buyer/trust-passport" ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              🛡️ Trust Passport
            </Link>

            <Link
              to="/market/demand-radar"
              className={`mobile-drawer-link ${location.pathname.startsWith("/market") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              📡 Demand Radar
            </Link>

            <Link
              to="/payments"
              className={`mobile-drawer-link ${location.pathname.startsWith("/payments") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              💳 Payments & PayPal
            </Link>

            <Link
              to="/logistics"
              className={`mobile-drawer-link ${location.pathname.startsWith("/logistics") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              🚚 Logistics
            </Link>

            <Link
              to="/orders"
              className={`mobile-drawer-link ${location.pathname.startsWith("/orders") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              📦 Track Orders
            </Link>

            {role === "ADMIN" && (
              <Link
                to="/admin"
                className={`mobile-drawer-link ${location.pathname === "/admin" ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                🛡️ {t("nav_admin")}
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to="/profile"
                className={`mobile-drawer-link ${location.pathname === "/profile" ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                👤 Profile & Language
              </Link>
            )}

            {/* Mobile Language Selector */}
            <div className="mobile-drawer-lang-row">
              <span className="drawer-lang-label">Language:</span>
              <div className="lang-segmented-control">
                <button
                  type="button"
                  className={`lang-segment-btn ${language === "en" ? "active" : ""}`}
                  onClick={() => toggleLanguage("en")}
                >
                  English
                </button>
                <button
                  type="button"
                  className={`lang-segment-btn ${language === "te" ? "active" : ""}`}
                  onClick={() => toggleLanguage("te")}
                >
                  తెలుగు
                </button>
                <button
                  type="button"
                  className={`lang-segment-btn ${language === "hi" ? "active" : ""}`}
                  onClick={() => toggleLanguage("hi")}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            {!isAuthenticated && (
              <div className="mobile-drawer-auth">
                <Link
                  to="/login"
                  className="mobile-auth-btn signin"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav_login")}
                </Link>
                <Link
                  to="/register/farmer"
                  className="mobile-auth-btn register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav_register_farmer")}
                </Link>
                <Link
                  to="/register/buyer"
                  className="mobile-auth-btn register secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav_register_buyer")}
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
