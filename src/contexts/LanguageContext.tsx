import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "ta";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// English translations
const en: Record<string, string> = {
  // Navigation
  "nav.home": "Home",
  "nav.halls": "Halls",
  "nav.bungalows": "Bungalows",
  "nav.services": "Services",
  "nav.menus": "Menus",
  "nav.about": "About",
  "nav.contact": "Contact",
  "nav.bookNow": "Book Now",
  "nav.tagline": "Traditional Wedding Venues",

  // Hero Section
  "hero.title": "Sacred Unions, Blessed Beginnings",
  "hero.subtitle": "Experience the grandeur of traditional weddings at our exquisite mandapams. Where ancient rituals meet modern elegance.",
  "hero.cta.book": "Book Your Muhurtham",
  "hero.cta.explore": "Explore Mandapams",
  "hero.stats.halls": "Sacred Halls",
  "hero.stats.guests": "Max Guests",
  "hero.stats.legacy": "Years Legacy",

  // Featured Halls
  "halls.featured.title": "Our Sacred Mandapams",
  "halls.featured.subtitle": "Discover our collection of beautifully crafted wedding venues, each designed to create unforgettable celebrations.",
  "halls.viewAll": "View All Halls",
  "halls.viewDetails": "View Details",
  "halls.book": "Book",
  "halls.featured": "Featured",
  "halls.capacity": "Capacity",
  "halls.guests": "guests",
  "halls.ac": "AC",
  "halls.parking": "Parking",
  "halls.dining": "Dining",
  "halls.checkAvailability": "Check Availability",

  // Halls Page
  "halls.page.title": "Our Wedding Mandapams",
  "halls.page.subtitle": "Discover our collection of beautifully crafted traditional wedding venues, each designed to create unforgettable celebrations steeped in culture and elegance.",
  "halls.page.description": "From intimate gatherings to grand celebrations, find the perfect mandapam for your sacred union.",

  // Services Preview
  "services.title": "Premium Wedding Services",
  "services.subtitle": "Complete Solutions",
  "services.description": "From traditional rituals to modern celebrations, we offer comprehensive services to make your wedding truly memorable.",
  "services.viewAll": "View All Services",

  // Services Page
  "services.page.title": "Premium Wedding Services",
  "services.page.subtitle": "Comprehensive Solutions for Your Sacred Day",
  "services.page.description": "From traditional rituals to modern celebrations, we offer end-to-end services that make your special day truly memorable.",
  "services.whyChoose.title": "Why Choose Our Services",
  "services.whyChoose.experience": "Years of Experience",
  "services.whyChoose.events": "Events Completed",
  "services.whyChoose.satisfaction": "Client Satisfaction",

  // Testimonials
  "testimonials.title": "Sacred Testimonials",
  "testimonials.subtitle": "Blessed Couples",

  // CTA Section
  "cta.title": "Begin Your Sacred Journey",
  "cta.subtitle": "Ready to Create Memories?",
  "cta.description": "Let us help you plan the wedding of your dreams. Our expert team is ready to make your special day truly unforgettable.",
  "cta.book": "Book Your Date",
  "cta.call": "Call Us Now",

  // About Page
  "about.title": "Our Sacred Story",
  "about.subtitle": "A Legacy of Celebrations",
  "about.description": "For over two decades, we have been the trusted custodians of South Indian wedding traditions, creating sacred spaces where families unite and new beginnings flourish.",
  "about.mission.title": "Our Mission",
  "about.mission.description": "To preserve and celebrate the rich traditions of South Indian weddings while providing world-class hospitality and services.",
  "about.vision.title": "Our Vision",
  "about.vision.description": "To be the most trusted name in traditional wedding venues, known for excellence, authenticity, and heartfelt service.",
  "about.journey.title": "Our Journey",
  "about.team.title": "Meet Our Team",
  "about.team.subtitle": "The People Behind Your Perfect Day",
  "about.heroTitle": "About",
  "about.heroHighlight": "Celebration Halls",
  "about.story.title": "Our",
  "about.story.highlight": "Story",
  "about.story.p1": "Celebration Halls began with a sacred vision: to create divine spaces where love stories unfold according to cherished Tamil Hindu traditions.",
  "about.story.p2": "What started as a single mandapam has grown into a collection of five stunning venues, each designed with devotion and blessed ambiance.",
  "about.story.p3": "Over the years, we've had the privilege of hosting thousands of thirumangalyam ceremonies, receptions, and sacred celebrations. Each union has deepened our understanding, making us guardians of tradition while embracing the joy of every couple's unique journey.",
  "about.journey.subtitle": "A Legacy of",
  "about.journey.highlight": "Sacred Celebrations",
  "about.journey.description": "From humble beginnings to becoming the region's premier wedding destination",
  "about.values.subtitle": "Our Sacred Values",
  "about.values.title": "Why Choose",
  "about.values.highlight": "Us",
  "about.values.description": "What sets us apart is our devotion to making your sacred day truly divine and memorable.",
  "about.values.excellence.title": "Divine Excellence",
  "about.values.excellence.desc": "Award-winning mandapams with traditional elegance",
  "about.values.team.title": "Devoted Team",
  "about.values.team.desc": "Experienced professionals honoring your traditions",
  "about.values.service.title": "Premium Seva",
  "about.values.service.desc": "Complete wedding solutions under one sacred roof",
  "about.values.personal.title": "Personal Touch",
  "about.values.personal.desc": "Customized experiences for every blessed couple",
  "about.stats.years": "Years of Seva",
  "about.stats.mandapams": "Sacred Mandapams",
  "about.stats.unions": "Blessed Unions",
  "about.stats.satisfaction": "Happy Couples",
  "about.team.description": "Dedicated professionals who make every celebration extraordinary",
  "about.promise.title": "Our Sacred",
  "about.promise.highlight": "Promise",
  "about.promise.item1": "Impeccable seva from first inquiry to muhurtham day",
  "about.promise.item2": "Flexible packages honoring your family traditions",
  "about.promise.item3": "Transparent pricing with no hidden costs",
  "about.promise.item4": "Premium vendors ensuring quality for every ritual",
  "about.promise.item5": "Dedicated event coordinator for your celebration",
  "about.promise.item6": "Backup systems for uninterrupted sacred ceremonies",
  "about.cta.title": "Let's Create Your",
  "about.cta.highlight": "Perfect Day",
  "about.cta.description": "We'd be honored to be part of your sacred celebration. Book a visit to see our mandapams or start planning your auspicious event today.",
  "about.cta.bookNow": "Book Now",
  "about.cta.contactUs": "Contact Us",

  // Contact Page
  "contact.title": "Get in Touch",
  "contact.subtitle": "We'd Love to Hear From You",
  "contact.description": "Have questions about our venues or services? We're here to help you plan your perfect celebration.",
  "contact.form.name": "Your Name",
  "contact.form.email": "Email Address",
  "contact.form.phone": "Phone Number",
  "contact.form.message": "Your Message",
  "contact.form.submit": "Send Message",
  "contact.info.address": "Address",
  "contact.info.phone": "Phone",
  "contact.info.email": "Email",
  "contact.info.hours": "Working Hours",
  "contact.faq.title": "Frequently Asked Questions",

  // Menus Page
  "menus.title": "Traditional Feast Menus",
  "menus.subtitle": "Authentic South Indian Cuisine",
  "menus.description": "Delight your guests with our carefully curated menu packages featuring authentic South Indian delicacies prepared by master chefs.",
  "menus.veg": "Vegetarian",
  "menus.nonveg": "Non-Vegetarian",
  "menus.special": "Special Packages",
  "menus.packages": "packages",
  "menus.calculator.title": "Price Calculator",
  "menus.calculator.guests": "Number of Guests",
  "menus.calculator.estimate": "Estimated Price",

  // Bungalows Page
  "bungalows.title": "Guest Bungalows",
  "bungalows.subtitle": "Comfortable Accommodations",
  "bungalows.description": "Provide your guests with comfortable and convenient stay options near our wedding venues.",
  "bungalows.perNight": "per night",
  "bungalows.maxOccupancy": "Max Occupancy",
  "bungalows.persons": "persons",
  "bungalows.viewDetails": "View Details",
  "bungalows.bookNow": "Book Now",
  "bungalows.available": "Available",
  "bungalows.notAvailable": "Not Available",

  // Booking Page
  "booking.title": "Book Your Celebration",
  "booking.subtitle": "Reserve Your Special Day",
  "booking.step.hall": "Select Hall",
  "booking.step.date": "Choose Date",
  "booking.step.event": "Event Details",
  "booking.step.menu": "Menu Selection",
  "booking.step.services": "Add Services",
  "booking.step.details": "Your Details",
  "booking.step.confirm": "Confirm",
  "booking.next": "Next",
  "booking.previous": "Previous",
  "booking.submit": "Submit Booking",
  "booking.success": "Booking Submitted Successfully!",
  "booking.success.message": "We will contact you shortly to confirm your reservation.",
  "booking.selectHall": "Select a Mandapam",
  "booking.eventType": "Event Type",
  "booking.eventDate": "Event Date",
  "booking.timeSlot": "Time Slot",
  "booking.guestCount": "Expected Guests",
  "booking.selectMenu": "Select Menu Package",
  "booking.menuSection": "Menu Section",
  "booking.menuVariant": "Menu Type",
  "booking.addServices": "Add-on Services",
  "booking.customerName": "Full Name",
  "booking.customerPhone": "Phone Number",
  "booking.customerEmail": "Email Address",
  "booking.specialRequests": "Special Requests",

  // Common
  "common.loading": "Loading...",
  "common.error": "Something went wrong",
  "common.retry": "Try Again",
  "common.close": "Close",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.search": "Search",
  "common.filter": "Filter",
  "common.all": "All",
  "common.viewMore": "View More",
  "common.learnMore": "Learn More",
  "common.readMore": "Read More",
  "common.seeAll": "See All",
  "common.perDay": "per day",
  "common.adults": "Adults",
  "common.children": "Children",
  "common.checkIn": "Check-in",
  "common.checkOut": "Check-out",
  "common.tariff": "Tariff Details",
  "common.amenities": "Features & Amenities",
  "common.rules": "Rules & Policies",

  // Footer
  "footer.about": "About Us",
  "footer.aboutText": "We are dedicated to creating unforgettable wedding experiences with our beautiful traditional venues and exceptional services.",
  "footer.quickLinks": "Quick Links",
  "footer.contact": "Contact Info",
  "footer.hours": "Working Hours",
  "footer.rights": "All rights reserved",
  "footer.tagline": "Creating Sacred Unions Since 2001",
};

// Tamil translations
const ta: Record<string, string> = {
  // Navigation
 /* "nav.home": "முகப்பு",
  "nav.halls": "மண்டபங்கள்",
  "nav.bungalows": "விருந்தினர் இல்லம்",
  "nav.services": "சேவைகள்",
  "nav.menus": "உணவு பட்டியல்",
  "nav.about": "எங்களைப் பற்றி",
  "nav.contact": "தொடர்பு",
  "nav.bookNow": "இப்போது முன்பதிவு செய்யுங்கள்",
  "nav.tagline": "பாரம்பரிய திருமண அரங்குகள்",
  */

  // Hero Section
  "hero.title": "திருமண பந்தம், மங்களகரமான தொடக்கம்",
  "hero.subtitle": "எமது நவீன பாரம்பரிய மண்டபங்களில் உங்கள் திருமண நிகழ்வை நடத்தி மகிழுங்கள்.",
  "hero.cta.book": "உங்கள் முகூர்த்தத்தை பதிவு செய்யுங்கள்",
  "hero.cta.explore": "மண்டபங்களைப் பார்வையிடுங்கள்",
  "hero.stats.halls": "திருமண மண்டபங்கள்",
  "hero.stats.guests": "அதிகபட்ச விருந்தினர் எண்ணிக்கை",
  "hero.stats.legacy": "வருட மரபு",

  // Featured Halls
  "halls.featured.title": "எங்கள் திருமண மண்டபங்கள்",
  "halls.featured.subtitle": "அழகாக வடிவமைக்கப்பட்ட எங்கள் திருமண அரங்கங்களை கண்டறியுங்கள். ஒவ்வொன்றும் சிறப்பான கொண்டாட்டங்களுக்கு ஏற்றதாக வடிவமைக்கப்பட்டுள்ளது.",
  "halls.viewAll": "அனைத்து மண்டபங்களையும் காண்க",
  "halls.viewDetails": "விவரங்களைக் காண்க",
  "halls.book": "முன்பதிவு",
  "halls.featured": "சிறப்பு",
  "halls.capacity": "கொள்ளளவு",
  "halls.guests": "விருந்தினர்கள்",
  "halls.ac": "குளிரூட்டி",
  "halls.parking": "வாகன நிறுத்த இடம்",
  "halls.dining": "உணவு பகுதி",
  "halls.checkAvailability": "கிடைக்கும் தன்மையை சரிபார்க்கவும்",

  // Halls Page
  "halls.page.title": "எங்கள் திருமண மண்டபங்கள்",
  "halls.page.subtitle": "கலாச்சாரம் மற்றும் நேர்த்தியால் அழகான, மறக்கமுடியாத அனுபவங்களுக்காக வடிவமைக்கப்பட்ட எங்கள் பாரம்பரிய திருமண அரங்கங்களை பார்வையிடுங்கள்",
  "halls.page.description": "நெருக்கமான கூட்டங்கள் முதல் பெரிய கொண்டாட்டங்கள் வரை, உங்கள் புனித சங்கமத்திற்கான சரியான மண்டபத்தைக் கண்டறியுங்கள்.",

  // Services Preview
  "services.title": "உயர்தர திருமண சேவைகள்",
  "services.subtitle": "முழுமையான தீர்வுகள்",
  "services.description": "பாரம்பரிய சடங்குகள் முதல் நவீன கொண்டாட்டங்கள் வரை, உங்கள் திருமணத்தை உண்மையிலேயே மறக்க முடியாததாக மாற்ற விரிவான சேவைகளை வழங்குகிறோம்.",
  "services.viewAll": "அனைத்து சேவைகளையும் காண்க",

  // Services Page
  "services.page.title": "உயர்தர திருமண சேவைகள்",
  "services.page.subtitle": "உங்கள் புனித நாளுக்கான விரிவான தீர்வுகள்",
  "services.page.description": "பாரம்பரிய சடங்குகள் முதல் நவீன கொண்டாட்டங்கள் வரை, உங்கள் சிறப்பு நாளை உண்மையிலேயே மறக்க முடியாததாக மாற்றும் விரிவான சேவைகளை வழங்குகிறோம்.",
  "services.whyChoose.title": "எங்கள் சேவைகளை ஏன் தேர்வு செய்ய வேண்டும்",
  "services.whyChoose.experience": "ஆண்டுகள் அனுபவம்",
  "services.whyChoose.events": "நிகழ்வுகள் நிறைவு",
  "services.whyChoose.satisfaction": "வாடிக்கையாளர் திருப்தி",

  // Testimonials
  "testimonials.title": "விருந்தினர் கருத்துகள்",
  "testimonials.subtitle": "ஆசீர்வதிக்கப்பட்ட தம்பதிகள்",

  // CTA Section
  "cta.title": "உங்கள் மகிழ்ச்சியான பயணத்தை எங்களுடன் தொடங்குங்கள்",
  "cta.subtitle": "சிறந்த தருணங்களை உருவாக்கத் தயாரா?",
  "cta.description": "உங்கள் கனவுக்குரிய திருமணத்தை திட்டமிட எங்களின் உதவியைப் பெறுங்கள். உங்கள் சிறப்பான நாள் மறக்க முடியாததாக மாற எங்கள் நிபுணர் குழு தயார்.",
  "cta.book": "உங்கள் தேதியை முன்பதிவு செய்யுங்கள்",
  "cta.call": "இப்போது அழைக்கவும்",

  // About Page
  "about.title": "எங்கள் புனித கதை",
  "about.subtitle": "கொண்டாட்டங்களின் மரபு",
  "about.description": "இரண்டு தசாப்தங்களுக்கும் மேலாக, தென்னிந்திய திருமண மரபுகளின் நம்பகமான பாதுகாவலர்களாக இருந்து வருகிறோம், குடும்பங்கள் ஒன்றிணையும் மற்றும் புதிய தொடக்கங்கள் மலரும் புனித இடங்களை உருவாக்குகிறோம்.",
  "about.mission.title": "எங்கள் நோக்கம்",
  "about.mission.description": "உலகத்தரம் வாய்ந்த விருந்தோம்பல் மற்றும் சேவைகளை வழங்கும் அதே வேளையில் தென்னிந்திய திருமணங்களின் வளமான மரபுகளைப் பாதுகாத்து கொண்டாடுவது.",
  "about.vision.title": "எங்கள் தொலைநோக்கு",
  "about.vision.description": "சிறப்பு, நம்பகத்தன்மை மற்றும் இதயபூர்வமான சேவைக்கு பெயர் பெற்ற பாரம்பரிய திருமண அரங்குகளில் மிகவும் நம்பகமான பெயராக இருப்பது.",
  "about.journey.title": "எங்கள் பயணம்",
  "about.team.title": "எங்கள் குழுவை சந்தியுங்கள்",
  "about.team.subtitle": "உங்கள் சரியான நாளுக்குப் பின்னால் உள்ள நபர்கள்",
  "about.heroTitle": "எங்களைப் பற்றி",
  "about.heroHighlight": "கொண்டாட்ட மண்டபங்கள்",
  "about.story.title": "எங்கள்",
  "about.story.highlight": "கதை",
  "about.story.p1": "கொண்டாட்ட மண்டபங்கள் ஒரு புனித நோக்கத்துடன் தொடங்கியது: தமிழ் இந்து மரபுகளின்படி காதல் கதைகள் விரியும் தெய்வீக இடங்களை உருவாக்குவது.",
  "about.story.p2": "ஒரு மண்டபமாக தொடங்கியது ஐந்து அழகான அரங்குகளின் தொகுப்பாக வளர்ந்துள்ளது, ஒவ்வொன்றும் பக்தியுடனும் ஆசீர்வதிக்கப்பட்ட சூழலுடனும் வடிவமைக்கப்பட்டுள்ளது.",
  "about.story.p3": "பல ஆண்டுகளாக, ஆயிரக்கணக்கான திருமங்கல்யம் சடங்குகள், வரவேற்புகள் மற்றும் புனித கொண்டாட்டங்களை நடத்தும் பெருமை எங்களுக்கு கிடைத்துள்ளது. ஒவ்வொரு கூட்டணியும் எங்கள் புரிதலை ஆழப்படுத்தியுள்ளது, மரபின் பாதுகாவலர்களாக இருந்து ஒவ்வொரு தம்பதியின் தனித்துவமான பயணத்தின் மகிழ்ச்சியை ஏற்றுக்கொள்கிறோம்.",
  "about.journey.subtitle": "புனித கொண்டாட்டங்களின்",
  "about.journey.highlight": "மரபு",
  "about.journey.description": "தாழ்மையான தொடக்கங்களிலிருந்து பிராந்தியத்தின் முதன்மை திருமண இடமாக மாறுவது வரை",
  "about.values.subtitle": "எங்கள் புனித மதிப்புகள்",
  "about.values.title": "எங்களை ஏன்",
  "about.values.highlight": "தேர்வு செய்ய வேண்டும்",
  "about.values.description": "உங்கள் புனித நாளை உண்மையிலேயே தெய்வீகமாகவும் மறக்க முடியாததாகவும் மாற்றுவதில் எங்கள் பக்தி எங்களை வேறுபடுத்துகிறது.",
  "about.values.excellence.title": "தெய்வீக சிறப்பு",
  "about.values.excellence.desc": "பாரம்பரிய நேர்த்தியுடன் விருது பெற்ற மண்டபங்கள்",
  "about.values.team.title": "அர்ப்பணிப்புள்ள குழு",
  "about.values.team.desc": "உங்கள் மரபுகளை மதிக்கும் அனுபவமிக்க நிபுணர்கள்",
  "about.values.service.title": "உயர்தர சேவை",
  "about.values.service.desc": "ஒரு புனித கூரையின் கீழ் முழுமையான திருமண தீர்வுகள்",
  "about.values.personal.title": "தனிப்பட்ட கவனிப்பு",
  "about.values.personal.desc": "ஒவ்வொரு ஆசீர்வதிக்கப்பட்ட தம்பதிக்கும் தனிப்பயனாக்கப்பட்ட அனுபவங்கள்",
  "about.stats.years": "சேவை ஆண்டுகள்",
  "about.stats.mandapams": "புனித மண்டபங்கள்",
  "about.stats.unions": "ஆசீர்வதிக்கப்பட்ட திருமணங்கள்",
  "about.stats.satisfaction": "மகிழ்ச்சியான தம்பதிகள்",
  "about.team.description": "ஒவ்வொரு கொண்டாட்டத்தையும் அசாதாரணமாக மாற்றும் அர்ப்பணிப்புள்ள நிபுணர்கள்",
  "about.promise.title": "எங்கள் புனித",
  "about.promise.highlight": "வாக்குறுதி",
  "about.promise.item1": "முதல் விசாரணை முதல் முகூர்த்த நாள் வரை குறைபாடற்ற சேவை",
  "about.promise.item2": "உங்கள் குடும்ப மரபுகளை மதிக்கும் நெகிழ்வான தொகுப்புகள்",
  "about.promise.item3": "மறைக்கப்பட்ட செலவுகள் இல்லாமல் வெளிப்படையான விலை நிர்ணயம்",
  "about.promise.item4": "ஒவ்வொரு சடங்கிற்கும் தரத்தை உறுதி செய்யும் உயர்தர விற்பனையாளர்கள்",
  "about.promise.item5": "உங்கள் கொண்டாட்டத்திற்கான அர்ப்பணிப்புள்ள நிகழ்வு ஒருங்கிணைப்பாளர்",
  "about.promise.item6": "தடையின்றி புனித சடங்குகளுக்கான காப்பு அமைப்புகள்",
  "about.cta.title": "உங்கள் சரியான நாளை",
  "about.cta.highlight": "உருவாக்குவோம்",
  "about.cta.description": "உங்கள் புனித கொண்டாட்டத்தின் ஒரு பகுதியாக இருப்பதில் நாங்கள் பெருமைப்படுவோம். எங்கள் மண்டபங்களைப் பார்வையிட முன்பதிவு செய்யுங்கள் அல்லது இன்றே உங்கள் சுப நிகழ்வைத் திட்டமிடத் தொடங்குங்கள்.",
  "about.cta.bookNow": "இப்போது முன்பதிவு செய்யுங்கள்",
  "about.cta.contactUs": "எங்களைத் தொடர்பு கொள்ளுங்கள்",

  // Contact Page
  "contact.title": "தொடர்பில் இருங்கள்",
  "contact.subtitle": "உங்களிடமிருந்து கேட்க விரும்புகிறோம்",
  "contact.description": "எங்கள் அரங்குகள் அல்லது சேவைகள் பற்றி கேள்விகள் உள்ளதா? உங்கள் சிறந்த கொண்டாட்டத்தைத் திட்டமிட உங்களுக்கு உதவ நாங்கள் இங்கே இருக்கிறோம்.",
  "contact.form.name": "உங்கள் பெயர்",
  "contact.form.email": "மின்னஞ்சல் முகவரி",
  "contact.form.phone": "தொலைபேசி எண்",
  "contact.form.message": "உங்கள் செய்தி",
  "contact.form.submit": "செய்தி அனுப்பு",
  "contact.info.address": "முகவரி",
  "contact.info.phone": "தொலைபேசி",
  "contact.info.email": "மின்னஞ்சல்",
  "contact.info.hours": "வேலை நேரம்",
  "contact.faq.title": "அடிக்கடி கேட்கப்படும் கேள்விகள்",

  // Menus Page
  "menus.title": "பாரம்பரிய விருந்து உணவுகள்",
  "menus.subtitle": "உண்மையான தென்னிந்திய உணவு வகைகள்",
  "menus.description": "தலைசிறந்த சமையல் நிபுணர்களால் தயாரிக்கப்பட்ட உண்மையான தென்னிந்திய சுவைகளை உள்ளடக்கிய எங்கள் கவனமாக தேர்ந்தெடுக்கப்பட்ட உணவு தொகுப்புகளால் உங்கள் விருந்தினர்களை மகிழ்விக்கவும்.",
  "menus.veg": "சைவம்",
  "menus.nonveg": "அசைவம்",
  "menus.special": "சிறப்பு தொகுப்புகள்",
  "menus.packages": "தொகுப்புகள்",
  "menus.calculator.title": "விலை கணிப்பான்",
  "menus.calculator.guests": "விருந்தினர்களின் எண்ணிக்கை",
  "menus.calculator.estimate": "மதிப்பிடப்பட்ட விலை",

  // Bungalows Page
  "bungalows.title": "விருந்தினர் இல்லங்கள்",
  "bungalows.subtitle": "வசதியான தங்குமிடங்கள்",
  "bungalows.description": "எங்கள் திருமண அரங்குகளுக்கு அருகில் வசதியான மற்றும் வசதியான தங்கும் வாய்ப்புகளை உங்கள் விருந்தினர்களுக்கு வழங்குங்கள்.",
  "bungalows.perNight": "ஒரு இரவுக்கு",
  "bungalows.maxOccupancy": "அதிகபட்ச கொள்ளளவு",
  "bungalows.persons": "நபர்கள்",
  "bungalows.viewDetails": "விவரங்களைக் காண்க",
  "bungalows.bookNow": "இப்போது முன்பதிவு செய்யுங்கள்",
  "bungalows.available": "கிடைக்கிறது",
  "bungalows.notAvailable": "கிடைக்கவில்லை",

  // Booking Page
  "booking.title": "உங்கள் கொண்டாட்டத்தை முன்பதிவு செய்யுங்கள்",
  "booking.subtitle": "உங்கள் சிறப்பு நாளை ஒதுக்கவும்",
  "booking.step.hall": "அரங்கைத் தேர்ந்தெடுக்கவும்",
  "booking.step.date": "தேதியைத் தேர்ந்தெடுக்கவும்",
  "booking.step.event": "நிகழ்வு விவரங்கள்",
  "booking.step.menu": "உணவு தேர்வு",
  "booking.step.services": "சேவைகளைச் சேர்க்கவும்",
  "booking.step.details": "உங்கள் விவரங்கள்",
  "booking.step.confirm": "உறுதிப்படுத்தவும்",
  "booking.next": "அடுத்து",
  "booking.previous": "முந்தைய",
  "booking.submit": "முன்பதிவை சமர்ப்பிக்கவும்",
  "booking.success": "முன்பதிவு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
  "booking.success.message": "உங்கள் ஒதுக்கீட்டை உறுதிப்படுத்த விரைவில் உங்களைத் தொடர்புகொள்வோம்.",
  "booking.selectHall": "மண்டபத்தைத் தேர்ந்தெடுக்கவும்",
  "booking.eventType": "நிகழ்வு வகை",
  "booking.eventDate": "நிகழ்வு தேதி",
  "booking.timeSlot": "நேர இடைவெளி",
  "booking.guestCount": "எதிர்பார்க்கப்படும் விருந்தினர்கள்",
  "booking.selectMenu": "உணவு தொகுப்பைத் தேர்ந்தெடுக்கவும்",
  "booking.menuSection": "உணவு பிரிவு",
  "booking.menuVariant": "உணவு வகை",
  "booking.addServices": "கூடுதல் சேவைகள்",
  "booking.customerName": "முழு பெயர்",
  "booking.customerPhone": "தொலைபேசி எண்",
  "booking.customerEmail": "மின்னஞ்சல் முகவரி",
  "booking.specialRequests": "சிறப்பு கோரிக்கைகள்",

  // Common
  "common.loading": "ஏற்றுகிறது...",
  "common.error": "ஏதோ தவறு நடந்துவிட்டது",
  "common.retry": "மீண்டும் முயற்சிக்கவும்",
  "common.close": "மூடு",
  "common.save": "சேமி",
  "common.cancel": "ரத்து",
  "common.search": "தேடு",
  "common.filter": "வடிகட்டு",
  "common.all": "அனைத்தும்",
  "common.viewMore": "மேலும் காண்க",
  "common.learnMore": "மேலும் அறிக",
  "common.readMore": "மேலும் படிக்க",
  "common.seeAll": "அனைத்தையும் காண்க",
  "common.perDay": "ஒரு நாளுக்கு",
  "common.adults": "பெரியவர்கள்",
  "common.children": "குழந்தைகள்",
  "common.checkIn": "உள்நுழைவு",
  "common.checkOut": "வெளியேறுதல்",
  "common.tariff": "கட்டண விவரங்கள்",
  "common.amenities": "வசதிகள் & சேவைகள்",
  "common.rules": "விதிகள் & கொள்கைகள்",

  // // Footer
  // "footer.about": "எங்களைப் பற்றி",
  // "footer.aboutText": "எங்கள் அழகான பாரம்பரிய அரங்குகள் மற்றும் சிறந்த சேவைகளுடன் மறக்க முடியாத திருமண அனுபவங்களை உருவாக்க நாங்கள் அர்ப்பணிப்புடன் உள்ளோம்.",
  // "footer.quickLinks": "விரைவு இணைப்புகள்",
  // "footer.contact": "தொடர்பு தகவல்",
  // "footer.hours": "வேலை நேரம்",
  // "footer.rights": "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை",
  // "footer.tagline": "2001 முதல் புனித திருமணங்களை உருவாக்குகிறோம்",
};

const translations: Record<Language, Record<string, string>> = { en, ta };

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
