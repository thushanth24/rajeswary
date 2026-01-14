import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Plus, Camera, Car, Palette, Music, UserCheck, Headphones, Sparkles, Gem, Eye, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { menus } from '@/data/services';
import { MenuQuickViewModal } from '@/components/menu/MenuQuickViewModal';
import { useSectionAwareAvailability } from '@/hooks/useSectionAwareAvailability';
const timeSlots = [
  { id: 'morning', label: 'Morning (09:00 - 14:00)', start: '09:00', end: '14:00' },
  { id: 'evening', label: 'Evening (14:00 - 18:00)', start: '14:00', end: '18:00' },
  { id: 'fullday', label: 'Full Day (09:00 - 18:00)', start: '09:00', end: '18:00' },
];

const addOnServices = [
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'vehicles', label: 'Vehicles', icon: Car },
  { id: 'decoration', label: 'Decoration', icon: Palette },
  { id: 'sound-lighting', label: 'Sound & Lighting', icon: Music },
  { id: 'coordination', label: 'Coordination', icon: UserCheck },
  { id: 'dj-music', label: 'DJ & Music', icon: Headphones },
  { id: 'makeup', label: 'Makeup', icon: Sparkles },
  { id: 'jewellery', label: 'Jewellery', icon: Gem },
];

const menuSections = [
  { id: 'pubert', label: 'Lunch', icon: '☀️' },
  { id: 'dinner', label: 'Dinner', icon: '🌙' },
  { id: 'wedding', label: 'Standard', icon: '💒' },
  { id: 'registration', label: 'Supreme', icon: '📝' },
];

const menuVariants = [
  { id: 'veg', label: 'Veg', fullLabel: 'Vegetarian', icon: '🥬', activeClass: 'border-green-500 bg-green-500/10 text-green-700', hoverClass: 'hover:border-green-500/50' },
  { id: 'nonveg', label: 'Non-Veg', fullLabel: 'Non-Vegetarian', icon: '🍗', activeClass: 'border-orange-500 bg-orange-500/10 text-orange-700', hoverClass: 'hover:border-orange-500/50' },
  { id: 'special', label: 'Special', fullLabel: 'Special', icon: '✨', activeClass: 'border-primary bg-primary/10 text-primary', hoverClass: 'hover:border-primary/50' },
];

const bookingSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  customer_phone: z.string().min(10, 'Please enter a valid phone number'),
  customer_email: z.string().email().optional().or(z.literal('')),
  customer_address: z.string().optional(),
  event_type: z.string().min(1, 'Please select an event type'),
  event_date: z.string().min(1, 'Please select a date'),
  time_slot: z.string().min(1, 'Please select a time slot'),
  expected_guests: z.number().optional(),
  special_requests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface Hall {
  id: string;
  name: string;
}

interface HallSection {
  id: string;
  name: string;
}

const NewManualBooking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [halls, setHalls] = useState<Hall[]>([]);
  const [sections, setSections] = useState<HallSection[]>([]);
  const [selectedHall, setSelectedHall] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Menu selection state
  const [menuSection, setMenuSection] = useState('');
  const [menuVariant, setMenuVariant] = useState('');
  const [mealType, setMealType] = useState('');
  const [menuPackage, setMenuPackage] = useState('');
  const [menuNotes, setMenuNotes] = useState('');
  const [previewMenu, setPreviewMenu] = useState<{ menu: any; variant: 'veg' | 'nonveg' | 'special' } | null>(null);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      customer_address: '',
      event_type: '',
      event_date: '',
      time_slot: '',
      expected_guests: undefined,
      special_requests: '',
    },
  });

  // Watch form values for real-time availability checking
  const eventDate = useWatch({ control: form.control, name: 'event_date' });
  const timeSlot = useWatch({ control: form.control, name: 'time_slot' });

  // Use the section-aware availability hook
  const {
    slotAvailability,
    hasMultipleSections,
    loading: availabilityLoading,
    isClosed,
    isSlotAvailable,
    isSectionAvailable,
    bookings,
  } = useSectionAwareAvailability(selectedHall || null, eventDate || null);

  // Get available sections for the selected time slot - compute directly from bookings to avoid callback dependency issues
  const availableSectionsForSlot = useMemo(() => {
    if (!timeSlot || !hasMultipleSections) return sections;
    if (isClosed) return [];
    
    return sections.filter(s => {
      // Check if this section has a conflicting booking
      const hasConflict = bookings.some(
        (b) =>
          b.section_id === s.id &&
          ((b.event_start_time === null && b.event_end_time === null) || // Legacy fullday
           (timeSlot === 'fullday') ||
           (b.event_start_time?.substring(0, 5) === '09:00' && b.event_end_time?.substring(0, 5) === '18:00') || // existing fullday
           (timeSlot === 'morning' && b.event_start_time?.substring(0, 5) === '09:00' && b.event_end_time?.substring(0, 5) === '14:00') ||
           (timeSlot === 'evening' && b.event_start_time?.substring(0, 5) === '14:00' && b.event_end_time?.substring(0, 5) === '18:00'))
      );
      if (hasConflict) return false;

      // Check for unassigned bookings that would block all sections
      const hasUnassigned = bookings.some(
        (b) =>
          !b.section_id &&
          ((b.event_start_time === null && b.event_end_time === null) ||
           (timeSlot === 'fullday') ||
           (b.event_start_time?.substring(0, 5) === '09:00' && b.event_end_time?.substring(0, 5) === '18:00') ||
           (timeSlot === 'morning' && b.event_start_time?.substring(0, 5) === '09:00' && b.event_end_time?.substring(0, 5) === '14:00') ||
           (timeSlot === 'evening' && b.event_start_time?.substring(0, 5) === '14:00' && b.event_end_time?.substring(0, 5) === '18:00'))
      );
      return !hasUnassigned;
    });
  }, [sections, timeSlot, hasMultipleSections, isClosed, bookings]);

  // Check if there's a conflict with the current selection
  const hasConflict = useMemo(() => {
    if (!eventDate || !timeSlot) return false;
    if (isClosed) return true;
    if (!isSlotAvailable(timeSlot)) return true;
    if (hasMultipleSections && selectedSection) {
      const sectionAvailable = availableSectionsForSlot.some(s => s.id === selectedSection);
      if (!sectionAvailable) return true;
    }
    return false;
  }, [eventDate, timeSlot, isClosed, isSlotAvailable, hasMultipleSections, selectedSection, availableSectionsForSlot]);

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(s => s !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Track previous time slot to reset section only on actual change
  const prevTimeSlotRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    // Only reset section if time slot actually changed (not on initial render or availability refresh)
    if (prevTimeSlotRef.current !== undefined && prevTimeSlotRef.current !== timeSlot) {
      if (sections.length > 1) {
        setSelectedSection('');
      }
    }
    prevTimeSlotRef.current = timeSlot;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeSlot]);

  useEffect(() => {
    const fetchManagerHalls = async () => {
      if (!user) return;

      try {
        // Get all halls assigned to this manager
        const { data: assignments, error } = await supabase
          .from('hall_managers')
          .select('hall_id, halls(id, name)')
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (error) throw error;

        if (assignments && assignments.length > 0) {
          const managerHalls = assignments
            .filter(a => a.halls && typeof a.halls === 'object')
            .map(a => {
              const hall = a.halls as { id: string; name: string };
              // Ensure we extract string values
              return { 
                id: String(hall.id || ''), 
                name: String(hall.name || 'Unnamed Hall') 
              };
            })
            .filter(h => h.id); // Remove any with empty IDs
          
          console.log('DEBUG: Manager halls extracted:', managerHalls);
          setHalls(managerHalls);
          if (managerHalls.length === 1) {
            setSelectedHall(managerHalls[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching manager halls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerHalls();
  }, [user]);

  // Fetch sections when hall changes
  useEffect(() => {
    const fetchSections = async () => {
      if (!selectedHall) {
        setSections([]);
        setSelectedSection('');
        return;
      }

      const { data, error } = await supabase
        .from('hall_sections')
        .select('id, name')
        .eq('hall_id', selectedHall)
        .eq('is_active', true)
        .order('display_order');

      if (!error && data) {
        // Ensure section data has proper string values
        const safeSections = data.map(s => ({
          id: String(s.id || ''),
          name: String(s.name || 'Unnamed Section')
        })).filter(s => s.id);
        
        console.log('DEBUG: Sections fetched:', safeSections);
        setSections(safeSections);
        // Auto-select first section if only one exists
        if (safeSections.length === 1) {
          setSelectedSection(safeSections[0].id);
        } else {
          setSelectedSection('');
        }
      }
    };

    fetchSections();
  }, [selectedHall]);

  const onSubmit = async (values: BookingFormValues) => {
    if (!selectedHall) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No hall assigned to you',
      });
      return;
    }

    // Require section selection for multi-section halls
    if (sections.length > 1 && !selectedSection) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a section for this hall',
      });
      return;
    }

    // Check for booking conflicts before submitting
    if (hasConflict) {
      toast({
        variant: 'destructive',
        title: 'Booking Conflict',
        description: isClosed 
          ? 'This date is closed for bookings.' 
          : 'This time slot or section is already booked. Please select a different option.',
      });
      return;
    }

    setSubmitting(true);
    try {
      // Get time slot details
      const selectedTimeSlot = timeSlots.find(ts => ts.id === values.time_slot);
      
      // Build special requests with menu and services
      let specialRequests = values.special_requests || '';
      
      // Add menu selection info
      if (menuPackage) {
        const selectedMenu = menus[mealType as keyof typeof menus]?.find((m: any) => m.id === menuPackage);
        if (selectedMenu) {
          const menuText = `Menu Selection: ${selectedMenu.name} (${selectedMenu.price})`;
          specialRequests = specialRequests ? `${specialRequests}\n\n${menuText}` : menuText;
        }
      }
      if (menuNotes) {
        const menuNotesText = `Menu Notes: ${menuNotes}`;
        specialRequests = specialRequests ? `${specialRequests}\n${menuNotesText}` : menuNotesText;
      }
      
      // Add services
      if (selectedServices.length > 0) {
        const serviceLabels = selectedServices.map(id => 
          addOnServices.find(s => s.id === id)?.label
        ).filter(Boolean);
        const servicesText = `Additional Services: ${serviceLabels.join(', ')}`;
        specialRequests = specialRequests 
          ? `${specialRequests}\n\n${servicesText}` 
          : servicesText;
      }

      const { error } = await supabase
        .from('bookings')
        .insert({
          hall_id: selectedHall,
          section_id: sections.length > 0 ? selectedSection || null : null,
          customer_name: values.customer_name,
          customer_phone: values.customer_phone,
          customer_email: values.customer_email || null,
          customer_address: values.customer_address || null,
          event_type: values.event_type,
          event_date: values.event_date,
          event_start_time: selectedTimeSlot?.start || null,
          event_end_time: selectedTimeSlot?.end || null,
          expected_guests: values.expected_guests || null,
          special_requests: specialRequests || null,
          is_manual_booking: true,
          status: 'confirmed',
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: user?.id,
          confirmed_at: new Date().toISOString(),
          confirmed_by: user?.id,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Manual booking created and confirmed',
      });
      navigate('/admin/bookings');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const eventTypes = [
    'Wedding',
    'Reception',
    'Engagement',
    'Birthday Party',
    'Anniversary',
    'Corporate Event',
    'Pre-Wedding',
    'Other',
  ];

  // Debug: log state to find object rendering issue
  console.log('DEBUG NewManualBooking render:', {
    hallsCount: halls.length,
    hallsData: halls.map(h => ({ id: h.id, name: h.name, nameType: typeof h.name })),
    sectionsCount: sections.length,
    sectionsData: sections.map(s => ({ id: s.id, name: s.name, nameType: typeof s.name })),
    selectedServices,
    menuSection,
    menuVariant,
    mealType,
    menuPackage,
  });

  if (loading) {
    return (
      <AdminLayout title="New Manual Booking">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (halls.length === 0) {
    return (
      <AdminLayout title="New Manual Booking">
        <Card className="card-traditional">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              You are not assigned to any hall. Please contact an administrator.
            </p>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="New Manual Booking">
      <Card className="card-traditional max-w-2xl">
        <CardHeader>
          <CardTitle className="font-serif flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Create Manual Booking
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            For walk-in customers, phone bookings, or trusted customers
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Customer Details */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Customer Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customer_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Customer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customer_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customer_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customer_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Address (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Event Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="event_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {eventTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="event_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Availability Warning */}
                {eventDate && isClosed && (
                  <div className="col-span-2 flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span className="text-sm">This date is closed for bookings.</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="time_slot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Slot *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={!eventDate || isClosed}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={eventDate ? "Select time slot" : "Select date first"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((slot) => {
                              const availability = slotAvailability[slot.id as keyof typeof slotAvailability];
                              const isAvailable = availability?.available > 0;
                              const availabilityText = hasMultipleSections 
                                ? `${availability?.available ?? 0}/${availability?.total ?? 0}` 
                                : '';
                              
                              // Build label as a single string to avoid React child issues
                              let label = slot.label;
                              if (eventDate) {
                                if (isAvailable) {
                                  label += availabilityText ? ` (${availabilityText})` : ' ✓';
                                } else {
                                  label += ' - Booked';
                                }
                              }
                              
                              return (
                                <SelectItem 
                                  key={slot.id} 
                                  value={slot.id}
                                  disabled={!!eventDate && !isAvailable}
                                  className={cn(
                                    eventDate && !isAvailable && "text-muted-foreground line-through"
                                  )}
                                >
                                  {label}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expected_guests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Guests</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Number of guests"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="special_requests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requests</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special requirements or notes"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Menu Selection */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <span>🍽️</span> Menu Selection
                </h3>
                <p className="text-sm text-muted-foreground">Select a catering package for this booking (optional)</p>
                
                {/* Meal Type */}
                <div>
                  <Label className="mb-2 block text-sm">Meal Type</Label>
                  <RadioGroup
                    value={menuSection}
                    onValueChange={(value) => {
                      setMenuSection(value);
                      setMenuVariant('');
                      setMealType('');
                      setMenuPackage('');
                    }}
                    className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                  >
                    {menuSections.map((section) => (
                      <div key={section.id}>
                        <RadioGroupItem value={section.id} id={`section-${section.id}`} className="peer sr-only" />
                        <Label
                          htmlFor={`section-${section.id}`}
                          className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all text-center min-h-[70px]",
                            menuSection === section.id
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <span className="text-xs font-medium leading-tight">{section.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Variant Selection */}
                {menuSection && (
                  <div>
                    <Label className="mb-2 block text-sm">Variant</Label>
                    {(() => {
                      const hasSpecial = ['pubert', 'dinner', 'wedding'].includes(menuSection);
                      const variants = hasSpecial ? menuVariants : menuVariants.filter(v => v.id !== 'special');
                      return (
                        <RadioGroup
                          value={menuVariant}
                          onValueChange={(value) => {
                            setMenuVariant(value);
                            let mealTypeKey = '';
                            if (value === 'veg') {
                              mealTypeKey = `${menuSection}Veg`;
                            } else if (value === 'nonveg') {
                              mealTypeKey = `${menuSection}NonVeg`;
                            } else if (value === 'special') {
                              mealTypeKey = `${menuSection}Special`;
                            }
                            setMealType(mealTypeKey);
                            setMenuPackage('');
                          }}
                          className={cn("grid gap-2", hasSpecial ? "grid-cols-3" : "grid-cols-2", "max-w-md")}
                        >
                          {variants.map((variant) => (
                            <div key={variant.id}>
                              <RadioGroupItem value={variant.id} id={`variant-${variant.id}`} className="peer sr-only" />
                              <Label
                                htmlFor={`variant-${variant.id}`}
                                className={cn(
                                  "flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
                                  menuVariant === variant.id
                                    ? variant.activeClass
                                    : `border-border ${variant.hoverClass}`
                                )}
                              >
                                <span className="text-lg">{variant.icon}</span>
                                <span className="font-medium text-sm">{variant.fullLabel}</span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      );
                    })()}
                  </div>
                )}

                {/* Package Selection */}
                {mealType && menus[mealType as keyof typeof menus] && (
                  <div>
                    <Label className="mb-2 block text-sm">Select Package</Label>
                    <RadioGroup
                      value={menuPackage}
                      onValueChange={setMenuPackage}
                      className="grid gap-3"
                    >
                      {menus[mealType as keyof typeof menus]?.map((menu: any) => {
                        const variant = menuVariant === 'special' 
                          ? 'special' 
                          : menuVariant === 'veg' 
                            ? 'veg' 
                            : 'nonveg';
                        return (
                          <div key={menu.id} className="relative">
                            <RadioGroupItem value={menu.id} id={menu.id} className="peer sr-only" />
                            <Label
                              htmlFor={menu.id}
                              className={cn(
                                "flex flex-col sm:flex-row sm:justify-between sm:items-start p-3 rounded-lg border cursor-pointer transition-all pr-12",
                                menuPackage === menu.id
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between sm:justify-start gap-2">
                                  <h3 className="font-semibold text-foreground text-sm">{menu.name}</h3>
                                  <span className="text-primary font-semibold text-sm sm:hidden">
                                    {menu.price}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {menu.items.slice(0, 2).join(' • ')}
                                  {menu.items.length > 2 && ' ...'}
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
                                setPreviewMenu({ menu, variant: variant as 'veg' | 'nonveg' | 'special' });
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

                {/* Menu Notes */}
                <div>
                  <Label htmlFor="menuNotes" className="text-sm">Menu Notes</Label>
                  <Textarea
                    id="menuNotes"
                    value={menuNotes}
                    onChange={(e) => setMenuNotes(e.target.value)}
                    placeholder="Any dietary requirements or special menu requests"
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Additional Services */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Additional Services</h3>
                <p className="text-sm text-muted-foreground">Select any additional services the customer requires</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {addOnServices.map((service) => {
                    const isSelected = selectedServices.includes(service.id);
                    const IconComponent = service.icon;
                    return (
                      <label
                        key={service.id}
                        htmlFor={`service-${service.id}`}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={isSelected}
                          onCheckedChange={() => toggleService(service.id)}
                          className="h-4 w-4"
                        />
                        <IconComponent className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-foreground text-sm">{service.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {halls.length > 1 ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Hall *</label>
                  <Select value={selectedHall} onValueChange={setSelectedHall}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a hall" />
                    </SelectTrigger>
                    <SelectContent>
                      {halls.map((hall) => (
                        <SelectItem key={hall.id} value={hall.id}>
                          {hall.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Hall:</strong> {halls[0]?.name}
                  </p>
                </div>
              )}

              {/* Section selection for multi-section halls */}
              {sections.length > 1 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Section *</label>
                  {!timeSlot && (
                    <p className="text-xs text-muted-foreground">Select a time slot first to see available sections</p>
                  )}
                  <Select 
                    value={selectedSection} 
                    onValueChange={setSelectedSection}
                    disabled={!timeSlot}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={timeSlot ? "Select a section" : "Select time slot first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((section) => {
                        const isAvailable = !timeSlot || isSectionAvailable(timeSlot, section.id);
                        // Build label as a single string to avoid React child issues
                        let label = section.name;
                        if (timeSlot) {
                          label += isAvailable ? ' ✓' : ' - Booked';
                        }
                        return (
                          <SelectItem 
                            key={section.id} 
                            value={section.id}
                            disabled={!isAvailable}
                            className={cn(!isAvailable && "text-muted-foreground line-through")}
                          >
                            {label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {timeSlot && availableSectionsForSlot.length === 0 && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      No sections available for this time slot
                    </p>
                  )}
                </div>
              )}

              {/* Conflict Warning */}
              {hasConflict && !isClosed && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span className="text-sm">
                    {hasMultipleSections && selectedSection 
                      ? 'The selected section is already booked for this time slot.'
                      : 'This time slot is fully booked. Please select a different time or date.'}
                  </span>
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                This booking will be automatically confirmed and marked as manual entry.
              </p>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/bookings')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || hasConflict}>
                  {submitting ? 'Creating...' : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Booking
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
          
          {/* Menu Preview Modal */}
          <MenuQuickViewModal
            open={!!previewMenu}
            onOpenChange={(open) => !open && setPreviewMenu(null)}
            menu={previewMenu?.menu || null}
            variant={previewMenu?.variant || 'veg'}
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default NewManualBooking;

