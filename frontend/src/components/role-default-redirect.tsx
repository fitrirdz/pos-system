import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/use-auth';

interface RoleDefaultRedirectProps {
  section: 'dashboard' | 'transactions' | 'new-transaction';
}

export default function RoleDefaultRedirect({
  section,
}: RoleDefaultRedirectProps) {
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

  const isAdmin = user.role === 'ADMIN';

  if (section === 'dashboard') {
    return (
      <Navigate
        to={isAdmin ? '/admin/dashboard' : '/cashier/dashboard'}
        replace
      />
    );
  }

  if (section === 'transactions') {
    return (
      <Navigate
        to={isAdmin ? '/admin/transactions' : '/cashier/transactions'}
        replace
      />
    );
  }

  return (
    <Navigate
      to={isAdmin ? '/admin/transactions' : '/cashier/transactions/new'}
      replace
    />
  );
}
