import { useQuery } from '@tanstack/react-query';
import {
  getDashboardStats,
  getMonthlySales,
  getSevenDaySales,
  getTopSellingProducts,
} from '../api/dashboard.api';

/**
 * Query key for dashboard stats
 */
export const DASHBOARD_STATS_QUERY_KEY = ['dashboard', 'stats'];
export const MONTHLY_SALES_QUERY_KEY = ['dashboard', 'monthly-sales'];
export const SEVEN_DAY_SALES_QUERY_KEY = ['dashboard', 'seven-day-sales'];
export const TOP_PRODUCTS_QUERY_KEY = ['dashboard', 'top-products'];

/**
 * Hook to fetch dashboard statistics
 * Provides real-time updates with automatic refetching
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: DASHBOARD_STATS_QUERY_KEY,
    queryFn: getDashboardStats,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    refetchIntervalInBackground: false, // Don't poll when tab is hidden
  });
};

/**
 * Hook to fetch monthly sales data
 */
export const useMonthlySales = () => {
  return useQuery({
    queryKey: MONTHLY_SALES_QUERY_KEY,
    queryFn: getMonthlySales,
    refetchInterval: 60000, // Refetch every minute
    refetchIntervalInBackground: false,
  });
};

/**
 * Hook to fetch 7-day sales data for chart
 */
export const useSevenDaySales = () => {
  return useQuery({
    queryKey: SEVEN_DAY_SALES_QUERY_KEY,
    queryFn: getSevenDaySales,
    refetchInterval: 60000, // Refetch every minute
    refetchIntervalInBackground: false,
  });
};

/**
 * Hook to fetch top selling products
 */
export const useTopSellingProducts = (limit: number = 5) => {
  return useQuery({
    queryKey: [...TOP_PRODUCTS_QUERY_KEY, limit],
    queryFn: () => getTopSellingProducts(limit),
    refetchInterval: 60000, // Refetch every minute
    refetchIntervalInBackground: false,
  });
};
