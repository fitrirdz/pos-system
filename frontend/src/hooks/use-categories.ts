import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/category.api';

/**
 * Query key for categories
 * Used for cache identification and invalidation
 */
export const CATEGORIES_QUERY_KEY = ['categories'];

/**
 * Hook to fetch all categories
 * Provides automatic caching, refetching, and loading states
 */
export const useCategories = () => {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: getCategories,
  });
};
