import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

export function HallSectionsGallery({ hallId, hallSlug, hallName }: HallSectionsGalleryProps) {
  const [sections, setSections] = useState<HallSection[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchSections = async () => {
      const { data, error } = await supabase
        .from("hall_sections")
        .select("id, name, display_order")
        .eq("hall_id", hallId)
        .eq("is_active", true)
        .order("display_order");

      if (!error && data && data.length > 1) {
        setSections(data);
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
    </div>
  );
}
