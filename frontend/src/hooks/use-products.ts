import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/product.api';

/**
 * Query key for products
 * Used for cache identification and invalidation
 */
export const PRODUCTS_QUERY_KEY = ['products'];

/**
 * Hook to fetch all products
 * Provides automatic caching, refetching, and loading states
 */
export const useProducts = () => {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: getProducts,
  });
};
