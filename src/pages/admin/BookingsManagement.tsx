import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar, CheckCircle, XCircle, Clock, Eye, AlertTriangle, Search, Download, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { format, differenceInHours, isPast, startOfDay } from 'date-fns';
import { menus } from '@/data/services';
import { cn } from '@/lib/utils';

interface Booking {
  id: string;
  hall_id: string;
  section_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  customer_address: string | null;
  event_type: string;
  event_date: string;
  event_start_time: string | null;
  event_end_time: string | null;
  status: 'new' | 'acknowledged' | 'confirmed' | 'cancelled' | 'completed';
  is_manual_booking: boolean;
  acknowledged_at: string | null;
  created_at: string;
  special_requests: string | null;
  internal_notes: string | null;
  payment_status: string | null;
  advance_paid_amount: number | null;
  payment_paid_at: string | null;
  payment_provider: string | null;
  payment_reference: string | null;
  reference_number: string | null;
  expected_guests: number | null;
  halls?: { name: string };
  hall_sections?: { name: string } | null;
}

interface Hall {
  id: string;
  name: string;
}

interface HallSectionOption {
  id: string;
  name: string;
  hall_id: string;
}

const ITEMS_PER_PAGE = 10;

const paymentColors: Record<string, string> = {
  unpaid: 'bg-muted text-muted-foreground border-border',
  pending: 'bg-amber-500/20 text-amber-700 border-amber-500/30',
  paid: 'bg-green-500/20 text-green-700 border-green-500/30',
  failed: 'bg-red-500/20 text-red-700 border-red-500/30',
};

const getPaymentStatus = (booking: Pick<Booking, 'payment_status'>) => booking.payment_status || 'unpaid';

const eventTypeOptions = [
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

const timeSlots = [
  { id: 'morning', label: 'Morning (09:00 - 14:00)', start: '09:00', end: '14:00' },
  { id: 'evening', label: 'Evening (14:00 - 18:00)', start: '14:00', end: '18:00' },
  { id: 'fullday', label: 'Full Day (09:00 - 18:00)', start: '09:00', end: '18:00' },
];

const menuSections = [
  { id: 'pubert', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'wedding', label: 'Standard' },
  { id: 'registration', label: 'Supreme' },
  { id: 'anthiyeddy', label: 'Signature' },
];

const menuVariants = [
  { id: 'veg', label: 'Veg' },
  { id: 'nonveg', label: 'Non-Veg' },
  { id: 'special', label: 'Special' },
];

const addOnServices = [
  { id: 'photography', label: 'Photography & Videography' },
  { id: 'vehicles', label: 'Wedding Vehicles' },
  { id: 'decoration', label: 'Decoration & Themes' },
  { id: 'sound-lighting', label: 'Sound & Lighting' },
  { id: 'live-kitchen', label: 'Live Kitchen' },
  { id: 'coordination', label: 'Event Coordination' },
  { id: 'dj-music', label: 'DJ & Music' },
  { id: 'makeup', label: 'Bridal Makeup' },
  { id: 'jewellery', label: 'Jewellery' },
  { id: 'other', label: 'Other Services' },
];

const BookingsManagement = () => {
  const { user, isHallManager, isAdmin } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [allHalls, setAllHalls] = useState<Hall[]>([]);
  const [editSections, setEditSections] = useState<HallSectionOption[]>([]);
  const [managerHallIds, setManagerHallIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [hallFilter, setHallFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editConflictMessage, setEditConflictMessage] = useState<string | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [editValues, setEditValues] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    hall_id: '',
    section_id: '',
    event_type: '',
    event_date: '',
    time_slot: '',
    event_start_time: '',
    event_end_time: '',
    status: 'new' as Booking['status'],
    reference_number: '',
    expected_guests: '',
    menu_section: '',
    menu_variant: '',
    meal_type: '',
    menu_package: '',
    menu_notes: '',
    services: [] as string[],
    service_notes: '',
    message: '',
    other_notes: '',
    special_requests: '',
    internal_notes: '',
    is_manual_booking: false,
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, hallFilter]);

  useEffect(() => {
    const fetchManagerHalls = async () => {
      if (!isHallManager || !user?.id) return;

      const { data, error } = await supabase
        .from('hall_managers')
        .select('hall_id, halls(name)')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching hall manager assignments:', error);
        return;
      }

      const hallIds = (data || []).map((row: any) => row.hall_id);
      const hallRows = (data || [])
        .map((row: any) => ({
          id: row.hall_id,
          name: row.halls?.name || 'Hall',
        }))
        .filter((hall: Hall) => hall.id);

      setManagerHallIds(hallIds);
      setHalls(hallRows);
    };

    fetchManagerHalls();
  }, [isHallManager, user?.id]);

  useEffect(() => {
    const fetchAllHalls = async () => {
      if (!isAdmin) return;

      const { data, error } = await supabase
        .from('halls')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching halls:', error);
        return;
      }

      setAllHalls((data || []).map((hall) => ({
        id: String(hall.id || ''),
        name: String(hall.name || 'Hall'),
      })).filter((hall) => hall.id));
    };

    fetchAllHalls();
  }, [isAdmin]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      // Build the query with filters
      let query = supabase
        .from('bookings')
        .select('*, halls(name), hall_sections(name)', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any);
      }

      if (isHallManager && managerHallIds.length > 0) {
        query = query.in('hall_id', managerHallIds);
      }

      if (hallFilter !== 'all') {
        query = query.eq('hall_id', hallFilter);
      }

      // Server-side search using ilike for text fields
      if (debouncedSearch.trim()) {
        const searchTerm = `%${debouncedSearch.trim()}%`;
        query = query.or(
          `customer_name.ilike.${searchTerm},customer_phone.ilike.${searchTerm},customer_email.ilike.${searchTerm},reference_number.ilike.${searchTerm}`
        );
      }

      // Apply pagination
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;
      setBookings(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load bookings',
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, hallFilter, debouncedSearch, isHallManager, managerHallIds, toast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleAcknowledge = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: user?.id,
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Booking acknowledged successfully',
      });
      fetchBookings();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  const handleConfirm = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
          confirmed_by: user?.id,
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Booking confirmed successfully',
      });
      fetchBookings();
      setIsDetailDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  const openCancelDialog = (booking: Booking) => {
    setBookingToCancel(booking);
    setCancellationReason('');
    setIsCancelDialogOpen(true);
  };

  const handleCancel = async () => {
    if (!bookingToCancel) return;
    
    setIsCancelling(true);
    try {
      // 1. Update booking status with cancellation reason
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancelled_by: user?.id,
          cancellation_reason: cancellationReason || null,
        })
        .eq('id', bookingToCancel.id);

      if (bookingError) throw bookingError;

      // 2. Delete all inventory allocations for this booking
      const { error: inventoryError } = await supabase
        .from('booking_inventory')
        .delete()
        .eq('booking_id', bookingToCancel.id);

      if (inventoryError) {
        console.error('Failed to delete inventory allocations:', inventoryError);
        // Don't throw - booking is already cancelled, this is cleanup
      }

      // 3. Send cancellation email (fire and forget)
      if (bookingToCancel.customer_email) {
        supabase.functions.invoke('send-booking-cancellation', {
          body: {
            customerName: bookingToCancel.customer_name,
            customerEmail: bookingToCancel.customer_email,
            referenceNumber: bookingToCancel.reference_number || 'N/A',
            hallName: bookingToCancel.halls?.name || 'Hall',
            eventDate: format(new Date(bookingToCancel.event_date), 'PPP'),
            eventType: bookingToCancel.event_type,
            cancellationReason: cancellationReason,
          },
        }).then(({ error }) => {
          if (error) {
            console.error('Failed to send cancellation email:', error);
          } else {
            console.log('Cancellation email sent successfully');
          }
        });
      }

      toast({
        title: 'Booking Cancelled',
        description: 'Booking has been cancelled and customer notified',
      });
      
      setIsCancelDialogOpen(false);
      setIsDetailDialogOpen(false);
      setBookingToCancel(null);
      setCancellationReason('');
      fetchBookings();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedBooking) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ internal_notes: internalNotes })
        .eq('id', selectedBooking.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Notes saved successfully',
      });
      fetchBookings();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      // Fetch ALL bookings matching current filters for export (no pagination)
      let query = supabase
        .from('bookings')
        .select('*, halls(name), hall_sections(name)')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any);
      }

      if (isHallManager && managerHallIds.length > 0) {
        query = query.in('hall_id', managerHallIds);
      }

      if (hallFilter !== 'all') {
        query = query.eq('hall_id', hallFilter);
      }

      if (debouncedSearch.trim()) {
        const searchTerm = `%${debouncedSearch.trim()}%`;
        query = query.or(
          `customer_name.ilike.${searchTerm},customer_phone.ilike.${searchTerm},customer_email.ilike.${searchTerm},reference_number.ilike.${searchTerm}`
        );
      }

      const { data: allBookings, error } = await query;

      if (error) throw error;

      const headers = [
        'Reference',
        'Customer Name',
        'Phone',
        'Email',
        'Hall',
        'Event Type',
        'Event Date',
        'Expected Guests',
        'Status',
        'Payment Status',
        'Advance Paid Amount',
        'Payment Paid At',
        'Payment Reference',
        'Booking Type',
        'Created At',
        'Special Requests'
      ];

      const csvData = (allBookings || []).map(booking => [
        booking.reference_number || '',
        booking.customer_name,
        booking.customer_phone,
        booking.customer_email || '',
        booking.halls?.name || '',
        booking.event_type,
        format(new Date(booking.event_date), 'yyyy-MM-dd'),
        booking.expected_guests?.toString() || '',
        booking.status,
        getPaymentStatus(booking),
        booking.advance_paid_amount?.toString() || '0',
        booking.payment_paid_at ? format(new Date(booking.payment_paid_at), 'yyyy-MM-dd HH:mm') : '',
        booking.payment_reference || '',
        booking.is_manual_booking ? 'Manual' : 'Online',
        format(new Date(booking.created_at), 'yyyy-MM-dd HH:mm'),
        (booking.special_requests || '').replace(/"/g, '""').replace(/\n/g, ' ')
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `bookings_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Export Complete',
        description: `Exported ${allBookings?.length || 0} bookings to CSV`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: 'Could not export bookings',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusBadge = (booking: Booking) => {
    const hoursOld = differenceInHours(new Date(), new Date(booking.created_at));
    const isOverdue = booking.status === 'new' && !booking.acknowledged_at && hoursOld > 24;
    const eventDate = new Date(booking.event_date);
    const isPastEvent = isPast(startOfDay(eventDate)) && startOfDay(eventDate) < startOfDay(new Date());

    // Show as completed if event date has passed and status is confirmed
    if (isPastEvent && booking.status === 'confirmed') {
      return <Badge variant="default" className="bg-purple-600">Completed</Badge>;
    }

    switch (booking.status) {
      case 'new':
        return isOverdue ? (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Overdue
          </Badge>
        ) : (
          <Badge variant="secondary">New</Badge>
        );
      case 'acknowledged':
        return <Badge variant="outline">Acknowledged</Badge>;
      case 'confirmed':
        return <Badge variant="default" className="bg-green-600">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-purple-600">Completed</Badge>;
      default:
        return <Badge variant="outline">{booking.status}</Badge>;
    }
  };

  const openDetail = (booking: Booking) => {
    const normalizedStart = booking.event_start_time ? booking.event_start_time.substring(0, 5) : '';
    const normalizedEnd = booking.event_end_time ? booking.event_end_time.substring(0, 5) : '';
    const parsedRequests = parseSpecialRequests(booking.special_requests);

    setSelectedBooking(booking);
    setInternalNotes(booking.internal_notes || '');
    setIsEditing(false);
    setEditValues({
      customer_name: booking.customer_name,
      customer_phone: booking.customer_phone,
      customer_email: booking.customer_email || '',
      customer_address: booking.customer_address || '',
      hall_id: booking.hall_id,
      section_id: booking.section_id || '',
      event_type: booking.event_type,
      event_date: booking.event_date,
      time_slot: getTimeSlotFromTimes(booking.event_start_time, booking.event_end_time),
      event_start_time: normalizedStart,
      event_end_time: normalizedEnd,
      status: booking.status,
      reference_number: booking.reference_number || '',
      expected_guests: booking.expected_guests?.toString() || '',
      menu_section: parsedRequests.menu_section,
      menu_variant: parsedRequests.menu_variant,
      meal_type: parsedRequests.meal_type,
      menu_package: parsedRequests.menu_package,
      menu_notes: parsedRequests.menu_notes,
      services: parsedRequests.services,
      service_notes: parsedRequests.service_notes,
      message: parsedRequests.message,
      other_notes: parsedRequests.other_notes,
      special_requests: booking.special_requests || '',
      internal_notes: booking.internal_notes || '',
      is_manual_booking: booking.is_manual_booking,
    });
    setIsDetailDialogOpen(true);
  };

  const toMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map((value) => Number.parseInt(value, 10));
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    return hours * 60 + minutes;
  };

  const timesOverlap = (
    existingStart: string | null,
    existingEnd: string | null,
    newStart: string | null,
    newEnd: string | null
  ) => {
    if (!existingStart || !existingEnd || !newStart || !newEnd) return true;
    const startA = toMinutes(existingStart.substring(0, 5));
    const endA = toMinutes(existingEnd.substring(0, 5));
    const startB = toMinutes(newStart.substring(0, 5));
    const endB = toMinutes(newEnd.substring(0, 5));
    if (startA === null || endA === null || startB === null || endB === null) return true;
    return startA < endB && startB < endA;
  };

  const deriveMealType = (sectionId: string, variantId: string) => {
    if (!sectionId || !variantId) return '';
    if (variantId === 'veg') return `${sectionId}Veg`;
    if (variantId === 'nonveg') return `${sectionId}NonVeg`;
    if (variantId === 'special') return `${sectionId}Special`;
    return '';
  };

  const getTimeSlotFromTimes = (start?: string | null, end?: string | null) => {
    if (!start || !end) return '';
    const normalizedStart = start.substring(0, 5);
    const normalizedEnd = end.substring(0, 5);
    const match = timeSlots.find(
      (slot) => slot.start === normalizedStart && slot.end === normalizedEnd
    );
    return match?.id || 'custom';
  };

  const parseSpecialRequests = (specialRequests: string | null) => {
    const parsed = {
      menu_section: '',
      menu_variant: '',
      meal_type: '',
      menu_package: '',
      menu_notes: '',
      services: [] as string[],
      service_notes: '',
      message: '',
      other_notes: '',
    };

    if (!specialRequests) return parsed;

    const otherLines: string[] = [];
    const lines = specialRequests.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    let menuName = '';

    const normalizeMenuName = (value: string) => {
      const base = value.split('(')[0].trim();
      return base;
    };

    lines.forEach((line) => {
      if (line.startsWith('Meal Type:')) {
        parsed.meal_type = line.replace('Meal Type:', '').trim();
      } else if (line.startsWith('Menu:')) {
        menuName = normalizeMenuName(line.replace('Menu:', '').trim());
      } else if (line.startsWith('Menu Selection:')) {
        menuName = normalizeMenuName(line.replace('Menu Selection:', '').trim());
      } else if (line.startsWith('Menu Notes:')) {
        parsed.menu_notes = line.replace('Menu Notes:', '').trim();
      } else if (line.startsWith('Services:')) {
        const serviceList = line.replace('Services:', '').trim().split(',').map((s) => s.trim()).filter(Boolean);
        parsed.services = serviceList
          .map((label) => {
            const lowered = label.toLowerCase();
            return addOnServices.find((service) =>
              service.label.toLowerCase() === lowered || service.label.toLowerCase().includes(lowered)
            )?.id;
          })
          .filter(Boolean) as string[];
        if (parsed.services.length === 0 && serviceList.length > 0) {
          otherLines.push(line);
        }
      } else if (line.startsWith('Additional Services:')) {
        const serviceList = line.replace('Additional Services:', '').trim().split(',').map((s) => s.trim()).filter(Boolean);
        parsed.services = serviceList
          .map((label) => {
            const lowered = label.toLowerCase();
            return addOnServices.find((service) =>
              service.label.toLowerCase() === lowered || service.label.toLowerCase().includes(lowered)
            )?.id;
          })
          .filter(Boolean) as string[];
        if (parsed.services.length === 0 && serviceList.length > 0) {
          otherLines.push(line);
        }
      } else if (line.startsWith('Service Notes:')) {
        parsed.service_notes = line.replace('Service Notes:', '').trim();
      } else if (line.startsWith('Message:')) {
        parsed.message = line.replace('Message:', '').trim();
      } else {
        otherLines.push(line);
      }
    });

    if (parsed.meal_type) {
      const lower = parsed.meal_type.toLowerCase();
      const matchingSection = menuSections.find((section) => lower.startsWith(section.id));
      if (matchingSection) {
        parsed.menu_section = matchingSection.id;
        if (lower.includes('nonveg')) parsed.menu_variant = 'nonveg';
        if (lower.includes('special')) parsed.menu_variant = 'special';
        if (!parsed.menu_variant) parsed.menu_variant = 'veg';
      }
    }

    if (parsed.menu_section && parsed.menu_variant) {
      parsed.meal_type = parsed.meal_type || deriveMealType(parsed.menu_section, parsed.menu_variant);
    }

    if (parsed.meal_type && menuName) {
      const menuList = menus[parsed.meal_type as keyof typeof menus] || [];
      const matchedMenu = menuList.find((menu: any) => menu.name === menuName);
      if (matchedMenu) {
        parsed.menu_package = matchedMenu.id;
      } else {
        otherLines.push(`Menu: ${menuName}`);
      }
    } else if (menuName) {
      otherLines.push(`Menu: ${menuName}`);
    }

    parsed.other_notes = otherLines.join('\n');
    return parsed;
  };

  const buildSpecialRequests = () => {
    const parts: string[] = [];

    if (editValues.meal_type) {
      parts.push(`Meal Type: ${editValues.meal_type}`.trim());
    }
    if (editValues.menu_package && editValues.meal_type) {
      const menuList = menus[editValues.meal_type as keyof typeof menus] || [];
      const selectedMenu = menuList.find((menu: any) => menu.id === editValues.menu_package);
      if (selectedMenu?.name) {
        parts.push(`Menu: ${selectedMenu.name}`.trim());
      }
    }
    if (editValues.menu_notes.trim()) {
      parts.push(`Menu Notes: ${editValues.menu_notes.trim()}`);
    }
    if (editValues.services.length > 0) {
      const serviceLabels = editValues.services
        .map((serviceId) => addOnServices.find((service) => service.id === serviceId)?.label)
        .filter(Boolean);
      if (serviceLabels.length > 0) {
        parts.push(`Services: ${serviceLabels.join(', ')}`);
      }
    }
    if (editValues.service_notes.trim()) {
      parts.push(`Service Notes: ${editValues.service_notes.trim()}`);
    }
    if (editValues.message.trim()) {
      parts.push(`Message: ${editValues.message.trim()}`);
    }
    if (editValues.other_notes.trim()) {
      parts.push(editValues.other_notes.trim());
    }

    return parts.join('\n').trim();
  };

  const eventTypeOptionsForEdit = editValues.event_type && !eventTypeOptions.includes(editValues.event_type)
    ? [editValues.event_type, ...eventTypeOptions]
    : eventTypeOptions;

  const checkEditAvailability = async () => {
    if (!selectedBooking) return 'No booking selected.';
    if (!editValues.hall_id) return 'Please select a hall.';
    if (!editValues.event_date) return 'Please select an event date.';

    const selectedSlot = timeSlots.find((slot) => slot.id === editValues.time_slot);
    const newStart = selectedSlot?.start || editValues.event_start_time.trim() || null;
    const newEnd = selectedSlot?.end || editValues.event_end_time.trim() || null;

    if (!newStart || !newEnd) {
      return 'Please select a time slot or provide custom start/end times.';
    }

    const startMinutes = toMinutes(newStart);
    const endMinutes = toMinutes(newEnd);
    if (startMinutes === null || endMinutes === null || startMinutes >= endMinutes) {
      return 'Please provide a valid time range.';
    }

    const { data: closedData, error: closedError } = await supabase
      .from('hall_closed_dates')
      .select('id')
      .eq('hall_id', editValues.hall_id)
      .eq('closed_date', editValues.event_date)
      .limit(1);

    if (closedError) {
      return 'Could not verify closed dates.';
    }

    if ((closedData || []).length > 0) {
      return 'This date is closed for the selected hall.';
    }

    const sections = editSections.length > 0
      ? editSections
      : await fetchHallSections(editValues.hall_id);
    const hasMultipleSections = sections.length > 1;

    const { data: existingBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, section_id, event_start_time, event_end_time')
      .eq('hall_id', editValues.hall_id)
      .eq('event_date', editValues.event_date)
      .eq('status', 'confirmed')
      .neq('id', selectedBooking.id);

    if (bookingsError) {
      return 'Could not verify booking conflicts.';
    }

    const conflicts = (existingBookings || []).filter((booking) =>
      timesOverlap(booking.event_start_time, booking.event_end_time, newStart, newEnd)
    );

    if (!hasMultipleSections) {
      if (conflicts.length > 0) {
        return 'This time slot is already booked.';
      }
      return null;
    }

    if (!editValues.section_id) {
      if (conflicts.length > 0) {
        return 'Select a section. This time slot has existing bookings.';
      }
      return null;
    }

    const hasSectionConflict = conflicts.some(
      (booking) =>
        !booking.section_id || booking.section_id === editValues.section_id
    );

    if (hasSectionConflict) {
      return 'The selected section is already booked for this time slot.';
    }

    return null;
  };

  useEffect(() => {
    if (!isEditing) {
      setEditConflictMessage(null);
      return;
    }

    let isActive = true;
    const timer = setTimeout(async () => {
      setIsCheckingAvailability(true);
      const message = await checkEditAvailability();
      if (isActive) {
        setEditConflictMessage(message);
        setIsCheckingAvailability(false);
      }
    }, 350);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [
    isEditing,
    editValues.hall_id,
    editValues.event_date,
    editValues.time_slot,
    editValues.event_start_time,
    editValues.event_end_time,
    editValues.section_id,
    editSections,
    selectedBooking?.id,
  ]);

  const parsedViewRequests = useMemo(() => {
    if (!selectedBooking) return null;
    return parseSpecialRequests(selectedBooking.special_requests);
  }, [selectedBooking]);

  const fetchHallSections = async (hallId: string) => {
    if (!hallId) {
      setEditSections([]);
      return [];
    }

    const { data, error } = await supabase
      .from('hall_sections')
      .select('id, name, hall_id')
      .eq('hall_id', hallId)
      .eq('is_active', true)
      .order('display_order');

    if (error) {
      console.error('Error fetching hall sections:', error);
      setEditSections([]);
      return [];
    }

    const sections = (data || []).map((section) => ({
      id: String(section.id || ''),
      name: String(section.name || 'Section'),
      hall_id: String(section.hall_id || ''),
    })).filter((section) => section.id);
    setEditSections(sections);
    return sections;
  };

  useEffect(() => {
    if (!isAdmin || !isDetailDialogOpen) return;
    fetchHallSections(editValues.hall_id);
  }, [isAdmin, isDetailDialogOpen, editValues.hall_id]);

  const handleEditSave = async () => {
    if (!selectedBooking) return;

    const expectedGuestsValue = editValues.expected_guests.trim()
      ? Number.parseInt(editValues.expected_guests, 10)
      : null;
    const specialRequests = buildSpecialRequests();
    const selectedTimeSlot = timeSlots.find((slot) => slot.id === editValues.time_slot);
    const startTime = selectedTimeSlot?.start || editValues.event_start_time.trim() || null;
    const endTime = selectedTimeSlot?.end || editValues.event_end_time.trim() || null;
    const hallOptions = allHalls.length > 0 ? allHalls : halls;
    const selectedHallName = hallOptions.find((hall) => hall.id === editValues.hall_id)?.name;
    const selectedSectionName = editSections.find((section) => section.id === editValues.section_id)?.name || null;

    if (['confirmed', 'completed'].includes(editValues.status)) {
      const availabilityError = await checkEditAvailability();
      if (availabilityError) {
        toast({
          variant: 'destructive',
          title: 'Booking Conflict',
          description: availabilityError,
        });
        return;
      }
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          customer_name: editValues.customer_name.trim(),
          customer_phone: editValues.customer_phone.trim(),
          customer_email: editValues.customer_email.trim() || null,
          customer_address: editValues.customer_address.trim() || null,
          event_type: editValues.event_type.trim(),
          event_date: editValues.event_date,
          event_start_time: startTime,
          event_end_time: endTime,
          expected_guests: Number.isNaN(expectedGuestsValue) ? null : expectedGuestsValue,
          special_requests: specialRequests || null,
          hall_id: editValues.hall_id,
          section_id: editValues.section_id || null,
          status: editValues.status,
          reference_number: editValues.reference_number.trim() || null,
          internal_notes: editValues.internal_notes.trim() || null,
          is_manual_booking: editValues.is_manual_booking,
        })
        .eq('id', selectedBooking.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Booking details updated successfully',
      });

      const updatedBooking = {
        ...selectedBooking,
        customer_name: editValues.customer_name.trim(),
        customer_phone: editValues.customer_phone.trim(),
        customer_email: editValues.customer_email.trim() || null,
        customer_address: editValues.customer_address.trim() || null,
        event_type: editValues.event_type.trim(),
        event_date: editValues.event_date,
        event_start_time: startTime,
        event_end_time: endTime,
        expected_guests: Number.isNaN(expectedGuestsValue) ? null : expectedGuestsValue,
        special_requests: specialRequests || null,
        hall_id: editValues.hall_id,
        section_id: editValues.section_id || null,
        status: editValues.status,
        reference_number: editValues.reference_number.trim() || null,
        internal_notes: editValues.internal_notes.trim() || null,
        is_manual_booking: editValues.is_manual_booking,
        halls: selectedHallName ? { name: selectedHallName } : selectedBooking.halls,
        hall_sections: selectedSectionName ? { name: selectedSectionName } : null,
      };

      setSelectedBooking(updatedBooking);
      setInternalNotes(updatedBooking.internal_notes || '');
      setBookings((prev) => prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)));
      setIsEditing(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Bookings">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Bookings Management">
      <div className="space-y-6">
        {/* Header with Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex-1">
            <p className="text-muted-foreground">
              {isHallManager ? 'Manage bookings for your hall' : 'View and manage all bookings'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, ref..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>
            
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {isHallManager && halls.length > 0 && (
              <Select value={hallFilter} onValueChange={setHallFilter}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="Filter by hall" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Halls</SelectItem>
                  {halls.map((hall) => (
                    <SelectItem key={hall.id} value={hall.id}>
                      {hall.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Export Button */}
            <Button variant="outline" onClick={exportToCSV} disabled={totalCount === 0 || isExporting}>
              {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        <Card className="card-traditional">
          <CardHeader>
            <CardTitle className="font-serif flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                All Bookings
              </div>
              <span className="text-sm font-normal text-muted-foreground">
                {totalCount} {totalCount === 1 ? 'booking' : 'bookings'}
                {debouncedSearch && ` matching "${debouncedSearch}"`}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Hall</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Advance</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <span className="font-mono text-sm text-primary">
                          {booking.reference_number || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{booking.customer_phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span>{booking.halls?.name || 'N/A'}</span>
                          {booking.hall_sections?.name && (
                            <p className="text-xs text-muted-foreground">{booking.hall_sections.name}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{booking.event_type}</TableCell>
                      <TableCell>{format(new Date(booking.event_date), 'PPP')}</TableCell>
                      <TableCell>{getStatusBadge(booking)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={cn('capitalize', paymentColors[getPaymentStatus(booking)] || '')}>
                            {getPaymentStatus(booking).replace('_', ' ')}
                          </Badge>
                          {getPaymentStatus(booking) === 'paid' && (
                            <p className="text-xs text-muted-foreground">
                              LKR {booking.advance_paid_amount?.toLocaleString() || '0'}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {booking.is_manual_booking ? (
                          <Badge variant="outline">Manual</Badge>
                        ) : (
                          <Badge variant="secondary">Online</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDetail(booking)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {booking.status === 'new' && isHallManager && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAcknowledge(booking.id)}
                            >
                              <Clock className="w-4 h-4 mr-1" />
                              Acknowledge
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {bookings.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        {debouncedSearch ? `No bookings found matching "${debouncedSearch}"` : 'No bookings found'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto pr-14">
            <DialogHeader>
              <div className="flex items-center justify-between gap-3">
                <DialogTitle className="flex items-center gap-2">
                  Booking Details
                  {selectedBooking?.reference_number && (
                    <span className="font-mono text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                      {selectedBooking.reference_number}
                    </span>
                  )}
                </DialogTitle>
                {isAdmin && !isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit Details
                  </Button>
                )}
              </div>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Name</p>
                    {isEditing ? (
                      <Input
                        value={editValues.customer_name}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, customer_name: e.target.value }))}
                      />
                    ) : (
                      <p className="font-medium">{selectedBooking.customer_name}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    {isEditing ? (
                      <Input
                        value={editValues.customer_phone}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, customer_phone: e.target.value }))}
                      />
                    ) : (
                      <p className="font-medium">{selectedBooking.customer_phone}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editValues.customer_email}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, customer_email: e.target.value }))}
                      />
                    ) : (
                      <p className="font-medium">{selectedBooking.customer_email || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Address</p>
                    {isEditing ? (
                      <Input
                        value={editValues.customer_address}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, customer_address: e.target.value }))}
                      />
                    ) : (
                      <p className="font-medium">{selectedBooking.customer_address || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reference Number</p>
                    {isEditing ? (
                      <Input
                        value={editValues.reference_number}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, reference_number: e.target.value }))}
                      />
                    ) : (
                      <p className="font-medium">{selectedBooking.reference_number || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hall</p>
                    {isEditing ? (
                      <Select
                        value={editValues.hall_id}
                        onValueChange={(value) => {
                          setEditValues((prev) => ({ ...prev, hall_id: value, section_id: '' }));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select hall" />
                        </SelectTrigger>
                        <SelectContent>
                          {(allHalls.length > 0 ? allHalls : halls).map((hall) => (
                            <SelectItem key={hall.id} value={hall.id}>
                              {hall.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="font-medium">{selectedBooking.halls?.name}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Section</p>
                    {isEditing ? (
                      <Select
                        value={editValues.section_id || 'none'}
                        onValueChange={(value) =>
                          setEditValues((prev) => ({ ...prev, section_id: value === 'none' ? '' : value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Section</SelectItem>
                          {editSections.map((section) => (
                            <SelectItem key={section.id} value={section.id}>
                              {section.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="font-medium">{selectedBooking.hall_sections?.name || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Event Type</p>
                    {isEditing ? (
                      <Select
                        value={editValues.event_type}
                        onValueChange={(value) => setEditValues((prev) => ({ ...prev, event_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypeOptionsForEdit.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="font-medium">{selectedBooking.event_type}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Event Date</p>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editValues.event_date}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, event_date: e.target.value }))}
                      />
                    ) : (
                      <p className="font-medium">{format(new Date(selectedBooking.event_date), 'PPP')}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time Slot</p>
                    {isEditing ? (
                      <Select
                        value={editValues.time_slot}
                        onValueChange={(value) => {
                          const selectedSlot = timeSlots.find((slot) => slot.id === value);
                          setEditValues((prev) => ({
                            ...prev,
                            time_slot: value,
                            event_start_time: selectedSlot?.start || prev.event_start_time,
                            event_end_time: selectedSlot?.end || prev.event_end_time,
                          }));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot.id} value={slot.id}>
                              {slot.label}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="font-medium">
                        {selectedBooking.event_start_time && selectedBooking.event_end_time
                          ? `${selectedBooking.event_start_time} - ${selectedBooking.event_end_time}`
                          : 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Guests</p>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editValues.expected_guests}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, expected_guests: e.target.value }))}
                      />
                    ) : (
                      <p className="font-medium">{selectedBooking.expected_guests || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    {isEditing ? (
                      <Select
                        value={editValues.status}
                        onValueChange={(value) =>
                          setEditValues((prev) => ({ ...prev, status: value as Booking['status'] }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="acknowledged">Acknowledged</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      getStatusBadge(selectedBooking)
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Advance Payment</p>
                    <div className="space-y-1">
                      <Badge className={cn('capitalize', paymentColors[getPaymentStatus(selectedBooking)] || '')}>
                        {getPaymentStatus(selectedBooking).replace('_', ' ')}
                      </Badge>
                      {getPaymentStatus(selectedBooking) === 'paid' && (
                        <p className="font-medium">
                          LKR {selectedBooking.advance_paid_amount?.toLocaleString() || '0'}
                        </p>
                      )}
                    </div>
                  </div>
                  {selectedBooking.payment_paid_at && (
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Paid At</p>
                      <p className="font-medium">{format(new Date(selectedBooking.payment_paid_at), 'PPP p')}</p>
                    </div>
                  )}
                  {selectedBooking.payment_reference && (
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Reference</p>
                      <p className="font-medium">{selectedBooking.payment_reference}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{format(new Date(selectedBooking.created_at), 'PPP p')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Booking Type</p>
                    {isEditing ? (
                      <Select
                        value={editValues.is_manual_booking ? 'manual' : 'online'}
                        onValueChange={(value) =>
                          setEditValues((prev) => ({ ...prev, is_manual_booking: value === 'manual' }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select booking type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="font-medium">{selectedBooking.is_manual_booking ? 'Manual' : 'Online'}</p>
                    )}
                  </div>
                </div>

                {isEditing && editValues.time_slot === 'custom' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Custom Start Time</p>
                      <Input
                        type="time"
                        value={editValues.event_start_time}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, event_start_time: e.target.value }))}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Custom End Time</p>
                      <Input
                        type="time"
                        value={editValues.event_end_time}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, event_end_time: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {isEditing && (editConflictMessage || isCheckingAvailability) && (
                  <div className="flex items-center gap-2 p-3 rounded-lg border text-sm">
                    {editConflictMessage ? (
                      <>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <span className="text-destructive">{editConflictMessage}</span>
                      </>
                    ) : (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        <span className="text-muted-foreground">Checking availability...</span>
                      </>
                    )}
                  </div>
                )}

                {isEditing && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Menu Selection</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Meal Type</p>
                        <Select
                          value={editValues.menu_section}
                          onValueChange={(value) =>
                            setEditValues((prev) => ({
                              ...prev,
                              menu_section: value,
                              menu_variant: '',
                              meal_type: '',
                              menu_package: '',
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select meal type" />
                          </SelectTrigger>
                          <SelectContent>
                            {menuSections.map((section) => (
                              <SelectItem key={section.id} value={section.id}>
                                {section.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Variant</p>
                        <Select
                          value={editValues.menu_variant}
                          onValueChange={(value) =>
                            setEditValues((prev) => ({
                              ...prev,
                              menu_variant: value,
                              meal_type: deriveMealType(prev.menu_section, value),
                              menu_package: '',
                            }))
                          }
                          disabled={!editValues.menu_section}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select variant" />
                          </SelectTrigger>
                          <SelectContent>
                            {menuVariants
                              .filter((variant) =>
                                ['pubert', 'dinner', 'wedding'].includes(editValues.menu_section)
                                  ? true
                                  : variant.id !== 'special'
                              )
                              .map((variant) => (
                                <SelectItem key={variant.id} value={variant.id}>
                                  {variant.label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {editValues.meal_type && menus[editValues.meal_type as keyof typeof menus] && (
                      <div>
                        <p className="text-sm text-muted-foreground">Menu Package</p>
                        <Select
                          value={editValues.menu_package}
                          onValueChange={(value) =>
                            setEditValues((prev) => ({
                              ...prev,
                              menu_package: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select package" />
                          </SelectTrigger>
                          <SelectContent>
                            {menus[editValues.meal_type as keyof typeof menus]?.map((menu: any) => (
                              <SelectItem key={menu.id} value={menu.id}>
                                {menu.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-muted-foreground">Menu Notes</p>
                      <Textarea
                        value={editValues.menu_notes}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, menu_notes: e.target.value }))}
                        rows={2}
                      />
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Services</h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {addOnServices.map((service) => {
                        const isSelected = editValues.services.includes(service.id);
                        return (
                          <label
                            key={service.id}
                            className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all"
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  services: prev.services.includes(service.id)
                                    ? prev.services.filter((id) => id !== service.id)
                                    : [...prev.services, service.id],
                                }))
                              }
                              className="h-4 w-4"
                            />
                            <span className="text-foreground text-sm">{service.label}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Service Notes</p>
                      <Textarea
                        value={editValues.service_notes}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, service_notes: e.target.value }))}
                        rows={2}
                      />
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Message</p>
                      <Textarea
                        value={editValues.message}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, message: e.target.value }))}
                        rows={2}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Other Notes</p>
                      <Textarea
                        value={editValues.other_notes}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, other_notes: e.target.value }))}
                        rows={2}
                      />
                    </div>
                  </div>
                )}

                {!isEditing && parsedViewRequests && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Menu & Services</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Meal Type</p>
                        <p className="font-medium">{parsedViewRequests.meal_type || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Menu Package</p>
                        <p className="font-medium">
                          {(() => {
                            if (!parsedViewRequests.meal_type || !parsedViewRequests.menu_package) return 'N/A';
                            const menuList = menus[parsedViewRequests.meal_type as keyof typeof menus] || [];
                            const selectedMenu = menuList.find((menu: any) => menu.id === parsedViewRequests.menu_package);
                            return selectedMenu?.name || 'N/A';
                          })()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Menu Notes</p>
                        <p className="font-medium">{parsedViewRequests.menu_notes || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Services</p>
                        <p className="font-medium">
                          {parsedViewRequests.services.length > 0
                            ? parsedViewRequests.services
                                .map((id) => addOnServices.find((service) => service.id === id)?.label)
                                .filter(Boolean)
                                .join(', ')
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Service Notes</p>
                        <p className="font-medium">{parsedViewRequests.service_notes || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Message</p>
                        <p className="font-medium">{parsedViewRequests.message || 'N/A'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Other Notes</p>
                        <p className="font-medium whitespace-pre-wrap">
                          {parsedViewRequests.other_notes || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Special Requests</p>
                  {isEditing ? (
                    <Textarea
                      value={buildSpecialRequests()}
                      readOnly
                      rows={3}
                      className="mt-1"
                    />
                  ) : (
                    <p className="bg-muted p-3 rounded mt-1 whitespace-pre-wrap">
                      {parsedViewRequests?.other_notes || 'N/A'}
                    </p>
                  )}
                </div>

                {(isHallManager || isAdmin) && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Internal Notes</p>
                    {isEditing ? (
                      <Textarea
                        value={editValues.internal_notes}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, internal_notes: e.target.value }))}
                        placeholder="Add internal notes..."
                        rows={3}
                      />
                    ) : isHallManager && !isAdmin ? (
                      <>
                        <Textarea
                          value={internalNotes}
                          onChange={(e) => setInternalNotes(e.target.value)}
                          placeholder="Add internal notes..."
                          rows={3}
                        />
                        <Button variant="outline" size="sm" className="mt-2" onClick={handleSaveNotes}>
                          Save Notes
                        </Button>
                      </>
                    ) : (
                      <p className="bg-muted p-3 rounded mt-1 whitespace-pre-wrap">
                        {selectedBooking.internal_notes || 'N/A'}
                      </p>
                    )}
                  </div>
                )}

                {isEditing && (
                  <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleEditSave} disabled={!!editConflictMessage || isCheckingAvailability}>
                      Save Changes
                    </Button>
                  </DialogFooter>
                )}


                {isHallManager && ['new', 'acknowledged', 'confirmed'].includes(selectedBooking.status) && !isEditing && (
                  <DialogFooter className="gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => openCancelDialog(selectedBooking)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Booking
                    </Button>
                    {selectedBooking.status === 'acknowledged' && (
                      <Button onClick={() => handleConfirm(selectedBooking.id)}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirm Booking
                      </Button>
                    )}
                  </DialogFooter>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Cancellation Dialog */}
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Booking</DialogTitle>
              <DialogDescription>
                This will cancel the booking and notify the customer via email.
              </DialogDescription>
            </DialogHeader>
            {bookingToCancel && (
              <div className="space-y-4 py-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">{bookingToCancel.customer_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {bookingToCancel.event_type} • {format(new Date(bookingToCancel.event_date), 'PPP')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {bookingToCancel.halls?.name} • {bookingToCancel.reference_number}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancellation-reason">Reason for Cancellation *</Label>
                  <Textarea
                    id="cancellation-reason"
                    placeholder="Please provide a reason for cancellation..."
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)} disabled={isCancelling}>
                Keep Booking
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancel}
                disabled={!cancellationReason.trim() || isCancelling}
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Confirm Cancellation
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default BookingsManagement;
