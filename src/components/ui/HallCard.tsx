import { Link } from "react-router-dom";
import { Users, Car, Snowflake, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HallAvailabilityIndicator } from "@/components/ui/HallAvailabilityIndicator";
import type { Hall } from "@/data/halls";

interface HallCardProps {
  hall: Hall;
  featured?: boolean;
  showAvailability?: boolean;
}

export function HallCard({ hall, featured = false, showAvailability = false }: HallCardProps) {
  return (
    <Card className="group overflow-hidden border-2 border-border hover:border-primary/40 hover:shadow-traditional transition-all duration-300 bg-card">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={hall.image}
          alt={hall.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {featured && (
          <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground border-0">
            ✦ Featured
          </Badge>
        )}
        
        {/* Decorative corner */}
        <div className="absolute top-4 right-4 text-secondary/80 text-xl opacity-0 group-hover:opacity-100 transition-opacity">
          🪔
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {hall.name}
          </h3>
          <span className="text-sm font-semibold text-primary whitespace-nowrap shrink-0">
            {hall.priceRange}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {hall.shortDescription}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-foreground mb-4">
          <Users className="h-4 w-4 text-primary" />
          <span>{hall.capacity.min} - {hall.capacity.max} guests</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {hall.facilities.ac && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-primary/5 border border-primary/20 px-2 py-1 rounded-md">
              <Snowflake className="h-3 w-3 text-primary" />
              AC
            </div>
          )}
          {hall.facilities.parking && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-primary/5 border border-primary/20 px-2 py-1 rounded-md">
              <Car className="h-3 w-3 text-primary" />
              Parking
            </div>
          )}
          {hall.facilities.dining && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-primary/5 border border-primary/20 px-2 py-1 rounded-md">
              <UtensilsCrossed className="h-3 w-3 text-primary" />
              Dining
            </div>
          )}
        </div>

        {showAvailability && (
          <HallAvailabilityIndicator hallSlug={hall.slug} />
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0 flex gap-3">
        <Button variant="outline" asChild className="flex-1 border-primary/30 hover:border-primary hover:bg-primary/5">
          <Link to={`/halls/${hall.slug}`}>View Details</Link>
        </Button>
        <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
          <Link to={`/booking?hall=${hall.id}`}>
            <span className="mr-1">🪷</span> Book
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
