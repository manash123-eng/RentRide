import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import { authService } from "../../services/authService.js";
import Button from "../../components/Button.jsx";

const AdminSettings = () => {
  const { user, updateUser } = useAuth();
  const { register, handleSubmit } = useForm({ defaultValues: { name: user?.name, phone: user?.phone } });
  const [saving, setSaving] = useState(false);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const res = await authService.updateProfile(data);
      updateUser(res.data.data);
      toast.success("Settings updated successfully");
    } catch (err) {
      toast.error("Could not update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-white">Admin settings</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="card mt-6 space-y-4 p-6">
        <h2 className="font-display text-sm font-semibold text-white">Account details</h2>
        <div><label className="label-text">Name</label><input className="input-field" {...register("name")} /></div>
        <div><label className="label-text">Email</label><input className="input-field opacity-60" value={user?.email} disabled /></div>
        <div><label className="label-text">Phone</label><input className="input-field" {...register("phone")} /></div>
        <Button type="submit" isLoading={saving}>Save settings</Button>
      </form>

      <div className="card mt-6 p-6">
        <h2 className="font-display text-sm font-semibold text-white">Platform information</h2>
        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-slate-500">Platform</p><p className="text-slate-200">RentRide v1.0</p></div>
          <div><p className="text-slate-500">Environment</p><p className="text-slate-200">Production</p></div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
