import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from "react-icons/fi";
import { vehicleService } from "../../services/vehicleService.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import VehicleFormModal from "../../components/admin/VehicleFormModal.jsx";

const AdminVehicles = () => {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-vehicles", search],
    queryFn: () => vehicleService.getAll({ search, limit: 50 }).then((r) => r.data),
  });

  const handleDelete = async (id) => {
    if (!confirm("Delete this vehicle permanently?")) return;
    try {
      await vehicleService.remove(id);
      toast.success("Vehicle deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete vehicle");
    }
  };

  const openAdd = () => { setEditingVehicle(null); setModalOpen(true); };
  const openEdit = (v) => { setEditingVehicle(v); setModalOpen(true); };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Vehicle management</h1>
          <p className="mt-1 text-sm text-slate-400">{data?.pagination?.total ?? 0} vehicles in your fleet</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search vehicles..." className="input-field pl-11" />
          </div>
          <button onClick={openAdd} className="btn-primary"><FiPlus /> Add vehicle</button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : data?.data?.length === 0 ? (
        <div className="mt-6"><EmptyState title="No vehicles found" description="Add your first vehicle to get started." action={<button onClick={openAdd} className="btn-primary">Add vehicle</button>} /></div>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">Vehicle</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price/day</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Bookings</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((v) => (
                <tr key={v._id} className="border-b border-white/5 last:border-0">
                  <td className="flex items-center gap-3 px-5 py-3">
                    <img src={v.images?.[0]?.url || "https://placehold.co/80x60"} alt="" className="h-10 w-14 rounded-lg object-cover" />
                    <div><p className="font-medium text-slate-200">{v.name}</p><p className="text-xs text-slate-500">{v.licensePlate}</p></div>
                  </td>
                  <td className="px-5 py-3 text-slate-400">{v.category}</td>
                  <td className="px-5 py-3 text-white">₹{v.pricePerDay}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${v.isAvailable ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                      {v.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">{v.totalBookings}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEdit(v)} className="text-electric-400 hover:text-electric-500"><FiEdit2 size={15} /></button>
                      <button onClick={() => handleDelete(v._id)} className="text-red-400 hover:text-red-500"><FiTrash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <VehicleFormModal
          vehicle={editingVehicle}
          onClose={() => setModalOpen(false)}
          onSuccess={() => { setModalOpen(false); queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] }); }}
        />
      )}
    </div>
  );
};

export default AdminVehicles;
