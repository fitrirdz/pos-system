import { useState, useMemo } from 'react';
import { useTransactions } from '../hooks/use-transactions';
import ReceiptModal from '../components/receipt-modal';
import type { Transaction, PaymentMethod } from '../interfaces';

export default function TransactionHistory() {
  const { data: transactions, isLoading } = useTransactions();
  const [dateFilter, setDateFilter] = useState<'today' | 'custom'>('today');
  const [customDate, setCustomDate] = useState('');
  const [searchId, setSearchId] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
console.log('ini transactions: ', transactions);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Format payment method
  const formatPaymentMethod = (method: PaymentMethod | null | undefined) => {
    if (!method) return 'N/A';
    return method.replace(/_/g, ' ');
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    let filtered = [...transactions];

    // Filter by date
    if (dateFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.createdAt);
        transactionDate.setHours(0, 0, 0, 0);
        return transactionDate.getTime() === today.getTime();
      });
    } else if (dateFilter === 'custom' && customDate) {
      const selectedDate = new Date(customDate);
      selectedDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.createdAt);
        transactionDate.setHours(0, 0, 0, 0);
        return transactionDate.getTime() === selectedDate.getTime();
      });
    }

    // Filter by search ID
    if (searchId.trim()) {
      filtered = filtered.filter((t) =>
        t.id.toLowerCase().includes(searchId.toLowerCase())
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return filtered;
  }, [transactions, dateFilter, customDate, searchId]);

  // Handle view receipt
  const handleViewReceipt = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-white p-6 rounded-xl shadow'>
        <h1 className='text-2xl font-bold'>📋 Transaction History</h1>
        <p className='text-gray-500 mt-2'>View and manage your transactions</p>
      </div>

      {/* Filters */}
      <div className='bg-white p-6 rounded-xl shadow space-y-4'>
        <h2 className='text-lg font-semibold'>Filters</h2>

        {/* Date Filter */}
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Filter by Date
            </label>
            <div className='flex gap-3'>
              <button
                onClick={() => setDateFilter('today')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  dateFilter === 'today'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setDateFilter('custom')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  dateFilter === 'custom'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Custom Date
              </button>
            </div>
          </div>

          {/* Custom Date Picker */}
          {dateFilter === 'custom' && (
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Select Date
              </label>
              <input
                type='date'
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
              />
            </div>
          )}
        </div>

        {/* Search by ID */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Search by Transaction ID
          </label>
          <input
            type='text'
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder='Enter transaction ID...'
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className='bg-white p-6 rounded-xl shadow'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>
            Transactions ({filteredTransactions.length})
          </h2>
        </div>

        {isLoading ? (
          <div className='text-center py-12'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            <p className='text-gray-500 mt-4'>Loading transactions...</p>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className='space-y-3'>
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className='flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition gap-4'
              >
                <div className='flex-1 grid grid-cols-1 md:grid-cols-4 gap-3'>
                  {/* Transaction ID */}
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>🆔 Transaction ID</p>
                    <p className='text-sm font-mono font-medium text-gray-900'>
                      {transaction.id}
                    </p>
                  </div>

                  {/* Time */}
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>🕒 Time</p>
                    <p className='text-sm font-medium text-gray-900'>
                      {formatDateTime(transaction.createdAt)}
                    </p>
                  </div>

                  {/* Total */}
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>💰 Total</p>
                    <p className='text-sm font-bold text-green-600'>
                      {formatCurrency(transaction.total)}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>💳 Payment Method</p>
                    <p className='text-sm font-medium text-gray-900 capitalize'>
                      {formatPaymentMethod(transaction.paymentMethod)}
                    </p>
                  </div>
                </div>

                {/* View Receipt Button */}
                <div className='md:ml-4'>
                  <button
                    onClick={() => handleViewReceipt(transaction)}
                    className='w-full md:w-auto px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition'
                  >
                    📄 View Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-12 bg-gray-50 rounded-lg'>
            <p className='text-gray-500 text-lg'>No transactions found</p>
            <p className='text-gray-400 text-sm mt-2'>
              {dateFilter === 'today'
                ? 'No transactions for today yet'
                : 'Try adjusting your filters'}
            </p>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {selectedTransaction && (
        <ReceiptModal
          transaction={selectedTransaction}
          paidAmount={selectedTransaction.paidAmount || selectedTransaction.total}
          change={selectedTransaction.changeGiven}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}
