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
import { CartProvider } from "./context/cartContext";

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
          <Route path='/admin' element={<AdminDashboard/>} />
          <Route path='/admin/products' element={<AdminProducts/>} />
          <Route path='/admin/products/new' element={<AdminProductsCreate/>} />
          <Route path='/admin/products/edit/:id' element={<AdminProductEdit/>} />

        </Routes>
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
