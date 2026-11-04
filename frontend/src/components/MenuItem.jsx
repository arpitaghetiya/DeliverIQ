import { Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function MenuItem({ item, restaurantId, restaurantName }) {
  const { cart, addItem, updateQty } = useCart();
  const cartItem = cart.items.find((i) => i.id === item.id);
  const qty = cartItem ? cartItem.quantity : 0;

  function handleAdd() {
    addItem(restaurantId, restaurantName, item);
  }
  function handleIncrease() {
    updateQty(item.id, qty + 1);
  }
  function handleDecrease() {
    updateQty(item.id, qty - 1);
  }

  return (
    <div className="menu-item">
      <div className="menu-item-info">
        <div className="menu-item-badges">
          <span className={`veg-dot ${item.isVeg ? "veg" : "nonveg"}`} title={item.isVeg ? "Vegetarian" : "Non-Vegetarian"} />
          {item.isBestseller && <span className="bestseller-tag">Bestseller</span>}
        </div>
        <h4>{item.name}</h4>
        <p className="menu-item-desc">{item.description}</p>
        <span className="menu-item-price">₹{item.price}</span>
      </div>
      <div className="menu-item-right">
        <img src={item.image} alt={item.name} className="menu-item-img" loading="lazy" />
        <div className="menu-item-action">
          {qty === 0 ? (
            <button className="add-btn" onClick={handleAdd}>ADD</button>
          ) : (
            <div className="qty-control">
              <button onClick={handleDecrease}><Minus size={14} /></button>
              <span>{qty}</span>
              <button onClick={handleIncrease}><Plus size={14} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

