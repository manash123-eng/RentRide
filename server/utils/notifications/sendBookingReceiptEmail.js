import nodemailer from "nodemailer";
import Booking from "../../models/Booking.js";
import { generateBookingReceiptPdf } from "../receipts/generateBookingReceiptPdf.js";

const formatDateTime = (d) => {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return "";
  }
};

export const sendBookingReceiptEmail = async ({ bookingId }) => {
  const booking = await Booking.findById(bookingId)
    .populate("customer", "name email phone")
    .populate("vehicle");

  if (!booking) {
    throw new Error("Booking not found for receipt email");
  }

  const customer = booking.customer;
  const vehicle = booking.vehicle;

  const pdfBuffer = await generateBookingReceiptPdf({
    booking,
    customer,
    vehicle,
    paymentStatus: booking.paymentStatus,
    paymentMethod: booking.paymentMethodDetails || "",
    bookingTime: booking.createdAt,
  });

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    EMAIL_FROM,
    EMAIL_TO_OVERRIDE,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("Email transport not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.");
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const to = EMAIL_TO_OVERRIDE || customer?.email;
  if (!to) {
    throw new Error("Customer email not found. Cannot send receipt.");
  }

  const subject = `RentRide Receipt - ${booking.bookingNumber}`;
  const text = `Hello ${customer?.name || ""},\n\nYour booking is confirmed.\n\nBooking ID: ${booking.bookingNumber}\nPickup: ${formatDateTime(booking.pickupDate)}\nReturn: ${formatDateTime(booking.returnDate)}\nAmount: ₹${Number(booking.totalPrice || 0).toFixed(2)}\nPayment Status: ${booking.paymentStatus}\nBooking Time: ${formatDateTime(booking.createdAt)}\n\nThank you,\nRentRide`;

  await transporter.sendMail({
    from: EMAIL_FROM || SMTP_USER,
    to,
    subject,
    text,
    attachments: [
      {
        filename: `RentRide-Receipt-${booking.bookingNumber}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
};

