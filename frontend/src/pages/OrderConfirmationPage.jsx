import { Link, useParams } from "react-router-dom";
import { CheckCircle, Brain, Package, ChevronRight } from "lucide-react";
import { useOrders } from "../context/OrderContext";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const { getOrder } = useOrders();
  const order = getOrder(orderId);

  if (!order) {
    return (
      <div className="page not-found">
        <h2>Order not found</h2>
        <Link to="/" className="primary-btn">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="page confirmation-page">
      <div className="confirmation-card">
        <div className="confirmation-icon">
          <CheckCircle size={64} color="#16834a" />
        </div>
        <h1>Order Placed! 🎉</h1>
        <p className="confirmation-sub">
          Your order has been confirmed and the restaurant is preparing your food.
        </p>

        <div className="order-id-box">
          <span className="order-id-label">Order ID</span>
          <span className="order-id-val">#{order.id}</span>
        </div>

        <div className="confirmation-details">
          <div className="conf-row">
            <span>Restaurant</span>
            <strong>{order.restaurant_name}</strong>
          </div>
          <div className="conf-row">
            <span>Deliver to</span>
            <strong>{order.address}</strong>
          </div>
          <div className="conf-row">
            <span>Payment</span>
            <strong className="payment-badge">{order.payment_method.toUpperCase()}</strong>
          </div>
          <div className="conf-row">
            <span>Total Paid</span>
            <strong>₹{order.total}</strong>
          </div>
        </div>

        {order.predicted_time && (
          <div className="confirmation-ml-box">
            <Brain size={22} />
            <div>
              <div className="ml-label-sm">🤖 ML-Predicted Delivery Time</div>
              <div className="ml-time-lg">{Math.round(order.predicted_time)} minutes</div>
              <div className="ml-note-sm">
                Estimated by our Random Forest model based on distance, traffic &amp; weather.
              </div>
            </div>
          </div>
        )}

        {!order.predicted_time && (
          <div className="confirmation-ml-box offline">
            <Brain size={22} />
            <div>
              <div className="ml-label-sm">ML Prediction Unavailable</div>
              <div className="ml-note-sm">Start the FastAPI server to see real predictions.</div>
            </div>
          </div>
        )}

        <div className="confirmation-actions">
          <Link to={`/track/${order.id}`} className="primary-btn">
            <Package size={16} /> Track Order
          </Link>
          <Link to="/orders" className="secondary-btn">
            View All Orders <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

