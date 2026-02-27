import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../api/dashboard.api';

/**
 * Query key for dashboard stats
 */
export const DASHBOARD_STATS_QUERY_KEY = ['dashboard', 'stats'];

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
