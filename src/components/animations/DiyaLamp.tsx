interface DiyaLampProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function DiyaLamp({ className = "", size = "md" }: DiyaLampProps) {
  const sizeClasses = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16" };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="absolute inset-0 bg-gradient-radial from-secondary/40 via-accent/20 to-transparent rounded-full animate-glow-pulse blur-sm" />
      <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
        <ellipse cx="50" cy="25" rx="15" ry="20" fill="url(#flameGlow)" className="animate-diya-flicker" />
        <path d="M50 10 Q45 20 45 30 Q45 40 50 45 Q55 40 55 30 Q55 20 50 10" fill="url(#flameGradient)" className="animate-diya-flicker" />
        <rect x="48" y="42" width="4" height="8" fill="#4a3728" />
        <ellipse cx="50" cy="52" rx="20" ry="5" fill="#8B4513" />
        <path d="M25 55 Q20 60 22 70 Q30 85 50 88 Q70 85 78 70 Q80 60 75 55 Z" fill="url(#diyaGradient)" />
        <ellipse cx="50" cy="55" rx="25" ry="6" fill="none" stroke="#C9A227" strokeWidth="2" />
        <defs>
          <radialGradient id="flameGlow">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FF8C00" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF4500" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="flameGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FF4500" />
            <stop offset="40%" stopColor="#FF8C00" />
            <stop offset="70%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFFACD" />
          </linearGradient>
          <linearGradient id="diyaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#CD853F" />
            <stop offset="50%" stopColor="#8B4513" />
            <stop offset="100%" stopColor="#654321" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function DiwaRow({ count = 5, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`flex justify-center items-center gap-6 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-float" style={{ animationDelay: `${i * 0.3}s` }}>
          <DiyaLamp size="sm" />
        </div>
      ))}
    </div>
  );
}