import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
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
import { toast } from "@/hooks/use-toast";
import { bungalows, getBungalowById, Bungalow } from "@/data/bungalows";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FloatingElements } from "@/components/animations/FloatingElements";
import { RangoliPattern } from "@/components/animations/RangoliPattern";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";
import { CTASection } from "@/components/home/CTASection";
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
  User,
  Baby,
  Phone,
  Mail,
  FileText,
  Upload,
} from "lucide-react";

interface BookingFormData {
  fullName: string;
  mobileNumber: string;
  email: string;
  address: string;
  idProofType: string;
  bungalowId: string;
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

const BungalowCard = ({ bungalow, onViewDetails, onBookNow }: { 
  bungalow: Bungalow; 
  onViewDetails: () => void;
  onBookNow: () => void;
}) => (
  <Card className="card-traditional overflow-hidden group">
    <div className="relative h-48 overflow-hidden">
      <img
        src={bungalow.images[0]}
        alt={bungalow.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute top-3 left-3 flex gap-2">
        <Badge className={cn(
          "font-medium",
          bungalow.type === "Suite" && "bg-gradient-to-r from-primary to-secondary text-primary-foreground",
          bungalow.type === "Deluxe" && "bg-secondary text-secondary-foreground",
          bungalow.type === "AC" && "bg-primary text-primary-foreground",
          bungalow.type === "Non-AC" && "bg-muted text-muted-foreground"
        )}>
          {bungalow.type}
        </Badge>
      </div>
      <div className="absolute top-3 right-3">
        <Badge variant={bungalow.available ? "default" : "destructive"} className="font-medium">
          {bungalow.available ? "Available" : "Booked"}
        </Badge>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-3 right-3">
        <h3 className="font-serif text-xl font-bold text-card">{bungalow.name}</h3>
        <div className="flex items-center gap-1 text-card/80 text-sm">
          <MapPin className="h-3 w-3" />
          {bungalow.location}
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
            {bungalow.maxOccupancy.children} Children
          </span>
        </div>
      </div>
      
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
      
      <div className="flex items-center justify-end pt-2 border-t border-border">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            View Details
          </Button>
          <Button 
            size="sm" 
            onClick={onBookNow}
            disabled={!bungalow.available}
            className="gold-shimmer"
          >
            Book Now
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const BungalowDetailModal = ({ bungalow, onBookNow }: { bungalow: Bungalow; onBookNow: () => void }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
              bungalow.type === "Suite" && "bg-gradient-to-r from-primary to-secondary",
              bungalow.type === "Deluxe" && "bg-secondary",
              bungalow.type === "AC" && "bg-primary",
              bungalow.type === "Non-AC" && "bg-muted"
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
        className="w-full gold-shimmer"
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
  const [selectedBungalow, setSelectedBungalow] = useState<Bungalow | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "",
    mobileNumber: "",
    email: "",
    address: "",
    idProofType: "",
    bungalowId: "",
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

  const handleViewDetails = (bungalow: Bungalow) => {
    setSelectedBungalow(bungalow);
  };

  const handleBookNow = (bungalow: Bungalow) => {
    setFormData(prev => ({ ...prev, bungalowId: bungalow.id }));
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

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    
    toast({
      title: "Booking Request Submitted!",
      description: "Our team will contact you shortly to confirm your reservation.",
    });
    
    setShowBookingForm(false);
    setFormData({
      fullName: "",
      mobileNumber: "",
      email: "",
      address: "",
      idProofType: "",
      bungalowId: "",
      checkInDate: undefined,
      checkOutDate: undefined,
      adults: "1",
      children: "0",
      purpose: "",
      specialRequests: "",
    });
  };

  const selectedBungalowForBooking = formData.bungalowId ? getBungalowById(formData.bungalowId) : undefined;

  return (
    <Layout>
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
            ✦ Guest Accommodation ✦
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6 animate-fade-in-up">
            Bungalow & <span className="text-gradient-gold">Guest House</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Our organization provides comfortable bungalow and guest house accommodation for 
            staff, guests, and visitors. The facility is available for short-term and long-term 
            stay with all modern amenities.
          </p>
          
          <div className="divider-ornate mt-8" />
        </div>
      </section>

      {/* Filter Section */}
      <section className="relative py-6 bg-card border-b border-secondary/20">
        <DecorativeBorder position="top" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm text-muted-foreground mr-2">Filter by Type:</span>
            {["all", "Suite", "Deluxe", "AC", "Non-AC"].map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(type)}
                className={cn(
                  filterType === type && "gold-shimmer"
                )}
              >
                {type === "all" ? "All Rooms" : type}
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
            {filteredBungalows.map((bungalow) => (
              <Dialog key={bungalow.id}>
                <BungalowCard
                  bungalow={bungalow}
                  onViewDetails={() => handleViewDetails(bungalow)}
                  onBookNow={() => handleBookNow(bungalow)}
                />
                <DialogTrigger asChild>
                  <span className="sr-only">View {bungalow.name}</span>
                </DialogTrigger>
              </Dialog>
            ))}
          </div>
          
          {filteredBungalows.length === 0 && (
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
                        {bungalow.name} ({bungalow.type})
                      </SelectItem>
                    ))}
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
                className="flex-1 gold-shimmer"
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


