"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = createProduct;
exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const prisma_1 = __importDefault(require("../lib/prisma"));
/**
 * CREATE PRODUCT
 */
async function createProduct(req, res) {
    try {
        const { code, name, price, stock, categoryId } = req.body;
        if (!code || !name || !price || !stock || !categoryId) {
            return res.status(400).json({
                message: 'All fields are required',
            });
        }
        const exists = await prisma_1.default.product.findUnique({
            where: { code },
        });
        if (exists) {
            return res.status(409).json({
                message: 'Product code already exists',
            });
        }
        const product = await prisma_1.default.product.create({
            data: {
                code,
                name,
                price: Number(price),
                stock: Number(stock),
                categoryId,
            },
        });
        return res.status(201).json(product);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
}
/**
 * GET ALL PRODUCTS
 */
async function getProducts(_, res) {
    try {
        const products = await prisma_1.default.product.findMany({
            orderBy: { name: 'asc' },
            include: {
                category: true,
            },
        });
        return res.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
}
/**
 * GET PRODUCT BY ID
 */
async function getProductById(req, res) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!id) {
            return res.status(400).json({
                message: 'Product ID is required',
            });
        }
        const product = await prisma_1.default.product.findUnique({
            where: { id },
        });
        if (!product) {
            return res.status(404).json({
                message: 'Product not found',
            });
        }
        return res.status(200).json(product);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
}
/**
 * UPDATE PRODUCT
 */
async function updateProduct(req, res) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { code, name, price, stock } = req.body;
        const product = await prisma_1.default.product.findUnique({
            where: { id },
        });
        if (!product) {
            return res.status(404).json({
                message: 'Product not found',
            });
        }
        const updatedProduct = await prisma_1.default.product.update({
            where: { id },
            data: {
                code: code ?? product.code,
                name: name ?? product.name,
                price: price ? Number(price) : product.price,
                stock: stock ? Number(stock) : product.stock,
            },
        });
        return res.status(200).json(updatedProduct);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
}
/**
 * DELETE PRODUCT
 */
async function deleteProduct(req, res) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!id) {
            return res.status(400).json({
                message: 'Product ID is required',
            });
        }
        const product = await prisma_1.default.product.findUnique({
            where: { id },
        });
        if (!product) {
            return res.status(404).json({
                message: 'Product not found',
            });
        }
        await prisma_1.default.product.delete({
            where: { id },
        });
        return res.status(200).json({
            message: 'Product deleted successfully',
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
}
