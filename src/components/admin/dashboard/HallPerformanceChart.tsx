import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Booking {
  hall_id: string;
  status: string;
  created_at?: string;
  event_date?: string | null;
}

interface Hall {
  id: string;
  name: string;
}

interface HallPerformanceChartProps {
  bookings: Booking[];
  halls: Hall[];
}

const HallPerformanceChart = ({ bookings, halls }: HallPerformanceChartProps) => {
  const [range, setRange] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredBookings = useMemo(() => {
    if (range === 'all') return bookings;

    const now = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    if (range === 'custom') {
      start = startDate ? new Date(startDate) : null;
      end = endDate ? new Date(endDate) : null;
    } else {
      const days = Number(range);
      if (!Number.isNaN(days)) {
        start = new Date(now);
        start.setDate(now.getDate() - days);
        end = now;
      }
    }

    if (!start && !end) return bookings;

    return bookings.filter(booking => {
      const dateValue = booking.event_date || booking.created_at;
      if (!dateValue) return false;
      const bookingDate = new Date(dateValue);
      if (Number.isNaN(bookingDate.getTime())) return false;

      if (start) {
        const startAt = new Date(start);
        startAt.setHours(0, 0, 0, 0);
        if (bookingDate < startAt) return false;
      }

      if (end) {
        const endAt = new Date(end);
        endAt.setHours(23, 59, 59, 999);
        if (bookingDate > endAt) return false;
      }

      return true;
    });
  }, [bookings, range, startDate, endDate]);

  const chartData = useMemo(() => {
    const hallBookings: Record<string, { total: number; confirmed: number }> = {};
    
    halls.forEach(hall => {
      hallBookings[hall.id] = { total: 0, confirmed: 0 };
    });
    
    filteredBookings.forEach(booking => {
      if (hallBookings[booking.hall_id]) {
        hallBookings[booking.hall_id].total++;
        if (booking.status === 'confirmed' || booking.status === 'completed') {
          hallBookings[booking.hall_id].confirmed++;
        }
      }
    });
    
    return halls.map(hall => ({
      name: hall.name.length > 15 ? hall.name.substring(0, 15) + '...' : hall.name,
      fullName: hall.name,
      bookings: hallBookings[hall.id]?.total || 0,
      confirmed: hallBookings[hall.id]?.confirmed || 0,
    })).sort((a, b) => b.bookings - a.bookings);
  }, [filteredBookings, halls]);

  return (
    <Card className="card-traditional">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="font-serif">Hall Performance</CardTitle>
            <CardDescription>Total bookings by hall</CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="h-9 w-full sm:w-[180px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="180">Last 6 months</SelectItem>
                <SelectItem value="365">Last 12 months</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
            {range === 'custom' && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  type="date"
                  value={startDate}
                  onChange={event => setStartDate(event.target.value)}
                  className="h-9 w-full sm:w-[140px]"
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={event => setEndDate(event.target.value)}
                  className="h-9 w-full sm:w-[140px]"
                />
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                type="number"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground"
              />
              <YAxis 
                type="category"
                dataKey="name"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground"
                width={80}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value, name) => [value, name === 'bookings' ? 'Total Bookings' : 'Confirmed']}
                labelFormatter={(label, payload) => payload[0]?.payload?.fullName || label}
              />
              <Bar 
                dataKey="bookings" 
                fill="hsl(var(--primary))" 
                radius={[0, 4, 4, 0]}
                name="Total Bookings"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HallPerformanceChart;
