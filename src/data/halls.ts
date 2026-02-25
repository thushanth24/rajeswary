import kondavilCover from "@/assets/thellipalaicover.jpeg";
import tellipalaiCover from "@/assets/kondavilcover.jpg";
import chelvaMahalCover from "@/assets/chelvamahalcover.jpeg";
import chelvaPalaceCover from "@/assets/palacecover.jpeg";
import urumpiraiCover from "@/assets/Karpaka Raajeshwariy Wedding Hall 01.webp";

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
    id: "chelva-mahal",
    name: "Chelva Mahal",
    slug: "chelva-mahal",
    image: chelvaMahalCover,
    capacity: { min: 300, max: 800 },
    description: "Our flagship venue, Chelva Mahal offers unparalleled elegance with soaring ceilings, crystal chandeliers, and a spacious dance floor. Perfect for grand weddings and large receptions that demand sophistication and style.",
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
    id: "chelva-palace",
    name: "Chelva Palace",
    slug: "chelva-palace",
    image: chelvaPalaceCover,
    capacity: { min: 200, max: 500 },
    description: "Experience royalty at Chelva Palace. Featuring ornate gold accents, plush seating, and exceptional lighting, this venue creates an atmosphere of timeless luxury for your special day.",
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
    id: "raajeshwariy-kondavil",
    name: "Raajeshwariy Wedding Hall Kondavil",
    slug: "raajeshwariy-kondavil",
    image: kondavilCover,
    capacity: { min: 100, max: 300 },
    description: "Raajeshwariy Wedding Hall Kondavil combines intimate elegance with modern amenities. Its warm wooden accents and crystal decorations create a cozy yet sophisticated atmosphere ideal for medium-sized celebrations.",
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
    id: "karpaka-raajeshwariy-urumpirai",
    name: "Karpaka Raajeshwariy Wedding Hall Urumpirai",
    slug: "karpaka-raajeshwariy-urumpirai",
    image: urumpiraiCover,
    capacity: { min: 250, max: 600 },
    description: "A modern masterpiece featuring contemporary design elements, floor-to-ceiling windows, and state-of-the-art amenities. Karpaka Raajeshwariy Wedding Hall brings natural light and elegance together beautifully.",
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
    id: "raajeshwariy-tellipalai",
    name: "Raajeshwariy Wedding Hall Tellipalai",
    slug: "raajeshwariy-tellipalai",
    image: tellipalaiCover,
    capacity: { min: 150, max: 400 },
    description: "An enchanting venue surrounded by lush greenery and twinkling lights. Raajeshwariy Wedding Hall Tellipalai offers a magical wedding experience with a beautiful pavilion.",
    shortDescription: "Magical venue with garden setting and string lights.",
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
