import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Clock, Truck, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { getRestaurantById } from "../data/restaurants";
import MenuItem from "../components/MenuItem";
import { useCart } from "../context/CartContext";

export default function RestaurantPage() {
  const { id } = useParams();
  const restaurant = getRestaurantById(id);
  const { totalItems, subtotal, cart } = useCart();
  const [activeSection, setActiveSection] = useState(null);

  if (!restaurant) {
    return (
      <div className="page not-found">
        <h2>Restaurant not found</h2>
        <Link to="/" className="primary-btn">← Back to Home</Link>
      </div>
    );
  }

  const isOurCart = cart.restaurantId === restaurant.id;

  return (
    <div className="page restaurant-page">
      {/* Hero banner */}
      <div className="restaurant-hero">
        <img src={restaurant.image} alt={restaurant.name} className="restaurant-hero-img" />
        <div className="restaurant-hero-overlay" />
        <Link to="/" className="back-btn">
          <ArrowLeft size={18} /> Back
        </Link>
      </div>

      {/* Info card */}
      <div className="restaurant-info-card">
        <div className="restaurant-info-left">
          <h1>{restaurant.name}</h1>
          <p className="restaurant-tagline">{restaurant.tagline}</p>
          <p className="restaurant-cuisine">{restaurant.cuisine.join(" · ")}</p>
          <div className="restaurant-tags">
            {restaurant.isPureVeg && <span className="tag veg">🌿 Pure Veg</span>}
            {restaurant.offer && <span className="tag offer">{restaurant.offer}</span>}
          </div>
        </div>
        <div className="restaurant-info-stats">
          <div className="stat-box">
            <div className="stat-val green">
              <Star size={14} fill="#16834a" color="#16834a" /> {restaurant.rating}
            </div>
            <div className="stat-label">{restaurant.reviews.toLocaleString()} reviews</div>
          </div>
          <div className="stat-box">
            <div className="stat-val">
              <Clock size={14} /> {restaurant.deliveryTime}
            </div>
            <div className="stat-label">Delivery time</div>
          </div>
          <div className="stat-box">
            <div className="stat-val">
              <Truck size={14} /> ₹{restaurant.deliveryFee}
            </div>
            <div className="stat-label">Delivery fee</div>
          </div>
        </div>
      </div>

      {/* Coupon strip */}
      {restaurant.couponCode && (
        <div className="coupon-strip">
          🏷️ Use code <strong>{restaurant.couponCode}</strong> at checkout — {restaurant.offer}
        </div>
      )}

      {/* Menu */}
      <div className="menu-layout">
        {/* Sidebar */}
        <aside className="menu-sidebar">
          <h3>Menu</h3>
          {restaurant.menu.map((section) => (
            <button
              key={section.category}
              className="sidebar-cat-btn"
              onClick={() =>
                document
                  .getElementById(`section-${section.category}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              {section.category}
            </button>
          ))}
        </aside>

        {/* Menu sections */}
        <div className="menu-sections">
          {restaurant.menu.map((section) => (
            <div key={section.category} id={`section-${section.category}`} className="menu-section">
              <button
                className="menu-section-toggle"
                onClick={() =>
                  setActiveSection(activeSection === section.category ? null : section.category)
                }
              >
                <span>{section.category} <span className="section-count">({section.items.length})</span></span>
                {activeSection === section.category ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <div className={`menu-items-list${activeSection === section.category ? " collapsed" : ""}`}>
                {section.items.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    restaurantId={restaurant.id}
                    restaurantName={restaurant.name}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating cart bar */}
      {isOurCart && totalItems > 0 && (
        <div className="floating-cart">
          <div className="floating-cart-info">
            <span>{totalItems} item{totalItems > 1 ? "s" : ""} · ₹{subtotal}</span>
            <span>{restaurant.name}</span>
          </div>
          <Link to="/cart" className="floating-cart-btn">
            View Cart →
          </Link>
        </div>
      )}
    </div>
  );
}

