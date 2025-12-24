import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Calendar, Building2, TrendingUp } from 'lucide-react';

interface ReportData {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  bookingsByHall: { hall_name: string; count: number }[];
  bookingsByMonth: { month: string; count: number }[];
  avgAcknowledgementTime: number;
}

const Reports = () => {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // Fetch all bookings with hall info
        const { data: bookings, error } = await supabase
          .from('bookings')
          .select('*, halls(name)');

        if (error) throw error;

        const totalBookings = bookings?.length || 0;
        const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;
        const cancelledBookings = bookings?.filter(b => b.status === 'cancelled').length || 0;

        // Bookings by hall
        const hallCounts: Record<string, number> = {};
        bookings?.forEach(b => {
          const hallName = b.halls?.name || 'Unknown';
          hallCounts[hallName] = (hallCounts[hallName] || 0) + 1;
        });
        const bookingsByHall = Object.entries(hallCounts).map(([hall_name, count]) => ({
          hall_name,
          count,
        }));

        // Bookings by month (last 6 months)
        const monthCounts: Record<string, number> = {};
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          monthCounts[key] = 0;
        }
        bookings?.forEach(b => {
          const d = new Date(b.created_at);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          if (monthCounts[key] !== undefined) {
            monthCounts[key]++;
          }
        });
        const bookingsByMonth = Object.entries(monthCounts).map(([month, count]) => ({
          month,
          count,
        }));

        // Average acknowledgement time
        const acknowledgedBookings = bookings?.filter(b => b.acknowledged_at) || [];
        let totalAckTime = 0;
        acknowledgedBookings.forEach(b => {
          const created = new Date(b.created_at).getTime();
          const acknowledged = new Date(b.acknowledged_at!).getTime();
          totalAckTime += (acknowledged - created) / (1000 * 60 * 60); // hours
        });
        const avgAcknowledgementTime = acknowledgedBookings.length > 0
          ? totalAckTime / acknowledgedBookings.length
          : 0;

        setData({
          totalBookings,
          confirmedBookings,
          cancelledBookings,
          bookingsByHall,
          bookingsByMonth,
          avgAcknowledgementTime,
        });
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Reports">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Reports & Analytics">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-traditional">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-3xl font-bold">{data?.totalBookings || 0}</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-traditional">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                  <p className="text-3xl font-bold text-green-600">{data?.confirmedBookings || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-traditional">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cancelled</p>
                  <p className="text-3xl font-bold text-destructive">{data?.cancelledBookings || 0}</p>
                </div>
                <Calendar className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-traditional">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Ack Time</p>
                  <p className="text-3xl font-bold">{data?.avgAcknowledgementTime.toFixed(1) || 0}h</p>
                </div>
                <BarChart3 className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings by Hall */}
        <Card className="card-traditional">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Bookings by Hall
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.bookingsByHall.map((item) => (
                <div key={item.hall_name} className="flex items-center gap-4">
                  <div className="w-32 font-medium truncate">{item.hall_name}</div>
                  <div className="flex-1">
                    <div className="h-6 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${Math.min((item.count / (data?.totalBookings || 1)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-right font-bold">{item.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bookings by Month */}
        <Card className="card-traditional">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Bookings Trend (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4 h-40">
              {data?.bookingsByMonth.map((item) => {
                const maxCount = Math.max(...(data?.bookingsByMonth.map(m => m.count) || [1]));
                const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-secondary rounded-t transition-all"
                      style={{ height: `${height}%`, minHeight: item.count > 0 ? '10%' : '2%' }}
                    />
                    <div className="text-xs text-muted-foreground">{item.month}</div>
                    <div className="text-sm font-medium">{item.count}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Reports;
