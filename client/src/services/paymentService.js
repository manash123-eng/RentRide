import api from "./api.js";

export const paymentService = {
  process: (data) => api.post("/payments/process", data),
  getMyPayments: () => api.get("/payments/my-payments"),
  getAll: (params) => api.get("/payments", { params }),
  getInvoice: (id) => api.get(`/payments/${id}/invoice`),
  requestRefund: (id) => api.put(`/payments/${id}/refund-request`),
  processRefund: (id) => api.put(`/payments/${id}/refund-process`),

  sendWhatsAppReceipt: (bookingId) => api.post(`/payments/bookings/${bookingId}/send-whatsapp-receipt`, {}),
};

