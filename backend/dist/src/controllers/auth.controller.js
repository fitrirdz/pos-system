"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.logout = logout;
exports.me = me;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const jwt_1 = require("../utils/jwt");
async function login(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required',
            });
        }
        const user = await prisma_1.default.user.findUnique({
            where: { username },
        });
        if (!user) {
            return res.status(401).json({
                message: 'Username or password is incorrect',
            });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Username or password is incorrect',
            });
        }
        const token = (0, jwt_1.signToken)({
            userId: user.id,
            username: user.username,
            role: user.role,
        });
        // ✅ Simpan token di httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // ganti true kalau production HTTPS
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24, // 1 hari
        });
        return res.json({
            message: 'Login success',
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
}
function logout(req, res) {
    res.clearCookie('token');
    return res.json({ message: 'Logged out successfully' });
}
function me(req, res) {
    return res.json({
        user: req.user,
    });
}
