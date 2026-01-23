import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Maximize2, Grid3X3, Download, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HallFloorPlanProps {
  floorPlanUrl: string;
  hallName: string;
}

export const HallFloorPlan = ({ floorPlanUrl, hallName }: HallFloorPlanProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => prev + 90);
  const resetView = () => {
    setZoom(1);
    setRotation(0);
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
          <Grid3X3 className="h-6 w-6 text-secondary" />
        </motion.div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Floor Plan
          </h2>
          <p className="text-sm text-muted-foreground">
            Detailed venue layout and dimensions
          </p>
        </div>
      </motion.div>

      {/* Floor Plan Card */}
      <motion.div 
        className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Decorative Border Animation */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/10"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
        
        <motion.button
          onClick={() => setIsOpen(true)}
          className="relative w-full"
          whileTap={{ scale: 0.99 }}
        >
          {/* Image Container */}
          <div className="relative aspect-video bg-gradient-to-br from-muted/50 to-muted p-4 md:p-8 overflow-hidden">
            {/* Grid Pattern Background */}
            <motion.div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                                  linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)`,
                backgroundSize: '30px 30px',
              }}
              animate={{ 
                opacity: isHovered ? 0.5 : 0.3,
              }}
              transition={{ duration: 0.3 }}
            />

            <motion.img
              src={floorPlanUrl}
              alt={`${hallName} - Floor Plan`}
              className="w-full h-full object-contain rounded-lg relative z-10"
              animate={{ 
                scale: isHovered ? 1.02 : 1,
              }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Hover Overlay */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="bg-card/95 backdrop-blur-sm rounded-2xl px-8 py-5 shadow-xl flex items-center gap-4"
                initial={{ scale: 0.8, y: 20 }}
                animate={{ 
                  scale: isHovered ? 1 : 0.8,
                  y: isHovered ? 0 : 20,
                }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Maximize2 className="h-6 w-6 text-primary" />
                </motion.div>
                <span className="text-foreground font-semibold text-lg">View Full Size</span>
              </motion.div>
            </motion.div>
            
            {/* Animated Corner Accents */}
            <motion.div 
              className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-secondary rounded-tl-lg"
              animate={{ 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.div 
              className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-secondary rounded-tr-lg"
              animate={{ 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.5,
              }}
              transition={{ duration: 0.3, delay: 0.05 }}
            />
            <motion.div 
              className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-secondary rounded-bl-lg"
              animate={{ 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.5,
              }}
              transition={{ duration: 0.3, delay: 0.1 }}
            />
            <motion.div 
              className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-secondary rounded-br-lg"
              animate={{ 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.5,
              }}
              transition={{ duration: 0.3, delay: 0.15 }}
            />

            {/* Pulse Ring Effect */}
            <motion.div
              className="absolute inset-0 border-2 border-secondary/30 rounded-lg"
              animate={{ 
                scale: isHovered ? [1, 1.02, 1] : 1,
                opacity: isHovered ? [0.5, 0.2, 0.5] : 0,
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.button>

        {/* Footer */}
        <motion.div 
          className="p-4 bg-gradient-to-r from-muted/30 via-transparent to-muted/30 border-t border-border/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <motion.p 
              className="text-sm text-muted-foreground"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              Click to view the detailed floor plan layout
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary hover:bg-primary/10"
                onClick={() => setIsOpen(true)}
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                Expand
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Full Size Dialog with Zoom Controls */}
      <AnimatePresence>
        {isOpen && (
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetView(); }}>
            <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] p-0 bg-background border-border/50 overflow-hidden">
              <motion.div 
                className="relative flex max-h-[90vh] flex-col overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-card">
                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary/30 to-primary/20 flex items-center justify-center">
                      <Grid3X3 className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-foreground">
                        {hallName}
                      </h3>
                      <p className="text-sm text-muted-foreground">Floor Plan Layout</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-2"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    {/* Zoom Controls */}
                    <div className="hidden md:flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleZoomOut}
                        disabled={zoom <= 0.5}
                        className="h-8 w-8"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center text-sm font-medium">
                        {Math.round(zoom * 100)}%
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleZoomIn}
                        disabled={zoom >= 2}
                        className="h-8 w-8"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <div className="w-px h-6 bg-border mx-1" />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRotate}
                        className="h-8 w-8"
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden md:flex"
                      onClick={() => window.open(floorPlanUrl, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setIsOpen(false); resetView(); }}
                      className="rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>
                
                {/* Floor Plan with Zoom */}
                <motion.div 
                  className="p-4 md:p-8 bg-gradient-to-br from-muted/30 to-muted/50 overflow-auto flex-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div 
                    className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-inner flex items-center justify-center min-h-[50vh]"
                  >
                    <motion.img
                      src={floorPlanUrl}
                      alt={`${hallName} - Floor Plan`}
                      className="max-w-full max-h-[70vh] object-contain"
                      animate={{ 
                        scale: zoom,
                        rotate: rotation,
                      }}
                      transition={{ duration: 0.3 }}
                      drag
                      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                      dragElastic={0.1}
                    />
                  </motion.div>
                </motion.div>

                {/* Mobile Zoom Controls */}
                <motion.div 
                  className="md:hidden flex items-center justify-center gap-2 p-4 bg-card border-t border-border"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 0.5}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center text-sm font-medium">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 2}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRotate}>
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};
