const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Helper to generate signed JWT
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || "fallback_development_secret";
    return jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
};

/**
 * POST /api/auth/register
 * Registers a new user with name, email, and password.
 */
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validation
        if (!name || name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Full name must be at least 2 characters."
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address."
            });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // 2. Duplicate Check
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        // 3. Create User (password hashed via schema pre-save)
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password
        });

        // 4. Generate JWT
        const token = generateToken(user._id);

        return res.status(201).json({
            success: true,
            message: "Account registered successfully.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        // Handle Mongoose duplicate key error (E11000)
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Registration failed.",
            error: error.message
        });
    }
};

/**
 * POST /api/auth/login
 * Authenticates user credentials and returns a JWT.
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            message: "Signed in successfully.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed.",
            error: error.message
        });
    }
};

/**
 * GET /api/auth/me
 * Protected endpoint returning the authenticated user's profile.
 */
const getMe = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                createdAt: req.user.createdAt
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user profile.",
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getMe
};
