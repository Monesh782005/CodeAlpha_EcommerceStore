const express = require("express");
const router = express.Router();
const {
    createOrder,
    createRazorpayOrder,
    verifyRazorpayPayment,
    getMyOrders,
    getMyOrderDetails,
    getOrderById
} = require("../controllers/orderController");
const { requireAuth, optionalAuth } = require("../middleware/authMiddleware");

// Authenticated user order history routes (must precede /:orderId to prevent route conflict)
router.get("/my-orders", requireAuth, getMyOrders);
router.get("/my-orders/:orderId", requireAuth, getMyOrderDetails);

// Order creation & lookup
router.post("/", optionalAuth, createOrder);
router.get("/:orderId", optionalAuth, getOrderById);

// Razorpay test mode payment endpoints
router.post("/:orderId/razorpay-order", optionalAuth, createRazorpayOrder);
router.post("/:orderId/verify-payment", optionalAuth, verifyRazorpayPayment);

module.exports = router;
