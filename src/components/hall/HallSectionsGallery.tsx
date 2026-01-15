import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

// Static section images mapping - one cover image per section
import malligaiSection from "@/assets/mallikai.jpeg";
import mullaiSection from "@/assets/mullai.jpeg";
import aambalSection from "@/assets/Aambal.jpeg";
import kondavilSectionA from "@/assets/setion A.jpg";
import kondavil05 from "@/assets/Raajeshwariy Weeding hall Kondavil 05.webp";

interface HallSection {
  id: string;
  name: string;
  display_order: number | null;
  capacity_min: number | null;
  capacity_max: number | null;
}

interface HallSectionsGalleryProps {
  hallId: string;
  hallSlug: string;
  hallName: string;
}

// Map section names to their cover image
const sectionCoverImages: Record<string, string> = {
  // Chelva Palace sections
  "Malligai Aranku": malligaiSection,
  "Mullai Aranku": mullaiSection,
  "Aambal Aranku": aambalSection,
  // Kondavil sections
  "Section A": kondavilSectionA,
  "Section B": kondavil05,
};

// Map section names to their Google Maps embed URLs
const sectionMapEmbeds: Record<string, string> = {
  "Malligai Aranku": "https://www.google.com/maps/embed?pb=!4v1768462727922!6m8!1m7!1sCAoSLEFGMVFpcE5MeWlQdGdtaTVlNEMxR0Vuc05UcWtIVmw3cVd2X3IyNkhiX2M0!2m2!1d9.692194146719507!2d80.01331342829232!3f317.59!4f-2.8100000000000023!5f0.5970117501821992",
  "Mullai Aranku": "https://www.google.com/maps/embed?pb=!4v1768462904767!6m8!1m7!1sCAoSLEFGMVFpcE9jc01NT2FuNEJHbEdSZThzR21HdXMxcEcxc1R5LWFqQTJlQmFl!2m2!1d9.692182608000477!2d80.01328339923796!3f303!4f0!5f0.5970117501821992",
  "Aambal Aranku": "https://www.google.com/maps/embed?pb=!4v1768462960816!6m8!1m7!1sCAoSLEFGMVFpcE90ZW5xMjk4YmR2SWFlQmNtbUx2bkowTWZsd25MTjZiZ2stMmNt!2m2!1d9.692249226120925!2d80.01336836778535!3f308.71!4f-4.469999999999999!5f0.5970117501821992",
};

export function HallSectionsGallery({ hallId, hallSlug, hallName }: HallSectionsGalleryProps) {
  const [sections, setSections] = useState<HallSection[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchSections = async () => {
      const { data, error } = await supabase
        .from("hall_sections")
        .select("id, name, display_order, capacity_min, capacity_max")
        .eq("hall_id", hallId)
        .eq("is_active", true)
        .order("display_order");

      if (!error && data && data.length > 1) {
        setSections((data as any[]).map(s => ({
          id: String(s.id),
          name: String(s.name),
          display_order: s.display_order ?? null,
          capacity_min: s.capacity_min ?? null,
          capacity_max: s.capacity_max ?? null,
        })));
      }
      setLoading(false);
    };

    if (hallId) {
      fetchSections();
    }
  }, [hallId]);

  if (loading || sections.length === 0) {
    return null;
  }

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <span className="text-secondary text-lg sm:text-xl">🏛️</span>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
          Hall Sections
        </h2>
      </div>
      <p className="text-muted-foreground mb-6 text-sm sm:text-base">
        {hallName} features {sections.length} distinct sections, each with its own unique ambiance. 
        You can book individual sections or the entire venue.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section, index) => {
          const coverImage = sectionCoverImages[section.name];

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                {/* Section Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={section.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                  
                  {/* Section Name Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-card">
                      {section.name}
                    </h3>
                    {(section.capacity_min || section.capacity_max) && (
                      <div className="flex items-center gap-1.5 mt-1 text-card/90 text-sm">
                        <Users className="h-4 w-4" />
                        <span>
                          {section.capacity_min && section.capacity_max
                            ? `${section.capacity_min} - ${section.capacity_max} guests`
                            : section.capacity_max
                              ? `Up to ${section.capacity_max} guests`
                              : `${section.capacity_min}+ guests`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Book Button */}
                <CardContent className="p-4">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-primary/50 hover:bg-primary/10 group/btn"
                  >
                    <Link to={`/booking?hall=${hallSlug}&section=${section.id}`}>
                      Book {section.name}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* 360° Virtual Tour Gallery */}
      {sections.some(s => sectionMapEmbeds[s.name]) && (
        <div className="mt-10 sm:mt-12">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <span className="text-secondary text-lg sm:text-xl">🗺️</span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
              360° Virtual Tour
            </h3>
          </div>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">
            Explore each section with our interactive 360° views. Click and drag to look around.
          </p>
          
          <div className="space-y-8">
            {sections.map((section, index) => {
              const mapUrl = sectionMapEmbeds[section.name];
              if (!mapUrl) return null;
              
              return (
                <motion.div
                  key={`map-${section.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="card-traditional overflow-hidden"
                >
                  <div className="p-4 sm:p-5 border-b border-border/50 bg-gradient-to-r from-secondary/10 to-transparent">
                    <h4 className="font-serif text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
                      {section.name}
                    </h4>
                  </div>
                  <div className="aspect-[16/9] sm:aspect-[21/9] w-full">
                    <iframe
                      src={mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${section.name} 360° Virtual Tour`}
                      className="w-full h-full"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
