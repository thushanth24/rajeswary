import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Leaf, Drumstick, Crown, Award, Star, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface MenuPackage {
  id: string;
  name: string;
  items: string[];
  price: string;
  type?: string;
}

interface MenuQuickViewModalProps {
  menu: MenuPackage | null;
  variant: "veg" | "nonveg" | "special";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tierConfig = {
  silver: {
    badge: "Silver Package",
    gradient: "from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600",
    icon: Award,
    iconColor: "text-slate-500",
  },
  gold: {
    badge: "Gold Package",
    gradient: "from-amber-200 via-yellow-200 to-amber-300 dark:from-amber-700 dark:to-yellow-600",
    icon: Crown,
    iconColor: "text-amber-600",
  },
  platinum: {
    badge: "Platinum Package",
    gradient: "from-violet-200 via-purple-200 to-indigo-300 dark:from-violet-700 dark:to-purple-600",
    icon: Star,
    iconColor: "text-violet-600",
  },
  special: {
    badge: "Premium Special",
    gradient: "from-primary/20 via-secondary/20 to-accent/20",
    icon: Star,
    iconColor: "text-primary",
  },
};

function getTierFromName(name: string): "silver" | "gold" | "platinum" | "special" {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("silver")) return "silver";
  if (lowerName.includes("gold")) return "gold";
  if (lowerName.includes("platinum")) return "platinum";
  return "special";
}

function categorizeItems(items: string[]): Record<string, string[]> {
  const categories: Record<string, string[]> = {
    "Starters": [],
    "Rice & Mains": [],
    "Curries": [],
    "Side Dishes": [],
    "Desserts": [],
    "Additional": [],
  };

  items.forEach((item) => {
    const lowerItem = item.toLowerCase();
    if (lowerItem.includes("starter") || lowerItem.includes("drink") || lowerItem.includes("juice") || lowerItem.includes("cake") || lowerItem.includes("laddu") || lowerItem.includes("patties") || lowerItem.includes("roll")) {
      categories["Starters"].push(item);
    } else if (lowerItem.includes("rice") || lowerItem.includes("soru") || lowerItem.includes("biriyani") || lowerItem.includes("saadam") || lowerItem.includes("noodles") || lowerItem.includes("idiyappa") || lowerItem.includes("kothu") || lowerItem.includes("puttu")) {
      categories["Rice & Mains"].push(item);
    } else if (lowerItem.includes("kari") || lowerItem.includes("curry") || lowerItem.includes("kuzhambu") || lowerItem.includes("masala") || lowerItem.includes("deval") || lowerItem.includes("moyu") || lowerItem.includes("kozhi") || lowerItem.includes("aattu") || lowerItem.includes("iraal") || lowerItem.includes("kanavai")) {
      categories["Curries"].push(item);
    } else if (lowerItem.includes("vadai") || lowerItem.includes("appalam") || lowerItem.includes("poriyal") || lowerItem.includes("sambal") || lowerItem.includes("salad") || lowerItem.includes("raitha") || lowerItem.includes("thayir") || lowerItem.includes("rasam") || lowerItem.includes("muttai") || lowerItem.includes("cutlet") || lowerItem.includes("chutney")) {
      categories["Side Dishes"].push(item);
    } else if (lowerItem.includes("dessert") || lowerItem.includes("ice cream") || lowerItem.includes("paayaasam") || lowerItem.includes("jelly") || lowerItem.includes("pudding") || lowerItem.includes("fruit") || lowerItem.includes("pazha")) {
      categories["Desserts"].push(item);
    } else {
      categories["Additional"].push(item);
    }
  });

  // Filter out empty categories
  return Object.fromEntries(
    Object.entries(categories).filter(([_, items]) => items.length > 0)
  );
}

const categoryIcons: Record<string, string> = {
  "Starters": "🥤",
  "Rice & Mains": "🍚",
  "Curries": "🍛",
  "Side Dishes": "🥗",
  "Desserts": "🍨",
  "Additional": "✨",
};

export function MenuQuickViewModal({ menu, variant, open, onOpenChange }: MenuQuickViewModalProps) {
  if (!menu) return null;

  const tier = getTierFromName(menu.name);
  const tierStyle = tierConfig[tier];
  const TierIcon = tierStyle.icon;
  const isVeg = variant === "veg" || (variant === "special" && menu.type === "veg");
  
  const categorizedItems = categorizeItems(menu.items);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-0 rounded-3xl border border-border/60 bg-card/90 backdrop-blur-xl shadow-2xl">
        {/* Hero Header */}
        <div className={cn("relative p-8 bg-gradient-to-br", tierStyle.gradient)}>
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/5" />
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-white/30 blur-3xl" />
          <div className="relative z-10 flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="secondary" className="gap-1.5 bg-background/70 border border-border/60">
              <TierIcon className={cn("h-3 w-3", tierStyle.iconColor)} />
              {tierStyle.badge}
            </Badge>
            <Badge variant="outline" className={cn("gap-1.5 bg-background/60", isVeg ? "border-green-500 text-green-700" : "border-orange-500 text-orange-700")}>
              {isVeg ? <Leaf className="h-3 w-3" /> : <Drumstick className="h-3 w-3" />}
              {isVeg ? "Vegetarian" : "Non-Vegetarian"}
            </Badge>
          </div>
          
          <DialogHeader>
            <DialogTitle className="font-serif text-3xl text-foreground relative z-10">
              {menu.name}
            </DialogTitle>
          </DialogHeader>
          
          
        </div>

        {/* Content */}
        <div className="p-6 bg-card/60 overflow-x-hidden">
          <h4 className="font-serif text-lg font-semibold mb-4 text-foreground">What's Included</h4>
          
          <div className="space-y-6">
            {Object.entries(categorizedItems).map(([category, items], categoryIndex) => (
              <motion.div 
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="rounded-2xl border border-border/60 bg-background/60 p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{categoryIcons[category]}</span>
                  <h5 className="font-medium text-foreground">{category}</h5>
                </div>
                <div className="grid gap-2 pl-8">
                  {items.map((item, itemIndex) => (
                    <motion.div 
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: categoryIndex * 0.1 + itemIndex * 0.05 }}
                      className="flex items-start gap-2"
                    >
                      <Check className={cn("h-4 w-4 mt-0.5 shrink-0", isVeg ? "text-green-600" : "text-orange-600")} />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1 gap-2 bg-gradient-to-r from-secondary via-accent to-secondary text-secondary-foreground border border-secondary/40 shadow-md shadow-secondary/30 hover:brightness-105">
              <Link to="/booking">
                Book with this Package
              </Link>
            </Button>
            <Button variant="outline" className="border-primary/30 hover:bg-primary/5" onClick={() => onOpenChange(false)}>
              Continue Browsing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
