import { Layout } from "@/components/layout/Layout";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { services } from "@/data/services";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

const ServicesPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="text-primary font-medium tracking-wider uppercase text-sm">
            Complete Event Solutions
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            Our Services
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Beyond stunning venues, we offer a comprehensive suite of services to make 
            your celebration seamless, stress-free, and absolutely unforgettable.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Why Choose Our Services?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We bring together the best vendors and professionals to ensure your 
              event exceeds expectations.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">15+</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Years Experience</h3>
              <p className="text-sm text-muted-foreground">
                Over 15 years of creating magical celebrations
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">500+</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Events Hosted</h3>
              <p className="text-sm text-muted-foreground">
                Hundreds of happy couples trust us
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">50+</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Vendor Partners</h3>
              <p className="text-sm text-muted-foreground">
                Premium vendors for every service
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Ready to Plan Your Event?
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-xl mx-auto">
            All our services can be selected during the booking process. Start now 
            to customize your perfect celebration package.
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

export default ServicesPage;
