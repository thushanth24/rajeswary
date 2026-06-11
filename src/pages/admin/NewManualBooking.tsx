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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Plus, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSectionAwareAvailability } from '@/hooks/useSectionAwareAvailability';
const timeSlots = [
  { id: 'morning', label: 'Morning (09:00 - 14:00)', start: '09:00', end: '14:00' },
  { id: 'evening', label: 'Evening (14:00 - 18:00)', start: '14:00', end: '18:00' },
  { id: 'fullday', label: 'Full Day (09:00 - 18:00)', start: '09:00', end: '18:00' },
];

const bookingSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  customer_phone: z.string().min(10, 'Please enter a valid phone number'),
  event_type: z.string().min(1, 'Please select an event type'),
  event_type_other: z.string().optional(),
  event_date: z.string().min(1, 'Please select a date'),
  time_slot: z.string().min(1, 'Please select a time slot'),
  expected_guests: z.number().optional(),
  special_requests: z.string().optional(),
}).superRefine((values, ctx) => {
  if (values.event_type === 'Other') {
    const other = values.event_type_other?.trim() || '';
    if (!other) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['event_type_other'],
        message: 'Please specify the event type',
      });
    } else if (other.length > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['event_type_other'],
        message: 'Event type must be 100 characters or less',
      });
    }
  }
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customer_name: '',
      customer_phone: '',
      event_type: '',
      event_type_other: '',
      event_date: '',
      time_slot: '',
      expected_guests: undefined,
      special_requests: '',
    },
  });

  // Watch form values for real-time availability checking
  const eventDate = useWatch({ control: form.control, name: 'event_date' });
  const timeSlot = useWatch({ control: form.control, name: 'time_slot' });
  const eventType = useWatch({ control: form.control, name: 'event_type' });

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

  useEffect(() => {
    if (eventType !== 'Other') {
      form.setValue('event_type_other', '');
    }
  }, [eventType, form]);

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
      const eventTypeLabel = values.event_type === 'Other'
        ? (values.event_type_other || '').trim()
        : values.event_type;

      // Get time slot details
      const selectedTimeSlot = timeSlots.find(ts => ts.id === values.time_slot);
      
      const specialRequests = values.special_requests?.trim() || '';

      const { error } = await supabase
        .from('bookings')
        .insert({
          hall_id: selectedHall,
          section_id: sections.length > 0 ? selectedSection || null : null,
          customer_name: values.customer_name,
          customer_phone: values.customer_phone,
          customer_email: null,
          customer_address: null,
          event_type: eventTypeLabel.substring(0, 100),
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
    'Puberty Ceremony',
    'Anthiyetti',
    'Pre-Wedding',
    'Other',
  ];

  // Debug: log state to find object rendering issue
  console.log('DEBUG NewManualBooking render:', {
    hallsCount: halls.length,
    hallsData: halls.map(h => ({ id: h.id, name: h.name, nameType: typeof h.name })),
    sectionsCount: sections.length,
    sectionsData: sections.map(s => ({ id: s.id, name: s.name, nameType: typeof s.name })),
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
                  {eventType === 'Other' && (
                    <FormField
                      control={form.control}
                      name="event_type_other"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Specify Event *</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g., Baby shower" maxLength={100} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
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
                        <FormLabel>Expected Guests (Optional)</FormLabel>
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
          
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default NewManualBooking;

