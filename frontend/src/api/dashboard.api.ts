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

export interface MonthlySales {
  totalSalesThisMonth: number;
  totalTransactionsThisMonth: number;
  month: string;
}

export interface SevenDaySales {
  date: string;
  sales: number;
  transactions: number;
}

export interface TopProduct {
  id: string;
  code: string;
  name: string;
  price: number;
  category: {
    id: string;
    name: string;
  };
  totalQuantity: number;
  totalRevenue: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await api.get('/dashboard/stats');
  return res.data;
};

export const getMonthlySales = async (): Promise<MonthlySales> => {
  const res = await api.get('/dashboard/monthly-sales');
  return res.data;
};

export const getSevenDaySales = async (): Promise<SevenDaySales[]> => {
  const res = await api.get('/dashboard/seven-day-sales');
  return res.data;
};

export const getTopSellingProducts = async (
  limit: number = 5,
): Promise<TopProduct[]> => {
  const res = await api.get('/dashboard/top-products', { params: { limit } });
  return res.data;
};
