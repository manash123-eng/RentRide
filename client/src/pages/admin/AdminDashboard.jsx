import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend, Filler,
} from "chart.js";
import { FiTruck, FiUsers, FiCalendar, FiDollarSign } from "react-icons/fi";
import { dashboardService } from "../../services/dashboardService.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

const chartTextColor = "#94a3b8";
const gridColor = "rgba(255,255,255,0.05)";

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="card flex items-center gap-4 p-5">
    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${accent}`}><Icon size={20} /></div>
    <div><p className="text-xs text-slate-500">{label}</p><p className="font-display text-2xl font-bold text-white">{value}</p></div>
  </div>
);

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({ queryKey: ["dashboard-stats"], queryFn: () => dashboardService.getStats().then((r) => r.data.data) });
  const { data: revenue } = useQuery({ queryKey: ["revenue-chart"], queryFn: () => dashboardService.getRevenueChart().then((r) => r.data.data) });
  const { data: bookingChart } = useQuery({ queryKey: ["booking-chart"], queryFn: () => dashboardService.getBookingChart().then((r) => r.data.data) });
  const { data: categoryStats } = useQuery({ queryKey: ["category-stats"], queryFn: () => dashboardService.getCategoryStats().then((r) => r.data.data) });

  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Dashboard overview</h1>
      <p className="mt-1 text-sm text-slate-400">Real-time snapshot of your rental business.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FiTruck} label="Total vehicles" value={stats.totalVehicles} accent="bg-electric/10 text-electric-400" />
        <StatCard icon={FiUsers} label="Total customers" value={stats.totalCustomers} accent="bg-amber-accent/10 text-amber-accent" />
        <StatCard icon={FiCalendar} label="Active bookings" value={stats.activeBookings} accent="bg-emerald-500/10 text-emerald-400" />
        <StatCard icon={FiDollarSign} label="Total revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} accent="bg-rose-500/10 text-rose-400" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-display text-sm font-semibold text-white">Revenue trend (last 6 months)</h2>
          <div className="mt-4 h-72">
            {revenue && (
              <Line
                data={{
                  labels: revenue.map((r) => r.label),
                  datasets: [{
                    label: "Revenue",
                    data: revenue.map((r) => r.revenue),
                    borderColor: "#3D5AFE",
                    backgroundColor: "rgba(61,90,254,0.15)",
                    fill: true,
                    tension: 0.4,
                  }],
                }}
                options={{
                  responsive: true, maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { ticks: { color: chartTextColor }, grid: { color: gridColor } },
                    y: { ticks: { color: chartTextColor }, grid: { color: gridColor } },
                  },
                }}
              />
            )}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-display text-sm font-semibold text-white">Vehicle categories</h2>
          <div className="mt-4 h-72">
            {categoryStats && (
              <Doughnut
                data={{
                  labels: categoryStats.map((c) => c.category),
                  datasets: [{
                    data: categoryStats.map((c) => c.count),
                    backgroundColor: ["#3D5AFE", "#5B76FF", "#FFB020", "#10B981", "#F43F5E", "#A78BFA", "#22D3EE", "#FB923C", "#94A3B8"],
                    borderWidth: 0,
                  }],
                }}
                options={{
                  responsive: true, maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom", labels: { color: chartTextColor, boxWidth: 10, font: { size: 10 } } } },
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-display text-sm font-semibold text-white">Bookings by status</h2>
          <div className="mt-4 h-64">
            {bookingChart && (
              <Bar
                data={{
                  labels: bookingChart.map((b) => b.status),
                  datasets: [{ data: bookingChart.map((b) => b.count), backgroundColor: "#3D5AFE", borderRadius: 6 }],
                }}
                options={{
                  responsive: true, maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { ticks: { color: chartTextColor }, grid: { display: false } },
                    y: { ticks: { color: chartTextColor }, grid: { color: gridColor } },
                  },
                }}
              />
            )}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-display text-sm font-semibold text-white">Recent activity</h2>
          <div className="mt-4 space-y-3">
            {stats.recentBookings?.map((b) => (
              <div key={b._id} className="flex items-center justify-between border-b border-white/5 pb-3 text-sm last:border-0">
                <div>
                  <p className="font-medium text-slate-200">{b.customer?.name}</p>
                  <p className="text-xs text-slate-500">{b.vehicle?.name}</p>
                </div>
                <span className="text-xs capitalize text-electric-400">{b.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
