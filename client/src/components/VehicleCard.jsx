import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUsers, FiSettings, FiStar, FiHeart, FiMapPin } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import { userService } from "../services/userService.js";
import toast from "react-hot-toast";

const VehicleCard = ({ vehicle, wishlisted = false, onWishlistChange }) => {
  const { isAuthenticated } = useAuth();
  const image = vehicle.images?.[0]?.url || "https://placehold.co/600x400/172033/3D5AFE?text=RentRide";

  const discountedPrice = vehicle.discountPercent
    ? Math.round(vehicle.pricePerDay * (1 - vehicle.discountPercent / 100))
    : vehicle.pricePerDay;

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please log in to save vehicles to your wishlist");
      return;
    }
    try {
      await userService.toggleWishlist(vehicle._id);
      toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
      onWishlistChange?.();
    } catch (err) {
      toast.error("Could not update wishlist");
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="card group overflow-hidden"
    >
      <Link to={`/vehicles/${vehicle._id}`} className="block">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={image}
            alt={vehicle.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          {vehicle.discountPercent > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-amber-accent px-3 py-1 text-xs font-bold text-ink">
              {vehicle.discountPercent}% OFF
            </span>
          )}
          <button
            onClick={handleWishlist}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/60 text-white backdrop-blur transition hover:bg-ink/80"
          >
            <FiHeart className={wishlisted ? "fill-electric-400 text-electric-400" : ""} size={16} />
          </button>
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-ink/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            <FiMapPin size={12} /> {vehicle.location}
          </div>
        </div>

        <div className="p-5">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-slate-100">{vehicle.name}</h3>
            {vehicle.ratingsCount > 0 && (
              <span className="flex items-center gap-1 text-xs font-medium text-amber-accent">
                <FiStar className="fill-amber-accent" size={13} /> {vehicle.ratingsAverage}
              </span>
            )}
          </div>
          <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">{vehicle.category}</p>

          <div className="mb-4 flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><FiUsers size={13} /> {vehicle.seats} seats</span>
            <span className="flex items-center gap-1"><FiSettings size={13} /> {vehicle.transmission}</span>
          </div>

          <div className="flex items-end justify-between border-t border-white/5 pt-4">
            <div>
              {vehicle.discountPercent > 0 && (
                <span className="mr-1.5 text-xs text-slate-500 line-through">₹{vehicle.pricePerDay}</span>
              )}
              <span className="font-display text-lg font-bold text-white">₹{discountedPrice}</span>
              <span className="text-xs text-slate-500"> /day</span>
            </div>
            <span className="rounded-full bg-electric/10 px-3 py-1.5 text-xs font-semibold text-electric-400 transition group-hover:bg-electric group-hover:text-white">
              View details
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default VehicleCard;
