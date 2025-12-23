import { Link } from "react-router-dom";
import { Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const videoClips = [
  "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4", // Indian wedding ceremony
  "https://videos.pexels.com/video-files/3327291/3327291-uhd_2560_1440_25fps.mp4", // Traditional decorations
  "https://videos.pexels.com/video-files/5765281/5765281-uhd_2560_1440_25fps.mp4", // Wedding celebration
];

export function CTASection() {
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
            Begin Your Sacred Journey
          </span>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Ready to Book Your{" "}
            <span className="text-primary">Muhurtham</span>?
          </h2>
          
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
            Take the first step towards your dream traditional wedding. Check availability, 
            customize your ceremonies, and secure your auspicious date today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              asChild 
              className="text-base"
            >
              <Link to="/booking">
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Sacred Day
              </Link>
            </Button>
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
          </div>
        </div>
      </div>
    </section>
  );
}
