import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/use-auth';
import { useDashboardStats } from '../hooks/use-dashboard';
import { useState, useEffect } from 'react';

export default function CashierDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: stats, isLoading } = useDashboardStats();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date and time
  const formatDateTime = (date: Date) => {
    return {
      date: new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date),
      time: new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(date),
    };
  };

  // Format transaction time
  const formatTransactionTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const { date, time } = formatDateTime(currentTime);

  return (
    <div className='space-y-8'>
      {/* Greeting & Date/Time */}
      <div className='bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-4 gap-6 items-center'>
        <div className='md:col-span-3'>
          <h1 className='text-2xl font-bold'>👋 Hi, {user?.username}!</h1>
          <p className='text-gray-500 mt-2'>Ready to start selling?</p>
        </div>
        <div className='md:col-span-1 md:border-l md:pl-6'>
          <p className='text-sm text-gray-600'>🕒 {date}</p>
          <p className='text-2xl font-semibold text-primary mt-1'>{time}</p>
        </div>
      </div>

      {/* Big Action Card */}
      <div className='bg-primary text-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
        <div>
          <h2 className='text-2xl font-bold'>Start New Transaction</h2>
          <p className='opacity-90 mt-2'>
            Create a new sale and process payment.
          </p>
        </div>

        <button
          onClick={() => navigate('/transactions/new')}
          className='bg-white text-primary font-bold px-8 py-4 rounded-xl text-lg hover:bg-gray-100 transition'
        >
          + New Sale
        </button>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-xl shadow'>
          <p className='text-sm text-gray-500'>💰 Total Sales Today</p>
          {isLoading ? (
            <div className='text-lg text-gray-400 mt-2'>Loading...</div>
          ) : (
            <h2 className='text-3xl font-bold mt-2 text-green-600'>
              {formatCurrency(stats?.totalSalesToday || 0)}
            </h2>
          )}
        </div>

        <div className='bg-white p-6 rounded-xl shadow'>
          <p className='text-sm text-gray-500'>🧾 Total Transactions Today</p>
          {isLoading ? (
            <div className='text-lg text-gray-400 mt-2'>Loading...</div>
          ) : (
            <h2 className='text-3xl font-bold mt-2'>
              {stats?.totalTransactionsToday || 0}
            </h2>
          )}
          <p className='text-xs text-gray-400 mt-2'>SALE transactions only</p>
        </div>

        {/* Low Stock Alert */}
        {isLoading ? (
          <div className='bg-white p-6 rounded-xl shadow'>
            <h2 className='text-lg font-semibold mb-4'>📦 Stock Status</h2>
            <div className='text-sm text-gray-500'>Loading...</div>
          </div>
        ) : (stats?.lowStockProducts.length || 0) > 0 ||
          (stats?.outOfStockProducts.length || 0) > 0 ? (
          <div className='bg-white p-6 rounded-xl shadow'>
            <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'>
              📦 Low Stock Alert
              <span className='bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full'>
                {(stats?.lowStockProducts.length || 0) +
                  (stats?.outOfStockProducts.length || 0)}
              </span>
            </h2>

            <div className='space-y-3 max-h-[300px] overflow-y-auto'>
              {stats?.outOfStockProducts.map((product) => (
                <div
                  key={product.id}
                  className='flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg'
                >
                  <div>
                    <p className='font-medium text-red-900'>{product.name}</p>
                    <p className='text-sm text-red-600'>Code: {product.code}</p>
                  </div>
                  <div className='text-right'>
                    <span className='bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold'>
                      OUT OF STOCK
                    </span>
                  </div>
                </div>
              ))}
              {stats?.lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className='flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg'
                >
                  <div>
                    <p className='font-medium text-yellow-900'>
                      {product.name}
                    </p>
                    <p className='text-sm text-yellow-600'>
                      Code: {product.code}
                    </p>
                  </div>
                  <div className='text-right'>
                    <span className='bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold'>
                      {product.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='bg-white p-6 rounded-xl shadow'>
            <h2 className='text-lg font-semibold mb-4'>📦 Stock Status</h2>
            <div className='text-sm text-green-600 bg-green-50 p-4 rounded-lg'>
              ✅ All products are well stocked!
            </div>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className='bg-white p-6 rounded-xl shadow'>
        <h2 className='text-lg font-semibold mb-4'>📋 Recent Transactions</h2>
        {isLoading ? (
          <div className='text-sm text-gray-500'>Loading...</div>
        ) : (stats?.recentTransactions.length || 0) > 0 ? (
          <div className='space-y-3'>
            {stats?.recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className='flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition'
              >
                <div className='flex-1'>
                  <p className='text-sm text-gray-500'>
                    {formatTransactionTime(transaction.createdAt)}
                  </p>
                  <p className='text-sm font-medium text-gray-700 mt-1'>
                    Cashier: {transaction.cashier.username}
                  </p>
                </div>
                <div className='text-right'>
                  <p className='text-lg font-bold text-green-600'>
                    {formatCurrency(transaction.total)}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      transaction.type === 'SALE'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {transaction.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-sm text-gray-500 bg-gray-50 p-4 rounded-lg'>
            No transactions yet
          </div>
        )}
      </div>
    </div>
  );
}
