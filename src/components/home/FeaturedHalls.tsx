import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HallCard } from "@/components/ui/HallCard";
import { halls } from "@/data/halls";

export function FeaturedHalls() {
  return (
    <section className="py-20 bg-background lotus-bg relative">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-secondary/20 text-4xl animate-rotate-slow hidden lg:block">
        ❈
      </div>
      <div className="absolute bottom-10 right-10 text-secondary/20 text-4xl animate-rotate-slow hidden lg:block" style={{ animationDirection: "reverse" }}>
        ❈
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          {/* Decorative header */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-secondary" />
            <span className="text-secondary text-2xl">🪔</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-secondary" />
          </div>
          
          <span className="text-secondary font-medium tracking-widest uppercase text-sm">
            Our Sacred Venues
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Exquisite Wedding <span className="text-primary">Mandapams</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each of our five venues is designed with authentic Tamil Hindu traditions, 
            featuring temple-inspired architecture, traditional brass lamps, and sacred spaces 
            for your wedding rituals.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {halls.slice(0, 3).map((hall, index) => (
            <div 
              key={hall.id} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <HallCard hall={hall} featured={index === 0} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            asChild 
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <Link to="/halls">
              View All Mandapams
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
