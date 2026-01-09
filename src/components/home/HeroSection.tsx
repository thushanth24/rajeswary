import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { FloatingElements } from "@/components/animations/FloatingElements";
import { RangoliPattern } from "@/components/animations/RangoliPattern";
import { DiyaLamp } from "@/components/animations/DiyaLamp";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/hero-traditional.webp";

export function HeroSection() {
  const { t } = useLanguage();
  
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Traditional Hindu Wedding Mandapam"
          className="h-full w-full object-cover"
          fetchPriority="high"
          decoding="sync"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
      </div>

      {/* Animated rangoli pattern overlay */}
      <RangoliPattern />

      {/* Floating flower petals */}
      <FloatingElements />

      {/* Animated corner diyas */}
      <div className="absolute top-28 left-8 z-20 hidden lg:block animate-float">
        <DiyaLamp size="lg" />
      </div>
      <div className="absolute top-28 right-8 z-20 hidden lg:block animate-float" style={{ animationDelay: "1s" }}>
        <DiyaLamp size="lg" />
      </div>
      <div className="absolute bottom-32 left-8 z-20 hidden lg:block animate-float" style={{ animationDelay: "2s" }}>
        <DiyaLamp size="md" />
      </div>
      <div className="absolute bottom-32 right-8 z-20 hidden lg:block animate-float" style={{ animationDelay: "1.5s" }}>
        <DiyaLamp size="md" />
      </div>

      {/* Decorative floating elements */}
      <div className="absolute top-40 left-1/4 text-secondary/40 text-4xl animate-swing hidden md:block">
        🪷
      </div>
      <div className="absolute bottom-40 right-1/4 text-secondary/40 text-4xl animate-swing hidden md:block" style={{ animationDelay: "1s" }}>
        🪷
      </div>

      {/* Sparkle effects */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute text-secondary/60 text-xl animate-sparkle hidden md:block"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${i * 0.5}s`,
          }}
        >
          ✦
        </div>
      ))}

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 lg:px-8 flex justify-center">
        <div className="max-w-2xl text-center">
          {/* Traditional decorative header */}
          <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <span className="text-secondary text-2xl animate-pulse-glow">✦</span>
            <span className="text-secondary font-medium tracking-[0.3em] uppercase text-sm">
              Jaffna Hindu Traditional Venues
            </span>
            <span className="text-secondary text-2xl animate-pulse-glow" style={{ animationDelay: "0.5s" }}>✦</span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-card mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {t("hero.title").split(",")[0]},
            <br />
            <span 
              className="inline-block bg-gradient-to-r from-secondary via-accent to-secondary bg-clip-text text-transparent animate-shimmer"
              style={{ backgroundSize: "200% 100%" }}
            >
              {t("hero.title").split(",")[1]?.trim() || "Blessed Beginnings"}
            </span>
          </h1>
          
          <p className="text-lg text-card/90 mb-8 max-w-xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            {t("hero.subtitle")}
          </p>

          {/* Decorative divider with animation */}
          <div className="flex items-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-secondary/50 to-secondary animate-wave" style={{ backgroundSize: "200% 100%" }} />
            <span className="text-secondary animate-float">🪷</span>
            <div className="h-px flex-1 bg-gradient-to-r from-secondary via-secondary/50 to-transparent animate-wave" style={{ backgroundSize: "200% 100%", animationDirection: "reverse" }} />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            <Button 
              size="lg" 
              asChild 
              className="text-sm sm:text-base bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-gold-glow transition-all duration-300 hover:shadow-xl hover:scale-105 group"
            >
              <Link to="/booking">
                <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-swing" />
                <span className="truncate">{t("hero.cta.book")}</span>
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className="text-sm sm:text-base bg-card/10 border-card/40 text-card hover:bg-card/20 hover:text-card transition-all duration-300 hover:scale-105"
            >
              <Link to="/halls">
                <span className="truncate">{t("hero.cta.explore")}</span>
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              </Link>
            </Button>
          </div>

          {/* Stats with staggered animation */}
          <div className="mt-12 flex justify-center gap-8 md:gap-12">
            {[
              { value: "5", label: t("hero.stats.halls") },
              { value: "800+", label: t("hero.stats.guests") },
              { value: "15+", label: t("hero.stats.legacy") },
            ].map((stat, index) => (
              <div 
                key={index} 
                className="animate-fade-in-up group cursor-default"
                style={{ animationDelay: `${1 + index * 0.2}s` }}
              >
                <p className="text-3xl font-serif font-bold text-secondary group-hover:animate-pulse-glow transition-all">
                  {stat.value}
                </p>
                <p className="text-sm text-card/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom decorative border with animation */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg className="w-full h-6" viewBox="0 0 1200 24" preserveAspectRatio="none">
          <defs>
            <linearGradient id="bottomBorder" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(350 70% 35%)">
                <animate attributeName="stop-color" values="hsl(350 70% 35%); hsl(38 80% 50%); hsl(350 70% 35%)" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="hsl(38 80% 50%)">
                <animate attributeName="stop-color" values="hsl(38 80% 50%); hsl(350 70% 35%); hsl(38 80% 50%)" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="hsl(350 70% 35%)">
                <animate attributeName="stop-color" values="hsl(350 70% 35%); hsl(38 80% 50%); hsl(350 70% 35%)" dur="3s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1200" height="8" fill="url(#bottomBorder)" />
          <rect x="0" y="10" width="1200" height="4" fill="hsl(38 80% 50%)" opacity="0.5" />
          <rect x="0" y="16" width="1200" height="2" fill="hsl(350 70% 35%)" opacity="0.3" />
        </svg>
      </div>
    </section>
  );
}
