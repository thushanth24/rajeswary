import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  CalendarDays,
  FileText,
  Shield,
  LogOut,
  UserCog,
  AlertTriangle,
  BarChart3,
  Settings,
  MessageSquare,
  Home,
} from 'lucide-react';

const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { isSuperAdmin, isAdmin, isHallManager, isBungalowManager, signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const isActive = (path: string) => location.pathname === path;

  // Define menu items based on role
  const superAdminItems = [
    { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
    { title: 'Calendar', url: '/admin/calendar', icon: CalendarDays },
    { title: 'User Management', url: '/admin/users', icon: Users },
    { title: 'All Halls', url: '/admin/halls', icon: Building2 },
    { title: 'All Bookings', url: '/admin/bookings', icon: Calendar },
    { title: 'Contact Messages', url: '/admin/contact-messages', icon: MessageSquare },
    { title: 'Audit Logs', url: '/admin/audit-logs', icon: FileText },
    { title: 'Reports', url: '/admin/reports', icon: BarChart3 },
    { title: 'Settings', url: '/admin/settings', icon: Settings },
  ];

  const adminItems = [
    { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
    { title: 'Calendar', url: '/admin/calendar', icon: CalendarDays },
    { title: 'Manager Assignments', url: '/admin/managers', icon: UserCog },
    { title: 'All Bookings', url: '/admin/bookings', icon: Calendar },
    { title: 'Unacknowledged', url: '/admin/unacknowledged', icon: AlertTriangle },
    { title: 'Contact Messages', url: '/admin/contact-messages', icon: MessageSquare },
    { title: 'Reports', url: '/admin/reports', icon: BarChart3 },
    { title: 'Settings', url: '/admin/settings', icon: Settings },
  ];

  const managerItems = [
    { title: 'My Dashboard', url: '/admin', icon: LayoutDashboard },
    { title: 'Calendar', url: '/admin/calendar', icon: CalendarDays },
    { title: 'My Bookings', url: '/admin/bookings', icon: Calendar },
    { title: 'New Booking', url: '/admin/new-booking', icon: Calendar },
    { title: 'Settings', url: '/admin/settings', icon: Settings },
  ];

  const bungalowManagerItems = [
    { title: 'My Dashboard', url: '/admin', icon: LayoutDashboard },
    { title: 'Bungalow Bookings', url: '/admin/bungalow-bookings', icon: Home },
    { title: 'Room Management', url: '/admin/bungalow-rooms', icon: Building2 },
    { title: 'Settings', url: '/admin/settings', icon: Settings },
  ];

  let menuItems = managerItems;
  let roleLabel = 'Hall Manager';
  
  if (isSuperAdmin) {
    menuItems = superAdminItems;
    roleLabel = 'Super Admin';
  } else if (isAdmin) {
    menuItems = adminItems;
    roleLabel = 'Admin';
  } else if (isBungalowManager) {
    menuItems = bungalowManagerItems;
    roleLabel = 'Bungalow Manager';
  }

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-60'} collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sidebar-primary rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-serif text-lg text-sidebar-foreground">Admin Panel</h2>
              <p className="text-xs text-sidebar-foreground/70">{roleLabel}</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            {!collapsed && 'Navigation'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={collapsed ? item.title : undefined}
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === '/admin'}
                      className="flex items-center gap-3"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!collapsed && user && (
          <p className="text-xs text-sidebar-foreground/70 mb-2 truncate">
            {user.email}
          </p>
        )}
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'default'}
          onClick={handleSignOut}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
