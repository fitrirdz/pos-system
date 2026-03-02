import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/user.api';

/**
 * Query key for users
 */
export const USERS_QUERY_KEY = ['users'];

/**
 * Hook to fetch all users (admin only)
 */
export const useUsers = () => {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: getUsers,
  });
};
