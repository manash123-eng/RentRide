import React from "react";

const Button = ({ children, variant = "primary", className = "", isLoading = false, ...props }) => {
  const base = variant === "primary" ? "btn-primary" : variant === "secondary" ? "btn-secondary" : "btn-primary";
  return (
    <button className={`${base} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
