import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import { userService } from "../../services/userService.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";

const AdminCustomers = () => {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-customers", search],
    queryFn: () => userService.getAll({ search, role: "customer", limit: 50 }).then((r) => r.data),
  });

  const toggleStatus = async (id, isActive) => {
    try {
      await userService.updateStatus(id, !isActive);
      toast.success(`Customer ${!isActive ? "activated" : "deactivated"}`);
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
    } catch (err) {
      toast.error("Could not update customer status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this customer account?")) return;
    try {
      await userService.remove(id);
      toast.success("Customer deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
    } catch (err) {
      toast.error("Could not delete customer");
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Customer management</h1>
          <p className="mt-1 text-sm text-slate-400">{data?.pagination?.total ?? 0} registered customers</p>
        </div>
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="input-field pl-11" />
        </div>
      </div>

      {isLoading ? <LoadingSpinner size="lg" /> : data?.data?.length === 0 ? (
        <div className="mt-6"><EmptyState title="No customers found" /></div>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((u) => (
                <tr key={u._id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3 font-medium text-slate-200">{u.name}</td>
                  <td className="px-5 py-3 text-slate-400">{u.email}</td>
                  <td className="px-5 py-3 text-slate-400">{u.phone || "—"}</td>
                  <td className="px-5 py-3 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggleStatus(u._id, u.isActive)} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${u.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-5 py-3"><button onClick={() => handleDelete(u._id)} className="text-red-400 hover:text-red-500"><FiTrash2 size={15} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
