import React, { useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiHeart, FiBell, FiLogOut, FiGrid } from "react-icons/fi";
import Logo from "./Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useClickOutside } from "../hooks/useClickOutside.js";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/vehicles", label: "Browse Fleet" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  useClickOutside(menuRef, () => setMenuOpen(false));

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 text-sm font-medium text-slate-100 transition hover:bg-white/10"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-electric text-xs font-bold text-white">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
                {user?.name?.split(" ")[0]}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-graphite shadow-soft">
                  <Link to={user.role === "admin" ? "/admin" : "/dashboard"} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-slate-200 hover:bg-white/5">
                    <FiGrid size={15} /> {user.role === "admin" ? "Admin Dashboard" : "My Dashboard"}
                  </Link>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-slate-200 hover:bg-white/5">
                    <FiUser size={15} /> Profile
                  </Link>
                  <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-slate-200 hover:bg-white/5">
                    <FiHeart size={15} /> Wishlist
                  </Link>
                  <button
                    onClick={() => { logout(); navigate("/"); setMenuOpen(false); }}
                    className="flex w-full items-center gap-2 border-t border-white/5 px-4 py-3 text-sm text-red-400 hover:bg-white/5"
                  >
                    <FiLogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white">
                Log in
              </Link>
              <Link to="/register" className="btn-primary px-5 py-2.5 text-sm">
                Get started
              </Link>
            </>
          )}
        </div>

        <button className="text-slate-200 md:hidden" onClick={() => setOpen((o) => !o)}>
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-ink px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5">
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-white/5 pt-3">
            {isAuthenticated ? (
              <>
                <Link to={user.role === "admin" ? "/admin" : "/dashboard"} onClick={() => setOpen(false)} className="btn-secondary w-full">Dashboard</Link>
                <button onClick={() => { logout(); navigate("/"); setOpen(false); }} className="btn-primary w-full">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary w-full">Log in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full">Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
