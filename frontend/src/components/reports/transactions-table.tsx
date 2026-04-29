import type { Transaction } from '../../interfaces';
import {
  formatCurrency,
  formatDateTime,
} from '../../pages/admin/reports.utils';

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const formatItems = (transaction: Transaction): string => {
  if (transaction.items.length === 0) {
    return '-';
  }

  return transaction.items.map((item) => `${item.product.name} x${item.qty}`).join(', ');
};

export default function TransactionsTable({
  transactions,
  isLoading,
}: TransactionsTableProps) {
  return (
    <div className='bg-white p-6 rounded-xl shadow'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-semibold'>Transactions Table</h2>
        <p className='text-sm text-gray-500'>
          {transactions.length} transaction(s)
        </p>
      </div>

      {isLoading ? (
        <div className='py-10 text-center text-gray-400'>Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className='py-10 text-center text-gray-400'>
          No transactions in selected range
        </div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='border-b'>
              <tr className='text-left text-sm text-gray-600'>
                <th className='pb-3 font-semibold'>Date</th>
                <th className='pb-3 font-semibold'>Transaction ID</th>
                <th className='pb-3 font-semibold'>Items</th>
                <th className='pb-3 font-semibold text-right'>Total</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className='border-b last:border-0'>
                  <td className='py-3 text-sm whitespace-nowrap'>
                    {formatDateTime(transaction.createdAt)}
                  </td>
                  <td className='py-3 text-sm font-mono'>{transaction.id}</td>
                  <td className='py-3 text-sm text-gray-700'>{formatItems(transaction)}</td>
                  <td className='py-3 text-right font-semibold text-green-600 whitespace-nowrap'>
                    {formatCurrency(transaction.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
