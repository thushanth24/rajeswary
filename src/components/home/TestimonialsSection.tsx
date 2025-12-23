import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Priya & Karthik",
    event: "Traditional Wedding",
    text: "Our wedding at Celebration Halls was exactly as we dreamed - authentic Jaffna traditions, beautiful mandapam decorations with jasmine and marigolds. The team understood our cultural requirements perfectly.",
    rating: 5,
  },
  {
    name: "Lakshmi & Suresh",
    event: "Hindu Wedding Ceremony",
    text: "The Grand Mandapam was breathtaking with traditional brass lamps and kolam designs. The priests arranged by them performed the rituals beautifully. Our families were deeply impressed.",
    rating: 5,
  },
  {
    name: "Meena & Ravi",
    event: "Reception Ceremony",
    text: "From the nadaswaram welcome to the banana leaf dinner, everything was perfectly traditional. They truly understand Jaffna Hindu customs and made our reception unforgettable.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-background relative">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
      
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-secondary" />
            <span className="text-secondary text-2xl">🪷</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-secondary" />
          </div>
          <span className="text-secondary font-medium tracking-widest uppercase text-sm">
            Blessed Couples
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Sacred <span className="text-primary">Testimonials</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from couples who celebrated their sacred union with us in the 
            authentic Jaffna Hindu tradition.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name} 
              className="border-2 border-border hover:border-primary/30 transition-all duration-300 hover:shadow-traditional animate-fade-in-up group"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardContent className="p-6 relative">
                {/* Decorative corner */}
                <div className="absolute top-4 right-4 text-secondary/30 group-hover:text-secondary/50 transition-colors">
                  ❈
                </div>
                
                <Quote className="h-8 w-8 text-secondary/40 mb-4" />
                <p className="text-foreground mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="font-serif font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.event}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-secondary text-secondary"
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
