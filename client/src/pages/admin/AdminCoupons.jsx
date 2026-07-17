import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { couponService } from "../../services/couponService.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import Button from "../../components/Button.jsx";

const AdminCoupons = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({ defaultValues: { discountType: "percentage" } });
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: () => couponService.getAll().then((r) => r.data.data),
  });

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await couponService.create(data);
      toast.success("Coupon created successfully");
      reset();
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await couponService.remove(id);
      toast.success("Coupon deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    } catch (err) {
      toast.error("Could not delete coupon");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Coupons & discounts</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary"><FiPlus /> New coupon</button>
      </div>

      {isLoading ? <LoadingSpinner size="lg" /> : data?.length === 0 ? (
        <div className="mt-6"><EmptyState title="No coupons yet" description="Create your first discount coupon." action={<button onClick={() => setModalOpen(true)} className="btn-primary">New coupon</button>} /></div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((c) => (
            <div key={c._id} className="card p-5">
              <div className="flex items-start justify-between">
                <span className="rounded-lg bg-electric/10 px-3 py-1.5 font-mono text-sm font-bold text-electric-400">{c.code}</span>
                <button onClick={() => handleDelete(c._id)} className="text-red-400 hover:text-red-500"><FiTrash2 size={15} /></button>
              </div>
              <p className="mt-3 font-display text-lg font-bold text-white">
                {c.discountType === "percentage" ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
              </p>
              <p className="mt-1 text-xs text-slate-500">Expires {new Date(c.expiryDate).toLocaleDateString()}</p>
              <p className="mt-1 text-xs text-slate-500">Used {c.usedCount} / {c.usageLimit} times</p>
              <span className={`mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${c.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                {c.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="card w-full max-w-md p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-white">New coupon</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div><label className="label-text">Coupon code</label><input className="input-field" placeholder="SUMMER25" {...register("code", { required: true })} /></div>
              <div><label className="label-text">Discount type</label>
                <select className="input-field" {...register("discountType")}><option value="percentage">Percentage</option><option value="flat">Flat amount</option></select>
              </div>
              <div><label className="label-text">Discount value</label><input type="number" className="input-field" {...register("discountValue", { required: true })} /></div>
              <div><label className="label-text">Max discount amount (for %)</label><input type="number" className="input-field" {...register("maxDiscountAmount")} /></div>
              <div><label className="label-text">Min booking amount</label><input type="number" className="input-field" {...register("minBookingAmount")} /></div>
              <div><label className="label-text">Usage limit</label><input type="number" defaultValue={100} className="input-field" {...register("usageLimit")} /></div>
              <div><label className="label-text">Expiry date</label><input type="date" className="input-field" {...register("expiryDate", { required: true })} /></div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button type="submit" isLoading={saving}>Create coupon</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
