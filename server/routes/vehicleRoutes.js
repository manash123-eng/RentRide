import express from "express";
import {
  getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle,
  removeVehicleImage, getFeaturedVehicles, getVehicleCategories,
} from "../controllers/vehicleController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getVehicles);
router.get("/featured", getFeaturedVehicles);
router.get("/categories", getVehicleCategories);
router.get("/:id", getVehicleById);

router.post("/", protect, authorize("admin"), upload.array("images", 6), createVehicle);
router.put("/:id", protect, authorize("admin"), upload.array("images", 6), updateVehicle);
router.delete("/:id", protect, authorize("admin"), deleteVehicle);
router.post("/:id/remove-image", protect, authorize("admin"), removeVehicleImage);

export default router;
