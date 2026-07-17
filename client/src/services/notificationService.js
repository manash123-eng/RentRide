import api from "./api.js";

export const notificationService = {
  getMine: () => api.get("/notifications"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
  remove: (id) => api.delete(`/notifications/${id}`),
};
