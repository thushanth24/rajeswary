import { Link } from "react-router-dom";
import { Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiyaLamp } from "@/components/animations/DiyaLamp";
import { RangoliPattern } from "@/components/animations/RangoliPattern";

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary to-primary/90 relative overflow-hidden">
      {/* Animated rangoli pattern */}
      <div className="absolute inset-0 opacity-20">
        <RangoliPattern />
      </div>
      
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20c11.046 0 20-8.954 20-20s-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      {/* Animated corner diyas */}
      <div className="absolute top-12 left-12 z-20 hidden lg:block">
        <DiyaLamp size="lg" className="animate-float" />
      </div>
      <div className="absolute top-12 right-12 z-20 hidden lg:block">
        <DiyaLamp size="lg" className="animate-float" />
      </div>
      <div className="absolute bottom-12 left-12 z-20 hidden lg:block">
        <DiyaLamp size="md" className="animate-float-slow" />
      </div>
      <div className="absolute bottom-12 right-12 z-20 hidden lg:block">
        <DiyaLamp size="md" className="animate-float-slow" />
      </div>
      
      {/* Floating lotus */}
      <div className="absolute top-1/2 left-20 text-secondary/30 text-5xl animate-float hidden xl:block">
        🪷
      </div>
      <div className="absolute top-1/2 right-20 text-secondary/30 text-5xl animate-float hidden xl:block" style={{ animationDelay: "2s" }}>
        🪷
      </div>
      
      {/* Top decorative border */}
      <div className="absolute top-0 left-0 right-0 h-3 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1200 12" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaTopBorder" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(38 80% 50%)">
                <animate attributeName="stop-color" values="hsl(38 80% 50%); hsl(25 90% 55%); hsl(38 80% 50%)" dur="2s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="hsl(25 90% 55%)">
                <animate attributeName="stop-color" values="hsl(25 90% 55%); hsl(38 80% 50%); hsl(25 90% 55%)" dur="2s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="hsl(38 80% 50%)">
                <animate attributeName="stop-color" values="hsl(38 80% 50%); hsl(25 90% 55%); hsl(38 80% 50%)" dur="2s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1200" height="12" fill="url(#ctaTopBorder)" />
        </svg>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-secondary text-2xl animate-sparkle">✦</span>
            <span className="text-secondary/80 font-medium tracking-widest uppercase text-sm">
              Begin Your Sacred Journey
            </span>
            <span className="text-secondary text-2xl animate-sparkle" style={{ animationDelay: "0.75s" }}>✦</span>
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 animate-fade-in-up">
            Ready to Book Your{" "}
            <span 
              className="inline-block bg-gradient-to-r from-secondary via-accent to-secondary bg-clip-text text-transparent animate-shimmer"
              style={{ backgroundSize: "200% 100%" }}
            >
              Muhurtham
            </span>?
          </h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-8 text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Take the first step towards your dream traditional wedding. Check availability, 
            customize your ceremonies, and secure your auspicious date today.
          </p>
          
          {/* Animated decorative divider */}
          <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-secondary/50 animate-wave" style={{ backgroundSize: "200% 100%" }} />
            <span className="text-secondary animate-diya-flicker text-2xl">🪔</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-secondary/50 animate-wave" style={{ backgroundSize: "200% 100%", animationDirection: "reverse" }} />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <Button 
              size="lg" 
              asChild 
              className="text-base bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-gold-glow transition-all duration-300 hover:scale-105 group"
            >
              <Link to="/booking">
                <Calendar className="mr-2 h-5 w-5 group-hover:animate-swing" />
                Book Your Sacred Day
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className="text-base bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300 hover:scale-105 group"
            >
              <a href="tel:+919876543210">
                <Phone className="mr-2 h-5 w-5 group-hover:animate-swing" />
                Speak With Us
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bottom decorative border */}
      <div className="absolute bottom-0 left-0 right-0 h-3 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1200 12" preserveAspectRatio="none">
          <rect x="0" y="0" width="1200" height="12" fill="url(#ctaTopBorder)" />
        </svg>
      </div>
    </section>
  );
}
