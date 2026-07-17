import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "../../components/Logo.jsx";
import Button from "../../components/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      const from = location.state?.from?.pathname;
      navigate(from || (user.role === "admin" ? "/admin" : "/dashboard"));
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="card p-8">
          <h1 className="font-display text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-400">Log in to manage your bookings and rentals.</p>

          <div className="mt-5 rounded-lg border border-electric/20 bg-electric/5 p-3 text-xs text-slate-400">
            Demo admin: admin@rentride.com / admin123 &nbsp;·&nbsp; Demo customer: customer@rentride.com / customer123
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="label-text">Email address</label>
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input-field pl-11"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="label-text">Password</label>
                <Link to="/forgot-password" className="mb-1.5 text-xs font-medium text-electric-400 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input-field pl-11 pr-11"
                  {...register("password", { required: "Password is required" })}
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <Button type="submit" isLoading={loading} className="w-full">Log in</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account? <Link to="/register" className="font-semibold text-electric-400 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
