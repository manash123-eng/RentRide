import mongoose from "mongoose";

const rentalAgreementSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    termsAccepted: { type: Boolean, default: false },
    agreementText: { type: String, required: true },
    signedAt: { type: Date },
    vehicleConditionBefore: { type: String, default: "Good" },
    vehicleConditionAfter: { type: String, default: "" },
    odometerStart: { type: Number, default: 0 },
    odometerEnd: { type: Number, default: 0 },
    damageNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("RentalAgreement", rentalAgreementSchema);
