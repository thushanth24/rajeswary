import { Link } from "react-router-dom";
import { Calendar, Phone, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const videoClips = [
  "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/3327291/3327291-uhd_2560_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/5765281/5765281-uhd_2560_1440_25fps.mp4",
];

interface CTASectionProps {
  subtitle?: string;
  title?: string;
  highlight?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  primaryButtonIcon?: LucideIcon;
  showSecondaryButton?: boolean;
}

export function CTASection({
  subtitle = "Begin Your Sacred Journey",
  title = "Ready to Book Your",
  highlight = "Muhurtham",
  description = "Take the first step towards your dream traditional wedding. Check availability, customize your ceremonies, and secure your auspicious date today.",
  primaryButtonText = "Book Your Sacred Day",
  primaryButtonLink = "/booking",
  primaryButtonIcon: PrimaryIcon = Calendar,
  showSecondaryButton = true,
}: CTASectionProps) {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Video Background Grid */}
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3 gap-1">
        {videoClips.map((video, index) => (
          <div key={index} className="relative overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={video} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-background/70" />
          </div>
        ))}
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto py-8">
          <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block">
            {subtitle}
          </span>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {title}{" "}
            <span className="text-primary">{highlight}</span>?
          </h2>
          
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              asChild 
              className="text-base"
            >
              <Link to={primaryButtonLink}>
                <PrimaryIcon className="mr-2 h-5 w-5" />
                {primaryButtonText}
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
                  Speak With Us
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
