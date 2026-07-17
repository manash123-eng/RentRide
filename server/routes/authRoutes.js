import express from "express";
import { body } from "express-validator";
import {
  register, login, getMe, forgotPassword, resetPassword, updateProfile, changePassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validate,
  register
);

router.post(
  "/login",
  [body("email").isEmail().withMessage("Valid email is required"), body("password").notEmpty().withMessage("Password is required")],
  validate,
  login
);

router.post("/forgot-password", [body("email").isEmail()], validate, forgotPassword);
router.post("/reset-password", [body("token").notEmpty(), body("password").isLength({ min: 6 })], validate, resetPassword);

router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, [body("newPassword").isLength({ min: 6 })], validate, changePassword);

export default router;
