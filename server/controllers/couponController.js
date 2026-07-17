import Coupon from "../models/Coupon.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort("-createdAt");
  res.status(200).json({ success: true, data: coupons });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, message: "Coupon created successfully", data: coupon });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) {
    return res.status(404).json({ success: false, message: "Coupon not found" });
  }
  res.status(200).json({ success: true, message: "Coupon updated successfully", data: coupon });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) {
    return res.status(404).json({ success: false, message: "Coupon not found" });
  }
  res.status(200).json({ success: true, message: "Coupon deleted successfully" });
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true, expiryDate: { $gte: new Date() } });
  if (!coupon) {
    return res.status(400).json({ success: false, message: "Invalid or expired coupon" });
  }
  if (coupon.usedCount >= coupon.usageLimit) {
    return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
  }
  res.status(200).json({ success: true, message: "Coupon is valid", data: coupon });
});
