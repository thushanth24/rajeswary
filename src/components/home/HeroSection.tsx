import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-wedding.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Elegant wedding hall"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-block text-primary font-medium mb-4 tracking-wider uppercase text-sm">
            Premium Wedding Venues
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-card mb-6 leading-tight">
            Where Dreams
            <br />
            <span className="text-primary">Become Celebrations</span>
          </h1>
          <p className="text-lg text-card/90 mb-8 max-w-xl">
            Discover our collection of 5 exquisite wedding halls, each designed to 
            make your special day truly unforgettable. From grand ballrooms to 
            enchanting gardens.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="text-base">
              <Link to="/booking">
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Date
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base bg-card/10 border-card/30 text-card hover:bg-card/20 hover:text-card">
              <Link to="/halls">
                Explore Venues
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 flex gap-8 md:gap-12">
            <div>
              <p className="text-3xl font-bold text-card">5</p>
              <p className="text-sm text-card/70">Luxury Halls</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-card">800+</p>
              <p className="text-sm text-card/70">Max Capacity</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-card">15+</p>
              <p className="text-sm text-card/70">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
