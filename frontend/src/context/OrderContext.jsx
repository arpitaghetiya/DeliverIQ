import { createContext, useContext, useState, useEffect } from "react";
import { fetchOrders, updateRemoteOrderStatus } from "../api/client";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("diq_orders") || "[]");
    } catch {
      return [];
    }
  });

  // Sync with backend SQLite if available
  useEffect(() => {
    let mounted = true;
    fetchOrders()
      .then((remoteOrders) => {
        if (!mounted || !Array.isArray(remoteOrders) || remoteOrders.length === 0) return;
        setOrders((prev) => {
          // Merge remote orders with local orders by id
          const map = new Map();
          remoteOrders.forEach((o) => map.set(o.id, o));
          prev.forEach((o) => {
            if (!map.has(o.id)) map.set(o.id, o);
          });
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          try {
            localStorage.setItem("diq_orders", JSON.stringify(merged));
          } catch {}
          return merged;
        });
      })
      .catch(() => {
        // Backend offline, keep local orders
      });

    return () => {
      mounted = false;
    };
  }, []);

  function addOrder(order) {
    const updated = [order, ...orders.filter((o) => o.id !== order.id)];
    setOrders(updated);
    try {
      localStorage.setItem("diq_orders", JSON.stringify(updated));
    } catch {}
  }

  function updateOrderStatus(orderId, status) {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status } : o
    );
    setOrders(updated);
    try {
      localStorage.setItem("diq_orders", JSON.stringify(updated));
    } catch {}

    // Async attempt to update backend SQLite
    updateRemoteOrderStatus(orderId, status).catch(() => {});
  }

  function getOrder(orderId) {
    return orders.find((o) => o.id === orderId);
  }

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used inside OrderProvider");
  return ctx;
}
