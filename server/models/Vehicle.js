import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    category: {
      type: String,
      enum: ["Sedan", "SUV", "Hatchback", "Luxury", "Convertible", "Van", "Truck", "Electric", "Bike"],
      required: true,
    },
    transmission: { type: String, enum: ["Automatic", "Manual"], default: "Automatic" },
    fuelType: { type: String, enum: ["Petrol", "Diesel", "Electric", "Hybrid"], default: "Petrol" },
    seats: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    location: { type: String, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    images: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
    licensePlate: { type: String, required: true, unique: true },
    mileage: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    ratingsAverage: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "maintenance", "inactive"], default: "active" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

vehicleSchema.index({ name: "text", brand: "text", model: "text", category: "text" });

export default mongoose.model("Vehicle", vehicleSchema);
