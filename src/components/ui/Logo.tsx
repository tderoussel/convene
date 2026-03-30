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
 * Alyned logo — geometric "A" mark + wordmark.
 * The icon is an abstract angular "A" that suggests alignment/connection.
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
      {/* Angular A shape — sharp, geometric, premium */}
      <rect width="32" height="32" rx="7" fill="#DC2626" />
      <path
        d="M16 8L9.5 24H12.5L14 20H18L19.5 24H22.5L16 8Z"
        fill="white"
      />
      <line x1="13" y1="17.5" x2="19" y2="17.5" stroke="#DC2626" strokeWidth="1.5" />
    </svg>
  );

  if (variant === "icon") {
    return <div className={className}>{iconMark}</div>;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {iconMark}
      <span className={`${s.text} font-semibold tracking-tight text-text-primary`}>
        Alyned
      </span>
    </div>
  );
}
