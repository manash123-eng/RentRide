import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const NotFound = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
    <p className="font-display text-7xl font-bold text-electric-400">404</p>
    <h1 className="mt-4 font-display text-2xl font-bold text-white">Page not found</h1>
    <p className="mt-2 max-w-sm text-sm text-slate-400">The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/" className="btn-primary mt-7"><FiArrowLeft /> Back to home</Link>
  </div>
);

export default NotFound;
