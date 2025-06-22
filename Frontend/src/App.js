import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import { AuthProvider } from "./context/AuthContext"; // ✅ Perbaikan typo
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminProductsCreate from "./pages/AdminProductsCreate";
import AdminProductEdit from "./pages/AdminProductEdit";
import AdminOrders from "./pages/AdminOrders";
import Checkout from "./pages/Checkout";
import OrderSucces from "./pages/OrderSucces";
import { CartProvider } from "./context/cartContext";
import AdminUsers from './pages/AdminUsers';
import AdminCategories from './pages/AdminCategories';
import Orders from "./pages/Orders";
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-succes" element={<OrderSucces />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/users" element={<AdminUsers />} />
      {/* Admin Routes */}
          <Route path='/admin' element={<AdminDashboard/>} />
          <Route path='/admin/products' element={<AdminProducts/>} />
          <Route path='/admin/products/new' element={<AdminProductsCreate/>} />
          <Route path='/admin/products/edit/:id' element={<AdminProductEdit/>} />
          <Route path='/admin/orders' element={<AdminOrders/>} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Routes>
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
