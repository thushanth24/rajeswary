import { useEffect, useState, useCallback } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar, CheckCircle, XCircle, Clock, Eye, AlertTriangle, Search, Download, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { format, differenceInHours, isPast, startOfDay } from 'date-fns';

interface Booking {
  id: string;
  hall_id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  event_type: string;
  event_date: string;
  status: 'new' | 'acknowledged' | 'confirmed' | 'cancelled' | 'completed';
  is_manual_booking: boolean;
  acknowledged_at: string | null;
  created_at: string;
  special_requests: string | null;
  internal_notes: string | null;
  reference_number: string | null;
  expected_guests: number | null;
  halls?: { name: string };
}

const ITEMS_PER_PAGE = 10;

const BookingsManagement = () => {
  const { user, isHallManager } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

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
  }, [statusFilter]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      // Build the query with filters
      let query = supabase
        .from('bookings')
        .select('*, halls(name)', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any);
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
  }, [currentPage, statusFilter, debouncedSearch, toast]);

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
        .select('*, halls(name)')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any);
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
    setSelectedBooking(booking);
    setInternalNotes(booking.internal_notes || '');
    setIsDetailDialogOpen(true);
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
                      <TableCell>{booking.halls?.name || 'N/A'}</TableCell>
                      <TableCell>{booking.event_type}</TableCell>
                      <TableCell>{format(new Date(booking.event_date), 'PPP')}</TableCell>
                      <TableCell>{getStatusBadge(booking)}</TableCell>
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
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Booking Details
                {selectedBooking?.reference_number && (
                  <span className="font-mono text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                    {selectedBooking.reference_number}
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Name</p>
                    <p className="font-medium">{selectedBooking.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedBooking.customer_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedBooking.customer_email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hall</p>
                    <p className="font-medium">{selectedBooking.halls?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Event Type</p>
                    <p className="font-medium">{selectedBooking.event_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Event Date</p>
                    <p className="font-medium">{format(new Date(selectedBooking.event_date), 'PPP')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Guests</p>
                    <p className="font-medium">{selectedBooking.expected_guests || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getStatusBadge(selectedBooking)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{format(new Date(selectedBooking.created_at), 'PPP p')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Booking Type</p>
                    <p className="font-medium">{selectedBooking.is_manual_booking ? 'Manual' : 'Online'}</p>
                  </div>
                </div>

                {selectedBooking.special_requests && (
                  <div>
                    <p className="text-sm text-muted-foreground">Special Requests</p>
                    <p className="bg-muted p-3 rounded mt-1 whitespace-pre-wrap">{selectedBooking.special_requests}</p>
                  </div>
                )}

                {isHallManager && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Internal Notes</p>
                    <Textarea
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      placeholder="Add internal notes..."
                      rows={3}
                    />
                    <Button variant="outline" size="sm" className="mt-2" onClick={handleSaveNotes}>
                      Save Notes
                    </Button>
                  </div>
                )}

                {isHallManager && ['new', 'acknowledged', 'confirmed'].includes(selectedBooking.status) && (
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
