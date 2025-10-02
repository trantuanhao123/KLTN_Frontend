import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Import tất cả các trang
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Dashboard from "../pages/dashboard/Dashboard";
import VehicleList from "../pages/vehicles/VehicleList";
import VehicleForm from "../pages/vehicles/VehicleForm";
import BookingList from "../pages/bookings/BookingList";
import CustomerList from "../pages/customers/CustomerList";
import Reports from "../pages/reports/Reports";

// Component bảo vệ route
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  // Nếu chưa đăng nhập, chuyển hướng về /login
  if (!user) return <Navigate to="/login" replace />;

  // Nếu đã đăng nhập, trả về component con (ví dụ: <Dashboard />)
  // Nếu có Layout, bọc children trong <Layout>
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* -------------------- PUBLIC ROUTES -------------------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* -------------------- PROTECTED ROUTES -------------------- */}

      {/* Route Trang Chủ (Tự động điều hướng đến Dashboard nếu đã đăng nhập) */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {/* Nếu có Layout, wrap <Dashboard /> trong <Layout> */}
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Vehicle Routes */}
      <Route
        path="/vehicles"
        element={
          <ProtectedRoute>
            <VehicleList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles/new"
        element={
          <ProtectedRoute>
            <VehicleForm />
          </ProtectedRoute>
        }
      />

      {/* Booking Route */}
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <BookingList />
          </ProtectedRoute>
        }
      />

      {/* Customer Route */}
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <CustomerList />
          </ProtectedRoute>
        }
      />

      {/* Reports Route */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* Catch-all Route: Chuyển hướng mọi thứ không khớp về Dashboard (nếu đã đăng nhập) hoặc Login (nếu chưa) */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
