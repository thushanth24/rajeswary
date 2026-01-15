import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Phone, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import mandapamVideo from "@/assets/wedding-mandapam-video.mp4";

// Low-quality placeholder - tiny base64 blurred image
const LQIP_PLACEHOLDER = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEwPENDPzE2O0FBNjpLPT0+S0tBSUVHSkpXWV1NW2ZbYWRoZGRhZGT/2wBDARUXFx4aHR4eHWRQOlBkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGT/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAwEPwAB//9k=";

const defaultVideos = [mandapamVideo];

interface CTASectionProps {
  subtitle?: string;
  title?: string;
  highlight?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  primaryButtonIcon?: LucideIcon;
  showSecondaryButton?: boolean;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  secondaryButtonIcon?: LucideIcon;
  videos?: string[];
}

export function CTASection({
  subtitle,
  title,
  highlight,
  description,
  primaryButtonText,
  primaryButtonLink = "/booking",
  primaryButtonIcon: PrimaryIcon = Calendar,
  showSecondaryButton = true,
  secondaryButtonText,
  secondaryButtonLink,
  secondaryButtonIcon: SecondaryIcon = Phone,
  videos = defaultVideos,
}: CTASectionProps) {
  const { t } = useLanguage();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoClips = videos;
  
  const displaySubtitle = subtitle || t("cta.subtitle");
  const displayTitle = title || t("cta.title");
  const displayHighlight = highlight || "";
  const displayDescription = description || t("cta.description");
  const displayButtonText = primaryButtonText || t("cta.book");
  const displaySecondaryText = secondaryButtonText || t("cta.call");
  const displaySecondaryLink = secondaryButtonLink || "tel:+919876543210";
  const isSecondaryExternal = ["http://", "https://", "mailto:", "tel:"].some((prefix) =>
    displaySecondaryLink.startsWith(prefix)
  );
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Video Background with LQIP */}
      <div className="absolute inset-0">
        {/* LQIP Placeholder - shows while video loads */}
        <AnimatePresence>
          {!videoLoaded && (
            <motion.div
              className="absolute inset-0 z-10"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <img
                src={LQIP_PLACEHOLDER}
                alt=""
                className="h-full w-full object-cover scale-110 blur-lg"
                aria-hidden="true"
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Video - fades in when loaded */}
        <motion.video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: videoLoaded ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onLoadedData={() => setVideoLoaded(true)}
        >
          <source src={videoClips[0]} type="video/mp4" />
        </motion.video>
        <div className="absolute inset-0 bg-background/70" />
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto py-8">
          <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block">
            {displaySubtitle}
          </span>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {displayTitle}{displayHighlight && " "}
            {displayHighlight && <span className="text-primary">{displayHighlight}</span>}
            {displayHighlight && "?"}
          </h2>
          
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
            {displayDescription}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              size="lg" 
              asChild 
              className="text-sm sm:text-base"
            >
              <Link to={primaryButtonLink}>
                <PrimaryIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <span className="truncate">{displayButtonText}</span>
              </Link>
            </Button>
            {showSecondaryButton && (
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="text-sm sm:text-base"
              >
                {isSecondaryExternal ? (
                  <a href={displaySecondaryLink}>
                    <SecondaryIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                    <span className="truncate">{displaySecondaryText}</span>
                  </a>
                ) : (
                  <Link to={displaySecondaryLink}>
                    <SecondaryIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                    <span className="truncate">{displaySecondaryText}</span>
                  </Link>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
