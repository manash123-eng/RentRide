import React, { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiTag, FiCreditCard, FiCheckCircle } from "react-icons/fi";
import Button from "../../components/Button.jsx";
import { bookingService } from "../../services/bookingService.js";
import { couponService } from "../../services/couponService.js";
import { paymentService } from "../../services/paymentService.js";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: review, 2: payment, 3: success
  const [couponCode, setCouponCode] = useState("");
  const [couponInfo, setCouponInfo] = useState(null);
  const [applying, setApplying] = useState(false);
  const [booking, setBooking] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paying, setPaying] = useState(false);
  const [creatingBooking, setCreatingBooking] = useState(false);

  if (!state?.vehicle) return <Navigate to="/vehicles" replace />;

  const { vehicle, pickupDate, returnDate, pickupLocation, returnLocation } = state;
  const days = Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)));
  const basePrice = days * vehicle.pricePerDay;

  const applyCoupon = async () => {
    if (!couponCode) return;
    setApplying(true);
    try {
      const res = await couponService.validate(couponCode);
      setCouponInfo(res.data.data);
      toast.success("Coupon applied successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon");
      setCouponInfo(null);
    } finally {
      setApplying(false);
    }
  };

  let discount = 0;
  if (couponInfo) {
    discount = couponInfo.discountType === "percentage"
      ? Math.min((basePrice * couponInfo.discountValue) / 100, couponInfo.maxDiscountAmount || Infinity)
      : couponInfo.discountValue;
  }
  const taxAmount = Math.round((basePrice - discount) * 0.18 * 100) / 100;
  const totalPrice = Math.round((basePrice - discount + taxAmount) * 100) / 100;

  const handleCreateBooking = async () => {
    setCreatingBooking(true);
    try {
      const res = await bookingService.create({
        vehicleId: vehicle._id,
        pickupDate,
        returnDate,
        pickupLocation,
        returnLocation,
        couponCode: couponInfo?.code,
      });
      setBooking(res.data.data);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create booking");
    } finally {
      setCreatingBooking(false);
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setPaying(true);
    try {
      await paymentService.process({ bookingId: booking._id, cardNumber, method: "card" });
      setStep(3);
      toast.success("Payment successful!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed. Try a different card.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-center gap-4">
        {["Review", "Payment", "Confirmation"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step >= i + 1 ? "bg-electric text-white" : "bg-white/10 text-slate-500"}`}>{i + 1}</span>
            <span className={`text-sm ${step >= i + 1 ? "text-white" : "text-slate-500"}`}>{label}</span>
            {i < 2 && <span className="h-px w-8 bg-white/10" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="card p-6 sm:p-8">
          <h1 className="font-display text-xl font-bold text-white">Review your booking</h1>
          <div className="mt-5 flex gap-4 border-b border-white/5 pb-5">
            <img src={vehicle.images?.[0]?.url || "https://placehold.co/200x150"} alt={vehicle.name} className="h-20 w-28 rounded-lg object-cover" />
            <div>
              <p className="font-display font-semibold text-white">{vehicle.name}</p>
              <p className="text-sm text-slate-400">{vehicle.category} · {vehicle.transmission}</p>
              <p className="mt-1 text-xs text-slate-500">{pickupLocation}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-slate-500">Pickup date</p><p className="text-white">{new Date(pickupDate).toDateString()}</p></div>
            <div><p className="text-slate-500">Return date</p><p className="text-white">{new Date(returnDate).toDateString()}</p></div>
          </div>

          <div className="mt-5">
            <label className="label-text">Coupon code</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <FiTag className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="WELCOME10" className="input-field pl-11" />
              </div>
              <Button type="button" variant="secondary" isLoading={applying} onClick={applyCoupon}>Apply</Button>
            </div>
          </div>

          <div className="mt-6 space-y-2 rounded-xl bg-white/5 p-4 text-sm">
            <div className="flex justify-between text-slate-400"><span>{days} day(s) × ₹{vehicle.pricePerDay}</span><span>₹{basePrice.toFixed(2)}</span></div>
            {discount > 0 && <div className="flex justify-between text-emerald-400"><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>}
            <div className="flex justify-between text-slate-400"><span>Taxes (18%)</span><span>₹{taxAmount.toFixed(2)}</span></div>
            <div className="flex justify-between border-t border-white/10 pt-2 font-semibold text-white"><span>Total</span><span>₹{totalPrice.toFixed(2)}</span></div>
          </div>

          <Button onClick={handleCreateBooking} isLoading={creatingBooking} className="mt-6 w-full">Continue to payment</Button>
        </div>
      )}

      {step === 2 && booking && (
        <form onSubmit={handlePay} className="card p-6 sm:p-8">
          <h1 className="font-display text-xl font-bold text-white">Payment details</h1>
          <p className="mt-1 text-sm text-slate-400">Booking #{booking.bookingNumber} · Total due: ₹{booking.totalPrice.toFixed(2)}</p>

          <div className="mt-5 rounded-lg border border-amber-accent/30 bg-amber-accent/5 p-3 text-xs text-slate-400">
            This is a simulated payment gateway. Use any card number except one starting with "0000" to simulate success.
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="label-text">Card number</label>
              <div className="relative">
                <FiCreditCard className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input required value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" maxLength={19} className="input-field pl-11" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text">Expiry</label>
                <input required value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" className="input-field" />
              </div>
              <div>
                <label className="label-text">CVV</label>
                <input required value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" maxLength={3} className="input-field" />
              </div>
            </div>
          </div>

          <Button type="submit" isLoading={paying} className="mt-6 w-full">Pay ₹{booking.totalPrice.toFixed(2)}</Button>
        </form>
      )}

      {step === 3 && (
        <div className="card flex flex-col items-center p-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <FiCheckCircle size={32} />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold text-white">Booking confirmed!</h1>
          <p className="mt-2 max-w-sm text-sm text-slate-400">
            Your booking #{booking?.bookingNumber} for {vehicle.name} has been confirmed. A receipt has been sent to your account.
          </p>

          <div className="mt-6">
            <Button
              onClick={async () => {
                try {
                  await paymentService.sendWhatsAppReceipt(booking?._id);
                  toast.success("WhatsApp receipt sent!");
                } catch (err) {
                  toast.error(err.response?.data?.message || "Failed to send WhatsApp receipt");
                }
              }}
              className="w-full"
              variant="secondary"
            >
              Send to WhatsApp
            </Button>
          </div>

          <div className="mt-7 flex gap-3">
            <Button onClick={() => navigate("/dashboard/bookings")}>View my bookings</Button>
            <Button variant="secondary" onClick={() => navigate("/vehicles")}>Browse more vehicles</Button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;
