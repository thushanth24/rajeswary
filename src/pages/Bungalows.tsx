import { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { getBungalowById, Bungalow } from "@/data/bungalows";
import { useBungalowRooms } from "@/hooks/useBungalowRooms";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { FloatingElements } from "@/components/animations/FloatingElements";
import { RangoliPattern } from "@/components/animations/RangoliPattern";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";
import { CTASection } from "@/components/home/CTASection";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CalendarIcon,
  Users,
  MapPin,
  Wifi,
  Car,
  Snowflake,
  Tv,
  UtensilsCrossed,
  ShowerHead,
  Shield,
  Zap,
  Home,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  IndianRupee,
  User,
  Baby,
  Phone,
  Mail,
  FileText,
  Upload,
  Info,
} from "lucide-react";

interface BookingFormData {
  fullName: string;
  mobileNumber: string;
  email: string;
  address: string;
  idProofType: string;
  idProofFile: File | null;
  bungalowId: string;
  packageType: string;
  acPreference: "AC" | "Non-AC";
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  adults: string;
  children: string;
  purpose: string;
  specialRequests: string;
}

const idProofTypes = [
  { value: "aadhar", label: "Aadhar Card" },
  { value: "pan", label: "PAN Card" },
  { value: "passport", label: "Passport" },
  { value: "voter", label: "Voter ID" },
  { value: "driving", label: "Driving License" },
];

const amenityIcons: Record<string, React.ReactNode> = {
  "Air Conditioner": <Snowflake className="h-4 w-4" />,
  "Fan": <Snowflake className="h-4 w-4" />,
  "Attached Bathroom": <ShowerHead className="h-4 w-4" />,
  "Hot Water": <ShowerHead className="h-4 w-4" />,
  "TV": <Tv className="h-4 w-4" />,
  "Wi-Fi": <Wifi className="h-4 w-4" />,
  "Kitchen Facility": <UtensilsCrossed className="h-4 w-4" />,
  "Refrigerator": <Home className="h-4 w-4" />,
  "Parking": <Car className="h-4 w-4" />,
  "Housekeeping": <Home className="h-4 w-4" />,
  "Power Backup": <Zap className="h-4 w-4" />,
  "Security": <Shield className="h-4 w-4" />,
  "Living Room": <Home className="h-4 w-4" />,
  "Dining Area": <UtensilsCrossed className="h-4 w-4" />,
  "Balcony": <Home className="h-4 w-4" />,
};

// Group bungalows by type+acType for display
interface RoomGroup {
  key: string;
  type: Bungalow['type'];
  acType: Bungalow['acType'];
  representative: Bungalow;
  totalCount: number;
  availableCount: number;
}

function groupBungalows(list: Bungalow[], bookedRoomNames?: Set<string>): RoomGroup[] {
  const map = new Map<string, RoomGroup>();
  for (const b of list) {
    const key = `${b.type}-${b.acType}`;
    const isBookedForDates = bookedRoomNames ? bookedRoomNames.has(b.id) : false;
    const effectivelyAvailable = b.available && !isBookedForDates;
    const existing = map.get(key);
    if (existing) {
      existing.totalCount++;
      if (effectivelyAvailable) existing.availableCount++;
    } else {
      map.set(key, {
        key,
        type: b.type,
        acType: b.acType,
        representative: b,
        totalCount: 1,
        availableCount: effectivelyAvailable ? 1 : 0,
      });
    }
  }
  return Array.from(map.values());
}

const RoomGroupCard = ({ group, onViewDetails, onBookNow }: { 
  group: RoomGroup; 
  onViewDetails: () => void;
  onBookNow: () => void;
}) => {
  const { representative: bungalow, totalCount, availableCount } = group;
  return (
    <Card className="card-traditional overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={bungalow.images[0]}
          alt={`${bungalow.type} ${bungalow.acType}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={cn(
            "font-medium",
            bungalow.type === "Family Room" && "bg-gradient-to-r from-primary to-secondary text-primary-foreground",
            bungalow.type === "Triple Room" && "bg-secondary text-secondary-foreground",
            bungalow.type === "Double Room" && "bg-primary text-primary-foreground",
          )}>
            {bungalow.type}
          </Badge>
          <Badge variant="outline" className="bg-background/80 text-foreground font-medium">
            {bungalow.acType}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant={availableCount > 0 ? "default" : "destructive"} className="font-medium">
            {availableCount > 0 ? `${availableCount} Available` : "Fully Booked"}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-serif text-xl font-bold text-card">{bungalow.type} — {bungalow.acType}</h3>
          <div className="flex items-center gap-2 text-card/80 text-sm">
            <Home className="h-3 w-3" />
            {totalCount} rooms total
          </div>
        </div>
      </div>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {bungalow.maxOccupancy.adults} Adults
            </span>
            <span className="flex items-center gap-1">
              <Baby className="h-4 w-4" />
              {bungalow.maxOccupancy.children} Child (under 6)
            </span>
          </div>
        </div>
        
        {group.acType === "AC" && (
          <div className="bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 border border-primary/30 rounded-lg px-3 py-2.5 text-center">
            <span className="text-sm font-semibold text-primary flex items-center justify-center gap-2">
              <Snowflake className="h-4 w-4" />
              Also available without AC at lower rates
              <Snowflake className="h-4 w-4" />
            </span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {bungalow.amenities.slice(0, 5).map((amenity) => (
            <span key={amenity} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {amenityIcons[amenity] || <Check className="h-3 w-3" />}
              {amenity}
            </span>
          ))}
          {bungalow.amenities.length > 5 && (
            <span className="text-xs text-primary font-medium px-2 py-1">
              +{bungalow.amenities.length - 5} more
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <span className="text-xs text-muted-foreground">From</span>
            <div className="flex items-center text-xl font-bold text-primary">
              Rs {bungalow.tariff.roomOnly.toLocaleString()}
              <span className="text-xs font-normal text-muted-foreground ml-1">/night</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              View Details
            </Button>
            <Button 
              size="sm" 
              onClick={onBookNow}
              disabled={availableCount === 0}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-traditional transition-all duration-300 hover:shadow-gold-glow"
            >
              🪷 Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BungalowDetailModal = ({ bungalow, onBookNow, allBungalows }: { bungalow: Bungalow; onBookNow: () => void; allBungalows: Bungalow[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Find matching Non-AC tariff for AC rooms
  const nonAcTariff = bungalow.acType === "AC"
    ? allBungalows.find(b => b.type === bungalow.type && b.acType === "Non-AC")?.tariff
    : null;

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Image Gallery */}
      <div className="relative rounded-lg overflow-hidden">
        <img
          src={bungalow.images[currentImageIndex]}
          alt={bungalow.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        
        {bungalow.images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? bungalow.images.length - 1 : prev - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev === bungalow.images.length - 1 ? 0 : prev + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
          {bungalow.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === currentImageIndex ? "bg-primary" : "bg-primary/40"
              )}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={cn(
              "font-medium",
              bungalow.type === "Family Room" && "bg-gradient-to-r from-primary to-secondary",
              bungalow.type === "Triple Room" && "bg-secondary",
              bungalow.type === "Double Room" && "bg-primary",
            )}>
              {bungalow.type}
            </Badge>
            <Badge variant={bungalow.available ? "default" : "destructive"}>
              {bungalow.available ? "Available" : "Booked"}
            </Badge>
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">{bungalow.name}</h2>
          <p className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
            <MapPin className="h-4 w-4" />
            {bungalow.location}
          </p>
        </div>
        <div className="text-right">
          <span className="text-sm text-muted-foreground">Room Only from</span>
          <div className="flex items-center text-2xl font-bold text-primary">
            Rs {bungalow.tariff.roomOnly.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground">{bungalow.description}</p>

      {/* Occupancy & Timing */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-3 rounded-lg border border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <User className="h-4 w-4" />
            Adults
          </div>
          <span className="font-semibold text-foreground">{bungalow.maxOccupancy.adults}</span>
        </div>
        <div className="bg-card p-3 rounded-lg border border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Baby className="h-4 w-4" />
            Children
          </div>
          <span className="font-semibold text-foreground">{bungalow.maxOccupancy.children}</span>
        </div>
        <div className="bg-card p-3 rounded-lg border border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Clock className="h-4 w-4" />
            Check-in
          </div>
          <span className="font-semibold text-foreground">{bungalow.checkInTime}</span>
        </div>
        <div className="bg-card p-3 rounded-lg border border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Clock className="h-4 w-4" />
            Check-out
          </div>
          <span className="font-semibold text-foreground">{bungalow.checkOutTime}</span>
        </div>
      </div>

      {/* Tariff Details */}
      <div className="bg-gradient-to-r from-secondary/10 to-primary/10 p-4 rounded-lg border border-secondary/30">
        <h3 className="font-serif font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="text-secondary">💰</span>
          Tariff Details {bungalow.acType === "AC" && <Badge variant="outline" className="text-xs ml-auto">AC Rate</Badge>}
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="text-sm text-muted-foreground block">Room Only</span>
            <span className="font-bold text-lg text-primary">
              Rs {bungalow.tariff.roomOnly.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground block">BB with Room</span>
            <span className="font-bold text-lg text-primary">
              Rs {bungalow.tariff.bbWithRoom.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground block">Full Board</span>
            <span className="font-bold text-lg text-primary">
              Rs {bungalow.tariff.fullBoard.toLocaleString()}
            </span>
          </div>
        </div>
        {bungalow.acType === "AC" && nonAcTariff && (
          <div className="mt-3 pt-3 border-t border-secondary/30">
            <p className="text-xs text-primary font-medium mb-2 flex items-center gap-1">
              <Info className="h-3 w-3" /> Book without AC at reduced rates:
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-muted-foreground block">Room Only</span>
                <span className="font-semibold text-sm text-foreground">
                  Rs {nonAcTariff.roomOnly.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">BB with Room</span>
                <span className="font-semibold text-sm text-foreground">
                  Rs {nonAcTariff.bbWithRoom.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Full Board</span>
                <span className="font-semibold text-sm text-foreground">
                  Rs {nonAcTariff.fullBoard.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Amenities */}
      <div>
        <h3 className="font-serif font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="text-secondary">✨</span>
          Features & Amenities
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {bungalow.amenities.map((amenity) => (
            <div key={amenity} className="flex items-center gap-2 text-sm bg-card p-2 rounded-lg border border-border">
              <span className="text-primary">{amenityIcons[amenity] || <Check className="h-4 w-4" />}</span>
              {amenity}
            </div>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div>
        <h3 className="font-serif font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="text-secondary">📋</span>
          Rules & Policies
        </h3>
        <ul className="space-y-2">
          {bungalow.rules.map((rule, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-secondary mt-0.5">•</span>
              {rule}
            </li>
          ))}
        </ul>
      </div>

      {/* Book Button */}
      <Button 
        onClick={onBookNow} 
        disabled={!bungalow.available}
        className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-traditional transition-all duration-300 hover:shadow-gold-glow"
        size="lg"
      >
        {bungalow.available ? (
          <>
            <span className="mr-2">🪷</span>
            Book This Bungalow
          </>
        ) : (
          <>
            <X className="mr-2 h-4 w-4" />
            Currently Not Available
          </>
        )}
      </Button>
    </div>
  );
};

const BungalowsPage = () => {
  const { t } = useLanguage();
  const { bungalowsList: bungalows } = useBungalowRooms();
  const [selectedBungalow, setSelectedBungalow] = useState<Bungalow | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCheckIn, setFilterCheckIn] = useState<Date | undefined>(undefined);
  const [filterCheckOut, setFilterCheckOut] = useState<Date | undefined>(undefined);
  const [bookedRoomNames, setBookedRoomNames] = useState<Set<string>>(new Set());
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  // Fetch confirmed bookings that overlap the selected date range
  useEffect(() => {
    if (!filterCheckIn || !filterCheckOut) {
      setBookedRoomNames(new Set());
      return;
    }

    const fetchBookedRooms = async () => {
      setAvailabilityLoading(true);
      try {
        const checkIn = format(filterCheckIn, 'yyyy-MM-dd');
        const checkOut = format(filterCheckOut, 'yyyy-MM-dd');

        const { data, error } = await (supabase as any)
          .from('bungalow_bookings')
          .select('room_type')
          .eq('status', 'confirmed')
          .lt('check_in_date', checkOut)
          .gt('check_out_date', checkIn);

        if (error) throw error;

        const names = new Set<string>((data || []).map((b: any) => b.room_type));
        setBookedRoomNames(names);
      } catch (err) {
        console.error('Failed to check availability:', err);
        setBookedRoomNames(new Set());
      } finally {
        setAvailabilityLoading(false);
      }
    };

    fetchBookedRooms();
  }, [filterCheckIn, filterCheckOut]);

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "",
    mobileNumber: "",
    email: "",
    address: "",
    idProofType: "",
    idProofFile: null,
    bungalowId: "",
    packageType: "roomOnly",
    acPreference: "AC",
    checkInDate: undefined,
    checkOutDate: undefined,
    adults: "1",
    children: "0",
    purpose: "",
    specialRequests: "",
  });

  const filteredBungalows = filterType === "all" 
    ? bungalows 
    : bungalows.filter(b => b.type === filterType);

  const roomGroups = groupBungalows(filteredBungalows, filterCheckIn && filterCheckOut ? bookedRoomNames : undefined);

  const handleViewDetails = (bungalow: Bungalow) => {
    setSelectedBungalow(bungalow);
  };

  const handleBookNow = (bungalow: Bungalow) => {
    setFormData(prev => ({ ...prev, bungalowId: bungalow.id, acPreference: "AC" }));
    setSelectedBungalow(null);
    setShowBookingForm(true);
  };

  const updateFormData = (field: keyof BookingFormData, value: string | Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.mobileNumber || !formData.bungalowId || !formData.checkInDate || !formData.checkOutDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (numberOfNights <= 0) {
      toast({
        title: "Invalid Dates",
        description: "Check-out date must be after check-in date.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload ID proof if provided
      let idProofUrl: string | null = null;
      if (formData.idProofFile) {
        const fileExt = formData.idProofFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('id-proofs')
          .upload(fileName, formData.idProofFile);
        if (uploadError) throw new Error(`ID proof upload failed: ${uploadError.message}`);
        idProofUrl = uploadData.path;
      }

      const selectedRoom = getBungalowById(formData.bungalowId);
      const { error } = await (supabase as any)
        .from('bungalow_bookings')
        .insert({
          full_name: formData.fullName.trim(),
          mobile_number: formData.mobileNumber.trim(),
          email: formData.email.trim() || null,
          address: formData.address.trim() || null,
          id_proof_type: formData.idProofType || null,
          id_proof_url: idProofUrl,
          room_type: selectedRoom?.name || formData.bungalowId,
          ac_type: selectedRoom?.acType === 'AC' ? formData.acPreference : (selectedRoom?.acType || 'Non-AC'),
          package_type: formData.packageType,
          check_in_date: format(formData.checkInDate!, 'yyyy-MM-dd'),
          check_out_date: format(formData.checkOutDate!, 'yyyy-MM-dd'),
          adults: parseInt(formData.adults) || 1,
          children: parseInt(formData.children) || 0,
          purpose: formData.purpose.trim() || null,
          special_requests: formData.specialRequests.trim() || null,
          total_amount: totalPrice > 0 ? totalPrice : null,
          status: 'confirmed',
        });

      if (error) throw error;

      toast({
        title: "Booking Confirmed!",
        description: "Your booking has been confirmed! We look forward to welcoming you.",
      });

      setShowBookingForm(false);
      setFormData({
        fullName: "",
        mobileNumber: "",
        email: "",
        address: "",
        idProofType: "",
        idProofFile: null,
        bungalowId: "",
        packageType: "roomOnly",
        acPreference: "AC",
        checkInDate: undefined,
        checkOutDate: undefined,
        adults: "1",
        children: "0",
        purpose: "",
        specialRequests: "",
      });
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedBungalowForBooking = formData.bungalowId ? bungalows.find(b => b.id === formData.bungalowId) || getBungalowById(formData.bungalowId) : undefined;

  // Price calculation
  const numberOfNights = formData.checkInDate && formData.checkOutDate
    ? differenceInDays(formData.checkOutDate, formData.checkInDate)
    : 0;

  // Find matching Non-AC tariff when user picks "Without AC" on an AC room
  const getEffectiveTariff = () => {
    if (!selectedBungalowForBooking) return null;
    if (selectedBungalowForBooking.acType === "AC" && formData.acPreference === "Non-AC") {
      const nonAcMatch = bungalows.find(b => b.type === selectedBungalowForBooking.type && b.acType === "Non-AC");
      return nonAcMatch?.tariff || selectedBungalowForBooking.tariff;
    }
    return selectedBungalowForBooking.tariff;
  };

  const effectiveTariff = getEffectiveTariff();

  const getPerNightRate = (): number => {
    if (!effectiveTariff) return 0;
    switch (formData.packageType) {
      case "bbWithRoom": return effectiveTariff.bbWithRoom;
      case "fullBoard": return effectiveTariff.fullBoard;
      default: return effectiveTariff.roomOnly;
    }
  };

  const perNightRate = getPerNightRate();
  const totalPrice = perNightRate * (numberOfNights > 0 ? numberOfNights : 0);

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
            <span className="text-secondary text-2xl">🏠</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-secondary" />
          </div>
          
          <span className="text-secondary font-medium tracking-wider uppercase text-sm animate-fade-in">
            ✦ {t("bungalows.subtitle")} ✦
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6 animate-fade-in-up">
            {t("bungalows.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {t("bungalows.description")}
          </p>
          
          <div className="divider-ornate mt-8" />
        </div>
      </section>

      {/* Room Availability Overview */}
      <section className="relative py-8 bg-card border-b border-secondary/20">
        <DecorativeBorder position="top" />
        <div className="container mx-auto px-4 lg:px-8">
          {/* Room counts summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {(() => {
              const doubleAC = bungalows.filter(b => b.type === "Double Room" && b.acType === "AC").length;
              const doubleNonAC = bungalows.filter(b => b.type === "Double Room" && b.acType === "Non-AC").length;
              const tripleAC = bungalows.filter(b => b.type === "Triple Room" && b.acType === "AC").length;
              const tripleNonAC = bungalows.filter(b => b.type === "Triple Room" && b.acType === "Non-AC").length;
              const familyAC = bungalows.filter(b => b.type === "Family Room" && b.acType === "AC").length;
              const familyNonAC = bungalows.filter(b => b.type === "Family Room" && b.acType === "Non-AC").length;
              return [
                { label: "Double Rooms", total: doubleAC + doubleNonAC, ac: doubleAC, nonAc: doubleNonAC, icon: "🛏️", adults: 2 },
                { label: "Triple Rooms", total: tripleAC + tripleNonAC, ac: tripleAC, nonAc: tripleNonAC, icon: "🛏️", adults: 3 },
                { label: "Family Rooms", total: familyAC + familyNonAC, ac: familyAC, nonAc: familyNonAC, icon: "🏠", adults: 4 },
              ].map((cat) => (
                <div key={cat.label} className="bg-gradient-to-r from-secondary/10 to-primary/10 p-4 rounded-lg border border-secondary/30 text-center">
                  <span className="text-2xl">{cat.icon}</span>
                  <h3 className="font-serif font-semibold text-foreground mt-1">{cat.label}</h3>
                  <p className="text-2xl font-bold text-primary">{cat.total} <span className="text-sm font-normal text-muted-foreground">rooms</span></p>
                  <div className="flex justify-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Snowflake className="h-3 w-3" /> {cat.ac} AC</span>
                    <span>|</span>
                    <span>{cat.nonAc} Non-AC</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Max {cat.adults} adults per room</p>
                </div>
              ));
            })()}
          </div>

          {/* AC flexibility info banner */}
          <div className="mb-6 bg-gradient-to-r from-secondary/15 via-primary/10 to-secondary/15 border border-secondary/30 rounded-xl px-6 py-4 text-center">
            <p className="text-base font-semibold text-foreground flex items-center justify-center gap-3">
              <Snowflake className="h-5 w-5 text-primary" />
              AC rooms can also be booked without AC at Non-AC rates
              <Snowflake className="h-5 w-5 text-primary" />
            </p>
            <p className="text-sm text-muted-foreground mt-1">Choose your preference during booking</p>
          </div>

          {/* Child policy & rules */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 text-sm">
            <Badge variant="outline" className="border-secondary/50 text-foreground px-3 py-1">
              <Baby className="h-3 w-3 mr-1" /> 1 child under 6 years allowed per room
            </Badge>
            <Badge variant="outline" className="border-secondary/50 text-foreground px-3 py-1">
              <Shield className="h-3 w-3 mr-1" /> ID proof mandatory
            </Badge>
            <Badge variant="outline" className="border-secondary/50 text-foreground px-3 py-1">
              <X className="h-3 w-3 mr-1" /> No pets · No smoking
            </Badge>
          </div>

          {/* Date Range Availability Filter */}
          <div className="mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 border border-secondary/30 rounded-xl p-5">
            <h3 className="font-serif font-semibold text-foreground text-center mb-4 flex items-center justify-center gap-2">
              <CalendarIcon className="h-5 w-5 text-secondary" />
              Check Room Availability
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="w-full sm:w-auto">
                <Label className="text-xs text-muted-foreground mb-1 block text-center">Check-in Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full sm:w-[200px] justify-start text-left font-normal",
                        !filterCheckIn && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filterCheckIn ? format(filterCheckIn, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={filterCheckIn}
                      onSelect={(date) => {
                        setFilterCheckIn(date);
                        if (filterCheckOut && date && date >= filterCheckOut) {
                          setFilterCheckOut(undefined);
                        }
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <span className="hidden sm:block text-muted-foreground font-medium">→</span>
              <div className="w-full sm:w-auto">
                <Label className="text-xs text-muted-foreground mb-1 block text-center">Check-out Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full sm:w-[200px] justify-start text-left font-normal",
                        !filterCheckOut && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filterCheckOut ? format(filterCheckOut, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={filterCheckOut}
                      onSelect={setFilterCheckOut}
                      disabled={(date) => date <= (filterCheckIn || new Date())}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {(filterCheckIn || filterCheckOut) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setFilterCheckIn(undefined); setFilterCheckOut(undefined); }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" /> Clear
                </Button>
              )}
            </div>
            {filterCheckIn && filterCheckOut && (
              <p className="text-center text-sm mt-3 text-muted-foreground">
                {availabilityLoading ? (
                  <span className="animate-pulse">Checking availability...</span>
                ) : (
                  <>Showing availability for <span className="font-medium text-foreground">{format(filterCheckIn, "dd MMM yyyy")}</span> — <span className="font-medium text-foreground">{format(filterCheckOut, "dd MMM yyyy")}</span></>
                )}
              </p>
            )}
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm text-muted-foreground mr-2">{t("common.filter")}:</span>
            {["all", "Double Room", "Triple Room", "Family Room"].map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(type)}
                className={cn(
                  filterType === type
                    ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-traditional hover:shadow-gold-glow"
                    : "border-primary/30 text-foreground hover:bg-primary/10"
                )}
              >
                {type === "all" ? t("common.all") : type}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Bungalow Listing */}
      <section className="relative py-16 bg-background overflow-hidden">
        <div className="absolute inset-0 paisley-bg opacity-20" />
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomGroups.map((group) => (
              <RoomGroupCard
                key={group.key}
                group={group}
                onViewDetails={() => handleViewDetails(group.representative)}
                onBookNow={() => handleBookNow(group.representative)}
              />
            ))}
          </div>
          
          {roomGroups.length === 0 && (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">🏠</span>
              <p className="text-muted-foreground">No rooms found for the selected filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* View Details Modal */}
      <Dialog open={!!selectedBungalow} onOpenChange={(open) => !open && setSelectedBungalow(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="sr-only">Bungalow Details</DialogTitle>
          </DialogHeader>
          {selectedBungalow && (
            <BungalowDetailModal 
              bungalow={selectedBungalow} 
              onBookNow={() => handleBookNow(selectedBungalow)}
              allBungalows={bungalows}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Form Modal */}
      <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-secondary text-xl">🪔</span>
              <DialogTitle className="font-serif text-2xl text-gradient-gold">Room Reservation</DialogTitle>
            </div>
            {selectedBungalowForBooking && (
              <p className="text-muted-foreground text-sm">
                Booking: <span className="font-medium text-foreground">{selectedBungalowForBooking.name}</span> ({selectedBungalowForBooking.type})
              </p>
            )}
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="font-serif font-semibold text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-secondary" />
                Personal Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="mobileNumber">Mobile Number *</Label>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => updateFormData("mobileNumber", e.target.value)}
                    placeholder="+91 98765 43210"
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="your@email.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="idProofType">ID Proof Type *</Label>
                  <Select
                    value={formData.idProofType}
                    onValueChange={(value) => updateFormData("idProofType", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select ID proof" />
                    </SelectTrigger>
                    <SelectContent>
                      {idProofTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ID Proof Upload */}
              <div>
                <Label htmlFor="idProofFile">Upload ID Proof Document</Label>
                <div className="mt-1 flex items-center gap-3">
                  <label
                    htmlFor="idProofFile"
                    className="flex items-center gap-2 px-4 py-2 border border-dashed border-primary/40 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors text-sm text-muted-foreground"
                  >
                    <Upload className="h-4 w-4 text-primary" />
                    {formData.idProofFile ? formData.idProofFile.name : "Choose file (PDF, JPG, PNG)"}
                  </label>
                  <input
                    id="idProofFile"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file && file.size > 5 * 1024 * 1024) {
                        toast({ title: "File too large", description: "Maximum file size is 5MB.", variant: "destructive" });
                        return;
                      }
                      setFormData(prev => ({ ...prev, idProofFile: file }));
                    }}
                  />
                  {formData.idProofFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, idProofFile: null }))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Max 5MB · PDF, JPG, PNG accepted</p>
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  placeholder="Enter your full address"
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>

            {/* Stay Details */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="font-serif font-semibold text-foreground flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-secondary" />
                Stay Details
              </h3>
              
              <div>
                <Label>Select Bungalow/Room *</Label>
                <Select
                  value={formData.bungalowId}
                  onValueChange={(value) => updateFormData("bungalowId", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {bungalows.filter(b => b.available).map((bungalow) => (
                      <SelectItem key={bungalow.id} value={bungalow.id}>
                        {bungalow.name} - Rs {bungalow.tariff.roomOnly.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* AC Preference - only for AC rooms */}
              {selectedBungalowForBooking?.acType === "AC" && (
                <div className="flex items-start space-x-3 p-3 rounded-lg border bg-muted/30">
                  <Checkbox
                    id="useAc"
                    checked={formData.acPreference === "AC"}
                    onCheckedChange={(checked) =>
                      updateFormData("acPreference", checked ? "AC" : "Non-AC")
                    }
                  />
                  <div className="grid gap-1 leading-none">
                    <Label htmlFor="useAc" className="cursor-pointer font-medium">
                      Use Air Conditioning
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Untick to get Non-AC rate
                    </p>
                    {formData.acPreference === "Non-AC" && (
                      <p className="text-xs text-primary flex items-center gap-1">
                        <Info className="h-3 w-3" /> Non-AC tariff will be applied
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Package Type Selection */}
              <div>
                <Label>Package Type *</Label>
                <Select
                  value={formData.packageType}
                  onValueChange={(value) => updateFormData("packageType", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select package" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roomOnly">
                      Room Only {effectiveTariff ? `- Rs ${effectiveTariff.roomOnly.toLocaleString()}/night` : ""}
                    </SelectItem>
                    <SelectItem value="bbWithRoom">
                      Bed & Breakfast {effectiveTariff ? `- Rs ${effectiveTariff.bbWithRoom.toLocaleString()}/night` : ""}
                    </SelectItem>
                    <SelectItem value="fullBoard">
                      Full Board {effectiveTariff ? `- Rs ${effectiveTariff.fullBoard.toLocaleString()}/night` : ""}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Check-in Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !formData.checkInDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.checkInDate ? format(formData.checkInDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.checkInDate}
                        onSelect={(date) => updateFormData("checkInDate", date)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Check-out Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !formData.checkOutDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.checkOutDate ? format(formData.checkOutDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.checkOutDate}
                        onSelect={(date) => updateFormData("checkOutDate", date)}
                        disabled={(date) => date < (formData.checkInDate || new Date())}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adults">Number of Adults *</Label>
                  <Input
                    id="adults"
                    type="number"
                    min="1"
                    max={selectedBungalowForBooking?.maxOccupancy.adults || 10}
                    value={formData.adults}
                    onChange={(e) => updateFormData("adults", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="children">Number of Children</Label>
                  <Input
                    id="children"
                    type="number"
                    min="0"
                    max={selectedBungalowForBooking?.maxOccupancy.children || 5}
                    value={formData.children}
                    onChange={(e) => updateFormData("children", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="purpose">Purpose of Stay</Label>
                <Input
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => updateFormData("purpose", e.target.value)}
                  placeholder="e.g., Attending wedding ceremony"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => updateFormData("specialRequests", e.target.value)}
                  placeholder="Any special requirements or requests..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            {/* Price Summary */}
            {selectedBungalowForBooking && (
              <div className="bg-gradient-to-r from-secondary/10 to-primary/10 p-4 rounded-lg border border-secondary/30 space-y-3">
                <h3 className="font-serif font-semibold text-foreground flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-secondary" />
                  Price Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Package</span>
                    <span className="font-medium text-foreground">
                      {formData.packageType === "roomOnly" ? "Room Only" : formData.packageType === "bbWithRoom" ? "Bed & Breakfast" : "Full Board"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rate per night</span>
                    <span className="font-medium text-foreground">Rs {perNightRate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Number of nights</span>
                    <span className="font-medium text-foreground">{numberOfNights > 0 ? numberOfNights : "—"}</span>
                  </div>
                  <div className="border-t border-secondary/30 pt-2 flex justify-between">
                    <span className="font-semibold text-foreground">Total Amount</span>
                    <span className="font-bold text-xl text-primary">
                      {totalPrice > 0 ? `Rs ${totalPrice.toLocaleString()}` : "Select dates"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowBookingForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-traditional transition-all duration-300 hover:shadow-gold-glow"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🪷</span>
                    Submit Reservation
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <CTASection 
        title="Need"
        highlight="Assistance"
        description="Our team is available to help you find the perfect accommodation for your stay. Contact us for special requirements or group bookings."
        primaryButtonText="Contact Us"
        primaryButtonLink="/contact"
      />
    </Layout>
  );
};

export default BungalowsPage;
