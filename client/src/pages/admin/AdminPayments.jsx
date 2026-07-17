import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { paymentService } from "../../services/paymentService.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";

const statusColors = {
  success: "bg-emerald-500/10 text-emerald-400",
  pending: "bg-amber-accent/10 text-amber-accent",
  failed: "bg-red-500/10 text-red-400",
  refunded: "bg-slate-500/10 text-slate-400",
};

const AdminPayments = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-payments", statusFilter],
    queryFn: () => paymentService.getAll({ status: statusFilter, limit: 50 }).then((r) => r.data),
  });

  const handleRefund = async (id) => {
    if (!confirm("Process refund for this payment?")) return;
    try {
      await paymentService.processRefund(id);
      toast.success("Refund processed successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not process refund");
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Payment management</h1>
          <p className="mt-1 text-sm text-slate-400">{data?.pagination?.total ?? 0} total transactions</p>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-48">
          <option value="">All statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {isLoading ? <LoadingSpinner size="lg" /> : data?.data?.length === 0 ? (
        <div className="mt-6"><EmptyState title="No payments found" /></div>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">Transaction ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Booking</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Refund</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((p) => (
                <tr key={p._id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3 font-medium text-slate-200">{p.transactionId}</td>
                  <td className="px-5 py-3 text-slate-400">{p.customer?.name}</td>
                  <td className="px-5 py-3 text-slate-400">#{p.booking?.bookingNumber}</td>
                  <td className="px-5 py-3 text-white">₹{p.amount.toFixed(2)}</td>
                  <td className="px-5 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusColors[p.status]}`}>{p.status}</span></td>
                  <td className="px-5 py-3 text-slate-400 capitalize">{p.refundStatus}</td>
                  <td className="px-5 py-3">
                    {p.status === "success" && p.refundStatus !== "processed" && (
                      <button onClick={() => handleRefund(p._id)} className="text-xs font-semibold text-electric-400 hover:underline">Process refund</button>
                    )}
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

export default AdminPayments;
