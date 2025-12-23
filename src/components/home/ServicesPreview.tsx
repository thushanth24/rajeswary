import { Link } from "react-router-dom";
import { 
  UtensilsCrossed, 
  Camera, 
  Car, 
  Palette, 
  Music, 
  Users 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";

const serviceItems = [
  {
    icon: UtensilsCrossed,
    title: "Traditional Catering",
    description: "Authentic South Indian cuisine with banana leaf service",
  },
  {
    icon: Camera,
    title: "Photography",
    description: "Capture every sacred ritual and joyous moment",
  },
  {
    icon: Car,
    title: "Bridal Vehicles",
    description: "Decorated cars for the ceremonial procession",
  },
  {
    icon: Palette,
    title: "Mandapam Decoration",
    description: "Traditional kolam, flowers & brass decorations",
  },
  {
    icon: Music,
    title: "Nadaswaram & Music",
    description: "Traditional temple music & modern entertainment",
  },
  {
    icon: Users,
    title: "Pandit Services",
    description: "Experienced priests for traditional ceremonies",
  },
];

export function ServicesPreview() {
  return (
    <section className="py-20 bg-card relative overflow-hidden">
      {/* Decorative borders */}
      <DecorativeBorder variant="both" />
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 paisley-bg opacity-40" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-1/4 text-secondary/15 text-6xl animate-float hidden lg:block">
        🪔
      </div>
      <div className="absolute bottom-20 right-1/4 text-secondary/15 text-6xl animate-float-slow hidden lg:block">
        🪷
      </div>
      
      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-secondary animate-sparkle">✦</span>
            <span className="text-secondary font-medium tracking-widest uppercase text-sm">
              Complete Solutions
            </span>
            <span className="text-secondary animate-sparkle" style={{ animationDelay: "0.75s" }}>✦</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4 animate-fade-in-up">
            Everything for Your <span className="text-primary">Sacred Union</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            From muhurtham consultation to the final aarti, we provide comprehensive 
            services rooted in Jaffna Hindu traditions.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceItems.map((service, index) => (
            <div
              key={service.title}
              className="group p-6 bg-background rounded-lg border-2 border-border hover:border-primary/50 hover:shadow-traditional transition-all duration-500 animate-fade-in-up opacity-0 cursor-pointer"
              style={{ 
                animationDelay: `${0.4 + index * 0.1}s`,
                animationFillMode: "forwards"
              }}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-gold-glow transition-all duration-500">
                <service.icon className="h-7 w-7 text-primary group-hover:animate-swing" />
              </div>
              <h3 className="font-serif font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
              {/* Decorative corner on hover */}
              <div className="absolute top-3 right-3 text-secondary/0 group-hover:text-secondary/40 transition-all duration-500 text-lg">
                ❈
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: "1s" }}>
          <Button 
            asChild 
            className="bg-primary hover:bg-primary/90 shadow-traditional hover:shadow-gold-glow transition-all duration-300 hover:scale-105 group"
          >
            <Link to="/services">
              <span className="mr-2 group-hover:animate-swing">🪷</span>
              Explore All Services
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
