import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
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
import { Calendar, Plus } from 'lucide-react';

const bookingSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  customer_phone: z.string().min(10, 'Please enter a valid phone number'),
  customer_email: z.string().email().optional().or(z.literal('')),
  customer_address: z.string().optional(),
  event_type: z.string().min(1, 'Please select an event type'),
  event_date: z.string().min(1, 'Please select a date'),
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      customer_address: '',
      event_type: '',
      event_date: '',
      expected_guests: undefined,
      special_requests: '',
    },
  });

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
            .filter(a => a.halls)
            .map(a => {
              const hall = a.halls as any;
              return { id: hall.id, name: hall.name };
            });
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
        setSections(data);
        // Auto-select first section if only one exists
        if (data.length === 1) {
          setSelectedSection(data[0].id);
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

    setSubmitting(true);
    try {
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
          expected_guests: values.expected_guests || null,
          special_requests: values.special_requests || null,
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
                  <Select value={selectedSection} onValueChange={setSelectedSection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <Button type="submit" disabled={submitting}>
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
