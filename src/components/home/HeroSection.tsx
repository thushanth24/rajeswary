import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-traditional.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Traditional Hindu Wedding Mandapam"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/30" />
      </div>

      {/* Decorative overlay pattern */}
      <div className="absolute inset-0 z-[1] opacity-10">
        <div className="absolute inset-0 paisley-bg" />
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-24 left-8 text-secondary/30 text-6xl animate-float hidden lg:block">
        🪷
      </div>
      <div className="absolute bottom-24 right-8 text-secondary/30 text-6xl animate-float hidden lg:block" style={{ animationDelay: "3s" }}>
        🪔
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="max-w-2xl animate-fade-in-up">
          {/* Traditional decorative header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-secondary text-2xl">✦</span>
            <span className="text-secondary font-medium tracking-[0.3em] uppercase text-sm">
              Jaffna Hindu Traditional Venues
            </span>
            <span className="text-secondary text-2xl">✦</span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-card mb-6 leading-tight">
            Sacred Unions,
            <br />
            <span className="text-secondary animate-shimmer bg-gradient-to-r from-secondary via-accent to-secondary bg-clip-text" 
                  style={{ backgroundSize: "200% 100%" }}>
              Blessed Beginnings
            </span>
          </h1>
          
          <p className="text-lg text-card/90 mb-8 max-w-xl leading-relaxed">
            Experience the grandeur of authentic Tamil Hindu weddings in our 
            beautifully crafted mandapams. Five sacred venues adorned with 
            traditional kolam, jasmine garlands, and the warm glow of kuthu vilakku.
          </p>

          {/* Decorative divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-secondary/50 to-secondary" />
            <span className="text-secondary">🪷</span>
            <div className="h-px flex-1 bg-gradient-to-r from-secondary via-secondary/50 to-transparent" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              asChild 
              className="text-base bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-gold-glow transition-all duration-300 hover:shadow-xl"
            >
              <Link to="/booking">
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Muhurtham
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className="text-base bg-card/10 border-card/40 text-card hover:bg-card/20 hover:text-card transition-all duration-300"
            >
              <Link to="/halls">
                Explore Mandapams
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 flex gap-8 md:gap-12">
            {[
              { value: "5", label: "Sacred Halls" },
              { value: "800+", label: "Max Guests" },
              { value: "15+", label: "Years Legacy" },
            ].map((stat, index) => (
              <div 
                key={stat.label} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <p className="text-3xl font-serif font-bold text-secondary">{stat.value}</p>
                <p className="text-sm text-card/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom decorative border */}
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-primary via-secondary to-primary z-10" />
    </section>
  );
}
