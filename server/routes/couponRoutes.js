import express from "express";
import {
  getAllCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon,
} from "../controllers/couponController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/validate", protect, validateCoupon);
router.get("/", protect, authorize("admin"), getAllCoupons);
router.post("/", protect, authorize("admin"), createCoupon);
router.put("/:id", protect, authorize("admin"), updateCoupon);
router.delete("/:id", protect, authorize("admin"), deleteCoupon);

export default router;
