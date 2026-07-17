import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FiCalendar, FiMapPin } from "react-icons/fi";
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

const tabs = ["all", "pending", "confirmed", "ongoing", "completed", "cancelled"];

const MyBookings = () => {
  const [tab, setTab] = useState("all");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["my-bookings", tab],
    queryFn: () => bookingService.getMyBookings({ status: tab === "all" ? undefined : tab, limit: 50 }).then((r) => r.data),
  });

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await bookingService.cancel(id, "Cancelled by customer");
      toast.success("Booking cancelled");
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel booking");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">My bookings</h1>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium capitalize transition ${tab === t ? "bg-electric text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : data?.data?.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={FiCalendar} title="No bookings found" description="You don't have any bookings in this category yet." action={<Link to="/vehicles" className="btn-primary">Browse fleet</Link>} />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {data?.data?.map((b) => (
            <div key={b._id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <img src={b.vehicle?.images?.[0]?.url || "https://placehold.co/120x90"} alt="" className="h-16 w-24 rounded-lg object-cover" />
                <div>
                  <p className="font-display font-semibold text-white">{b.vehicle?.name}</p>
                  <p className="text-xs text-slate-500">#{b.bookingNumber}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><FiCalendar size={12} /> {new Date(b.pickupDate).toLocaleDateString()} – {new Date(b.returnDate).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><FiMapPin size={12} /> {b.pickupLocation}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display font-semibold text-white">₹{b.totalPrice.toFixed(2)}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColors[b.status]}`}>{b.status}</span>
                {["pending", "confirmed"].includes(b.status) && (
                  <button onClick={() => handleCancel(b._id)} className="text-xs font-semibold text-red-400 hover:underline">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
