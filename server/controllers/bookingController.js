import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
import Coupon from "../models/Coupon.js";
import RentalAgreement from "../models/RentalAgreement.js";
import Notification from "../models/Notification.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { calculateNumberOfDays, calculateBookingPrice, calculateLateFee } from "../utils/calculatePrice.js";

export const checkAvailability = asyncHandler(async (req, res) => {
  const { vehicleId, pickupDate, returnDate } = req.query;

  const overlapping = await Booking.findOne({
    vehicle: vehicleId,
    status: { $in: ["pending", "confirmed", "ongoing"] },
    $or: [
      { pickupDate: { $lte: new Date(returnDate) }, returnDate: { $gte: new Date(pickupDate) } },
    ],
  });

  res.status(200).json({ success: true, available: !overlapping });
});

export const createBooking = asyncHandler(async (req, res) => {
  const { vehicleId, pickupDate, returnDate, pickupLocation, returnLocation, couponCode } = req.body;

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    return res.status(404).json({ success: false, message: "Vehicle not found" });
  }
  if (!vehicle.isAvailable) {
    return res.status(400).json({ success: false, message: "Vehicle is not available for booking" });
  }

  const overlapping = await Booking.findOne({
    vehicle: vehicleId,
    status: { $in: ["pending", "confirmed", "ongoing"] },
    $or: [{ pickupDate: { $lte: new Date(returnDate) }, returnDate: { $gte: new Date(pickupDate) } }],
  });
  if (overlapping) {
    return res.status(400).json({ success: false, message: "Vehicle is already booked for the selected dates" });
  }

  const numberOfDays = calculateNumberOfDays(pickupDate, returnDate);

  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true, expiryDate: { $gte: new Date() } });
    if (!coupon) {
      return res.status(400).json({ success: false, message: "Invalid or expired coupon code" });
    }
    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
    }
  }

  const { basePrice, discountAmount, taxAmount, totalPrice } = calculateBookingPrice({
    pricePerDay: vehicle.pricePerDay,
    numberOfDays,
    discountPercent: vehicle.discountPercent,
    coupon,
  });

  const booking = await Booking.create({
    customer: req.user._id,
    vehicle: vehicleId,
    pickupDate,
    returnDate,
    pickupLocation,
    returnLocation,
    numberOfDays,
    basePrice,
    discountAmount,
    taxAmount,
    totalPrice,
    couponCode: coupon ? coupon.code : "",
  });

  if (coupon) {
    coupon.usedCount += 1;
    await coupon.save();
  }

  await RentalAgreement.create({
    booking: booking._id,
    customer: req.user._id,
    vehicle: vehicleId,
    agreementText: `This Rental Agreement is entered into between RentRide and ${req.user.name} for the rental of ${vehicle.name} (${vehicle.licensePlate}) from ${new Date(pickupDate).toDateString()} to ${new Date(returnDate).toDateString()}. The renter agrees to return the vehicle in the same condition, bear responsibility for traffic violations during the rental period, and pay applicable late fees for delayed returns.`,
  });

  await Notification.create({
    user: req.user._id,
    title: "Booking Created",
    message: `Your booking ${booking.bookingNumber} for ${vehicle.name} has been created and is pending payment.`,
    type: "booking",
    link: `/bookings/${booking._id}`,
  });

  res.status(201).json({ success: true, message: "Booking created successfully", data: booking });
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = { customer: req.user._id };
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [bookings, total] = await Promise.all([
    Booking.find(query).populate("vehicle").sort("-createdAt").skip(skip).limit(Number(limit)),
    Booking.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: bookings,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 10, sort = "-createdAt" } = req.query;
  const query = {};
  if (status) query.status = status;
  if (search) query.bookingNumber = { $regex: search, $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);
  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate("vehicle", "name brand model images")
      .populate("customer", "name email phone")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Booking.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: bookings,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("vehicle").populate("customer", "name email phone");
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }
  if (req.user.role !== "admin" && booking.customer._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized to view this booking" });
  }
  res.status(200).json({ success: true, data: booking });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  booking.status = status;

  if (status === "completed") {
    booking.actualReturnDate = new Date();
    const vehicle = await Vehicle.findById(booking.vehicle);
    if (vehicle) {
      const lateFee = calculateLateFee(booking.returnDate, booking.actualReturnDate, vehicle.pricePerDay);
      booking.lateFee = lateFee;
      booking.totalPrice += lateFee;
      vehicle.totalBookings += 1;
      await vehicle.save();
    }
  }

  await booking.save();

  await Notification.create({
    user: booking.customer,
    title: "Booking Update",
    message: `Your booking ${booking.bookingNumber} status changed to ${status}.`,
    type: "booking",
    link: `/bookings/${booking._id}`,
  });

  res.status(200).json({ success: true, message: "Booking status updated", data: booking });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }
  if (req.user.role !== "admin" && booking.customer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }
  if (["completed", "cancelled"].includes(booking.status)) {
    return res.status(400).json({ success: false, message: `Cannot cancel a ${booking.status} booking` });
  }

  booking.status = "cancelled";
  booking.cancellationReason = reason || "Cancelled by user";
  await booking.save();

  res.status(200).json({ success: true, message: "Booking cancelled successfully", data: booking });
});

export const extendBooking = asyncHandler(async (req, res) => {
  const { newReturnDate } = req.body;
  const booking = await Booking.findById(req.params.id).populate("vehicle");
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }
  if (new Date(newReturnDate) <= new Date(booking.returnDate)) {
    return res.status(400).json({ success: false, message: "New return date must be after current return date" });
  }

  const extraDays = calculateNumberOfDays(booking.returnDate, newReturnDate);
  const extraCost = extraDays * booking.vehicle.pricePerDay;

  booking.returnDate = newReturnDate;
  booking.numberOfDays += extraDays;
  booking.totalPrice += extraCost;
  await booking.save();

  res.status(200).json({ success: true, message: "Booking extended successfully", data: booking });
});
