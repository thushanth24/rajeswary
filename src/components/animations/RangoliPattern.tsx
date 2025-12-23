export function RangoliPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Center mandala */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
        <svg
          width="800"
          height="800"
          viewBox="0 0 200 200"
          className="animate-mandala-rotate"
        >
          <defs>
            <pattern id="rangoli" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="25" cy="25" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="25" cy="25" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="25" cy="25" r="5" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          
          {/* Outer petals */}
          {[...Array(12)].map((_, i) => (
            <ellipse
              key={i}
              cx="100"
              cy="30"
              rx="15"
              ry="25"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              transform={`rotate(${i * 30} 100 100)`}
              className="text-secondary"
            />
          ))}
          
          {/* Inner petals */}
          {[...Array(8)].map((_, i) => (
            <ellipse
              key={`inner-${i}`}
              cx="100"
              cy="50"
              rx="10"
              ry="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
              transform={`rotate(${i * 45} 100 100)`}
              className="text-primary"
            />
          ))}
          
          {/* Center circles */}
          <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" className="text-secondary" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-primary" />
          <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-secondary" />
          <circle cx="100" cy="100" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
          <circle cx="100" cy="100" r="5" fill="currentColor" className="text-secondary" />
        </svg>
      </div>
      
      {/* Corner rangoli patterns */}
      {["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 left-0 -rotate-90", "bottom-0 right-0 rotate-180"].map((position, i) => (
        <div key={i} className={`absolute ${position} w-40 h-40 opacity-[0.04]`}>
          <svg viewBox="0 0 100 100" className="w-full h-full animate-pulse-glow">
            {[...Array(6)].map((_, j) => (
              <path
                key={j}
                d={`M 0 0 Q ${25 + j * 5} ${50} 0 ${100 - j * 10}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-secondary"
              />
            ))}
          </svg>
        </div>
      ))}
    </div>
  );
}
