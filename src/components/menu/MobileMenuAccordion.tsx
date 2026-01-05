import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Leaf, Drumstick, Sparkles } from "lucide-react";
import { MenuCard } from "./MenuCard";
import { cn } from "@/lib/utils";

interface MenuPackage {
  id: string;
  name: string;
  items: string[];
  price: string;
  type?: string;
}

interface MobileMenuAccordionProps {
  title: string;
  sections: {
    id: string;
    label: string;
    icon: "veg" | "nonveg" | "special";
    packages: MenuPackage[];
    variant: "veg" | "nonveg" | "special";
  }[];
}

const iconMap = {
  veg: { icon: Leaf, color: "text-green-600", bg: "bg-green-500/20" },
  nonveg: { icon: Drumstick, color: "text-orange-600", bg: "bg-orange-500/20" },
  special: { icon: Sparkles, color: "text-primary", bg: "bg-primary/20" },
};

export function MobileMenuAccordion({ title, sections }: MobileMenuAccordionProps) {
  return (
    <div className="md:hidden">
      <Accordion type="single" collapsible className="w-full space-y-2">
        {sections.map((section) => {
          const IconConfig = iconMap[section.icon];
          const Icon = IconConfig.icon;
          
          return (
            <AccordionItem 
              key={section.id} 
              value={section.id}
              className="border border-border/50 rounded-lg overflow-hidden bg-card/50 backdrop-blur-sm"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", IconConfig.bg)}>
                    <Icon className={cn("h-4 w-4", IconConfig.color)} />
                  </div>
                  <span className="font-serif text-lg">{section.label}</span>
                  <span className="text-xs text-muted-foreground ml-auto mr-2">
                    {section.packages.length} packages
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4 pt-2">
                  {section.packages.map((menu, index) => (
                    <MenuCard
                      key={menu.id}
                      menu={menu}
                      index={index}
                      variant={section.variant}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
