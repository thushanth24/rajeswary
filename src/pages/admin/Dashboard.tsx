import { useEffect, useState } from 'react';
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
} from 'lucide-react';

interface DashboardStats {
  totalHalls: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  unacknowledgedBookings: number;
  totalInventoryItems: number;
  lowStockItems: number;
  totalUsers: number;
}

const Dashboard = () => {
  const { isSuperAdmin, isAdmin, isHallManager, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalHalls: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    unacknowledgedBookings: 0,
    totalInventoryItems: 0,
    lowStockItems: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [managerHallName, setManagerHallName] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch halls count
        const { count: hallsCount } = await supabase
          .from('halls')
          .select('*', { count: 'exact', head: true });

        // Fetch bookings
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('status, acknowledged_at, created_at');

        const totalBookings = bookingsData?.length || 0;
        const pendingBookings = bookingsData?.filter(b => b.status === 'new').length || 0;
        const confirmedBookings = bookingsData?.filter(b => b.status === 'confirmed').length || 0;
        
        // Unacknowledged: status is 'new' and more than 24 hours old
        const now = new Date();
        const unacknowledgedBookings = bookingsData?.filter(b => {
          if (b.status !== 'new' || b.acknowledged_at) return false;
          const createdAt = new Date(b.created_at);
          const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
          return hoursDiff > 24;
        }).length || 0;

        // Fetch inventory
        const { data: inventoryData } = await supabase
          .from('inventory')
          .select('quantity, status');

        const totalInventoryItems = inventoryData?.length || 0;
        const lowStockItems = inventoryData?.filter(i => i.quantity < 10).length || 0;

        // For hall managers, get their hall name
        if (isHallManager && user) {
          const { data: hallManagerData } = await supabase
            .from('hall_managers')
            .select('halls(name)')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .maybeSingle();
          
          if (hallManagerData?.halls) {
            setManagerHallName((hallManagerData.halls as any).name);
          }
        }

        setStats({
          totalHalls: hallsCount || 0,
          totalBookings,
          pendingBookings,
          confirmedBookings,
          unacknowledgedBookings,
          totalInventoryItems,
          lowStockItems,
          totalUsers: 0, // Will be fetched separately for super admin
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isHallManager, user]);

  const getRoleTitle = () => {
    if (isSuperAdmin) return 'Super Admin Dashboard';
    if (isAdmin) return 'Admin Dashboard';
    return managerHallName ? `${managerHallName} - Manager Dashboard` : 'Manager Dashboard';
  };

  const statCards = [
    {
      title: 'Total Halls',
      value: stats.totalHalls,
      icon: Building2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      show: isSuperAdmin || isAdmin,
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      show: true,
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: Clock,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      show: true,
    },
    {
      title: 'Confirmed Bookings',
      value: stats.confirmedBookings,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      show: true,
    },
    {
      title: 'Unacknowledged (>24h)',
      value: stats.unacknowledgedBookings,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      show: isSuperAdmin || isAdmin,
    },
    {
      title: 'Inventory Items',
      value: stats.totalInventoryItems,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      show: true,
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      show: true,
    },
  ];

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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards
            .filter(card => card.show)
            .map((card, index) => (
              <Card key={index} className="card-traditional">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{card.title}</p>
                      <p className="text-3xl font-bold mt-1">{card.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full ${card.bgColor} flex items-center justify-center`}>
                      <card.icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Quick Actions */}
        <Card className="card-traditional">
          <CardHeader>
            <CardTitle className="font-serif">Quick Actions</CardTitle>
            <CardDescription>Common tasks based on your role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
    </AdminLayout>
  );
};

export default Dashboard;
