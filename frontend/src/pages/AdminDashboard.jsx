import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { TrendingUp, ShoppingBag, IndianRupee, Store, RefreshCw } from "lucide-react";
import { useOrders } from "../context/OrderContext";
import { fetchAdminStats } from "../api/client";
import { RESTAURANTS } from "../data/restaurants";

const STATUS_LABEL = {
  confirmed: "Confirmed", preparing: "Preparing", picked_up: "Picked Up",
  on_the_way: "On the Way", delivered: "Delivered",
};
const STATUS_COLORS = {
  confirmed: "#f04b38", preparing: "#f59e0b", picked_up: "#3b82f6",
  on_the_way: "#6366f1", delivered: "#16834a",
};
const PIE_COLORS = ["#f04b38", "#f59e0b", "#3b82f6", "#6366f1", "#16834a", "#ec4899", "#10b981", "#8b5cf6"];

export default function AdminDashboard() {
  const { orders, updateOrderStatus } = useOrders();
  const [apiStats, setApiStats] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  async function fetchApiStats() {
    setLoading(true);
    try {
      const data = await fetchAdminStats();
      setApiStats(data);
      setApiError(null);
    } catch {
      setApiError("FastAPI server offline. Showing local data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchApiStats(); }, []);

  // Local analytics from context
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const statusCounts = {};
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });
  const restaurantCounts = {};
  orders.forEach((o) => {
    restaurantCounts[o.restaurant_name] = (restaurantCounts[o.restaurant_name] || 0) + 1;
  });

  const statusData = Object.entries(statusCounts).map(([k, v]) => ({
    name: STATUS_LABEL[k] || k, value: v, fill: STATUS_COLORS[k] || "#888",
  }));
  const restaurantData = Object.entries(restaurantCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name: name.split(" ")[0], count }));

  return (
    <div className="page admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="admin-sub">DeliverIQ — Demo Data Analytics</p>
        </div>
        <button className="refresh-btn" onClick={fetchApiStats} disabled={loading}>
          <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
        </button>
      </div>

      {apiError && (
        <div className="admin-api-note">ℹ️ {apiError}</div>
      )}

      {/* KPI cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <ShoppingBag size={28} color="#f04b38" />
          <div className="kpi-val">{orders.length}</div>
          <div className="kpi-label">Total Orders</div>
        </div>
        <div className="kpi-card">
          <IndianRupee size={28} color="#16834a" />
          <div className="kpi-val">₹{Math.round(totalRevenue).toLocaleString()}</div>
          <div className="kpi-label">Total Revenue</div>
        </div>
        <div className="kpi-card">
          <TrendingUp size={28} color="#3b82f6" />
          <div className="kpi-val">₹{orders.length ? Math.round(totalRevenue / orders.length) : 0}</div>
          <div className="kpi-label">Avg Order Value</div>
        </div>
        <div className="kpi-card">
          <Store size={28} color="#8b5cf6" />
          <div className="kpi-val">{RESTAURANTS.length}</div>
          <div className="kpi-label">Restaurants Listed</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {["overview", "orders", "restaurants"].map((tab) => (
          <button
            key={tab}
            className={`admin-tab${activeTab === tab ? " active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="admin-charts">
          <div className="chart-card">
            <h3>Orders by Status</h3>
            {statusData.length === 0 ? (
              <div className="chart-empty">No orders yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="chart-card">
            <h3>Orders by Restaurant</h3>
            {restaurantData.length === 0 ? (
              <div className="chart-empty">No orders yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={restaurantData} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {restaurantData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="admin-orders-table">
          <h3>All Orders</h3>
          {orders.length === 0 ? (
            <div className="chart-empty">No orders placed yet.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Restaurant</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>ML Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td><code>#{o.id}</code></td>
                      <td>{o.customer_name}</td>
                      <td>{o.restaurant_name}</td>
                      <td>{o.items?.length || 0} items</td>
                      <td>₹{o.total}</td>
                      <td>{o.predicted_time ? `${Math.round(o.predicted_time)} min` : "—"}</td>
                      <td>
                        <span className="status-chip" style={{ background: STATUS_COLORS[o.status] + "22", color: STATUS_COLORS[o.status] }}>
                          {STATUS_LABEL[o.status]}
                        </span>
                      </td>
                      <td>
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          className="status-select"
                        >
                          {Object.entries(STATUS_LABEL).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "restaurants" && (
        <div className="admin-restaurants">
          <h3>Restaurant Listings</h3>
          <div className="admin-rest-grid">
            {RESTAURANTS.map((r) => (
              <div key={r.id} className="admin-rest-card">
                <img src={r.image} alt={r.name} className="admin-rest-img" />
                <div className="admin-rest-info">
                  <h4>{r.name}</h4>
                  <p>{r.cuisine.join(", ")}</p>
                  <div className="admin-rest-meta">
                    <span>⭐ {r.rating}</span>
                    <span>🛵 ₹{r.deliveryFee}</span>
                    <span>{restaurantCounts[r.name] || 0} orders</span>
                  </div>
                  {r.offer && <div className="admin-offer-tag">{r.offer}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

