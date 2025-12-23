import { Layout } from "@/components/layout/Layout";
import { HallCard } from "@/components/ui/HallCard";
import { halls } from "@/data/halls";
import { FloatingElements } from "@/components/animations/FloatingElements";
import { RangoliPattern } from "@/components/animations/RangoliPattern";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";
import { CTASection } from "@/components/home/CTASection";

const HallsPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-secondary/20 via-card to-background overflow-hidden">
        <FloatingElements type="petals" density="low" />
        <RangoliPattern position="center" size="lg" opacity={0.08} />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
          {/* Decorative Top Element */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-secondary" />
            <span className="text-secondary text-2xl">🪔</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-secondary" />
          </div>
          
          <span className="text-secondary font-medium tracking-wider uppercase text-sm animate-fade-in">
            ✦ Our Sacred Mandapams ✦
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6 animate-fade-in-up">
            Wedding <span className="text-gradient-gold">Mandapams</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Explore our collection of five auspicious mandapams, each blessed with 
            divine ambiance and traditional elegance for your sacred ceremonies.
          </p>
          
          {/* Decorative Divider */}
          <div className="divider-ornate mt-8" />
        </div>
      </section>

      {/* Halls Grid */}
      <section className="relative py-20 bg-background overflow-hidden">
        <DecorativeBorder position="top" />
        <div className="absolute inset-0 paisley-bg opacity-30" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-secondary text-3xl">🪷</span>
            <h2 className="font-serif text-2xl font-bold text-foreground mt-2">
              Choose Your Sacred Space
            </h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {halls.map((hall, index) => (
              <div 
                key={hall.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <HallCard hall={hall} />
              </div>
            ))}
          </div>
        </div>
        
        <DecorativeBorder position="bottom" />
      </section>

      <CTASection 
        subtitle="Find Your Perfect Venue"
        title="Found Your Perfect"
        highlight="Mandapam"
        description="Begin your auspicious journey. Book a visit to experience our mandapams or select your muhurtham date."
        primaryButtonText="Select Muhurtham Date"
      />
    </Layout>
  );
};

export default HallsPage;
