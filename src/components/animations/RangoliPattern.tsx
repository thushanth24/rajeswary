interface RangoliPatternProps {
  position?: "center" | "corners";
  size?: "sm" | "md" | "lg";
  opacity?: number;
}

export function RangoliPattern({ position = "center", size = "md", opacity = 0.03 }: RangoliPatternProps) {
  const sizes = { sm: 400, md: 600, lg: 800 };
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {position === "center" && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ opacity }}>
          <svg width={sizes[size]} height={sizes[size]} viewBox="0 0 200 200" className="animate-mandala-rotate">
            {[...Array(12)].map((_, i) => (
              <ellipse key={i} cx="100" cy="30" rx="15" ry="25" fill="none" stroke="currentColor" strokeWidth="1" transform={`rotate(${i * 30} 100 100)`} className="text-secondary" />
            ))}
            {[...Array(8)].map((_, i) => (
              <ellipse key={`inner-${i}`} cx="100" cy="50" rx="10" ry="20" fill="none" stroke="currentColor" strokeWidth="0.8" transform={`rotate(${i * 45} 100 100)`} className="text-primary" />
            ))}
            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" className="text-secondary" />
            <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-primary" />
            <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-secondary" />
            <circle cx="100" cy="100" r="5" fill="currentColor" className="text-secondary" />
          </svg>
        </div>
      )}
      
      {position === "corners" && ["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 left-0 -rotate-90", "bottom-0 right-0 rotate-180"].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-40 h-40`} style={{ opacity }}>
          <svg viewBox="0 0 100 100" className="w-full h-full animate-pulse-glow">
            {[...Array(6)].map((_, j) => (
              <path key={j} d={`M 0 0 Q ${25 + j * 5} ${50} 0 ${100 - j * 10}`} fill="none" stroke="currentColor" strokeWidth="1" className="text-secondary" />
            ))}
          </svg>
        </div>
      ))}
    </div>
  );
}