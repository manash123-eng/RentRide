import React from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../services/dashboardService.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { FiStar } from "react-icons/fi";

const AdminReports = () => {
  const { data: topVehicles, isLoading } = useQuery({
    queryKey: ["top-vehicles"],
    queryFn: () => dashboardService.getTopVehicles().then((r) => r.data.data),
  });

  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Reports & analytics</h1>
      <p className="mt-1 text-sm text-slate-400">Top performing vehicles by total bookings.</p>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Rank</th>
              <th className="px-5 py-3">Vehicle</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Total bookings</th>
              <th className="px-5 py-3">Rating</th>
              <th className="px-5 py-3">Price/day</th>
            </tr>
          </thead>
          <tbody>
            {topVehicles?.map((v, i) => (
              <tr key={v._id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3 font-display font-bold text-electric-400">#{i + 1}</td>
                <td className="px-5 py-3 font-medium text-slate-200">{v.name}</td>
                <td className="px-5 py-3 text-slate-400">{v.category}</td>
                <td className="px-5 py-3 text-white">{v.totalBookings}</td>
                <td className="px-5 py-3 text-amber-accent"><span className="flex items-center gap-1"><FiStar className="fill-amber-accent" size={13} /> {v.ratingsAverage}</span></td>
                <td className="px-5 py-3 text-slate-400">₹{v.pricePerDay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReports;
