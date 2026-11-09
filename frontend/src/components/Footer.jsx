import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">🛵 Deliver<span>IQ</span></span>
          <p>Predict Smarter. Deliver Faster.</p>
          <small>
            Powered by a Random Forest ML model trained on 41,944 real delivery records.
          </small>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/">Home</Link>
          <Link to="/orders">Order History</Link>
          <Link to="/admin">Admin Dashboard</Link>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <span>Demo Application</span>
          <span>Not a real food service</span>
          <span>No real payments</span>
        </div>
        <div className="footer-col">
          <h4>Tech Stack</h4>
          <span>React + Vite</span>
          <span>FastAPI (Python)</span>
          <span>Random Forest (scikit-learn)</span>
          <span>Neon PostgreSQL</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 DeliverIQ — Academic Project Demo. Restaurant data is fictional.</span>
      </div>
    </footer>
  );
}

