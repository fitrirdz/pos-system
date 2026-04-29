import { useMemo } from 'react';
import { useTransactions } from './use-transactions';
import type { Transaction } from '../interfaces';
import {
  buildSalesTrend,
  calculateSalesSummary,
  calculateTopProducts,
  getDateRange,
  isDateInRange,
  parseSafeDate,
  type DateRangePreset,
} from '../pages/admin/reports.utils';

interface UseReportDataOptions {
  preset: DateRangePreset;
  customStartDate: string;
  customEndDate: string;
}

export const useReportData = ({
  preset,
  customStartDate,
  customEndDate,
}: UseReportDataOptions) => {
  const {
    data: transactions = [],
    isLoading,
    isFetching,
  } = useTransactions({ type: 'SALE' });

  const dateRange = useMemo(
    () => getDateRange(preset, customStartDate, customEndDate),
    [preset, customStartDate, customEndDate],
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction: Transaction) => {
      const parsedDate = parseSafeDate(transaction.createdAt);

      if (!parsedDate) {
        return false;
      }

      return isDateInRange(parsedDate, dateRange.start, dateRange.end);
    });
  }, [transactions, dateRange]);

  const salesSummary = useMemo(
    () => calculateSalesSummary(filteredTransactions),
    [filteredTransactions],
  );

  const salesTrend = useMemo(
    () => buildSalesTrend(filteredTransactions),
    [filteredTransactions],
  );

  const topProducts = useMemo(
    () => calculateTopProducts(filteredTransactions),
    [filteredTransactions],
  );

  return {
    isLoading,
    isFetching,
    dateRange,
    filteredTransactions,
    salesSummary,
    salesTrend,
    topProducts,
  };
};
