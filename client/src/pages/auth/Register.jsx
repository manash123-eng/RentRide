import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiPhone } from "react-icons/fi";
import Logo from "../../components/Logo.jsx";
import Button from "../../components/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="card p-8">
          <h1 className="font-display text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-1 text-sm text-slate-400">Join RentRide and start booking in minutes.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="label-text">Full name</label>
              <div className="relative">
                <FiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input placeholder="John Doe" className="input-field pl-11" {...register("name", { required: "Name is required" })} />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label-text">Email address</label>
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="email" placeholder="you@example.com" className="input-field pl-11" {...register("email", { required: "Email is required" })} />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label-text">Phone number</label>
              <div className="relative">
                <FiPhone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input placeholder="9876543210" className="input-field pl-11" {...register("phone")} />
              </div>
            </div>

            <div>
              <label className="label-text">Password</label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="password" placeholder="At least 6 characters" className="input-field pl-11" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })} />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label-text">Confirm password</label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  placeholder="Re-enter password"
                  className="input-field pl-11"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (val) => val === watch("password") || "Passwords do not match",
                  })}
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" isLoading={loading} className="w-full">Create account</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account? <Link to="/login" className="font-semibold text-electric-400 hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
