import { Request, Response } from 'express';
import type { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';

const PRODUCT_WITH_CATEGORY_SELECT = {
  id: true,
  code: true,
  name: true,
  price: true,
  stock: true,
  createdAt: true,
  updatedAt: true,
  categoryId: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.ProductSelect;

/**
 * CREATE PRODUCT
 */
export async function createProduct(req: Request, res: Response) {
  try {
    const { code, name, price, stock, categoryId } = req.body;

    if (!code || !name || !price || !stock || !categoryId) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const exists = await prisma.product.findUnique({
      where: { code },
    });

    if (exists) {
      return res.status(409).json({
        message: 'Product code already exists',
      });
    }

    const product = await prisma.product.create({
      data: {
        code,
        name,
        price: Number(price),
        stock: Number(stock),
        categoryId,
      },
      select: PRODUCT_WITH_CATEGORY_SELECT,
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

/**
 * GET ALL PRODUCTS
 */
export async function getProducts(req: Request, res: Response) {
  try {
    const pageQuery = Array.isArray(req.query.page)
      ? req.query.page[0]
      : req.query.page;
    const limitQuery = Array.isArray(req.query.limit)
      ? req.query.limit[0]
      : req.query.limit;
    const searchQuery = Array.isArray(req.query.search)
      ? req.query.search[0]
      : req.query.search;

    const hasQueryFilters =
      pageQuery !== undefined ||
      limitQuery !== undefined ||
      (typeof searchQuery === 'string' && searchQuery.trim() !== '');

    // Backward compatible response for existing consumers that expect full array.
    if (!hasQueryFilters) {
      const products = await prisma.product.findMany({
        orderBy: { name: 'asc' },
        select: PRODUCT_WITH_CATEGORY_SELECT,
      });

      return res.status(200).json(products);
    }

    const parsedPage = Number(pageQuery);
    const parsedLimit = Number(limitQuery);

    const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
    const limitBase =
      Number.isNaN(parsedLimit) || parsedLimit < 1 ? 10 : parsedLimit;
    const limit = Math.min(limitBase, 100);
    const search = typeof searchQuery === 'string' ? searchQuery.trim() : '';

    const where: Prisma.ProductWhereInput = search
      ? {
          OR: [
            { code: { contains: search } },
            { name: { contains: search } },
          ],
        }
      : {};

    const [total, products] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        select: PRODUCT_WITH_CATEGORY_SELECT,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return res.status(200).json({
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

/**
 * GET PRODUCT BY ID
 */
export async function getProductById(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      return res.status(400).json({
        message: 'Product ID is required',
      });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      select: PRODUCT_WITH_CATEGORY_SELECT,
    });

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

/**
 * UPDATE PRODUCT
 */
export async function updateProduct(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { code, name, price, stock } = req.body;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        code: code ?? product.code,
        name: name ?? product.name,
        price: price ? Number(price) : product.price,
        stock: stock ? Number(stock) : product.stock,
      },
      select: PRODUCT_WITH_CATEGORY_SELECT,
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

/**
 * DELETE PRODUCT
 */
export async function deleteProduct(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      return res.status(400).json({
        message: 'Product ID is required',
      });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    await prisma.product.delete({
      where: { id },
    });

    return res.status(200).json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
