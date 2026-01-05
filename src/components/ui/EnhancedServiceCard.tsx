import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Sparkles, Zap } from "lucide-react";
import type { Service } from "@/data/services";

interface EnhancedServiceCardProps {
  service: Service;
  size?: "normal" | "large" | "wide";
}

export function EnhancedServiceCard({ service, size = "normal" }: EnhancedServiceCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const getBadgeConfig = () => {
    switch (service.badge) {
      case "popular":
        return { 
          label: "Most Popular", 
          icon: Star, 
          className: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 animate-pulse" 
        };
      case "premium":
        return { 
          label: "Premium", 
          icon: Sparkles, 
          className: "bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0" 
        };
      case "new":
        return { 
          label: "New", 
          icon: Zap, 
          className: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0" 
        };
      default:
        return null;
    }
  };

  const badgeConfig = getBadgeConfig();

  const sizeClasses = {
    normal: "aspect-[4/5]",
    large: "aspect-[4/5] md:row-span-2 md:aspect-auto",
    wide: "aspect-[4/5] md:col-span-2 md:aspect-[16/9]",
  };

  return (
    <div 
      className={`relative ${sizeClasses[size]} perspective-1000 cursor-pointer group`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      {/* Animated Gradient Border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary via-primary to-secondary rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 animate-gradient-x" />
      
      <motion.div
        className="relative w-full h-full preserve-3d transition-transform duration-700"
        style={{ 
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front of Card */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Glassmorphism Card */}
          <div className="relative w-full h-full">
            {/* Background Image */}
            <img
              src={service.image}
              alt={service.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            {/* Glass Panel at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-md bg-white/10">
              {/* Badge */}
              {badgeConfig && (
                <div className="absolute -top-10 left-6">
                  <Badge className={`${badgeConfig.className} px-3 py-1 flex items-center gap-1.5 shadow-lg`}>
                    <badgeConfig.icon className="w-3.5 h-3.5" />
                    {badgeConfig.label}
                  </Badge>
                </div>
              )}
              
              {/* Icon */}
              <motion.div 
                className="absolute -top-8 right-6 w-14 h-14 bg-gradient-to-br from-secondary/80 to-primary/60 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl shadow-xl"
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {service.icon}
              </motion.div>
              
              <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-2">
                {service.name}
              </h3>
              
              <p className="text-white/70 text-sm line-clamp-2 mb-3">
                {service.description}
              </p>
              
              {service.priceRange && (
                <p className="text-secondary font-semibold text-sm">
                  {service.priceRange}
                </p>
              )}
              
              {/* Hover Indicator */}
              <div className="flex items-center gap-2 mt-3 text-white/50 text-xs">
                <span className="animate-pulse">●</span>
                Hover for details
              </div>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Glassmorphism Back */}
          <div className="relative w-full h-full bg-gradient-to-br from-card/95 via-background/95 to-card/95 backdrop-blur-xl border border-border/50 p-6 flex flex-col">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-32 h-32 bg-secondary rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{service.icon}</span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    {service.name}
                  </h3>
                  {service.priceRange && (
                    <p className="text-secondary text-sm font-medium">
                      {service.priceRange}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Features */}
              <div className="flex-1 space-y-2 overflow-y-auto">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  What's Included
                </p>
                {service.features.map((feature, index) => (
                  <motion.div 
                    key={feature}
                    className="flex items-center gap-2 text-sm text-foreground/80"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
              
              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-xs text-primary font-medium">
                  {service.bookingNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
