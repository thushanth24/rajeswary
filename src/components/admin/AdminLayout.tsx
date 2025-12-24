import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from './AdminSidebar';
import { Helmet } from 'react-helmet-async';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

const AdminLayout = ({ children, title = 'Admin Dashboard' }: AdminLayoutProps) => {
  return (
    <>
      <Helmet>
        <title>{title} | Rajeswary Hall Admin</title>
      </Helmet>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AdminSidebar />
          <main className="flex-1 bg-background">
            <header className="h-14 border-b border-border flex items-center px-4 bg-card">
              <SidebarTrigger className="mr-4" />
              <h1 className="font-serif text-xl text-foreground">{title}</h1>
            </header>
            <div className="p-6">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </>
  );
};

export default AdminLayout;
