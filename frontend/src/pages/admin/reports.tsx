import { useState } from 'react';
import DateRangeFilter from '../../components/reports/date-range-filter';
import SalesSummaryCards from '../../components/reports/sales-summary-cards';
import SalesTrendChart from '../../components/reports/sales-trend-chart';
import TopProductsTable from '../../components/reports/top-products-table';
import TransactionsTable from '../../components/reports/transactions-table';
import { useReportData } from '../../hooks/use-report-data';
import type { DateRangePreset } from './reports.utils';

const initialDateValue = new Date().toISOString().split('T')[0];

export default function AdminReportsPage() {
  const [preset, setPreset] = useState<DateRangePreset>('TODAY');
  const [customStartDate, setCustomStartDate] = useState(initialDateValue);
  const [customEndDate, setCustomEndDate] = useState(initialDateValue);

  const {
    isLoading,
    isFetching,
    dateRange,
    filteredTransactions,
    salesSummary,
    salesTrend,
    topProducts,
  } = useReportData({
    preset,
    customStartDate,
    customEndDate,
  });

  return (
    <div className='space-y-4'>
      <div className='bg-white p-6 rounded-xl shadow'>
        <h1 className='text-2xl font-bold'>Reports</h1>
        <p className='text-gray-500 mt-2'>
          Sales analytics by selected date range.
        </p>
        <p className='text-xs text-gray-400 mt-2'>
          Period: {dateRange.start.toLocaleDateString('id-ID')} -{' '}
          {dateRange.end.toLocaleDateString('id-ID')}
          {isFetching ? ' (updating...)' : ''}
        </p>
      </div>

      <DateRangeFilter
        preset={preset}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        onPresetChange={setPreset}
        onCustomStartDateChange={setCustomStartDate}
        onCustomEndDateChange={setCustomEndDate}
      />

      <SalesSummaryCards summary={salesSummary} isLoading={isLoading} />

      <SalesTrendChart data={salesTrend} isLoading={isLoading} />

      <TopProductsTable topProducts={topProducts} isLoading={isLoading} />

      <TransactionsTable
        transactions={filteredTransactions}
        isLoading={isLoading}
      />
    </div>
  );
}
