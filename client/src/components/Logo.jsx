import React from "react";
import { Link } from "react-router-dom";

const Logo = ({ light = false }) => (
  <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-electric to-electric-700 text-white shadow-glow">
      R
    </span>
    <span className={light ? "text-white" : "text-slate-100"}>
      Rent<span className="text-electric-400">Ride</span>
    </span>
  </Link>
);

export default Logo;
