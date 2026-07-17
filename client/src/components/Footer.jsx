import React from "react";
import { Link } from "react-router-dom";
import { FiInstagram, FiTwitter, FiFacebook, FiMapPin, FiMail, FiPhone } from "react-icons/fi";
import Logo from "./Logo.jsx";

const Footer = () => (
  <footer className="border-t border-white/5 bg-graphite">
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-slate-400">
            Premium vehicle rentals for every journey — from city hatchbacks to luxury convertibles.
          </p>
          <div className="mt-5 flex gap-3">
            {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
              <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 transition hover:bg-electric hover:text-white">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-display text-sm font-semibold text-white">Company</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><Link to="/about" className="hover:text-white">About us</Link></li>
            <li><Link to="/vehicles" className="hover:text-white">Browse fleet</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/" className="hover:text-white">Careers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-sm font-semibold text-white">Support</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><Link to="/" className="hover:text-white">Help center</Link></li>
            <li><Link to="/" className="hover:text-white">Rental terms</Link></li>
            <li><Link to="/" className="hover:text-white">Privacy policy</Link></li>
            <li><Link to="/" className="hover:text-white">Cancellation policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-sm font-semibold text-white">Get in touch</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2"><FiMapPin size={15} /> Mumbai, Maharashtra, India</li>
            <li className="flex items-center gap-2"><FiMail size={15} /> support@rentride.com</li>
            <li className="flex items-center gap-2"><FiPhone size={15} /> +91 98765 43210</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-xs text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} RentRide. All rights reserved.</p>
        <p>Built with React, Node.js & MongoDB</p>
      </div>
    </div>
  </footer>
);

export default Footer;
