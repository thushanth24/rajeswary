import { Layout } from "@/components/layout/Layout";
import { HallCard } from "@/components/ui/HallCard";
import { halls } from "@/data/halls";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

const HallsPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="text-primary font-medium tracking-wider uppercase text-sm">
            Our Venues
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            Wedding Halls
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of five stunning venues, each offering unique 
            ambiance and world-class amenities for your perfect celebration.
          </p>
        </div>
      </section>

      {/* Halls Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {halls.map((hall) => (
              <HallCard key={hall.id} hall={hall} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Found Your Perfect Venue?
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-xl mx-auto">
            Book a visit to see the halls in person, or start your booking process 
            right away.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/booking">
              <Calendar className="mr-2 h-5 w-5" />
              Start Booking
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default HallsPage;
