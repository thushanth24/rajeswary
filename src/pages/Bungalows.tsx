import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Bungalow } from "@/data/bungalows";
import { useBungalowRooms } from "@/hooks/useBungalowRooms";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { FloatingElements } from "@/components/animations/FloatingElements";
import { RangoliPattern } from "@/components/animations/RangoliPattern";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";
import { CTASection } from "@/components/home/CTASection";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  CalendarIcon,
  Users,
  Snowflake,
  Car,
  Tv,
  UtensilsCrossed,
  ShowerHead,
  Shield,
  Zap,
  Home,
  Check,
  X,
  Baby,
  Upload,
  Info,
  Wifi,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type RoomType = "Double Room" | "Triple Room" | "Family Room";
type AcPref = "AC" | "Non-AC";
type PkgType = "roomOnly" | "bbWithRoom" | "fullBoard";

interface FormState {
  roomType: RoomType;
  acPreference: AcPref;
  packageType: PkgType;
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  adults: string;
  children: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  address: string;
  idProofType: string;
  idProofFile: File | null;
  purpose: string;
  specialRequests: string;
}

const DEFAULT_FORM: FormState = {
  roomType: "Double Room",
  acPreference: "AC",
  packageType: "roomOnly",
  checkInDate: undefined,
  checkOutDate: undefined,
  adults: "1",
  children: "0",
  fullName: "",
  mobileNumber: "",
  email: "",
  address: "",
  idProofType: "",
  idProofFile: null,
  purpose: "",
  specialRequests: "",
};

const ROOM_TYPES: RoomType[] = ["Double Room", "Triple Room", "Family Room"];

const ID_PROOF_TYPES = [
  { value: "nic", label: "National Identity Card (NIC)" },
  { value: "passport", label: "Passport" },
  { value: "driving_licence", label: "Driving Licence" },
  { value: "business_registration", label: "Business Registration" },
];

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Air Conditioner": <Snowflake className="h-3 w-3" />,
  "Fan": <Snowflake className="h-3 w-3" />,
  "Attached Bathroom": <ShowerHead className="h-3 w-3" />,
  "Hot Water": <ShowerHead className="h-3 w-3" />,
  "TV": <Tv className="h-3 w-3" />,
  "Wi-Fi": <Wifi className="h-3 w-3" />,
  "Kitchen Facility": <UtensilsCrossed className="h-3 w-3" />,
  "Parking": <Car className="h-3 w-3" />,
  "Housekeeping": <Home className="h-3 w-3" />,
  "Power Backup": <Zap className="h-3 w-3" />,
  "Security": <Shield className="h-3 w-3" />,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTariff(bungalows: Bungalow[], type: string, acPref: AcPref) {
  return bungalows.find(b => b.type === type && b.acType === acPref)?.tariff ?? null;
}

async function getFunctionErrorMessage(error: unknown) {
  const fallback = error instanceof Error ? error.message : "Failed to initiate payment";
  const response = (error as { context?: unknown })?.context;

  if (response instanceof Response) {
    try {
      const body = await response.clone().json();
      if (typeof body?.error === "string") return body.error;
      if (typeof body?.message === "string") return body.message;
    } catch {
      try {
        const text = await response.clone().text();
        if (text) return text;
      } catch {
        return fallback;
      }
    }
  }

  return fallback;
}

/** Find an available physical room to assign.
 *  - AC pref → only AC rooms
 *  - Non-AC pref → prefer Non-AC, fall back to AC (business rule: AC can serve as Non-AC) */
async function findAvailableRoom(
  bungalows: Bungalow[],
  type: string,
  acPref: AcPref,
  checkIn: string,
  checkOut: string
): Promise<Bungalow | null> {
  const { data } = await (supabase as any)
    .from("bungalow_bookings")
    .select("room_type")
    .in("status", ["confirmed", "pending", "pending_payment"])
    .lt("check_in_date", checkOut)
    .gt("check_out_date", checkIn);

  const bookedNames = new Set<string>((data ?? []).map((b: any) => b.room_type as string));
  const pool = bungalows.filter(b => b.type === type && b.available && !bookedNames.has(b.name));

  if (acPref === "AC") {
    return pool.find(b => b.acType === "AC") ?? null;
  }
  // Non-AC pref: prefer actual Non-AC, then fall back to AC
  return pool.find(b => b.acType === "Non-AC") ?? pool.find(b => b.acType === "AC") ?? null;
}

// ─── Room Type Card ───────────────────────────────────────────────────────────

interface TypeGroup {
  type: RoomType;
  acCount: number;
  nonAcCount: number;
  acTariff: Bungalow["tariff"] | null;
  nonAcTariff: Bungalow["tariff"] | null;
  maxOccupancy: { adults: number; children: number };
  image: string;
  amenities: string[];
  // set only when listing filter dates are active
  availableAc: number | null;
  availableNonAc: number | null;
}

function buildTypeGroups(bungalows: Bungalow[], bookedNames: Set<string> | null): TypeGroup[] {
  return ROOM_TYPES.map(type => {
    const acRooms = bungalows.filter(b => b.type === type && b.acType === "AC");
    const nonAcRooms = bungalows.filter(b => b.type === type && b.acType === "Non-AC");
    const rep = acRooms[0] ?? nonAcRooms[0];
    return {
      type,
      acCount: acRooms.length,
      nonAcCount: nonAcRooms.length,
      acTariff: acRooms[0]?.tariff ?? null,
      nonAcTariff: nonAcRooms[0]?.tariff ?? null,
      maxOccupancy: rep?.maxOccupancy ?? { adults: 2, children: 1 },
      image: rep?.images[0] ?? "",
      amenities: rep?.amenities ?? [],
      availableAc: bookedNames
        ? acRooms.filter(b => b.available && !bookedNames.has(b.name)).length
        : null,
      availableNonAc: bookedNames
        ? nonAcRooms.filter(b => b.available && !bookedNames.has(b.name)).length
        : null,
    };
  });
}

const RoomTypeCard = ({
  group,
  datesActive,
  onBook,
}: {
  group: TypeGroup;
  datesActive: boolean;
  onBook: (type: RoomType) => void;
}) => {
  // When Non-AC is requested, AC rooms can serve as Non-AC too
  const totalAvailableForNonAc =
    group.availableNonAc !== null && group.availableAc !== null
      ? group.availableNonAc + group.availableAc
      : null;
  const totalAvailable =
    group.availableAc !== null ? group.availableAc + (group.availableNonAc ?? 0) : null;
  const fullyBooked = datesActive && totalAvailable === 0;

  const typeShort = group.type.replace(" Room", "");

  return (
    <Card className="card-traditional overflow-hidden group">
      <div className="relative h-52 overflow-hidden">
        <img
          src={group.image}
          alt={group.type}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

        <div className="absolute top-3 left-3">
          <Badge className="bg-primary text-primary-foreground font-semibold px-3">
            {typeShort}
          </Badge>
        </div>

        {datesActive && totalAvailable !== null && (
          <div className="absolute top-3 right-3">
            <Badge
              variant={fullyBooked ? "destructive" : "default"}
              className="font-medium"
            >
              {fullyBooked ? "Fully Booked" : `${totalAvailable} Available`}
            </Badge>
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-serif text-xl font-bold text-card">{group.type}</h3>
          <div className="flex items-center gap-1.5 text-card/80 text-sm mt-0.5">
            <Users className="h-3.5 w-3.5" />
            <span>Up to {group.maxOccupancy.adults} adults</span>
            <span>·</span>
            <Baby className="h-3.5 w-3.5" />
            <span>1 child</span>
          </div>
        </div>
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Room inventory */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Home className="h-4 w-4 shrink-0" />
          <span>{group.acCount + group.nonAcCount} rooms</span>
          {group.acCount > 0 && group.nonAcCount > 0 && (
            <span className="text-xs">
              ({group.acCount} AC · {group.nonAcCount} Non-AC)
            </span>
          )}
        </div>

        {/* Pricing */}
        <div className="space-y-1.5">
          {group.acTariff && (
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Snowflake className="h-3.5 w-3.5 text-primary" /> With AC
                {datesActive && group.availableAc !== null && (
                  <span className={cn(
                    "text-xs ml-1 font-medium",
                    group.availableAc > 0 ? "text-green-600" : "text-destructive"
                  )}>
                    ({group.availableAc > 0 ? `${group.availableAc} avail.` : "none"})
                  </span>
                )}
              </span>
              <span className="font-bold text-primary">
                Rs {group.acTariff.roomOnly.toLocaleString()}
                <span className="text-xs font-normal text-muted-foreground">/night</span>
              </span>
            </div>
          )}
          {group.nonAcTariff && (
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                Without AC
                {datesActive && totalAvailableForNonAc !== null && (
                  <span className={cn(
                    "text-xs ml-1 font-medium",
                    totalAvailableForNonAc > 0 ? "text-green-600" : "text-destructive"
                  )}>
                    ({totalAvailableForNonAc > 0 ? `${totalAvailableForNonAc} avail.` : "none"})
                  </span>
                )}
              </span>
              <span className="font-semibold text-foreground">
                Rs {group.nonAcTariff.roomOnly.toLocaleString()}
                <span className="text-xs font-normal text-muted-foreground">/night</span>
              </span>
            </div>
          )}
        </div>

        {/* Top amenities */}
        <div className="flex flex-wrap gap-1.5">
          {group.amenities.slice(0, 5).map(a => (
            <span key={a} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {AMENITY_ICONS[a] ?? <Check className="h-3 w-3" />}
              {a}
            </span>
          ))}
        </div>

        <Button
          className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-traditional hover:shadow-gold-glow transition-all duration-300"
          onClick={() => onBook(group.type)}
          disabled={fullyBooked}
        >
          {fullyBooked ? "Fully Booked for Selected Dates" : "🪷 Book Now"}
        </Button>
      </CardContent>
    </Card>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const BungalowsPage = () => {
  const { t } = useLanguage();
  const { bungalowsList } = useBungalowRooms();
  const [searchParams] = useSearchParams();

  // Listing-page date filter
  const [filterCheckIn, setFilterCheckIn] = useState<Date | undefined>();
  const [filterCheckOut, setFilterCheckOut] = useState<Date | undefined>();
  const [listingBookedNames, setListingBookedNames] = useState<Set<string>>(new Set());
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  // Booking dialog
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState<FormState>({ ...DEFAULT_FORM });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Live availability inside the dialog (checked when dates + roomType change)
  const [dialogAvail, setDialogAvail] = useState<{ ac: number; nonAc: number } | null>(null);

  // ── PayHere redirect toast ───────────────────────────────────────────────

  useEffect(() => {
    const payment = searchParams.get("payment");
    if (payment === "success") {
      toast({
        title: "Payment Successful!",
        description: "Your room booking is confirmed. We look forward to welcoming you.",
      });
    } else if (payment === "cancelled") {
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled. The room hold has been released.",
        variant: "destructive",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Listing page availability fetch ────────────────────────────────────────

  useEffect(() => {
    if (!filterCheckIn || !filterCheckOut) {
      setListingBookedNames(new Set());
      return;
    }
    const checkIn = format(filterCheckIn, "yyyy-MM-dd");
    const checkOut = format(filterCheckOut, "yyyy-MM-dd");
    setAvailabilityLoading(true);
    (supabase as any)
      .from("bungalow_bookings")
      .select("room_type")
      .in("status", ["confirmed", "pending", "pending_payment"])
      .lt("check_in_date", checkOut)
      .gt("check_out_date", checkIn)
      .then(({ data, error }: any) => {
        if (!error) {
          setListingBookedNames(new Set((data ?? []).map((b: any) => b.room_type as string)));
        }
        setAvailabilityLoading(false);
      });
  }, [filterCheckIn, filterCheckOut]);

  // ── Dialog availability fetch ───────────────────────────────────────────────

  useEffect(() => {
    if (!form.checkInDate || !form.checkOutDate) {
      setDialogAvail(null);
      return;
    }
    const checkIn = format(form.checkInDate, "yyyy-MM-dd");
    const checkOut = format(form.checkOutDate, "yyyy-MM-dd");
    (supabase as any)
      .from("bungalow_bookings")
      .select("room_type")
      .in("status", ["confirmed", "pending", "pending_payment"])
      .lt("check_in_date", checkOut)
      .gt("check_out_date", checkIn)
      .then(({ data, error }: any) => {
        if (error) return;
        const booked = new Set<string>((data ?? []).map((b: any) => b.room_type as string));
        const pool = bungalowsList.filter(b => b.type === form.roomType && b.available);
        setDialogAvail({
          ac: pool.filter(b => b.acType === "AC" && !booked.has(b.name)).length,
          nonAc: pool.filter(b => b.acType === "Non-AC" && !booked.has(b.name)).length,
        });
      });
  }, [form.checkInDate, form.checkOutDate, form.roomType, bungalowsList]);

  // ── Computed values ─────────────────────────────────────────────────────────

  const datesActive = !!(filterCheckIn && filterCheckOut);
  const typeGroups = useMemo(
    () => buildTypeGroups(bungalowsList, datesActive ? listingBookedNames : null),
    [bungalowsList, listingBookedNames, datesActive]
  );

  const effectiveTariff = useMemo(
    () => getTariff(bungalowsList, form.roomType, form.acPreference),
    [bungalowsList, form.roomType, form.acPreference]
  );

  const nights =
    form.checkInDate && form.checkOutDate
      ? differenceInDays(form.checkOutDate, form.checkInDate)
      : 0;

  const perNight = effectiveTariff
    ? form.packageType === "bbWithRoom"
      ? effectiveTariff.bbWithRoom
      : form.packageType === "fullBoard"
      ? effectiveTariff.fullBoard
      : effectiveTariff.roomOnly
    : 0;

  const totalPrice = perNight * Math.max(nights, 0);
  const paymentAmount = totalPrice;

  const currentTypeGroup = typeGroups.find(g => g.type === form.roomType);

  // Non-AC pref can use AC rooms as fallback
  const dialogAvailForNonAc =
    dialogAvail ? dialogAvail.nonAc + dialogAvail.ac : null;
  const dialogAvailForAc = dialogAvail?.ac ?? null;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleOpenBooking = (type: RoomType) => {
    setForm({ ...DEFAULT_FORM, roomType: type });
    setDialogAvail(null);
    setShowDialog(true);
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName.trim() || !form.mobileNumber.trim()) {
      toast({ title: "Missing fields", description: "Full name and mobile number are required.", variant: "destructive" });
      return;
    }
    if (!form.checkInDate || !form.checkOutDate) {
      toast({ title: "Missing dates", description: "Please select check-in and check-out dates.", variant: "destructive" });
      return;
    }
    if (nights <= 0) {
      toast({ title: "Invalid dates", description: "Check-out must be after check-in.", variant: "destructive" });
      return;
    }
    if (totalPrice <= 0) {
      toast({ title: "Invalid amount", description: "Please select a valid package and dates.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const checkIn = format(form.checkInDate, "yyyy-MM-dd");
      const checkOut = format(form.checkOutDate, "yyyy-MM-dd");

      // 1. Find an available physical room
      const assignedRoom = await findAvailableRoom(
        bungalowsList, form.roomType, form.acPreference, checkIn, checkOut
      );
      if (!assignedRoom) {
        toast({
          title: "No rooms available",
          description: "All rooms of this type are booked for the selected dates. Please choose different dates.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // 2. Upload ID proof if provided
      let idProofUrl: string | null = null;
      if (form.idProofFile) {
        const ext = form.idProofFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { data: up, error: upErr } = await supabase.storage
          .from("id-proofs")
          .upload(fileName, form.idProofFile);
        if (upErr) throw new Error(`ID upload failed: ${upErr.message}`);
        idProofUrl = up.path;
      }

      // 3. Create booking as pending_payment — holds the room while customer pays
      const { data: newBooking, error: bookingError } = await (supabase as any)
        .from("bungalow_bookings")
        .insert({
          full_name: form.fullName.trim(),
          mobile_number: form.mobileNumber.trim(),
          email: form.email.trim() || null,
          address: form.address.trim() || null,
          id_proof_type: form.idProofType || null,
          id_proof_url: idProofUrl,
          room_type: assignedRoom.name,  // physical room — admin tracking
          ac_type: form.acPreference,    // customer preference — for tariff
          package_type: form.packageType,
          check_in_date: checkIn,
          check_out_date: checkOut,
          adults: parseInt(form.adults) || 1,
          children: parseInt(form.children) || 0,
          purpose: form.purpose.trim() || null,
          special_requests: form.specialRequests.trim() || null,
          total_amount: totalPrice,
          payment_status: "pending",
          paid_amount: 0,
          status: "pending_payment",
        })
        .select("id")
        .single();

      if (bookingError) throw bookingError;
      const bookingId: string = newBooking.id;

      // 4. Get PayHere checkout form data (hash generated server-side)
      const nameParts = form.fullName.trim().split(" ");
      const { data: payData, error: payError } = await supabase.functions.invoke(
        "payhere-checkout",
        {
          body: {
            orderId: bookingId,
            amount: paymentAmount.toFixed(2),
            firstName: nameParts[0],
            lastName: nameParts.slice(1).join(" ") || "",
            email: form.email || "",
            phone: form.mobileNumber,
            hallName: `${form.roomType} — ${form.acPreference === "AC" ? "With AC" : "Without AC"}`,
            returnUrl: "https://raajeshwariygroups.com/bungalows?payment=success",
            cancelUrl: `https://raajeshwariygroups.com/bungalows?payment=cancelled`,
          },
        }
      );

      if (payError || !payData) {
        const paymentErrorMessage = payError
          ? await getFunctionErrorMessage(payError)
          : "Failed to initiate payment";

        // Roll back: cancel the pending booking so the room is released
        await (supabase as any)
          .from("bungalow_bookings")
          .update({ status: "cancelled", payment_status: "failed" })
          .eq("id", bookingId);
        throw new Error(paymentErrorMessage);
      }

      // 5. Auto-submit hidden form to PayHere hosted checkout
      const payForm = document.createElement("form");
      payForm.method = "POST";
      payForm.action = payData.checkoutUrl;

      Object.entries(payData.fields as Record<string, string>).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        payForm.appendChild(input);
      });

      document.body.appendChild(payForm);
      payForm.submit();
      // Note: don't reset form/isSubmitting here — page navigates away
    } catch (err: any) {
      toast({ title: "Booking Failed", description: err.message || "Please try again.", variant: "destructive" });
      setIsSubmitting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Layout>
      {/* Hero */}
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

      {/* Policy bar + Date filter */}
      <section className="relative py-8 bg-card border-b border-secondary/20">
        <DecorativeBorder position="top" />
        <div className="container mx-auto px-4 lg:px-8 space-y-6">

          {/* Policy badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <Badge variant="outline" className="border-secondary/50 px-3 py-1">
              <Snowflake className="h-3 w-3 mr-1.5 text-primary" />
              AC rooms available at Non-AC rates on request
            </Badge>
            <Badge variant="outline" className="border-secondary/50 px-3 py-1">
              <Baby className="h-3 w-3 mr-1.5" />1 child under 6 per room
            </Badge>
            <Badge variant="outline" className="border-secondary/50 px-3 py-1">
              <Shield className="h-3 w-3 mr-1.5" />ID proof mandatory
            </Badge>
            <Badge variant="outline" className="border-secondary/50 px-3 py-1">
              <X className="h-3 w-3 mr-1.5" />No pets · No smoking
            </Badge>
          </div>

          {/* Date availability checker */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-secondary/30 rounded-xl p-5">
            <h3 className="font-serif font-semibold text-foreground text-center mb-4 flex items-center justify-center gap-2">
              <CalendarIcon className="h-5 w-5 text-secondary" />
              Check Availability
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="w-full sm:w-auto">
                <Label className="text-xs text-muted-foreground mb-1 block text-center">Check-in</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full sm:w-[190px] justify-start text-left font-normal", !filterCheckIn && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filterCheckIn ? format(filterCheckIn, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={filterCheckIn}
                      onSelect={date => {
                        setFilterCheckIn(date);
                        if (filterCheckOut && date && date >= filterCheckOut) setFilterCheckOut(undefined);
                      }}
                      disabled={date => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <span className="hidden sm:block text-muted-foreground">→</span>

              <div className="w-full sm:w-auto">
                <Label className="text-xs text-muted-foreground mb-1 block text-center">Check-out</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full sm:w-[190px] justify-start text-left font-normal", !filterCheckOut && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filterCheckOut ? format(filterCheckOut, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={filterCheckOut}
                      onSelect={date => setFilterCheckOut(date)}
                      disabled={date => date <= (filterCheckIn ?? new Date())}
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
                {availabilityLoading
                  ? <span className="animate-pulse">Checking availability...</span>
                  : <>Showing availability for <span className="font-medium text-foreground">{format(filterCheckIn, "dd MMM yyyy")}</span> — <span className="font-medium text-foreground">{format(filterCheckOut, "dd MMM yyyy")}</span></>
                }
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Room type cards */}
      <section className="relative py-16 bg-background overflow-hidden">
        <div className="absolute inset-0 paisley-bg opacity-20" />
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {typeGroups.map(group => (
              <RoomTypeCard
                key={group.type}
                group={group}
                datesActive={datesActive}
                onBook={handleOpenBooking}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Booking Dialog */}
      <Dialog open={showDialog} onOpenChange={open => { if (!open) setShowDialog(false); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="text-secondary text-xl">🪔</span>
              <DialogTitle className="font-serif text-2xl text-gradient-gold">Room Reservation</DialogTitle>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-1">

            {/* ── Section 1: Room & Dates ── */}
            <div className="space-y-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Room & Stay</p>

              {/* Room type selector */}
              <div>
                <Label className="text-sm mb-2 block">Room Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  {ROOM_TYPES.map(type => {
                    const g = typeGroups.find(g => g.type === type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setField("roomType", type)}
                        className={cn(
                          "p-3 rounded-lg border text-center transition-all",
                          form.roomType === type
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="font-semibold text-sm">{type.replace(" Room", "")}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Max {g?.maxOccupancy.adults ?? "—"} adults
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm mb-1 block">Check-in *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal text-sm", !form.checkInDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.checkInDate ? format(form.checkInDate, "dd MMM yyyy") : "Select"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.checkInDate}
                        onSelect={date => {
                          setField("checkInDate", date);
                          if (form.checkOutDate && date && date >= form.checkOutDate)
                            setField("checkOutDate", undefined);
                        }}
                        disabled={date => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-sm mb-1 block">Check-out *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal text-sm", !form.checkOutDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.checkOutDate ? format(form.checkOutDate, "dd MMM yyyy") : "Select"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.checkOutDate}
                        onSelect={date => setField("checkOutDate", date)}
                        disabled={date => date <= (form.checkInDate ?? new Date())}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {nights > 0 && (
                <p className="text-sm text-center text-muted-foreground">
                  {nights} night{nights > 1 ? "s" : ""}
                </p>
              )}

              {/* AC Preference */}
              <div>
                <Label className="text-sm mb-2 block">AC Preference</Label>
                <div className="grid grid-cols-2 gap-3">
                  {(["AC", "Non-AC"] as AcPref[]).map(pref => {
                    const tariff = getTariff(bungalowsList, form.roomType, pref);
                    const avail = pref === "AC" ? dialogAvailForAc : dialogAvailForNonAc;
                    const isActive = form.acPreference === pref;
                    return (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setField("acPreference", pref)}
                        className={cn(
                          "p-4 rounded-lg border text-center transition-all",
                          isActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                        )}
                      >
                        {pref === "AC" && <Snowflake className={cn("h-5 w-5 mx-auto mb-1", isActive ? "text-primary" : "text-muted-foreground")} />}
                        <div className={cn("font-semibold text-sm", isActive ? "text-primary" : "text-foreground")}>
                          {pref === "AC" ? "With AC" : "Without AC"}
                        </div>
                        {tariff && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Rs {tariff.roomOnly.toLocaleString()}/night
                          </div>
                        )}
                        {avail !== null && (
                          <div className={cn(
                            "text-xs mt-1 font-medium",
                            avail > 0 ? "text-green-600" : "text-destructive"
                          )}>
                            {avail > 0 ? `${avail} available` : "None available"}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {form.acPreference === "Non-AC" && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-start gap-1">
                    <Info className="h-3 w-3 shrink-0 mt-0.5" />
                    An AC room may be assigned at Non-AC rates if Non-AC rooms are unavailable.
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-border" />

            {/* ── Section 2: Package & Guests ── */}
            <div className="space-y-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Package & Guests</p>

              {/* Package type */}
              <div>
                <Label className="text-sm mb-2 block">Meal Package</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "roomOnly" as PkgType, label: "Room Only", price: effectiveTariff?.roomOnly },
                      { id: "bbWithRoom" as PkgType, label: "Bed & Breakfast", price: effectiveTariff?.bbWithRoom },
                      { id: "fullBoard" as PkgType, label: "Full Board", price: effectiveTariff?.fullBoard },
                    ] as const
                  ).map(pkg => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setField("packageType", pkg.id)}
                      className={cn(
                        "p-3 rounded-lg border text-center transition-all",
                        form.packageType === pkg.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="text-sm font-medium">{pkg.label}</div>
                      {pkg.price && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Rs {pkg.price.toLocaleString()}/night
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest count */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Adults *</Label>
                  <Input
                    type="number"
                    min="1"
                    max={currentTypeGroup?.maxOccupancy.adults ?? 4}
                    value={form.adults}
                    onChange={e => setField("adults", e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Max {currentTypeGroup?.maxOccupancy.adults ?? "—"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm">Children</Label>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    value={form.children}
                    onChange={e => setField("children", e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-0.5">Under 6 years · max 1</p>
                </div>
              </div>

              {/* Price summary */}
              {effectiveTariff && (
                <div className="bg-gradient-to-r from-secondary/10 to-primary/10 p-4 rounded-lg border border-secondary/30">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Per night</span>
                      <span className="font-medium">Rs {perNight.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nights</span>
                      <span className="font-medium">{nights > 0 ? nights : "—"}</span>
                    </div>
                    <div className="border-t border-secondary/30 pt-2 flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-lg text-primary">
                        {totalPrice > 0 ? `Rs ${totalPrice.toLocaleString()}` : "Select dates"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border" />

            {/* ── Section 3: Personal Details ── */}
            <div className="space-y-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Details</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Full Name *</Label>
                  <Input
                    value={form.fullName}
                    onChange={e => setField("fullName", e.target.value)}
                    placeholder="Your full name"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm">Mobile Number *</Label>
                  <Input
                    type="tel"
                    value={form.mobileNumber}
                    onChange={e => setField("mobileNumber", e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm">Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={e => setField("email", e.target.value)}
                  placeholder="your@email.com"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">ID Proof Type</Label>
                  <Select value={form.idProofType} onValueChange={v => setField("idProofType", v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {ID_PROOF_TYPES.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Upload ID Proof</Label>
                  <div className="mt-1">
                    <label
                      htmlFor="dlg-idProof"
                      className="flex items-center gap-2 px-3 py-2 border border-dashed border-primary/40 rounded-lg cursor-pointer hover:bg-primary/5 text-xs text-muted-foreground h-10"
                    >
                      <Upload className="h-3 w-3 shrink-0" />
                      <span className="truncate">
                        {form.idProofFile ? form.idProofFile.name : "PDF / JPG / PNG (max 5MB)"}
                      </span>
                    </label>
                    <input
                      id="dlg-idProof"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0] ?? null;
                        if (file && file.size > 5 * 1024 * 1024) {
                          toast({ title: "File too large", description: "Max 5MB.", variant: "destructive" });
                          return;
                        }
                        setField("idProofFile", file);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm">Address</Label>
                <Textarea
                  value={form.address}
                  onChange={e => setField("address", e.target.value)}
                  placeholder="Your address"
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div>
                <Label className="text-sm">Purpose of Stay</Label>
                <Input
                  value={form.purpose}
                  onChange={e => setField("purpose", e.target.value)}
                  placeholder="e.g., Attending wedding ceremony"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm">Special Requests</Label>
                <Textarea
                  value={form.specialRequests}
                  onChange={e => setField("specialRequests", e.target.value)}
                  placeholder="Any special requirements..."
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || totalPrice <= 0}
                className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-traditional hover:shadow-gold-glow transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent inline-block" />
                    Redirecting to payment...
                  </>
                ) : (
                  <>🪷 Proceed to Payment{totalPrice > 0 ? ` — Rs ${paymentAmount.toLocaleString()}` : ""}</>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <CTASection
        title="Need"
        highlight="Assistance?"
        description="Our team is available to help you find the perfect accommodation. Contact us for special requirements or group bookings."
        primaryButtonText="Contact Us"
        primaryButtonLink="/contact"
      />
    </Layout>
  );
};

export default BungalowsPage;
