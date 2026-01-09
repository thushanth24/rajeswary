import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Award, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MenuCardProps {
  menu: {
    id: string;
    name: string;
    items: string[];
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
    bgClass: "bg-gradient-to-br from-slate-50/90 via-card to-slate-100/80",
    borderClass: "border-slate-200/70",
    iconBg: "bg-muted/40",
    icon: Award,
    iconColor: "text-muted-foreground",
    ribbon: false,
    accent: "from-slate-300/30 via-transparent to-transparent",
    glow: "shadow-slate-200/60",
  },
  gold: {
    badge: "Gold",
    bgClass: "bg-gradient-to-br from-amber-50/90 via-card to-yellow-100/80",
    borderClass: "border-secondary/30 ring-1 ring-secondary/20",
    iconBg: "bg-secondary/15",
    icon: Crown,
    iconColor: "text-secondary",
    ribbon: true,
    accent: "from-secondary/35 via-accent/10 to-transparent",
    glow: "shadow-secondary/40",
  },
  platinum: {
    badge: "Platinum",
    bgClass: "bg-gradient-to-br from-indigo-50/90 via-card to-violet-100/80",
    borderClass: "border-violet-200/70",
    iconBg: "bg-primary/10",
    icon: Star,
    iconColor: "text-primary",
    ribbon: false,
    accent: "from-violet-300/30 via-accent/10 to-transparent",
    glow: "shadow-violet-200/60",
  },
  special: {
    badge: "Premium",
    bgClass: "bg-gradient-to-br from-rose-50/90 via-card to-amber-50/80",
    borderClass: "border-primary/30",
    iconBg: "bg-primary/10",
    icon: Star,
    iconColor: "text-primary",
    ribbon: false,
    accent: "from-primary/25 via-secondary/10 to-transparent",
    glow: "shadow-amber-200/60",
  },
};

const variantConfig = {
  veg: {
    label: "Vegetarian",
    labelColor: "text-green-600 dark:text-green-400",
    checkColor: "text-green-600",
  },
  nonveg: {
    label: "Non-Vegetarian",
    labelColor: "text-orange-600 dark:text-orange-400",
    checkColor: "text-orange-600",
  },
  special: {
    label: "Premium",
    labelColor: "text-primary",
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

  return (
    <Card 
      className={cn(
        "relative overflow-hidden animate-fade-in-up transition-all duration-300",
        "rounded-3xl border shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:border-primary/40",
        "group cursor-default",
        tierStyle.bgClass,
        tierStyle.borderClass
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Modern glass layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/10 opacity-70" />
      {/* Accent sweep */}
      <div className={cn("absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl", tierStyle.glow)} />
      <div className={cn("absolute top-0 left-0 h-1 w-full bg-gradient-to-r", tierStyle.accent)} />
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

      <CardHeader className="pb-2 pt-12 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn("text-xs font-medium uppercase tracking-wider", variantStyle.labelColor)}>
            {variantStyle.label}
          </span>
        </div>
        <CardTitle className="font-serif text-xl text-foreground tracking-tight">
          {menu.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10">
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
