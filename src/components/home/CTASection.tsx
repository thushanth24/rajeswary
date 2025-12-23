import { Link } from "react-router-dom";
import { Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary/90 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20c11.046 0 20-8.954 20-20s-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 text-secondary/30 text-5xl animate-float hidden md:block">
        🪔
      </div>
      <div className="absolute bottom-10 right-10 text-secondary/30 text-5xl animate-float hidden md:block" style={{ animationDelay: "2s" }}>
        🪷
      </div>
      
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-secondary via-accent to-secondary" />
      
      <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-secondary text-2xl">✦</span>
            <span className="text-secondary/80 font-medium tracking-widest uppercase text-sm">
              Begin Your Sacred Journey
            </span>
            <span className="text-secondary text-2xl">✦</span>
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            Ready to Book Your <span className="text-secondary">Muhurtham</span>?
          </h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-8 text-lg">
            Take the first step towards your dream traditional wedding. Check availability, 
            customize your ceremonies, and secure your auspicious date today.
          </p>
          
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-secondary/50" />
            <span className="text-secondary">🪷</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-secondary/50" />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              asChild 
              className="text-base bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-gold-glow transition-all duration-300 hover:scale-105"
            >
              <Link to="/booking">
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Sacred Day
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className="text-base bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300"
            >
              <a href="tel:+919876543210">
                <Phone className="mr-2 h-5 w-5" />
                Speak With Us
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-secondary via-accent to-secondary" />
    </section>
  );
}
