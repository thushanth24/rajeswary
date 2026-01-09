import { Layout } from "@/components/layout/Layout";
import { HallCard } from "@/components/ui/HallCard";
import { useHalls } from "@/hooks/useHalls";
import { FloatingElements } from "@/components/animations/FloatingElements";
import { RangoliPattern } from "@/components/animations/RangoliPattern";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";
import { CTASection } from "@/components/home/CTASection";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import hallsVideo from "@/assets/halls-wedding-video.mp4";

const HallsPage = () => {
  const { halls, loading, error } = useHalls();
  const { t } = useLanguage();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-b from-secondary/20 via-card to-background overflow-hidden">
        <FloatingElements type="petals" density="low" />
        <RangoliPattern position="center" size="lg" opacity={0.08} />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Decorative Top Element */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-secondary" />
            <span className="text-secondary text-xl sm:text-2xl">🪔</span>
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-secondary" />
          </div>
          
          <span className="text-secondary font-medium tracking-wider uppercase text-xs sm:text-sm animate-fade-in">
            ✦ {t("halls.page.title")} ✦
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mt-3 sm:mt-4 mb-4 sm:mb-6 animate-fade-in-up px-2">
            {t("nav.halls")} <span className="text-gradient-gold">Mandapams</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base md:text-lg animate-fade-in-up px-2" style={{ animationDelay: '0.2s' }}>
            {t("halls.page.subtitle")}
          </p>
          
          {/* Decorative Divider */}
          <div className="divider-ornate mt-6 sm:mt-8" />
        </div>
      </section>

      {/* Halls Grid */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-background overflow-hidden">
        <DecorativeBorder position="top" />
        <div className="absolute inset-0 paisley-bg opacity-30" />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <span className="text-secondary text-2xl sm:text-3xl">🪷</span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground mt-2">
              {t("halls.page.chooseSpace")}
            </h2>
          </div>
          
          {loading ? (
            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-3 sm:space-y-4">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <Skeleton className="h-5 sm:h-6 w-3/4" />
                  <Skeleton className="h-3 sm:h-4 w-full" />
                  <Skeleton className="h-3 sm:h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {halls.map((hall, index) => (
                <div 
                  key={hall.id} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <HallCard hall={hall} showAvailability />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <DecorativeBorder position="bottom" />
      </section>

      <CTASection 
        subtitle={t("halls.cta.subtitle")}
        title={t("halls.cta.title")}
        highlight={t("halls.cta.highlight")}
        description={t("halls.cta.description")}
        primaryButtonText={t("halls.cta.button")}
        videos={[hallsVideo]}
      />
    </Layout>
  );
};

export default HallsPage;
