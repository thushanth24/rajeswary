import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn, Images } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface GalleryImage {
  id: string;
  image_url: string;
  caption?: string;
}

interface HallImageGalleryProps {
  images: GalleryImage[];
  hallName: string;
  mainImage: string;
}

export const HallImageGallery = ({ images, hallName, mainImage }: HallImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const allImages: GalleryImage[] = [
    { id: "main", image_url: mainImage, caption: `${hallName} - Main View` },
    ...images,
  ];

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  
  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? allImages.length - 1 : selectedIndex - 1);
    }
  };
  
  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === allImages.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  if (allImages.length <= 1) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0, 
      transition: { duration: 0.4 }
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
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Images className="h-6 w-6 text-secondary" />
        </motion.div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Photo Gallery
          </h2>
          <p className="text-sm text-muted-foreground">
            {allImages.length} stunning venue photos
          </p>
        </div>
      </motion.div>
      
      <motion.div 
        className="hidden md:grid grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {allImages.slice(0, 8).map((image, index) => (
          <motion.button
            key={image.id}
            variants={itemVariants}
            onClick={() => openLightbox(index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            whileHover={{ scale: 1.02, zIndex: 10 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative overflow-hidden rounded-xl border border-border/50 shadow-sm ${
              index === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-[4/3]"
            }`}
          >
            <motion.img
              src={image.image_url}
              alt={image.caption || `${hallName} - Photo ${index + 1}`}
              className="w-full h-full object-cover"
              animate={{ 
                scale: hoveredIndex === index ? 1.1 : 1,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            
            {/* Animated Overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ 
                  scale: hoveredIndex === index ? 1 : 0.5, 
                  opacity: hoveredIndex === index ? 1 : 0 
                }}
                transition={{ duration: 0.3, type: "spring" }}
              >
                <div className="bg-card/95 backdrop-blur-sm rounded-full p-4 shadow-lg">
                  <ZoomIn className="h-6 w-6 text-primary" />
                </div>
              </motion.div>
              
              {image.caption && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 p-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ 
                    y: hoveredIndex === index ? 0 : 20, 
                    opacity: hoveredIndex === index ? 1 : 0 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-card text-sm font-medium">{image.caption}</p>
                </motion.div>
              )}
            </motion.div>

            {/* More Photos Indicator */}
            {index === 7 && allImages.length > 8 && (
              <motion.div 
                className="absolute inset-0 bg-foreground/70 backdrop-blur-sm flex flex-col items-center justify-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.span 
                  className="text-card text-3xl font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  +{allImages.length - 8}
                </motion.span>
                <span className="text-card/80 text-sm">more photos</span>
              </motion.div>
            )}

            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              initial={{ x: "-100%" }}
              animate={{ x: hoveredIndex === index ? "200%" : "-100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </motion.button>
        ))}
      </motion.div>

      {/* Mobile: Carousel */}
      <div className="md:hidden">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent className="-ml-2">
            {allImages.map((image, index) => (
              <CarouselItem key={image.id} className="pl-2 basis-[85%]">
                <motion.button
                  onClick={() => openLightbox(index)}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-border/50 shadow-md"
                >
                  <img
                    src={image.image_url}
                    alt={image.caption || `${hallName} - Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-card text-sm font-medium truncate">
                      {image.caption || `Photo ${index + 1}`}
                    </p>
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
      <Dialog open={selectedIndex !== null} onOpenChange={() => closeLightbox()}>
        <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] p-0 bg-background/95 backdrop-blur-xl border-border/50 overflow-hidden">
          {selectedIndex !== null && (
            <div className="relative flex max-h-[90vh] flex-col overflow-y-auto">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-20 bg-background/80 backdrop-blur-sm hover:bg-background text-foreground rounded-full shadow-lg"
              >
                <X className="h-5 w-5" />
              </Button>
              
              {/* Main Image */}
              <div className="relative bg-muted overflow-hidden h-[60vh] sm:h-[70vh] lg:h-[75vh]">
                <img
                  key={selectedIndex}
                  src={allImages[selectedIndex].image_url}
                  alt={allImages[selectedIndex].caption || `${hallName} - Photo ${selectedIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                
                {/* Navigation Arrows */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background text-foreground rounded-full shadow-lg h-12 w-12"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background text-foreground rounded-full shadow-lg h-12 w-12"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
                
                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-foreground shadow-lg">
                  {selectedIndex + 1} / {allImages.length}
                </div>
              </div>
              
              {/* Caption */}
              {allImages[selectedIndex].caption && (
                <div className="bg-card border-t border-border p-4">
                  <p className="text-foreground text-center font-medium">{allImages[selectedIndex].caption}</p>
                </div>
              )}
              
              {/* Thumbnail Strip */}
              <div className="bg-muted/50 p-4 flex gap-2 overflow-x-auto scrollbar-thin">
                {allImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedIndex(index)}
                    className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      index === selectedIndex 
                        ? "border-secondary shadow-lg shadow-secondary/20" 
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={image.caption || `${hallName} venue photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
