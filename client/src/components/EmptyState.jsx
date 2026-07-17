import React from "react";

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-white/10 bg-white/[0.02] py-16 px-6 text-center">
    {Icon && (
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-electric/10 text-electric-400">
        <Icon size={26} />
      </div>
    )}
    <h3 className="font-display text-lg font-semibold text-slate-100">{title}</h3>
    {description && <p className="mt-1.5 max-w-sm text-sm text-slate-400">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
