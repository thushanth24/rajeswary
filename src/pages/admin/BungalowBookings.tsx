import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  CalendarIcon,
  Plus,
  Search,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Home,
} from 'lucide-react';

interface BungalowBooking {
  id: string;
  full_name: string;
  mobile_number: string;
  email: string | null;
  address: string | null;
  id_proof_type: string | null;
  room_type: string;
  ac_type: string;
  package_type: string;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children: number;
  purpose: string | null;
  special_requests: string | null;
  total_amount: number | null;
  payment_status: string | null;
  paid_amount: number | null;
  payment_paid_at: string | null;
  payment_provider: string | null;
  payment_reference: string | null;
  status: string;
  created_at: string;
}

const roomTypes = [
  { value: 'Double Room', label: 'Double Room' },
  { value: 'Triple Room', label: 'Triple Room' },
  { value: 'Family Room', label: 'Family Room' },
];

const acTypes = [
  { value: 'AC', label: 'A/C' },
  { value: 'Non-AC', label: 'Non A/C' },
];

const packageTypes = [
  { value: 'room_only', label: 'Room Only' },
  { value: 'bb_with_room', label: 'BB with Room' },
  { value: 'full_board', label: 'Full Board' },
];

const idProofTypes = [
  { value: 'nic', label: 'National Identity Card (NIC)' },
  { value: 'passport', label: 'Passport' },
  { value: 'driving_licence', label: 'Driving Licence' },
  { value: 'business_registration', label: 'Business Registration Certificate' },
];

const getIdProofLabel = (value: string | null) =>
  idProofTypes.find(type => type.value === value)?.label || value?.replace(/_/g, ' ') || '-';

const pricing: Record<string, Record<string, Record<string, number>>> = {
  'Double Room': {
    'AC': { room_only: 6000, bb_with_room: 8000, full_board: 12000 },
    'Non-AC': { room_only: 5000, bb_with_room: 8000, full_board: 12000 },
  },
  'Triple Room': {
    'AC': { room_only: 9000, bb_with_room: 12000, full_board: 18000 },
    'Non-AC': { room_only: 8000, bb_with_room: 12000, full_board: 18000 },
  },
  'Family Room': {
    'AC': { room_only: 12000, bb_with_room: 16000, full_board: 24000 },
    'Non-AC': { room_only: 10000, bb_with_room: 16000, full_board: 24000 },
  },
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
  pending_payment: 'bg-amber-500/20 text-amber-700 border-amber-500/30',
  confirmed: 'bg-green-500/20 text-green-700 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-700 border-red-500/30',
  completed: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
  checked_in: 'bg-purple-500/20 text-purple-700 border-purple-500/30',
};

const paymentColors: Record<string, string> = {
  unpaid: 'bg-muted text-muted-foreground border-border',
  pending: 'bg-amber-500/20 text-amber-700 border-amber-500/30',
  paid: 'bg-green-500/20 text-green-700 border-green-500/30',
  failed: 'bg-red-500/20 text-red-700 border-red-500/30',
};

const getPaymentStatus = (booking: BungalowBooking) => booking.payment_status || 'unpaid';

const BungalowBookingsManagement = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BungalowBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BungalowBooking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New booking form state
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    email: '',
    address: '',
    id_proof_type: '',
    room_type: 'Double Room',
    ac_type: 'AC',
    package_type: 'room_only',
    check_in_date: undefined as Date | undefined,
    check_out_date: undefined as Date | undefined,
    adults: '1',
    children: '0',
    purpose: '',
    special_requests: '',
  });

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('bungalow_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      toast({ title: 'Error', description: 'Failed to fetch bookings', variant: 'destructive' });
    } else {
      setBookings((data as unknown as BungalowBooking[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const calculateAmount = () => {
    const { room_type, ac_type, package_type } = formData;
    return pricing[room_type]?.[ac_type]?.[package_type] || 0;
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.mobile_number || !formData.check_in_date || !formData.check_out_date) {
      toast({ title: 'Missing fields', description: 'Please fill all required fields.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const amount = calculateAmount();

    const { error } = await (supabase as any).from('bungalow_bookings').insert({
      full_name: formData.full_name,
      mobile_number: formData.mobile_number,
      email: formData.email || null,
      address: formData.address || null,
      id_proof_type: formData.id_proof_type || null,
      room_type: formData.room_type,
      ac_type: formData.ac_type,
      package_type: formData.package_type,
      check_in_date: format(formData.check_in_date!, 'yyyy-MM-dd'),
      check_out_date: format(formData.check_out_date!, 'yyyy-MM-dd'),
      adults: parseInt(formData.adults),
      children: parseInt(formData.children),
      purpose: formData.purpose || null,
      special_requests: formData.special_requests || null,
      total_amount: amount,
      payment_status: 'unpaid',
      paid_amount: 0,
      status: 'confirmed',
      created_by: user?.id,
    } as any);

    setIsSubmitting(false);

    if (error) {
      console.error('Error creating booking:', error);
      toast({ title: 'Error', description: 'Failed to create booking.', variant: 'destructive' });
    } else {
      toast({ title: 'Booking Created!', description: `Booking for ${formData.full_name} confirmed.` });
      setShowNewBooking(false);
      resetForm();
      fetchBookings();
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '', mobile_number: '', email: '', address: '', id_proof_type: '',
      room_type: 'Double Room', ac_type: 'AC', package_type: 'room_only',
      check_in_date: undefined, check_out_date: undefined,
      adults: '1', children: '0', purpose: '', special_requests: '',
    });
  };

  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await (supabase as any)
      .from('bungalow_bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
    } else {
      toast({ title: 'Updated', description: `Booking status changed to ${status}.` });
      fetchBookings();
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.mobile_number.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              Bungalow Bookings
            </h1>
            <p className="text-muted-foreground text-sm">Manage room bookings and reservations</p>
          </div>
          <Button
            onClick={() => setShowNewBooking(true)}
            className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {['pending_payment', 'pending', 'confirmed', 'checked_in', 'completed', 'cancelled'].map(status => (
            <Card key={status} className="card-traditional">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {bookings.filter(b => b.status === status).length}
                </p>
                <p className="text-xs text-muted-foreground capitalize">{status.replace('_', ' ')}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending_payment">Pending Payment</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="checked_in">Checked In</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bookings Table */}
        <Card className="card-traditional">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No bookings found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.full_name}</p>
                          <p className="text-xs text-muted-foreground">{booking.mobile_number}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{booking.room_type}</p>
                        <p className="text-xs text-muted-foreground">{booking.ac_type}</p>
                      </TableCell>
                      <TableCell className="text-sm capitalize">
                        {booking.package_type.replace(/_/g, ' ')}
                      </TableCell>
                      <TableCell className="text-sm">{booking.check_in_date}</TableCell>
                      <TableCell className="text-sm">{booking.check_out_date}</TableCell>
                      <TableCell className="text-sm font-medium">
                        Rs {booking.total_amount?.toLocaleString() || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={cn('capitalize', paymentColors[getPaymentStatus(booking)] || '')}>
                            {getPaymentStatus(booking).replace('_', ' ')}
                          </Badge>
                          {getPaymentStatus(booking) === 'paid' && (
                            <p className="text-xs text-muted-foreground">
                              Rs {booking.paid_amount?.toLocaleString() || '0'}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('capitalize', statusColors[booking.status] || '')}>
                          {booking.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedBooking(booking)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {booking.status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              title="Confirm"
                            >
                              <CheckCircle className="h-4 w-4 text-primary" />
                            </Button>
                          )}
                          {booking.status === 'confirmed' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateBookingStatus(booking.id, 'checked_in')}
                              title="Check In"
                            >
                              <Home className="h-4 w-4 text-secondary" />
                            </Button>
                          )}
                          {booking.status === 'checked_in' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateBookingStatus(booking.id, 'completed')}
                              title="Complete"
                            >
                              <CheckCircle className="h-4 w-4 text-accent-foreground" />
                            </Button>
                          )}
                          {(booking.status === 'pending' || booking.status === 'pending_payment' || booking.status === 'confirmed') && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              title="Cancel"
                            >
                              <XCircle className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* New Booking Dialog */}
        <Dialog open={showNewBooking} onOpenChange={setShowNewBooking}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">New Bungalow Booking</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              {/* Guest Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Guest Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input value={formData.full_name} onChange={(e) => setFormData(p => ({ ...p, full_name: e.target.value }))} required />
                  </div>
                  <div>
                    <Label>Mobile Number *</Label>
                    <Input value={formData.mobile_number} onChange={(e) => setFormData(p => ({ ...p, mobile_number: e.target.value }))} required />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div>
                    <Label>ID Proof Type</Label>
                    <Select value={formData.id_proof_type} onValueChange={(v) => setFormData(p => ({ ...p, id_proof_type: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {idProofTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Address</Label>
                  <Textarea value={formData.address} onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))} rows={2} />
                </div>
              </div>

              {/* Room Selection */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Room Selection</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Room Type *</Label>
                    <Select value={formData.room_type} onValueChange={(v) => setFormData(p => ({ ...p, room_type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {roomTypes.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>A/C Type *</Label>
                    <Select value={formData.ac_type} onValueChange={(v) => setFormData(p => ({ ...p, ac_type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {acTypes.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Package *</Label>
                    <Select value={formData.package_type} onValueChange={(v) => setFormData(p => ({ ...p, package_type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {packageTypes.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
                  <span className="text-sm text-muted-foreground">Rate: </span>
                  <span className="text-lg font-bold text-primary">Rs {calculateAmount().toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground"> / day</span>
                </div>
              </div>

              {/* Stay Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Stay Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Check-in Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.check_in_date && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.check_in_date ? format(formData.check_in_date, 'PPP') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.check_in_date} onSelect={(d) => setFormData(p => ({ ...p, check_in_date: d }))} /></PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label>Check-out Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.check_out_date && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.check_out_date ? format(formData.check_out_date, 'PPP') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.check_out_date} onSelect={(d) => setFormData(p => ({ ...p, check_out_date: d }))} /></PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label>Adults</Label>
                    <Input type="number" min="1" value={formData.adults} onChange={(e) => setFormData(p => ({ ...p, adults: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Children</Label>
                    <Input type="number" min="0" value={formData.children} onChange={(e) => setFormData(p => ({ ...p, children: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Additional */}
              <div className="space-y-4">
                <div>
                  <Label>Purpose of Stay</Label>
                  <Input value={formData.purpose} onChange={(e) => setFormData(p => ({ ...p, purpose: e.target.value }))} placeholder="e.g. Wedding ceremony, Family visit" />
                </div>
                <div>
                  <Label>Special Requests</Label>
                  <Textarea value={formData.special_requests} onChange={(e) => setFormData(p => ({ ...p, special_requests: e.target.value }))} rows={2} />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowNewBooking(false)}>Cancel</Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
                >
                  {isSubmitting ? '⏳ Creating...' : '🪷 Create Booking'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Booking Dialog */}
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif">Booking Details</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Guest:</span> <p className="font-medium">{selectedBooking.full_name}</p></div>
                  <div><span className="text-muted-foreground">Mobile:</span> <p className="font-medium">{selectedBooking.mobile_number}</p></div>
                  <div><span className="text-muted-foreground">Email:</span> <p className="font-medium">{selectedBooking.email || '-'}</p></div>
                  <div><span className="text-muted-foreground">ID Proof:</span> <p className="font-medium">{getIdProofLabel(selectedBooking.id_proof_type)}</p></div>
                  <div><span className="text-muted-foreground">Room:</span> <p className="font-medium">{selectedBooking.room_type} ({selectedBooking.ac_type})</p></div>
                  <div><span className="text-muted-foreground">Package:</span> <p className="font-medium capitalize">{selectedBooking.package_type.replace(/_/g, ' ')}</p></div>
                  <div><span className="text-muted-foreground">Check-in:</span> <p className="font-medium">{selectedBooking.check_in_date}</p></div>
                  <div><span className="text-muted-foreground">Check-out:</span> <p className="font-medium">{selectedBooking.check_out_date}</p></div>
                  <div><span className="text-muted-foreground">Guests:</span> <p className="font-medium">{selectedBooking.adults} Adults, {selectedBooking.children} Children</p></div>
                  <div><span className="text-muted-foreground">Amount:</span> <p className="font-medium text-primary">Rs {selectedBooking.total_amount?.toLocaleString() || '-'}</p></div>
                  <div><span className="text-muted-foreground">Payment:</span> <Badge className={cn('capitalize', paymentColors[getPaymentStatus(selectedBooking)])}>{getPaymentStatus(selectedBooking).replace('_', ' ')}</Badge></div>
                  <div><span className="text-muted-foreground">Paid Amount:</span> <p className="font-medium text-primary">Rs {selectedBooking.paid_amount?.toLocaleString() || '0'}</p></div>
                  <div><span className="text-muted-foreground">Status:</span> <Badge className={cn('capitalize', statusColors[selectedBooking.status])}>{selectedBooking.status.replace('_', ' ')}</Badge></div>
                  <div><span className="text-muted-foreground">Created:</span> <p className="font-medium">{format(new Date(selectedBooking.created_at), 'PPp')}</p></div>
                  {selectedBooking.payment_paid_at && (
                    <div><span className="text-muted-foreground">Paid At:</span> <p className="font-medium">{format(new Date(selectedBooking.payment_paid_at), 'PPp')}</p></div>
                  )}
                  {selectedBooking.payment_reference && (
                    <div><span className="text-muted-foreground">Payment Ref:</span> <p className="font-medium">{selectedBooking.payment_reference}</p></div>
                  )}
                </div>
                {selectedBooking.address && (
                  <div className="text-sm"><span className="text-muted-foreground">Address:</span> <p>{selectedBooking.address}</p></div>
                )}
                {selectedBooking.purpose && (
                  <div className="text-sm"><span className="text-muted-foreground">Purpose:</span> <p>{selectedBooking.purpose}</p></div>
                )}
                {selectedBooking.special_requests && (
                  <div className="text-sm"><span className="text-muted-foreground">Special Requests:</span> <p>{selectedBooking.special_requests}</p></div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default BungalowBookingsManagement;
