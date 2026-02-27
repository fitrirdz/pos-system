"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jwt_1 = require("../utils/jwt");
function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        // attach user ke request
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: 'Invalid token',
        });
    }
}
