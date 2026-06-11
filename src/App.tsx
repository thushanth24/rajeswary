import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { RouteSeo } from "@/components/seo/RouteSeo";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

// Public Pages
import Index from "./pages/Index";
import Halls from "./pages/Halls";
import HallDetail from "./pages/HallDetail";
import Services from "./pages/Services";
import Menus from "./pages/Menus";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import Bungalows from "./pages/Bungalows";
import Gallery from "./pages/Gallery";
import Charity from "./pages/Charity";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import RefundPolicy from "./pages/RefundPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import HallsManagement from "./pages/admin/HallsManagement";
import BookingsManagement from "./pages/admin/BookingsManagement";
import InventoryManagement from "./pages/admin/InventoryManagement";
import ManagerAssignments from "./pages/admin/ManagerAssignments";
import UnacknowledgedBookings from "./pages/admin/UnacknowledgedBookings";
import NewManualBooking from "./pages/admin/NewManualBooking";
import AuditLogs from "./pages/admin/AuditLogs";
import Reports from "./pages/admin/Reports";
import AdminCalendar from "./pages/admin/Calendar";
import ContactMessages from "./pages/admin/ContactMessages";
import Settings from "./pages/admin/Settings";
import BungalowBookings from "./pages/admin/BungalowBookings";
import BungalowRoomManagement from "./pages/admin/BungalowRoomManagement";
import GalleryAlbums from "./pages/admin/GalleryAlbums";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <RouteSeo />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/halls" element={<Halls />} />
              <Route path="/halls/:slug" element={<HallDetail />} />
              <Route path="/services" element={<Services />} />
              <Route path="/menus" element={<Menus />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/bungalows" element={<Bungalows />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/charity" element={<Charity />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

              {/* Admin Routes - Protected */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['super_admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/halls"
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                    <HallsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <ProtectedRoute>
                    <BookingsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/inventory"
                element={
                  <ProtectedRoute>
                    <InventoryManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/managers"
                element={
                  <ProtectedRoute allowedRoles={['super_admin']}>
                    <ManagerAssignments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/unacknowledged"
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                    <UnacknowledgedBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/new-booking"
                element={
                  <ProtectedRoute allowedRoles={['hall_manager']}>
                    <NewManualBooking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/audit-logs"
                element={
                  <ProtectedRoute allowedRoles={['super_admin']}>
                    <AuditLogs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/calendar"
                element={
                  <ProtectedRoute>
                    <AdminCalendar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/contact-messages"
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                    <ContactMessages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/gallery"
                element={
                  <ProtectedRoute allowedRoles={['hall_manager', 'super_admin', 'admin']}>
                    <GalleryAlbums />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/bungalow-bookings"
                element={
                  <ProtectedRoute allowedRoles={['bungalow_manager', 'super_admin', 'admin']}>
                    <BungalowBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/bungalow-rooms"
                element={
                  <ProtectedRoute allowedRoles={['bungalow_manager', 'super_admin', 'admin']}>
                    <BungalowRoomManagement />
                  </ProtectedRoute>
                }
              />
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
