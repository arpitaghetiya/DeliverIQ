import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

export async function predictDeliveryTime(params) {
  const res = await api.post("/api/predict", params);
  return res.data;
}

export async function createOrder(orderPayload) {
  const res = await api.post("/api/orders", orderPayload);
  return res.data;
}

export async function fetchOrders() {
  const res = await api.get("/api/orders");
  return res.data;
}

export async function fetchOrderById(id) {
  const res = await api.get(`/api/orders/${id}`);
  return res.data;
}

export async function updateRemoteOrderStatus(id, status) {
  const res = await api.patch(`/api/orders/${id}/status`, { status });
  return res.data;
}

export async function fetchAdminStats() {
  const res = await api.get("/api/admin/stats");
  return res.data;
}

export default api;

