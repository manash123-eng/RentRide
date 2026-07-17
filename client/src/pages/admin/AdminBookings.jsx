import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";
import { bookingService } from "../../services/bookingService.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";

const statusColors = {
  pending: "bg-amber-accent/10 text-amber-accent",
  confirmed: "bg-electric/10 text-electric-400",
  ongoing: "bg-emerald-500/10 text-emerald-400",
  completed: "bg-slate-500/10 text-slate-400",
  cancelled: "bg-red-500/10 text-red-400",
};
const statuses = ["pending", "confirmed", "ongoing", "completed", "cancelled"];

const AdminBookings = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-bookings", search, statusFilter],
    queryFn: () => bookingService.getAll({ search, status: statusFilter, limit: 50 }).then((r) => r.data),
  });

  const handleStatusChange = async (id, status) => {
    try {
      await bookingService.updateStatus(id, status);
      toast.success("Booking status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update status");
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Booking management</h1>
          <p className="mt-1 text-sm text-slate-400">{data?.pagination?.total ?? 0} total bookings</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by booking #" className="input-field pl-11" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-44">
            <option value="">All statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? <LoadingSpinner size="lg" /> : data?.data?.length === 0 ? (
        <div className="mt-6"><EmptyState title="No bookings found" /></div>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">Booking</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Vehicle</th>
                <th className="px-5 py-3">Dates</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((b) => (
                <tr key={b._id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3 font-medium text-slate-200">#{b.bookingNumber}</td>
                  <td className="px-5 py-3 text-slate-400">{b.customer?.name}</td>
                  <td className="px-5 py-3 text-slate-400">{b.vehicle?.name}</td>
                  <td className="px-5 py-3 text-slate-500">{new Date(b.pickupDate).toLocaleDateString()} - {new Date(b.returnDate).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-white">₹{b.totalPrice.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b._id, e.target.value)}
                      className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold capitalize ${statusColors[b.status]}`}
                    >
                      {statuses.map((s) => <option key={s} value={s} className="bg-graphite text-white">{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
