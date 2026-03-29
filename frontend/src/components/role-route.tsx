import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/use-auth';

interface RoleRouteProps {
  allowedRoles: string[];
  children: ReactNode;
}

export default function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        Checking authentication...
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/' replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const fallbackPath = user.role === 'ADMIN' ? '/admin/dashboard' : '/cashier/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
