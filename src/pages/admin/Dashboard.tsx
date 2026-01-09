import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import {
  Building2,
  Calendar,
  Package,
  Users,
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
  const { isSuperAdmin, isAdmin, isHallManager, user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [inventoryStats, setInventoryStats] = useState({ total: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [managerHallName, setManagerHallName] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    
    try {
      // Fetch all bookings with hall info
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('id, reference_number, customer_name, event_date, event_type, status, created_at, acknowledged_at, hall_id, halls(name)')
        .order('created_at', { ascending: false });

      // Fetch halls
      const { data: hallsData } = await supabase
        .from('halls')
        .select('id, name');

      // Fetch inventory
      const { data: inventoryData } = await supabase
        .from('inventory')
        .select('quantity');

      // For hall managers, get their hall names
      if (isHallManager && user) {
        const { data: hallManagerData } = await supabase
          .from('hall_managers')
          .select('halls(name)')
          .eq('user_id', user.id)
          .eq('is_active', true);
        
        if (hallManagerData && hallManagerData.length > 0) {
          const hallNames = hallManagerData
            .filter(h => h.halls)
            .map(h => (h.halls as any).name)
            .join(', ');
          setManagerHallName(hallNames);
        }
      }

      setBookings(bookingsData || []);
      setHalls(hallsData || []);
      setInventoryStats({
        total: inventoryData?.length || 0,
        lowStock: inventoryData?.filter(i => i.quantity < 10).length || 0,
      });
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

    // Set up real-time subscription for bookings
    const channel = supabase
      .channel('dashboard-bookings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isHallManager, user]);

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

        {/* Recent Bookings & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentBookings bookings={bookings} />
          
          {/* Quick Actions */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="font-serif">Quick Actions</CardTitle>
              <CardDescription>Common tasks based on your role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {isHallManager && (
                  <>
                    <a href="/admin/new-booking" className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-center">
                      <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium">New Manual Booking</p>
                    </a>
                    <a href="/admin/bookings" className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-center">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-accent" />
                      <p className="text-sm font-medium">View Pending</p>
                    </a>
                    <a href="/admin/inventory" className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-center">
                      <Package className="w-8 h-8 mx-auto mb-2 text-secondary" />
                      <p className="text-sm font-medium">Manage Inventory</p>
                    </a>
                  </>
                )}
                {(isSuperAdmin || isAdmin) && (
                  <>
                    <a href="/admin/bookings" className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-center">
                      <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium">View All Bookings</p>
                    </a>
                    <a href="/admin/unacknowledged" className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-center">
                      <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-destructive" />
                      <p className="text-sm font-medium">Unacknowledged</p>
                    </a>
                    <a href="/admin/managers" className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-center">
                      <Users className="w-8 h-8 mx-auto mb-2 text-secondary" />
                      <p className="text-sm font-medium">Manager Assignments</p>
                    </a>
                    <a href="/admin/reports" className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-center">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2 text-accent" />
                      <p className="text-sm font-medium">View Reports</p>
                    </a>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
