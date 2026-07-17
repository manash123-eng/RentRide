import React from "react";

const VehicleCardSkeleton = () => (
  <div className="card overflow-hidden">
    <div className="skeleton h-48 w-full rounded-none" />
    <div className="space-y-3 p-5">
      <div className="skeleton h-5 w-2/3" />
      <div className="skeleton h-4 w-1/2" />
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16" />
        <div className="skeleton h-6 w-16" />
      </div>
      <div className="skeleton h-9 w-full" />
    </div>
  </div>
);

export default VehicleCardSkeleton;
