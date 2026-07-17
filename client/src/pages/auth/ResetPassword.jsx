import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiLock } from "react-icons/fi";
import Logo from "../../components/Logo.jsx";
import Button from "../../components/Button.jsx";
import { authService } from "../../services/authService.js";

const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.resetPassword({ token: searchParams.get("token") || data.token, password: data.password });
      toast.success("Password reset successfully. Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="card p-8">
          <h1 className="font-display text-2xl font-bold text-white">Set a new password</h1>
          <p className="mt-1 text-sm text-slate-400">Choose a strong password you haven't used before.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {!searchParams.get("token") && (
              <div>
                <label className="label-text">Reset token</label>
                <input placeholder="Paste your reset token" className="input-field" {...register("token", { required: "Reset token is required" })} />
              </div>
            )}
            <div>
              <label className="label-text">New password</label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="password" placeholder="At least 6 characters" className="input-field pl-11" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })} />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>
            <Button type="submit" isLoading={loading} className="w-full">Reset password</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            <Link to="/login" className="font-semibold text-electric-400 hover:underline">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
