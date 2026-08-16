export function Logo({ className = "h-8 w-8 text-cyan-400" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M200 40 L60 180 L80 340 L200 280 L320 340 L340 180 Z" fill="none" stroke="currentColor" strokeWidth="24" strokeLinejoin="round" />
      <path d="M200 120 L130 220 L200 260 L270 220 Z" fill="currentColor" />
      <circle cx="150" cy="180" r="16" fill="currentColor" />
      <circle cx="250" cy="180" r="16" fill="currentColor" />
    </svg>
  );
}
