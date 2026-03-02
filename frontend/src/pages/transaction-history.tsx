import { useAuth } from '../context/use-auth';
import TransactionHistoryAdmin from './transaction-history-admin';
import TransactionHistoryCashier from './transaction-history-cashier';

export default function TransactionHistory() {
  const { user } = useAuth();

  if (user?.role === 'ADMIN') {
    return <TransactionHistoryAdmin />;
  }

  return <TransactionHistoryCashier />;
}
