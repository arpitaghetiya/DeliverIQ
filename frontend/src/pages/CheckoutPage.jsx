import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, CreditCard, Smartphone, Banknote, Brain, Navigation, Gauge } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { getRestaurantById } from "../data/restaurants";
import { predictDeliveryTime, createOrder } from "../api/client";
import MLBadge from "../components/MLBadge";

const PAYMENT_METHODS = [
  { id: "cod", label: "Cash on Delivery", icon: Banknote, note: "Pay in cash when your order arrives" },
  { id: "upi", label: "UPI / GPay / PhonePe", icon: Smartphone, note: "DEMO — simulated UPI flow" },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard, note: "DEMO — simulated card processing" },
];

const CITY_OPTIONS = ["Urban", "Metropolitian", "Semi-Urban"];
const TRAFFIC_OPTIONS = ["Low", "Medium", "High", "Jam"];
const WEATHER_OPTIONS = ["Sunny", "Cloudy", "Windy", "Fog", "Stormy", "Sandstorms"];

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { addOrder } = useOrders();
  const billState = location.state || {};

  const restaurantInfo = getRestaurantById(cart.restaurantId);
  const initialDistance = restaurantInfo?.distance || 3.5;

  const [form, setForm] = useState({
    name: "Arpit Sharma",
    phone: "9876543210",
    address: "Flat 402, Green Glen Layout, Bellandur",
    city: "Bengaluru",
    cityType: "Urban",
    pincode: "560103",
  });
  const [distanceKm, setDistanceKm] = useState(initialDistance);
  const [payment, setPayment] = useState("cod");
  const [upiId, setUpiId] = useState("arpit@okhdfcbank");
  const [card, setCard] = useState({ number: "4532 8920 1234 5678", expiry: "12/28", cvv: "456", name: "Arpit Sharma" });
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState({});

  // ML prediction state
  const [mlMinutes, setMlMinutes] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState(null);

  // Conditions for ML model
  const [traffic, setTraffic] = useState("Medium");
  const [weather, setWeather] = useState("Sunny");

  useEffect(() => {
    if (cart.items.length === 0) return;
    fetchPrediction();
  }, [form.cityType, traffic, weather, distanceKm]);

  async function fetchPrediction() {
    setMlLoading(true);
    setMlError(null);
    try {
      const now = new Date();
      const data = await predictDeliveryTime({
        distance_km: parseFloat(distanceKm) || 3.5,
        prep_time_min: 10,
        weather,
        traffic,
        city_type: form.cityType,
        vehicle: "motorcycle",
        festival: "No",
        order_type: "Meal",
        pickup_hour: now.getHours(),
        day_of_week: now.getDay(),
        is_weekend: now.getDay() === 0 || now.getDay() === 6 ? 1 : 0,
      });
      setMlMinutes(data.predicted_minutes);
    } catch (err) {
      setMlError("FastAPI service offline. Run: uvicorn api:app --reload --port 8000");
    } finally {
      setMlLoading(false);
    }
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit phone number";
    if (!form.address.trim()) e.address = "Delivery address is required";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter a valid 6-digit pincode";
    if (payment === "upi" && !upiId.includes("@")) e.upi = "Enter a valid UPI ID (e.g. name@upi)";
    if (payment === "card") {
      if (card.number.replace(/\s/g, "").length < 16) e.cardNumber = "Enter a valid 16-digit card number";
      if (!card.expiry.match(/\d{2}\/\d{2}/)) e.cardExpiry = "Enter expiry as MM/YY";
      if (card.cvv.length < 3) e.cardCvv = "Enter a valid CVV";
      if (!card.name.trim()) e.cardName = "Enter name on card";
    }
    return e;
  }

  async function handlePlaceOrder() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setPlacing(true);
    try {
      const orderPayload = {
        customer_name: form.name,
        phone: form.phone,
        address: `${form.address}, ${form.city} - ${form.pincode}`,
        city_type: form.cityType,
        restaurant_id: cart.restaurantId,
        restaurant_name: cart.restaurantName,
        items: cart.items,
        subtotal: billState.subtotal || 0,
        delivery_fee: billState.deliveryFee || 29,
        discount: billState.discount || 0,
        tax: billState.tax || 0,
        total: billState.total || 0,
        payment_method: payment,
        coupon_code: billState.couponCode || null,
        predicted_time: mlMinutes,
        distance_km: parseFloat(distanceKm) || 3.5,
        weather,
        traffic,
      };

      let orderId;
      try {
        const res = await createOrder(orderPayload);
        orderId = res.order_id;
      } catch {
        // Backend offline — generate local ID fallback
        orderId = Math.random().toString(36).slice(2, 10).toUpperCase();
      }

      const fullOrder = {
        id: orderId,
        ...orderPayload,
        status: "confirmed",
        created_at: new Date().toISOString(),
        predicted_time: mlMinutes,
      };
      addOrder(fullOrder);
      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (err) {
      setErrors({ submit: "Failed to place order. Please try again." });
    } finally {
      setPlacing(false);
    }
  }

  function field(key, label, type = "text", placeholder = "") {
    return (
      <div className="form-field">
        <label>{label}</label>
        <input
          type={type}
          placeholder={placeholder || label}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className={errors[key] ? "error" : ""}
        />
        {errors[key] && <span className="field-error">{errors[key]}</span>}
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>No items to checkout</h2>
          <a className="primary-btn" href="/">Browse Restaurants</a>
        </div>
      </div>
    );
  }

  return (
    <div className="page checkout-page">
      <h1 className="page-title">Checkout</h1>
      <div className="checkout-layout">
        {/* Left column */}
        <div className="checkout-left">
          {/* Delivery details */}
          <div className="checkout-card">
            <h2><MapPin size={18} /> Delivery Details</h2>
            {field("name", "Full Name", "text", "Your name")}
            {field("phone", "Phone Number", "tel", "10-digit mobile")}
            {field("address", "Delivery Address", "text", "Street, Area, Landmark")}
            <div className="form-row-2">
              <div className="form-field">
                <label>City</label>
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              {field("pincode", "Pincode", "text", "6-digit pincode")}
            </div>
            <div className="form-field">
              <label style={{ display: "flex", justifyContent: "space-between" }}>
                <span>📍 Delivery Distance (from {cart.restaurantName || "restaurant"})</span>
                <strong style={{ color: "var(--brand)" }}>{distanceKm} km</strong>
              </label>
              <input
                type="range"
                min="0.5"
                max="20"
                step="0.5"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
                style={{ cursor: "pointer", accentColor: "var(--brand)" }}
              />
            </div>
            <div className="form-field">
              <label>City Type (for ML)</label>
              <select value={form.cityType} onChange={(e) => setForm({ ...form, cityType: e.target.value })}>
                {CITY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-row-2">
              <div className="form-field">
                <label>🚦 Current Traffic</label>
                <select value={traffic} onChange={(e) => setTraffic(e.target.value)}>
                  {TRAFFIC_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>🌤️ Weather</label>
                <select value={weather} onChange={(e) => setWeather(e.target.value)}>
                  {WEATHER_OPTIONS.map((w) => <option key={w}>{w}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ML Badge */}
          <MLBadge minutes={mlMinutes} loading={mlLoading} error={mlError} />

          {/* Payment */}
          <div className="checkout-card">
            <h2><CreditCard size={18} /> Payment Method</h2>
            <div className="payment-options">
              {PAYMENT_METHODS.map((pm) => (
                <label
                  key={pm.id}
                  className={`payment-option${payment === pm.id ? " selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={pm.id}
                    checked={payment === pm.id}
                    onChange={() => setPayment(pm.id)}
                  />
                  <pm.icon size={20} />
                  <div>
                    <strong>{pm.label}</strong>
                    <p>{pm.note}</p>
                  </div>
                </label>
              ))}
            </div>

            {payment === "upi" && (
              <div className="payment-extra demo-banner">
                <span className="demo-tag">DEMO</span> No real payment is processed.
                <div className="form-field" style={{ marginTop: 12 }}>
                  <label>UPI ID</label>
                  <input
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className={errors.upi ? "error" : ""}
                  />
                  {errors.upi && <span className="field-error">{errors.upi}</span>}
                </div>
              </div>
            )}

            {payment === "card" && (
              <div className="payment-extra demo-banner">
                <span className="demo-tag">DEMO</span> Do not enter real card details.
                <div className="form-field" style={{ marginTop: 12 }}>
                  <label>Card Number</label>
                  <input
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={card.number}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "").slice(0, 16);
                      v = v.replace(/(.{4})/g, "$1 ").trim();
                      setCard({ ...card, number: v });
                    }}
                    className={errors.cardNumber ? "error" : ""}
                  />
                  {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}
                </div>
                <div className="form-row-2">
                  <div className="form-field">
                    <label>Expiry (MM/YY)</label>
                    <input
                      placeholder="MM/YY"
                      maxLength={5}
                      value={card.expiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                        setCard({ ...card, expiry: v });
                      }}
                      className={errors.cardExpiry ? "error" : ""}
                    />
                    {errors.cardExpiry && <span className="field-error">{errors.cardExpiry}</span>}
                  </div>
                  <div className="form-field">
                    <label>CVV</label>
                    <input
                      placeholder="123"
                      type="password"
                      maxLength={4}
                      value={card.cvv}
                      onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                      className={errors.cardCvv ? "error" : ""}
                    />
                    {errors.cardCvv && <span className="field-error">{errors.cardCvv}</span>}
                  </div>
                </div>
                <div className="form-field">
                  <label>Name on Card</label>
                  <input
                    placeholder="As on card"
                    value={card.name}
                    onChange={(e) => setCard({ ...card, name: e.target.value })}
                    className={errors.cardName ? "error" : ""}
                  />
                  {errors.cardName && <span className="field-error">{errors.cardName}</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column – order summary */}
        <div className="checkout-right">
          <div className="order-summary-card">
            <h2>Order Summary</h2>
            <div className="summary-restaurant">{cart.restaurantName}</div>
            <div className="summary-items">
              {cart.items.map((item) => (
                <div key={item.id} className="summary-item">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="bill-divider" />
            <div className="bill-row"><span>Subtotal</span><span>₹{billState.subtotal || 0}</span></div>
            {billState.discount > 0 && (
              <div className="bill-row discount"><span>Discount</span><span>−₹{billState.discount}</span></div>
            )}
            <div className="bill-row"><span>Delivery Fee</span><span>₹{billState.deliveryFee || 29}</span></div>
            <div className="bill-row"><span>Taxes</span><span>₹{billState.tax || 0}</span></div>
            <div className="bill-divider" />
            <div className="bill-row total-row">
              <span>Total</span><span>₹{billState.total || 0}</span>
            </div>

            {mlMinutes && (
              <div className="summary-ml-time">
                <Brain size={16} />
                <span>Estimated delivery: <strong>{Math.round(mlMinutes)} min</strong></span>
              </div>
            )}

            {errors.submit && <p className="field-error">{errors.submit}</p>}

            <button
              className="primary-btn place-order-btn"
              onClick={handlePlaceOrder}
              disabled={placing}
            >
              {placing ? "Placing Order…" : `Place Order · ₹${billState.total || 0}`}
            </button>
            <p className="secure-note">🔒 Secure demo checkout — no real payment</p>
          </div>
        </div>
      </div>
    </div>
  );
}

