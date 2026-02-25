import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { CharityGallery } from "@/components/charity/CharityGallery";
import { Layout } from "@/components/layout/Layout";
import { Heart, Users, GraduationCap, Home, Utensils, HandHeart, Sparkles, Star, ArrowRight, Gift, TreePine } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";
import { FloatingElements } from "@/components/animations/FloatingElements";
import { RangoliPattern } from "@/components/animations/RangoliPattern";
import { AnimatedCounter } from "@/components/about/AnimatedCounter";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import charityHero from "@/assets/charity-hero.jpg";
import charityFood from "@/assets/charity-food-distribution.jpg";
import charityEducation from "@/assets/charity-education.jpg";
import charityCommunity from "@/assets/charity-community.jpg";

const CharityPage = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const initiatives = [
    {
      icon: Utensils,
      title: t("charity.initiative.food.title"),
      description: t("charity.initiative.food.desc"),
      emoji: "🍚",
      gradient: "from-amber-500/20 to-orange-500/20",
      borderColor: "hover:border-amber-400/40",
      iconBg: "bg-amber-500/10 group-hover:bg-amber-500/20",
      iconColor: "text-amber-600",
    },
    {
      icon: GraduationCap,
      title: t("charity.initiative.education.title"),
      description: t("charity.initiative.education.desc"),
      emoji: "📚",
      gradient: "from-blue-500/20 to-indigo-500/20",
      borderColor: "hover:border-blue-400/40",
      iconBg: "bg-blue-500/10 group-hover:bg-blue-500/20",
      iconColor: "text-blue-600",
    },
    {
      icon: Home,
      title: t("charity.initiative.shelter.title"),
      description: t("charity.initiative.shelter.desc"),
      emoji: "🏠",
      gradient: "from-emerald-500/20 to-teal-500/20",
      borderColor: "hover:border-emerald-400/40",
      iconBg: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
      iconColor: "text-emerald-600",
    },
    {
      icon: Users,
      title: t("charity.initiative.community.title"),
      description: t("charity.initiative.community.desc"),
      emoji: "🤝",
      gradient: "from-violet-500/20 to-purple-500/20",
      borderColor: "hover:border-violet-400/40",
      iconBg: "bg-violet-500/10 group-hover:bg-violet-500/20",
      iconColor: "text-violet-600",
    },
    {
      icon: Heart,
      title: t("charity.initiative.health.title"),
      description: t("charity.initiative.health.desc"),
      emoji: "🏥",
      gradient: "from-rose-500/20 to-pink-500/20",
      borderColor: "hover:border-rose-400/40",
      iconBg: "bg-rose-500/10 group-hover:bg-rose-500/20",
      iconColor: "text-rose-600",
    },
    {
      icon: HandHeart,
      title: t("charity.initiative.temple.title"),
      description: t("charity.initiative.temple.desc"),
      emoji: "🛕",
      gradient: "from-primary/20 to-secondary/20",
      borderColor: "hover:border-primary/40",
      iconBg: "bg-primary/10 group-hover:bg-primary/20",
      iconColor: "text-primary",
    },
  ];

  const impactStats = [
    { value: "5000+", label: "Meals Served", icon: "🍽️" },
    { value: "200+", label: "Students Supported", icon: "🎓" },
    { value: "50+", label: "Families Helped", icon: "👨‍👩‍👧‍👦" },
    { value: "15+", label: "Years of Service", icon: "✨" },
  ];

  return (
    <Layout>

      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Hero background image */}
        <div className="absolute inset-0">
          <img src={charityHero} alt="Charity event" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
        </div>
        <FloatingElements type="petals" density="low" />
        <RangoliPattern position="center" size="lg" opacity={0.06} />

        <div className="container mx-auto px-4 relative z-10 text-center py-24 md:py-32">
          <motion.div
            style={{ opacity: heroOpacity }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center justify-center gap-2 mb-8"
            >
              <span className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full border border-primary/20 backdrop-blur-sm">
                <Heart className="h-4 w-4 animate-pulse" />
                {t("charity.hero.badge")}
                <Heart className="h-4 w-4 animate-pulse" />
              </span>
            </motion.div>

            {/* Large decorative emoji */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
              className="text-7xl md:text-8xl mb-8"
            >
              🙏
            </motion.div>

            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              {t("charity.hero.title")}{" "}
              <span className="relative">
                <span className="text-primary">{t("charity.hero.highlight")}</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 origin-left"
                />
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("charity.hero.description")}
            </p>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-12"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-flex flex-col items-center gap-2 text-muted-foreground/60"
              >
                <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
                <ArrowRight className="h-4 w-4 rotate-90" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        <DecorativeBorder position="bottom" />
      </section>

      {/* Impact Stats Banner */}
      <section className="relative py-16 bg-gradient-to-r from-primary via-primary/95 to-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <span className="text-4xl mb-3 block">{stat.icon}</span>
                <AnimatedCounter value={stat.value} label={stat.label} duration={2} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement - Split layout */}
      <section className="py-20 md:py-28 bg-card overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left: Decorative visual */}
            {/* Left: Photo gallery grid */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="rounded-2xl overflow-hidden shadow-lg col-span-2"
                >
                  <img src={charityFood} alt="Food distribution charity event" className="w-full h-48 md:h-56 object-cover" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="rounded-2xl overflow-hidden shadow-lg"
                >
                  <img src={charityEducation} alt="Education support for children" className="w-full h-36 md:h-44 object-cover" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="rounded-2xl overflow-hidden shadow-lg"
                >
                  <img src={charityCommunity} alt="Community support event" className="w-full h-36 md:h-44 object-cover" />
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Text content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
                <Sparkles className="h-4 w-4" />
                Our Purpose
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                {t("charity.mission.title")}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-5">
                {t("charity.mission.p1")}
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {t("charity.mission.p2")}
              </p>
              
              {/* Key values */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🙏", text: "Selfless Service" },
                  { icon: "💛", text: "Compassion" },
                  { icon: "🤝", text: "Community First" },
                  { icon: "🌱", text: "Sustainable Impact" },
                ].map((value, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3 bg-background rounded-xl p-3 border border-border"
                  >
                    <span className="text-2xl">{value.icon}</span>
                    <span className="text-sm font-medium text-foreground">{value.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Initiatives Grid - Enhanced */}
      <section ref={sectionRef} className="py-20 md:py-28 bg-background relative">
        <div className="absolute inset-0 opacity-[0.03]">
          <RangoliPattern position="center" size="md" opacity={0.1} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
              <Gift className="h-4 w-4" />
              What We Do
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
              {t("charity.initiatives.title")}{" "}
              <span className="text-primary">{t("charity.initiatives.highlight")}</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("charity.initiatives.description")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {initiatives.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative bg-card rounded-2xl overflow-hidden border border-border ${item.borderColor} hover:shadow-xl transition-all duration-500`}
              >
                {/* Top gradient bar */}
                <div className={`h-1.5 bg-gradient-to-r ${item.gradient}`} />
                
                <div className="p-8">
                  {/* Emoji + Icon row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${item.iconBg} flex items-center justify-center transition-colors duration-300`}>
                      <item.icon className={`h-7 w-7 ${item.iconColor}`} />
                    </div>
                    <span className="text-4xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                      {item.emoji}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>

                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section - Visual timeline style */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-card via-background to-card overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
              <TreePine className="h-4 w-4" />
              Our Commitment
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
              How We <span className="text-primary">Give Back</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                step: "01",
                title: "Identify Community Needs",
                desc: "We work closely with local leaders and organizations to understand the most pressing needs in our community.",
                emoji: "🔍",
              },
              {
                step: "02",
                title: "Allocate Resources",
                desc: "A dedicated portion of our revenue from every celebration goes directly to fund charitable initiatives.",
                emoji: "💰",
              },
              {
                step: "03",
                title: "Execute Programs",
                desc: "Our team personally oversees every initiative to ensure maximum impact and transparent delivery.",
                emoji: "🎯",
              },
              {
                step: "04",
                title: "Measure & Grow",
                desc: "We track every initiative's impact and continuously expand our programs to reach more people in need.",
                emoji: "📈",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="flex gap-6 items-start group"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 group-hover:border-primary/50 group-hover:bg-primary/20 transition-all duration-300">
                  <span className="text-2xl">{item.emoji}</span>
                </div>
                <div className="flex-1 pb-8 border-b border-border/50 group-last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Step {item.step}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery with Lightbox */}
      <CharityGallery />

      {/* Quote Section - More dramatic */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-[10%] text-8xl opacity-5 rotate-12">🙏</div>
          <div className="absolute bottom-10 right-[10%] text-8xl opacity-5 -rotate-12">❤️</div>
          <div className="absolute top-1/2 left-[5%] text-6xl opacity-5">🌸</div>
          <div className="absolute top-1/3 right-[5%] text-6xl opacity-5">🪔</div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="relative inline-block mb-8">
              <Star className="h-8 w-8 text-primary/40 absolute -top-4 -left-6" />
              <Star className="h-6 w-6 text-secondary/40 absolute -top-2 -right-4" />
              <span className="text-7xl md:text-8xl">🙏</span>
            </div>
            <blockquote className="font-serif text-2xl md:text-4xl text-foreground italic leading-relaxed mb-8">
              "{t("charity.quote.text")}"
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-primary/40" />
              <p className="text-primary font-semibold text-lg">
                {t("charity.quote.attribution")}
              </p>
              <div className="h-px w-12 bg-primary/40" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA - More impactful */}
      <section className="relative py-20 md:py-28 bg-card overflow-hidden">
        <RangoliPattern position="corners" size="sm" opacity={0.05} />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-6xl block mb-6"
            >
              💛
            </motion.span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6">
              {t("charity.cta.title")}
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              {t("charity.cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-traditional transition-all duration-300 hover:shadow-gold-glow text-base px-8"
              >
                <Link to="/contact">
                  <Heart className="mr-2 h-5 w-5" />
                  {t("charity.cta.button")}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary/30 text-primary hover:bg-primary/5 text-base px-8"
              >
                <Link to="/about">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Learn About Us
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default CharityPage;
