import Booking from "../../models/Booking.js";
import { generateBookingReceiptPdf } from "../receipts/generateBookingReceiptPdf.js";

const base64EncodeBuffer = (buf) => Buffer.from(buf).toString("base64");

const requireEnv = (names) => {
  const missing = names.filter((n) => !process.env[n]);
  if (missing.length) {
    throw new Error(`WhatsApp not configured. Missing env vars: ${missing.join(", ")}`);
  }
};

const normalizeToWhatsAppFromTo = (raw, { defaultCountryCode = "+91" } = {}) => {
  if (raw === null || raw === undefined) return null;
  let s = String(raw).trim();
  if (!s) return null;

  // Remove common formatting chars.
  s = s.replace(/[\s\-()]/g, "");

  // If caller already supplied whatsapp:, keep it but still normalize digits.
  const isWhatsAppPrefixed = /^whatsapp:/i.test(s);
  if (isWhatsAppPrefixed) {
    s = s.replace(/^whatsapp:/i, "");
  }

  // If looks like an E.164 number already.
  if (/^\+\d{6,15}$/.test(s)) {
    const normalized = `whatsapp:${s}`;
    return normalized;
  }

  // If user provided digits only (assume local to default country code)
  if (/^\d{6,15}$/.test(s)) {
    const cc = defaultCountryCode.startsWith("+") ? defaultCountryCode : `+${defaultCountryCode}`;
    return `whatsapp:${cc}${s}`;
  }

  // If starts with 00 (international prefix) convert to +
  if (/^00\d{6,15}$/.test(s)) {
    return `whatsapp:+${s.slice(2)}`;
  }

  return null;
};

const isValidTwilioWhatsAppChannel = (whatsappValue) => {
  // Twilio WhatsApp expects whatsapp:+<digits>
  if (!whatsappValue || typeof whatsappValue !== "string") return false;
  return /^whatsapp:\+\d{6,15}$/.test(whatsappValue.trim());
};

const sendWhatsAppText = async ({ to, message }) => {
  // Fallback: use whichever provider is configured.
  // Meta (Cloud API)
  if (process.env.WHATSAPP_CLOUD_API_URL && process.env.WHATSAPP_CLOUD_TOKEN) {
    const url = process.env.WHATSAPP_CLOUD_API_URL;
    const token = process.env.WHATSAPP_CLOUD_TOKEN;

    requireEnv(["WHATSAPP_PHONE_NUMBER_ID"]);
    // Cloud API expects E.164 number for `to` (no whatsapp: prefix)
    const toE164 = (() => {
      const normalized = normalizeToWhatsAppFromTo(to);
      if (!normalized) return null;
      return normalized.replace(/^whatsapp:/i, "");
    })();

    if (!toE164) {
      throw new Error("Invalid WhatsApp recipient number.");
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: toE164,
        type: "text",
        text: { body: message },
      }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`WhatsApp Cloud text send failed: ${res.status} ${t}`);
    }
    return;
  }

  // Twilio WhatsApp
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_WHATSAPP) {
    requireEnv(["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_WHATSAPP"]);

    const url = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;

    // Twilio expects both From and To using same channel: whatsapp:+<E164>
    const from = normalizeToWhatsAppFromTo(process.env.TWILIO_FROM_WHATSAPP, {});
    const recipient = normalizeToWhatsAppFromTo(to, {});

    if (!isValidTwilioWhatsAppChannel(from)) {
      throw new Error("Invalid TWILIO_WHATSAPP_FROM format. Expected whatsapp:+<countrycode><number>.");
    }
    if (!isValidTwilioWhatsAppChannel(recipient)) {
      throw new Error("Invalid WhatsApp recipient number. Expected digits or E.164 (or whatsapp:+... ).");
    }

    const form = new URLSearchParams({
      To: recipient,
      From: from,
      Body: message,
    });

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Twilio WhatsApp text send failed: ${res.status} ${t}`);
    }
    return;
  }

  throw new Error("WhatsApp not configured (no provider env vars found)." );
};


export const sendBookingReceiptToWhatsApp = async ({ bookingId, to, customerPhone }) => {
  const booking = await Booking.findById(bookingId)
    .populate("customer", "name email phone")
    .populate("vehicle");

  if (!booking) {
    throw new Error("Booking not found for WhatsApp receipt");
  }

  const customer = booking.customer;
  const vehicle = booking.vehicle;

  const recipient = to || customerPhone || customer?.phone;
  if (!recipient) {
    throw new Error("Customer WhatsApp number not available.");
  }

  // Message content (used both for PDF failure fallback and as final fallback)
  const message = [
    `RentRide Receipt`,
    `Booking ID: ${booking.bookingNumber}`,
    `Customer: ${customer?.name || ""}`,
    `Vehicle: ${vehicle?.name || ""} (${vehicle?.licensePlate || ""})`,
    `Pickup: ${new Date(booking.pickupDate).toLocaleDateString()} ${new Date(booking.pickupDate).toLocaleTimeString()}`,
    `Return: ${new Date(booking.returnDate).toLocaleDateString()} ${new Date(booking.returnDate).toLocaleTimeString()}`,
    `Amount: ₹${Number(booking.totalPrice || 0).toFixed(2)}`,
    `Payment Status: ${booking.paymentStatus}`,
    `Booking Time: ${new Date(booking.createdAt).toLocaleString()}`,
  ].join("\n");

  const wantsPdf = true;

  if (!wantsPdf) {
    await sendWhatsAppText({ to: recipient, message });
    return;
  }

  // Try PDF sending for Meta Cloud API; otherwise fallback to text.
  // Meta Cloud API supports documents via media URL.
  // Without a hosted URL, we fallback to text (unless caller provides hosting integration).
  try {
    if (process.env.WHATSAPP_CLOUD_API_URL && process.env.WHATSAPP_CLOUD_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
      // We don't have a public media hosting pipeline in this repo.
      // Therefore, we send a text receipt as a reliable fallback.
      await sendWhatsAppText({ to: recipient, message });
      return;
    }

    // Twilio similarly expects a media URL; without it, fallback to text.
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_WHATSAPP) {
      await sendWhatsAppText({ to: recipient, message });
      return;
    }

    // If provider envs exist but the flow requires media URL, we still fallback.
    const pdfBuffer = await generateBookingReceiptPdf({
      booking,
      customer,
      vehicle,
      paymentStatus: booking.paymentStatus,
      paymentMethod: booking.paymentMethodDetails || "",
      bookingTime: booking.createdAt,
    });
    // Not sent as media.
    await sendWhatsAppText({ to: recipient, message });

    // keep pdfBuffer referenced to avoid lint/unused in some setups
    void pdfBuffer;
    return;
  } catch (err) {
    // final fallback: send text anyway
    await sendWhatsAppText({ to: recipient, message });
    return;
  }
};

