import { Link } from "react-router-dom";
import { Calendar, Phone, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import mandapamVideo from "@/assets/wedding-mandapam-video.mp4";

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
  videos = defaultVideos,
}: CTASectionProps) {
  const { t } = useLanguage();
  const videoClips = videos;
  
  const displaySubtitle = subtitle || t("cta.subtitle");
  const displayTitle = title || t("cta.title");
  const displayHighlight = highlight || "";
  const displayDescription = description || t("cta.description");
  const displayButtonText = primaryButtonText || t("cta.book");
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={videoClips[0]} type="video/mp4" />
        </video>
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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              asChild 
              className="text-base"
            >
              <Link to={primaryButtonLink}>
                <PrimaryIcon className="mr-2 h-5 w-5" />
                {displayButtonText}
              </Link>
            </Button>
            {showSecondaryButton && (
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="text-base"
              >
                <a href="tel:+919876543210">
                  <Phone className="mr-2 h-5 w-5" />
                  {t("cta.call")}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
