import { Brain, Zap } from "lucide-react";

export default function MLBadge({ minutes, loading, error }) {
  if (loading) {
    return (
      <div className="ml-badge loading">
        <Brain size={18} className="spin" />
        <span>Running ML prediction…</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="ml-badge error">
        <Brain size={18} />
        <span>ML service unavailable: {error}</span>
      </div>
    );
  }
  if (!minutes) return null;
  return (
    <div className="ml-badge success">
      <Brain size={18} />
      <div>
        <div className="ml-label">
          <Zap size={12} /> ML-Predicted Delivery Time
        </div>
        <div className="ml-time">{Math.round(minutes)} minutes</div>
        <div className="ml-note">
          Estimated by our Random Forest model (±6 min typical error).
          Based on distance, traffic, weather & more.
        </div>
      </div>
    </div>
  );
}

