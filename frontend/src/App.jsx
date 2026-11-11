import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import Navbar from "./components/Navbar";

// Core existing pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterFarmer from "./pages/RegisterFarmer";
import RegisterBuyer from "./pages/RegisterBuyer";
import FarmerDashboard from "./pages/FarmerDashboard";
import BuyerMarketplace from "./pages/BuyerMarketplace";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import OrderHistory from "./pages/OrderHistory";
import OrderDetails from "./pages/OrderDetails";
import ListingDetails from "./pages/ListingDetails";
import ProfileSettings from "./pages/ProfileSettings";

// All 17 Approved Google Stitch Screens
import OrderEscrowTracker from "./pages/OrderEscrowTracker"; // Screen 01
import BuyerPenaltyManagement from "./pages/BuyerPenaltyManagement"; // Screen 02
import NegotiationCopilot from "./pages/NegotiationCopilot"; // Screen 03
import WebhookResilienceConsole from "./pages/WebhookResilienceConsole"; // Screen 04
import LogisticsTelemetrySheet from "./pages/LogisticsTelemetrySheet"; // Screen 05
import FarmerCommandHub from "./pages/FarmerCommandHub"; // Screen 06
import FairBid from "./pages/FairBid"; // Screen 07
import CollectiveSellingHub from "./pages/CollectiveSellingHub"; // Screen 08
import DemandRadar from "./pages/DemandRadar"; // Screen 09
import DisputeArbitrationConsole from "./pages/DisputeArbitrationConsole"; // Screen 10
import VoiceToTrade from "./pages/VoiceToTrade"; // Screen 11
import BuyerTrustPassport from "./pages/BuyerTrustPassport"; // Screen 12
import PaymentsCenter from "./pages/PaymentsCenter"; // Screen 13
import LogisticsIntelligence from "./pages/LogisticsIntelligence"; // Screen 14
import DigitalCropPassport from "./pages/DigitalCropPassport"; // Screen 15
import DisputeShield from "./pages/DisputeShield"; // Screen 16

import "./App.css";

function NotFound() {
  return (
    <div className="portal-empty-card" style={{ margin: "60px auto", maxWidth: "600px" }}>
      <div className="empty-icon">🔍</div>
      <h3>Page Not Found</h3>
      <p>The requested portal resource does not exist or has been moved.</p>
      <Link to="/" className="btn-service primary" style={{ marginTop: "20px" }}>
        Return to Portal Home →
      </Link>
    </div>
  );
}

function ProtectedRoute({ allowedRoles }) {
  const { user, authLoading, authValidationError, retrySessionValidation } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="portal-empty-card" role="status" style={{ margin: "60px auto", maxWidth: "600px" }}>
        <h2>Verifying your session</h2>
        <p>Please wait while FarmPay checks your account access.</p>
      </div>
    );
  }

  if (authValidationError) {
    return (
      <div className="portal-empty-card" role="alert" style={{ margin: "60px auto", maxWidth: "600px" }}>
        <h2>Could not verify your session</h2>
        <p>{authValidationError}</p>
        <button type="button" className="btn-service primary" onClick={retrySessionValidation}>
          Retry verification
        </button>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to="/access-denied"
        replace
        state={{ attemptedPath: location.pathname, allowedRoles }}
      />
    );
  }

  return <Outlet />;
}

function AccessDenied() {
  const { user } = useAuth();
  const location = useLocation();
  const attemptedPath = location.state?.attemptedPath;
  const roleNames = {
    FARMER: "Farmer",
    BUYER: "Buyer",
    ADMIN: "Administrator",
  };
  const roleHome = {
    FARMER: "/farmer",
    BUYER: "/marketplace",
    ADMIN: "/admin",
  };

  return (
    <section className="portal-empty-card" role="alert" style={{ margin: "60px auto", maxWidth: "600px" }}>
      <div className="empty-icon" aria-hidden="true">🔒</div>
      <h2>Access denied</h2>
      <p>
        Your signed-in {roleNames[user?.role] || "account"} account cannot open
        {attemptedPath ? ` ${attemptedPath}` : " this page"}. Sign in with an authorized account to continue.
      </p>
      <Link to={roleHome[user?.role] || "/"} className="btn-service primary" style={{ marginTop: "20px" }}>
        Go to your FarmPay portal
      </Link>
    </section>
  );
}

function OffersRedirect() {
  const { role } = useAuth();
  if (role === "FARMER") return <Navigate to="/farmer?tab=listings" replace />;
  if (role === "BUYER") return <Navigate to="/marketplace?tab=my_bids" replace />;
  return <Navigate to="/admin?tab=users" replace />;
}

function PageLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="app-layout">
      <Navbar />

      <main className="portal-content-main">
        <Routes>
          {/* Public / Landing — Screen 17 */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/farmer" element={<RegisterFarmer />} />
          <Route path="/register/buyer" element={<RegisterBuyer />} />

          {/* All 17 Approved Stitch Showcase & Interactive Routes */}
          {/* Screen 01: Order Escrow Tracker */}
          <Route path="/orders/:orderId/escrow" element={<OrderEscrowTracker />} />
          <Route path="/escrow" element={<Navigate to="/orders/FP-2024-884/escrow" replace />} />

          {/* Screen 02: Buyer Show-Cause Penalties */}
          <Route path="/admin/compliance/penalties" element={<BuyerPenaltyManagement />} />

          {/* Screen 03: AI Negotiation Copilot */}
          <Route path="/negotiation/:offer_id" element={<NegotiationCopilot />} />
          <Route path="/negotiation" element={<NegotiationCopilot />} />

          {/* Screen 04: Webhook Resilience & Dispute Refund Console */}
          <Route path="/admin/webhooks" element={<WebhookResilienceConsole />} />

          {/* Screen 05: Live GPS Transit & Weighbridge Telemetry Sheet */}
          <Route path="/logistics/telemetry/:lot_id" element={<LogisticsTelemetrySheet />} />
          <Route path="/logistics/telemetry" element={<LogisticsTelemetrySheet />} />

          {/* Screen 06: Farmer Mobile Command Hub */}
          <Route path="/farmer/dashboard" element={<FarmerCommandHub />} />
          <Route path="/farmer/mobile-command" element={<FarmerCommandHub />} />

          {/* Screen 07: FairBid Engine Transparent Net Comparison */}
          <Route path="/fairbid" element={<FairBid />} />
          <Route path="/listings/:listing_id/offers" element={<FairBid />} />

          {/* Screen 08: Collective Selling Hub (FPO Pooling) */}
          <Route path="/fpo/collective-selling" element={<CollectiveSellingHub />} />

          {/* Screen 09: Demand Radar Deficit Heatmap */}
          <Route path="/market/demand-radar" element={<DemandRadar />} />
          <Route path="/demand-radar" element={<Navigate to="/market/demand-radar" replace />} />

          {/* Screen 10: Mandi Nodal Dispute Arbitration Decision Console */}
          <Route path="/disputes/arbitration/:dispute_id" element={<DisputeArbitrationConsole />} />
          <Route path="/disputes/arbitration" element={<Navigate to="/disputes/arbitration/DSP-2024-041" replace />} />

          {/* Screen 11: Voice-to-Trade AI Studio */}
          <Route path="/farmer/voice" element={<VoiceToTrade />} />
          <Route path="/listings/create/voice" element={<VoiceToTrade />} />

          {/* Screen 12: Buyer Trust Passport */}
          <Route path="/buyers/:buyer_id/passport" element={<BuyerTrustPassport />} />
          <Route path="/buyer/trust-passport" element={<BuyerTrustPassport />} />

          {/* Screen 13: Payments Center & PayPal Sandbox Gateway */}
          <Route path="/payments" element={<PaymentsCenter />} />
          <Route path="/payments-center" element={<PaymentsCenter />} />

          {/* Screen 14: Logistics Intelligence & Multi-Buyer Freight */}
          <Route path="/logistics" element={<LogisticsIntelligence />} />

          {/* Screen 15: Digital Crop Passport */}
          <Route path="/passport/lot/:lot_id" element={<DigitalCropPassport />} />
          <Route path="/passport" element={<Navigate to="/passport/lot/FP-2024-884" replace />} />

          {/* Screen 16: Dispute Shield */}
          <Route path="/disputes" element={<DisputeShield />} />

          {/* Role-Protected Enterprise Modules */}
          <Route element={<ProtectedRoute allowedRoles={["FARMER"]} />}>
            <Route path="/farmer" element={<FarmerDashboard />} />
            <Route path="/farmer/create-listing" element={<Navigate to="/farmer?tab=create" replace />} />
            <Route path="/farmer/profile" element={<ProfileSettings />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["BUYER"]} />}>
            <Route path="/marketplace" element={<BuyerMarketplace />} />
            <Route path="/buyer/profile" element={<ProfileSettings />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Navigate to="/admin?tab=users" replace />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["FARMER", "BUYER", "ADMIN"]} />}>
            <Route path="/listings/:listingId" element={<ListingDetails key={location.pathname} />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/offers" element={<OffersRedirect />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />
            <Route path="/orders/:orderId/tracking" element={<OrderDetails />} />
            <Route path="/payment-status" element={<OrderHistory />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
          </Route>
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isHomePage && (
        <footer className="footer-bottom-bar">
          <div className="footer-bottom-inner">
            <span>🌾 FarmPay AI • Independent Agricultural Digital Settlement Platform</span>
            <span>English • తెలుగు (Telugu) • हिन्दी (Hindi) • Gemini AI & PayPal Sandbox</span>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <PageLayout />
      </Router>
    </AuthProvider>
  );
}
