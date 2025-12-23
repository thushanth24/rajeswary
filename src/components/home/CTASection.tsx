import { Link } from "react-router-dom";
import { Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          Ready to Book Your Special Day?
        </h2>
        <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-8">
          Take the first step towards your dream celebration. Check availability, 
          customize your package, and secure your date today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild className="text-base">
            <Link to="/booking">
              <Calendar className="mr-2 h-5 w-5" />
              Book Your Event
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-base bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
            <a href="tel:+919876543210">
              <Phone className="mr-2 h-5 w-5" />
              Call Us Now
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
