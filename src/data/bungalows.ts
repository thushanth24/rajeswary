export interface Bungalow {
  id: string;
  name: string;
  location: string;
  type: "AC" | "Non-AC" | "Deluxe" | "Suite";
  maxOccupancy: {
    adults: number;
    children: number;
  };
  images: string[];
  amenities: string[];
  description: string;
  rules: string[];
  checkInTime: string;
  checkOutTime: string;
  available: boolean;
}

export const bungalows: Bungalow[] = [
  {
    id: "bungalow-01",
    name: "Lakshmi Nivas",
    location: "East Wing - Near Temple Garden",
    type: "Deluxe",
    maxOccupancy: { adults: 4, children: 2 },
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800"
    ],
    amenities: ["Air Conditioner", "Attached Bathroom", "Hot Water", "TV", "Wi-Fi", "Kitchen Facility", "Refrigerator", "Parking", "Housekeeping", "Power Backup", "Security"],
    description: "A spacious deluxe bungalow with traditional Tamil architecture, featuring a private veranda overlooking the temple garden. Perfect for families attending wedding ceremonies.",
    rules: ["Valid ID proof mandatory", "No smoking inside premises", "No pets allowed", "Quiet hours: 10 PM - 6 AM", "Maximum 6 guests allowed"],
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    available: true
  },
  {
    id: "bungalow-02",
    name: "Saraswathi Illam",
    location: "West Wing - Near Main Hall",
    type: "Suite",
    maxOccupancy: { adults: 6, children: 3 },
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800"
    ],
    amenities: ["Air Conditioner", "Attached Bathroom", "Hot Water", "TV", "Wi-Fi", "Kitchen Facility", "Refrigerator", "Parking", "Housekeeping", "Power Backup", "Security", "Living Room", "Dining Area"],
    description: "Our premium suite with two bedrooms, a spacious living room, and a fully equipped kitchen. Ideal for large families or VIP guests attending ceremonies.",
    rules: ["Valid ID proof mandatory", "No smoking inside premises", "No pets allowed", "Quiet hours: 10 PM - 6 AM", "Maximum 9 guests allowed"],
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    available: true
  },
  {
    id: "bungalow-03",
    name: "Ganesha Kudil",
    location: "North Block - Garden View",
    type: "AC",
    maxOccupancy: { adults: 2, children: 1 },
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"
    ],
    amenities: ["Air Conditioner", "Attached Bathroom", "Hot Water", "TV", "Wi-Fi", "Parking", "Housekeeping", "Power Backup", "Security"],
    description: "A cozy single-bedroom AC room perfect for couples or small families. Features traditional décor with modern comforts.",
    rules: ["Valid ID proof mandatory", "No smoking inside premises", "No pets allowed", "Quiet hours: 10 PM - 6 AM", "Maximum 3 guests allowed"],
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    available: true
  },
  {
    id: "bungalow-04",
    name: "Murugan Maligai",
    location: "South Block - Peaceful Corner",
    type: "Non-AC",
    maxOccupancy: { adults: 3, children: 2 },
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800"
    ],
    amenities: ["Fan", "Attached Bathroom", "Hot Water", "Parking", "Housekeeping", "Power Backup", "Security"],
    description: "An economical non-AC room with excellent ventilation and ceiling fans. Features traditional architecture with attached bathroom.",
    rules: ["Valid ID proof mandatory", "No smoking inside premises", "No pets allowed", "Quiet hours: 10 PM - 6 AM", "Maximum 5 guests allowed"],
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    available: false
  },
  {
    id: "bungalow-05",
    name: "Durga Vilas",
    location: "East Wing - Premium Section",
    type: "Deluxe",
    maxOccupancy: { adults: 4, children: 2 },
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=800"
    ],
    amenities: ["Air Conditioner", "Attached Bathroom", "Hot Water", "TV", "Wi-Fi", "Kitchen Facility", "Refrigerator", "Parking", "Housekeeping", "Power Backup", "Security", "Balcony"],
    description: "A premium deluxe bungalow with a private balcony and garden view. Features elegant traditional décor with all modern amenities.",
    rules: ["Valid ID proof mandatory", "No smoking inside premises", "No pets allowed", "Quiet hours: 10 PM - 6 AM", "Maximum 6 guests allowed"],
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    available: true
  },
  {
    id: "bungalow-06",
    name: "Vishnu Nilayam",
    location: "West Wing - Near Parking",
    type: "AC",
    maxOccupancy: { adults: 3, children: 1 },
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
      "https://images.unsplash.com/photo-1560448075-bb485b067938?w=800"
    ],
    amenities: ["Air Conditioner", "Attached Bathroom", "Hot Water", "TV", "Wi-Fi", "Parking", "Housekeeping", "Power Backup", "Security", "Refrigerator"],
    description: "A comfortable AC room with easy parking access. Ideal for guests who prefer convenience and modern amenities.",
    rules: ["Valid ID proof mandatory", "No smoking inside premises", "No pets allowed", "Quiet hours: 10 PM - 6 AM", "Maximum 4 guests allowed"],
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    available: true
  }
];

export const getBungalowById = (id: string): Bungalow | undefined => {
  return bungalows.find((bungalow) => bungalow.id === id);
};

export const getAvailableBungalows = (): Bungalow[] => {
  return bungalows.filter((bungalow) => bungalow.available);
};

