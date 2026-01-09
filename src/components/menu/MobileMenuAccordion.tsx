import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MenuCard } from "./MenuCard";

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

export function MobileMenuAccordion({ title, sections }: MobileMenuAccordionProps) {
  return (
    <div className="md:hidden">
      <Accordion type="single" collapsible className="w-full space-y-2">
        {sections.map((section) => (
            <AccordionItem 
              key={section.id} 
              value={section.id}
              className="border border-border/50 rounded-lg overflow-hidden bg-card/50 backdrop-blur-sm"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <span
                    className={`font-serif text-lg px-2 py-0.5 rounded-md border ${
                      section.icon === "veg"
                        ? "border-green-500/40 text-green-700 bg-green-500/10"
                        : section.icon === "nonveg"
                        ? "border-orange-500/40 text-orange-700 bg-orange-500/10"
                        : "border-primary/40 text-primary bg-primary/10"
                    }`}
                  >
                    {section.label}
                  </span>
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
          ))}
      </Accordion>
    </div>
  );
}
