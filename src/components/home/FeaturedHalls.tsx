import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HallCard } from "@/components/ui/HallCard";
import { halls } from "@/data/halls";

export function FeaturedHalls() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-primary font-medium tracking-wider uppercase text-sm">
            Our Venues
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Exquisite Wedding Halls
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each of our five venues offers a unique atmosphere, from classic elegance 
            to modern sophistication, ensuring the perfect backdrop for your celebration.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {halls.slice(0, 3).map((hall, index) => (
            <HallCard key={hall.id} hall={hall} featured={index === 0} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link to="/halls">
              View All Halls
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
