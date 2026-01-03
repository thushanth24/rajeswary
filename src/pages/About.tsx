import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Heart, Award, Users, Star, Check } from "lucide-react";
import heroImage from "@/assets/hero-wedding.jpg";
import { FloatingElements } from "@/components/animations/FloatingElements";
import { RangoliPattern } from "@/components/animations/RangoliPattern";
import { DiwaRow } from "@/components/animations/DiyaLamp";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";

const AboutPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="About us"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground/80" />
        </div>
        
        <FloatingElements type="diyas" density="low" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
          {/* Decorative Top Element */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-secondary" />
            <span className="text-secondary text-2xl animate-glow-pulse">🪔</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-secondary" />
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-card mb-6 animate-fade-in-up">
            About <span className="text-gradient-gold">Raajeshwariy Groups of Company PVT LTD</span>
          </h1>
          <p className="text-card/90 max-w-2xl mx-auto text-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            For over 15 years, we've been creating blessed celebrations, 
            honoring Tamil traditions one sacred union at a time.
          </p>
          
          <DiwaRow count={5} className="mt-10" />
        </div>
      </section>

      {/* Story Section */}
      <section className="relative py-20 bg-background overflow-hidden">
        <DecorativeBorder position="top" />
        <div className="absolute inset-0 lotus-bg opacity-20" />
        <RangoliPattern position="corners" size="sm" opacity={0.1} />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-secondary/30 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 gold-shimmer">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
              Our <span className="text-gradient-gold">Story</span>
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
              Raajeshwariy Groups of Company PVT LTD began with a sacred vision: to create divine spaces 
              where love stories unfold according to cherished Tamil Hindu traditions. 
              What started as a single mandapam has grown into a collection of five 
              stunning venues, each designed with devotion and blessed ambiance.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Over the years, we've had the privilege of hosting thousands of 
              thirumangalyam ceremonies, receptions, and sacred celebrations. Each 
              union has deepened our understanding, making us guardians of tradition 
              while embracing the joy of every couple's unique journey.
            </p>
          </div>
        </div>
        
        <DecorativeBorder position="bottom" />
      </section>

      {/* Values Section */}
      <section className="relative py-20 bg-card overflow-hidden">
        <div className="absolute inset-0 paisley-bg opacity-30" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-secondary text-xl">✦</span>
              <span className="text-secondary font-medium tracking-wider uppercase text-sm">
                Our Sacred Values
              </span>
              <span className="text-secondary text-xl">✦</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Why Choose <span className="text-gradient-gold">Us</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              What sets us apart is our devotion to making your sacred day 
              truly divine and memorable.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Award, title: "Divine Excellence", desc: "Award-winning mandapams with traditional elegance" },
              { icon: Users, title: "Devoted Team", desc: "Experienced professionals honoring your traditions" },
              { icon: Star, title: "Premium Seva", desc: "Complete wedding solutions under one sacred roof" },
              { icon: Heart, title: "Personal Touch", desc: "Customized experiences for every blessed couple" },
            ].map((item, index) => (
              <div 
                key={item.title}
                className="text-center p-6 card-traditional animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-secondary/30 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 gold-shimmer">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-foreground text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary to-primary/90 overflow-hidden">
        <FloatingElements type="diyas" density="low" />
        <div className="absolute inset-0 temple-border opacity-20" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4 text-center">
            {[
              { value: "15+", label: "Years of Seva" },
              { value: "5", label: "Sacred Mandapams" },
              { value: "500+", label: "Blessed Unions" },
              { value: "100%", label: "Happy Couples" },
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <p className="text-5xl font-bold text-secondary mb-2 gold-shimmer inline-block">{stat.value}</p>
                <p className="text-primary-foreground/80 font-serif">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section className="relative py-20 bg-background overflow-hidden">
        <DecorativeBorder position="top" />
        <div className="absolute inset-0 lotus-bg opacity-20" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-secondary text-3xl">🪷</span>
              <h2 className="font-serif text-3xl font-bold text-foreground mt-4 mb-4">
                Our Sacred <span className="text-gradient-gold">Promise</span>
              </h2>
            </div>
            
            <div className="space-y-4">
              {[
                "Impeccable seva from first inquiry to muhurtham day",
                "Flexible packages honoring your family traditions",
                "Clear guidance with no hidden surprises",
                "Premium vendors ensuring quality for every ritual",
                "Dedicated event coordinator for your celebration",
                "Backup systems for uninterrupted sacred ceremonies",
              ].map((item, index) => (
                <div 
                  key={item} 
                  className="flex items-center gap-4 p-4 card-traditional animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-secondary/30 to-primary/20 rounded-full flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DecorativeBorder position="bottom" />
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-card overflow-hidden">
        <RangoliPattern position="center" size="lg" opacity={0.08} />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
          <DiwaRow count={3} className="mb-8" />
          
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground mb-4">
            Let's Create Your <span className="text-gradient-gold">Perfect Day</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
            We'd be honored to be part of your sacred celebration. Book a visit 
            to see our mandapams or start planning your auspicious event today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="gold-shimmer group">
              <Link to="/booking">
                <Calendar className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Book Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary/50 hover:bg-primary/10">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
          
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

export default AboutPage;
