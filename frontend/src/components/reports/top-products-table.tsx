import {
  formatCurrency,
  type TopProductRow,
} from '../../pages/admin/reports.utils';

interface TopProductsTableProps {
  topProducts: TopProductRow[];
  isLoading: boolean;
}

export default function TopProductsTable({
  topProducts,
  isLoading,
}: TopProductsTableProps) {
  return (
    <div className='bg-white p-6 rounded-xl shadow'>
      <h2 className='text-lg font-semibold mb-4'>Top Products</h2>

      {isLoading ? (
        <div className='py-10 text-center text-gray-400'>Loading products...</div>
      ) : topProducts.length === 0 ? (
        <div className='py-10 text-center text-gray-400'>
          No product sales in selected range
        </div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='border-b'>
              <tr className='text-left text-sm text-gray-600'>
                <th className='pb-3 font-semibold'>Product</th>
                <th className='pb-3 font-semibold text-right'>Qty</th>
                <th className='pb-3 font-semibold text-right'>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.slice(0, 10).map((product) => (
                <tr key={product.productId} className='border-b last:border-0'>
                  <td className='py-3'>
                    <p className='font-medium'>{product.name}</p>
                    <p className='text-xs text-gray-500'>{product.code}</p>
                  </td>
                  <td className='py-3 text-right font-medium'>{product.totalQty}</td>
                  <td className='py-3 text-right font-semibold text-primary'>
                    {formatCurrency(product.totalRevenue)}
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
