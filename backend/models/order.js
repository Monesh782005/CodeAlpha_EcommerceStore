const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        size: { type: String, default: "Standard" },
        color: { type: String, default: "Default" },
        image: { type: String, default: "" }
    },
    { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
    {
        address: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        postalCode: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true }
    },
    { _id: false }
);

const customerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, required: true, trim: true }
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        orderId: { type: String, unique: true, index: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
        guestAccessToken: { type: String, default: null, index: true },
        customer: { type: customerSchema, required: true },
        shippingAddress: { type: shippingAddressSchema, required: true },
        items: {
            type: [orderItemSchema],
            required: true,
            validate: [v => Array.isArray(v) && v.length > 0, "Order must contain at least one item"]
        },
        subtotal: { type: Number, required: true, min: 0 },
        discountAmount: { type: Number, default: 0, min: 0 },
        deliveryFee: { type: Number, default: 0, min: 0 },
        totalAmount: { type: Number, required: true, min: 0 },
        promoCode: { type: String, default: null, trim: true },
        paymentMethod: {
            type: String,
            required: true,
            enum: ["razorpay", "demo_payment", "cod_payment", "pending_gateway"],
            default: "razorpay"
        },
        paymentStatus: {
            type: String,
            required: true,
            enum: ["pending", "demo_verified", "paid", "failed"],
            default: "pending"
        },
        orderStatus: {
            type: String,
            required: true,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending"
        },
        paymentDetails: {
            razorpayOrderId: { type: String, default: null, index: true },
            razorpayPaymentId: { type: String, default: null },
            razorpaySignature: { type: String, default: null },
            verifiedAt: { type: Date, default: null },
            failureReason: { type: String, default: null }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
