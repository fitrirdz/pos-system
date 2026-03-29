"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
/**
 * Get all users (for admin filter)
 */
const getUsers = async (_req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            select: {
                id: true,
                username: true,
                role: true,
            },
            orderBy: {
                username: 'asc',
            },
        });
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch users',
        });
    }
};
exports.getUsers = getUsers;
