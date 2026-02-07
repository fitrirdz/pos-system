import { Request, Response } from 'express';
import prisma from '../lib/prisma';

/**
 * CREATE CATEGORY
 */
export async function createCategory(req: Request, res: Response) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'Category name is required',
      });
    }

    const exists = await prisma.category.findUnique({
      where: { name: name.toLowerCase() },
    });

    if (exists) {
      return res.status(409).json({
        message: 'Category name already exists',
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return res.status(201).json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

/**
 * GET ALL CATEGORIES
 */
export async function getCategories(_: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
