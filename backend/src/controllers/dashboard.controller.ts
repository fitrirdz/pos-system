import { Request, Response } from 'express';
import prisma from '../lib/prisma';

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
    const todayTransactions = await prisma.transaction.findMany({
      where: {
        type: 'SALE',
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      select: {
        total: true,
      },
    });

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

    return res.json({
      totalSalesToday,
      totalTransactionsToday,
      lowStockProducts,
      outOfStockProducts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
