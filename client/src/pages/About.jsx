import React from "react";
import { FiTarget, FiShield, FiUsers } from "react-icons/fi";

const About = () => (
  <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
    <div className="text-center">
      <span className="text-xs font-semibold uppercase tracking-wide text-electric-400">About RentRide</span>
      <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Mobility, made simple.</h1>
      <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400">
        RentRide began with a simple idea: renting a vehicle shouldn't involve paperwork, hidden fees, or
        uncertainty. We built a platform that connects renters with a fully verified fleet, transparent
        pricing, and instant confirmation — wherever the road takes you.
      </p>
    </div>

    <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
      {[
        { icon: FiTarget, title: "Our mission", desc: "Make vehicle rental as effortless as booking a ride." },
        { icon: FiShield, title: "Our promise", desc: "Every vehicle inspected, insured, and ready to go." },
        { icon: FiUsers, title: "Our community", desc: "15,000+ renters trust RentRide across 12 cities." },
      ].map((f) => (
        <div key={f.title} className="card p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-electric/10 text-electric-400"><f.icon size={22} /></div>
          <h3 className="font-display text-base font-semibold text-white">{f.title}</h3>
          <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default About;
