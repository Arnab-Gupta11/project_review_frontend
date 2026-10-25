import React from "react";

interface LogoProps {
  compact?: boolean;
  className?: string;
  markClassName?: string;
}

export function Logo({
  compact = false,
  className = "",
  markClassName = "h-9 w-9",
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-sans text-[15px] font-bold tracking-[-0.01em] text-primary-text">
            Project Review
          </span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-secondary-text">
            Review Portal
          </span>
        </span>
      )}
    </span>
  );
}
