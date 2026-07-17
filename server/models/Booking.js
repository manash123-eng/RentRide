import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: { type: String, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    pickupLocation: { type: String, required: true },
    returnLocation: { type: String, required: true },
    numberOfDays: { type: Number, required: true },
    basePrice: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    couponCode: { type: String, default: "" },
    lateFee: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "payment_verification_pending",
        "confirmed",
        "active",
        "completed",
        "cancelled",
        "rejected",
        "refunded",
      ],
      default: "pending",
    },
    paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded", "partial"], default: "unpaid" },
    cancellationReason: { type: String, default: "" },
    actualReturnDate: { type: Date },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

bookingSchema.pre("validate", function (next) {
  if (!this.bookingNumber) {
    this.bookingNumber = "RR-" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 90 + 10);
  }
  next();
});

export default mongoose.model("Booking", bookingSchema);
