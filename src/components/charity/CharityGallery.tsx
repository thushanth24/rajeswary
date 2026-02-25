import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

import charityFood from "@/assets/charity-food-distribution.jpg";
import charityEducation from "@/assets/charity-education.jpg";
import charityCommunity from "@/assets/charity-community.jpg";
import charityHero from "@/assets/charity-hero.jpg";
import charityClothes from "@/assets/charity-clothes.jpg";
import charityHealth from "@/assets/charity-health.jpg";
import charityTemple from "@/assets/charity-temple.jpg";
import charityEnvironment from "@/assets/charity-environment.jpg";
import charityElderly from "@/assets/charity-elderly.jpg";
import charityWomen from "@/assets/charity-women.jpg";

const galleryImages = [
  { src: charityFood, caption: "Annadhanam – Free Food Distribution", category: "Food" },
  { src: charityEducation, caption: "School Supplies for Students", category: "Education" },
  { src: charityCommunity, caption: "Community Aid Distribution", category: "Community" },
  { src: charityHero, caption: "Grand Charity Feast", category: "Food" },
  { src: charityClothes, caption: "Clothing Distribution at Temple", category: "Welfare" },
  { src: charityHealth, caption: "Free Medical Health Camp", category: "Health" },
  { src: charityTemple, caption: "Temple Restoration Project", category: "Temple" },
  { src: charityEnvironment, caption: "Community Tree Planting Drive", category: "Environment" },
  { src: charityElderly, caption: "Elder Care & Gift Distribution", category: "Welfare" },
  { src: charityWomen, caption: "Women Empowerment Program", category: "Empowerment" },
];

export function CharityGallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const navigate = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background via-card to-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            <Camera className="h-4 w-4" />
            Our Impact in Action
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
            Charity <span className="text-primary">Gallery</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Moments captured from our charity events and community service programs across Jaffna.
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="break-inside-avoid group cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <div className="relative overflow-hidden rounded-2xl border border-border shadow-sm hover:shadow-xl transition-shadow duration-300">
                <img
                  src={image.src}
                  alt={image.caption}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Hover overlay with caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-xs font-semibold text-primary-foreground bg-primary/80 px-2 py-0.5 rounded-full w-fit mb-1.5">
                    {image.category}
                  </span>
                  <p className="text-white text-sm font-medium leading-snug">{image.caption}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-5xl p-0 bg-black/95 border-none overflow-hidden">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-20 text-white hover:bg-white/20 rounded-full"
                onClick={() => setLightboxOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20 rounded-full h-12 w-12"
                onClick={() => navigate("prev")}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20 rounded-full h-12 w-12"
                onClick={() => navigate("next")}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center min-h-[60vh] p-8"
                >
                  <img
                    src={galleryImages[currentIndex].src}
                    alt={galleryImages[currentIndex].caption}
                    className="max-h-[75vh] max-w-full object-contain rounded-lg"
                  />
                  <div className="mt-4 text-center">
                    <span className="text-xs font-semibold text-primary bg-primary/20 px-3 py-1 rounded-full">
                      {galleryImages[currentIndex].category}
                    </span>
                    <p className="text-white/80 text-sm mt-2">{galleryImages[currentIndex].caption}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs">
                {currentIndex + 1} / {galleryImages.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
