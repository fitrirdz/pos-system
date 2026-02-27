"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = createCategory;
exports.getCategories = getCategories;
const prisma_1 = __importDefault(require("../lib/prisma"));
/**
 * CREATE CATEGORY
 */
async function createCategory(req, res) {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                message: 'Category name is required',
            });
        }
        const exists = await prisma_1.default.category.findUnique({
            where: { name: name.toLowerCase() },
        });
        if (exists) {
            return res.status(409).json({
                message: 'Category name already exists',
            });
        }
        const category = await prisma_1.default.category.create({
            data: {
                name,
            },
        });
        return res.status(201).json(category);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
}
/**
 * GET ALL CATEGORIES
 */
async function getCategories(_, res) {
    try {
        const categories = await prisma_1.default.category.findMany({
            orderBy: { name: 'asc' },
        });
        return res.status(200).json(categories);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
}
