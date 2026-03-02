import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTransaction, getTransactions } from '../api/transaction.api';
import type { GetTransactionsFilters } from '../api/transaction.api';
import { PRODUCTS_QUERY_KEY } from './use-products';
import { DASHBOARD_STATS_QUERY_KEY } from './use-dashboard';

/**
 * Query key for transactions
 */
export const TRANSACTIONS_QUERY_KEY = ['transactions'];

/**
 * Hook to fetch all transactions with optional filters
 * @param filters - Optional filters for userId, date, search (transaction ID), and type
 */
export const useTransactions = (filters?: GetTransactionsFilters) => {
  return useQuery({
    queryKey: filters 
      ? [...TRANSACTIONS_QUERY_KEY, filters]
      : TRANSACTIONS_QUERY_KEY,
    queryFn: () => getTransactions(filters),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    refetchIntervalInBackground: false, // Don't poll when tab is hidden
  });
};

/**
 * Hook to create a new transaction
 * Automatically refetches products after successful transaction to update stock levels
 */
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      // Invalidate and refetch products to get updated stock levels
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_STATS_QUERY_KEY });
    },
  });
};
