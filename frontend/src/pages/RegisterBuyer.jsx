import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerBuyer } from "../api/auth";
import { useAuth } from "../context/useAuth";
import ErrorMessage from "../components/ErrorMessage";

export default function RegisterBuyer() {
  const [form, setForm] = useState({
    name: "",
    business_name: "",
    business_type: "Mandi Trader",
    email: "",
    phone: "",
    password: "",
    city: "Guntur",
    district: "Guntur",
    state: "Andhra Pradesh",
    preferred_language: "en",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await registerBuyer(form);
      login(res.access_token, res.user);
      navigate("/marketplace");
    } catch (err) {
      setError(err.message || "Buyer registration failed. Please review your details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="portal-auth-container">
      <div className="auth-card-wrapper wide">
        <div className="auth-header-strip">
          <div className="auth-shield-icon">🤝</div>
          <h2>Commercial Buyer Registration</h2>
          <p className="auth-subtext">
            Register your enterprise or trading firm to discover verified farmgate listings and submit binding bids.
          </p>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="portal-form-grid">
          <div className="form-field-group">
            <label htmlFor="name" className="field-label">
              Representative Name <span className="required-mark">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="form-input"
              placeholder="e.g. K. V. Satyanarayana"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-field-group">
            <label htmlFor="business_name" className="field-label">
              Enterprise / Trading Firm Name <span className="required-mark">*</span>
            </label>
            <input
              id="business_name"
              name="business_name"
              type="text"
              required
              className="form-input"
              placeholder="e.g. Sri Lakshmi Agro Traders"
              value={form.business_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-field-group">
            <label htmlFor="business_type" className="field-label">
              Business Entity Type
            </label>
            <select
              id="business_type"
              name="business_type"
              className="form-select"
              value={form.business_type}
              onChange={handleChange}
            >
              <option value="Mandi Trader">Licensed Mandi Merchant / Commission Agent</option>
              <option value="Rice Mill">Rice Milling & Processing Unit</option>
              <option value="Cotton Ginning">Cotton Ginning & Pressing Facility</option>
              <option value="Food Processor">Commercial Food Processor</option>
              <option value="FPO">Farmer Producer Organization (FPO)</option>
              <option value="Exporter">Agricultural Exporter</option>
            </select>
          </div>

          <div className="form-field-group">
            <label htmlFor="email" className="field-label">
              Official Email Address <span className="required-mark">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="form-input"
              placeholder="buyer.enterprise@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-field-group">
            <label htmlFor="phone" className="field-label">
              Contact Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="form-input"
              placeholder="+91 98480 12345"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-field-group">
            <label htmlFor="password" className="field-label">
              Password (min. 6 characters) <span className="required-mark">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="form-input"
              placeholder="••••••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-field-group">
            <label htmlFor="city" className="field-label">
              Operating City / Mandi Location <span className="required-mark">*</span>
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              className="form-input"
              placeholder="e.g. Guntur"
              value={form.city}
              onChange={handleChange}
            />
          </div>

          <div className="form-field-group">
            <label htmlFor="district" className="field-label">
              District
            </label>
            <select
              id="district"
              name="district"
              className="form-select"
              value={form.district}
              onChange={handleChange}
            >
              <option value="Guntur">Guntur</option>
              <option value="Krishna">Krishna</option>
              <option value="Prakasam">Prakasam</option>
              <option value="East Godavari">East Godavari</option>
              <option value="West Godavari">West Godavari</option>
              <option value="Kurnool">Kurnool</option>
              <option value="Warangal">Warangal</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>

          <div className="form-full-width">
            <button
              type="submit"
              className="btn-submit-auth buyer"
              disabled={loading}
            >
              {loading ? "Registering Commercial Account..." : "Create Buyer Account →"}
            </button>
          </div>
        </form>

        <div className="auth-card-footer">
          <span>Already registered? </span>
          <Link to="/login" className="portal-text-link">Sign In to Your Account</Link>
          <span className="divider-dot">•</span>
          <Link to="/register/farmer" className="portal-text-link">Register as Farmer</Link>
        </div>
      </div>
    </div>
  );
}
