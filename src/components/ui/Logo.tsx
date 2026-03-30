"use client";

interface LogoProps {
  variant?: "wordmark" | "icon";
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { icon: 24, text: "text-base" },
  md: { icon: 28, text: "text-lg" },
  lg: { icon: 36, text: "text-2xl" },
};

/**
 * Convene logo — geometric "C" mark + wordmark.
 * The icon is an abstract angular "C" that suggests convergence/connection.
 * Built as inline SVG for instant rendering at any size.
 */
export default function Logo({ variant = "wordmark", className = "", size = "md" }: LogoProps) {
  const s = sizes[size];

  const iconMark = (
    <svg
      width={s.icon}
      height={s.icon}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* Angular C shape — sharp, geometric, premium */}
      <rect width="32" height="32" rx="7" fill="#DC2626" />
      <path
        d="M22 9.5H14C11.5147 9.5 9.5 11.5147 9.5 14V18C9.5 20.4853 11.5147 22.5 14 22.5H22"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === "icon") {
    return <div className={className}>{iconMark}</div>;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {iconMark}
      <span className={`${s.text} font-semibold tracking-tight text-text-primary`}>
        Convene
      </span>
    </div>
  );
}
