import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Booking {
  id: string;
  reference_number: string | null;
  customer_name: string;
  event_date: string;
  event_type: string;
  status: string;
  created_at: string;
  halls?: { name: string } | null;
}

interface RecentBookingsProps {
  bookings: Booking[];
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-accent/20 text-accent-foreground border-accent',
  acknowledged: 'bg-secondary/20 text-secondary-foreground border-secondary',
  confirmed: 'bg-green-100 text-green-800 border-green-300',
  completed: 'bg-primary/20 text-primary-foreground border-primary',
  cancelled: 'bg-destructive/20 text-destructive border-destructive',
};

const RecentBookings = ({ bookings }: RecentBookingsProps) => {
  const recentBookings = bookings
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <Card className="card-traditional">
      <CardHeader>
        <CardTitle className="font-serif">Recent Bookings</CardTitle>
        <CardDescription>Latest booking requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentBookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No recent bookings</p>
          ) : (
            recentBookings.map((booking) => (
              <div 
                key={booking.id} 
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{booking.customer_name}</p>
                    <Badge variant="outline" className={STATUS_COLORS[booking.status]}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span>{booking.reference_number || 'No ref'}</span>
                    <span>•</span>
                    <span>{booking.event_type}</span>
                    <span>•</span>
                    <span>{booking.halls?.name || 'Unknown Hall'}</span>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium">{format(new Date(booking.event_date), 'MMM dd, yyyy')}</p>
                  <p className="text-muted-foreground">{format(new Date(booking.created_at), 'HH:mm')}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentBookings;
