import api from "./api.js";

export const userService = {
  getAll: (params) => api.get("/users", { params }),
  getById: (id) => api.get(`/users/${id}`),
  updateStatus: (id, isActive) => api.put(`/users/${id}/status`, { isActive }),
  remove: (id) => api.delete(`/users/${id}`),
  getWishlist: () => api.get("/users/wishlist"),
  toggleWishlist: (vehicleId) => api.post("/users/wishlist", { vehicleId }),
};
