import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

type AllowedRole = 'super_admin' | 'admin' | 'hall_manager' | 'bungalow_manager';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: AllowedRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading, roles, isSuperAdmin, isAdmin, isHallManager, isBungalowManager } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If no specific roles required, just check if authenticated
  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Check if user has any of the allowed roles
  const hasPermission = allowedRoles.some(role => {
    if (role === 'super_admin') return isSuperAdmin;
    if (role === 'admin') return isAdmin;
    if (role === 'hall_manager') return isHallManager;
    if (role === 'bungalow_manager') return isBungalowManager;
    return roles.includes(role);
  });

  if (!hasPermission) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
