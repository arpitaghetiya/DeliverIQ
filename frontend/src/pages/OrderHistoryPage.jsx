import { Link } from "react-router-dom";
import { Package, Clock, ChevronRight } from "lucide-react";
import { useOrders } from "../context/OrderContext";

const STATUS_COLOR = {
  confirmed:  { bg: "#fff3ef", text: "#f04b38" },
  preparing:  { bg: "#fff8e1", text: "#f59e0b" },
  picked_up:  { bg: "#e8f0fe", text: "#3b82f6" },
  on_the_way: { bg: "#e8f0fe", text: "#3b82f6" },
  delivered:  { bg: "#e8f8ef", text: "#16834a" },
};

const STATUS_LABEL = {
  confirmed:  "Confirmed",
  preparing:  "Preparing",
  picked_up:  "Picked Up",
  on_the_way: "On the Way",
  delivered:  "Delivered",
};

export default function OrderHistoryPage() {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="page orders-page">
        <div className="empty-state">
          <Package size={64} color="#ddd" />
          <h2>No orders yet</h2>
          <p>Your order history will appear here.</p>
          <Link to="/" className="primary-btn">Order Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page orders-page">
      <h1 className="page-title">My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => {
          const col = STATUS_COLOR[order.status] || STATUS_COLOR.confirmed;
          const date = new Date(order.created_at).toLocaleString("en-IN", {
            day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
          });
          return (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <h3>{order.restaurant_name}</h3>
                  <div className="order-meta">
                    <Clock size={13} /> {date} &nbsp;·&nbsp; ₹{order.total}
                  </div>
                </div>
                <span
                  className="order-status-badge"
                  style={{ background: col.bg, color: col.text }}
                >
                  {STATUS_LABEL[order.status]}
                </span>
              </div>
              <div className="order-items-preview">
                {order.items.map((item) => (
                  <span key={item.id} className="order-item-chip">
                    {item.name} ×{item.quantity}
                  </span>
                ))}
              </div>
              <div className="order-card-footer">
                <span className="order-id-small">Order #{order.id}</span>
                <div className="order-actions">
                  <Link to={`/track/${order.id}`} className="secondary-btn-sm">
                    Track <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

