import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface Booking {
  created_at: string;
  event_date: string;
  status: string;
}

interface MonthlyBookingsChartProps {
  bookings: Booking[];
  months?: number;
}

const MonthlyBookingsChart = ({ bookings, months = 6 }: MonthlyBookingsChartProps) => {
  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const monthBookings = bookings.filter(b => {
        const eventDate = new Date(b.event_date);
        return isWithinInterval(eventDate, { start: monthStart, end: monthEnd });
      });
      
      data.push({
        month: format(monthDate, 'MMM yyyy'),
        total: monthBookings.length,
        confirmed: monthBookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length,
        cancelled: monthBookings.filter(b => b.status === 'cancelled').length,
      });
    }
    
    return data;
  }, [bookings, months]);

  return (
    <Card className="card-traditional">
      <CardHeader>
        <CardTitle className="font-serif">Monthly Events</CardTitle>
        <CardDescription>Events scheduled per month (by event date)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground"
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar 
                dataKey="confirmed" 
                name="Confirmed/Completed"
                fill="hsl(142, 76%, 36%)" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="cancelled" 
                name="Cancelled"
                fill="hsl(var(--destructive))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyBookingsChart;
