import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

// Lazy load public pages
const Index = lazy(() => import("./pages/Index"));
const Halls = lazy(() => import("./pages/Halls"));
const HallDetail = lazy(() => import("./pages/HallDetail"));
const Services = lazy(() => import("./pages/Services"));
const Menus = lazy(() => import("./pages/Menus"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Booking = lazy(() => import("./pages/Booking"));
const Bungalows = lazy(() => import("./pages/Bungalows"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy load admin pages
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const HallsManagement = lazy(() => import("./pages/admin/HallsManagement"));
const BookingsManagement = lazy(() => import("./pages/admin/BookingsManagement"));
const InventoryManagement = lazy(() => import("./pages/admin/InventoryManagement"));
const ManagerAssignments = lazy(() => import("./pages/admin/ManagerAssignments"));
const UnacknowledgedBookings = lazy(() => import("./pages/admin/UnacknowledgedBookings"));
const NewManualBooking = lazy(() => import("./pages/admin/NewManualBooking"));
const AuditLogs = lazy(() => import("./pages/admin/AuditLogs"));
const Reports = lazy(() => import("./pages/admin/Reports"));
const AdminCalendar = lazy(() => import("./pages/admin/Calendar"));
const ContactMessages = lazy(() => import("./pages/admin/ContactMessages"));

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
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
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
              <Route path="/auth" element={<Auth />} />

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
                  <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
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

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
