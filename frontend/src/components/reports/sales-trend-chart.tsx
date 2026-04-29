import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  formatCurrency,
  type SalesTrendPoint,
} from '../../pages/admin/reports.utils';

interface SalesTrendChartProps {
  data: SalesTrendPoint[];
  isLoading: boolean;
}

export default function SalesTrendChart({
  data,
  isLoading,
}: SalesTrendChartProps) {
  return (
    <div className='bg-white p-6 rounded-xl shadow'>
      <h2 className='text-lg font-semibold mb-4'>Sales Chart</h2>

      {isLoading ? (
        <div className='h-72 flex items-center justify-center text-gray-400'>
          Loading chart...
        </div>
      ) : data.length === 0 ? (
        <div className='h-72 flex items-center justify-center text-gray-400'>
          No sales data in selected range
        </div>
      ) : (
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
            <XAxis dataKey='dateLabel' tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line
              type='monotone'
              dataKey='revenue'
              stroke='rgb(130, 18, 87)'
              strokeWidth={3}
              dot={{ fill: 'rgb(130, 18, 87)', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
