import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Priya & Rahul",
    event: "Wedding Reception",
    text: "Celebration Halls made our wedding absolutely magical. The Grand Ballroom was breathtaking, and the staff attention to detail was incredible. Highly recommend!",
    rating: 5,
  },
  {
    name: "Sneha & Amit",
    event: "Engagement Ceremony",
    text: "The Crystal Palace was perfect for our intimate engagement. The team handled everything from decor to catering flawlessly. Our guests were amazed!",
    rating: 5,
  },
  {
    name: "Kavitha & Suresh",
    event: "Wedding Ceremony",
    text: "We chose the Sunset Terrace for our garden wedding. The ambiance was exactly what we dreamed of. The coordination team made everything stress-free.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-primary font-medium tracking-wider uppercase text-sm">
            Happy Couples
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real stories from couples who celebrated their special moments with us.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="border-border">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <p className="text-foreground mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">
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
                        className="h-4 w-4 fill-primary text-primary"
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
