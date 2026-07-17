import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    // General payment classification
    method: {
      type: String,
      enum: ["razorpay", "card", "upi", "netbanking", "wallet"],
      default: "razorpay",
    },

    // Razorpay identifiers
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String, index: true, unique: true, sparse: true },
    razorpaySignature: { type: String },

    // Generic transaction id (kept for compatibility)
    transactionId: { type: String, unique: true, sparse: true },


    paymentMethodDetails: { type: String, default: "" },

    // Payment state
    status: { type: String, enum: ["pending", "success", "failed", "rejected", "refunded"], default: "pending" },

    // Optional card metadata
    cardLast4: { type: String, default: "" },

    // Optional admin workflow
    adminDecisionStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },

    // Optional receipt/invoice/QR storage
    invoiceNumber: { type: String },
    invoicePdfUrl: { type: String, default: "" },
    receiptPdfUrl: { type: String, default: "" },
    qrCodeUrl: { type: String, default: "" },

    // Refund metadata
    refundAmount: { type: Number, default: 0 },
    refundStatus: { type: String, enum: ["none", "requested", "processed"], default: "none" },
    upiPayload: { type: Object, default: {} },
  },
  { timestamps: true }
);

paymentSchema.pre("validate", function (next) {
  if (!this.transactionId) {
    this.transactionId = "TXN" + Date.now() + Math.floor(Math.random() * 1000);
  }
  if (!this.invoiceNumber) {
    this.invoiceNumber = "INV-" + Date.now().toString().slice(-8);
  }
  next();
});

export default mongoose.model("Payment", paymentSchema);
