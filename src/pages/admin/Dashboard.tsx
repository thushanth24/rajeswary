import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import {
  Building2,
  Calendar,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { subMonths, startOfMonth } from 'date-fns';
import RealTimeStats from '@/components/admin/dashboard/RealTimeStats';
import BookingTrendChart from '@/components/admin/dashboard/BookingTrendChart';
import BookingStatusChart from '@/components/admin/dashboard/BookingStatusChart';
import MonthlyBookingsChart from '@/components/admin/dashboard/MonthlyBookingsChart';
import HallPerformanceChart from '@/components/admin/dashboard/HallPerformanceChart';
import RecentBookings from '@/components/admin/dashboard/RecentBookings';

interface Booking {
  id: string;
  reference_number: string | null;
  customer_name: string;
  event_date: string;
  event_type: string;
  status: string;
  created_at: string;
  acknowledged_at: string | null;
  hall_id: string;
  halls?: { name: string } | null;
}

interface Hall {
  id: string;
  name: string;
}

const Dashboard = () => {
  const { isSuperAdmin, isAdmin, isHallManager, isBungalowManager, user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bungalowBookings, setBungalowBookings] = useState<any[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [inventoryStats, setInventoryStats] = useState({ total: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [managerHallName, setManagerHallName] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    
    try {
      if (isBungalowManager) {
        // Fetch bungalow bookings only
        const { data: bungalowData } = await (supabase as any)
          .from('bungalow_bookings')
          .select('*')
          .order('created_at', { ascending: false });
        setBungalowBookings(bungalowData || []);
      } else {
        let assignedHallIds: string[] = [];
        const shouldScopeToManagerHalls = isHallManager && !isAdmin && user?.id;

        if (shouldScopeToManagerHalls) {
          const { data: hallManagerData } = await supabase
            .from('hall_managers')
            .select('hall_id, halls(name)')
            .eq('user_id', user.id)
            .eq('is_active', true);

          assignedHallIds = (hallManagerData || []).map((row: any) => row.hall_id).filter(Boolean);

          const hallNames = (hallManagerData || [])
            .filter((row: any) => row.halls)
            .map((row: any) => row.halls.name)
            .join(', ');
          setManagerHallName(hallNames || null);

          if (assignedHallIds.length === 0) {
            setBookings([]);
            setHalls([]);
            setInventoryStats({ total: 0, lowStock: 0 });
            setLastUpdated(new Date());
            return;
          }
        }

        // Fetch all bookings with hall info
        let bookingsQuery = supabase
          .from('bookings')
          .select('id, reference_number, customer_name, event_date, event_type, status, created_at, acknowledged_at, hall_id, halls(name)')
          .order('created_at', { ascending: false });

        if (assignedHallIds.length > 0) {
          bookingsQuery = bookingsQuery.in('hall_id', assignedHallIds);
        }

        const { data: bookingsData } = await bookingsQuery;

        // Fetch halls
        let hallsQuery = supabase
          .from('halls')
          .select('id, name');

        if (assignedHallIds.length > 0) {
          hallsQuery = hallsQuery.in('id', assignedHallIds);
        }

        const { data: hallsData } = await hallsQuery;

        // Fetch inventory
        let inventoryQuery = supabase
          .from('inventory')
          .select('quantity');

        if (assignedHallIds.length > 0) {
          inventoryQuery = inventoryQuery.in('hall_id', assignedHallIds);
        }

        const { data: inventoryData } = await inventoryQuery;

        setBookings(bookingsData || []);
        setHalls(hallsData || []);
        setInventoryStats({
          total: inventoryData?.length || 0,
          lowStock: inventoryData?.filter(i => i.quantity < 10).length || 0,
        });
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscription
    const tableName = isBungalowManager ? 'bungalow_bookings' : 'bookings';
    const channel = supabase
      .channel('dashboard-bookings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isHallManager, isBungalowManager, user]);

  // Calculate stats with trends
  const stats = useMemo(() => {
    const now = new Date();
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const thisMonthStart = startOfMonth(now);

    const thisMonthBookings = bookings.filter(b => new Date(b.created_at) >= thisMonthStart);
    const lastMonthBookings = bookings.filter(b => {
      const date = new Date(b.created_at);
      return date >= lastMonthStart && date < thisMonthStart;
    });

    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return { value: current > 0 ? 100 : 0, isPositive: current > 0 };
      const change = ((current - previous) / previous) * 100;
      return { value: Math.round(Math.abs(change)), isPositive: change >= 0 };
    };

    const pendingBookings = bookings.filter(b => b.status === 'new').length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    
    // Unacknowledged: status is 'new' and more than 24 hours old
    const unacknowledgedBookings = bookings.filter(b => {
      if (b.status !== 'new' || b.acknowledged_at) return false;
      const createdAt = new Date(b.created_at);
      const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      return hoursDiff > 24;
    }).length;

    const baseStats = [
      {
        title: 'Total Halls',
        value: halls.length,
        icon: Building2,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        show: isSuperAdmin || isAdmin,
      },
      {
        title: 'Total Bookings',
        value: bookings.length,
        icon: Calendar,
        color: 'text-secondary',
        bgColor: 'bg-secondary/10',
        trend: calculateTrend(thisMonthBookings.length, lastMonthBookings.length),
        show: true,
      },
      {
        title: 'Pending Bookings',
        value: pendingBookings,
        icon: Clock,
        color: 'text-accent',
        bgColor: 'bg-accent/10',
        show: true,
      },
      {
        title: 'Confirmed Bookings',
        value: confirmedBookings,
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        show: true,
      },
      {
        title: 'Unacknowledged (>24h)',
        value: unacknowledgedBookings,
        icon: AlertTriangle,
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
        show: isSuperAdmin || isAdmin,
      },
      {
        title: 'Inventory Items',
        value: inventoryStats.total,
        icon: Package,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        show: true,
      },
      {
        title: 'Low Stock Items',
        value: inventoryStats.lowStock,
        icon: TrendingUp,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        show: inventoryStats.lowStock > 0,
      },
    ];

    return baseStats.filter(stat => stat.show);
  }, [bookings, halls, inventoryStats, isSuperAdmin, isAdmin]);

  const getRoleTitle = () => {
    if (isSuperAdmin) return 'Super Admin Dashboard';
    if (isAdmin) return 'Admin Dashboard';
    if (isBungalowManager) return 'Bungalow Manager Dashboard';
    return 'Manager Dashboard';
  };

  if (loading) {
    return (
      <AdminLayout title={getRoleTitle()}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={getRoleTitle()}>
      <div className="space-y-6">
        {/* Header with Refresh */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchData(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {isBungalowManager ? (
          <>
            {/* Bungalow Manager Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['pending', 'confirmed', 'checked_in', 'completed'].map(status => (
                <Card key={status} className="card-traditional">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">
                      {bungalowBookings.filter((b: any) => b.status === status).length}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{status.replace('_', ' ')}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Bungalow Bookings */}
            <div>
              <Card className="card-traditional">
                <CardHeader>
                  <CardTitle className="font-serif">Recent Bungalow Bookings</CardTitle>
                  <CardDescription>Latest room reservations</CardDescription>
                </CardHeader>
                <CardContent>
                  {bungalowBookings.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-8">No bookings yet</p>
                  ) : (
                    <div className="space-y-3">
                      {bungalowBookings.slice(0, 5).map((booking: any) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{booking.full_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {booking.room_type} ({booking.ac_type}) • {booking.check_in_date}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                            booking.status === 'confirmed' ? 'bg-primary/10 text-primary' :
                            booking.status === 'pending' ? 'bg-accent/10 text-accent-foreground' :
                            booking.status === 'checked_in' ? 'bg-secondary/10 text-secondary' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {booking.status.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <>
            {/* Recent Bookings */}
            <div>
              <RecentBookings bookings={bookings} />
            </div>

            {/* Real-time Stats Grid */}
            <RealTimeStats stats={stats} />

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BookingTrendChart bookings={bookings} days={30} />
              <BookingStatusChart bookings={bookings} />
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyBookingsChart bookings={bookings} months={6} />
              <HallPerformanceChart bookings={bookings} halls={halls} />
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
