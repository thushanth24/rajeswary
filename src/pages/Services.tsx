import { Layout } from "@/components/layout/Layout";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { services } from "@/data/services";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { FloatingElements } from "@/components/animations/FloatingElements";
import { RangoliPattern } from "@/components/animations/RangoliPattern";
import { DiwaRow } from "@/components/animations/DiyaLamp";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";

const ServicesPage = () => {
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
            ✦ Complete Thirumana Seva ✦
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6 animate-fade-in-up">
            Our <span className="text-gradient-gold">Services</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Beyond sacred mandapams, we offer complete wedding solutions rooted in tradition, 
            ensuring your celebration is blessed, seamless, and truly unforgettable.
          </p>
          
          {/* Decorative Divider */}
          <div className="divider-ornate mt-8" />
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative py-20 bg-background overflow-hidden">
        <DecorativeBorder position="top" />
        <div className="absolute inset-0 lotus-bg opacity-20" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-secondary text-3xl">🪷</span>
            <h2 className="font-serif text-2xl font-bold text-foreground mt-2">
              Sacred Wedding Services
            </h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </div>
        
        <DecorativeBorder position="bottom" />
      </section>

      {/* Why Choose Us */}
      <section className="relative py-20 bg-card overflow-hidden">
        <div className="absolute inset-0 paisley-bg opacity-30" />
        <RangoliPattern position="corners" size="sm" opacity={0.1} />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-secondary text-xl">✦</span>
              <span className="text-secondary font-medium tracking-wider uppercase text-sm">
                Our Tradition of Excellence
              </span>
              <span className="text-secondary text-xl">✦</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Why Choose Our <span className="text-gradient-gold">Seva</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We bring together the finest artisans, priests, and professionals 
              to ensure your sacred ceremony exceeds all expectations.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { number: "15+", label: "Years of Seva", desc: "Over 15 years creating blessed celebrations" },
              { number: "500+", label: "Sacred Unions", desc: "Hundreds of couples trust our traditions" },
              { number: "50+", label: "Expert Partners", desc: "Premium vendors for every ritual" },
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center p-8 card-traditional animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-secondary/30 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 gold-shimmer">
                  <span className="text-3xl font-bold text-gradient-gold">{stat.number}</span>
                </div>
                <h3 className="font-serif font-semibold text-foreground text-xl mb-2">{stat.label}</h3>
                <p className="text-sm text-muted-foreground">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary to-primary/90 overflow-hidden">
        <FloatingElements type="diyas" density="low" />
        <div className="absolute inset-0 temple-border opacity-20" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
          <DiwaRow count={5} className="mb-8" />
          
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Plan Your Sacred Union?
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-xl mx-auto text-lg">
            All our seva can be selected during the booking process. Begin your 
            auspicious journey to create the perfect celebration package.
          </p>
          <Button size="lg" variant="secondary" asChild className="gold-shimmer group">
            <Link to="/booking">
              <Calendar className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Begin Sacred Booking
            </Link>
          </Button>
          
          {/* Bottom Decoration */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-secondary/50" />
            <span className="text-secondary/70">🪷</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-secondary/50" />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
