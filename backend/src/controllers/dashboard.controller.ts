import { Request, Response } from 'express';
import prisma from '../lib/prisma';

/**
 * Helper: Fetch sales transactions within a date range
 */
const getSalesTransactions = async (startDate: Date, endDate: Date) => {
  return await prisma.transaction.findMany({
    where: {
      type: 'SALE',
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
    select: {
      total: true,
    },
  });
};

/**
 * Get dashboard statistics
 * - Total sales today
 * - Total transactions today (SALE only)
 * - Low stock products
 * - Out of stock products
 */
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's transactions (SALE only)
    const todayTransactions = await getSalesTransactions(today, tomorrow);

    // Calculate total sales and count
    const totalSalesToday = todayTransactions.reduce(
      (sum, t) => sum + t.total,
      0,
    );
    const totalTransactionsToday = todayTransactions.length;

    // Get low stock products (stock <= 10 and > 0)
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lte: 10,
          gt: 0,
        },
      },
      select: {
        id: true,
        code: true,
        name: true,
        stock: true,
        price: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        stock: 'asc',
      },
    });

    // Get out of stock products (stock = 0)
    const outOfStockProducts = await prisma.product.findMany({
      where: {
        stock: 0,
      },
      select: {
        id: true,
        code: true,
        name: true,
        stock: true,
        price: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Get recent transactions (latest 5)
    const transactionsWithCashier = await prisma.transaction.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Manually fetch cashier info for each transaction
    const recentTransactions = await Promise.all(
      transactionsWithCashier.map(async (transaction: any) => {
        const cashier = await prisma.user.findUnique({
          where: { id: transaction.userId },
          select: { username: true },
        });
        return {
          id: transaction.id,
          type: transaction.type,
          total: transaction.total,
          createdAt: transaction.createdAt,
          cashier: { username: cashier?.username || 'Unknown' },
        };
      }),
    );

    return res.json({
      totalSalesToday,
      totalTransactionsToday,
      lowStockProducts,
      outOfStockProducts,
      recentTransactions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

/**
 * Get sales this month
 */
export const getMonthlySales = async (req: Request, res: Response) => {
  try {
    // Get current month's date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Get month's transactions (SALE only)
    const monthTransactions = await getSalesTransactions(
      startOfMonth,
      endOfMonth,
    );

    // Calculate total sales and count
    const totalSalesThisMonth = monthTransactions.reduce(
      (sum, t) => sum + t.total,
      0,
    );
    const totalTransactionsThisMonth = monthTransactions.length;

    return res.json({
      totalSalesThisMonth,
      totalTransactionsThisMonth,
      month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

/**
 * Get 7-day sales data for chart
 */
export const getSevenDaySales = async (req: Request, res: Response) => {
  try {
    const salesData = [];
    const now = new Date();

    // Get data for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);

      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      // Get transactions for this day (SALE only)
      const dayTransactions = await getSalesTransactions(day, nextDay);

      const totalSales = dayTransactions.reduce((sum, t) => sum + t.total, 0);

      salesData.push({
        date: day.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        sales: totalSales,
        transactions: dayTransactions.length,
      });
    }

    return res.json(salesData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

/**
 * Get top selling products
 */
export const getTopSellingProducts = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;

    // Get all transaction items
    const transactionItems = await prisma.transactionItem.findMany({
      where: {
        transaction: {
          type: 'SALE',
        },
      },
      select: {
        productId: true,
        qty: true,
        product: {
          select: {
            id: true,
            code: true,
            name: true,
            price: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Aggregate sales by product
    const productSales = new Map<
      string,
      {
        product: any;
        totalQuantity: number;
        totalRevenue: number;
      }
    >();

    transactionItems.forEach((item) => {
      const existing = productSales.get(item.productId);
      const revenue = item.qty * item.product.price;

      if (existing) {
        existing.totalQuantity += item.qty;
        existing.totalRevenue += revenue;
      } else {
        productSales.set(item.productId, {
          product: item.product,
          totalQuantity: item.qty,
          totalRevenue: revenue,
        });
      }
    });

    // Convert to array and sort by quantity
    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit)
      .map((item) => ({
        ...item.product,
        totalQuantity: item.totalQuantity,
        totalRevenue: item.totalRevenue,
      }));

    return res.json(topProducts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
