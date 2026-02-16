import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/use-auth';
import type { JSX } from 'react';


export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='h-screen flex items-center justify-center'>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/' replace />;
  }

  return children;
}
