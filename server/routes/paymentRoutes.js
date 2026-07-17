import express from "express";
import {
  processPayment,
  getMyPayments,
  getAllPayments,
  requestRefund,
  processRefund,
  getInvoice,
} from "../controllers/paymentController.js";
import { protect, authorize } from "../middleware/auth.js";
import Booking from "../models/Booking.js";
import { sendBookingReceiptToWhatsApp } from "../utils/whatsapp/sendBookingReceiptToWhatsApp.js";

const router = express.Router();

// Existing payment routes (keep unchanged)
router.post("/process", protect, processPayment);
router.get("/my-payments", protect, getMyPayments);
router.get("/", protect, authorize("admin"), getAllPayments);
router.get("/:id/invoice", protect, getInvoice);
router.put("/:id/refund-request", protect, requestRefund);
router.put("/:id/refund-process", protect, authorize("admin"), processRefund);

// Send WhatsApp receipt for a confirmed booking (best-effort)
router.post("/bookings/:bookingId/send-whatsapp-receipt", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (req.user.role !== "admin" && booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await sendBookingReceiptToWhatsApp({
      bookingId: req.params.bookingId,
      customerPhone: req.body?.to,
    });

    res.status(200).json({ success: true, message: "WhatsApp receipt sent" });
  } catch (err) {
    res.status(400).json({ success: false, message: err?.message || "Failed to send WhatsApp receipt" });
  }
});

export default router;


