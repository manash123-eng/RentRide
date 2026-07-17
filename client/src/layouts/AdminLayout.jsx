import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid, FiTruck, FiUsers, FiCalendar, FiCreditCard, FiTag, FiBarChart2,
  FiSettings, FiMenu, FiX, FiLogOut, FiBell,
} from "react-icons/fi";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/admin/vehicles", label: "Vehicles", icon: FiTruck },
  { to: "/admin/bookings", label: "Bookings", icon: FiCalendar },
  { to: "/admin/customers", label: "Customers", icon: FiUsers },
  { to: "/admin/payments", label: "Payments", icon: FiCreditCard },
  { to: "/admin/coupons", label: "Coupons", icon: FiTag },
  { to: "/admin/reports", label: "Reports", icon: FiBarChart2 },
  { to: "/admin/settings", label: "Settings", icon: FiSettings },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-ink">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-white/5 bg-graphite transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between border-b border-white/5 px-5">
          <Logo />
          <button className="lg:hidden text-slate-300" onClick={() => setSidebarOpen(false)}>
            <FiX size={20} />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  isActive ? "bg-electric/15 text-electric-400" : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon size={17} /> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-white/5 p-4">
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-400 hover:bg-white/5"
          >
            <FiLogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-ink/80 px-5 backdrop-blur-lg">
          <button className="text-slate-300 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <FiMenu size={22} />
          </button>
          <div className="hidden lg:block">
            <p className="text-sm text-slate-500">Welcome back,</p>
            <p className="font-display text-sm font-semibold text-white">{user?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 hover:bg-white/10">
              <FiBell size={16} />
            </button>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-electric text-sm font-bold text-white">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
        </header>
        <main className="flex-1 p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
