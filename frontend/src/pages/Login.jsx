import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/useAuth";
import ErrorMessage from "../components/ErrorMessage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, t } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const demoAccounts = [
    {
      label: t("login_demo_farmer"),
      email: import.meta.env.VITE_DEMO_FARMER_EMAIL,
      password: import.meta.env.VITE_DEMO_FARMER_PASSWORD,
    },
    {
      label: t("login_demo_buyer"),
      email: import.meta.env.VITE_DEMO_BUYER_EMAIL,
      password: import.meta.env.VITE_DEMO_BUYER_PASSWORD,
    },
    {
      label: t("login_demo_admin"),
      email: import.meta.env.VITE_DEMO_ADMIN_EMAIL,
      password: import.meta.env.VITE_DEMO_ADMIN_PASSWORD,
    },
  ].filter((account) => account.email && account.password);
  const showDemoAccounts = import.meta.env.DEV &&
    import.meta.env.VITE_DEMO_MODE === "true" &&
    demoAccounts.length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      login(res.access_token, res.user);

      const returnPath = location.state?.from?.pathname;
      if (returnPath) {
        navigate(returnPath, { replace: true });
      } else if (res.user.role === "FARMER") {
        navigate("/farmer");
      } else if (res.user.role === "BUYER") {
        navigate("/marketplace");
      } else if (res.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  }

  function handleQuickFill(account) {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  }

  return (
    <div className="portal-auth-container">
      <div className="auth-card-wrapper">
        <div className="auth-header-strip">
          <div className="auth-shield-icon">🔐</div>
          <h2>{t("login_portal_title")}</h2>
          <p className="auth-subtext">{t("login_portal_subtitle")}</p>
        </div>

        {showDemoAccounts && (
          <div className="judge-credential-banner">
            <div className="judge-banner-header">
              <span className="badge-judge">{t("login_demo_banner")}</span>
            </div>
            <p className="judge-banner-hint">{t("login_demo_hint")}</p>
            <div className="judge-btn-grid">
              {demoAccounts.map((account) => (
                <button
                  key={account.label}
                  type="button"
                  className={`quickfill-pill ${account.label.split(" ")[0].toLowerCase()}`}
                  onClick={() => handleQuickFill(account)}
                >
                  {account.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="portal-form">
          <div className="form-field-group">
            <label htmlFor="email" className="field-label">
              {t("login_email_label")} <span className="required-mark">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="form-input"
              placeholder={t("login_email_placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field-group">
            <label htmlFor="password" className="field-label">
              {t("login_password_label")} <span className="required-mark">*</span>
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              className="form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-submit-auth"
            disabled={loading}
          >
            {loading ? t("login_submitting") : t("login_submit")}
          </button>
        </form>

        <div className="auth-card-footer">
          <div className="register-prompt">
            <span>{t("login_new_user")}</span>
            <div className="reg-links-row">
              <Link to="/register/farmer" className="reg-link-btn">
                🌾 {t("login_register_farmer")}
              </Link>
              <Link to="/register/buyer" className="reg-link-btn buyer">
                🤝 {t("login_register_buyer")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
