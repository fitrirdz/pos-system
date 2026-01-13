import { Request, Response } from 'express';
import prisma from '../lib/prisma';

/**
 * CREATE PRODUCT
 */
export async function createProduct(req: Request, res: Response) {
  try {
    const { code, name, price, stock } = req.body;

    if (!code || !name || !price || !stock) {
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
      },
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
export async function getProducts(_: Request, res: Response) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' },
    });

    return res.status(200).json(products);
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
