import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const { search, role, page = 1, limit = 10 } = req.query;
  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(query).sort("-createdAt").skip(skip).limit(Number(limit)),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.status(200).json({ success: true, data: user });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.status(200).json({ success: true, message: "User status updated", data: user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  await user.deleteOne();
  res.status(200).json({ success: true, message: "User deleted successfully" });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { vehicleId } = req.body;
  const user = await User.findById(req.user._id);

  const index = user.wishlist.findIndex((id) => id.toString() === vehicleId);
  if (index > -1) {
    user.wishlist.splice(index, 1);
  } else {
    user.wishlist.push(vehicleId);
  }
  await user.save();
  res.status(200).json({ success: true, message: "Wishlist updated", data: user.wishlist });
});

export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.status(200).json({ success: true, data: user.wishlist });
});
