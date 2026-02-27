import api from './axios';

export interface DashboardStats {
  totalSalesToday: number;
  totalTransactionsToday: number;
  lowStockProducts: Array<{
    id: string;
    code: string;
    name: string;
    stock: number;
    price: number;
    category: {
      id: string;
      name: string;
    };
  }>;
  outOfStockProducts: Array<{
    id: string;
    code: string;
    name: string;
    stock: number;
    price: number;
    category: {
      id: string;
      name: string;
    };
  }>;
  recentTransactions: Array<{
    id: string;
    type: string;
    total: number;
    createdAt: string;
    cashier: {
      username: string;
    };
  }>;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await api.get('/dashboard/stats');
  return res.data;
};
