import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { services } from "@/data/services";

// Map services data to include gradients and accents for visual styling
const gradients = [
  "from-amber-500/80 via-orange-600/70 to-red-700/80",
  "from-rose-500/80 via-pink-600/70 to-purple-700/80",
  "from-emerald-500/80 via-teal-600/70 to-cyan-700/80",
  "from-violet-500/80 via-purple-600/70 to-indigo-700/80",
  "from-blue-500/80 via-indigo-600/70 to-purple-700/80",
  "from-orange-500/80 via-amber-600/70 to-yellow-700/80",
];

const accents = [
  "bg-amber-400",
  "bg-rose-400",
  "bg-emerald-400",
  "bg-violet-400",
  "bg-blue-400",
  "bg-orange-400",
];

// Use first 6 services from the services data
const serviceItems = services.slice(0, 6).map((service, index) => ({
  id: service.id,
  icon: service.icon,
  title: service.name,
  description: service.description,
  image: service.image,
  gradient: gradients[index % gradients.length],
  accent: accents[index % accents.length],
}));

export function ServicesPreview() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % serviceItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % serviceItems.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + serviceItems.length) % serviceItems.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setActiveIndex(index);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background via-card to-background relative overflow-hidden">
      {/* Decorative borders */}
      <DecorativeBorder variant="both" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 paisley-bg opacity-30" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      {/* Floating decorative elements */}
      <motion.div 
        className="absolute top-20 left-1/4 text-6xl hidden lg:block"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        🪔
      </motion.div>
      <motion.div 
        className="absolute bottom-20 right-1/4 text-6xl hidden lg:block"
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        🪷
      </motion.div>
      
      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-secondary animate-sparkle text-2xl">✦</span>
            <span className="text-secondary font-medium tracking-widest uppercase text-sm">
              {t("services.subtitle")}
            </span>
            <span className="text-secondary animate-sparkle text-2xl" style={{ animationDelay: "0.75s" }}>✦</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            {t("services.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t("services.description")}
          </p>
        </motion.div>

        {/* Featured Carousel */}
        <div className="mb-16">
          <div className="relative" ref={carouselRef}>
            {/* Main Carousel */}
            <div className="relative h-[500px] md:h-[450px] rounded-2xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${serviceItems[activeIndex].image})` }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${serviceItems[activeIndex].gradient}`} />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-8 md:px-16">
                      <div className="max-w-xl">
                        <motion.div
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="flex items-center gap-3 mb-4"
                        >
                          <div className={`w-12 h-12 rounded-full ${serviceItems[activeIndex].accent} flex items-center justify-center shadow-lg`}>
                            <span className="text-2xl">{serviceItems[activeIndex].icon}</span>
                          </div>
                          <span className="text-white/80 uppercase tracking-wider text-sm font-medium">
                            Featured Service
                          </span>
                        </motion.div>
                        
                        <motion.h3
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className="font-serif text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg"
                        >
                          {serviceItems[activeIndex].title}
                        </motion.h3>
                        
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          className="text-white/90 text-lg mb-6 leading-relaxed"
                        >
                          {serviceItems[activeIndex].description}
                        </motion.p>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                        >
                          <Button 
                            asChild
                            className="bg-white text-foreground hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                          >
                            <Link to="/services">
                              Learn More
                            </Link>
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all duration-300 flex items-center justify-center group"
              >
                <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all duration-300 flex items-center justify-center group"
              >
                <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
              
              {/* Dots Indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {serviceItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex 
                        ? 'w-8 bg-white' 
                        : 'w-2 bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Service Grid with Staggered Layout */}
        <motion.div 
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {serviceItems.map((service, index) => (
            <motion.div
              key={service.title}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => goToSlide(index)}
              className={`group relative overflow-hidden rounded-xl cursor-pointer ${
                index === activeIndex ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
              }`}
              style={{
                height: index % 3 === 1 ? '280px' : '240px'
              }}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${service.image})` }}
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-80 group-hover:opacity-90 transition-opacity duration-300`} />
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-full ${service.accent} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                    <span className="text-xl">{service.icon}</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white drop-shadow-lg">
                    {service.title}
                  </h3>
                </div>
                <p className="text-white/80 text-sm line-clamp-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {service.description}
                </p>
              </div>
              
              {/* Active Indicator */}
              {index === activeIndex && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                    Viewing
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <Button 
            asChild 
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <Link to="/services">
              <span className="mr-2 group-hover:animate-swing inline-block">🪷</span>
              {t("services.viewAll")}
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
