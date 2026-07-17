import api from "./api.js";

export const reviewService = {
  create: (data) => api.post("/reviews", data),
  getByVehicle: (vehicleId) => api.get(`/reviews/vehicle/${vehicleId}`),
  remove: (id) => api.delete(`/reviews/${id}`),
};
