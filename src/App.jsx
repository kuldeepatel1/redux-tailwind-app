import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { CartContext } from "./context/CartContext";
import { initializeAuth } from "./features/auth/authSlice";
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
  const dispatch = useDispatch();
  
  // Use CartContext instead of Redux for cart state
  const { 
    cartItems, 
    getTotalItems, 
    getTotalPrice, 
    isCartOpen, 
    toggleCart 
  } = useContext(CartContext);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // Initialize auth state on app load - proper async approach
  useEffect(() => {
    // Initialize auth state from localStorage using the proper thunk
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <>
      {/* Cart Indicator in Header */}
      <nav style={{ 
        display: "flex", 
        gap: 20, 
        padding: "10px 20px", 
        backgroundColor: "#f5f5f5",
        borderBottom: "1px solid #ddd" 
      }}>
        <Link to="/products">Products</Link>
        <Link to="/add-product">Add Product</Link>
        <Link to="/cart">
          Cart ({totalItems} items - ₹{totalPrice})
        </Link>
        <Link to="/profile">Profile</Link>
        <Link to="/my-products">My Products</Link>
        <Link to="/my-orders">My Orders</Link>
      </nav>

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
    </>
  );
}
