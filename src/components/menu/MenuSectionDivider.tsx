import { cn } from "@/lib/utils";

interface MenuSectionDividerProps {
  className?: string;
}

export function MenuSectionDivider({ className }: MenuSectionDividerProps) {
  return (
    <div className={cn("relative py-8 overflow-hidden", className)}>
      {/* Center Rangoli Pattern */}
      <div className="flex items-center justify-center gap-4">
        {/* Left decorative line */}
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-secondary/30 to-secondary/50" />
        
        {/* Rangoli-inspired center decoration */}
        <div className="relative">
          <div className="w-16 h-16 relative">
            {/* Outer petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation) => (
              <div
                key={rotation}
                className="absolute inset-0 flex items-center justify-center"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <div className="w-2 h-6 bg-gradient-to-t from-primary/40 to-secondary/60 rounded-full transform -translate-y-3" />
              </div>
            ))}
            {/* Inner ring */}
            <div className="absolute inset-3 border-2 border-secondary/40 rounded-full" />
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-gradient-to-br from-secondary to-accent rounded-full shadow-lg" />
            </div>
          </div>
        </div>
        
        {/* Right decorative line */}
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-secondary/30 to-secondary/50" />
      </div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 20">
          <pattern id="divider-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
            <circle cx="10" cy="10" r="1" fill="currentColor" className="text-primary" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#divider-pattern)" />
        </svg>
      </div>
    </div>
  );
}
