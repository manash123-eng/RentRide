import Review from "../models/Review.js";
import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const recalculateVehicleRating = async (vehicleId) => {
  const reviews = await Review.find({ vehicle: vehicleId });
  const ratingsCount = reviews.length;
  const ratingsAverage = ratingsCount > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / ratingsCount : 0;
  await Vehicle.findByIdAndUpdate(vehicleId, {
    ratingsAverage: Math.round(ratingsAverage * 10) / 10,
    ratingsCount,
  });
};

export const createReview = asyncHandler(async (req, res) => {
  const { vehicleId, bookingId, rating, comment } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking || booking.customer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "You can only review vehicles you have rented" });
  }
  if (booking.status !== "completed") {
    return res.status(400).json({ success: false, message: "You can only review completed bookings" });
  }

  const review = await Review.create({
    customer: req.user._id,
    vehicle: vehicleId,
    booking: bookingId,
    rating,
    comment,
  });

  await recalculateVehicleRating(vehicleId);

  res.status(201).json({ success: true, message: "Review submitted successfully", data: review });
});

export const getVehicleReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ vehicle: req.params.vehicleId })
    .populate("customer", "name avatar")
    .sort("-createdAt");
  res.status(200).json({ success: true, data: reviews });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: "Review not found" });
  }
  if (req.user.role !== "admin" && review.customer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }
  const vehicleId = review.vehicle;
  await review.deleteOne();
  await recalculateVehicleRating(vehicleId);
  res.status(200).json({ success: true, message: "Review deleted" });
});
