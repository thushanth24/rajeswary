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
import { useHalls } from "@/hooks/useHalls";
import { menus } from "@/data/services";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FloatingElements } from "@/components/animations/FloatingElements";
import { RangoliPattern } from "@/components/animations/RangoliPattern";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";
import { CTASection } from "@/components/home/CTASection";
import { supabase } from "@/integrations/supabase/client";
import { useBlockedDates } from "@/hooks/useBlockedDates";
import { SelectedHallSummary } from "@/components/booking/SelectedHallSummary";
import { MenuQuickViewModal } from "@/components/menu/MenuQuickViewModal";
import { useLanguage } from "@/contexts/LanguageContext";
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
  Lock,
  AlertTriangle,
  Building2,
  Eye,
  Headphones,
  Gem,
} from "lucide-react";

type BookingStep = 1 | 2 | 3 | 4 | 5;

interface BookingData {
  // Step 1 - Hall (NEW ORDER)
  hallId: string;
  // Step 2 - Event Details (NEW ORDER)
  eventType: string;
  eventDate: Date | undefined;
  timeSlot: string;
  guestCount: string;
  // Step 3 - Menu
  menuSection: string;
  menuVariant: string;
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

const BOOKING_REF_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateBookingReference() {
  const year = new Date().getFullYear();
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes)
    .map((b) => BOOKING_REF_CHARS[b % BOOKING_REF_CHARS.length])
    .join("");
  return `CH-${year}-${suffix}`;
}

const addOnServices = [
  { id: "photography", label: "Photography & Videography", icon: Camera },
  { id: "vehicles", label: "Wedding Vehicles", icon: Car },
  { id: "decoration", label: "Decoration & Themes", icon: Palette },
  { id: "sound-lighting", label: "Sound & Lighting", icon: Music },
  { id: "coordination", label: "Event Coordination", icon: UserCheck },
  { id: "dj-music", label: "DJ & Music", icon: Headphones },
  { id: "makeup", label: "Bridal Makeup", icon: Sparkles },
  { id: "jewellery", label: "Jewellery Rental", icon: Gem },
  { id: "other", label: "Other Services", icon: Sparkles },
];

const BookingPage = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const preselectedHall = searchParams.get("hall");
  
  // Fetch halls from database
  const { halls, loading: hallsLoading, getHallById } = useHalls();

  // Auto-skip to step 2 if hall is pre-selected
  const [step, setStep] = useState<BookingStep>(preselectedHall ? 2 : 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedHallUUID, setSelectedHallUUID] = useState<string | null>(null);
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  const [previewMenu, setPreviewMenu] = useState<{ menu: any; variant: "veg" | "nonveg" | "special" } | null>(null);

  const [bookingData, setBookingData] = useState<BookingData>({
    eventType: "",
    eventDate: undefined,
    timeSlot: "",
    guestCount: "",
    hallId: preselectedHall || "",
    menuSection: "",
    menuVariant: "",
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

  // Fetch blocked dates for the selected hall
  const { isDateBlocked, getBlockedReason } = useBlockedDates(selectedHallUUID);

  // Fetch hall UUID when hall is selected
  useEffect(() => {
    const fetchHallUUID = async () => {
      if (!bookingData.hallId) {
        setSelectedHallUUID(null);
        return;
      }

      const { data, error } = await supabase
        .from("halls")
        .select("id")
        .eq("slug", bookingData.hallId)
        .maybeSingle();

      if (!error && data) {
        setSelectedHallUUID(data.id);
      }
    };

    fetchHallUUID();
  }, [bookingData.hallId]);

  useEffect(() => {
    if (preselectedHall) {
      setBookingData((prev) => ({ ...prev, hallId: preselectedHall }));
    }
  }, [preselectedHall]);

  const updateBookingData = (field: keyof BookingData, value: string | string[] | Date | undefined) => {
    setBookingData((prev) => {
      // Clear date if hall changes (different halls may have different blocked dates)
      if (field === "hallId" && typeof value === "string" && value !== prev.hallId) {
        return { ...prev, hallId: value, eventDate: undefined };
      }
      return { ...prev, [field]: value } as BookingData;
    });
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
    const hall = bookingData.hallId ? getHallById(bookingData.hallId) : undefined;
    const guests = parseInt(bookingData.guestCount) || 0;
    const overCapacity = hall && guests > hall.capacity.max;

    switch (step) {
      case 1:
        // Step 1 is now Hall selection
        return !!bookingData.hallId;
      case 2:
        // Step 2 is now Event details - block if over capacity
        if (overCapacity) return false;
        return !!(bookingData.eventType && bookingData.eventDate && bookingData.timeSlot && bookingData.guestCount);
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
    
    try {
      // Input validation
      const trimmedName = bookingData.name.trim();
      const trimmedPhone = bookingData.phone.trim();
      const trimmedEmail = bookingData.email.trim();
      
      // Validate name (required, max 200 chars)
      if (!trimmedName || trimmedName.length > 200) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid name (max 200 characters).",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validate phone (required, 10-20 digits, common formats)
      const phoneRegex = /^[\d\s\-+()]{10,20}$/;
      if (!trimmedPhone || !phoneRegex.test(trimmedPhone)) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid phone number (10-20 digits).",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validate email (optional, but if provided must be valid format, max 255 chars)
      if (trimmedEmail) {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 255) {
          toast({
            title: "Validation Error",
            description: "Please enter a valid email address.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Validate guest count (positive number, reasonable max)
      const guestCount = parseInt(bookingData.guestCount);
      if (isNaN(guestCount) || guestCount <= 0 || guestCount > 10000) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid guest count (1-10000).",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validate event date (must be today or future, within 2 years)
      if (!bookingData.eventDate) {
        toast({
          title: "Validation Error",
          description: "Please select an event date.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 2);
      
      if (bookingData.eventDate < today || bookingData.eventDate > maxDate) {
        toast({
          title: "Validation Error",
          description: "Event date must be between today and 2 years from now.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Limit free text fields to prevent abuse
      const maxTextLength = 2000;
      if (bookingData.message && bookingData.message.length > maxTextLength) {
        toast({
          title: "Validation Error",
          description: `Message must be less than ${maxTextLength} characters.`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (bookingData.menuNotes && bookingData.menuNotes.length > maxTextLength) {
        toast({
          title: "Validation Error",
          description: `Menu notes must be less than ${maxTextLength} characters.`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (bookingData.serviceNotes && bookingData.serviceNotes.length > maxTextLength) {
        toast({
          title: "Validation Error",
          description: `Service notes must be less than ${maxTextLength} characters.`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Get the hall UUID from Supabase based on the hall slug/id
      const { data: hallData, error: hallError } = await supabase
        .from('halls')
        .select('id')
        .eq('slug', bookingData.hallId)
        .maybeSingle();

      if (hallError || !hallData) {
        toast({
          title: "Error",
          description: "Could not find the selected hall. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Real-time date revalidation - fresh check from database before submitting
      if (bookingData.eventDate && hallData.id) {
        setIsRevalidating(true);
        const eventDateStr = format(bookingData.eventDate, "yyyy-MM-dd");
        
        // Check for confirmed bookings
        const { data: existingBookings } = await supabase
          .from('bookings')
          .select('id')
          .eq('hall_id', hallData.id)
          .eq('event_date', eventDateStr)
          .eq('status', 'confirmed')
          .limit(1);

        // Check for closed dates
        const { data: closedDates } = await supabase
          .from('hall_closed_dates')
          .select('id')
          .eq('hall_id', hallData.id)
          .eq('closed_date', eventDateStr)
          .limit(1);

        setIsRevalidating(false);

        if (existingBookings && existingBookings.length > 0) {
          toast({
            title: "Date No Longer Available",
            description: "Someone else has booked this date while you were filling the form. Please select another date.",
            variant: "destructive",
          });
          setStep(2); // Go back to date selection
          setIsSubmitting(false);
          return;
        }

        if (closedDates && closedDates.length > 0) {
          toast({
            title: "Date Now Closed",
            description: "This date has been closed for bookings. Please select another date.",
            variant: "destructive",
          });
          setStep(2); // Go back to date selection
          setIsSubmitting(false);
          return;
        }
      }

      // Map time slot to actual times
      const timeSlotMap: Record<string, { start: string; end: string }> = {
        morning: { start: "08:00", end: "16:00" },
        evening: { start: "17:00", end: "00:00" },
        fullday: { start: "08:00", end: "00:00" },
      };
      const times = timeSlotMap[bookingData.timeSlot] || { start: null, end: null };

      // Build special requests from menu and services (sanitize by limiting length)
      const specialRequestsParts = [
        bookingData.mealType && `Meal Type: ${bookingData.mealType.substring(0, 50)}`,
        bookingData.menuPackage && `Menu: ${menus[bookingData.mealType as keyof typeof menus]?.find(m => m.id === bookingData.menuPackage)?.name?.substring(0, 100) || ''}`,
        bookingData.menuNotes && `Menu Notes: ${bookingData.menuNotes.substring(0, maxTextLength)}`,
        bookingData.services.length > 0 && `Services: ${bookingData.services.map(s => addOnServices.find(a => a.id === s)?.label).filter(Boolean).join(", ").substring(0, 500)}`,
        bookingData.serviceNotes && `Service Notes: ${bookingData.serviceNotes.substring(0, maxTextLength)}`,
        bookingData.message && `Message: ${bookingData.message.substring(0, maxTextLength)}`,
      ].filter(Boolean);
      
      const specialRequests = specialRequestsParts.join("\n").substring(0, 5000);

      // Generate a customer-facing reference locally so we don't need to read the (private) booking row back.
      // Reading back would require SELECT policies on a table that contains PII.
      const referenceNumber = generateBookingReference();

      const { error: insertError } = await supabase
        .from('bookings')
        .insert({
          hall_id: hallData.id,
          event_date: format(bookingData.eventDate, "yyyy-MM-dd"),
          event_start_time: times.start,
          event_end_time: times.end,
          event_type: eventTypes.find(e => e.id === bookingData.eventType)?.label || bookingData.eventType.substring(0, 100),
          customer_name: trimmedName.substring(0, 200),
          customer_phone: trimmedPhone.substring(0, 20),
          customer_email: trimmedEmail ? trimmedEmail.substring(0, 255) : null,
          expected_guests: guestCount,
          special_requests: specialRequests || null,
          status: 'new',
          is_manual_booking: false,
          reference_number: referenceNumber,
        });

      if (insertError) {
        console.error("Booking submit failed:", insertError);
        toast({
          title: "Booking submission failed",
          description: `${insertError.message}${insertError.code ? ` (code: ${insertError.code})` : ""}`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      setBookingReference(referenceNumber);

      // Send confirmation email (fire and forget - don't block the UI)
      if (trimmedEmail) {
        const hallName = halls.find(h => h.slug === bookingData.hallId)?.name || 'Hall';
        const eventTypeName = eventTypes.find(e => e.id === bookingData.eventType)?.label || bookingData.eventType;

        supabase.functions.invoke('send-booking-confirmation', {
          body: {
            customerName: trimmedName,
            customerEmail: trimmedEmail,
            referenceNumber,
            hallName: hallName,
            eventDate: format(bookingData.eventDate!, "PPP"),
            eventType: eventTypeName,
            expectedGuests: guestCount,
          },
        }).then(({ error }) => {
          if (error) {
            console.error('Failed to send confirmation email:', error);
          }
        });
      }

      setIsSubmitted(true);
      toast({
        title: "Booking Request Submitted!",
        description: "Our team will contact you within 24 hours to confirm your booking.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedHall = bookingData.hallId ? getHallById(bookingData.hallId) : undefined;
  const guestCount = parseInt(bookingData.guestCount) || 0;
  const isOverCapacity = selectedHall && guestCount > selectedHall.capacity.max;

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
                
                {/* Reference Number Display */}
                {bookingReference && (
                  <div className="bg-gradient-to-r from-secondary/20 to-primary/10 border-2 border-secondary/40 rounded-lg p-4 mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Your Booking Reference</p>
                    <p className="font-mono text-2xl font-bold text-primary tracking-wider">
                      {bookingReference}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Please save this reference number to track your booking
                    </p>
                  </div>
                )}
                
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
                    {bookingReference && (
                      <div className="flex justify-between pb-2 border-b border-secondary/20">
                        <span className="text-muted-foreground">Reference:</span>
                        <span className="font-mono font-semibold text-primary">{bookingReference}</span>
                      </div>
                    )}
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
                
                <Button asChild variant="outline" className="border-foreground/30 text-foreground hover:bg-foreground/5">
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
      <section className="relative py-12 md:py-20 bg-gradient-to-b from-secondary/20 via-card to-background overflow-hidden">
        <FloatingElements type="petals" density="low" />
        <RangoliPattern position="center" size="lg" opacity={0.08} />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
          {/* Decorative Top Element */}
          <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
            <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-secondary" />
            <span className="text-secondary text-xl md:text-2xl">🪔</span>
            <div className="h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-secondary" />
          </div>
          
          <span className="text-secondary font-medium tracking-wider uppercase text-xs md:text-sm animate-fade-in">
            ✦ {t("booking.subtitle")} ✦
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3 md:mt-4 mb-4 md:mb-6 animate-fade-in-up">
            {t("booking.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-lg animate-fade-in-up px-2" style={{ animationDelay: '0.2s' }}>
            {t("booking.success.message")}
          </p>
          
          {/* Decorative Divider */}
          <div className="divider-ornate mt-6 md:mt-8" />
        </div>
      </section>

      {/* Progress Steps */}
      <section className="relative py-4 md:py-6 bg-card border-b border-secondary/20">
        <DecorativeBorder position="top" />
        <div className="container mx-auto px-2 md:px-4 lg:px-8">
          <div className="flex justify-between max-w-3xl mx-auto">
            {[
              { num: 1, label: t("booking.step.hall"), icon: "🏛️" },
              { num: 2, label: t("booking.step.event"), icon: "📅" },
              { num: 3, label: t("booking.step.menu"), icon: "🍽️" },
              { num: 4, label: t("booking.step.services"), icon: "✨" },
              { num: 5, label: t("booking.step.details"), icon: "📝" },
            ].map((s, index) => (
              <div key={s.num} className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                    step >= s.num
                      ? "bg-gradient-to-br from-secondary/30 to-primary/20 text-primary gold-shimmer"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step > s.num ? <Check className="h-4 w-4 md:h-5 md:w-5 text-primary" /> : <span className="text-base md:text-lg">{s.icon}</span>}
                </div>
                <span className={cn(
                  "text-[10px] md:text-xs mt-1 md:mt-2 font-medium text-center",
                  step >= s.num ? "text-primary" : "text-muted-foreground"
                )}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Steps */}
      <section className="relative py-6 md:py-12 bg-background min-h-[60vh] overflow-hidden">
        <div className="absolute inset-0 paisley-bg opacity-20" />
        <div className="container relative z-10 mx-auto px-2 sm:px-4 lg:px-8">
          <Card className="max-w-3xl mx-auto card-traditional">
            <CardContent className="p-4 sm:p-6 md:p-8">
              {/* Step 1: Choose Hall (NEW ORDER) */}
              {step === 1 && (
                <div className="space-y-4 md:space-y-6">
                  <CardHeader className="p-0 mb-4 md:mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-secondary text-lg md:text-xl">🏛️</span>
                      <CardTitle className="font-serif text-xl md:text-2xl text-gradient-gold">Choose Mandapam</CardTitle>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      Select your preferred venue to see available dates
                    </p>
                  </CardHeader>

                  {hallsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <RadioGroup
                      value={bookingData.hallId}
                      onValueChange={(value) => updateBookingData("hallId", value)}
                      className="grid gap-3 md:gap-4"
                    >
                    {halls.map((hall) => (
                      <div key={hall.id}>
                        <RadioGroupItem
                          value={hall.id}
                          id={hall.id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={hall.id}
                          className={cn(
                            "flex gap-3 md:gap-4 p-3 md:p-4 rounded-lg border cursor-pointer transition-all",
                            bookingData.hallId === hall.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <img
                            src={hall.image}
                            alt={hall.name}
                            className="w-16 h-14 md:w-24 md:h-20 object-cover rounded-md shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground text-sm md:text-base truncate">{hall.name}</h3>
                            <div className="flex items-center gap-1 md:gap-2 mt-1 text-xs md:text-sm text-muted-foreground">
                              <Users className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                              <span className="truncate">{hall.capacity.min} - {hall.capacity.max} guests</span>
                            </div>
                            <div className="flex gap-1 md:gap-2 mt-1 md:mt-2 flex-wrap">
                              {hall.facilities.ac && (
                                <span className="text-[10px] md:text-xs bg-muted/50 px-1.5 md:px-2 py-0.5 rounded flex items-center gap-0.5 md:gap-1">
                                  <Snowflake className="h-2.5 w-2.5 md:h-3 md:w-3" /> AC
                                </span>
                              )}
                              {hall.facilities.parking && (
                                <span className="text-[10px] md:text-xs bg-muted/50 px-1.5 md:px-2 py-0.5 rounded flex items-center gap-0.5 md:gap-1">
                                  <Car className="h-2.5 w-2.5 md:h-3 md:w-3" /> Parking
                                </span>
                              )}
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  )}
                </div>
              )}

              {/* Step 2: Event Details (NEW ORDER - with blocked dates now available) */}
              {step === 2 && (
                <div className="space-y-4 md:space-y-6">
                  {/* Hall Summary */}
                  {selectedHall && (
                    <SelectedHallSummary
                      hall={selectedHall}
                      onChangeHall={() => setStep(1)}
                    />
                  )}

                  <CardHeader className="p-0 mb-4 md:mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-secondary text-lg md:text-xl">📅</span>
                      <CardTitle className="font-serif text-xl md:text-2xl text-gradient-gold">Event Details</CardTitle>
                    </div>
                  </CardHeader>

                  <div>
                    <Label className="mb-2 md:mb-3 block text-sm">Event Type</Label>
                    <RadioGroup
                      value={bookingData.eventType}
                      onValueChange={(value) => updateBookingData("eventType", value)}
                      className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3"
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
                              "flex items-center justify-center p-2 md:p-3 rounded-lg border cursor-pointer transition-all text-xs md:text-sm",
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
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Dates with confirmed bookings or closures are unavailable
                    </p>
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
                          onSelect={(date) => {
                            if (date && selectedHallUUID && isDateBlocked(date)) {
                              toast({
                                title: "Date Unavailable",
                                description: getBlockedReason(date) === "confirmed" 
                                  ? "This date is already booked."
                                  : "This date is closed for bookings.",
                                variant: "destructive",
                              });
                              return;
                            }
                            updateBookingData("eventDate", date);
                          }}
                          disabled={(date) => {
                            if (date < new Date()) return true;
                            if (selectedHallUUID && isDateBlocked(date)) return true;
                            return false;
                          }}
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
                      max="10000"
                      className={cn(
                        "mt-1",
                        isOverCapacity && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {selectedHall && guestCount > 0 && (
                      <>
                        {isOverCapacity ? (
                          <div className="flex items-start gap-2 mt-2 p-2 md:p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                            <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                            <p className="text-xs md:text-sm text-destructive">
                              <strong>Exceeds capacity!</strong> Max {selectedHall.capacity.max} guests. 
                              <span className="hidden sm:inline"> Please reduce guest count or select a larger venue.</span>
                            </p>
                          </div>
                        ) : guestCount < selectedHall.capacity.min * 0.5 ? (
                          <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                            <Users className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                            <p className="text-xs md:text-sm text-yellow-600">
                              Hall may be too large for {guestCount} guests.
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs mt-1 text-muted-foreground">
                            Capacity: {selectedHall.capacity.min} - {selectedHall.capacity.max} guests ✓
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Menu Selection */}
              {step === 3 && (
                <div className="space-y-4 md:space-y-6">
                  {/* Hall Summary */}
                  {selectedHall && (
                    <SelectedHallSummary
                      hall={selectedHall}
                      eventDate={bookingData.eventDate}
                      timeSlot={bookingData.timeSlot}
                      guestCount={guestCount}
                      onChangeHall={() => setStep(1)}
                    />
                  )}

                  <CardHeader className="p-0 mb-4 md:mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-secondary text-lg md:text-xl">🍽️</span>
                      <CardTitle className="font-serif text-xl md:text-2xl text-gradient-gold">Virundhu Selection</CardTitle>
                    </div>
                  </CardHeader>

                  <div>
                    <Label className="mb-2 md:mb-3 block text-sm">Select Menu Category</Label>
                    <RadioGroup
                      value={bookingData.menuSection}
                      onValueChange={(value) => {
                        updateBookingData("menuSection", value);
                        updateBookingData("menuVariant", "");
                        updateBookingData("mealType", "");
                        updateBookingData("menuPackage", "");
                      }}
                      className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3"
                    >
                      {[
                        { id: "pubert", label: "Pubert (Lunch)", icon: "☀️" },
                        { id: "dinner", label: "Dinner", icon: "🌙" },
                        { id: "wedding", label: "Wedding", icon: "💒" },
                        { id: "registration", label: "Registration", icon: "📝" },
                      ].map((section) => (
                        <div key={section.id}>
                          <RadioGroupItem
                            value={section.id}
                            id={`section-${section.id}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`section-${section.id}`}
                            className={cn(
                              "flex flex-col items-center justify-center p-3 md:p-4 rounded-lg border cursor-pointer transition-all text-center min-h-[70px] md:min-h-[80px]",
                              bookingData.menuSection === section.id
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <span className="text-xl md:text-2xl mb-1 md:mb-2">{section.icon}</span>
                            <span className="text-xs md:text-sm font-medium leading-tight">{section.label}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {bookingData.menuSection && (
                    <div>
                      <Label className="mb-2 md:mb-3 block text-sm">Select Type</Label>
                      {(() => {
                        const hasSpecial = ["pubert", "dinner", "wedding"].includes(bookingData.menuSection);
                        const variants = [
                          { id: "veg", label: "Veg", fullLabel: "Vegetarian", icon: "🥬", activeClass: "border-green-500 bg-green-500/10 text-green-700", hoverClass: "hover:border-green-500/50" },
                          { id: "nonveg", label: "Non-Veg", fullLabel: "Non-Vegetarian", icon: "🍗", activeClass: "border-orange-500 bg-orange-500/10 text-orange-700", hoverClass: "hover:border-orange-500/50" },
                          ...(hasSpecial ? [{ id: "special", label: "Special", fullLabel: "Special", icon: "✨", activeClass: "border-primary bg-primary/10 text-primary", hoverClass: "hover:border-primary/50" }] : []),
                        ];
                        return (
                          <RadioGroup
                            value={bookingData.menuVariant}
                            onValueChange={(value) => {
                              updateBookingData("menuVariant", value);
                              let mealTypeKey = "";
                              if (value === "veg") {
                                mealTypeKey = `${bookingData.menuSection}Veg`;
                              } else if (value === "nonveg") {
                                mealTypeKey = `${bookingData.menuSection}NonVeg`;
                              } else if (value === "special") {
                                mealTypeKey = `${bookingData.menuSection}Special`;
                              }
                              updateBookingData("mealType", mealTypeKey);
                              updateBookingData("menuPackage", "");
                            }}
                            className={cn("grid gap-2 md:gap-3", hasSpecial ? "grid-cols-3" : "grid-cols-2", "max-w-xl")}
                          >
                            {variants.map((variant) => (
                              <div key={variant.id}>
                                <RadioGroupItem
                                  value={variant.id}
                                  id={`variant-${variant.id}`}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={`variant-${variant.id}`}
                                  className={cn(
                                    "flex items-center justify-center gap-1 md:gap-2 p-2 md:p-4 rounded-lg border cursor-pointer transition-all",
                                    bookingData.menuVariant === variant.id
                                      ? variant.activeClass
                                      : `border-border ${variant.hoverClass}`
                                  )}
                                >
                                  <span className="text-lg md:text-xl">{variant.icon}</span>
                                  <span className="font-medium text-xs md:text-sm">
                                    <span className="hidden sm:inline">{variant.fullLabel}</span>
                                    <span className="sm:hidden">{variant.label}</span>
                                  </span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        );
                      })()}
                    </div>
                  )}

                  {bookingData.mealType && menus[bookingData.mealType as keyof typeof menus] && (
                    <div>
                      <Label className="mb-2 md:mb-3 block text-sm">Select Package</Label>
                      <RadioGroup
                        value={bookingData.menuPackage}
                        onValueChange={(value) => updateBookingData("menuPackage", value)}
                        className="grid gap-3 md:gap-4"
                      >
                        {menus[bookingData.mealType as keyof typeof menus]?.map((menu) => {
                          const variant = bookingData.menuVariant === "special" 
                            ? "special" 
                            : bookingData.menuVariant === "veg" 
                              ? "veg" 
                              : "nonveg";
                          return (
                            <div key={menu.id} className="relative">
                              <RadioGroupItem
                                value={menu.id}
                                id={menu.id}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={menu.id}
                                className={cn(
                                  "flex flex-col sm:flex-row sm:justify-between sm:items-start p-3 md:p-4 rounded-lg border cursor-pointer transition-all pr-12 md:pr-14",
                                  bookingData.menuPackage === menu.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                )}
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between sm:justify-start gap-2">
                                    <h3 className="font-semibold text-foreground text-sm md:text-base">{menu.name}</h3>
                                    <span className="text-primary font-semibold text-sm md:text-base sm:hidden">
                                      {menu.price}
                                    </span>
                                  </div>
                                  <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {menu.items.slice(0, 2).join(" • ")}
                                    {menu.items.length > 2 && " ..."}
                                  </p>
                                </div>
                                <span className="text-primary font-semibold shrink-0 ml-4 hidden sm:block">
                                  {menu.price}
                                </span>
                              </Label>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setPreviewMenu({ menu, variant });
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-secondary/20 hover:bg-secondary/40 flex items-center justify-center transition-colors"
                                title="Preview menu"
                              >
                                <Eye className="h-4 w-4 text-secondary" />
                              </button>
                            </div>
                          );
                        })}
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
                <div className="space-y-4 md:space-y-6">
                  {/* Hall Summary */}
                  {selectedHall && (
                    <SelectedHallSummary
                      hall={selectedHall}
                      eventDate={bookingData.eventDate}
                      timeSlot={bookingData.timeSlot}
                      guestCount={guestCount}
                      onChangeHall={() => setStep(1)}
                    />
                  )}

                  <CardHeader className="p-0 mb-4 md:mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-secondary text-lg md:text-xl">✨</span>
                      <CardTitle className="font-serif text-xl md:text-2xl text-gradient-gold">Additional Seva</CardTitle>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      Select any additional services you'd like to include
                    </p>
                  </CardHeader>

                  <div className="grid gap-2 md:gap-3 sm:grid-cols-2">
                    {addOnServices.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className={cn(
                          "flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg border cursor-pointer transition-all",
                          bookingData.services.includes(service.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <Checkbox
                          checked={bookingData.services.includes(service.id)}
                          className="pointer-events-none h-4 w-4"
                        />
                        <service.icon className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                        <span className="text-foreground text-sm md:text-base">{service.label}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label htmlFor="serviceNotes" className="text-sm">Special Notes for Services</Label>
                    <Textarea
                      id="serviceNotes"
                      value={bookingData.serviceNotes}
                      onChange={(e) => updateBookingData("serviceNotes", e.target.value)}
                      placeholder="Any specific requirements for the selected services..."
                      rows={3}
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Customer Details */}
              {step === 5 && (
                <div className="space-y-4 md:space-y-6">
                  {/* Hall Summary */}
                  {selectedHall && (
                    <SelectedHallSummary
                      hall={selectedHall}
                      eventDate={bookingData.eventDate}
                      timeSlot={bookingData.timeSlot}
                      guestCount={guestCount}
                      onChangeHall={() => setStep(1)}
                    />
                  )}

                  <CardHeader className="p-0 mb-4 md:mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-secondary text-lg md:text-xl">📝</span>
                      <CardTitle className="font-serif text-xl md:text-2xl text-gradient-gold">Your Details</CardTitle>
                    </div>
                  </CardHeader>

                  <div>
                    <Label htmlFor="name" className="text-sm">Full Name *</Label>
                    <Input
                      id="name"
                      value={bookingData.name}
                      onChange={(e) => updateBookingData("name", e.target.value)}
                      placeholder="Your full name"
                      required
                      className="mt-1 text-sm md:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => updateBookingData("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="mt-1 text-sm md:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm">Email Address (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={bookingData.email}
                      onChange={(e) => updateBookingData("email", e.target.value)}
                      placeholder="your@email.com"
                      className="mt-1 text-sm md:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm">Additional Message</Label>
                    <Textarea
                      id="message"
                      value={bookingData.message}
                      onChange={(e) => updateBookingData("message", e.target.value)}
                      placeholder="Any other information you'd like to share..."
                      rows={3}
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>
              )}

            </CardContent>

            {/* Navigation Buttons - Sticky at bottom */}
            <div className="sticky bottom-0 bg-card border-t border-secondary/20 px-4 md:px-6 py-3 md:py-4 rounded-b-lg">
              <div className="flex justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="border-secondary/30 hover:bg-secondary/10 text-sm md:text-base px-3 md:px-4"
                  size="sm"
                >
                  <ChevronLeft className="mr-1 md:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>

                {step < 5 ? (
                  <Button 
                    variant="outline" 
                    onClick={handleNext} 
                    disabled={!canProceed()} 
                    className="border-secondary/30 hover:bg-secondary/10 text-sm md:text-base px-3 md:px-4"
                    size="sm"
                  >
                    Next
                    <ChevronRight className="ml-1 md:ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={handleSubmit} 
                    disabled={!canProceed() || isSubmitting} 
                    className="border-foreground/30 text-foreground hover:bg-foreground/5 text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4"
                    size="sm"
                  >
                    {isSubmitting ? "Submitting..." : <><span className="hidden sm:inline">Submit </span>Sacred Booking</>}
                  </Button>
                )}
              </div>
            </div>
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

      {/* Menu Preview Modal */}
      <MenuQuickViewModal
        menu={previewMenu?.menu || null}
        variant={previewMenu?.variant || "veg"}
        open={!!previewMenu}
        onOpenChange={(open) => !open && setPreviewMenu(null)}
      />
    </Layout>
  );
};

export default BookingPage;
