import { createContext, useContext, useReducer } from "react";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { restaurantId, restaurantName, item } = action.payload;
      // If cart has items from a different restaurant, clear first
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        return {
          restaurantId,
          restaurantName,
          items: [{ ...item, quantity: 1 }],
        };
      }
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          ...state,
          restaurantId,
          restaurantName,
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...state,
        restaurantId,
        restaurantName,
        items: [...state.items, { ...item, quantity: 1 }],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.itemId),
      };
    case "UPDATE_QTY": {
      const { itemId, qty } = action.payload;
      if (qty <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== itemId) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === itemId ? { ...i, quantity: qty } : i
        ),
      };
    }
    case "CLEAR_CART":
      return { restaurantId: null, restaurantName: "", items: [] };
    default:
      return state;
  }
}

const INITIAL = { restaurantId: null, restaurantName: "", items: [] };

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, INITIAL);

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  function addItem(restaurantId, restaurantName, item) {
    dispatch({ type: "ADD_ITEM", payload: { restaurantId, restaurantName, item } });
  }
  function removeItem(itemId) {
    dispatch({ type: "REMOVE_ITEM", payload: { itemId } });
  }
  function updateQty(itemId, qty) {
    dispatch({ type: "UPDATE_QTY", payload: { itemId, qty } });
  }
  function clearCart() {
    dispatch({ type: "CLEAR_CART" });
  }

  return (
    <CartContext.Provider
      value={{ cart, subtotal, totalItems, addItem, removeItem, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

