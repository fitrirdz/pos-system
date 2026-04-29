"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.deactivateUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const VALID_ROLES = ['ADMIN', 'CASHIER'];
function isValidRole(role) {
    return typeof role === 'string' && VALID_ROLES.includes(role);
}
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
                isActive: true,
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
const createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required',
            });
        }
        if (role && !isValidRole(role)) {
            return res.status(400).json({
                message: 'Invalid role',
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const nextRole = role && isValidRole(role) ? role : 'CASHIER';
        const user = await prisma_1.default.user.create({
            data: {
                username: username.trim(),
                password: hashedPassword,
                role: nextRole,
            },
            select: {
                id: true,
                username: true,
                role: true,
                isActive: true,
            },
        });
        return res.status(201).json(user);
    }
    catch (error) {
        if (error?.code === 'P2002') {
            return res.status(409).json({ message: 'Username already exists' });
        }
        return res.status(500).json({
            message: 'Failed to create user',
        });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const id = String(req.params.id ?? '');
        const { username, password } = req.body;
        if (!username && !password) {
            return res.status(400).json({
                message: 'At least one field is required',
            });
        }
        const data = {};
        if (username) {
            data.username = username.trim();
        }
        if (password) {
            data.password = await bcrypt_1.default.hash(password, 10);
        }
        const user = await prisma_1.default.user.update({
            where: { id },
            data,
            select: {
                id: true,
                username: true,
                role: true,
                isActive: true,
            },
        });
        return res.status(200).json(user);
    }
    catch (error) {
        if (error?.code === 'P2002') {
            return res.status(409).json({ message: 'Username already exists' });
        }
        if (error?.code === 'P2025') {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(500).json({
            message: 'Failed to update user',
        });
    }
};
exports.updateUser = updateUser;
const deactivateUser = async (req, res) => {
    try {
        const id = String(req.params.id ?? '');
        if (req.user?.userId === id) {
            return res.status(400).json({
                message: 'You cannot deactivate your own account',
            });
        }
        const user = await prisma_1.default.user.update({
            where: { id },
            data: { isActive: false },
            select: {
                id: true,
                username: true,
                role: true,
                isActive: true,
            },
        });
        return res.status(200).json(user);
    }
    catch (error) {
        if (error?.code === 'P2025') {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(500).json({
            message: 'Failed to deactivate user',
        });
    }
};
exports.deactivateUser = deactivateUser;
const updateUserRole = async (req, res) => {
    try {
        const id = String(req.params.id ?? '');
        const { role } = req.body;
        if (!role || !isValidRole(role)) {
            return res.status(400).json({
                message: 'Invalid role',
            });
        }
        const user = await prisma_1.default.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                username: true,
                role: true,
                isActive: true,
            },
        });
        return res.status(200).json(user);
    }
    catch (error) {
        if (error?.code === 'P2025') {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(500).json({
            message: 'Failed to update user role',
        });
    }
};
exports.updateUserRole = updateUserRole;
