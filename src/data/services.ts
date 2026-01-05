import serviceCatering from "@/assets/catering-buffet.jpg";
import servicePhotography from "@/assets/service-photography.jpg";
import serviceVehicle from "@/assets/service-vehicle.jpg";
import serviceDecoration from "@/assets/service-decoration.jpg";

export type ServiceCategory = "essential" | "premium" | "addon";
export type ServiceBadge = "popular" | "premium" | "new" | null;

export interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
  bookingNote: string;
  category: ServiceCategory;
  badge: ServiceBadge;
  icon: string;
  priceRange?: string;
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
    category: "essential",
    badge: "popular",
    icon: "🍽️",
    priceRange: "₹350 - ₹2,200/person",
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
    category: "essential",
    badge: "popular",
    icon: "📸",
    priceRange: "₹50,000 - ₹3,00,000",
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
    category: "premium",
    badge: "premium",
    icon: "🚗",
    priceRange: "₹15,000 - ₹75,000",
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
    category: "essential",
    badge: null,
    icon: "🌸",
    priceRange: "₹1,00,000 - ₹5,00,000",
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
    category: "addon",
    badge: "new",
    icon: "🎵",
    priceRange: "₹25,000 - ₹1,50,000",
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
    category: "premium",
    badge: "premium",
    icon: "📋",
    priceRange: "₹30,000 - ₹1,00,000",
  },
];

export const menus = {
  pubertVeg: [
    {
      name: "Silver Package",
      id: "pubert-veg-silver",
      items: [
        "Starter: Soft drink, Poondhi Laddu",
        "Rice: Kutharisi Soru, Manjal Soru",
        "Curries: Paruppu Kari, Kadalai Katharikai Kari, Urulaikizhangu Kuzhambu, Paal Kari, Vengaya Sambal",
        "Side dishes: Kadalai Vadai, Milagai Poriyal, Appalam",
        "Desserts: Paayaasam, Ice Cream, Water Bottle"
      ],
      price: "Rs. 1,000/person",
    },
    {
      name: "Gold Package",
      id: "pubert-veg-gold",
      items: [
        "Starter: Soft drink, Poondhi Laddu",
        "Rice: Marakkari Biriyani, Kutharisi Soru, White Rice",
        "Curries: Paruppu Kari, Kadalai Katharikai Kari, Urulaikizhangu Kari, Kuzhambu, Soya Meat Deval, Salad / Raitha",
        "Side dishes: Ulunthu Vadai, Milagai Poriyal, Appalam, Rasam",
        "Desserts: Paayaasam, Ice Cream, Beeda, Water Bottle"
      ],
      price: "Rs. 1,200/person",
    },
    {
      name: "Platinum Package",
      id: "pubert-veg-platinum",
      items: [
        "Starter: Soft drink, Poondhi Laddu, Patties",
        "Rice: Marakkari Biriyani (60%), Kutharisi Soru (30%), Fried Rice (10%)",
        "Curries: Paruppu Kari, Urulaikizhangu Kari, Kuzhambu, Paneer Kari, Soya Meat Deval, Ponnanganni + Mixer Varai, Salad / Raitha",
        "Side dishes: Ulunthu Vadai, Milagai Poriyal, Appalam, Vazhaikkai Poriyal, Thayir, Rasam",
        "Desserts: Paayaasam, Ice Cream & Fruit Salad, Beeda, Thanneer Pothal"
      ],
      price: "Rs. 1,500/person",
    },
  ],
  pubertNonVeg: [
    {
      name: "Silver Package",
      id: "pubert-nonveg-silver",
      items: [
        "Starter: Soft drink, Cake",
        "Rice: Kutharisi Soru, Manjal Soru",
        "Main Curries: Kozhi Kari, Avitha Muttai, Paruppu Masala, Katharikai Moyu / Pineapple Moyu, Sambal",
        "Desserts: Ice Cream, Water Bottle"
      ],
      price: "Rs. 1,200/person",
    },
    {
      name: "Gold Package",
      id: "pubert-nonveg-gold",
      items: [
        "Starter: Soft drink, Cake",
        "Rice: Marakkari Biriyani, Kutharisi Soru, White Rice",
        "Main Curries: Kozhi Kuzhambu, Kozhi Deval, Avitha Muttai, Urulaikizhangu Thelthal, Paruppu Masala, Katharikai Moyu, Maasi Sambal",
        "Desserts: Ice Cream, Beeda, Water Bottle"
      ],
      price: "Rs. 1,700/person",
    },
    {
      name: "Platinum Package",
      id: "pubert-nonveg-platinum",
      items: [
        "Starter: Soft drink / Fresh Juice, Cake, Rolls",
        "Rice: Marakkari Biriyani (30%), Kutharisi Soru (30%), Fried Rice (30%), White Rice (10%)",
        "Main Curries: Aattu Kari (Yaal Murai), Kozhi Kuzhambu, Kozhi Deval / Tikka Masala, Avitha Muttai, Urulaikizhangu Kari, Paruppu Masala, Katharikai Moyu, Maasi Sambal",
        "Desserts: Ice Cream & Fruit Salad, Jelly, Beeda, Water Bottle"
      ],
      price: "Rs. 2,300/person",
    },
  ],
  pubertSpecial: [
    {
      name: "Special Veg Feast",
      id: "pubert-special-veg",
      type: "veg",
      items: [
        "Starter: Menbaanam / Falooda, Poondhi Laddu, Patties, Cake",
        "Rice: Marakkari Biriyani, Nei Saadam, Fried Rice, Kutharisi Soru",
        "Main Curries: Paneer, Soya Meat, Kadalai Masala, Kaalan Kari",
        "Side dishes: Urulaikizhangu, Katharikai, Vadai, Milagai Poriyal, Appalam, Vazhaikkai Poriyal, Ponnanganni Varai",
        "Desserts: Paayaasam, Ice Cream, Fruit Salad, Jelly, Beeda, Thanneer Pothal"
      ],
      price: "Rs. 2,800/person",
    },
    {
      name: "Special Non-Veg Feast",
      id: "pubert-special-nonveg",
      type: "nonveg",
      items: [
        "Starter: Menbaanam / Fresh Juice, Cake, Roll",
        "Rice: Marakkari Biriyani, Veg / Egg Fried Rice, Kutharisi Soru, Vellai Soru",
        "Main Curries: Aattu Kari, Kozhi Kuzhambu, Kozhi Deval, Iraal / Kanavai Deval",
        "Side dishes: Katharikai Moyu, Urulaikizhangu Thelthal, Maasi Sambal, Paruppu Masala",
        "Desserts: Ice Cream & Fruit Salad, Caramel Pudding, Jelly, Beeda, Water Bottle"
      ],
      price: "Rs. 3,000/person",
    },
    {
      name: "Platinum Veg Special",
      id: "pubert-special-platinum-veg",
      type: "veg",
      items: [
        "Starter: Menbaanam, Poondhi Laddu, Patties",
        "Rice: Marakkari Biriyani, Kutharisi Soru, Fried Rice",
        "Main Curries: Paneer Kari, Soya Meat Deval, Kadalai Katharikai Kari",
        "Side dishes: Vadai, Milagai Poriyal, Appalam, Vazhaikkai Poriyal, Thayir, Rasam, Salad / Raitha",
        "Desserts: Paayaasam, Ice Cream, Pudding, Jelly, Beeda, Thanneer Pothal"
      ],
      price: "Rs. 1,500/person",
    },
  ],
  dinnerVeg: [
    {
      name: "Silver Package",
      id: "dinner-veg-silver",
      items: [
        "Menbaanam (Fresh Juice), Cake",
        "Idiyappa Biriyani, Noodles",
        "Katharikai Moyu / Pineapple Moyu, Urulaikizhangu Kari",
        "Salad, Ice Cream"
      ],
      price: "Rs. 900/person",
    },
    {
      name: "Gold Package",
      id: "dinner-veg-gold",
      items: [
        "All Silver items plus:",
        "Patties, Puttu Kothu",
        "Soya Meat Deval, Cutlet",
        "Jelly"
      ],
      price: "Rs. 1,300/person",
    },
    {
      name: "Platinum Package",
      id: "dinner-veg-platinum",
      items: [
        "All Gold items plus:",
        "Masala Tea, Rolls",
        "Paneer Deval",
        "Pazha Kalavai (Fruit Salad)"
      ],
      price: "Rs. 1,600/person",
    },
  ],
  dinnerNonVeg: [
    {
      name: "Silver Package",
      id: "dinner-nonveg-silver",
      items: [
        "Menbaanam (Fresh Juice), Cake",
        "Idiyappa Biriyani, Noodles",
        "Katharikai / Pineapple Moyu, Urulaikizhangu Kari",
        "Muttai, Kozhi Kari (Yaal Murai)",
        "Cutlet, Ice Cream"
      ],
      price: "Rs. 1,200/person",
    },
    {
      name: "Gold Package",
      id: "dinner-nonveg-gold",
      items: [
        "All Silver items plus:",
        "Puttu Kothu, Maasi Sambal",
        "Kozhi Deval, Avitha Muttai",
        "Jelly"
      ],
      price: "Rs. 1,700/person",
    },
    {
      name: "Platinum Package",
      id: "dinner-nonveg-platinum",
      items: [
        "All Gold items plus:",
        "Masala Tea, Rolls",
        "Chicken Tikka Masala, Aattu Kari",
        "Pazha Kalavai (Fruit Salad)"
      ],
      price: "Rs. 2,200/person",
    },
  ],
  dinnerSpecial: [
    {
      name: "Special Non-Veg Feast",
      id: "dinner-special-nonveg",
      type: "nonveg",
      items: [
        "Starter: Menbaanam (Fresh Juice), Cake, Rolls",
        "Main dishes: Idiyappa Biriyani, Noodles, Kothu",
        "Meat items: Kozhi Kuzhambu, Kozhi Deval, Aattu Kari",
        "Sea foods: Iraal Deval / Kanavai Deval, Maasi Sambal",
        "Side dishes: Katharikai Moyu / Pineapple Moyu, Urulaikizhangu Prattal, Salad",
        "Egg & Cutlet: Avitha Muttai, Cutlet",
        "Desserts: Ice Cream & Pazha Kalavai, Jelly, Caramel Pudding / Vadlappam",
        "Additional: Beeda, Water Bottle"
      ],
      price: "Rs. 2,600/person",
    },
  ],
  weddingVeg: [
    {
      name: "Silver Package",
      id: "wedding-veg-silver",
      items: [
        "Menbaanam, Poondhi Laddu",
        "Kutharisi Soru, Manjal Soru",
        "Paruppu Kari, Kadalai Katharikai Kari, Urulaikizhangu Kuzhambu, Paal Kari, Vengaya Sambal",
        "Vadai, Appalam",
        "Paayaasam, Ice Cream"
      ],
      price: "Rs. 1,000/person",
    },
    {
      name: "Gold Package",
      id: "wedding-veg-gold",
      items: [
        "Menbaanam, Poondhi Laddu",
        "Marakkari Biriyani, Kutharisi Soru, Vellai Saadam",
        "Paruppu Kari, Kadalai Katharikai Kari, Urulaikizhangu Kari, Kuzhambu, Soya Meat Deval, Salad/Raitha",
        "Vadai, Appalam, Rasam",
        "Paayaasam, Ice Cream, Beeda"
      ],
      price: "Rs. 1,200/person",
    },
    {
      name: "Platinum Package",
      id: "wedding-veg-platinum",
      items: [
        "Menbaanam, Poondhi Laddu, Patties",
        "Marakkari Biriyani (60%), Kutharisi Soru (30%), Fried Rice (10%)",
        "Paruppu/Payaru Kari, Kadalai Katharikai Kari, Urulaikizhangu Kari, Kuzhambu, Paneer Kari, Soya Meat Deval, Salad/Raitha, Ponnanganni + Mixer Varai",
        "Vadai, Appalam, Vazhaikkai Poriyal, Thayir, Rasam",
        "Paayaasam, Ice Cream & Pazha Kalavai, Beeda"
      ],
      price: "Rs. 1,500/person",
    },
  ],
  weddingNonVeg: [
    {
      name: "Silver Package",
      id: "wedding-nonveg-silver",
      items: [
        "Menbaanam, Cake",
        "Kutharisi Soru, Manjal Soru",
        "Paruppu Masala, Katharikai Moyu, Kozhi Kari, Avitha Muttai, Sambal",
        "Ice Cream"
      ],
      price: "Rs. 1,200/person",
    },
    {
      name: "Gold Package",
      id: "wedding-nonveg-gold",
      items: [
        "Menbaanam, Cake",
        "Marakkari Biriyani, Kutharisi Soru, Vellai Saadam",
        "Paruppu Masala, Katharikai Moyu, Urulaikizhangu Thelthal, Kozhi Kuzhambu, Kozhi Deval, Avitha Muttai, Maasi Sambal",
        "Ice Cream, Beeda"
      ],
      price: "Rs. 1,700/person",
    },
    {
      name: "Platinum Package",
      id: "wedding-nonveg-platinum",
      items: [
        "Menbaanam / Fresh Juice, Cake, Roll",
        "Biriyani (30%), Kutharisi Soru (30%), Fried Rice (30%), Vellai Saadam (10%)",
        "Paruppu Masala, Katharikai / Annasi Moyu, Urulaikizhangu Kari, Kozhi Kuzhambu, Kozhi Deval / Tikka Masala, Aattu Kari (Yaal Murai), Avitha Muttai, Maasi Sambal",
        "Ice Cream & Pazha Kalavai, Jelly, Beeda"
      ],
      price: "Rs. 2,300/person",
    },
  ],
  weddingSpecial: [
    {
      name: "Veg Platinum Package",
      id: "wedding-special-veg-platinum",
      type: "veg",
      items: [
        "Starter: Menbaanam, Poondhi Laddu, Patties",
        "Rice: Biriyani (60%), Kutharisi (30%), Fried Rice (10%)",
        "Main Curries: Paruppu / Payaru, Kadalai Katharikai, Urulaikizhangu, Paneer Kari, Soya Meat Deval",
        "Side dishes: Ponnanganni Varai, Ulunthu Vadai, Milagai Poriyal, Appalam, Vazhaikkai, Thayir, Rasam",
        "Desserts: Paayaasam, Ice Cream & Fruit Salad, Beeda",
        "Additional: Water Bottle"
      ],
      price: "Rs. 1,500/person",
    },
    {
      name: "Veg Special Package",
      id: "wedding-special-veg",
      type: "veg",
      items: [
        "Starter: Menbaanam / Falooda, Laddu, Patties, Cake",
        "Rice: Biriyani (30%), Nei Saadam (30%), Fried Rice (30%), Kutharisi (10%)",
        "Main Curries: Paruppu Masala, Katharikai Prattal, Urulaikizhangu, Paneer, Soya Meat, Kayu Kari, Kaalan Kari, Kadalai Masala",
        "Side dishes: Maangai Chutney, Sambal, Ulunthu Vadai, Milagai Poriyal, Appalam, Vazhaikkai, Ponnanganni Varai, Thayir, Rasam",
        "Desserts: Paayaasam, Ice Cream, Fruit Salad, Jelly, Beeda",
        "Additional: Water Bottle"
      ],
      price: "Rs. 3,000/person",
    },
    {
      name: "Non-Veg Special Package",
      id: "wedding-special-nonveg",
      type: "nonveg",
      items: [
        "Starter: Menbaanam / Fresh Juice, Cake, Roll",
        "Rice: Biriyani (30%), Fried Rice (30%), Kutharisi (30%), Vellai Saadam (10%)",
        "Main Curries: Paruppu Masala, Katharikai / Annasi Moyu, Urulaikizhangu, Aattu Kari, Kozhi Kuzhambu, Kozhi Deval, Iraal / Kanavai Deval",
        "Side dishes: Avitha Muttai, Sambal",
        "Desserts: Ice Cream & Fruit Salad, Caramel Pudding, Jelly, Beeda",
        "Additional: Water Bottle"
      ],
      price: "Rs. 2,800/person",
    },
  ],
  registrationVeg: [
    {
      name: "Silver Package",
      id: "registration-veg-silver",
      items: [
        "Starter: Soft drink, Poondhi Laddu",
        "Rice: Kutharisi Soru, Manjal Soru",
        "Curries: Paruppu Kari, Kadalai Katharikai Kari, Urulaikizhangu Kuzhambu, Paal Kari, Vengaya Sambal",
        "Side dishes: Kadalai Vadai, Milagai Poriyal, Appalam"
      ],
      price: "Rs. 1,000/person",
    },
    {
      name: "Gold Package",
      id: "registration-veg-gold",
      items: [
        "Starter: Soft drink, Poondhi Laddu",
        "Rice: Kaikari Biriyani, Kutharisi Soru, Vellai Soru",
        "Curries: Paruppu Kari, Kadalai Katharikai Kari, Urulaikizhangu Kari, Kuzhambu, Soya Meat Deval, Salad / Raitha",
        "Side dishes: Ulunthu Vadai, Milagai Poriyal, Appalam, Rasam"
      ],
      price: "Rs. 1,200/person",
    },
    {
      name: "Platinum Package",
      id: "registration-veg-platinum",
      items: [
        "Starter: Soft drink, Poondhi Laddu, Patties",
        "Rice: Kaikari Biriyani (60%), Kutharisi Soru (30%), Fried Rice (10%)",
        "Curries: Paruppu + Payaru Kari, Kadalai Katharikai Kari, Urulaikizhangu Kari, Kuzhambu, Paneer Kari, Soya Meat Deval, Salad / Raitha, Ponnanganni + Mixer Varai",
        "Side dishes: Ulunthu Vadai, Milagai Poriyal, Appalam, Vazhaikkai Poriyal, Thayir, Rasam"
      ],
      price: "Rs. 1,500/person",
    },
  ],
  registrationNonVeg: [
    {
      name: "Silver Package",
      id: "registration-nonveg-silver",
      items: [
        "Starter: Soft drink, Cake",
        "Rice: Kutharisi Soru, Manjal Soru",
        "Curry & Non-Veg: Paruppu Masala, Katharikai Moyu / Annasi Moyu, Kozhi Kari, Avitha Muttai, Vengaya Sambal",
        "Desserts: Ice Cream, Water Bottle"
      ],
      price: "Rs. 1,200/person",
    },
    {
      name: "Gold Package",
      id: "registration-nonveg-gold",
      items: [
        "Starter: Soft drink, Cake",
        "Rice: Kaikari Biriyani, Kutharisi Soru, Vellai Soru",
        "Curry & Non-Veg: Paruppu Masala, Katharikai Moyu / Annasi Moyu, Urulaikizhangu Thelthal, Kozhi Deval, Avitha Muttai, Maasi Sambal",
        "Desserts: Ice Cream, Beeda, Water Bottle"
      ],
      price: "Rs. 1,700/person",
    },
    {
      name: "Platinum Package",
      id: "registration-nonveg-platinum",
      items: [
        "Starter: Soft drink / Fresh Juice, Cake, Roll",
        "Rice: Kaikari Biriyani (30%), Kutharisi Soru (30%), Fried Rice (30%), Vellai Soru (10%)",
        "Curry & Non-Veg: Paruppu Masala, Katharikai Moyu / Annasi Moyu, Urulaikizhangu Kari, Kozhi Kuzhambu, Kozhi Deval / Tikka Masala, Aattu Kari (Yaal Murai), Avitha Muttai / Muttai Salad, Maasi Sambal",
        "Desserts: Ice Cream & Pazha Kalavai, Jelly, Beeda, Water Bottle"
      ],
      price: "Rs. 2,300/person",
    },
  ],
};
