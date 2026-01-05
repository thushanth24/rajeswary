import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Calendar, PartyPopper, Sparkles, Play } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface EventPhoto {
  id: string;
  image_url: string;
  event_type?: string;
  event_date?: string;
  caption?: string;
}

interface HallEventPhotosProps {
  photos: EventPhoto[];
  hallName: string;
}

export const HallEventPhotos = ({ photos, hallName }: HallEventPhotosProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: { 
      opacity: 1,
      scale: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div>
      {/* Section Header */}
      <motion.div 
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/30 via-secondary/20 to-primary/10 flex items-center justify-center shadow-md"
          whileHover={{ scale: 1.1, rotate: -5 }}
        >
          <PartyPopper className="h-6 w-6 text-secondary" />
        </motion.div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Previous Events
          </h2>
          <p className="text-sm text-muted-foreground">
            Glimpses from {photos.length} beautiful celebrations
          </p>
        </div>
      </motion.div>

      <motion.div 
        className="hidden md:grid grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {photos.slice(0, 6).map((photo, index) => (
          <motion.button
            key={photo.id}
            variants={itemVariants}
            onClick={() => openLightbox(index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            whileHover={{ scale: 1.03, zIndex: 10 }}
            whileTap={{ scale: 0.97 }}
            className={`group relative overflow-hidden rounded-2xl border border-border/50 shadow-sm ${
              index === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-[4/3]"
            }`}
          >
            <motion.img
              src={photo.image_url}
              alt={photo.caption || `Event at ${hallName}`}
              className="w-full h-full object-cover"
              animate={{ 
                scale: hoveredIndex === index ? 1.15 : 1,
                filter: hoveredIndex === index ? "brightness(1.1)" : "brightness(1)",
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
            
            {/* Animated Gradient Overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: hoveredIndex === index ? 1 : 0,
                y: hoveredIndex === index ? 0 : 20,
              }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Sparkle Effect */}
            <motion.div 
              className="absolute top-4 right-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: hoveredIndex === index ? 1 : 0,
                rotate: hoveredIndex === index ? 0 : -180,
              }}
              transition={{ duration: 0.4, type: "spring" }}
            >
              <div className="bg-card/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg">
                <Sparkles className="h-5 w-5 text-secondary" />
              </div>
            </motion.div>

            {/* Play Button Effect for First Image */}
            {index === 0 && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="bg-card/90 backdrop-blur-sm rounded-full p-6 shadow-xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Play className="h-8 w-8 text-primary fill-primary" />
                </motion.div>
              </motion.div>
            )}
            
            {/* Event Info */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 p-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ 
                y: hoveredIndex === index ? 0 : 30,
                opacity: hoveredIndex === index ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {photo.event_type && (
                <motion.span 
                  className="inline-block bg-secondary/90 text-secondary-foreground text-sm font-medium px-3 py-1 rounded-full mb-2 shadow-lg"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ 
                    x: hoveredIndex === index ? 0 : -20,
                    opacity: hoveredIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {photo.event_type}
                </motion.span>
              )}
              {photo.event_date && (
                <motion.div 
                  className="flex items-center gap-1.5 text-card/90 text-sm"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ 
                    x: hoveredIndex === index ? 0 : -20,
                    opacity: hoveredIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(photo.event_date), "MMMM yyyy")}
                </motion.div>
              )}
            </motion.div>

            {/* More Photos Indicator */}
            {index === 5 && photos.length > 6 && (
              <motion.div 
                className="absolute inset-0 bg-foreground/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.span 
                  className="text-card text-4xl font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  +{photos.length - 6}
                </motion.span>
                <span className="text-card/80 text-sm">more memories</span>
              </motion.div>
            )}

            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12"
              initial={{ x: "-100%" }}
              animate={{ x: hoveredIndex === index ? "200%" : "-100%" }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />
          </motion.button>
        ))}
      </motion.div>

      {/* Mobile: Carousel */}
      <div className="md:hidden">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent className="-ml-3">
            {photos.map((photo, index) => (
              <CarouselItem key={photo.id} className="pl-3 basis-[80%]">
                <motion.button
                  onClick={() => openLightbox(index)}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-border/50 shadow-lg"
                >
                  <img
                    src={photo.image_url}
                    alt={photo.caption || `Event at ${hallName}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    {photo.event_type && (
                      <span className="inline-block bg-secondary/90 text-secondary-foreground text-sm font-medium px-3 py-1 rounded-full mb-2">
                        {photo.event_type}
                      </span>
                    )}
                    {photo.event_date && (
                      <div className="flex items-center gap-1.5 text-card/90 text-sm">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(photo.event_date), "MMMM yyyy")}
                      </div>
                    )}
                  </div>
                </motion.button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <Dialog open={selectedIndex !== null} onOpenChange={() => closeLightbox()}>
            <DialogContent className="max-w-6xl p-0 bg-background/95 backdrop-blur-xl border-border/50 overflow-hidden">
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 z-20 bg-background/80 backdrop-blur-sm hover:bg-background text-foreground rounded-full shadow-lg"
                >
                  <X className="h-5 w-5" />
                </Button>

                {/* Main Image with Animation */}
                <div className="relative aspect-video bg-muted overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedIndex}
                      src={photos[selectedIndex].image_url}
                      alt={photos[selectedIndex].caption || `Event at ${hallName}`}
                      className="w-full h-full object-contain"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                    />
                  </AnimatePresence>
                  
                  {/* Navigation */}
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToPrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background text-foreground rounded-full shadow-lg h-12 w-12"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background text-foreground rounded-full shadow-lg h-12 w-12"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </motion.div>

                  {/* Image Counter */}
                  <motion.div 
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-foreground shadow-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {selectedIndex + 1} / {photos.length}
                  </motion.div>
                </div>

                {/* Event Details */}
                <motion.div 
                  className="bg-card border-t border-border p-5"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      {photos[selectedIndex].event_type && (
                        <span className="inline-block bg-secondary/10 text-secondary font-medium px-3 py-1 rounded-full text-sm mb-2">
                          {photos[selectedIndex].event_type}
                        </span>
                      )}
                      {photos[selectedIndex].caption && (
                        <p className="text-foreground">{photos[selectedIndex].caption}</p>
                      )}
                    </div>
                    {photos[selectedIndex].event_date && (
                      <div className="flex items-center gap-2 text-muted-foreground text-sm bg-muted/50 px-4 py-2 rounded-full">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(photos[selectedIndex].event_date), "MMMM d, yyyy")}
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};
