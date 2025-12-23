interface DecorativeBorderProps {
  variant?: "top" | "bottom" | "both";
  position?: "top" | "bottom"; // alias for variant
}

export function DecorativeBorder({ variant, position }: DecorativeBorderProps) {
  const v = position || variant || "top";
  const BorderSVG = () => (
    <svg
      className="w-full h-4"
      viewBox="0 0 1200 20"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(350 70% 35%)" />
          <stop offset="25%" stopColor="hsl(38 80% 50%)" />
          <stop offset="50%" stopColor="hsl(350 70% 35%)" />
          <stop offset="75%" stopColor="hsl(38 80% 50%)" />
          <stop offset="100%" stopColor="hsl(350 70% 35%)" />
        </linearGradient>
      </defs>
      
      {/* Main decorative line */}
      <rect x="0" y="8" width="1200" height="4" fill="url(#borderGradient)" />
      
      {/* Decorative elements */}
      {[...Array(13)].map((_, i) => (
        <g key={i} transform={`translate(${i * 100}, 0)`}>
          <circle cx="50" cy="10" r="6" fill="hsl(38 80% 50%)" />
          <circle cx="50" cy="10" r="3" fill="hsl(350 70% 35%)" />
        </g>
      ))}
    </svg>
  );

  return (
    <>
      {(v === "top" || v === "both") && (
        <div className="absolute top-0 left-0 right-0 overflow-hidden">
          <BorderSVG />
        </div>
      )}
      {(v === "bottom" || v === "both") && (
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden rotate-180">
          <BorderSVG />
        </div>
      )}
    </>
  );
}
