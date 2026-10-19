const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Hide Express fingerprint
app.disable("x-powered-by");

// Security Headers Middleware
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
});

// CORS configuration supporting credentials and custom headers
const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map(url => url.trim()) : ["*"];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS policy blocked access from this origin."));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-guest-token"]
}));

app.use(express.json({ limit: "1mb" }));

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Trendora API is running!"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Backend is healthy"
    });
});

// Centralized safe error handler (prevents stack trace leaks)
app.use((err, req, res, next) => {
    console.error("Unhandled API Error:", err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "An unexpected internal server error occurred."
    });
});

async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Trendora API running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start Trendora API:", error.message);
        process.exit(1);
    }
}

startServer();
