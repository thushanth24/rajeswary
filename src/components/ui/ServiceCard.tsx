import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Service } from "@/data/services";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
          {service.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {service.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {service.features.slice(0, 4).map((feature) => (
            <Badge key={feature} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
        
        <p className="text-xs text-primary font-medium">
          {service.bookingNote}
        </p>
      </CardContent>
    </Card>
  );
}
