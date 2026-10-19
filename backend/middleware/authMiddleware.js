const jwt = require("jsonwebtoken");
const User = require("../models/user");

/**
 * Strict authentication middleware.
 * Verifies Bearer token, checks user existence in MongoDB, and attaches user to req.user.
 */
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please provide a valid Bearer token."
            });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token missing."
            });
        }

        const secret = process.env.JWT_SECRET || "fallback_development_secret";
        const decoded = jwt.verify(token, secret);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "The user belonging to this token no longer exists."
            });
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired. Please sign in again."
            });
        }
        return res.status(401).json({
            success: false,
            message: "Invalid authentication token."
        });
    }
};

/**
 * Optional authentication middleware.
 * If Bearer token is provided, verifies it and sets req.user.
 * If not provided or invalid, req.user remains null without failing the request.
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            if (token) {
                const secret = process.env.JWT_SECRET || "fallback_development_secret";
                const decoded = jwt.verify(token, secret);
                const user = await User.findById(decoded.id).select("-password");
                if (user) {
                    req.user = user;
                }
            }
        }
    } catch (err) {
        // Continue unauthenticated
        req.user = null;
    }
    next();
};

module.exports = {
    requireAuth,
    optionalAuth
};
