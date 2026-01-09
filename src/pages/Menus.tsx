import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { menus } from "@/data/services";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FloatingElements } from "@/components/animations/FloatingElements";
import { RangoliPattern } from "@/components/animations/RangoliPattern";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";
import { CTASection } from "@/components/home/CTASection";
import { MenuCard } from "@/components/menu/MenuCard";
import { MenuSectionDivider } from "@/components/menu/MenuSectionDivider";
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

  

      {/* Pubert (Lunch) Section */}
      <section className="relative py-20 bg-background overflow-hidden">
        <DecorativeBorder position="top" />
        <div className="absolute inset-0 paisley-bg opacity-20" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mt-4 mb-2">
              {t("menus.pubert.title")} <span className="text-gradient-gold">{t("menus.pubert.highlight")}</span> {t("menus.pubert.packages")}
            </h2>
            <p className="text-muted-foreground">{t("menus.pubert.desc")}</p>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:block">
            <Tabs defaultValue="pubert-veg" className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-12 bg-card border border-border">
                <TabsTrigger value="pubert-veg" className="font-serif border border-transparent text-green-700 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-green-600">
                  {t("menus.veg")}
                </TabsTrigger>
                <TabsTrigger value="pubert-nonveg" className="font-serif border border-transparent text-orange-700 data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:border-orange-600">
                  {t("menus.nonveg")}
                </TabsTrigger>
                <TabsTrigger value="pubert-special" className="font-serif border border-transparent text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  {t("menus.special")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pubert-veg">
                <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
                  {menus.pubertVeg.map((menu, index) => (
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

              <TabsContent value="pubert-nonveg">
                <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
                  {menus.pubertNonVeg.map((menu, index) => (
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

              <TabsContent value="pubert-special">
                <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
                  {menus.pubertSpecial.map((menu, index) => (
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
            </Tabs>
          </div>

          {/* Mobile Accordion */}
          <MobileMenuAccordion
            title={`${t("menus.pubert.title")} ${t("menus.pubert.highlight")}`}
            sections={[
              { id: "pubert-veg", label: t("menus.veg"), icon: "veg", packages: menus.pubertVeg, variant: "veg" },
              { id: "pubert-nonveg", label: t("menus.nonveg"), icon: "nonveg", packages: menus.pubertNonVeg, variant: "nonveg" },
              { id: "pubert-special", label: t("menus.special"), icon: "special", packages: menus.pubertSpecial, variant: "special" },
            ]}
          />
        </div>
      </section>

      {/* Decorative Divider */}
      <MenuSectionDivider />

      {/* Dinner Section */}
      <section className="relative py-20 bg-card overflow-hidden">
        <div className="absolute inset-0 paisley-bg opacity-20" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mt-4 mb-2">
              {t("menus.dinner.title")} <span className="text-gradient-gold">{t("menus.dinner.highlight")}</span>
            </h2>
            <p className="text-muted-foreground">{t("menus.dinner.desc")}</p>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:block">
            <Tabs defaultValue="dinner-veg" className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-12 bg-background border border-border">
                <TabsTrigger value="dinner-veg" className="font-serif border border-transparent text-green-700 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-green-600">
                  {t("menus.veg")}
                </TabsTrigger>
                <TabsTrigger value="dinner-nonveg" className="font-serif border border-transparent text-orange-700 data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:border-orange-600">
                  {t("menus.nonveg")}
                </TabsTrigger>
                <TabsTrigger value="dinner-special" className="font-serif border border-transparent text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  {t("menus.special")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dinner-veg">
                <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
                  {menus.dinnerVeg.map((menu, index) => (
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

              <TabsContent value="dinner-nonveg">
                <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
                  {menus.dinnerNonVeg.map((menu, index) => (
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

              <TabsContent value="dinner-special">
                <div className="max-w-xl mx-auto">
                  {menus.dinnerSpecial.map((menu, index) => (
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
            </Tabs>
          </div>

          {/* Mobile Accordion */}
          <MobileMenuAccordion
            title={t("menus.dinner.title")}
            sections={[
              { id: "dinner-veg", label: t("menus.veg"), icon: "veg", packages: menus.dinnerVeg, variant: "veg" },
              { id: "dinner-nonveg", label: t("menus.nonveg"), icon: "nonveg", packages: menus.dinnerNonVeg, variant: "nonveg" },
              { id: "dinner-special", label: t("menus.special"), icon: "special", packages: menus.dinnerSpecial, variant: "special" },
            ]}
          />
        </div>
        
        <DecorativeBorder position="bottom" />
      </section>

      {/* Decorative Divider */}
      <MenuSectionDivider />

      {/* Wedding Section */}
      <section className="relative py-20 bg-background overflow-hidden">
        <div className="absolute inset-0 paisley-bg opacity-20" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mt-4 mb-2">
              {t("menus.wedding.title")} <span className="text-gradient-gold">{t("menus.wedding.highlight")}</span>
            </h2>
            <p className="text-muted-foreground">{t("menus.wedding.desc")}</p>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:block">
            <Tabs defaultValue="wedding-veg" className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-12 bg-card border border-border">
                <TabsTrigger value="wedding-veg" className="font-serif border border-transparent text-green-700 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-green-600">
                  {t("menus.veg")}
                </TabsTrigger>
                <TabsTrigger value="wedding-nonveg" className="font-serif border border-transparent text-orange-700 data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:border-orange-600">
                  {t("menus.nonveg")}
                </TabsTrigger>
                <TabsTrigger value="wedding-special" className="font-serif border border-transparent text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  {t("menus.special")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="wedding-veg">
                <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
                  {menus.weddingVeg.map((menu, index) => (
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

              <TabsContent value="wedding-nonveg">
                <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
                  {menus.weddingNonVeg.map((menu, index) => (
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

              <TabsContent value="wedding-special">
                <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
                  {menus.weddingSpecial.map((menu, index) => (
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
            </Tabs>
          </div>

          {/* Mobile Accordion */}
          <MobileMenuAccordion
            title={t("menus.wedding.title")}
            sections={[
              { id: "wedding-veg", label: t("menus.veg"), icon: "veg", packages: menus.weddingVeg, variant: "veg" },
              { id: "wedding-nonveg", label: t("menus.nonveg"), icon: "nonveg", packages: menus.weddingNonVeg, variant: "nonveg" },
              { id: "wedding-special", label: t("menus.special"), icon: "special", packages: menus.weddingSpecial, variant: "special" },
            ]}
          />
        </div>
        
        <DecorativeBorder position="bottom" />
      </section>

      {/* Decorative Divider */}
      <MenuSectionDivider />

      {/* Registration Section */}
      <section className="relative py-20 bg-card overflow-hidden">
        <div className="absolute inset-0 paisley-bg opacity-20" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mt-4 mb-2">
              {t("menus.registration.title")} <span className="text-gradient-gold">{t("menus.registration.highlight")}</span>
            </h2>
            <p className="text-muted-foreground">{t("menus.registration.desc")}</p>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:block">
            <Tabs defaultValue="registration-veg" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bg-background border border-border">
                <TabsTrigger value="registration-veg" className="font-serif border border-transparent text-green-700 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-green-600">
                  {t("menus.veg")}
                </TabsTrigger>
                <TabsTrigger value="registration-nonveg" className="font-serif border border-transparent text-orange-700 data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:border-orange-600">
                  {t("menus.nonveg")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="registration-veg">
                <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
                  {menus.registrationVeg.map((menu, index) => (
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

              <TabsContent value="registration-nonveg">
                <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
                  {menus.registrationNonVeg.map((menu, index) => (
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
            </Tabs>
          </div>

          {/* Mobile Accordion */}
          <MobileMenuAccordion
            title={t("menus.registration.title")}
            sections={[
              { id: "registration-veg", label: t("menus.veg"), icon: "veg", packages: menus.registrationVeg, variant: "veg" },
              { id: "registration-nonveg", label: t("menus.nonveg"), icon: "nonveg", packages: menus.registrationNonVeg, variant: "nonveg" },
            ]}
          />
        </div>
        
        <DecorativeBorder position="bottom" />
      </section>

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

