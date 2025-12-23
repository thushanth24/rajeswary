import serviceCatering from "@/assets/catering-buffet.jpg";
import servicePhotography from "@/assets/service-photography.jpg";
import serviceVehicle from "@/assets/service-vehicle.jpg";
import serviceDecoration from "@/assets/service-decoration.jpg";

export interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
  bookingNote: string;
}

export const services: Service[] = [
  {
    id: "catering",
    name: "Catering & Menu",
    description: "Delight your guests with our exquisite culinary offerings. From traditional delicacies to international cuisines, our expert chefs craft memorable dining experiences tailored to your preferences.",
    image: serviceCatering,
    features: [
      "Multi-cuisine options",
      "Customizable menus",
      "Veg & Non-veg specialties",
      "Live cooking stations",
      "Professional service staff",
      "Dessert & beverage bars",
    ],
    bookingNote: "Menu selection available during booking process",
  },
  {
    id: "photography",
    name: "Photography & Videography",
    description: "Capture every precious moment with our professional photography and videography services. Our experienced team uses state-of-the-art equipment to create timeless memories.",
    image: servicePhotography,
    features: [
      "Pre-wedding shoots",
      "Candid photography",
      "Cinematic videography",
      "Drone coverage",
      "Same-day edits",
      "Photo albums & prints",
    ],
    bookingNote: "Multiple packages available",
  },
  {
    id: "vehicles",
    name: "Wedding Vehicles",
    description: "Arrive in style with our premium fleet of wedding vehicles. From vintage classics to luxury cars, we ensure your grand entry matches the magnificence of your celebration.",
    image: serviceVehicle,
    features: [
      "Vintage car collection",
      "Luxury sedans",
      "Decorated bridal cars",
      "Guest transportation",
      "Professional chauffeurs",
      "Airport transfers",
    ],
    bookingNote: "Vehicle selection during booking",
  },
  {
    id: "decoration",
    name: "Decoration & Themes",
    description: "Transform your venue into a dreamscape with our creative decoration services. Our designers bring your vision to life with stunning floral arrangements, elegant drapes, and thematic setups.",
    image: serviceDecoration,
    features: [
      "Floral arrangements",
      "Theme-based decor",
      "Stage setup",
      "Lighting design",
      "Entrance decoration",
      "Table centerpieces",
    ],
    bookingNote: "Themes can be customized",
  },
  {
    id: "sound-lighting",
    name: "Sound & Lighting",
    description: "Set the perfect ambiance with professional sound and lighting services. From DJ setups to theatrical lighting, we create the atmosphere that makes your event unforgettable.",
    image: serviceDecoration,
    features: [
      "Professional DJ services",
      "LED walls & screens",
      "Theatrical lighting",
      "Sound systems",
      "Special effects",
      "Live band arrangements",
    ],
    bookingNote: "Equipment packages available",
  },
  {
    id: "coordination",
    name: "Event Coordination",
    description: "Let our experienced coordinators handle every detail of your event. From planning to execution, we ensure a seamless, stress-free celebration.",
    image: serviceCatering,
    features: [
      "Day-of coordination",
      "Vendor management",
      "Timeline planning",
      "Guest management",
      "Emergency handling",
      "Post-event cleanup",
    ],
    bookingNote: "Included with premium packages",
  },
];

export const menus = {
  breakfast: [
    {
      name: "Classic Breakfast",
      id: "breakfast-classic",
      items: ["Poori Bhaji", "Idli Sambar", "Upma", "Fresh Fruits", "Tea & Coffee"],
      price: "₹350/person",
    },
    {
      name: "Premium Breakfast",
      id: "breakfast-premium",
      items: ["Continental Spread", "South Indian", "North Indian", "Live Dosa", "Juices & Beverages"],
      price: "₹550/person",
    },
  ],
  lunch: [
    {
      name: "Package A - Traditional",
      id: "lunch-a",
      items: ["Welcome Drink", "2 Starters", "3 Main Course", "Rice & Breads", "2 Desserts"],
      price: "₹800/person",
    },
    {
      name: "Package B - Premium",
      id: "lunch-b",
      items: ["Welcome Drink", "4 Starters", "5 Main Course", "Live Stations", "3 Desserts"],
      price: "₹1,200/person",
    },
    {
      name: "Package C - Royal",
      id: "lunch-c",
      items: ["Mocktails", "6 Starters", "8 Main Course", "Live Counters", "5 Desserts", "Ice Cream Bar"],
      price: "₹1,800/person",
    },
  ],
  dinner: [
    {
      name: "Package A - Elegant",
      id: "dinner-a",
      items: ["Welcome Drink", "3 Starters", "4 Main Course", "Live Chaat", "2 Desserts"],
      price: "₹900/person",
    },
    {
      name: "Package B - Grand",
      id: "dinner-b",
      items: ["Cocktail Hour", "5 Starters", "6 Main Course", "Multiple Live Stations", "4 Desserts"],
      price: "₹1,400/person",
    },
    {
      name: "Package C - Imperial",
      id: "dinner-c",
      items: ["Premium Mocktails", "8 Starters", "10 Main Course", "Interactive Stations", "6 Desserts", "Midnight Snacks"],
      price: "₹2,200/person",
    },
  ],
};
