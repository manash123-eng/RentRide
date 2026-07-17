import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiX, FiUpload } from "react-icons/fi";
import { vehicleService } from "../../services/vehicleService.js";
import Button from "../Button.jsx";

const categories = ["Sedan", "SUV", "Hatchback", "Luxury", "Convertible", "Van", "Truck", "Electric", "Bike"];

const VehicleFormModal = ({ vehicle, onClose, onSuccess }) => {
  const isEdit = !!vehicle;
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: vehicle
      ? { ...vehicle, features: vehicle.features?.join(", ") }
      : { transmission: "Automatic", fuelType: "Petrol", category: "Sedan", isAvailable: true },
  });
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "features") {
          formData.append("features", JSON.stringify(value ? value.split(",").map((f) => f.trim()).filter(Boolean) : []));
        } else {
          formData.append(key, value);
        }
      });
      Array.from(files).forEach((file) => formData.append("images", file));

      if (isEdit) {
        await vehicleService.update(vehicle._id, formData);
        toast.success("Vehicle updated successfully");
      } else {
        await vehicleService.create(formData);
        toast.success("Vehicle added successfully");
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save vehicle");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-white">{isEdit ? "Edit vehicle" : "Add new vehicle"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><FiX size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-text">Vehicle name</label><input className="input-field" {...register("name", { required: true })} /></div>
            <div><label className="label-text">License plate</label><input className="input-field" {...register("licensePlate", { required: true })} /></div>
            <div><label className="label-text">Brand</label><input className="input-field" {...register("brand", { required: true })} /></div>
            <div><label className="label-text">Model</label><input className="input-field" {...register("model", { required: true })} /></div>
            <div><label className="label-text">Year</label><input type="number" className="input-field" {...register("year", { required: true })} /></div>
            <div><label className="label-text">Category</label>
              <select className="input-field" {...register("category")}>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select>
            </div>
            <div><label className="label-text">Transmission</label>
              <select className="input-field" {...register("transmission")}><option>Automatic</option><option>Manual</option></select>
            </div>
            <div><label className="label-text">Fuel type</label>
              <select className="input-field" {...register("fuelType")}><option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option></select>
            </div>
            <div><label className="label-text">Seats</label><input type="number" className="input-field" {...register("seats", { required: true })} /></div>
            <div><label className="label-text">Price per day (₹)</label><input type="number" className="input-field" {...register("pricePerDay", { required: true })} /></div>
            <div><label className="label-text">Discount %</label><input type="number" className="input-field" {...register("discountPercent")} /></div>
            <div><label className="label-text">Location</label><input className="input-field" {...register("location", { required: true })} /></div>
          </div>

          <div><label className="label-text">Description</label><textarea rows={3} className="input-field" {...register("description", { required: true })} /></div>
          <div><label className="label-text">Features (comma separated)</label><input className="input-field" placeholder="Sunroof, ABS, Bluetooth" {...register("features")} /></div>

          <div>
            <label className="label-text">Upload images</label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/5 py-6 text-sm text-slate-400 hover:bg-white/10">
              <FiUpload /> {files.length > 0 ? `${files.length} file(s) selected` : "Click to select images"}
              <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => setFiles(e.target.files)} />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" defaultChecked={vehicle?.isAvailable ?? true} {...register("isAvailable")} className="h-4 w-4 rounded border-white/20 bg-ink text-electric" />
            Available for booking
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={saving}>{isEdit ? "Save changes" : "Add vehicle"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleFormModal;
