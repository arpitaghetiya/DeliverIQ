import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import RestaurantPage from "./pages/RestaurantPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import TrackingPage from "./pages/TrackingPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <OrderProvider>
          <div className="app-shell">
            <Navbar />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/restaurant/:id" element={<RestaurantPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                <Route path="/track/:orderId" element={<TrackingPage />} />
                <Route path="/orders" element={<OrderHistoryPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={
                  <div className="page not-found">
                    <h2>404 — Page not found</h2>
                    <a className="primary-btn" href="/">Go Home</a>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </OrderProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
