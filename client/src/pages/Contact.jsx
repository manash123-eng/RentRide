import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import Button from "../components/Button.jsx";

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setSubmitting(false);
      e.target.reset();
    }, 800);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-white">Get in touch</h1>
        <p className="mt-2 text-sm text-slate-400">Have a question about a booking or partnership? We're here to help.</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="card space-y-4 p-6 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-text">Name</label><input required className="input-field" /></div>
            <div><label className="label-text">Email</label><input type="email" required className="input-field" /></div>
          </div>
          <div><label className="label-text">Subject</label><input required className="input-field" /></div>
          <div><label className="label-text">Message</label><textarea required rows={5} className="input-field" /></div>
          <Button type="submit" isLoading={submitting}>Send message</Button>
        </form>

        <div className="space-y-4">
          <div className="card flex items-center gap-3 p-5"><FiMail className="text-electric-400" /> <span className="text-sm text-slate-300">support@rentride.com</span></div>
          <div className="card flex items-center gap-3 p-5"><FiPhone className="text-electric-400" /> <span className="text-sm text-slate-300">+91 98765 43210</span></div>
          <div className="card flex items-center gap-3 p-5"><FiMapPin className="text-electric-400" /> <span className="text-sm text-slate-300">Mumbai, Maharashtra, India</span></div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
