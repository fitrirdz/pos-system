import { useAuth } from '../context/use-auth';
import AdminDashboard from './admin-dashboard';
import CashierDashboard from './cashier-dashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "ADMIN") {
    return <AdminDashboard />;
  }

  return <CashierDashboard />;
}
