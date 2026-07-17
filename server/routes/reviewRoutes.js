import express from "express";
import { createReview, getVehicleReviews, deleteReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/vehicle/:vehicleId", getVehicleReviews);
router.delete("/:id", protect, deleteReview);

export default router;
