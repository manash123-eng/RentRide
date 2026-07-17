import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import crypto from "crypto";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, message: "An account with this email already exists" });
  }

  const user = await User.create({ name, email, password, phone, role: "customer" });

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user._id),
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }
  if (!user.isActive) {
    return res.status(403).json({ success: false, message: "Your account has been deactivated" });
  }

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      token: generateToken(user._id),
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, data: user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ success: true, message: "If that email exists, a reset link has been sent" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  // In production this would be emailed via nodemailer. Returned here for demo purposes.
  res.status(200).json({
    success: true,
    message: "Password reset token generated",
    resetToken,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpire");

  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ success: true, message: "Password reset successfully" });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address, licenseNumber } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, address, licenseNumber },
    { new: true, runValidators: true }
  );
  res.status(200).json({ success: true, message: "Profile updated successfully", data: user });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.matchPassword(currentPassword))) {
    return res.status(401).json({ success: false, message: "Current password is incorrect" });
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({ success: true, message: "Password changed successfully" });
});
