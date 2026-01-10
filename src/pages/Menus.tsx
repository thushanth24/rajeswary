import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { menus } from "@/data/services";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FloatingElements } from "@/components/animations/FloatingElements";
import { RangoliPattern } from "@/components/animations/RangoliPattern";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";
import { CTASection } from "@/components/home/CTASection";
import { MenuCard } from "@/components/menu/MenuCard";
import { MobileMenuAccordion } from "@/components/menu/MobileMenuAccordion";
import { MenuQuickViewModal } from "@/components/menu/MenuQuickViewModal";
import { useLanguage } from "@/contexts/LanguageContext";
import menuVideo from "@/assets/wedding-food-display-video.mp4";

interface MenuPackage {
  id: string;
  name: string;
  items: string[];
  price: string;
  type?: string;
}

const MenusPage = () => {
  const { t } = useLanguage();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuPackage | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<"veg" | "nonveg" | "special">("veg");

  const handleQuickView = (menu: MenuPackage, variant: "veg" | "nonveg" | "special") => {
    setSelectedMenu(menu);
    setSelectedVariant(variant);
    setQuickViewOpen(true);
  };

  const menuSections = [
    {
      id: "pubert",
      tabLabel: t("menus.pubert.title"),
      title: t("menus.pubert.title"),
      highlight: t("menus.pubert.highlight"),
      packagesLabel: t("menus.pubert.packages"),
      desc: t("menus.pubert.desc"),
      hasSpecial: true,
      sectionBg: "bg-background",
      tabsListBg: "bg-card",
      mobileTitle: `${t("menus.pubert.title")} ${t("menus.pubert.highlight")}`,
      variants: {
        veg: menus.pubertVeg,
        nonveg: menus.pubertNonVeg,
        special: menus.pubertSpecial,
      },
    },
    {
      id: "dinner",
      tabLabel: t("menus.dinner.title"),
      title: t("menus.dinner.title"),
      highlight: t("menus.dinner.highlight"),
      desc: t("menus.dinner.desc"),
      hasSpecial: true,
      sectionBg: "bg-card",
      tabsListBg: "bg-background",
      mobileTitle: t("menus.dinner.title"),
      specialLayout: "single",
      variants: {
        veg: menus.dinnerVeg,
        nonveg: menus.dinnerNonVeg,
        special: menus.dinnerSpecial,
      },
    },
    {
      id: "wedding",
      tabLabel: t("menus.wedding.title"),
      title: t("menus.wedding.title"),
      highlight: t("menus.wedding.highlight"),
      desc: t("menus.wedding.desc"),
      hasSpecial: true,
      sectionBg: "bg-background",
      tabsListBg: "bg-card",
      mobileTitle: t("menus.wedding.title"),
      variants: {
        veg: menus.weddingVeg,
        nonveg: menus.weddingNonVeg,
        special: menus.weddingSpecial,
      },
    },
    {
      id: "registration",
      tabLabel: t("menus.registration.title"),
      title: t("menus.registration.title"),
      highlight: t("menus.registration.highlight"),
      desc: t("menus.registration.desc"),
      hasSpecial: false,
      sectionBg: "bg-card",
      tabsListBg: "bg-background",
      mobileTitle: t("menus.registration.title"),
      variants: {
        veg: menus.registrationVeg,
        nonveg: menus.registrationNonVeg,
      },
    },
  ] as const;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-secondary/20 via-card to-background overflow-hidden">
        <FloatingElements type="petals" density="low" />
        <RangoliPattern position="center" size="lg" opacity={0.08} />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-secondary" />
            <span className="text-secondary text-2xl">🪔</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-secondary" />
          </div>
          
          <span className="text-secondary font-medium tracking-wider uppercase text-sm animate-fade-in">
            ✦ {t("menus.subtitle")} ✦
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6 animate-fade-in-up">
            {t("menus.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t("menus.description")}
          </p>
          
          <div className="divider-ornate mt-8" />
        </div>
      </section>

      {/* Event Selection Tabs */}
      <Tabs defaultValue="pubert" className="w-full">
        <div className="bg-background">
          <div className="container mx-auto px-4 lg:px-8 py-6">
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-2 md:grid-cols-4 bg-card/90 backdrop-blur rounded-xl border border-border/70 p-1 gap-2 md:gap-0 mb-10 md:mb-0 shadow-sm">
              {menuSections.map((section) => (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="font-serif text-xs sm:text-sm py-2.5 md:py-3 rounded-lg border border-border/60 bg-background/80 hover:bg-background/95 transition-colors tracking-wide data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:border-secondary"
                >
                  {section.tabLabel}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {menuSections.map((section) => {
          const accordionSections = [
            {
              id: `${section.id}-veg`,
              label: t("menus.veg"),
              icon: "veg" as const,
              packages: section.variants.veg,
              variant: "veg" as const,
            },
            {
              id: `${section.id}-nonveg`,
              label: t("menus.nonveg"),
              icon: "nonveg" as const,
              packages: section.variants.nonveg,
              variant: "nonveg" as const,
            },
            ...(section.hasSpecial && section.variants.special
              ? [
                  {
                    id: `${section.id}-special`,
                    label: t("menus.special"),
                    icon: "special" as const,
                    packages: section.variants.special,
                    variant: "special" as const,
                  },
                ]
              : []),
          ];

          return (
            <TabsContent key={section.id} value={section.id}>
              <section className={`relative py-20 ${section.sectionBg} overflow-hidden`}>
                <DecorativeBorder position="top" />
                <div className="absolute inset-0 paisley-bg opacity-20" />

                <div className="container relative z-10 mx-auto px-4 lg:px-8">
                  <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl font-bold text-foreground mt-4 mb-2">
                      {section.title}{" "}
                      <span className="text-gradient-gold">{section.highlight}</span>
                      {section.packagesLabel ? ` ${section.packagesLabel}` : ""}
                    </h2>
                    <p className="text-muted-foreground">{section.desc}</p>
                  </div>

                  {/* Desktop Tabs */}
                  <div className="hidden md:block">
                    <Tabs defaultValue={`${section.id}-veg`} className="w-full">
                      <TabsList
                        className={`grid w-full mx-auto mb-12 border border-border ${
                          section.hasSpecial ? "max-w-2xl grid-cols-3" : "max-w-md grid-cols-2"
                        } ${section.tabsListBg}`}
                      >
                        <TabsTrigger
                          value={`${section.id}-veg`}
                          className="font-serif border border-transparent text-green-700 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-green-600"
                        >
                          {t("menus.veg")}
                        </TabsTrigger>
                        <TabsTrigger
                          value={`${section.id}-nonveg`}
                          className="font-serif border border-transparent text-orange-700 data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:border-orange-600"
                        >
                          {t("menus.nonveg")}
                        </TabsTrigger>
                        {section.hasSpecial && (
                          <TabsTrigger
                            value={`${section.id}-special`}
                            className="font-serif border border-transparent text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary"
                          >
                            {t("menus.special")}
                          </TabsTrigger>
                        )}
                      </TabsList>

                      <TabsContent value={`${section.id}-veg`}>
                        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
                          {section.variants.veg.map((menu, index) => (
                            <MenuCard
                              key={menu.id}
                              menu={menu}
                              index={index}
                              variant="veg"
                              onQuickView={() => handleQuickView(menu, "veg")}
                            />
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value={`${section.id}-nonveg`}>
                        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
                          {section.variants.nonveg.map((menu, index) => (
                            <MenuCard
                              key={menu.id}
                              menu={menu}
                              index={index}
                              variant="nonveg"
                              onQuickView={() => handleQuickView(menu, "nonveg")}
                            />
                          ))}
                        </div>
                      </TabsContent>

                      {section.hasSpecial && section.variants.special && (
                        <TabsContent value={`${section.id}-special`}>
                          <div className={section.specialLayout === "single" ? "max-w-xl mx-auto" : "grid gap-6 md:grid-cols-3 max-w-6xl mx-auto"}>
                            {section.variants.special.map((menu, index) => (
                              <MenuCard
                                key={menu.id}
                                menu={menu}
                                index={index}
                                variant="special"
                                onQuickView={() => handleQuickView(menu, "special")}
                              />
                            ))}
                          </div>
                        </TabsContent>
                      )}
                    </Tabs>
                  </div>

                  {/* Mobile Accordion */}
                  <MobileMenuAccordion title={section.mobileTitle} sections={accordionSections} />
                </div>

                <DecorativeBorder position="bottom" />
              </section>
            </TabsContent>
          );
        })}
      </Tabs>

      <CTASection 
        subtitle={t("menus.cta.subtitle")}
        title={t("menus.cta.title")}
        highlight={t("menus.cta.highlight")}
        description={t("menus.cta.description")}
        primaryButtonText={t("menus.cta.button")}
        videos={[menuVideo]}
      />

      {/* Quick View Modal */}
      <MenuQuickViewModal
        menu={selectedMenu}
        variant={selectedVariant}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </Layout>
  );
};

export default MenusPage;




