import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import all 20 images
import img1 from "@/assets/1.jpeg";
import img2 from "@/assets/2.jpeg";
import img3 from "@/assets/3.jpeg";
import img4 from "@/assets/4.jpeg";
import img5 from "@/assets/5.jpeg";
import img6 from "@/assets/6.jpeg";
import img7 from "@/assets/7.jpeg";
import img8 from "@/assets/8.jpeg";
import img9 from "@/assets/9.jpeg";
import img10 from "@/assets/10.jpeg";
import img11 from "@/assets/11.jpeg";
import img12 from "@/assets/12.jpeg";
import img13 from "@/assets/13.jpeg";
import img14 from "@/assets/14.jpeg";
import img15 from "@/assets/15.jpeg";
import img16 from "@/assets/16.jpeg";
import img17 from "@/assets/17.jpeg";
import img18 from "@/assets/18.jpeg";
import img19 from "@/assets/19.jpeg";
import img20 from "@/assets/20.jpeg";

const foodImages = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
  img11, img12, img13, img14, img15, img16, img17, img18, img19, img20
];

export function FoodGallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const navigate = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentIndex((prev) => (prev === 0 ? foodImages.length - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => (prev === foodImages.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-card via-background to-card overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-secondary" />
            <span className="text-secondary text-2xl">🍽️</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-secondary" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-4">
            Our <span className="text-gradient-gold">Food Gallery</span>
          </h2>
        </div>

        {/* Masonry Grid */}
        <motion.div 
          layout
          className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3"
        >
          {foodImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              className="break-inside-avoid group cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={image}
                  alt={`Food ${index + 1}`}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Subtle hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox Modal */}
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-5xl p-0 bg-black/95 border-none overflow-hidden">
            <div className="relative">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-20 text-white hover:bg-white/20 rounded-full"
                onClick={() => setLightboxOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Navigation buttons */}
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

              {/* Image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center min-h-[60vh] p-8"
                >
                  <img
                    src={foodImages[currentIndex]}
                    alt={`Food ${currentIndex + 1}`}
                    className="max-h-[80vh] max-w-full object-contain rounded-lg"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Simple counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                {currentIndex + 1} / {foodImages.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
