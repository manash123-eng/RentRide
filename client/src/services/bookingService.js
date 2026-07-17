import api from "./api.js";

export const bookingService = {
  checkAvailability: (params) => api.get("/bookings/availability", { params }),
  create: (data) => api.post("/bookings", data),
  getMyBookings: (params) => api.get("/bookings/my-bookings", { params }),
  getAll: (params) => api.get("/bookings", { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  cancel: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason }),
  extend: (id, newReturnDate) => api.put(`/bookings/${id}/extend`, { newReturnDate }),
};
