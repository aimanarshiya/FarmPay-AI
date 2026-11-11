import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const languageNames = {
  en: "English",
  te: "తెలుగు",
  hi: "हिन्दी",
};

const roleHomes = {
  FARMER: { path: "/farmer", label: "Farmer workspace" },
  BUYER: { path: "/marketplace", label: "Buyer marketplace" },
  ADMIN: { path: "/admin", label: "Admin console" },
};

export default function ProfileSettings() {
  const { user, role, language, toggleLanguage } = useAuth();
  const roleHome = roleHomes[role] || roleHomes.FARMER;

  return (
    <div className="portal-dashboard-page">
      <header className="portal-dashboard-header">
        <div className="header-meta-row">
          <span className="portal-category-badge">👤 ACCOUNT SETTINGS</span>
          <span className="portal-state-tag">Your signed-in FarmPay account</span>
        </div>
        <div className="header-main-row">
          <div>
            <h1>Profile & language</h1>
            <p className="header-subtext">Review your account details and choose your preferred interface language.</p>
          </div>
          <Link className="btn-service primary" to={roleHome.path}>{roleHome.label} <span aria-hidden="true">→</span></Link>
        </div>
      </header>

      <section className="profile-settings-card" aria-labelledby="profile-details-title">
        <h2 id="profile-details-title">Account details</h2>
        <p className="header-subtext">These details are supplied by your authenticated account. Profile editing is not available here.</p>
        <div className="profile-fields">
          <div className="profile-field"><span>Name</span><strong>{user?.name || "Not provided"}</strong></div>
          <div className="profile-field"><span>Email</span><strong>{user?.email || "Not provided"}</strong></div>
          <div className="profile-field"><span>Account type</span><strong>{role || "Not provided"}</strong></div>
          <div className="profile-field"><span>Business / location</span><strong>{user?.business_name || user?.village_city || user?.district || "Not provided"}</strong></div>
        </div>

        <h3>Interface language</h3>
        <p className="header-subtext">Your preference is saved in this browser.</p>
        <div className="profile-language-control" role="group" aria-label="Interface language">
          {Object.entries(languageNames).map(([code, name]) => (
            <button
              type="button"
              key={code}
              aria-pressed={language === code}
              onClick={() => toggleLanguage(code)}
            >
              {name}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
