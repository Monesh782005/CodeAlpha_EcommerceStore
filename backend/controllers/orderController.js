const crypto = require("crypto");
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

// Delivery configuration
const STANDARD_DELIVERY_FEE = 99;

// Valid promo codes configuration
const VALID_PROMOS = {
    SHOP20: 20,
    SALE20: 20,
    VIP30: 30
};

/**
 * POST /api/orders
 * Creates an order, validates customer details, items, prices, and stock atomically.
 */
const createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const { customer, shippingAddress, items, promoCode, paymentMethod } = req.body;

        // 1. Validate Customer Information
        if (!customer || !customer.name || !customer.email || !customer.phone) {
            return res.status(400).json({
                success: false,
                message: "Customer name, valid email, and phone number are required."
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customer.email.trim())) {
            return res.status(400).json({
                success: false,
                message: "A valid email address is required."
            });
        }

        // 2. Validate Shipping Address
        if (
            !shippingAddress ||
            !shippingAddress.address ||
            !shippingAddress.city ||
            !shippingAddress.state ||
            !shippingAddress.postalCode ||
            !shippingAddress.country
        ) {
            return res.status(400).json({
                success: false,
                message: "Complete shipping address (address, city, state, postalCode, country) is required."
            });
        }

        // 3. Validate Cart Items
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order items list cannot be empty."
            });
        }

        // 4. Validate and Deduct Stock Atomic Operation
        let orderDoc = null;
        let finalSubtotal = 0;
        let finalDiscount = 0;
        let finalDelivery = 0;
        let finalGrandTotal = 0;
        const verifiedOrderItems = [];
        const deductedProducts = [];

        // Check if replica set transactions are supported
        let transactionSupported = true;
        try {
            session.startTransaction();
        } catch (txnErr) {
            transactionSupported = false;
        }

        try {
            for (const item of items) {
                const reqId = item.id || item.productId;
                const reqQty = parseInt(item.quantity, 10);

                if (!reqId || isNaN(reqQty) || reqQty < 1) {
                    throw new Error(`Invalid item or quantity for product ${reqId || "unknown"}.`);
                }

                // Query product from MongoDB by productId or _id
                let productDoc = null;
                if (mongoose.Types.ObjectId.isValid(reqId)) {
                    productDoc = await Product.findById(reqId).session(transactionSupported ? session : null);
                }
                if (!productDoc) {
                    productDoc = await Product.findOne({ productId: reqId }).session(transactionSupported ? session : null);
                }

                if (!productDoc) {
                    throw new Error(`Product "${item.name || reqId}" does not exist in our catalog.`);
                }

                // Check stock availability
                const currentStock = typeof productDoc.stock === "number" ? productDoc.stock : 0;
                if (currentStock < reqQty) {
                    throw new Error(
                        `Insufficient stock for "${productDoc.name}". Requested: ${reqQty}, Available: ${currentStock}.`
                    );
                }

                // Atomic decrement
                const updateRes = await Product.updateOne(
                    { _id: productDoc._id, stock: { $gte: reqQty } },
                    { $inc: { stock: -reqQty } },
                    transactionSupported ? { session } : {}
                );

                if (updateRes.modifiedCount === 0) {
                    throw new Error(`Stock for "${productDoc.name}" changed during processing. Please try again.`);
                }

                deductedProducts.push({ _id: productDoc._id, quantity: reqQty });

                // Use trusted server-side price from MongoDB
                const unitPrice = productDoc.price;
                finalSubtotal += unitPrice * reqQty;

                verifiedOrderItems.push({
                    productId: productDoc.productId || String(productDoc._id),
                    name: productDoc.name,
                    price: unitPrice,
                    quantity: reqQty,
                    size: item.size || "Standard",
                    color: item.color || "Default",
                    image: productDoc.image || item.image || ""
                });
            }

            // Calculate Discount
            let discountPercent = 0;
            const cleanedPromo = (promoCode || "").trim().toUpperCase();
            if (cleanedPromo && VALID_PROMOS[cleanedPromo]) {
                discountPercent = VALID_PROMOS[cleanedPromo];
            }
            finalDiscount = Math.round(finalSubtotal * (discountPercent / 100));

            // Delivery Fee
            finalDelivery = finalSubtotal > 0 ? STANDARD_DELIVERY_FEE : 0;

            // Grand Total
            finalGrandTotal = Math.max(0, finalSubtotal - finalDiscount + finalDelivery);

            // Generate Order ID (e.g. TRN-8F92A1)
            const randomCode = crypto.randomBytes(3).toString("hex").toUpperCase();
            const orderId = `TRN-${Date.now().toString().slice(-4)}${randomCode}`;

            // Generate guest access token if not authenticated
            const guestAccessToken = !req.user ? crypto.randomBytes(24).toString("hex") : null;

            // Create Order in MongoDB
            const orderData = {
                orderId,
                user: req.user ? req.user._id : null,
                guestAccessToken,
                customer: {
                    name: customer.name.trim(),
                    email: customer.email.trim(),
                    phone: customer.phone.trim()
                },
                shippingAddress: {
                    address: shippingAddress.address.trim(),
                    city: shippingAddress.city.trim(),
                    state: shippingAddress.state.trim(),
                    postalCode: shippingAddress.postalCode.trim(),
                    country: shippingAddress.country.trim()
                },
                items: verifiedOrderItems,
                subtotal: finalSubtotal,
                discountAmount: finalDiscount,
                deliveryFee: finalDelivery,
                totalAmount: finalGrandTotal,
                promoCode: cleanedPromo || null,
                paymentMethod: paymentMethod === "cod_payment" ? "cod_payment" : (paymentMethod === "demo_payment" ? "demo_payment" : "razorpay"),
                paymentStatus: "pending",
                orderStatus: "pending"
            };

            const created = await Order.create([orderData], transactionSupported ? { session } : {});
            orderDoc = Array.isArray(created) ? created[0] : created;

            if (transactionSupported) {
                await session.commitTransaction();
            }
        } catch (innerErr) {
            if (transactionSupported) {
                await session.abortTransaction();
            } else {
                // Compensating rollback for standalone MongoDB
                for (const item of deductedProducts) {
                    await Product.updateOne({ _id: item._id }, { $inc: { stock: item.quantity } });
                }
            }
            throw innerErr;
        } finally {
            session.endSession();
        }

        return res.status(201).json({
            success: true,
            message: "Order placed successfully (Pending payment verification).",
            order: {
                orderId: orderDoc.orderId,
                guestAccessToken: orderDoc.guestAccessToken || undefined,
                status: orderDoc.orderStatus,
                paymentStatus: orderDoc.paymentStatus,
                paymentMethod: orderDoc.paymentMethod,
                customer: orderDoc.customer,
                shippingAddress: orderDoc.shippingAddress,
                items: orderDoc.items,
                subtotal: orderDoc.subtotal,
                discountAmount: orderDoc.discountAmount,
                deliveryFee: orderDoc.deliveryFee,
                totalAmount: orderDoc.totalAmount,
                createdAt: orderDoc.createdAt
            }
        });
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
            session.endSession();
        }
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to process order."
        });
    }
};

/**
 * Helper to verify order ownership.
 * Returns true if requester is the authenticated user or provides the valid guestAccessToken.
 */
const verifyOrderAccess = (order, req) => {
    // If order belongs to an authenticated user
    if (order.user) {
        return !!(req.user && String(order.user) === String(req.user._id));
    }
    // If guest order, verify guest token passed via header or query
    const tokenFromHeader = req.headers?.["x-guest-token"];
    const tokenFromQuery = req.query?.guestToken;
    const tokenFromBody = req.body?.guestToken;
    const providedToken = tokenFromHeader || tokenFromQuery || tokenFromBody;

    if (order.guestAccessToken && providedToken) {
        return order.guestAccessToken === providedToken;
    }
    return false;
};

/**
 * POST /api/orders/:orderId/razorpay-order
 * Generates or retrieves a Razorpay order for an existing pending Trendora order.
 * Calculates amount strictly from server-stored order in MongoDB.
 */
const createRazorpayOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOne({ orderId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        // Strict ownership verification (for both authenticated user and guest orders)
        if (!verifyOrderAccess(order, req)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to access or initiate payment for this order."
            });
        }

        // Prevent duplicate payment creation for already paid orders
        if (order.paymentStatus === "paid") {
            return res.status(400).json({
                success: false,
                message: "This order has already been paid."
            });
        }

        const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder_key";
        const keySecret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_placeholder_secret";

        // Amount in paise (1 INR = 100 paise)
        const amountInPaise = Math.round(order.totalAmount * 100);

        // Check if an active Razorpay order ID already exists on this order
        let rzpOrderId = order.paymentDetails?.razorpayOrderId;

        // If credentials are real and not placeholder, call Razorpay API
        if (
            process.env.RAZORPAY_KEY_ID &&
            process.env.RAZORPAY_KEY_SECRET &&
            !process.env.RAZORPAY_KEY_ID.includes("placeholder")
        ) {
            try {
                const https = require("https");
                const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
                const postPayload = JSON.stringify({
                    amount: amountInPaise,
                    currency: "INR",
                    receipt: order.orderId,
                    notes: {
                        trendoraOrderId: order.orderId,
                        customerEmail: order.customer?.email || ""
                    }
                });

                const rzpRes = await new Promise((resolve, reject) => {
                    const rzpReq = https.request(
                        {
                            hostname: "api.razorpay.com",
                            port: 443,
                            path: "/v1/orders",
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Content-Length": Buffer.byteLength(postPayload),
                                Authorization: authHeader
                            }
                        },
                        (resp) => {
                            let respBody = "";
                            resp.on("data", chunk => respBody += chunk);
                            resp.on("end", () => resolve({ status: resp.statusCode, body: respBody }));
                        }
                    );
                    rzpReq.on("error", reject);
                    rzpReq.write(postPayload);
                    rzpReq.end();
                });

                if (rzpRes.status === 200 || rzpRes.status === 201) {
                    const parsed = JSON.parse(rzpRes.body);
                    rzpOrderId = parsed.id;
                } else {
                    console.warn("Razorpay API returned error status:", rzpRes.status, rzpRes.body);
                }
            } catch (apiErr) {
                console.warn("Razorpay API request error:", apiErr.message);
            }
        }

        // If not generated via live API (or in local test mode), generate standard deterministic Razorpay order ID
        if (!rzpOrderId) {
            const hash = crypto.createHash("md5").update(`${order.orderId}_${order.totalAmount}`).digest("hex").slice(0, 14);
            rzpOrderId = `order_${hash}`;
        }

        // Save generated razorpayOrderId
        order.paymentDetails = {
            ...(order.paymentDetails || {}),
            razorpayOrderId: rzpOrderId
        };
        await order.save();

        return res.status(200).json({
            success: true,
            keyId: keyId,
            orderId: order.orderId,
            razorpayOrderId: rzpOrderId,
            amount: amountInPaise,
            currency: "INR",
            customer: {
                name: order.customer.name,
                email: order.customer.email,
                phone: order.customer.phone
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to initialize Razorpay payment."
        });
    }
};

/**
 * Helper to fetch a payment entity directly from Razorpay's API.
 */
const fetchRazorpayPayment = async (paymentId, keyId, keySecret) => {
    return new Promise((resolve, reject) => {
        const https = require("https");
        const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        const req = https.request(
            {
                hostname: "api.razorpay.com",
                port: 443,
                path: `/v1/payments/${encodeURIComponent(paymentId)}`,
                method: "GET",
                headers: {
                    Authorization: authHeader,
                    "Content-Type": "application/json"
                },
                timeout: 10000
            },
            (res) => {
                let data = "";
                res.on("data", chunk => { data += chunk; });
                res.on("end", () => {
                    try {
                        const parsed = JSON.parse(data);
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(parsed);
                        } else {
                            const errDesc = parsed.error?.description || `Razorpay API returned status ${res.statusCode}`;
                            reject(new Error(errDesc));
                        }
                    } catch (e) {
                        reject(new Error("Failed to parse response from Razorpay API."));
                    }
                });
            }
        );
        req.on("timeout", () => {
            req.destroy(new Error("Razorpay API request timed out."));
        });
        req.on("error", (err) => {
            reject(new Error(`Razorpay API network error: ${err.message}`));
        });
        req.end();
    });
};

/**
 * Helper to capture an authorized Razorpay payment.
 */
const captureRazorpayPayment = async (paymentId, amountInPaise, currency, keyId, keySecret) => {
    return new Promise((resolve, reject) => {
        const https = require("https");
        const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        const postData = JSON.stringify({
            amount: amountInPaise,
            currency: currency || "INR"
        });
        const req = https.request(
            {
                hostname: "api.razorpay.com",
                port: 443,
                path: `/v1/payments/${encodeURIComponent(paymentId)}/capture`,
                method: "POST",
                headers: {
                    Authorization: authHeader,
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(postData)
                },
                timeout: 10000
            },
            (res) => {
                let data = "";
                res.on("data", chunk => { data += chunk; });
                res.on("end", () => {
                    try {
                        const parsed = JSON.parse(data);
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(parsed);
                        } else {
                            const errDesc = parsed.error?.description || `Razorpay capture returned status ${res.statusCode}`;
                            reject(new Error(errDesc));
                        }
                    } catch (e) {
                        reject(new Error("Failed to parse capture response from Razorpay API."));
                    }
                });
            }
        );
        req.on("timeout", () => {
            req.destroy(new Error("Razorpay capture request timed out."));
        });
        req.on("error", (err) => {
            reject(new Error(`Razorpay capture network error: ${err.message}`));
        });
        req.write(postData);
        req.end();
    });
};

const razorpayService = {
    fetchPayment: fetchRazorpayPayment,
    capturePayment: captureRazorpayPayment
};

/**
 * POST /api/orders/:orderId/verify-payment
 * Cryptographically verifies Razorpay payment signature using HMAC SHA256 with RAZORPAY_KEY_SECRET,
 * fetches and validates the payment entity from Razorpay's official API (order_id, amount, currency, status),
 * captures authorized payments safely, and updates the order status atomically.
 * Idempotent: Prevents double verification or double inventory adjustment.
 */
const verifyRazorpayPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, status: clientStatus } = req.body;

        const order = await Order.findOne({ orderId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        // Ownership verification (handles both authenticated user and guest)
        if (!verifyOrderAccess(order, req)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access to order."
            });
        }

        // 1. Idempotency Check: Already marked as paid
        if (order.paymentStatus === "paid") {
            return res.status(200).json({
                success: true,
                message: "Payment already verified and credited.",
                alreadyPaid: true,
                order: {
                    orderId: order.orderId,
                    status: order.orderStatus,
                    paymentStatus: order.paymentStatus,
                    totalAmount: order.totalAmount
                }
            });
        }

        // 2. Client explicitly reported cancellation or failure (e.g. dismissed modal or gateway error)
        if (clientStatus === "failed" || (!razorpay_payment_id && !razorpay_signature)) {
            return res.status(400).json({
                success: false,
                message: req.body?.error_description || "Payment was cancelled or dismissed."
            });
        }

        // 3. Confirm payment parameters match expected order
        const expectedRzpOrderId = order.paymentDetails?.razorpayOrderId;
        if (!expectedRzpOrderId || razorpay_order_id !== expectedRzpOrderId) {
            return res.status(400).json({
                success: false,
                message: "Razorpay order ID mismatch. Transaction rejected."
            });
        }

        // 4. Cryptographic Signature Verification
        const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder_key";
        const keySecret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_placeholder_secret";
        const expectedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const signatureBuffer = Buffer.from(razorpay_signature || "", "utf8");
        const expectedBuffer = Buffer.from(expectedSignature, "utf8");

        const isValidSignature = signatureBuffer.length === expectedBuffer.length &&
            crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

        if (!isValidSignature) {
            // Security hardening: Reject invalid signatures WITHOUT altering the order to 'failed'.
            // This prevents an attacker from corrupting a valid pending order using invalid probes.
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature. Transaction rejected."
            });
        }

        // 5. Retrieve payment entity from Razorpay official server API
        let paymentEntity;
        try {
            paymentEntity = await razorpayService.fetchPayment(razorpay_payment_id, keyId, keySecret);
        } catch (apiErr) {
            console.error("Payment verification failed during gateway fetch:", apiErr.message);
            return res.status(502).json({
                success: false,
                message: "Payment verification failed: Unable to verify transaction with payment gateway."
            });
        }

        if (!paymentEntity || typeof paymentEntity !== "object") {
            return res.status(502).json({
                success: false,
                message: "Payment verification failed: Invalid response from payment gateway."
            });
        }

        // 6. Validate payment entity against stored MongoDB order
        // a. Validate order_id
        if (paymentEntity.order_id !== expectedRzpOrderId) {
            return res.status(400).json({
                success: false,
                message: "Payment entity order ID does not match the order."
            });
        }

        // b. Validate currency is exactly INR
        if (paymentEntity.currency !== "INR") {
            return res.status(400).json({
                success: false,
                message: "Payment currency mismatch. Expected INR."
            });
        }

        // c. Validate amount in paise (1 INR = 100 paise)
        const expectedAmountInPaise = Math.round(order.totalAmount * 100);
        if (Number(paymentEntity.amount) !== expectedAmountInPaise) {
            return res.status(400).json({
                success: false,
                message: "Payment amount mismatch. Transaction rejected."
            });
        }

        // 7. Validate payment status & handle authorized vs captured
        let currentStatus = paymentEntity.status;
        if (currentStatus === "authorized") {
            try {
                const captureResult = await razorpayService.capturePayment(
                    razorpay_payment_id,
                    expectedAmountInPaise,
                    "INR",
                    keyId,
                    keySecret
                );
                currentStatus = captureResult?.status;
            } catch (captureErr) {
                console.error("Payment verification failed during capture attempt:", captureErr.message);
                return res.status(400).json({
                    success: false,
                    message: "Payment is authorized but could not be captured. Order remains pending."
                });
            }
        }

        if (currentStatus !== "captured") {
            return res.status(400).json({
                success: false,
                message: `Payment status is '${currentStatus}'. Only captured payments can be marked as paid.`
            });
        }

        // 8. Successful Signature & Gateway Verification: Mark Order as Paid atomically
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId, paymentStatus: { $ne: "paid" } },
            {
                $set: {
                    paymentStatus: "paid",
                    orderStatus: "processing",
                    paymentDetails: {
                        razorpayOrderId: razorpay_order_id,
                        razorpayPaymentId: razorpay_payment_id,
                        razorpaySignature: razorpay_signature,
                        verifiedAt: new Date(),
                        failureReason: null
                    }
                }
            },
            { new: true }
        );

        if (!updatedOrder) {
            // Another concurrent request already marked it paid
            return res.status(200).json({
                success: true,
                message: "Payment already verified and credited.",
                alreadyPaid: true,
                order: {
                    orderId: order.orderId,
                    status: order.orderStatus,
                    paymentStatus: order.paymentStatus,
                    totalAmount: order.totalAmount
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully.",
            order: {
                orderId: updatedOrder.orderId,
                status: updatedOrder.orderStatus,
                paymentStatus: updatedOrder.paymentStatus,
                paymentMethod: updatedOrder.paymentMethod,
                totalAmount: updatedOrder.totalAmount
            }
        });
    } catch (error) {
        console.error("Unhandled error during payment verification:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal error during payment verification."
        });
    }
};

/**
 * GET /api/orders/my-orders
 * Returns all orders belonging to the authenticated user, sorted newest first with pagination.
 */
const getMyOrders = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
        const skip = (page - 1) * limit;

        const filter = { user: req.user._id };

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .select("-paymentDetails.razorpaySignature -guestAccessToken")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Order.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            count: orders.length,
            total,
            page,
            pages: Math.ceil(total / limit) || 1,
            orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders."
        });
    }
};

/**
 * GET /api/orders/my-orders/:orderId
 * Fetches order details for a specific order belonging exclusively to the authenticated user.
 */
const getMyOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOne({
            orderId: orderId,
            user: req.user._id
        }).select("-paymentDetails.razorpaySignature -guestAccessToken").lean();

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve order details."
        });
    }
};

/**
 * GET /api/orders/:orderId
 * Fetches order confirmation details by order ID.
 * Strictly checks authorization: authenticated user match OR guest access token match.
 */
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOne({ orderId }).lean();

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        // Ownership & guest access verification
        if (!verifyOrderAccess(order, req)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access to order."
            });
        }

        // Sanitize sensitive internal keys (e.g. signature, guest token)
        const sanitizedOrder = {
            orderId: order.orderId,
            status: order.orderStatus,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            customer: order.customer,
            shippingAddress: order.shippingAddress,
            items: order.items,
            subtotal: order.subtotal,
            discountAmount: order.discountAmount,
            deliveryFee: order.deliveryFee,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt
        };

        return res.status(200).json({
            success: true,
            order: sanitizedOrder
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve order."
        });
    }
};

module.exports = {
    createOrder,
    createRazorpayOrder,
    verifyRazorpayPayment,
    getMyOrders,
    getMyOrderDetails,
    getOrderById,
    razorpayService
};
