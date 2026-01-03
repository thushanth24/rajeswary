import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Booking {
  hall_id: string;
  status: string;
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
  const chartData = useMemo(() => {
    const hallBookings: Record<string, { total: number; confirmed: number }> = {};
    
    halls.forEach(hall => {
      hallBookings[hall.id] = { total: 0, confirmed: 0 };
    });
    
    bookings.forEach(booking => {
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
  }, [bookings, halls]);

  return (
    <Card className="card-traditional">
      <CardHeader>
        <CardTitle className="font-serif">Hall Performance</CardTitle>
        <CardDescription>Total bookings by hall</CardDescription>
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
