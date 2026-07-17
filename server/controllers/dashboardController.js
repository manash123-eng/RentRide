import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalVehicles, totalCustomers, totalBookings, activeBookings, revenueAgg, recentBookings] = await Promise.all([
    Vehicle.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Booking.countDocuments(),
    Booking.countDocuments({ status: { $in: ["confirmed", "ongoing"] } }),
    Payment.aggregate([{ $match: { status: "success" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    Booking.find().populate("vehicle", "name images").populate("customer", "name email").sort("-createdAt").limit(5),
  ]);

  const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

  res.status(200).json({
    success: true,
    data: {
      totalVehicles,
      totalCustomers,
      totalBookings,
      activeBookings,
      totalRevenue,
      recentBookings,
    },
  });
});

export const getRevenueChart = asyncHandler(async (req, res) => {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() + 1, label: d.toLocaleString("default", { month: "short" }) });
  }

  const data = await Promise.all(
    months.map(async (m) => {
      const start = new Date(m.year, m.month - 1, 1);
      const end = new Date(m.year, m.month, 0, 23, 59, 59);
      const agg = await Payment.aggregate([
        { $match: { status: "success", createdAt: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      return { label: m.label, revenue: agg.length > 0 ? agg[0].total : 0 };
    })
  );

  res.status(200).json({ success: true, data });
});

export const getBookingChart = asyncHandler(async (req, res) => {
  const statuses = ["pending", "confirmed", "ongoing", "completed", "cancelled"];
  const data = await Promise.all(
    statuses.map(async (status) => ({
      status,
      count: await Booking.countDocuments({ status }),
    }))
  );
  res.status(200).json({ success: true, data });
});

export const getVehicleCategoryStats = asyncHandler(async (req, res) => {
  const data = await Vehicle.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $project: { category: "$_id", count: 1, _id: 0 } },
  ]);
  res.status(200).json({ success: true, data });
});

export const getTopVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find().sort("-totalBookings").limit(5);
  res.status(200).json({ success: true, data: vehicles });
});
