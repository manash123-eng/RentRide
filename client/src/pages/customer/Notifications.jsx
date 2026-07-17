import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiBell, FiCheck } from "react-icons/fi";
import { notificationService } from "../../services/notificationService.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";

const Notifications = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.getMine().then((r) => r.data),
  });

  const markAllRead = async () => {
    await notificationService.markAllAsRead();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Notifications</h1>
        {data?.unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1 text-sm font-medium text-electric-400 hover:underline">
            <FiCheck size={14} /> Mark all as read
          </button>
        )}
      </div>

      {data?.data?.length === 0 ? (
        <div className="mt-6"><EmptyState icon={FiBell} title="No notifications" description="You're all caught up!" /></div>
      ) : (
        <div className="mt-6 space-y-3">
          {data?.data?.map((n) => (
            <div key={n._id} className={`card p-4 ${!n.isRead ? "border-electric/30 bg-electric/5" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{n.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{n.message}</p>
                </div>
                {!n.isRead && <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-electric" />}
              </div>
              <p className="mt-2 text-xs text-slate-600">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
