import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Circle, Brain } from "lucide-react";
import { useOrders } from "../context/OrderContext";

const STAGES = [
  { key: "confirmed",   label: "Order Confirmed",    emoji: "✅", desc: "Your order has been received" },
  { key: "preparing",   label: "Preparing Food",      emoji: "👨‍🍳", desc: "The restaurant is cooking your order" },
  { key: "picked_up",   label: "Picked Up",           emoji: "🛵", desc: "Delivery partner has picked up your order" },
  { key: "on_the_way",  label: "On the Way",          emoji: "📍", desc: "Your order is headed to your location" },
  { key: "delivered",   label: "Delivered",           emoji: "🎉", desc: "Enjoy your meal!" },
];

const STATUS_ORDER = STAGES.map((s) => s.key);

function getStageIndex(status) {
  return STATUS_ORDER.indexOf(status);
}

export default function TrackingPage() {
  const { orderId } = useParams();
  const { getOrder, updateOrderStatus } = useOrders();
  const order = getOrder(orderId);
  const [currentStatus, setCurrentStatus] = useState(order?.status || "confirmed");
  const [elapsed, setElapsed] = useState(0);

  // Auto-advance order stages (simulation)
  useEffect(() => {
    if (!order) return;
    if (currentStatus === "delivered") return;

    const DELAYS = { confirmed: 10000, preparing: 20000, picked_up: 15000, on_the_way: 30000 };
    const delay = DELAYS[currentStatus] || 15000;

    const timer = setTimeout(() => {
      const nextIdx = getStageIndex(currentStatus) + 1;
      if (nextIdx < STATUS_ORDER.length) {
        const nextStatus = STATUS_ORDER[nextIdx];
        setCurrentStatus(nextStatus);
        updateOrderStatus(orderId, nextStatus);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [currentStatus, orderId, order, updateOrderStatus]);

  // Elapsed time counter
  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!order) {
    return (
      <div className="page not-found">
        <h2>Order not found</h2>
        <Link to="/" className="primary-btn">Go Home</Link>
      </div>
    );
  }

  const currentIdx = getStageIndex(currentStatus);
  const isDelivered = currentStatus === "delivered";

  function formatElapsed(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  return (
    <div className="page tracking-page">
      <div className="tracking-card">
        <div className="tracking-header">
          <h1>Order Tracking</h1>
          <div className="order-id-small">#{order.id}</div>
        </div>

        <div className="tracking-restaurant">
          🍴 {order.restaurant_name} → {order.address.split(",")[0]}
        </div>

        {/* Progress stepper */}
        <div className="tracking-stepper">
          {STAGES.map((stage, idx) => {
            const done = idx < currentIdx;
            const active = idx === currentIdx;
            const upcoming = idx > currentIdx;
            return (
              <div key={stage.key} className={`stage ${done ? "done" : active ? "active" : "upcoming"}`}>
                <div className="stage-icon-wrap">
                  <div className={`stage-icon ${done ? "done" : active ? "active" : ""}`}>
                    {done ? <CheckCircle size={22} /> : active ? <span>{stage.emoji}</span> : <Circle size={22} />}
                  </div>
                  {idx < STAGES.length - 1 && <div className={`stage-line ${done ? "done" : ""}`} />}
                </div>
                <div className="stage-label">
                  <strong>{stage.label}</strong>
                  {active && <p className="stage-desc">{stage.desc}</p>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Status summary */}
        <div className="tracking-status-box">
          {!isDelivered ? (
            <>
              <div className="tracking-pulse" />
              <div>
                <strong>{STAGES[currentIdx]?.label}</strong>
                <p>{STAGES[currentIdx]?.desc}</p>
                <small>Time elapsed: {formatElapsed(elapsed)}</small>
              </div>
            </>
          ) : (
            <div className="delivered-banner">
              🎉 Your order was delivered! Enjoy your meal.
            </div>
          )}
        </div>

        {/* ML prediction */}
        {order.predicted_time && (
          <div className="tracking-ml-box">
            <Brain size={18} />
            <div>
              <div className="ml-label-sm">🤖 ML-Predicted Delivery Time</div>
              <div className="tracking-ml-time">{Math.round(order.predicted_time)} minutes</div>
              <div className="ml-note-sm">
                Predicted by Random Forest model · Actual may vary with live conditions.
              </div>
            </div>
          </div>
        )}

        {/* Order items */}
        <div className="tracking-items">
          <h3>Order Items</h3>
          {order.items.map((item) => (
            <div key={item.id} className="tracking-item">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="bill-divider" />
          <div className="tracking-item total">
            <span>Total Paid</span>
            <span>₹{order.total}</span>
          </div>
        </div>

        <div className="tracking-actions">
          <Link to="/orders" className="secondary-btn">View All Orders</Link>
          <Link to="/" className="primary-btn">Order Again</Link>
        </div>
      </div>
    </div>
  );
}

