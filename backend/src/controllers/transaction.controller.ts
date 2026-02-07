import { Request, Response } from 'express';
import prisma from '../lib/prisma';

/**
 * Create new transaction (sales)
 */
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items is required' });
    }

    const transaction = await prisma.$transaction(async (tx) => {
      // 1️⃣ Ambil product berdasarkan CODE
      const products = await tx.product.findMany({
        where: {
          code: {
            in: items.map((i) => i.code),
          },
        },
      });

      const productMap = new Map(products.map((p) => [p.code, p]));

      let total = 0;

      // 2️⃣ Validasi stock + hitung total
      for (const item of items) {
        const product = productMap.get(item.code);

        if (!product) {
          throw new Error(`Product not found: ${item.code}`);
        }

        if (product.stock < item.qty) {
          throw new Error(`Stock not enough for product: ${product.name}`);
        }

        total += product.price * item.qty;
      }

      // 3️⃣ Create transaction
      const createdTransaction = await tx.transaction.create({
        data: {
          total,
          tax: 0,
        },
      });

      // 4️⃣ Create items + update stock
      for (const item of items) {
        const product = productMap.get(item.code)!;

        await tx.transactionItem.create({
          data: {
            transactionId: createdTransaction.id,
            productId: product.id,
            qty: item.qty,
            price: product.price,
          },
        });

        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: item.qty,
            },
          },
        });
      }

      return createdTransaction;
    });

    return res.status(201).json({
      message: 'Transaction created',
      data: transaction,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || 'Failed to create transaction',
    });
  }
};

/**
 * Get transaction history
 */
export const getTransactions = async (_req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json({
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch transactions',
    });
  }
};

/**
 * Get transaction detail
 */
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id: Array.isArray(id) ? id[0] : id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!transaction) {
      return res.status(404).json({
        message: 'Transaction not found',
      });
    }

    return res.json({
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch transaction',
    });
  }
};
