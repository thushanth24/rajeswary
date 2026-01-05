import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Leaf, Drumstick, Crown, Award, Star, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MenuCardProps {
  menu: {
    id: string;
    name: string;
    items: string[];
    price: string;
    type?: string;
  };
  index: number;
  variant: "veg" | "nonveg" | "special";
  tier?: "silver" | "gold" | "platinum" | "special";
  onQuickView?: () => void;
}

const tierConfig = {
  silver: {
    badge: "Silver",
    bgClass: "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800",
    borderClass: "border-slate-300 dark:border-slate-600",
    iconBg: "bg-slate-200 dark:bg-slate-600",
    icon: Award,
    iconColor: "text-slate-500 dark:text-slate-300",
    ribbon: false,
  },
  gold: {
    badge: "Gold",
    bgClass: "bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 dark:from-amber-900/30 dark:to-yellow-900/20",
    borderClass: "border-secondary/50 ring-2 ring-secondary/20",
    iconBg: "bg-gradient-to-br from-secondary/30 to-accent/20",
    icon: Crown,
    iconColor: "text-secondary",
    ribbon: true,
  },
  platinum: {
    badge: "Platinum",
    bgClass: "bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 dark:from-violet-900/20 dark:to-purple-900/20",
    borderClass: "border-violet-300 dark:border-violet-600",
    iconBg: "bg-gradient-to-br from-violet-200 to-purple-200 dark:from-violet-700 dark:to-purple-700",
    icon: Star,
    iconColor: "text-violet-600 dark:text-violet-300",
    ribbon: false,
  },
  special: {
    badge: "Premium",
    bgClass: "bg-gradient-to-br from-primary/5 via-card to-secondary/10",
    borderClass: "border-primary/30",
    iconBg: "bg-gradient-to-br from-primary/20 to-secondary/20",
    icon: Star,
    iconColor: "text-primary",
    ribbon: false,
  },
};

const variantConfig = {
  veg: {
    label: "Vegetarian",
    labelColor: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-500/20",
    icon: Leaf,
    iconColor: "text-green-600",
    checkColor: "text-green-600",
  },
  nonveg: {
    label: "Non-Vegetarian",
    labelColor: "text-orange-600 dark:text-orange-400",
    iconBg: "bg-orange-500/20",
    icon: Drumstick,
    iconColor: "text-orange-600",
    checkColor: "text-orange-600",
  },
  special: {
    label: "Premium",
    labelColor: "text-primary",
    iconBg: "bg-primary/20",
    icon: Star,
    iconColor: "text-primary",
    checkColor: "text-secondary",
  },
};

export function getTierFromName(name: string): "silver" | "gold" | "platinum" | "special" {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("silver")) return "silver";
  if (lowerName.includes("gold")) return "gold";
  if (lowerName.includes("platinum")) return "platinum";
  return "special";
}

export function MenuCard({ menu, index, variant, tier: tierProp, onQuickView }: MenuCardProps) {
  const tier = tierProp || getTierFromName(menu.name);
  const tierStyle = tierConfig[tier];
  const variantStyle = variantConfig[variant === "special" && menu.type ? (menu.type === "veg" ? "veg" : "nonveg") : variant];
  
  const TierIcon = tierStyle.icon;
  const VariantIcon = variantStyle.icon;

  return (
    <Card 
      className={cn(
        "relative overflow-hidden animate-fade-in-up transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-2 hover:border-secondary/50",
        "group cursor-default",
        tierStyle.bgClass,
        tierStyle.borderClass,
        tier === "gold" && "glow-pulse"
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Most Popular Ribbon for Gold */}
      {tierStyle.ribbon && (
        <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-secondary via-accent to-secondary px-12 py-1.5 text-xs font-bold text-secondary-foreground shadow-lg z-10">
          Most Popular
        </div>
      )}

      {/* Tier Badge */}
      <div className="absolute top-3 left-3 z-10">
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
          tierStyle.iconBg,
          tierStyle.iconColor
        )}>
          <TierIcon className="h-3 w-3" />
          {tierStyle.badge}
        </div>
      </div>

      {/* Quick View Button */}
      {onQuickView && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
          onClick={onQuickView}
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}

      <CardHeader className="pb-2 pt-12">
        <div className="flex items-center gap-2 mb-2">
          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", variantStyle.iconBg)}>
            <VariantIcon className={cn("h-3 w-3", variantStyle.iconColor)} />
          </div>
          <span className={cn("text-xs font-medium uppercase tracking-wider", variantStyle.labelColor)}>
            {variantStyle.label}
          </span>
        </div>
        <CardTitle className="font-serif text-xl">
          <span className="text-gradient-gold">{menu.name}</span>
          <span className="block text-secondary font-sans text-lg mt-1 group-hover:scale-105 transition-transform">
            {menu.price}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-2">
          {menu.items.slice(0, 5).map((item) => (
            <li 
              key={item} 
              className="flex items-start gap-2 text-muted-foreground text-sm group-hover:text-foreground/80 transition-colors"
            >
              <Check className={cn("h-4 w-4 shrink-0 mt-0.5", variantStyle.checkColor)} />
              {item}
            </li>
          ))}
          {menu.items.length > 5 && (
            <li className="text-sm text-secondary font-medium">
              +{menu.items.length - 5} more items...
            </li>
          )}
        </ul>
        
        {onQuickView && (
          <Button 
            variant="link" 
            className="p-0 h-auto mt-3 text-secondary hover:text-secondary/80"
            onClick={onQuickView}
          >
            View full menu →
          </Button>
        )}
      </CardContent>

      {/* Decorative corner */}
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-secondary/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}
