import { Link } from "react-router-dom";
import { Users, Car, Snowflake, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Hall } from "@/data/halls";

interface HallCardProps {
  hall: Hall;
  featured?: boolean;
}

export function HallCard({ hall, featured = false }: HallCardProps) {
  return (
    <Card className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={hall.image}
          alt={hall.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {featured && (
          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}
      </div>
      <CardContent className="p-6">
        <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
          {hall.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {hall.shortDescription}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-foreground mb-4">
          <Users className="h-4 w-4 text-primary" />
          <span>{hall.capacity.min} - {hall.capacity.max} guests</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {hall.facilities.ac && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              <Snowflake className="h-3 w-3" />
              AC
            </div>
          )}
          {hall.facilities.parking && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              <Car className="h-3 w-3" />
              Parking
            </div>
          )}
          {hall.facilities.dining && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              <UtensilsCrossed className="h-3 w-3" />
              Dining
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex gap-3">
        <Button variant="outline" asChild className="flex-1">
          <Link to={`/halls/${hall.slug}`}>View Details</Link>
        </Button>
        <Button asChild className="flex-1">
          <Link to={`/booking?hall=${hall.id}`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
