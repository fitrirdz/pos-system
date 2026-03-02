import { useAuth } from '../context/use-auth';
import {
  useDashboardStats,
  useMonthlySales,
  useSevenDaySales,
  useTopSellingProducts,
} from '../hooks/use-dashboard';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: monthlySales, isLoading: monthlyLoading } = useMonthlySales();
  const { data: sevenDaySales, isLoading: chartLoading } = useSevenDaySales();
  const { data: topProducts, isLoading: topProductsLoading } =
    useTopSellingProducts(5);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white p-3 rounded-lg shadow-lg border'>
          <p className='text-sm font-semibold'>{payload[0].payload.date}</p>
          <p className='text-sm text-primary'>
            Sales: {formatCurrency(payload[0].value)}
          </p>
          <p className='text-sm text-gray-600'>
            Transactions: {payload[0].payload.transactions}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-white p-6 rounded-xl shadow'>
        <h1 className='text-3xl font-bold'>📊 Admin Dashboard</h1>
        <p className='text-gray-500 mt-2'>
          Welcome back, {user?.username}! Here's your business overview.
        </p>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Total Sales Today */}
        <div className='bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm opacity-90'>Total Sales Today</p>
              {statsLoading ? (
                <div className='text-lg mt-2'>Loading...</div>
              ) : (
                <h2 className='text-2xl font-bold mt-2'>
                  {formatCurrency(stats?.totalSalesToday || 0)}
                </h2>
              )}
            </div>
            <div className='text-4xl opacity-80'>💰</div>
          </div>
          <p className='text-xs opacity-75 mt-3'>
            {stats?.totalTransactionsToday || 0} transactions
          </p>
        </div>

        {/* Sales This Month */}
        <div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm opacity-90'>Sales This Month</p>
              {monthlyLoading ? (
                <div className='text-lg mt-2'>Loading...</div>
              ) : (
                <h2 className='text-2xl font-bold mt-2'>
                  {formatCurrency(monthlySales?.totalSalesThisMonth || 0)}
                </h2>
              )}
            </div>
            <div className='text-4xl opacity-80'>📈</div>
          </div>
          <p className='text-xs opacity-75 mt-3'>
            {monthlySales?.totalTransactionsThisMonth || 0} transactions
          </p>
        </div>

        {/* Low Stock Warning */}
        <div className='bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm opacity-90'>Low Stock Products</p>
              {statsLoading ? (
                <div className='text-lg mt-2'>Loading...</div>
              ) : (
                <h2 className='text-2xl font-bold mt-2'>
                  {stats?.lowStockProducts.length || 0}
                </h2>
              )}
            </div>
            <div className='text-4xl opacity-80'>⚠️</div>
          </div>
          <p className='text-xs opacity-75 mt-3'>Products need restocking</p>
        </div>

        {/* Out of Stock */}
        <div className='bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm opacity-90'>Out of Stock</p>
              {statsLoading ? (
                <div className='text-lg mt-2'>Loading...</div>
              ) : (
                <h2 className='text-2xl font-bold mt-2'>
                  {stats?.outOfStockProducts.length || 0}
                </h2>
              )}
            </div>
            <div className='text-4xl opacity-80'>🚫</div>
          </div>
          <p className='text-xs opacity-75 mt-3'>Products unavailable</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* 7-Day Sales Chart */}
        <div className='bg-white p-6 rounded-xl shadow'>
          <h2 className='text-xl font-bold mb-4'>📊 Sales Last 7 Days</h2>
          {chartLoading ? (
            <div className='h-64 flex items-center justify-center text-gray-400'>
              Loading chart...
            </div>
          ) : (
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={sevenDaySales}>
                <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                <XAxis dataKey='date' tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type='monotone'
                  dataKey='sales'
                  stroke='rgb(130, 18, 87)'
                  strokeWidth={3}
                  dot={{ fill: 'rgb(130, 18, 87)', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Selling Products */}
        <div className='bg-white p-6 rounded-xl shadow'>
          <h2 className='text-xl font-bold mb-4'>🏆 Top Selling Products</h2>
          {topProductsLoading ? (
            <div className='h-64 flex items-center justify-center text-gray-400'>
              Loading products...
            </div>
          ) : (
            <ResponsiveContainer width='100%' height={300}>
              <BarChart
                data={topProducts}
                layout='vertical'
                margin={{ left: 20 }}
              >
                <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                <XAxis type='number' tick={{ fontSize: 12 }} />
                <YAxis
                  type='category'
                  dataKey='name'
                  tick={{ fontSize: 11 }}
                  width={100}
                />
                <Tooltip
                  formatter={(value) => [
                    `${value} units`,
                    'Quantity Sold',
                  ]}
                  labelStyle={{ color: '#000', fontWeight: 'bold' }}
                />
                <Bar
                  dataKey='totalQuantity'
                  fill='rgb(130, 18, 87)'
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Low Stock & Top Products Details */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Low Stock Products Table */}
        <div className='bg-white p-6 rounded-xl shadow'>
          <h2 className='text-xl font-bold mb-4'>⚠️ Low Stock Warning</h2>
          {statsLoading ? (
            <div className='text-gray-400'>Loading...</div>
          ) : stats?.lowStockProducts.length === 0 ? (
            <p className='text-gray-500 text-center py-8'>
              No low stock products
            </p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='border-b'>
                  <tr className='text-left text-sm text-gray-600'>
                    <th className='pb-3 font-semibold'>Product</th>
                    <th className='pb-3 font-semibold'>Category</th>
                    <th className='pb-3 font-semibold text-right'>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.lowStockProducts.slice(0, 5).map((product) => (
                    <tr key={product.id} className='border-b last:border-0'>
                      <td className='py-3'>
                        <p className='font-medium'>{product.name}</p>
                        <p className='text-xs text-gray-500'>{product.code}</p>
                      </td>
                      <td className='py-3 text-sm'>{product.category.name}</td>
                      <td
                        className={`py-3 text-right font-semibold ${
                          product.stock <= 5
                            ? 'text-red-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {product.stock}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products Details */}
        <div className='bg-white p-6 rounded-xl shadow'>
          <h2 className='text-xl font-bold mb-4'>💎 Top Products Revenue</h2>
          {topProductsLoading ? (
            <div className='text-gray-400'>Loading...</div>
          ) : topProducts?.length === 0 ? (
            <p className='text-gray-500 text-center py-8'>
              No sales data available
            </p>
          ) : (
            <div className='space-y-4'>
              {topProducts?.map((product, index) => (
                <div
                  key={product.id}
                  className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'
                >
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm'>
                      {index + 1}
                    </div>
                    <div>
                      <p className='font-semibold'>{product.name}</p>
                      <p className='text-xs text-gray-500'>
                        {product.totalQuantity} units sold
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-bold text-primary'>
                      {formatCurrency(product.totalRevenue)}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {product.category.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;