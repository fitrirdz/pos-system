import { Request, Response } from 'express';
import prisma from '../lib/prisma';

/**
 * Create new transaction (sales)
 */
export const createTransaction = async (req: Request, res: Response) => {
  try {
    /**
     * Default type = SALE
     * UI belum kirim type juga aman
     */
    const { type = 'SALE', items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Items is required',
      });
    }

    const transaction = await prisma.$transaction(async (tx) => {
      /**
       * 1️⃣ Ambil setting tax (global)
       */
      const setting = await tx.setting.findUnique({
        where: { id: 1 },
      });

      const taxRate = setting?.taxRate || 0;

      /**
       * 2️⃣ Ambil product berdasarkan CODE
       */
      const products = await tx.product.findMany({
        where: {
          code: {
            in: items.map((i) => i.code),
          },
        },
      });

      const productMap = new Map(products.map((p) => [p.code, p]));

      /**
       * 3️⃣ Ambil discount per product
       */
      const discounts = await tx.discount.findMany({
        where: {
          productCode: {
            in: items.map((i) => i.code),
          },
        },
      });

      const discountMap = new Map(
        discounts.map((d) => [d.productCode, d.percentage]),
      );

      let subtotal = 0;
      let discountTotal = 0;

      /**
       * 4️⃣ Validasi & hitung subtotal + discount
       */
      for (const item of items) {
        const product = productMap.get(item.code);

        if (!product) {
          throw new Error(`Product not found: ${item.code}`);
        }

        if (type === 'SALE' && product.stock < item.qty) {
          throw new Error(`Stock not enough for ${product.name}`);
        }

        const itemTotal = product.price * item.qty;
        subtotal += itemTotal;

        if (type === 'SALE') {
          const discountPercent = discountMap.get(item.code) || 0;
          const discountAmount = itemTotal * (discountPercent / 100);
          discountTotal += discountAmount;
        }
      }

      /**
       * 5️⃣ Hitung tax & total
       * STOCK_IN tidak kena tax & discount
       */
      let tax = 0;
      let total = subtotal;

      if (type === 'SALE') {
        const taxableAmount = subtotal - discountTotal;
        tax = taxableAmount * (taxRate / 100);
        total = taxableAmount + tax;
      }

      /**
       * 6️⃣ Create transaction
       */
      const createdTransaction = await tx.transaction.create({
        data: {
          type,
          subtotal,
          discountTotal,
          tax,
          total,
        },
      });

      /**
       * 7️⃣ Create items + update stock
       */
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

        const stockChange = type === 'SALE' ? -item.qty : item.qty;

        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              increment: stockChange,
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
