import api from "./api.js";

export const couponService = {
  validate: (code) => api.post("/coupons/validate", { code }),
  getAll: () => api.get("/coupons"),
  create: (data) => api.post("/coupons", data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  remove: (id) => api.delete(`/coupons/${id}`),
};
