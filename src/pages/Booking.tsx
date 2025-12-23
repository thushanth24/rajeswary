import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { halls, getHallById } from "@/data/halls";
import { menus } from "@/data/services";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FloatingElements } from "@/components/animations/FloatingElements";
import { RangoliPattern } from "@/components/animations/RangoliPattern";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";
import { CTASection } from "@/components/home/CTASection";
import {
  CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Users,
  Snowflake,
  Car,
  Camera,
  Palette,
  Music,
  UserCheck,
  Sparkles,
} from "lucide-react";

type BookingStep = 1 | 2 | 3 | 4 | 5;

interface BookingData {
  // Step 1 - Event Details
  eventType: string;
  eventDate: Date | undefined;
  timeSlot: string;
  guestCount: string;
  // Step 2 - Hall
  hallId: string;
  // Step 3 - Menu
  mealType: string;
  menuPackage: string;
  menuNotes: string;
  // Step 4 - Services
  services: string[];
  serviceNotes: string;
  // Step 5 - Customer
  name: string;
  phone: string;
  email: string;
  message: string;
}

const eventTypes = [
  { id: "wedding", label: "Wedding Ceremony" },
  { id: "reception", label: "Wedding Reception" },
  { id: "engagement", label: "Engagement" },
  { id: "birthday", label: "Birthday Party" },
  { id: "anniversary", label: "Anniversary" },
  { id: "corporate", label: "Corporate Event" },
  { id: "other", label: "Other" },
];

const timeSlots = [
  { id: "morning", label: "Morning (8:00 AM - 4:00 PM)" },
  { id: "evening", label: "Evening (5:00 PM - 12:00 AM)" },
  { id: "fullday", label: "Full Day (8:00 AM - 12:00 AM)" },
];

const addOnServices = [
  { id: "photography", label: "Photography & Videography", icon: Camera },
  { id: "vehicles", label: "Wedding Vehicles", icon: Car },
  { id: "decoration", label: "Decoration & Themes", icon: Palette },
  { id: "sound-lighting", label: "Sound & Lighting / DJ", icon: Music },
  { id: "coordination", label: "Event Coordination", icon: UserCheck },
  { id: "other", label: "Other Services", icon: Sparkles },
];

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedHall = searchParams.get("hall");

  const [step, setStep] = useState<BookingStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [bookingData, setBookingData] = useState<BookingData>({
    eventType: "",
    eventDate: undefined,
    timeSlot: "",
    guestCount: "",
    hallId: preselectedHall || "",
    mealType: "",
    menuPackage: "",
    menuNotes: "",
    services: [],
    serviceNotes: "",
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    if (preselectedHall) {
      setBookingData((prev) => ({ ...prev, hallId: preselectedHall }));
    }
  }, [preselectedHall]);

  const updateBookingData = (field: keyof BookingData, value: string | string[] | Date | undefined) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleService = (serviceId: string) => {
    setBookingData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((s) => s !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return !!(bookingData.eventType && bookingData.eventDate && bookingData.timeSlot && bookingData.guestCount);
      case 2:
        return !!bookingData.hallId;
      case 3:
        return !!(bookingData.mealType && bookingData.menuPackage);
      case 4:
        return true;
      case 5:
        return !!(bookingData.name && bookingData.phone);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep((prev) => (prev + 1) as BookingStep);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as BookingStep);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: "Booking Request Submitted!",
      description: "Our team will contact you within 24 hours to confirm your booking.",
    });
  };

  const selectedHall = bookingData.hallId ? getHallById(bookingData.hallId) : undefined;
  const guestCount = parseInt(bookingData.guestCount) || 0;

  if (isSubmitted) {
    return (
      <Layout>
        <section className="relative py-20 bg-gradient-to-b from-secondary/20 via-card to-background min-h-[70vh] flex items-center overflow-hidden">
          <FloatingElements type="petals" density="low" />
          <RangoliPattern position="center" size="lg" opacity={0.08} />
          
          <div className="container relative z-10 mx-auto px-4 lg:px-8">
            <Card className="max-w-2xl mx-auto card-traditional">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary/30 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 gold-shimmer">
                  <Check className="h-10 w-10 text-primary" />
                </div>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-secondary text-xl">✦</span>
                  <span className="text-secondary font-medium tracking-wider uppercase text-sm">
                    Shubham
                  </span>
                  <span className="text-secondary text-xl">✦</span>
                </div>
                <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
                  Booking Request <span className="text-gradient-gold">Submitted!</span>
                </h1>
                <p className="text-muted-foreground mb-8">
                  Thank you for choosing our sacred mandapams. Our team will contact you 
                  within 24 hours to confirm your muhurtham details.
                </p>
                
                <div className="bg-card p-6 rounded-lg border border-secondary/30 text-left mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-secondary">🪔</span>
                    <h3 className="font-serif font-semibold text-foreground">Booking Summary</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Event Type:</span>
                      <span className="text-foreground">{eventTypes.find(e => e.id === bookingData.eventType)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="text-foreground">{bookingData.eventDate ? format(bookingData.eventDate, "PPP") : "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time Slot:</span>
                      <span className="text-foreground">{timeSlots.find(t => t.id === bookingData.timeSlot)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mandapam:</span>
                      <span className="text-foreground">{selectedHall?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guests:</span>
                      <span className="text-foreground">{bookingData.guestCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Menu:</span>
                      <span className="text-foreground">
                        {menus[bookingData.mealType as keyof typeof menus]?.find(m => m.id === bookingData.menuPackage)?.name}
                      </span>
                    </div>
                    {bookingData.services.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Add-on Services:</span>
                        <span className="text-foreground text-right">
                          {bookingData.services.map(s => addOnServices.find(a => a.id === s)?.label).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button asChild className="gold-shimmer">
                  <a href="/">Return to Home</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Header */}
      <section className="relative py-20 bg-gradient-to-b from-secondary/20 via-card to-background overflow-hidden">
        <FloatingElements type="petals" density="low" />
        <RangoliPattern position="center" size="lg" opacity={0.08} />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
          {/* Decorative Top Element */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-secondary" />
            <span className="text-secondary text-2xl">🪔</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-secondary" />
          </div>
          
          <span className="text-secondary font-medium tracking-wider uppercase text-sm animate-fade-in">
            ✦ Sacred Booking ✦
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6 animate-fade-in-up">
            Book Your <span className="text-gradient-gold">Muhurtham</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Complete the following steps to submit your booking request. Our team 
            will contact you to confirm availability and finalize your sacred ceremony details.
          </p>
          
          {/* Decorative Divider */}
          <div className="divider-ornate mt-8" />
        </div>
      </section>

      {/* Progress Steps */}
      <section className="relative py-6 bg-card border-b border-secondary/20">
        <DecorativeBorder position="top" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between max-w-3xl mx-auto">
            {[
              { num: 1, label: "Event", icon: "📅" },
              { num: 2, label: "Mandapam", icon: "🏛️" },
              { num: 3, label: "Virundhu", icon: "🍽️" },
              { num: 4, label: "Seva", icon: "✨" },
              { num: 5, label: "Details", icon: "📝" },
            ].map((s, index) => (
              <div key={s.num} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                    step >= s.num
                      ? "bg-gradient-to-br from-secondary/30 to-primary/20 text-primary gold-shimmer"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step > s.num ? <Check className="h-5 w-5 text-primary" /> : <span className="text-lg">{s.icon}</span>}
                </div>
                <span className={cn(
                  "text-xs mt-2 hidden sm:block font-medium",
                  step >= s.num ? "text-primary" : "text-muted-foreground"
                )}>
                  {s.label}
                </span>
                {index < 4 && (
                  <div className={cn(
                    "absolute h-0.5 w-12 top-9 hidden md:block",
                    step > s.num ? "bg-secondary" : "bg-border"
                  )} style={{ left: `calc(${(index + 1) * 20}% - 1.5rem)` }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Steps */}
      <section className="relative py-12 bg-background min-h-[60vh] overflow-hidden">
        <div className="absolute inset-0 paisley-bg opacity-20" />
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <Card className="max-w-3xl mx-auto card-traditional">
            <CardContent className="p-6 md:p-8">
              {/* Step 1: Event Details */}
              {step === 1 && (
                <div className="space-y-6">
                  <CardHeader className="p-0 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-secondary text-xl">📅</span>
                      <CardTitle className="font-serif text-2xl text-gradient-gold">Event Details</CardTitle>
                    </div>
                  </CardHeader>

                  <div>
                    <Label className="mb-3 block">Event Type</Label>
                    <RadioGroup
                      value={bookingData.eventType}
                      onValueChange={(value) => updateBookingData("eventType", value)}
                      className="grid grid-cols-2 md:grid-cols-3 gap-3"
                    >
                      {eventTypes.map((type) => (
                        <div key={type.id}>
                          <RadioGroupItem
                            value={type.id}
                            id={type.id}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={type.id}
                            className={cn(
                              "flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all",
                              bookingData.eventType === type.id
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            {type.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Event Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !bookingData.eventDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingData.eventDate ? format(bookingData.eventDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={bookingData.eventDate}
                          onSelect={(date) => updateBookingData("eventDate", date)}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Time Slot</Label>
                    <Select
                      value={bookingData.timeSlot}
                      onValueChange={(value) => updateBookingData("timeSlot", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot.id} value={slot.id}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="guestCount">Expected Guest Count</Label>
                    <Input
                      id="guestCount"
                      type="number"
                      value={bookingData.guestCount}
                      onChange={(e) => updateBookingData("guestCount", e.target.value)}
                      placeholder="e.g., 300"
                      min="50"
                      max="1000"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Choose Hall */}
              {step === 2 && (
                <div className="space-y-6">
                  <CardHeader className="p-0 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-secondary text-xl">🏛️</span>
                      <CardTitle className="font-serif text-2xl text-gradient-gold">Choose Mandapam</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {guestCount > 0 && `For ${guestCount} guests`}
                    </p>
                  </CardHeader>

                  <RadioGroup
                    value={bookingData.hallId}
                    onValueChange={(value) => updateBookingData("hallId", value)}
                    className="grid gap-4"
                  >
                    {halls.map((hall) => {
                      const isSuitable = guestCount <= hall.capacity.max && guestCount >= hall.capacity.min * 0.5;
                      const isOverCapacity = guestCount > hall.capacity.max;
                      
                      return (
                        <div key={hall.id}>
                          <RadioGroupItem
                            value={hall.id}
                            id={hall.id}
                            className="peer sr-only"
                            disabled={isOverCapacity}
                          />
                          <Label
                            htmlFor={hall.id}
                            className={cn(
                              "flex gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                              bookingData.hallId === hall.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50",
                              isOverCapacity && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <img
                              src={hall.image}
                              alt={hall.name}
                              className="w-24 h-20 object-cover rounded-md shrink-0"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground">{hall.name}</h3>
                                {isOverCapacity && (
                                  <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">
                                    Capacity exceeded
                                  </span>
                                )}
                                {isSuitable && !isOverCapacity && (
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                    Recommended
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{hall.capacity.min} - {hall.capacity.max} guests</span>
                              </div>
                              <div className="flex gap-2 mt-2">
                                {hall.facilities.ac && (
                                  <span className="text-xs bg-muted/50 px-2 py-0.5 rounded flex items-center gap-1">
                                    <Snowflake className="h-3 w-3" /> AC
                                  </span>
                                )}
                                {hall.facilities.parking && (
                                  <span className="text-xs bg-muted/50 px-2 py-0.5 rounded flex items-center gap-1">
                                    <Car className="h-3 w-3" /> Parking
                                  </span>
                                )}
                              </div>
                            </div>
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              )}

              {/* Step 3: Menu Selection */}
              {step === 3 && (
                <div className="space-y-6">
                  <CardHeader className="p-0 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-secondary text-xl">🍽️</span>
                      <CardTitle className="font-serif text-2xl text-gradient-gold">Virundhu Selection</CardTitle>
                    </div>
                  </CardHeader>

                  <div>
                    <Label className="mb-3 block">Meal Type</Label>
                    <RadioGroup
                      value={bookingData.mealType}
                      onValueChange={(value) => {
                        updateBookingData("mealType", value);
                        updateBookingData("menuPackage", "");
                      }}
                      className="grid grid-cols-3 gap-3"
                    >
                      {["breakfast", "lunch", "dinner"].map((type) => (
                        <div key={type}>
                          <RadioGroupItem
                            value={type}
                            id={`meal-${type}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`meal-${type}`}
                            className={cn(
                              "flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all capitalize",
                              bookingData.mealType === type
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            {type}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {bookingData.mealType && (
                    <div>
                      <Label className="mb-3 block">Menu Package</Label>
                      <RadioGroup
                        value={bookingData.menuPackage}
                        onValueChange={(value) => updateBookingData("menuPackage", value)}
                        className="grid gap-4"
                      >
                        {menus[bookingData.mealType as keyof typeof menus]?.map((menu) => (
                          <div key={menu.id}>
                            <RadioGroupItem
                              value={menu.id}
                              id={menu.id}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={menu.id}
                              className={cn(
                                "flex justify-between items-start p-4 rounded-lg border cursor-pointer transition-all",
                                bookingData.menuPackage === menu.id
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <div>
                                <h3 className="font-semibold text-foreground">{menu.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {menu.items.join(" • ")}
                                </p>
                              </div>
                              <span className="text-primary font-semibold shrink-0 ml-4">
                                {menu.price}
                              </span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="menuNotes">Special Requests / Dietary Requirements</Label>
                    <Textarea
                      id="menuNotes"
                      value={bookingData.menuNotes}
                      onChange={(e) => updateBookingData("menuNotes", e.target.value)}
                      placeholder="Any special requests or dietary requirements..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Add-on Services */}
              {step === 4 && (
                <div className="space-y-6">
                  <CardHeader className="p-0 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-secondary text-xl">✨</span>
                      <CardTitle className="font-serif text-2xl text-gradient-gold">Additional Seva</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select any additional services you'd like to include
                    </p>
                  </CardHeader>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {addOnServices.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                          bookingData.services.includes(service.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <Checkbox
                          checked={bookingData.services.includes(service.id)}
                          className="pointer-events-none"
                        />
                        <service.icon className="h-5 w-5 text-primary" />
                        <span className="text-foreground">{service.label}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label htmlFor="serviceNotes">Special Notes for Services</Label>
                    <Textarea
                      id="serviceNotes"
                      value={bookingData.serviceNotes}
                      onChange={(e) => updateBookingData("serviceNotes", e.target.value)}
                      placeholder="Any specific requirements for the selected services..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Customer Details */}
              {step === 5 && (
                <div className="space-y-6">
                  <CardHeader className="p-0 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-secondary text-xl">📝</span>
                      <CardTitle className="font-serif text-2xl text-gradient-gold">Your Details</CardTitle>
                    </div>
                  </CardHeader>

                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={bookingData.name}
                      onChange={(e) => updateBookingData("name", e.target.value)}
                      placeholder="Your full name"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => updateBookingData("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={bookingData.email}
                      onChange={(e) => updateBookingData("email", e.target.value)}
                      placeholder="your@email.com"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Additional Message</Label>
                    <Textarea
                      id="message"
                      value={bookingData.message}
                      onChange={(e) => updateBookingData("message", e.target.value)}
                      placeholder="Any other information you'd like to share..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-secondary/20">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="border-secondary/30 hover:bg-secondary/10"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                {step < 5 ? (
                  <Button onClick={handleNext} disabled={!canProceed()} className="gold-shimmer">
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting} className="gold-shimmer">
                    {isSubmitting ? "Submitting..." : "Submit Sacred Booking"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection 
        subtitle="Need Assistance?"
        title="Have Questions About Your"
        highlight="Booking"
        description="Our team is here to help you plan your perfect celebration. Reach out to us for personalized assistance."
        primaryButtonText="Contact Us"
        primaryButtonLink="/contact"
        showSecondaryButton={true}
      />
    </Layout>
  );
};

export default BookingPage;
