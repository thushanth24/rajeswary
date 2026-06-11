import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { FloatingElements } from "@/components/animations/FloatingElements";
import { RangoliPattern } from "@/components/animations/RangoliPattern";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

// Import event images
import chelvaMahal01 from "@/assets/chelva mahal 01.webp";
import chelvaMahal02 from "@/assets/chelva mahal 02.webp";
import chelvaMahal03 from "@/assets/chelva mahal 03.webp";
import chelvaMahal04 from "@/assets/chelva mahal 04.webp";
import chelvaMahal05 from "@/assets/chelva mahal 05.webp";

import chelvaPalace01 from "@/assets/Chelva Palace 01.webp";
import chelvaPalace02 from "@/assets/Chelva Palace 02.webp";
import chelvaPalace03 from "@/assets/Chelva Palace 03.webp";
import chelvaPalace04 from "@/assets/Chelva Palace 04.webp";
import chelvaPalace05 from "@/assets/Chelva Palace 05.webp";

import karpakaHall01 from "@/assets/Karpaka Raajeshwariy Wedding Hall 01.webp";
import karpakaHall02 from "@/assets/Karpaka Raajeshwariy Wedding Hall 02.webp";
import karpakaHall03 from "@/assets/Karpaka Raajeshwariy Wedding Hall 03.webp";
import karpakaHall04 from "@/assets/Karpaka Raajeshwariy Wedding Hall 04.webp";
import karpakaHall05 from "@/assets/Karpaka Raajeshwariy Wedding Hall 05.webp";

import tellipalai01 from "@/assets/Raajeshwariy Wedding Hall Tellipalai 01.webp";
import tellipalai02 from "@/assets/Raajeshwariy Wedding Hall Tellipalai 02.webp";
import tellipalai03 from "@/assets/Raajeshwariy Wedding Hall Tellipalai 03.webp";
import tellipalai04 from "@/assets/Raajeshwariy Wedding Hall Tellipalai 04.webp";
import tellipalai05 from "@/assets/Raajeshwariy Wedding Hall Tellipalai 05.webp";

import kondavil01 from "@/assets/Raajeshwariy Weeding hall Kondavil 01.webp";
import kondavil02 from "@/assets/Raajeshwariy Weeding hall Kondavil 02.webp";
import kondavil03 from "@/assets/Raajeshwariy Weeding hall Kondavil 03.webp";
import kondavil04 from "@/assets/Raajeshwariy Weeding hall Kondavil 04.webp";
import kondavil05 from "@/assets/Raajeshwariy Weeding hall Kondavil 05.webp";

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface GalleryCategory {
  id: string;
  title: string;
  description: string;
  images: GalleryImage[];
}

interface UploadedGalleryPhoto {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  is_active: boolean;
}

interface UploadedGalleryAlbum {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  halls?: { name: string } | null;
  hall_gallery_photos?: UploadedGalleryPhoto[];
}

const GalleryPage = () => {
  const { t } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState<GalleryImage[]>([]);
  const [uploadedEventCategories, setUploadedEventCategories] = useState<GalleryCategory[]>([]);

  useEffect(() => {
    const fetchUploadedAlbums = async () => {
      const { data, error } = await (supabase as any)
        .from("hall_gallery_albums")
        .select("id, title, description, event_date, halls(name), hall_gallery_photos(*)")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching gallery albums:", error);
        return;
      }

      const categories = (data || [])
        .map((album: UploadedGalleryAlbum) => {
          const photos = (album.hall_gallery_photos || [])
            .filter((photo) => photo.is_active)
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

          return {
            id: album.id,
            title: album.halls?.name ? `${album.title} - ${album.halls.name}` : album.title,
            description: album.description || (album.event_date ? `Event date: ${album.event_date}` : "Uploaded event album"),
            images: photos.map((photo) => ({
              src: photo.image_url,
              alt: photo.caption || album.title,
              caption: photo.caption || album.title,
            })),
          };
        })
        .filter((category: GalleryCategory) => category.images.length > 0);

      setUploadedEventCategories(categories);
    };

    fetchUploadedAlbums();
  }, []);

  const eventCategories: GalleryCategory[] = [
    {
      id: "chelva-mahal",
      title: "Chelva Mahal Events",
      description: "Grand celebrations at our flagship venue",
      images: [
        { src: chelvaMahal01, alt: "Chelva Mahal Event 1", caption: "Wedding Reception" },
        { src: chelvaMahal02, alt: "Chelva Mahal Event 2", caption: "Traditional Ceremony" },
        { src: chelvaMahal03, alt: "Chelva Mahal Event 3", caption: "Grand Celebration" },
        { src: chelvaMahal04, alt: "Chelva Mahal Event 4", caption: "Cultural Event" },
        { src: chelvaMahal05, alt: "Chelva Mahal Event 5", caption: "Family Gathering" },
      ],
    },
    {
      id: "chelva-palace",
      title: "Chelva Palace Events",
      description: "Royal celebrations with elegant décor",
      images: [
        { src: chelvaPalace01, alt: "Chelva Palace Event 1", caption: "Royal Wedding" },
        { src: chelvaPalace02, alt: "Chelva Palace Event 2", caption: "Engagement Ceremony" },
        { src: chelvaPalace03, alt: "Chelva Palace Event 3", caption: "Anniversary Celebration" },
        { src: chelvaPalace04, alt: "Chelva Palace Event 4", caption: "Corporate Gala" },
        { src: chelvaPalace05, alt: "Chelva Palace Event 5", caption: "Birthday Party" },
      ],
    },
    {
      id: "karpaka",
      title: "Karpaka Raajeshwariy Events",
      description: "Memorable moments at our beautiful venue",
      images: [
        { src: karpakaHall01, alt: "Karpaka Hall Event 1", caption: "Wedding Ceremony" },
        { src: karpakaHall02, alt: "Karpaka Hall Event 2", caption: "Reception Party" },
        { src: karpakaHall03, alt: "Karpaka Hall Event 3", caption: "Sangeet Night" },
        { src: karpakaHall04, alt: "Karpaka Hall Event 4", caption: "Mehendi Function" },
        { src: karpakaHall05, alt: "Karpaka Hall Event 5", caption: "Haldi Ceremony" },
      ],
    },
    {
      id: "tellipalai",
      title: "Raajeshwariy Tellipalai Events",
      description: "Traditional celebrations in serene surroundings",
      images: [
        { src: tellipalai01, alt: "Tellipalai Event 1", caption: "Traditional Wedding" },
        { src: tellipalai02, alt: "Tellipalai Event 2", caption: "Temple Wedding" },
        { src: tellipalai03, alt: "Tellipalai Event 3", caption: "Cultural Program" },
        { src: tellipalai04, alt: "Tellipalai Event 4", caption: "Family Function" },
        { src: tellipalai05, alt: "Tellipalai Event 5", caption: "Reception Dinner" },
      ],
    },
    {
      id: "kondavil",
      title: "Raajeshwariy Kondavil Events",
      description: "Intimate gatherings with warm hospitality",
      images: [
        { src: kondavil01, alt: "Kondavil Event 1", caption: "Garden Wedding" },
        { src: kondavil02, alt: "Kondavil Event 2", caption: "Outdoor Celebration" },
        { src: kondavil03, alt: "Kondavil Event 3", caption: "Evening Reception" },
        { src: kondavil04, alt: "Kondavil Event 4", caption: "Pre-Wedding Party" },
        { src: kondavil05, alt: "Kondavil Event 5", caption: "Cocktail Night" },
      ],
    },
  ];

  /*
  const serviceCategories: GalleryCategory[] = [
    {
      id: "decoration",
      title: "Decoration",
      description: "Stunning floral and traditional décor",
      images: [
        { src: serviceDecoration, alt: "Decoration 1", caption: "Floral Mandap" },
        { src: chelvaMahal01, alt: "Decoration 2", caption: "Stage Decoration" },
        { src: chelvaPalace01, alt: "Decoration 3", caption: "Hall Setup" },
        { src: karpakaHall01, alt: "Decoration 4", caption: "Traditional Décor" },
        { src: tellipalai01, alt: "Decoration 5", caption: "Entrance Decoration" },
      ],
    },
    {
      id: "photography",
      title: "Photography & Videography",
      description: "Capturing your precious moments",
      images: [
        { src: servicePhotography, alt: "Photography 1", caption: "Wedding Shoot" },
        { src: chelvaMahal02, alt: "Photography 2", caption: "Couple Portrait" },
        { src: chelvaPalace02, alt: "Photography 3", caption: "Candid Moments" },
        { src: karpakaHall02, alt: "Photography 4", caption: "Family Photos" },
        { src: tellipalai02, alt: "Photography 5", caption: "Ceremony Coverage" },
      ],
    },
    {
      id: "music",
      title: "DJ & Music",
      description: "Entertainment that sets the mood",
      images: [
        { src: serviceDjMusic, alt: "DJ Music 1", caption: "DJ Setup" },
        { src: chelvaMahal03, alt: "DJ Music 2", caption: "Dance Floor" },
        { src: chelvaPalace03, alt: "DJ Music 3", caption: "Live Music" },
        { src: karpakaHall03, alt: "DJ Music 4", caption: "Sound System" },
        { src: kondavil01, alt: "DJ Music 5", caption: "Party Night" },
      ],
    },
    {
      id: "makeup",
      title: "Bridal Makeup",
      description: "Professional beauty services",
      images: [
        { src: serviceMakeup, alt: "Makeup 1", caption: "Bridal Look" },
        { src: serviceJewellery, alt: "Makeup 2", caption: "Traditional Styling" },
        { src: chelvaMahal04, alt: "Makeup 3", caption: "Mehendi Artist" },
        { src: chelvaPalace04, alt: "Makeup 4", caption: "Hair Styling" },
        { src: karpakaHall04, alt: "Makeup 5", caption: "Bride Ready" },
      ],
    },
    {
      id: "catering",
      title: "Catering",
      description: "Delicious traditional cuisine",
      images: [
        { src: cateringBuffet, alt: "Catering 1", caption: "Buffet Setup" },
        { src: chelvaMahal05, alt: "Catering 2", caption: "Food Display" },
        { src: chelvaPalace05, alt: "Catering 3", caption: "Traditional Feast" },
        { src: karpakaHall05, alt: "Catering 4", caption: "Sweet Counter" },
        { src: tellipalai03, alt: "Catering 5", caption: "Live Kitchen" },
      ],
    },
    {
      id: "vehicle",
      title: "Vehicle Services",
      description: "Luxury transportation for your special day",
      images: [
        { src: serviceVehicle, alt: "Vehicle 1", caption: "Wedding Car" },
        { src: tellipalai04, alt: "Vehicle 2", caption: "Decorated Vehicle" },
        { src: tellipalai05, alt: "Vehicle 3", caption: "Luxury Fleet" },
        { src: kondavil02, alt: "Vehicle 4", caption: "Guest Transport" },
        { src: kondavil03, alt: "Vehicle 5", caption: "Arrival in Style" },
      ],
    },
  ];
  */

  const allEventCategories = [...uploadedEventCategories, ...eventCategories];

  const openLightbox = (images: GalleryImage[], index: number) => {
    setCurrentCategory(images);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentCategory.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + currentCategory.length) % currentCategory.length);
  };

  const GalleryGrid = ({ category }: { category: GalleryCategory }) => (
    <div className="mb-12 animate-fade-in-up">
      <div className="mb-6">
        <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-2">
          {category.title}
        </h3>
        <p className="text-muted-foreground text-sm">{category.description}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {category.images.map((image, index) => (
          <div
            key={index}
            className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer card-traditional"
            onClick={() => openLightbox(category.images, index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-card text-xs md:text-sm font-medium truncate">
                {image.caption}
              </p>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-secondary/90 rounded-full p-1.5">
                <Camera className="h-3 w-3 text-secondary-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Layout>
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-secondary/20 via-card to-background overflow-hidden">
        <FloatingElements type="petals" density="low" />
        <RangoliPattern position="center" size="lg" opacity={0.08} />

        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-secondary" />
            <span className="text-secondary text-2xl">📸</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-secondary" />
          </div>

          <span className="text-secondary font-medium tracking-wider uppercase text-sm animate-fade-in">
            ✦ Our Memories ✦
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6 animate-fade-in-up">
            Photo <span className="text-gradient-gold">Gallery</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Explore beautiful moments from our past events and discover the magic we create for every celebration
          </p>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="relative py-16 bg-background overflow-hidden">
        <DecorativeBorder position="top" />
        <div className="absolute inset-0 paisley-bg opacity-20" />

        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
                Past <span className="text-gradient-gold">Events</span>
              </h2>
              <p className="text-muted-foreground">Cherished moments from celebrations we've hosted</p>
            </div>
            {allEventCategories.map((category, index) => (
              <div key={category.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <GalleryGrid category={category} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 bg-foreground/95 border-none">
          <div className="relative h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-card/20 hover:bg-card/40 transition-colors"
            >
              <X className="h-6 w-6 text-card" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 z-50 p-2 rounded-full bg-card/20 hover:bg-card/40 transition-colors"
            >
              <ChevronLeft className="h-8 w-8 text-card" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 z-50 p-2 rounded-full bg-card/20 hover:bg-card/40 transition-colors"
            >
              <ChevronRight className="h-8 w-8 text-card" />
            </button>

            {/* Image */}
            {currentCategory.length > 0 && (
              <div className="flex flex-col items-center max-h-full p-8">
                <img
                  src={currentCategory[currentImageIndex]?.src}
                  alt={currentCategory[currentImageIndex]?.alt}
                  className="max-h-[70vh] max-w-full object-contain rounded-lg"
                />
                <p className="text-card mt-4 text-lg font-medium">
                  {currentCategory[currentImageIndex]?.caption}
                </p>
                <p className="text-card/60 text-sm mt-1">
                  {currentImageIndex + 1} / {currentCategory.length}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default GalleryPage;
