import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { FiArrowRight, FiMapPin, FiShield, FiClock, FiHeadphones, FiStar } from "react-icons/fi";
import { vehicleService } from "../services/vehicleService.js";
import VehicleCard from "../components/VehicleCard.jsx";
import VehicleCardSkeleton from "../components/VehicleCardSkeleton.jsx";

const categories = [
  { name: "Sedan", emoji: "🚗" },
  { name: "SUV", emoji: "🚙" },
  { name: "Luxury", emoji: "🏎️" },
  { name: "Electric", emoji: "⚡" },
  { name: "Convertible", emoji: "🌤️" },
  { name: "Bike", emoji: "🏍️" },
];

const perks = [
  { icon: FiShield, title: "Verified & insured fleet", desc: "Every vehicle is inspected and fully insured before it reaches you." },
  { icon: FiClock, title: "Instant confirmation", desc: "Book in under two minutes with real-time availability." },
  { icon: FiHeadphones, title: "24/7 roadside support", desc: "Help is one call away, anywhere on your route." },
];

const Landing = () => {
  const navigate = useNavigate();
  const [location, setLocation] = React.useState("");
  const [pickup, setPickup] = React.useState("");
  const [ret, setRet] = React.useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["featured-vehicles"],
    queryFn: () => vehicleService.getFeatured().then((r) => r.data.data),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (pickup) params.set("pickup", pickup);
    if (ret) params.set("return", ret);
    navigate(`/vehicles?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(61,90,254,0.18),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,176,32,0.12),transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-4 py-1.5 text-xs font-semibold text-electric-400">
                Now live in 12 cities across India
              </span>
              <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
                Drive what moves you, <span className="text-electric-400">whenever</span> you need it.
              </h1>
              <p className="mt-5 max-w-lg text-base text-slate-400">
                From compact hatchbacks to luxury convertibles — RentRide connects you with a fully verified
                fleet, transparent pricing, and zero-hassle bookings.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to="/vehicles" className="btn-primary">
                  Browse the fleet <FiArrowRight />
                </Link>
                <Link to="/register" className="btn-secondary">
                  Become a partner
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-8">
                <div>
                  <p className="font-display text-2xl font-bold text-white">15K+</p>
                  <p className="text-xs text-slate-500">Happy renters</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-white">480+</p>
                  <p className="text-xs text-slate-500">Vehicles listed</p>
                </div>
                <div>
                  <p className="flex items-center gap-1 font-display text-2xl font-bold text-white">
                    4.9 <FiStar className="fill-amber-accent text-amber-accent" size={18} />
                  </p>
                  <p className="text-xs text-slate-500">Average rating</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }} className="relative">
              <div className="card overflow-hidden">
                <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=80" alt="Featured vehicle" className="h-72 w-full object-cover sm:h-96" />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden rounded-xl2 border border-white/10 bg-graphite/95 p-4 shadow-soft backdrop-blur sm:block">
                <p className="text-xs text-slate-400">Starting from</p>
                <p className="font-display text-xl font-bold text-white">₹900<span className="text-sm text-slate-500">/day</span></p>
              </div>
            </motion.div>
          </div>

          {/* Search bar */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card mt-14 grid grid-cols-1 gap-4 p-5 sm:grid-cols-4 sm:p-6"
          >
            <div>
              <label className="label-text">Pickup location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or airport" className="input-field" />
            </div>
            <div>
              <label className="label-text">Pickup date</label>
              <input type="date" value={pickup} onChange={(e) => setPickup(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-text">Return date</label>
              <input type="date" value={ret} onChange={(e) => setRet(e.target.value)} className="input-field" />
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full">Search vehicles</button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold text-white">Browse by category</h2>
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {categories.map((c) => (
            <Link key={c.name} to={`/vehicles?category=${c.name}`} className="card flex flex-col items-center gap-2 px-3 py-5 transition hover:border-electric/40 hover:bg-electric/5">
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-xs font-medium text-slate-300">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured vehicles */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Featured vehicles</h2>
            <p className="mt-1 text-sm text-slate-400">Hand-picked rides our renters love most</p>
          </div>
          <Link to="/vehicles" className="hidden text-sm font-semibold text-electric-400 hover:underline sm:flex items-center gap-1">
            View all <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <VehicleCardSkeleton key={i} />)
            : data?.map((v) => <VehicleCard key={v._id} vehicle={v} />)}
        </div>
      </section>

      {/* Perks */}
      <section className="bg-graphite/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-2xl font-bold text-white">Why renters choose RentRide</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {perks.map((p) => (
              <div key={p.title} className="card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-electric/10 text-electric-400">
                  <p.icon size={22} />
                </div>
                <h3 className="font-display text-base font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="card relative overflow-hidden p-10 text-center sm:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(61,90,254,0.25),transparent_60%)]" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold text-white">Ready for your next drive?</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
              Join thousands of renters who trust RentRide for business trips, getaways, and everything in between.
            </p>
            <Link to="/vehicles" className="btn-primary mt-7 inline-flex">
              Find your ride <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
