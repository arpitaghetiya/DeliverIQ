
import { useState } from "react";
import "./App.css";

const categories = [
  { name: "Biryani", emoji: "🍛" },
  { name: "Pizza", emoji: "🍕" },
  { name: "Burger", emoji: "🍔" },
  { name: "Dosa", emoji: "🥞" },
  { name: "Chinese", emoji: "🥡" },
  { name: "Desserts", emoji: "🍰" },
];

const restaurants = [
  { id: 1, name: "Spice Garden", food: "North Indian, Biryani", rating: "4.5", time: "25-30 min", price: "₹250 for one", emoji: "🍛", color: "#fff0dc", offer: "50% OFF" },
  { id: 2, name: "Pizza Studio", food: "Pizza, Italian", rating: "4.3", time: "30-35 min", price: "₹300 for one", emoji: "🍕", color: "#ffe8dc", offer: "40% OFF" },
  { id: 3, name: "Burger House", food: "Burgers, Fast Food", rating: "4.2", time: "20-25 min", price: "₹180 for one", emoji: "🍔", color: "#fff1c9", offer: "30% OFF" },
  { id: 4, name: "South Express", food: "South Indian", rating: "4.6", time: "20-25 min", price: "₹150 for one", emoji: "🥞", color: "#e8f3dd", offer: "FLAT ₹100 OFF" },
];

function App() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);

  const filtered = restaurants.filter((r) => {
    const matchesSearch = `${r.name} ${r.food}`.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" ||
      r.food.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  function addToCart(restaurant) {
    setCart((previous) => [...previous, restaurant]);
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="logo" href="#">🛵 Deliver<span>IQ</span></a>
        <div className="location">
          <span>📍</span>
          <div><small>Delivering to</small><strong>Bengaluru</strong></div>
        </div>
        <div className="nav-right">
          <a href="#restaurants">Restaurants</a>
          <a href="#smart">Smart Prediction</a>
          <button className="cart-button">🛒 Cart ({cart.length})</button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">GOOD FOOD. GREAT MOOD.</span>
            <h1>Cravings?<br />We've got you <span>covered.</span></h1>
            <p>Discover delicious food around you and get smarter delivery time estimates.</p>
            <a className="primary-button" href="#restaurants">Explore restaurants →</a>
          </div>
          <div className="hero-art">🍔🍕🍟</div>
          <div className="hero-note">✨ Predict Smarter. Deliver Faster.</div>
        </section>

        <section className="search-section">
          <div className="search-box">
            <span>🔍</span>
            <input
              placeholder="Search restaurants or cuisines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div><small>EXPLORE</small><h2>What are you craving?</h2></div>
          </div>
          <div className="categories">
            <button className={selectedCategory === "All" ? "category active" : "category"} onClick={() => setSelectedCategory("All")}>
              <span>🍽️</span>All
            </button>
            {categories.map((c) => (
              <button key={c.name} className={selectedCategory === c.name ? "category active" : "category"} onClick={() => setSelectedCategory(c.name)}>
                <span>{c.emoji}</span>{c.name}
              </button>
            ))}
          </div>
        </section>

        <section className="section" id="restaurants">
          <div className="section-heading">
            <div><small>HANDPICKED FOR YOU</small><h2>Popular restaurants</h2></div>
            <span className="muted">{filtered.length} restaurants</span>
          </div>
          <div className="restaurant-grid">
            {filtered.map((r) => (
              <article className="restaurant-card" key={r.id}>
                <div className="food-image" style={{ background: r.color }}>
                  <span>{r.emoji}</span>
                  <label>{r.offer}</label>
                </div>
                <div className="restaurant-info">
                  <div className="restaurant-title"><h3>{r.name}</h3><b>★ {r.rating}</b></div>
                  <p>{r.food}</p>
                  <div className="restaurant-meta"><span>🕒 {r.time}</span><span>{r.price}</span></div>
                  <button className="add-button" onClick={() => addToCart(r)}>+ Add to cart</button>
                </div>
              </article>
            ))}
            {filtered.length === 0 && <p>No restaurants found. Try another search.</p>}
          </div>
        </section>

        <section className="smart-section" id="smart">
          <div><span className="eyebrow">POWERED BY MACHINE LEARNING</span>
            <h2>Not just fast food.<br /><span>Smart delivery.</span></h2>
            <p>DeliverIQ uses machine learning to estimate how long your food delivery may take.</p>
          </div>
          <div className="smart-icon">🛵<strong>AI</strong></div>
        </section>
      </main>

      {cart.length > 0 && (
        <div className="cart-summary">
          🛒 {cart.length} item(s) added to your cart
        </div>
      )}

      <footer>© 2026 DeliverIQ · Predict Smarter. Deliver Faster.</footer>
    </div>
  );
}

export default App;
