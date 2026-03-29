import { useAuth } from '../context/use-auth';
import TransactionHistoryAdmin from './admin/transaction-history';
import TransactionHistoryCashier from './cashier/transaction-history';

export default function TransactionHistory() {
  const { user } = useAuth();

  if (user?.role === 'ADMIN') {
    return <TransactionHistoryAdmin />;
  }

  return <TransactionHistoryCashier />;
}
