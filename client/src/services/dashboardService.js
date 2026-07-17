import api from "./api.js";

export const dashboardService = {
  getStats: () => api.get("/dashboard/stats"),
  getRevenueChart: () => api.get("/dashboard/revenue-chart"),
  getBookingChart: () => api.get("/dashboard/booking-chart"),
  getCategoryStats: () => api.get("/dashboard/category-stats"),
  getTopVehicles: () => api.get("/dashboard/top-vehicles"),
};
