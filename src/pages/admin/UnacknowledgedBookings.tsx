import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Clock } from 'lucide-react';
import { format, differenceInHours } from 'date-fns';

interface Booking {
  id: string;
  hall_id: string;
  customer_name: string;
  customer_phone: string;
  event_type: string;
  event_date: string;
  created_at: string;
  halls?: { name: string };
  hall_managers?: { profiles?: { full_name: string; email: string } }[];
}

const UnacknowledgedBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnacknowledged = async () => {
      try {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const { data, error } = await supabase
          .from('bookings')
          .select('*, halls(name, hall_managers(profiles:user_id(full_name, email)))')
          .eq('status', 'new')
          .is('acknowledged_at', null)
          .lt('created_at', twentyFourHoursAgo.toISOString())
          .order('created_at', { ascending: true });

        if (error) throw error;
        setBookings(data || []);
      } catch (error) {
        console.error('Error fetching unacknowledged bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnacknowledged();
  }, []);

  const getHoursOverdue = (createdAt: string) => {
    const hours = differenceInHours(new Date(), new Date(createdAt));
    return hours - 24; // Hours past the 24-hour deadline
  };

  if (loading) {
    return (
      <AdminLayout title="Unacknowledged Bookings">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Unacknowledged Bookings (>24 Hours)">
      <div className="space-y-6">
        {bookings.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-destructive" />
            <div>
              <p className="font-medium text-destructive">
                {bookings.length} booking(s) not acknowledged within 24 hours
              </p>
              <p className="text-sm text-muted-foreground">
                These bookings require immediate attention from the assigned hall managers.
              </p>
            </div>
          </div>
        )}

        <Card className="card-traditional">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Overdue Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Hall</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Event Date</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Hours Overdue</TableHead>
                  <TableHead>Manager</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => {
                  const hoursOverdue = getHoursOverdue(booking.created_at);
                  const manager = (booking.halls as any)?.hall_managers?.[0]?.profiles;

                  return (
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
                      <TableCell>{format(new Date(booking.created_at), 'PPP p')}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">
                          +{hoursOverdue}h overdue
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {manager ? (
                          <div>
                            <p className="font-medium">{manager.full_name}</p>
                            <p className="text-sm text-muted-foreground">{manager.email}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No manager assigned</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {bookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Clock className="w-8 h-8" />
                        <p>No unacknowledged bookings</p>
                        <p className="text-sm">All bookings are being handled within the 24-hour window</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default UnacknowledgedBookings;
