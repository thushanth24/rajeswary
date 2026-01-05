import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calculator, Sun, Moon, Heart, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PricingCalculatorProps {
  className?: string;
}

type MenuSection = "pubert" | "dinner" | "wedding" | "registration";

const menuSections: { id: MenuSection; label: string; icon: React.ElementType }[] = [
  { id: "pubert", label: "Pubert (Lunch)", icon: Sun },
  { id: "dinner", label: "Dinner", icon: Moon },
  { id: "wedding", label: "Wedding", icon: Heart },
  { id: "registration", label: "Registration", icon: FileText },
];

const packagesBySection: Record<MenuSection, { name: string; price: number }[]> = {
  pubert: [
    { name: "Silver Veg", price: 1000 },
    { name: "Gold Veg", price: 1200 },
    { name: "Platinum Veg", price: 1500 },
    { name: "Silver Non-Veg", price: 1200 },
    { name: "Gold Non-Veg", price: 1700 },
    { name: "Platinum Non-Veg", price: 2300 },
  ],
  dinner: [
    { name: "Silver Veg", price: 900 },
    { name: "Gold Veg", price: 1300 },
    { name: "Platinum Veg", price: 1600 },
    { name: "Silver Non-Veg", price: 1200 },
    { name: "Gold Non-Veg", price: 1700 },
    { name: "Platinum Non-Veg", price: 2200 },
  ],
  wedding: [
    { name: "Silver Veg", price: 1000 },
    { name: "Gold Veg", price: 1200 },
    { name: "Platinum Veg", price: 1500 },
    { name: "Silver Non-Veg", price: 1200 },
    { name: "Gold Non-Veg", price: 1700 },
    { name: "Platinum Non-Veg", price: 2300 },
  ],
  registration: [
    { name: "Silver Veg", price: 1000 },
    { name: "Gold Veg", price: 1200 },
    { name: "Platinum Veg", price: 1500 },
    { name: "Silver Non-Veg", price: 1200 },
    { name: "Gold Non-Veg", price: 1700 },
    { name: "Platinum Non-Veg", price: 2300 },
  ],
};

export function PricingCalculator({ className }: PricingCalculatorProps) {
  const [guestCount, setGuestCount] = useState([100]);
  const [activeSection, setActiveSection] = useState<MenuSection>("pubert");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const currentPackages = packagesBySection[activeSection];

  return (
    <Card className={`card-traditional overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-secondary/30 to-accent/20 rounded-full flex items-center justify-center">
            <Calculator className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold text-foreground">Pricing Calculator</h3>
            <p className="text-sm text-muted-foreground">Estimate your total cost</p>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {menuSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  activeSection === section.id
                    ? "bg-secondary text-secondary-foreground shadow-md"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{section.label}</span>
                <span className="sm:hidden">{section.id === "pubert" ? "Lunch" : section.id === "registration" ? "Reg." : section.label}</span>
              </button>
            );
          })}
        </div>

        {/* Guest Count Slider */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-secondary" />
              Number of Guests
            </label>
            <motion.span 
              key={guestCount[0]}
              initial={{ scale: 1.2, color: "hsl(var(--secondary))" }}
              animate={{ scale: 1, color: "hsl(var(--foreground))" }}
              className="text-2xl font-bold font-serif"
            >
              {guestCount[0]}
            </motion.span>
          </div>
          <Slider
            value={guestCount}
            onValueChange={setGuestCount}
            min={50}
            max={500}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>50</span>
            <span>250</span>
            <span>500</span>
          </div>
        </div>

        {/* Price Estimates Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {currentPackages.map((pkg) => {
              const total = pkg.price * guestCount[0];
              return (
                <motion.div
                  key={`${activeSection}-${pkg.name}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 rounded-lg bg-muted/50 border border-border/50 hover:border-secondary/50 transition-colors"
                >
                  <p className="text-xs font-medium text-muted-foreground mb-1">{pkg.name}</p>
                  <motion.p 
                    key={total}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="text-sm font-bold text-foreground"
                  >
                    {formatPrice(total)}
                  </motion.p>
                  <p className="text-[10px] text-muted-foreground">
                    @ {formatPrice(pkg.price)}/person
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          * Prices are approximate. Final cost may vary based on customizations.
        </p>
      </CardContent>
    </Card>
  );
}
