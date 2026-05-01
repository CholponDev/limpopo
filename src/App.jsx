import "./App.css";

import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./components/Home";
import CategoryPage from "./pages/CategoryPage";

import AdminLogin from "./pages/AdminLogin";
import AdminProducts from "./pages/AdminProducts";
import AdminRegister from "./pages/AdminRegister";
import AdminRoute from "./components/AdminRoute";

import RegisterClient from "./pages/RegisterClient";
import LoginClient from "./pages/LoginClient";
import OrderPage from "./pages/OrderPage";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/category/:categoryId" element={<CategoryPage />} />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-register" element={<AdminRegister />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />

        <Route path="/register" element={<RegisterClient />} />
        <Route path="/login" element={<LoginClient />} />

        <Route
          path="/order/:productId"
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;