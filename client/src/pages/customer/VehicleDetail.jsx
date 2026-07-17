import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  FiUsers, FiSettings, FiDroplet, FiMapPin, FiStar, FiCheck, FiCalendar, FiHeart,
} from "react-icons/fi";
import { vehicleService } from "../../services/vehicleService.js";
import { reviewService } from "../../services/reviewService.js";
import { bookingService } from "../../services/bookingService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import Button from "../../components/Button.jsx";

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [checking, setChecking] = useState(false);

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => vehicleService.getById(id).then((r) => r.data.data),
  });

  const { data: reviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => reviewService.getByVehicle(id).then((r) => r.data.data),
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (!vehicle) return null;

  const days = pickupDate && returnDate
    ? Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)))
    : 0;
  const estimatedTotal = days * vehicle.pricePerDay;

  const handleProceed = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to book this vehicle");
      navigate("/login");
      return;
    }
    if (!pickupDate || !returnDate || !pickupLocation) {
      toast.error("Please fill in pickup location and dates");
      return;
    }
    setChecking(true);
    try {
      const res = await bookingService.checkAvailability({ vehicleId: id, pickupDate, returnDate });
      if (!res.data.available) {
        toast.error("Vehicle is not available for the selected dates");
        return;
      }
      navigate("/checkout", { state: { vehicle, pickupDate, returnDate, pickupLocation, returnLocation: pickupLocation } });
    } catch (err) {
      toast.error("Could not check availability. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  const images = vehicle.images?.length ? vehicle.images : [{ url: "https://placehold.co/900x600/172033/3D5AFE?text=RentRide" }];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <img src={images[activeImage].url} alt={vehicle.name} className="h-80 w-full object-cover sm:h-[420px]" />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 ${activeImage === i ? "border-electric" : "border-transparent"}`}>
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-electric-400">{vehicle.category}</span>
              <h1 className="mt-1 font-display text-3xl font-bold text-white">{vehicle.name}</h1>
              <div className="mt-2 flex items-center gap-3 text-sm text-slate-400">
                <span className="flex items-center gap-1"><FiMapPin size={14} /> {vehicle.location}</span>
                {vehicle.ratingsCount > 0 && (
                  <span className="flex items-center gap-1 text-amber-accent"><FiStar className="fill-amber-accent" size={14} /> {vehicle.ratingsAverage} ({vehicle.ratingsCount} reviews)</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: FiUsers, label: `${vehicle.seats} seats` },
              { icon: FiSettings, label: vehicle.transmission },
              { icon: FiDroplet, label: vehicle.fuelType },
              { icon: FiCalendar, label: vehicle.year },
            ].map((s, i) => (
              <div key={i} className="card flex flex-col items-center gap-1.5 py-4 text-center">
                <s.icon className="text-electric-400" size={18} />
                <span className="text-xs text-slate-300">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="card mt-6 p-6">
            <h2 className="font-display text-lg font-semibold text-white">About this vehicle</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{vehicle.description}</p>
            {vehicle.features?.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {vehicle.features.map((f) => (
                  <span key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <FiCheck className="text-electric-400" size={14} /> {f}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="card mt-6 p-6">
            <h2 className="font-display text-lg font-semibold text-white">Customer reviews</h2>
            {reviews?.length ? (
              <div className="mt-4 space-y-4">
                {reviews.map((r) => (
                  <div key={r._id} className="border-b border-white/5 pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-200">{r.customer?.name}</span>
                      <span className="flex items-center gap-1 text-xs text-amber-accent"><FiStar className="fill-amber-accent" size={12} /> {r.rating}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{r.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No reviews yet for this vehicle.</p>
            )}
          </div>
        </div>

        {/* Booking sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24 p-6">
            <div className="flex items-end justify-between">
              <div>
                {vehicle.discountPercent > 0 && <span className="text-xs text-slate-500 line-through">₹{vehicle.pricePerDay}</span>}
                <p className="font-display text-2xl font-bold text-white">
                  ₹{Math.round(vehicle.pricePerDay * (1 - (vehicle.discountPercent || 0) / 100))}
                  <span className="text-sm font-normal text-slate-500"> /day</span>
                </p>
              </div>
              <FiHeart className="text-slate-500" size={20} />
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <label className="label-text">Pickup location</label>
                <input value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} placeholder={vehicle.location} className="input-field" />
              </div>
              <div>
                <label className="label-text">Pickup date</label>
                <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="label-text">Return date</label>
                <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="input-field" />
              </div>
            </div>

            {days > 0 && (
              <div className="mt-4 space-y-1.5 rounded-lg bg-white/5 p-3 text-sm">
                <div className="flex justify-between text-slate-400"><span>{days} day(s) × ₹{vehicle.pricePerDay}</span><span>₹{estimatedTotal}</span></div>
                <p className="text-xs text-slate-500">Taxes and applicable discounts calculated at checkout</p>
              </div>
            )}

            <Button onClick={handleProceed} isLoading={checking} className="mt-5 w-full">Proceed to book</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
