import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction } from '../api/transaction.api';
import { PRODUCTS_QUERY_KEY } from './use-products';

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
    },
  });
};
