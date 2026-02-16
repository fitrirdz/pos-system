import { useAuth } from '../context/use-auth';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold'>Welcome back, {user?.username}</h1>
        <p className='text-gray-500'>Here’s what’s happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-xl shadow'>
          <p className='text-sm text-gray-500'>Today's Sales</p>
          <h2 className='text-2xl font-bold mt-2'>Rp 2,450,000</h2>
        </div>

        <div className='bg-white p-6 rounded-xl shadow'>
          <p className='text-sm text-gray-500'>Transactions</p>
          <h2 className='text-2xl font-bold mt-2'>18</h2>
        </div>

        <div className='bg-white p-6 rounded-xl shadow'>
          <p className='text-sm text-gray-500'>Products</p>
          <h2 className='text-2xl font-bold mt-2'>124</h2>
        </div>
      </div>

      {/* Quick Action */}
      <div className='bg-white p-6 rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <h2 className='text-lg font-semibold'>Start a new transaction</h2>
          <p className='text-gray-500 text-sm'>
            Create a new sale and process payment.
          </p>
        </div>

        <button className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition'>
          + New Transaction
        </button>
      </div>

      {/* Placeholder for future chart or recent transactions */}
      <div className='bg-white p-6 rounded-xl shadow'>
        <h2 className='text-lg font-semibold mb-4'>Recent Transactions</h2>

        <div className='text-gray-400 text-sm'>No transactions yet.</div>
      </div>
    </div>
  );
}
