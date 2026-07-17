import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiCalendar, FiCreditCard, FiHeart, FiArrowRight } from "react-icons/fi";
import { bookingService } from "../../services/bookingService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";

const statusColors = {
  pending: "bg-amber-accent/10 text-amber-accent",
  confirmed: "bg-electric/10 text-electric-400",
  ongoing: "bg-emerald-500/10 text-emerald-400",
  completed: "bg-slate-500/10 text-slate-400",
  cancelled: "bg-red-500/10 text-red-400",
};

const DashboardOverview = () => {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["my-bookings-overview"],
    queryFn: () => bookingService.getMyBookings({ limit: 5 }).then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner size="lg" />;

  const bookings = data?.data || [];
  const activeCount = bookings.filter((b) => ["confirmed", "ongoing"].includes(b.status)).length;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Welcome back, {user?.name?.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-slate-400">Here's an overview of your rental activity.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-electric/10 text-electric-400"><FiCalendar size={20} /></div>
          <div><p className="text-xs text-slate-500">Active bookings</p><p className="font-display text-xl font-bold text-white">{activeCount}</p></div>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-accent/10 text-amber-accent"><FiCreditCard size={20} /></div>
          <div><p className="text-xs text-slate-500">Total bookings</p><p className="font-display text-xl font-bold text-white">{data?.pagination?.total ?? bookings.length}</p></div>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400"><FiHeart size={20} /></div>
          <div><p className="text-xs text-slate-500">Saved vehicles</p><Link to="/wishlist" className="font-display text-sm font-semibold text-electric-400 hover:underline">View wishlist</Link></div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-white">Recent bookings</h2>
          <Link to="/dashboard/bookings" className="flex items-center gap-1 text-sm font-medium text-electric-400 hover:underline">View all <FiArrowRight size={13} /></Link>
        </div>

        {bookings.length === 0 ? (
          <div className="mt-4">
            <EmptyState icon={FiCalendar} title="No bookings yet" description="Browse the fleet and book your first ride." action={<Link to="/vehicles" className="btn-primary">Browse fleet</Link>} />
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {bookings.map((b) => (
              <Link to={`/dashboard/bookings/${b._id}`} key={b._id} className="card flex items-center justify-between gap-4 p-4 transition hover:border-electric/30">
                <div className="flex items-center gap-3">
                  <img src={b.vehicle?.images?.[0]?.url || "https://placehold.co/100x80"} alt="" className="h-12 w-16 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-white">{b.vehicle?.name}</p>
                    <p className="text-xs text-slate-500">#{b.bookingNumber}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColors[b.status]}`}>{b.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;
