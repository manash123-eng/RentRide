import express from "express";
import {
  getAllUsers, getUserById, updateUserStatus, deleteUser, toggleWishlist, getWishlist,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/wishlist", protect, getWishlist);
router.post("/wishlist", protect, toggleWishlist);

router.get("/", protect, authorize("admin"), getAllUsers);
router.get("/:id", protect, authorize("admin"), getUserById);
router.put("/:id/status", protect, authorize("admin"), updateUserStatus);
router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;
