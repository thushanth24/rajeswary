import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Heart, Award, Users, Star, Check } from "lucide-react";
import { FloatingElements } from "@/components/animations/FloatingElements";
import { RangoliPattern } from "@/components/animations/RangoliPattern";
import { DiwaRow } from "@/components/animations/DiyaLamp";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";
import { AnimatedCounter } from "@/components/about/AnimatedCounter";
import { TeamCarousel } from "@/components/about/TeamCarousel";
import { Timeline } from "@/components/about/Timeline";

const AboutPage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const valuesData = [
    { icon: Award, title: "Divine Excellence", desc: "Award-winning mandapams with traditional elegance" },
    { icon: Users, title: "Devoted Team", desc: "Experienced professionals honoring your traditions" },
    { icon: Star, title: "Premium Seva", desc: "Complete wedding solutions under one sacred roof" },
    { icon: Heart, title: "Personal Touch", desc: "Customized experiences for every blessed couple" },
  ];

  return (
    <Layout>
      {/* Hero Section with Parallax & Video */}
      <section ref={heroRef} className="relative h-[80vh] min-h-[600px] overflow-hidden">
        {/* Video Background with Parallax */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: heroY, scale: heroScale }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            poster="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920"
          >
            <source 
              src="https://videos.pexels.com/video-files/3327291/3327291-hd_1920_1080_25fps.mp4" 
              type="video/mp4" 
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
        </motion.div>
        
        <FloatingElements type="diyas" density="low" />
        
        <motion.div 
          className="container relative z-10 mx-auto px-4 lg:px-8 h-full flex flex-col justify-center text-center"
          style={{ opacity: heroOpacity }}
        >
          {/* Decorative Top Element */}
          <motion.div 
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-secondary" />
            <motion.span 
              className="text-secondary text-3xl"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🪔
            </motion.span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-secondary" />
          </motion.div>
          
          {/* Animated Title - Letter by letter reveal */}
          <div className="overflow-hidden mb-6">
            <motion.h1 
              className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-card"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              About{" "}
              <span className="text-gradient-gold inline-block">
                {"Celebration Halls".split("").map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.05 }}
                    className="inline-block"
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </span>
            </motion.h1>
          </div>
          
          <motion.p 
            className="text-card/90 max-w-2xl mx-auto text-lg md:text-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            For over 15 years, we've been creating blessed celebrations, 
            honoring Tamil traditions one sacred union at a time.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <DiwaRow count={5} className="mt-10" />
          </motion.div>
          
          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-card/50 rounded-full flex justify-center">
              <motion.div 
                className="w-1.5 h-3 bg-secondary rounded-full mt-2"
                animate={{ opacity: [1, 0.3, 1], y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Story Section with Split Layout */}
      <section ref={storyRef} className="relative py-24 bg-background overflow-hidden">
        <DecorativeBorder position="top" />
        <div className="absolute inset-0 lotus-bg opacity-20" />
        <RangoliPattern position="corners" size="sm" opacity={0.1} />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-3xl blur-2xl" />
              <div className="relative grid grid-cols-2 gap-4">
                <motion.img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop"
                  alt="Wedding ceremony"
                  className="rounded-2xl object-cover h-64 w-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=500&fit=crop"
                  alt="Wedding decoration"
                  className="rounded-2xl object-cover h-64 w-full mt-8"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.img
                  src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=500&fit=crop"
                  alt="Wedding venue"
                  className="rounded-2xl object-cover h-64 w-full -mt-8"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.img
                  src="https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=400&h=500&fit=crop"
                  alt="Wedding celebration"
                  className="rounded-2xl object-cover h-64 w-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>

            {/* Text Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-secondary/30 to-primary/20 rounded-full flex items-center justify-center mb-6 gold-shimmer">
                <Heart className="h-10 w-10 text-primary" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our <span className="text-gradient-gold">Story</span>
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Celebration Halls began with a sacred vision: to create divine spaces 
                  where love stories unfold according to cherished Tamil Hindu traditions.
                </p>
                <p>
                  What started as a single mandapam has grown into a collection of five 
                  stunning venues, each designed with devotion and blessed ambiance.
                </p>
                <p>
                  Over the years, we've had the privilege of hosting thousands of 
                  thirumangalyam ceremonies, receptions, and sacred celebrations. Each 
                  union has deepened our understanding, making us guardians of tradition 
                  while embracing the joy of every couple's unique journey.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        
        <DecorativeBorder position="bottom" />
      </section>

      {/* Timeline Section */}
      <section className="relative py-24 bg-card overflow-hidden">
        <div className="absolute inset-0 paisley-bg opacity-20" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <motion.div 
              className="flex items-center justify-center gap-3 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <span className="text-secondary text-xl">✦</span>
              <span className="text-secondary font-medium tracking-wider uppercase text-sm">
                Our Journey
              </span>
              <span className="text-secondary text-xl">✦</span>
            </motion.div>
            <motion.h2 
              className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              A Legacy of <span className="text-gradient-gold">Sacred Celebrations</span>
            </motion.h2>
            <motion.p 
              className="text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              From humble beginnings to becoming the region's premier wedding destination
            </motion.p>
          </div>
          
          <Timeline />
        </div>
      </section>

      {/* Values Section with Glassmorphism */}
      <section className="relative py-24 bg-background overflow-hidden">
        <DecorativeBorder position="top" />
        <div className="absolute inset-0 lotus-bg opacity-20" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <motion.div 
              className="flex items-center justify-center gap-3 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <span className="text-secondary text-xl">✦</span>
              <span className="text-secondary font-medium tracking-wider uppercase text-sm">
                Our Sacred Values
              </span>
              <span className="text-secondary text-xl">✦</span>
            </motion.div>
            <motion.h2 
              className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Why Choose <span className="text-gradient-gold">Us</span>
            </motion.h2>
            <motion.p 
              className="text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              What sets us apart is our devotion to making your sacred day 
              truly divine and memorable.
            </motion.p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {valuesData.map((item, index) => (
              <motion.div 
                key={item.title}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Animated gradient border */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary via-primary to-secondary rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500 animate-gradient-x" />
                
                {/* Glassmorphism Card */}
                <div className="relative h-full bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 text-center overflow-hidden">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <motion.div 
                    className="relative z-10 w-20 h-20 bg-gradient-to-br from-secondary/30 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <item.icon className="h-10 w-10 text-primary" />
                  </motion.div>
                  <h3 className="relative z-10 font-serif font-semibold text-foreground text-xl mb-3">
                    {item.title}
                  </h3>
                  <p className="relative z-10 text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <DecorativeBorder position="bottom" />
      </section>

      {/* Stats Section with Animated Counters */}
      <section className="relative py-24 bg-gradient-to-br from-primary via-primary to-primary/90 overflow-hidden">
        <FloatingElements type="diyas" density="low" />
        <div className="absolute inset-0 temple-border opacity-20" />
        
        {/* Particle effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-secondary/60 rounded-full"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: typeof window !== 'undefined' ? window.innerHeight + 10 : 800,
              }}
              animate={{ 
                y: -10,
                opacity: [0, 1, 1, 0],
              }}
              transition={{ 
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "linear",
              }}
            />
          ))}
        </div>
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4 text-center">
            {[
              { value: "15+", label: "Years of Seva" },
              { value: "5", label: "Sacred Mandapams" },
              { value: "500+", label: "Blessed Unions" },
              { value: "100%", label: "Happy Couples" },
            ].map((stat) => (
              <AnimatedCounter key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-24 bg-card overflow-hidden">
        <div className="absolute inset-0 paisley-bg opacity-20" />
        <RangoliPattern position="corners" size="sm" opacity={0.08} />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <motion.span 
              className="text-secondary text-3xl inline-block"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              👥
            </motion.span>
            <motion.h2 
              className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Meet Our <span className="text-gradient-gold">Team</span>
            </motion.h2>
            <motion.p 
              className="text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Dedicated professionals who make every celebration extraordinary
            </motion.p>
          </div>
          
          <TeamCarousel />
        </div>
      </section>

      {/* Promise Section */}
      <section className="relative py-24 bg-background overflow-hidden">
        <DecorativeBorder position="top" />
        <div className="absolute inset-0 lotus-bg opacity-20" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <motion.span 
                className="text-secondary text-4xl inline-block"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🪷
              </motion.span>
              <motion.h2 
                className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-4 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Our Sacred <span className="text-gradient-gold">Promise</span>
              </motion.h2>
            </div>
            
            <div className="space-y-4">
              {[
                "Impeccable seva from first inquiry to muhurtham day",
                "Flexible packages honoring your family traditions",
                "Transparent pricing with no hidden costs",
                "Premium vendors ensuring quality for every ritual",
                "Dedicated event coordinator for your celebration",
                "Backup systems for uninterrupted sacred ceremonies",
              ].map((item, index) => (
                <motion.div 
                  key={item} 
                  className="group relative"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Hover glow */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-primary rounded-xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300" />
                  
                  <div className="relative flex items-center gap-4 p-5 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl">
                    <motion.div 
                      className="w-10 h-10 bg-gradient-to-br from-secondary/30 to-primary/20 rounded-full flex items-center justify-center shrink-0"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Check className="h-5 w-5 text-primary" />
                    </motion.div>
                    <span className="text-foreground font-medium">{item}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <DecorativeBorder position="bottom" />
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-card overflow-hidden">
        <RangoliPattern position="center" size="lg" opacity={0.08} />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
          <DiwaRow count={3} className="mb-8" />
          
          <motion.h2 
            className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Let's Create Your <span className="text-gradient-gold">Perfect Day</span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground mb-10 max-w-xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            We'd be honored to be part of your sacred celebration. Book a visit 
            to see our mandapams or start planning your auspicious event today.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button size="lg" asChild className="gold-shimmer group text-lg px-8">
              <Link to="/booking">
                <Calendar className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Book Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary/50 hover:bg-primary/10 text-lg px-8">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </motion.div>
          
          {/* Bottom Decoration */}
          <motion.div 
            className="flex items-center justify-center gap-4 mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-secondary/50" />
            <span className="text-secondary/70 text-2xl">🪷</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-secondary/50" />
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
