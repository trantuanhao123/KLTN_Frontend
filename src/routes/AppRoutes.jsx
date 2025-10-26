import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

// ---------- AUTH ----------
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// ---------- DASHBOARD ----------
import Dashboard from "../pages/dashboard/Dashboard";

// ---------- VEHICLES ----------
import VehicleList from "../pages/vehicles/VehicleList";
import VehicleForm from "../pages/vehicles/VehicleForm";
import VehicleUpdateForm from "../pages/vehicles/VehicleUpdateForm";
import VehicleDetail from "../pages/vehicles/VehicleDetail";
import VehicleUpdateImage from "../pages/vehicles/VehicleUpdateImage";

// ---------- BOOKINGS ----------
import BookingList from "../pages/bookings/BookingList";
import BookingForm from "../pages/bookings/BookingForm";
import BookingUpdateForm from "../pages/bookings/BookingUpdateForm";
import BookingDetail from "../pages/bookings/BookingDetail";
import BookingPickup from "../pages/bookings/BookingPickup";
import BookingComplete from "../pages/bookings/BookingComplete";
// ---------- CUSTOMERS ----------
import CustomerList from "../pages/customers/CustomerList";
import CustomerDetail from "../pages/customers/CustomerDetail";
import CustomerOrderDetail from "../pages/customers/CustomerOrderDetail";

// ---------- REPORTS ----------
import Reports from "../pages/reports/Reports";

// ---------- CATEGORIES ----------
import CategoryList from "../pages/categories/CategoryList";
import CategoryForm from "../pages/categories/CategoryForm";
import CategoryUpdateForm from "../pages/categories/CategoryUpdateForm";

// ---------- SERVICES ----------
import ServiceList from "../pages/services/ServiceList";
import ServiceForm from "../pages/services/ServiceForm";
import ServiceUpdateForm from "../pages/services/ServiceUpdateForm";
// // ---------- INCIDENTS ----------
// import IncidentList from "../pages/incidents/IncidentList";
// import IncidentForm from "../pages/incidents/IncidentForm";
// import IncidentUpdateForm from "../pages/incidents/IncidentUpdateForm";

// // ---------- BRANCHES ----------
import BranchList from "../pages/branches/BranchList";
import BranchForm from "../pages/branches/BranchForm";
import BranchUpdateForm from "../pages/branches/BranchUpdateForm";
import BranchDetail from "../pages/branches/BranchDetail";

// // ---------- Banner ----------
import BannerList from "../pages/banner/BannerList";
import BannerForm from "../pages/banner/BannerForm";
import BannerUpdateForm from "../pages/banner/BannerUpdateForm";

// // ---------- Discount ----------
import DiscountList from "../pages/discounts/DiscountList";
import DiscountForm from "../pages/discounts/DiscountForm";
import DiscountUpdateForm from "../pages/discounts/DiscountUpdateForm";

// // ---------- Notification ----------
import NotificationList from "../pages/notifications/NotificationList";
import NotificationForm from "../pages/notifications/NotificationForm";
// -------------------- Protected Route --------------------
function ProtectedRoute({ children }) {
  const { user, logout } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  // 2. KIỂM TRA HẾT HẠN TOKEN
  // (Code này giờ đã chạy đúng vì user.expiresAt đã tồn tại)
  const isExpired = user.expiresAt && Date.now() > user.expiresAt;

  if (isExpired) {
    // Nếu token hết hạn:
    console.warn("Phiên đăng nhập đã hết hạn. Đang đăng xuất...");
    // 1. Gọi logout() để xóa user khỏi Context và localStorage
    if (logout) logout();
    // 2. Điều hướng về /login
    return <Navigate to="/login" replace />;
  }

  return children;
}

// -------------------- App Routes --------------------
export default function AppRoutes() {
  return (
    <Routes>
      {/* -------- PUBLIC ROUTES -------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* -------- DEFAULT ROUTE -------- */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      {/* -------- DASHBOARD -------- */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* -------- VEHICLES -------- */}
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
      <Route
        path="/vehicles/edit/:id"
        element={
          <ProtectedRoute>
            <VehicleUpdateForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles/:id"
        element={
          <ProtectedRoute>
            <VehicleDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles/editImage/:id"
        element={
          <ProtectedRoute>
            <VehicleUpdateImage />
          </ProtectedRoute>
        }
      />
      {/* -------- BOOKINGS -------- */}
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <BookingList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings/new"
        element={
          <ProtectedRoute>
            <BookingForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings/edit/:id"
        element={
          <ProtectedRoute>
            <BookingUpdateForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings/:id"
        element={
          <ProtectedRoute>
            <BookingDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings/pickup/:id"
        element={
          <ProtectedRoute>
            <BookingPickup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings/complete/:id"
        element={
          <ProtectedRoute>
            <BookingComplete />
          </ProtectedRoute>
        }
      />
      {/* -------- CUSTOMERS -------- */}
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <CustomerList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers/:id"
        element={
          <ProtectedRoute>
            <CustomerDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers/orders/:userId"
        element={
          <ProtectedRoute>
            <CustomerOrderDetail />
          </ProtectedRoute>
        }
      />
      {/* -------- REPORTS -------- */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      {/* -------- CATEGORIES (CRUD) -------- */}
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <CategoryList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories/new"
        element={
          <ProtectedRoute>
            <CategoryForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories/edit/:id"
        element={
          <ProtectedRoute>
            <CategoryUpdateForm />
          </ProtectedRoute>
        }
      />
      {/*-------- SERVICES (CRUD) -------- */}
      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <ServiceList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services/new"
        element={
          <ProtectedRoute>
            <ServiceForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services/edit/:id"
        element={
          <ProtectedRoute>
            <ServiceUpdateForm />
          </ProtectedRoute>
        }
      />
      {/* -------- INCIDENTS (CRUD) -------- */}
      {/* <Route
        path="/incidents"
        element={
          <ProtectedRoute>
            <IncidentList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/incidents/new"
        element={
          <ProtectedRoute>
            <IncidentForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/incidents/edit/:id"
        element={
          <ProtectedRoute>
            <IncidentUpdateForm />
          </ProtectedRoute>
        }
      /> */}
      {/* -------- BRANCHES (CRUD) -------- */}
      <Route
        path="/branches"
        element={
          <ProtectedRoute>
            <BranchList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/branches/detail/:id"
        element={
          <ProtectedRoute>
            <BranchDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/branches/new"
        element={
          <ProtectedRoute>
            <BranchForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/branches/edit/:id"
        element={
          <ProtectedRoute>
            <BranchUpdateForm />
          </ProtectedRoute>
        }
      />
      {/* -------- Banner (CRUD) -------- */}
      <Route
        path="/banners"
        element={
          <ProtectedRoute>
            <BannerList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/banners/new"
        element={
          <ProtectedRoute>
            <BannerForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/banners/edit/:id"
        element={
          <ProtectedRoute>
            <BannerUpdateForm />
          </ProtectedRoute>
        }
      />
      {/* -------- Discount -------- */}
      <Route
        path="/discounts"
        element={
          <ProtectedRoute>
            <DiscountList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/discounts/new"
        element={
          <ProtectedRoute>
            <DiscountForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/discounts/edit/:id"
        element={
          <ProtectedRoute>
            <DiscountUpdateForm />
          </ProtectedRoute>
        }
      />
      {/* -------- Notification -------- */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications/new"
        element={
          <ProtectedRoute>
            <NotificationForm />
          </ProtectedRoute>
        }
      />
      {/* -------- CATCH-ALL -------- */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
