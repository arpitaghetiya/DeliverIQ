import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Minus, Trash2, Tag, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { applyCoupon } from "../data/coupons";

const TAX_RATE = 0.05;

export default function CartPage() {
  const { cart, subtotal, updateQty, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState("");
  const [couponResult, setCouponResult] = useState(null);

  const restaurant = cart.restaurantName;
  const deliveryFee = cart.restaurantId ? 29 : 0; // placeholder, overridden by restaurant data
  const discount = couponResult?.valid ? couponResult.discount : 0;
  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round(taxable * TAX_RATE);
  const total = taxable + deliveryFee + tax;

  function handleCoupon() {
    const result = applyCoupon(couponInput, subtotal);
    setCouponResult(result);
  }
  function removeCoupon() {
    setCouponInput("");
    setCouponResult(null);
  }

  if (cart.items.length === 0) {
    return (
      <div className="page cart-page">
        <div className="empty-cart">
          <ShoppingBag size={64} color="#ddd" />
          <h2>Your cart is empty</h2>
          <p>Add items from a restaurant to get started</p>
          <Link to="/" className="primary-btn">Browse Restaurants</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <div className="cart-layout">
        {/* Cart items */}
        <div className="cart-items-section">
          <div className="cart-header">
            <h1>Your Cart</h1>
            <span className="cart-restaurant-name">🍴 {restaurant}</span>
          </div>

          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <div className="cart-item-name">
                    <span className={`veg-dot ${item.isVeg ? "veg" : "nonveg"}`} />
                    {item.name}
                  </div>
                  <div className="cart-item-price">₹{item.price} each</div>
                </div>
                <div className="cart-item-controls">
                  <div className="qty-control">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)}>
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="cart-item-total">₹{item.price * item.quantity}</div>
                  <button className="remove-btn" onClick={() => removeItem(item.id)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="clear-cart-btn" onClick={clearCart}>
            Clear cart
          </button>
        </div>

        {/* Bill section */}
        <div className="bill-section">
          {/* Coupon */}
          <div className="coupon-box">
            <Tag size={16} />
            <h3>Apply Coupon</h3>
            {!couponResult?.valid ? (
              <div className="coupon-input-row">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  onKeyDown={(e) => e.key === "Enter" && handleCoupon()}
                />
                <button className="apply-btn" onClick={handleCoupon}>Apply</button>
              </div>
            ) : (
              <div className="coupon-applied">
                <span className="coupon-success">{couponResult.message}</span>
                <button className="remove-coupon" onClick={removeCoupon}>Remove</button>
              </div>
            )}
            {couponResult && !couponResult.valid && (
              <p className="coupon-error">{couponResult.message}</p>
            )}
            <div className="coupon-hints">
              Available: WELCOME50 · SAVE100 · BURGER30
            </div>
          </div>

          {/* Bill summary */}
          <div className="bill-card">
            <h3>Bill Details</h3>
            <div className="bill-row">
              <span>Item Total</span>
              <span>₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="bill-row discount">
                <span>Coupon Discount</span>
                <span>−₹{discount}</span>
              </div>
            )}
            <div className="bill-row">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="bill-row">
              <span>Taxes (5%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="bill-divider" />
            <div className="bill-row total-row">
              <span>To Pay</span>
              <span>₹{total}</span>
            </div>
          </div>

          <button
            className="primary-btn checkout-btn"
            onClick={() =>
              navigate("/checkout", {
                state: {
                  subtotal,
                  discount,
                  deliveryFee,
                  tax,
                  total,
                  couponCode: couponResult?.valid ? couponInput : null,
                },
              })
            }
          >
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}

