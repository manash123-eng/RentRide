import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FiUser, FiCalendar, FiHeart, FiCreditCard, FiBell, FiMenu, FiX, FiLogOut, FiGrid } from "react-icons/fi";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: FiGrid, end: true },
  { to: "/dashboard/bookings", label: "My Bookings", icon: FiCalendar },
  { to: "/dashboard/payments", label: "Payments", icon: FiCreditCard },
  { to: "/wishlist", label: "Wishlist", icon: FiHeart },
  { to: "/dashboard/notifications", label: "Notifications", icon: FiBell },
  { to: "/profile", label: "Profile", icon: FiUser },
];

const CustomerLayout = () => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <button className="fixed bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-electric text-white shadow-glow lg:hidden" onClick={() => setOpen(true)}>
          <FiMenu size={20} />
        </button>

        {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}

        <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto bg-graphite p-5 transition-transform lg:static lg:w-64 lg:translate-x-0 lg:rounded-xl2 lg:border lg:border-white/5 lg:bg-graphite/60 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <span className="font-display font-semibold text-white">Menu</span>
            <button onClick={() => setOpen(false)} className="text-slate-300"><FiX size={20} /></button>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    isActive ? "bg-electric/15 text-electric-400" : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <item.icon size={17} /> {item.label}
              </NavLink>
            ))}
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="mt-3 flex items-center gap-3 rounded-xl border-t border-white/5 px-3.5 py-2.5 pt-4 text-sm font-medium text-red-400 hover:bg-white/5"
            >
              <FiLogOut size={17} /> Logout
            </button>
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
