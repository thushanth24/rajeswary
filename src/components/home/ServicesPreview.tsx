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

const serviceItems = [
  {
    icon: UtensilsCrossed,
    title: "Catering",
    description: "Multi-cuisine menus crafted by expert chefs",
  },
  {
    icon: Camera,
    title: "Photography",
    description: "Professional photo & video coverage",
  },
  {
    icon: Car,
    title: "Vehicles",
    description: "Luxury cars for your grand arrival",
  },
  {
    icon: Palette,
    title: "Decoration",
    description: "Stunning floral & thematic setups",
  },
  {
    icon: Music,
    title: "Entertainment",
    description: "DJ, sound & lighting solutions",
  },
  {
    icon: Users,
    title: "Coordination",
    description: "Dedicated event managers",
  },
];

export function ServicesPreview() {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-primary font-medium tracking-wider uppercase text-sm">
            Complete Solutions
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Beyond beautiful venues, we offer comprehensive services to make your 
            celebration seamless and stress-free.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceItems.map((service) => (
            <div
              key={service.title}
              className="group p-6 bg-background rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild>
            <Link to="/services">Explore All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
