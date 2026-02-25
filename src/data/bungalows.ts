import bungalowDouble1 from "@/assets/bungalow-double-1.jpeg";
import bungalowDouble2 from "@/assets/bungalow-double-2.jpeg";
import bungalowDouble3 from "@/assets/bungalow-double-3.jpeg";
import bungalowDouble4 from "@/assets/bungalow-double-4.jpeg";

export interface Bungalow {
  id: string;
  name: string;
  location: string;
  type: "Double Room" | "Triple Room" | "Family Room";
  acType: "AC" | "Non-AC";
  maxOccupancy: {
    adults: number;
    children: number;
  };
  tariff: {
    roomOnly: number;
    bbWithRoom: number;
    fullBoard: number;
  };
  images: string[];
  amenities: string[];
  description: string;
  rules: string[];
  checkInTime: string;
  checkOutTime: string;
  available: boolean;
}

const RULES = [
  "Valid ID proof mandatory",
  "Pets not allowed",
  "Unmarried couples not allowed",
  "No smoking inside rooms",
];

function makeDoubleRooms(): Bungalow[] {
  const acRooms = Array.from({ length: 8 }, (_, i) => ({
    id: `double-ac-${i + 1}`,
    name: `Double Room AC-${i + 1}`,
    location: "East Wing",
    type: "Double Room" as const,
    acType: "AC" as const,
    maxOccupancy: { adults: 2, children: 1 },
    tariff: { roomOnly: 6000, bbWithRoom: 8000, fullBoard: 12000 },
    images: [bungalowDouble1, bungalowDouble2, bungalowDouble3, bungalowDouble4],
    amenities: ["Air Conditioner", "Attached Bathroom", "Hot Water", "TV", "Wi-Fi", "Parking", "Housekeeping", "Power Backup", "Security"],
    description: "Comfortable air-conditioned double room with modern amenities.",
    rules: RULES,
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    available: true,
  }));
  const nonAcRooms = Array.from({ length: 4 }, (_, i) => ({
    id: `double-nonac-${i + 1}`,
    name: `Double Room Non-AC-${i + 1}`,
    location: "East Wing",
    type: "Double Room" as const,
    acType: "Non-AC" as const,
    maxOccupancy: { adults: 2, children: 1 },
    tariff: { roomOnly: 5000, bbWithRoom: 8000, fullBoard: 12000 },
    images: [bungalowDouble1, bungalowDouble2, bungalowDouble3, bungalowDouble4],
    amenities: ["Fan", "Attached Bathroom", "Hot Water", "TV", "Wi-Fi", "Parking", "Housekeeping", "Power Backup", "Security"],
    description: "Well-ventilated double room with ceiling fans and essential amenities.",
    rules: RULES,
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    available: true,
  }));
  return [...acRooms, ...nonAcRooms];
}

function makeTripleRooms(): Bungalow[] {
  const acRooms = Array.from({ length: 4 }, (_, i) => ({
    id: `triple-ac-${i + 1}`,
    name: `Triple Room AC-${i + 1}`,
    location: "West Wing",
    type: "Triple Room" as const,
    acType: "AC" as const,
    maxOccupancy: { adults: 3, children: 1 },
    tariff: { roomOnly: 9000, bbWithRoom: 12000, fullBoard: 18000 },
    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"],
    amenities: ["Air Conditioner", "Attached Bathroom", "Hot Water", "TV", "Wi-Fi", "Parking", "Housekeeping", "Power Backup", "Security", "Refrigerator"],
    description: "Spacious air-conditioned triple room ideal for families.",
    rules: RULES,
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    available: true,
  }));
  const nonAcRooms = Array.from({ length: 2 }, (_, i) => ({
    id: `triple-nonac-${i + 1}`,
    name: `Triple Room Non-AC-${i + 1}`,
    location: "West Wing",
    type: "Triple Room" as const,
    acType: "Non-AC" as const,
    maxOccupancy: { adults: 3, children: 1 },
    tariff: { roomOnly: 8000, bbWithRoom: 12000, fullBoard: 18000 },
    images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"],
    amenities: ["Fan", "Attached Bathroom", "Hot Water", "TV", "Wi-Fi", "Parking", "Housekeeping", "Power Backup", "Security"],
    description: "Comfortable non-AC triple room with natural ventilation.",
    rules: RULES,
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    available: true,
  }));
  return [...acRooms, ...nonAcRooms];
}

function makeFamilyRooms(): Bungalow[] {
  return [
    {
      id: "family-ac",
      name: "Family Room AC",
      location: "North Block",
      type: "Family Room",
      acType: "AC",
      maxOccupancy: { adults: 4, children: 1 },
      tariff: { roomOnly: 12000, bbWithRoom: 16000, fullBoard: 24000 },
      images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800"],
      amenities: ["Air Conditioner", "Attached Bathroom", "Hot Water", "TV", "Wi-Fi", "Kitchen Facility", "Refrigerator", "Parking", "Housekeeping", "Power Backup", "Security", "Living Room"],
      description: "Premium air-conditioned family room with spacious living area.",
      rules: RULES,
      checkInTime: "12:00 PM",
      checkOutTime: "11:00 AM",
      available: true,
    },
    {
      id: "family-nonac",
      name: "Family Room Non-AC",
      location: "North Block",
      type: "Family Room",
      acType: "Non-AC",
      maxOccupancy: { adults: 4, children: 1 },
      tariff: { roomOnly: 10000, bbWithRoom: 16000, fullBoard: 24000 },
      images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"],
      amenities: ["Fan", "Attached Bathroom", "Hot Water", "TV", "Wi-Fi", "Kitchen Facility", "Refrigerator", "Parking", "Housekeeping", "Power Backup", "Security", "Living Room"],
      description: "Spacious non-AC family room with excellent ventilation.",
      rules: RULES,
      checkInTime: "12:00 PM",
      checkOutTime: "11:00 AM",
      available: true,
    },
  ];
}

export const bungalows: Bungalow[] = [
  ...makeDoubleRooms(),
  ...makeTripleRooms(),
  ...makeFamilyRooms(),
];

export const getBungalowById = (id: string): Bungalow | undefined => {
  return bungalows.find((bungalow) => bungalow.id === id);
};

export const getAvailableBungalows = (): Bungalow[] => {
  return bungalows.filter((bungalow) => bungalow.available);
};
