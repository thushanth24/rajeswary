import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { EnhancedServiceCard } from "@/components/ui/EnhancedServiceCard";
import { services, type ServiceCategory } from "@/data/services";
import { FloatingElements } from "@/components/animations/FloatingElements";
import { RangoliPattern } from "@/components/animations/RangoliPattern";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";
import { CTASection } from "@/components/home/CTASection";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Sparkles, Crown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import servicesVideo from "@/assets/wedding-services-video.mp4";

const ServicesPage = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | "all">("all");
  const carouselRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const categoryConfig: Record<ServiceCategory | "all", { label: string; icon: React.ReactNode; description: string }> = {
    all: { label: t("services.tab.all"), icon: <Sparkles className="w-4 h-4" />, description: t("services.tab.all.desc") },
    essential: { label: t("services.tab.essential"), icon: <Sparkles className="w-4 h-4" />, description: t("services.tab.essential.desc") },
    premium: { label: t("services.tab.premium"), icon: <Crown className="w-4 h-4" />, description: t("services.tab.premium.desc") },
    addon: { label: t("services.tab.addon"), icon: <Plus className="w-4 h-4" />, description: t("services.tab.addon.desc") },
  };
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const filteredServices = activeCategory === "all"
    ? services 
    : services.filter(s => s.category === activeCategory);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // All cards are normal size for consistent grid layout
  const getBentoSize = (): "normal" | "large" | "wide" => {
    return "normal";
  };

  return (
    <Layout>
      {/* Hero Section with Parallax */}
      <motion.section 
        ref={heroRef}
        className="relative py-24 bg-gradient-to-b from-secondary/20 via-card to-background overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <FloatingElements type="petals" density="low" />
        <RangoliPattern position="center" size="lg" opacity={0.08} />
        
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-secondary/60 rounded-full"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: -10,
              }}
              animate={{ 
                y: typeof window !== 'undefined' ? window.innerHeight + 10 : 800,
                opacity: [0, 1, 1, 0],
              }}
              transition={{ 
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear",
              }}
            />
          ))}
        </div>
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
          {/* Decorative Top Element */}
          <motion.div 
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-secondary" />
            <motion.span 
              className="text-secondary text-3xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🪔
            </motion.span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-secondary" />
          </motion.div>
          
          <motion.span 
            className="inline-block text-secondary font-medium tracking-wider uppercase text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            ✦ {t("services.hero.tagline")} ✦
          </motion.span>
          
          <motion.h1 
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {t("services.hero.title")} <span className="text-gradient-gold">{t("services.hero.highlight")}</span>
          </motion.h1>
          
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {t("services.hero.description")}
          </motion.p>
          
          {/* Decorative Divider */}
          <motion.div 
            className="divider-ornate mt-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </div>
      </motion.section>

      {/* Tab Navigation */}
      <section className="bg-background border-b border-border/50 py-6">
        <div className="container mx-auto px-4 lg:px-8">
          <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as ServiceCategory | "all")}>
            <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-4 bg-card/80 backdrop-blur-sm border border-border/50 p-1 sm:p-1.5 rounded-full">
              {(["all", "essential", "premium", "addon"] as const).map((cat) => (
                <TabsTrigger 
                  key={cat} 
                  value={cat}
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md flex items-center justify-center gap-1 text-[0.65rem] sm:text-xs md:text-sm font-medium transition-all duration-300 px-1 sm:px-2 py-1.5"
                >
                  <span className="shrink-0">{categoryConfig[cat].icon}</span>
                  <span className="hidden md:inline truncate">{categoryConfig[cat].label}</span>
                  <span className="md:hidden truncate">{cat === "all" ? "All" : cat.slice(0, 3).charAt(0).toUpperCase() + cat.slice(1, 4)}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          <motion.p 
            className="text-center text-muted-foreground text-sm mt-3"
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {categoryConfig[activeCategory].description}
          </motion.p>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="relative py-12 bg-gradient-to-b from-background to-card overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
              <span className="text-secondary">🪷</span>
              {t("services.quickBrowse")}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => scrollCarousel("left")}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => scrollCarousel("right")}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredServices.map((service, index) => (
              <motion.div 
                key={service.id}
                className="flex-shrink-0 w-72 snap-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EnhancedServiceCard service={service} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="relative py-20 bg-card overflow-hidden">
        <DecorativeBorder position="top" />
        <div className="absolute inset-0 lotus-bg opacity-20" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.span 
              className="text-secondary text-3xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🪷
            </motion.span>
            <h2 className="font-serif text-3xl font-bold text-foreground mt-2 mb-2">
              {t("services.sacredServices")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("services.hoverDiscover")}
            </p>
          </div>
          
          {/* Bento Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {filteredServices.map((service, index) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <EnhancedServiceCard 
                  service={service} 
                  size="normal"
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        <DecorativeBorder position="bottom" />
      </section>

      {/* Why Choose Us */}
      <section className="relative py-20 bg-background overflow-hidden">
        <div className="absolute inset-0 paisley-bg opacity-30" />
        <RangoliPattern position="corners" size="sm" opacity={0.1} />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-secondary text-xl">✦</span>
              <span className="text-secondary font-medium tracking-wider uppercase text-sm">
                {t("services.whyChoose.sectionTitle")}
              </span>
              <span className="text-secondary text-xl">✦</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              {t("services.whyChoose.mainTitle")} <span className="text-gradient-gold">{t("services.whyChoose.highlight")}</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("services.whyChoose.desc")}
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { number: "15+", label: t("services.stats.years"), desc: t("services.stats.years.desc"), icon: "🕉️" },
              { number: "500+", label: t("services.stats.unions"), desc: t("services.stats.unions.desc"), icon: "💑" },
              { number: "50+", label: t("services.stats.partners"), desc: t("services.stats.partners.desc"), icon: "🤝" },
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                {/* Animated border on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary via-primary to-secondary rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
                
                <div className="relative text-center p-8 bg-card rounded-xl border border-border/50 backdrop-blur-sm">
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-br from-secondary/30 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <span className="text-4xl">{stat.icon}</span>
                  </motion.div>
                  <div className="text-4xl font-bold text-gradient-gold mb-2">{stat.number}</div>
                  <h3 className="font-serif font-semibold text-foreground text-xl mb-2">{stat.label}</h3>
                  <p className="text-sm text-muted-foreground">{stat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection 
        subtitle={t("services.cta.subtitle")}
        title={t("services.cta.title")}
        highlight={t("services.cta.highlight")}
        description={t("services.cta.description")}
        primaryButtonText={t("services.cta.button")}
        videos={[servicesVideo]}
      />
    </Layout>
  );
};

export default ServicesPage;
