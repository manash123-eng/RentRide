import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { sendBookingReceiptEmail } from "../utils/notifications/sendBookingReceiptEmail.js";


// Dummy Stripe-like payment processor - simulates a payment gateway
export const processPayment = asyncHandler(async (req, res) => {
  const { bookingId, cardNumber, method = "card" } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }
  if (booking.paymentStatus === "paid") {
    return res.status(400).json({ success: false, message: "Booking is already paid for" });
  }

  // Simulate processing delay and basic card validation
  const last4 = cardNumber ? String(cardNumber).slice(-4) : "0000";
  const isSuccess = !cardNumber || !String(cardNumber).startsWith("0000"); // card starting 0000 simulates failure

  const payment = await Payment.create({
    booking: booking._id,
    customer: req.user._id,
    amount: booking.totalPrice,
    method,
    cardLast4: last4,
    status: isSuccess ? "success" : "failed",
  });

  if (isSuccess) {
    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    await booking.save();

    await Notification.create({
      user: req.user._id,
      title: "Payment Successful",
      message: `Payment of ₹${booking.totalPrice} for booking ${booking.bookingNumber} was successful.`,
      type: "payment",
      link: `/bookings/${booking._id}`,
    });

    // Best-effort: generate + email receipt after booking confirmation.
    // Must not break payment flow.
    (async () => {
      try {
        await sendBookingReceiptEmail({ bookingId: booking._id });
      } catch (err) {
        console.error("Receipt email failed:", err?.message || err);
        try {
          await Notification.create({
            user: booking.customer,
            title: "Receipt Email Failed",
            message: `We couldn't send your receipt for booking ${booking.bookingNumber} to your email. You can still download it from your payments.`,
            type: "system",
            link: `/dashboard/payments`,
          });
        } catch (e) {
          // ignore notification failures
        }
      }
    })();

    return res.status(200).json({ success: true, message: "Payment processed successfully", data: payment });
  }


  return res.status(400).json({ success: false, message: "Payment failed. Please check your card details.", data: payment });
});

export const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ customer: req.user._id })
    .populate({ path: "booking", populate: { path: "vehicle", select: "name images" } })
    .sort("-createdAt");
  res.status(200).json({ success: true, data: payments });
});

export const getAllPayments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const query = {};
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [payments, total] = await Promise.all([
    Payment.find(query)
      .populate("customer", "name email")
      .populate({ path: "booking", select: "bookingNumber" })
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit)),
    Payment.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: payments,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

export const requestRefund = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    return res.status(404).json({ success: false, message: "Payment not found" });
  }
  payment.refundStatus = "requested";
  await payment.save();
  res.status(200).json({ success: true, message: "Refund requested successfully", data: payment });
});

export const processRefund = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    return res.status(404).json({ success: false, message: "Payment not found" });
  }
  payment.refundStatus = "processed";
  payment.refundAmount = payment.amount;
  payment.status = "refunded";
  await payment.save();

  const booking = await Booking.findById(payment.booking);
  if (booking) {
    booking.paymentStatus = "refunded";
    await booking.save();
  }

  res.status(200).json({ success: true, message: "Refund processed successfully", data: payment });
});

export const getInvoice = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate("customer", "name email phone address")
    .populate({ path: "booking", populate: { path: "vehicle" } });

  if (!payment) {
    return res.status(404).json({ success: false, message: "Invoice not found" });
  }

  res.status(200).json({ success: true, data: payment });
});
