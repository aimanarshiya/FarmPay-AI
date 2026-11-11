import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerFarmer } from "../api/auth";
import { useAuth } from "../context/useAuth";
import ErrorMessage from "../components/ErrorMessage";

export default function RegisterFarmer() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    village_city: "",
    district: "Guntur",
    state: "Andhra Pradesh",
    land_acres: "",
    primary_crop: "Rice",
    preferred_language: "te",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, language } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        land_acres: form.land_acres ? parseFloat(form.land_acres) : null,
      };
      const res = await registerFarmer(payload);
      login(res.access_token, res.user);
      navigate("/farmer");
    } catch (err) {
      setError(err.message || "Farmer registration failed. Please review your details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="portal-auth-container">
      <div className="auth-card-wrapper wide">
        <div className="auth-header-strip">
          <div className="auth-shield-icon">🌾</div>
          <h2>Farmer Account Registration</h2>
          <p className="auth-subtext">
            {language === "te"
              ? "మీ పంటను నేరుగా విక్రయించడానికి, పోటీ వ్యాపారి ఆఫర్లను పొందడానికి మరియు AI సలహాలను వీక్షించడానికి నమోదు చేసుకోండి."
              : "Register to list your harvested crops, review verified competitive bids, and receive Groq AI net income advice."}
          </p>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="portal-form-grid">
          <div className="form-field-group">
            <label htmlFor="name" className="field-label">
              Farmer Full Name <span className="required-mark">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="form-input"
              placeholder="e.g. Ramesh Patel"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-field-group">
            <label htmlFor="email" className="field-label">
              Email Address <span className="required-mark">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="form-input"
              placeholder="farmer.ramesh@farmpay.demo"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-field-group">
            <label htmlFor="phone" className="field-label">
              Mobile Contact Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="form-input"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-field-group">
            <label htmlFor="password" className="field-label">
              Portal Password (min. 6 characters) <span className="required-mark">*</span>
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
            <label htmlFor="village_city" className="field-label">
              Village / Town / Location <span className="required-mark">*</span>
            </label>
            <input
              id="village_city"
              name="village_city"
              type="text"
              required
              className="form-input"
              placeholder="e.g. Tenali"
              value={form.village_city}
              onChange={handleChange}
            />
          </div>

          <div className="form-field-group">
            <label htmlFor="district" className="field-label">
              District <span className="required-mark">*</span>
            </label>
            <select
              id="district"
              name="district"
              className="form-select"
              value={form.district}
              onChange={handleChange}
            >
              <option value="Guntur">Guntur (గుంటూరు)</option>
              <option value="Krishna">Krishna (కృష్ణా)</option>
              <option value="Prakasam">Prakasam (ప్రకాశం)</option>
              <option value="East Godavari">East Godavari (తూర్పు గోదావరి)</option>
              <option value="West Godavari">West Godavari (పశ్చిమ గోదావరి)</option>
              <option value="Kurnool">Kurnool (కర్నూలు)</option>
              <option value="Warangal">Warangal (వరంగల్)</option>
              <option value="Khammam">Khammam (ఖమ్మం)</option>
            </select>
          </div>

          <div className="form-field-group">
            <label htmlFor="primary_crop" className="field-label">
              Primary Harvested Crop
            </label>
            <select
              id="primary_crop"
              name="primary_crop"
              className="form-select"
              value={form.primary_crop}
              onChange={handleChange}
            >
              <option value="Rice">Rice / Paddy (వరి)</option>
              <option value="Cotton">Cotton (పత్తి)</option>
              <option value="Chilli">Guntur Chilli (మిరప)</option>
              <option value="Maize">Maize / Corn (మొక్కజొన్న)</option>
              <option value="Pulses">Pulses / Dal (పప్పుధాన్యాలు)</option>
              <option value="Turmeric">Turmeric (పసుపు)</option>
            </select>
          </div>

          <div className="form-field-group">
            <label htmlFor="land_acres" className="field-label">
              Land Holding (Acres)
            </label>
            <input
              id="land_acres"
              name="land_acres"
              type="number"
              step="0.5"
              min="0"
              className="form-input"
              placeholder="e.g. 5.0"
              value={form.land_acres}
              onChange={handleChange}
            />
          </div>

          <div className="form-field-group">
            <label htmlFor="preferred_language" className="field-label">
              Preferred Portal Language
            </label>
            <select
              id="preferred_language"
              name="preferred_language"
              className="form-select"
              value={form.preferred_language}
              onChange={handleChange}
            >
              <option value="te">తెలుగు (Telugu - Default)</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="form-full-width">
            <button
              type="submit"
              className="btn-submit-auth"
              disabled={loading}
            >
              {loading ? "Registering Farmer Account..." : "Create Farmer Account →"}
            </button>
          </div>
        </form>

        <div className="auth-card-footer">
          <span>Already registered? </span>
          <Link to="/login" className="portal-text-link">Sign In to Your Account</Link>
          <span className="divider-dot">•</span>
          <Link to="/register/buyer" className="portal-text-link">Register as Commercial Buyer</Link>
        </div>
      </div>
    </div>
  );
}
