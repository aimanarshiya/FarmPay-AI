import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import OrderHistory from "./pages/OrderHistory";
import OrderDetails from "./pages/OrderDetails";
import "./App.css";

function NotFound() {
  return (
    <div className="empty-state" style={{ margin: "60px auto", maxWidth: "600px" }}>
      <div className="empty-icon">🔍</div>
      <h3>Page Not Found</h3>
      <p>The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="primary-button" style={{ marginTop: "20px" }}>
        Return to Marketplace
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />

        <main className="dashboard">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <footer className="footer">
            <span>🌾 FarmPay AI</span>
            <span>Smarter Farming. Better Selling. Simpler Payments.</span>
          </footer>
        </main>
      </div>
    </Router>
  );
}
