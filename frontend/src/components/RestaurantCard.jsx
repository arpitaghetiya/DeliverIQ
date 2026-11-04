import { Star, Clock, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export default function RestaurantCard({ restaurant }) {
  const r = restaurant;
  return (
    <Link to={`/restaurant/${r.id}`} className="restaurant-card-link">
      <article className="restaurant-card">
        <div className="card-image-wrap">
          <img src={r.image} alt={r.name} className="card-image" loading="lazy" />
          {r.offer && <div className="card-offer">{r.offer}</div>}
          {r.isPureVeg && <div className="card-veg-badge">🌿 Pure Veg</div>}
        </div>
        <div className="card-body">
          <div className="card-title-row">
            <h3>{r.name}</h3>
            <div className="card-rating">
              <Star size={12} fill="#16834a" color="#16834a" />
              <span>{r.rating}</span>
            </div>
          </div>
          <p className="card-cuisine">{r.cuisine.join(", ")}</p>
          <div className="card-meta">
            <span><Clock size={12} /> {r.deliveryTime}</span>
            <span className="dot">·</span>
            <span><Truck size={12} /> ₹{r.deliveryFee} delivery</span>
            <span className="dot">·</span>
            <span>₹{r.priceForOne} for one</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

