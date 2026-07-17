import express from "express";
import {
  getDashboardStats, getRevenueChart, getBookingChart, getVehicleCategoryStats, getTopVehicles,
} from "../controllers/dashboardController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/stats", getDashboardStats);
router.get("/revenue-chart", getRevenueChart);
router.get("/booking-chart", getBookingChart);
router.get("/category-stats", getVehicleCategoryStats);
router.get("/top-vehicles", getTopVehicles);

export default router;
