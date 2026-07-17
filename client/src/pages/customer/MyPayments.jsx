import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FiCreditCard, FiDownload } from "react-icons/fi";
import { paymentService } from "../../services/paymentService.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";

const statusColors = {
  success: "bg-emerald-500/10 text-emerald-400",
  pending: "bg-amber-accent/10 text-amber-accent",
  failed: "bg-red-500/10 text-red-400",
  refunded: "bg-slate-500/10 text-slate-400",
};

const MyPayments = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["my-payments"],
    queryFn: () => paymentService.getMyPayments().then((r) => r.data.data),
  });

  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Payment history</h1>
      {data?.length === 0 ? (
        <div className="mt-6"><EmptyState icon={FiCreditCard} title="No payments yet" description="Your payment history will appear here once you make a booking." /></div>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">Invoice</th>
                <th className="px-5 py-3">Vehicle</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((p) => (
                <tr key={p._id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3 font-medium text-slate-200">{p.invoiceNumber}</td>
                  <td className="px-5 py-3 text-slate-400">{p.booking?.vehicle?.name || "—"}</td>
                  <td className="px-5 py-3 text-white">₹{p.amount.toFixed(2)}</td>
                  <td className="px-5 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusColors[p.status]}`}>{p.status}</span></td>
                  <td className="px-5 py-3 text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3"><button className="flex items-center gap-1 text-xs font-semibold text-electric-400 hover:underline"><FiDownload size={12} /> Invoice</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyPayments;
