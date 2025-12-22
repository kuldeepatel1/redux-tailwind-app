

import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OtpPage from "./pages/OtpPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import ProductsPage from "./pages/product/ProductsPage";
import AddProductPage from "./pages/product/AddProductPage";
import ProductDetail from "./pages/product/ProductDetail";
import CartPage from "./pages/cart/CartPage";
import ProfilePage from "./pages/profile/ProfilePage";
import MyProductsPage from "./pages/profile/MyProductsPage";
import MyOrdersPage from "./pages/profile/MyOrdersPage";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<OtpPage />} />
      
      {/* Protected Routes */}

      <Route path="/products" element={
        <ProtectedRoute>
          <ProductsPage />
        </ProtectedRoute>
      } />
      

      <Route path="/add-product" element={
        <ProtectedRoute>
          <AddProductPage />
        </ProtectedRoute>
      } />
      

      <Route path="/product/:id" element={
  <ProtectedRoute>
    <ProductDetail />
  </ProtectedRoute>
} />


      

      <Route path="/cart" element={
        <ProtectedRoute>
          <CartPage />
        </ProtectedRoute>
      } />
      

      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      

      <Route path="/my-products" element={
        <ProtectedRoute>
          <MyProductsPage />
        </ProtectedRoute>
      } />
      

      <Route path="/my-orders" element={
        <ProtectedRoute>
          <MyOrdersPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
