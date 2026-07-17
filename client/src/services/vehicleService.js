import api from "./api.js";

export const vehicleService = {
  getAll: (params) => api.get("/vehicles", { params }),
  getById: (id) => api.get(`/vehicles/${id}`),
  getFeatured: () => api.get("/vehicles/featured"),
  getCategories: () => api.get("/vehicles/categories"),
  create: (formData) => api.post("/vehicles", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id, formData) => api.put(`/vehicles/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  remove: (id) => api.delete(`/vehicles/${id}`),
};
