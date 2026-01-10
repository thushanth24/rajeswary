import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import bossImage from "@/assets/boss.jpeg";
import sonImage from "@/assets/son.jpeg";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  quote: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Sellathurai Thirumaran",
    role: "Founder & Director",
    image: bossImage,
    quote: "Every wedding we host is a sacred trust. We pour our hearts into making each celebration divine.",
  },
  {
    name: "Thirumaran Lavaraj",
    role: "Managing Director",
    image: sonImage,
    quote: "Carrying forward our legacy while embracing innovation to create unforgettable celebrations.",
  },
];

export const TeamCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 rounded-full bg-card/80 backdrop-blur-sm border-secondary/30 hover:bg-secondary/20"
        onClick={prev}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 rounded-full bg-card/80 backdrop-blur-sm border-secondary/30 hover:bg-secondary/20"
        onClick={next}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>

      {/* Carousel Content */}
      <div className="overflow-hidden px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative"
          >
            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-12">
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-3xl" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                {/* Image */}
                <div className="relative shrink-0">
                  <div className="absolute -inset-2 bg-gradient-to-br from-secondary to-primary rounded-full opacity-30 blur-md" />
                  <motion.img
                    src={teamMembers[currentIndex].image}
                    alt={teamMembers[currentIndex].name}
                    className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-secondary/30"
                    whileHover={{ scale: 1.05 }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <Quote className="w-10 h-10 text-secondary/40 mb-4 mx-auto md:mx-0" />
                  <p className="text-lg md:text-xl text-foreground/90 italic mb-6 leading-relaxed">
                    "{teamMembers[currentIndex].quote}"
                  </p>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground">
                      {teamMembers[currentIndex].name}
                    </h3>
                    <p className="text-secondary font-medium">{teamMembers[currentIndex].role}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {teamMembers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-secondary w-8"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
