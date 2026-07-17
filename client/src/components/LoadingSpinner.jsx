import React from "react";

const LoadingSpinner = ({ size = "md" }) => {
  const sizes = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <div className="flex w-full items-center justify-center py-10">
      <div className={`${sizes[size]} animate-spin rounded-full border-2 border-electric/20 border-t-electric`} />
    </div>
  );
};

export default LoadingSpinner;
