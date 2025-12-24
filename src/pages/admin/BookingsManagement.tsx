import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar, CheckCircle, XCircle, Clock, Eye, AlertTriangle } from 'lucide-react';
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
  halls?: { name: string };
}

const BookingsManagement = () => {
  const { user, isHallManager } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchBookings = async () => {
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
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            {isHallManager ? 'Manage bookings for your hall' : 'View and manage all bookings'}
          </p>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
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
        </div>

        <Card className="card-traditional">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              All Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
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
                {bookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No bookings found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Booking Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
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
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getStatusBadge(selectedBooking)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{format(new Date(selectedBooking.created_at), 'PPP p')}</p>
                  </div>
                </div>

                {selectedBooking.special_requests && (
                  <div>
                    <p className="text-sm text-muted-foreground">Special Requests</p>
                    <p className="bg-muted p-3 rounded mt-1">{selectedBooking.special_requests}</p>
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
