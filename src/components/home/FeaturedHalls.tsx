import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HallCard } from "@/components/ui/HallCard";
import { useHalls } from "@/hooks/useHalls";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedHalls() {
  const { halls, loading } = useHalls();

  return (
    <section className="py-20 bg-background lotus-bg relative overflow-hidden">
      {/* Decorative borders */}
      <DecorativeBorder variant="both" />
      
      {/* Animated corner decorations */}
      <div className="absolute top-16 left-10 text-secondary/20 text-5xl animate-rangoli-spin hidden lg:block">
        ❈
      </div>
      <div className="absolute bottom-16 right-10 text-secondary/20 text-5xl animate-rangoli-spin hidden lg:block" style={{ animationDirection: "reverse" }}>
        ❈
      </div>
      <div className="absolute top-1/2 left-6 text-primary/10 text-3xl animate-float hidden lg:block">
        🪷
      </div>
      <div className="absolute top-1/2 right-6 text-primary/10 text-3xl animate-float hidden lg:block" style={{ animationDelay: "2s" }}>
        🪷
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          {/* Animated decorative header */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-secondary animate-wave" style={{ backgroundSize: "200% 100%" }} />
            <span className="text-secondary text-2xl animate-diya-flicker">🪔</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-secondary animate-wave" style={{ backgroundSize: "200% 100%", animationDirection: "reverse" }} />
          </div>
          
          <span className="text-secondary font-medium tracking-widest uppercase text-sm animate-fade-in">
            Our Sacred Venues
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Exquisite Wedding <span className="text-primary">Mandapams</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            Each of our five venues is designed with authentic Tamil traditions, 
            featuring temple-inspired architecture, traditional brass lamps, and sacred spaces 
            for your wedding rituals.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </>
          ) : (
            halls.slice(0, 3).map((hall, index) => (
              <div 
                key={hall.id} 
                className="animate-fade-in-up opacity-0 group"
                style={{ 
                  animationDelay: `${0.6 + index * 0.2}s`,
                  animationFillMode: "forwards"
                }}
              >
                <HallCard hall={hall} featured={index === 0} />
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: "1.2s" }}>
          <Button 
            variant="outline" 
            size="lg" 
            asChild 
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 group"
          >
            <Link to="/halls">
              View All Mandapams
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
