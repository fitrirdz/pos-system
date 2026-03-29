import { useQuery } from '@tanstack/react-query';
import {
  getProducts,
  getProductsPaginated,
  type GetProductsPaginatedParams,
  type GetProductsPaginatedResponse,
} from '../api/product.api';
import type { Product } from '../interfaces';

/**
 * Query key for products
 * Used for cache identification and invalidation
 */
export const PRODUCTS_QUERY_KEY = ['products'];
export const PRODUCTS_PAGINATED_QUERY_KEY = ['products', 'paginated'];

/**
 * Hook to fetch all products
 * Provides automatic caching, refetching, and loading states
 */
export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: getProducts,
  });
};

export const useProductsPaginated = (params: GetProductsPaginatedParams) => {
  return useQuery<GetProductsPaginatedResponse>({
    queryKey: [...PRODUCTS_PAGINATED_QUERY_KEY, params],
    queryFn: () => getProductsPaginated(params),
  });
};
