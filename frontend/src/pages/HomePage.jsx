import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import RestaurantCard from "../components/RestaurantCard";
import { CATEGORIES, RESTAURANTS, searchRestaurants } from "../data/restaurants";

const OFFERS_BANNER = [
  { emoji: "🎉", title: "50% OFF", sub: "Up to ₹100 on first order", code: "WELCOME50", bg: "#fff3ef" },
  { emoji: "🛵", title: "Free Delivery", sub: "On orders above ₹299 at Green Bowl", code: "GREENFREE", bg: "#e8f8ef" },
  { emoji: "🍕", title: "Buy 1 Get 1", sub: "On all pizzas at Pizza Studio", code: "PIZZA2X", bg: "#ffe8dc" },
];

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Rating (High to Low)", value: "rating" },
  { label: "Delivery Time", value: "time" },
  { label: "Price (Low to High)", value: "price" },
];

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [bannerIdx, setBannerIdx] = useState(0);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setBannerIdx((i) => (i + 1) % OFFERS_BANNER.length), 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  let results = searchRestaurants(query, activeCategory);

  if (sortBy === "rating") results = [...results].sort((a, b) => b.rating - a.rating);
  else if (sortBy === "time") results = [...results].sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
  else if (sortBy === "price") results = [...results].sort((a, b) => a.priceForOne - b.priceForOne);

  function copyCode(code) {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  const banner = OFFERS_BANNER[bannerIdx];

  return (
    <div className="page home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">GOOD FOOD · GREAT MOOD</span>
          <h1>
            Cravings?<br />
            We've got you <span>covered.</span>
          </h1>
          <p>
            Discover the best food around you and get AI-powered delivery time
            estimates — no guesswork.
          </p>
          <a className="primary-btn" href="#restaurants">
            Explore Restaurants <ChevronRight size={16} />
          </a>
        </div>
        <div className="hero-visual">
          <div className="hero-food-grid">
            {["🍛", "🍕", "🍔", "🥗", "🍜", "🍰"].map((e, i) => (
              <div key={i} className="hero-food-item" style={{ animationDelay: `${i * 0.15}s` }}>
                {e}
              </div>
            ))}
          </div>
        </div>
        <div className="hero-ml-note">
          🤖 Predict Smarter · Deliver Faster
        </div>
      </section>

      {/* Offer Banner */}
      <section className="offers-strip">
        <div className="offer-banner" style={{ background: banner.bg }}>
          <span className="offer-emoji">{banner.emoji}</span>
          <div>
            <strong>{banner.title}</strong>
            <p>{banner.sub}</p>
          </div>
          <button
            className="offer-copy-btn"
            onClick={() => copyCode(banner.code)}
          >
            {copied === banner.code ? "Copied!" : banner.code}
          </button>
        </div>
        <div className="banner-dots">
          {OFFERS_BANNER.map((_, i) => (
            <span
              key={i}
              className={`banner-dot${i === bannerIdx ? " active" : ""}`}
              onClick={() => setBannerIdx(i)}
            />
          ))}
        </div>
      </section>

      {/* Search */}
      <section className="search-section">
        <div className="search-box">
          <Search size={18} color="#aaa" />
          <input
            placeholder="Search restaurants, cuisines or dishes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="clear-search" onClick={() => setQuery("")}>✕</button>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="section-header">
          <small>EXPLORE</small>
          <h2>What are you craving?</h2>
        </div>
        <div className="categories-row">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`cat-pill${activeCategory === cat.id ? " active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="cat-emoji">{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Restaurant listing */}
      <section className="section" id="restaurants">
        <div className="section-header">
          <div>
            <small>HANDPICKED FOR YOU</small>
            <h2>Popular Restaurants</h2>
          </div>
          <div className="sort-row">
            <span className="muted">{results.length} restaurant{results.length !== 1 ? "s" : ""}</span>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="empty-state">
            <span className="empty-emoji">🔍</span>
            <h3>No restaurants found</h3>
            <p>Try a different search or browse all categories.</p>
            <button className="primary-btn" onClick={() => { setQuery(""); setActiveCategory("all"); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="restaurant-grid">
            {results.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}
      </section>

      {/* ML feature promo */}
      <section className="ml-promo">
        <div className="ml-promo-text">
          <span className="eyebrow">POWERED BY MACHINE LEARNING</span>
          <h2>Not just fast food.<br /><span>Smart delivery.</span></h2>
          <p>
            DeliverIQ uses a Random Forest model trained on 41,944 real Zomato
            delivery records to predict your exact delivery time — factoring in
            distance, traffic, weather, and more.
          </p>
          <a className="primary-btn outline" href="#restaurants">Order Now</a>
        </div>
        <div className="ml-promo-graphic">
          <div className="ml-card-preview">
            <div className="ml-card-icon">🧠</div>
            <div className="ml-card-text">
              <div className="ml-card-label">AI Prediction</div>
              <div className="ml-card-time">28 min</div>
              <div className="ml-card-sub">Based on current conditions</div>
            </div>
          </div>
          <div className="ml-features">
            {["📍 Distance", "🚦 Traffic", "🌤️ Weather", "📅 Time of day"].map((f) => (
              <span key={f} className="ml-feature-tag">{f}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

