import hallGrandBallroom from "@/assets/hall-grand-ballroom.webp";
import hallRoyalBanquet from "@/assets/hall-royal-banquet.webp";
import hallCrystalPalace from "@/assets/hall-crystal-palace.webp";
import hallEmeraldGarden from "@/assets/hall-emerald-garden.jpg";
import hallSunsetTerrace from "@/assets/hall-sunset-terrace.jpg";

export interface Hall {
  id: string;
  name: string;
  slug: string;
  image: string;
  capacity: { min: number; max: number };
  description: string;
  shortDescription: string;
  features: string[];
  facilities: {
    ac: boolean;
    parking: boolean;
    dining: boolean;
    stage: boolean;
    powerBackup: boolean;
    brideRoom: boolean;
    groomRoom: boolean;
    washrooms: number;
  };
  eventTypes: string[];
  priceRange: string;
}

export const halls: Hall[] = [
  {
    id: "grand-ballroom",
    name: "Grand Ballroom",
    slug: "grand-ballroom",
    image: hallGrandBallroom,
    capacity: { min: 300, max: 800 },
    description: "Our flagship venue, the Grand Ballroom offers unparalleled elegance with soaring ceilings, crystal chandeliers, and a spacious dance floor. Perfect for grand weddings and large receptions that demand sophistication and style.",
    shortDescription: "Elegant venue for grand celebrations with crystal chandeliers and spacious layout.",
    features: ["Crystal Chandeliers", "Grand Entrance", "Private Lawn", "VIP Lounge"],
    facilities: {
      ac: true,
      parking: true,
      dining: true,
      stage: true,
      powerBackup: true,
      brideRoom: true,
      groomRoom: true,
      washrooms: 8,
    },
    eventTypes: ["Wedding", "Reception", "Corporate Event", "Gala Dinner"],
    priceRange: "₹2,50,000 - ₹5,00,000",
  },
  {
    id: "royal-banquet",
    name: "Royal Banquet Hall",
    slug: "royal-banquet",
    image: hallRoyalBanquet,
    capacity: { min: 200, max: 500 },
    description: "Experience royalty at the Royal Banquet Hall. Featuring ornate gold accents, plush seating, and exceptional lighting, this venue creates an atmosphere of timeless luxury for your special day.",
    shortDescription: "Luxurious setting with royal ambiance and gold accents.",
    features: ["Gold Accents", "Royal Decor", "Premium Sound System", "LED Stage"],
    facilities: {
      ac: true,
      parking: true,
      dining: true,
      stage: true,
      powerBackup: true,
      brideRoom: true,
      groomRoom: true,
      washrooms: 6,
    },
    eventTypes: ["Wedding", "Reception", "Engagement", "Birthday Party"],
    priceRange: "₹1,75,000 - ₹3,50,000",
  },
  {
    id: "crystal-palace",
    name: "Crystal Palace",
    slug: "crystal-palace",
    image: hallCrystalPalace,
    capacity: { min: 100, max: 300 },
    description: "The Crystal Palace combines intimate elegance with modern amenities. Its warm wooden accents and crystal decorations create a cozy yet sophisticated atmosphere ideal for medium-sized celebrations.",
    shortDescription: "Intimate elegance with warm ambiance and crystal decorations.",
    features: ["Wooden Ceiling", "Intimate Setting", "Garden View", "Customizable Lighting"],
    facilities: {
      ac: true,
      parking: true,
      dining: true,
      stage: true,
      powerBackup: true,
      brideRoom: true,
      groomRoom: false,
      washrooms: 4,
    },
    eventTypes: ["Wedding", "Engagement", "Anniversary", "Cocktail Party"],
    priceRange: "₹1,00,000 - ₹2,00,000",
  },
  {
    id: "emerald-garden",
    name: "Emerald Garden Hall",
    slug: "emerald-garden",
    image: hallEmeraldGarden,
    capacity: { min: 250, max: 600 },
    description: "A modern masterpiece featuring contemporary design elements, floor-to-ceiling windows, and state-of-the-art amenities. The Emerald Garden Hall brings natural light and elegance together beautifully.",
    shortDescription: "Modern venue with natural lighting and contemporary design.",
    features: ["Floor-to-Ceiling Windows", "Modern Design", "Premium AV System", "Rooftop Access"],
    facilities: {
      ac: true,
      parking: true,
      dining: true,
      stage: true,
      powerBackup: true,
      brideRoom: true,
      groomRoom: true,
      washrooms: 6,
    },
    eventTypes: ["Wedding", "Reception", "Conference", "Exhibition"],
    priceRange: "₹2,00,000 - ₹4,00,000",
  },
  {
    id: "sunset-terrace",
    name: "Sunset Terrace",
    slug: "sunset-terrace",
    image: hallSunsetTerrace,
    capacity: { min: 150, max: 400 },
    description: "An enchanting outdoor venue surrounded by lush greenery and twinkling lights. The Sunset Terrace offers a magical garden wedding experience under the stars with a beautiful pavilion.",
    shortDescription: "Magical outdoor venue with garden setting and string lights.",
    features: ["Outdoor Setting", "Garden Pavilion", "String Lights", "Natural Backdrop"],
    facilities: {
      ac: false,
      parking: true,
      dining: true,
      stage: true,
      powerBackup: true,
      brideRoom: true,
      groomRoom: true,
      washrooms: 4,
    },
    eventTypes: ["Garden Wedding", "Reception", "Cocktail Party", "Pre-Wedding"],
    priceRange: "₹1,50,000 - ₹3,00,000",
  },
];

export const getHallById = (id: string): Hall | undefined => {
  return halls.find((hall) => hall.id === id);
};

export const getHallBySlug = (slug: string): Hall | undefined => {
  return halls.find((hall) => hall.slug === slug);
};
