import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar, CheckCircle, XCircle, Clock, Eye, AlertTriangle, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, differenceInHours } from 'date-fns';

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
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('bookings')
        .select('*, halls(name)')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  // Filter bookings by search query
  const filteredBookings = useMemo(() => {
    if (!searchQuery.trim()) return bookings;
    
    const query = searchQuery.toLowerCase();
    return bookings.filter(booking => 
      booking.customer_name.toLowerCase().includes(query) ||
      booking.customer_phone.includes(query) ||
      booking.customer_email?.toLowerCase().includes(query) ||
      booking.reference_number?.toLowerCase().includes(query) ||
      booking.halls?.name?.toLowerCase().includes(query)
    );
  }, [bookings, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBookings, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

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

  const handleCancel = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancelled_by: user?.id,
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: 'Cancelled',
        description: 'Booking has been cancelled',
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

  const exportToCSV = () => {
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

    const csvData = filteredBookings.map(booking => [
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
      description: `Exported ${filteredBookings.length} bookings to CSV`,
    });
  };

  const getStatusBadge = (booking: Booking) => {
    const hoursOld = differenceInHours(new Date(), new Date(booking.created_at));
    const isOverdue = booking.status === 'new' && !booking.acknowledged_at && hoursOld > 24;

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
        return <Badge variant="default">Completed</Badge>;
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
            <Button variant="outline" onClick={exportToCSV} disabled={filteredBookings.length === 0}>
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
                {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
                {searchQuery && ` matching "${searchQuery}"`}
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
                  {paginatedBookings.map((booking) => (
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
                  {paginatedBookings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        {searchQuery ? `No bookings found matching "${searchQuery}"` : 'No bookings found'}
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
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredBookings.length)} of {filteredBookings.length}
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

                {isHallManager && selectedBooking.status === 'acknowledged' && (
                  <DialogFooter className="gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleCancel(selectedBooking.id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Booking
                    </Button>
                    <Button onClick={() => handleConfirm(selectedBooking.id)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirm Booking
                    </Button>
                  </DialogFooter>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default BookingsManagement;
