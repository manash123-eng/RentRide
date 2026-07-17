import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiMail } from "react-icons/fi";
import Logo from "../../components/Logo.jsx";
import Button from "../../components/Button.jsx";
import { authService } from "../../services/authService.js";

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.forgotPassword(data);
      setSent(true);
      toast.success("Reset instructions sent if the account exists");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="card p-8">
          <h1 className="font-display text-2xl font-bold text-white">Reset your password</h1>
          <p className="mt-1 text-sm text-slate-400">Enter your email and we'll send you reset instructions.</p>

          {sent ? (
            <div className="mt-6 rounded-lg border border-electric/30 bg-electric/5 p-4 text-sm text-slate-300">
              If an account exists with that email, you'll receive password reset instructions shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <label className="label-text">Email address</label>
                <div className="relative">
                  <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="email" placeholder="you@example.com" className="input-field pl-11" {...register("email", { required: "Email is required" })} />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
              </div>
              <Button type="submit" isLoading={loading} className="w-full">Send reset link</Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-slate-400">
            Remembered it? <Link to="/login" className="font-semibold text-electric-400 hover:underline">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
