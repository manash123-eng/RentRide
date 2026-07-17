import Vehicle from "../models/Vehicle.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUpload.js";

export const getVehicles = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    transmission,
    fuelType,
    seats,
    location,
    sort = "-createdAt",
    page = 1,
    limit = 12,
    availableOnly,
  } = req.query;

  const query = {};
  if (search) query.$text = { $search: search };
  if (category) query.category = category;
  if (transmission) query.transmission = transmission;
  if (fuelType) query.fuelType = fuelType;
  if (seats) query.seats = { $gte: Number(seats) };
  if (location) query.location = { $regex: location, $options: "i" };
  if (minPrice || maxPrice) {
    query.pricePerDay = {};
    if (minPrice) query.pricePerDay.$gte = Number(minPrice);
    if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
  }
  if (availableOnly === "true") query.isAvailable = true;

  const skip = (Number(page) - 1) * Number(limit);

  const [vehicles, total] = await Promise.all([
    Vehicle.find(query).sort(sort).skip(skip).limit(Number(limit)),
    Vehicle.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: vehicles,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit: Number(limit),
    },
  });
});

export const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    return res.status(404).json({ success: false, message: "Vehicle not found" });
  }
  res.status(200).json({ success: true, data: vehicle });
});

export const createVehicle = asyncHandler(async (req, res) => {
  const images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, "rentride/vehicles");
      images.push({ url: result.secure_url, publicId: result.public_id });
    }
  }

  const vehicle = await Vehicle.create({
    ...req.body,
    features: req.body.features ? JSON.parse(req.body.features) : [],
    images,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, message: "Vehicle added successfully", data: vehicle });
});

export const updateVehicle = asyncHandler(async (req, res) => {
  let vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    return res.status(404).json({ success: false, message: "Vehicle not found" });
  }

  const newImages = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, "rentride/vehicles");
      newImages.push({ url: result.secure_url, publicId: result.public_id });
    }
  }

  const updateData = { ...req.body };
  if (req.body.features) updateData.features = JSON.parse(req.body.features);
  if (newImages.length > 0) {
    updateData.images = [...vehicle.images, ...newImages];
  }

  vehicle = await Vehicle.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, message: "Vehicle updated successfully", data: vehicle });
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    return res.status(404).json({ success: false, message: "Vehicle not found" });
  }

  for (const image of vehicle.images) {
    await deleteFromCloudinary(image.publicId);
  }

  await vehicle.deleteOne();
  res.status(200).json({ success: true, message: "Vehicle deleted successfully" });
});

export const removeVehicleImage = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    return res.status(404).json({ success: false, message: "Vehicle not found" });
  }
  const { publicId } = req.body;
  await deleteFromCloudinary(publicId);
  vehicle.images = vehicle.images.filter((img) => img.publicId !== publicId);
  await vehicle.save();
  res.status(200).json({ success: true, message: "Image removed", data: vehicle });
});

export const getFeaturedVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({ isFeatured: true, isAvailable: true }).limit(8);
  res.status(200).json({ success: true, data: vehicles });
});

export const getVehicleCategories = asyncHandler(async (req, res) => {
  const categories = await Vehicle.distinct("category");
  res.status(200).json({ success: true, data: categories });
});
