import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, MapPin, Search, ChevronDown, Menu, X, LayoutDashboard } from "lucide-react";
import { useCart } from "../context/CartContext";

const LOCATIONS = ["Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune"];

export default function Navbar() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [location, setLocation] = useState("Bengaluru");
  const [showLocDrop, setShowLocDrop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/?q=${encodeURIComponent(searchVal.trim())}`);
      setMobileOpen(false);
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="logo">
          🛵 Deliver<span>IQ</span>
        </Link>

        {/* Location */}
        <div className="location-selector" onClick={() => setShowLocDrop(!showLocDrop)}>
          <MapPin size={16} color="#f04b38" />
          <div className="location-text">
            <small>Delivering to</small>
            <strong>{location}</strong>
          </div>
          <ChevronDown size={14} color="#888" />
          {showLocDrop && (
            <div className="location-dropdown">
              {LOCATIONS.map((l) => (
                <div
                  key={l}
                  className={`location-option${location === l ? " active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setLocation(l); setShowLocDrop(false); }}
                >
                  {l}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <Search size={16} color="#aaa" />
          <input
            placeholder="Search restaurants or dishes…"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </form>

        {/* Desktop Nav */}
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/admin">
            <LayoutDashboard size={15} style={{ verticalAlign: "middle", marginRight: 4 }} />
            Admin
          </Link>
          <Link to="/cart" className="cart-btn">
            <ShoppingCart size={18} />
            Cart
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <form className="navbar-search mobile-search" onSubmit={handleSearch}>
            <Search size={16} color="#aaa" />
            <input
              placeholder="Search restaurants or dishes…"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </form>
          <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/orders" onClick={() => setMobileOpen(false)}>My Orders</Link>
          <Link to="/admin" onClick={() => setMobileOpen(false)}>Admin Dashboard</Link>
          <Link to="/cart" className="cart-btn-mobile" onClick={() => setMobileOpen(false)}>
            🛒 Cart {totalItems > 0 && `(${totalItems})`}
          </Link>
        </div>
      )}
    </header>
  );
}

