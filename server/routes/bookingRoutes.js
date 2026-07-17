import express from "express";
import {
  checkAvailability, createBooking, getMyBookings, getAllBookings,
  getBookingById, updateBookingStatus, cancelBooking, extendBooking,
} from "../controllers/bookingController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/availability", checkAvailability);
router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.get("/", protect, authorize("admin"), getAllBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id/status", protect, authorize("admin"), updateBookingStatus);
router.put("/:id/cancel", protect, cancelBooking);
router.put("/:id/extend", protect, extendBooking);

export default router;
