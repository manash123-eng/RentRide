import React from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import CustomerLayout from "./layouts/CustomerLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Landing from "./pages/Landing.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

import VehicleListing from "./pages/customer/VehicleListing.jsx";
import VehicleDetail from "./pages/customer/VehicleDetail.jsx";
import Checkout from "./pages/customer/Checkout.jsx";
import DashboardOverview from "./pages/customer/DashboardOverview.jsx";
import MyBookings from "./pages/customer/MyBookings.jsx";
import MyPayments from "./pages/customer/MyPayments.jsx";
import Notifications from "./pages/customer/Notifications.jsx";
import Profile from "./pages/customer/Profile.jsx";
import Wishlist from "./pages/customer/Wishlist.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminVehicles from "./pages/admin/AdminVehicles.jsx";
import AdminBookings from "./pages/admin/AdminBookings.jsx";
import AdminCustomers from "./pages/admin/AdminCustomers.jsx";
import AdminPayments from "./pages/admin/AdminPayments.jsx";
import AdminCoupons from "./pages/admin/AdminCoupons.jsx";
import AdminReports from "./pages/admin/AdminReports.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/vehicles" element={<VehicleListing />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
        </Route>
      </Route>

      <Route 
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="payments" element={<MyPayments />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      <Route 
      //path="/profile"
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="vehicles" element={<AdminVehicles />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
