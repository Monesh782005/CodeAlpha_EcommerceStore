const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("crypto");

const Order = require("../models/order");
const { verifyRazorpayPayment, razorpayService } = require("../controllers/orderController");

describe("Trendora Razorpay Payment Verification Audit & Regression Tests", () => {
    const originalFindOne = Order.findOne;
    const originalFindOneAndUpdate = Order.findOneAndUpdate;
    const originalFetchPayment = razorpayService.fetchPayment;
    const originalCapturePayment = razorpayService.capturePayment;

    const testSecret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_placeholder_secret";
    const testRzpOrderId = "order_trendora_test_001";
    const testPaymentId = "pay_trendora_test_999";
    const testGuestToken = "token_guest_abc123";

    const createValidSignature = (orderId, paymentId) => {
        return crypto
            .createHmac("sha256", testSecret)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");
    };

    const createMockRes = () => ({
        statusCode: 200,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(data) {
            this.body = data;
            return this;
        }
    });

    let mockOrder;

    beforeEach(() => {
        mockOrder = {
            orderId: "TRN-9988A1",
            user: null,
            guestAccessToken: testGuestToken,
            totalAmount: 499, // 499 INR = 49900 paise
            paymentStatus: "pending",
            orderStatus: "pending",
            paymentMethod: "razorpay",
            paymentDetails: {
                razorpayOrderId: testRzpOrderId
            }
        };

        Order.findOne = async () => mockOrder;
        Order.findOneAndUpdate = async (query, update) => {
            return {
                ...mockOrder,
                paymentStatus: "paid",
                orderStatus: "processing",
                paymentDetails: {
                    ...mockOrder.paymentDetails,
                    razorpayOrderId: testRzpOrderId,
                    razorpayPaymentId: testPaymentId,
                    verifiedAt: new Date()
                }
            };
        };
    });

    afterEach(() => {
        Order.findOne = originalFindOne;
        Order.findOneAndUpdate = originalFindOneAndUpdate;
        razorpayService.fetchPayment = originalFetchPayment;
        razorpayService.capturePayment = originalCapturePayment;
    });

    it("1. Invalid Signature: Rejects payment when signature does not match HMAC SHA-256", async () => {
        const req = {
            params: { orderId: mockOrder.orderId },
            headers: { "x-guest-token": testGuestToken },
            body: {
                razorpay_order_id: testRzpOrderId,
                razorpay_payment_id: testPaymentId,
                razorpay_signature: "invalid_tampered_signature_hex_value_123456"
            }
        };
        const res = createMockRes();

        await verifyRazorpayPayment(req, res);

        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /invalid payment signature/i);
    });

    it("2a. Wrong Order ID: Rejects when request razorpay_order_id mismatches stored order ID", async () => {
        const wrongRzpOrderId = "order_mismatched_002";
        const req = {
            params: { orderId: mockOrder.orderId },
            headers: { "x-guest-token": testGuestToken },
            body: {
                razorpay_order_id: wrongRzpOrderId,
                razorpay_payment_id: testPaymentId,
                razorpay_signature: createValidSignature(wrongRzpOrderId, testPaymentId)
            }
        };
        const res = createMockRes();

        await verifyRazorpayPayment(req, res);

        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /razorpay order id mismatch/i);
    });

    it("2b. Wrong Order ID: Rejects when Razorpay payment entity order_id mismatches expected order", async () => {
        const validSig = createValidSignature(testRzpOrderId, testPaymentId);
        razorpayService.fetchPayment = async () => ({
            id: testPaymentId,
            order_id: "order_different_from_gateway",
            amount: 49900,
            currency: "INR",
            status: "captured"
        });

        const req = {
            params: { orderId: mockOrder.orderId },
            headers: { "x-guest-token": testGuestToken },
            body: {
                razorpay_order_id: testRzpOrderId,
                razorpay_payment_id: testPaymentId,
                razorpay_signature: validSig
            }
        };
        const res = createMockRes();

        await verifyRazorpayPayment(req, res);

        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /payment entity order id does not match/i);
    });

    it("3. Amount Mismatch: Rejects when Razorpay payment entity amount does not equal totalAmount * 100", async () => {
        const validSig = createValidSignature(testRzpOrderId, testPaymentId);
        razorpayService.fetchPayment = async () => ({
            id: testPaymentId,
            order_id: testRzpOrderId,
            amount: 29900, // Expected 49900
            currency: "INR",
            status: "captured"
        });

        const req = {
            params: { orderId: mockOrder.orderId },
            headers: { "x-guest-token": testGuestToken },
            body: {
                razorpay_order_id: testRzpOrderId,
                razorpay_payment_id: testPaymentId,
                razorpay_signature: validSig
            }
        };
        const res = createMockRes();

        await verifyRazorpayPayment(req, res);

        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /payment amount mismatch/i);
    });

    it("4. Currency Mismatch: Rejects when Razorpay payment currency is not INR", async () => {
        const validSig = createValidSignature(testRzpOrderId, testPaymentId);
        razorpayService.fetchPayment = async () => ({
            id: testPaymentId,
            order_id: testRzpOrderId,
            amount: 49900,
            currency: "USD",
            status: "captured"
        });

        const req = {
            params: { orderId: mockOrder.orderId },
            headers: { "x-guest-token": testGuestToken },
            body: {
                razorpay_order_id: testRzpOrderId,
                razorpay_payment_id: testPaymentId,
                razorpay_signature: validSig
            }
        };
        const res = createMockRes();

        await verifyRazorpayPayment(req, res);

        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /currency mismatch/i);
    });

    it("5a. Uncaptured Payment: Leaves order pending when payment is authorized but capture fails", async () => {
        const validSig = createValidSignature(testRzpOrderId, testPaymentId);
        razorpayService.fetchPayment = async () => ({
            id: testPaymentId,
            order_id: testRzpOrderId,
            amount: 49900,
            currency: "INR",
            status: "authorized"
        });
        razorpayService.capturePayment = async () => {
            throw new Error("Card issuer declined capture");
        };

        const req = {
            params: { orderId: mockOrder.orderId },
            headers: { "x-guest-token": testGuestToken },
            body: {
                razorpay_order_id: testRzpOrderId,
                razorpay_payment_id: testPaymentId,
                razorpay_signature: validSig
            }
        };
        const res = createMockRes();

        await verifyRazorpayPayment(req, res);

        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /authorized but could not be captured/i);
    });

    it("5b. Uncaptured Payment: Rejects when payment status is 'failed'", async () => {
        const validSig = createValidSignature(testRzpOrderId, testPaymentId);
        razorpayService.fetchPayment = async () => ({
            id: testPaymentId,
            order_id: testRzpOrderId,
            amount: 49900,
            currency: "INR",
            status: "failed"
        });

        const req = {
            params: { orderId: mockOrder.orderId },
            headers: { "x-guest-token": testGuestToken },
            body: {
                razorpay_order_id: testRzpOrderId,
                razorpay_payment_id: testPaymentId,
                razorpay_signature: validSig
            }
        };
        const res = createMockRes();

        await verifyRazorpayPayment(req, res);

        assert.equal(res.statusCode, 400);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /only captured payments/i);
    });

    it("6. API Failure: Handles payment gateway API errors safely without marking order paid", async () => {
        const validSig = createValidSignature(testRzpOrderId, testPaymentId);
        razorpayService.fetchPayment = async () => {
            throw new Error("Razorpay gateway timeout 504");
        };

        const req = {
            params: { orderId: mockOrder.orderId },
            headers: { "x-guest-token": testGuestToken },
            body: {
                razorpay_order_id: testRzpOrderId,
                razorpay_payment_id: testPaymentId,
                razorpay_signature: validSig
            }
        };
        const res = createMockRes();

        await verifyRazorpayPayment(req, res);

        assert.equal(res.statusCode, 502);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /unable to verify transaction with payment gateway/i);
    });

    it("7a. Duplicate Verification (Idempotency): Returns 200 alreadyPaid when order is already paid", async () => {
        mockOrder.paymentStatus = "paid";
        const req = {
            params: { orderId: mockOrder.orderId },
            headers: { "x-guest-token": testGuestToken },
            body: {
                razorpay_order_id: testRzpOrderId,
                razorpay_payment_id: testPaymentId,
                razorpay_signature: createValidSignature(testRzpOrderId, testPaymentId)
            }
        };
        const res = createMockRes();

        await verifyRazorpayPayment(req, res);

        assert.equal(res.statusCode, 200);
        assert.equal(res.body.success, true);
        assert.equal(res.body.alreadyPaid, true);
        assert.match(res.body.message, /already verified/i);
    });

    it("7b. Duplicate Verification (Race Condition): Returns 200 alreadyPaid if concurrent update matches 0", async () => {
        const validSig = createValidSignature(testRzpOrderId, testPaymentId);
        razorpayService.fetchPayment = async () => ({
            id: testPaymentId,
            order_id: testRzpOrderId,
            amount: 49900,
            currency: "INR",
            status: "captured"
        });
        // Simulate race condition: another request set paymentStatus to paid concurrently
        Order.findOneAndUpdate = async () => null;

        const req = {
            params: { orderId: mockOrder.orderId },
            headers: { "x-guest-token": testGuestToken },
            body: {
                razorpay_order_id: testRzpOrderId,
                razorpay_payment_id: testPaymentId,
                razorpay_signature: validSig
            }
        };
        const res = createMockRes();

        await verifyRazorpayPayment(req, res);

        assert.equal(res.statusCode, 200);
        assert.equal(res.body.success, true);
        assert.equal(res.body.alreadyPaid, true);
    });

    it("8a. Successful Verification: Marks order as paid when signature and payment entity are valid", async () => {
        const validSig = createValidSignature(testRzpOrderId, testPaymentId);
        razorpayService.fetchPayment = async () => ({
            id: testPaymentId,
            order_id: testRzpOrderId,
            amount: 49900,
            currency: "INR",
            status: "captured"
        });

        const req = {
            params: { orderId: mockOrder.orderId },
            headers: { "x-guest-token": testGuestToken },
            body: {
                razorpay_order_id: testRzpOrderId,
                razorpay_payment_id: testPaymentId,
                razorpay_signature: validSig
            }
        };
        const res = createMockRes();

        await verifyRazorpayPayment(req, res);

        assert.equal(res.statusCode, 200);
        assert.equal(res.body.success, true);
        assert.equal(res.body.order.paymentStatus, "paid");
        assert.equal(res.body.order.status, "processing");
    });

    it("8b. Successful Capture: Automatically captures authorized payment and marks order as paid", async () => {
        const validSig = createValidSignature(testRzpOrderId, testPaymentId);
        razorpayService.fetchPayment = async () => ({
            id: testPaymentId,
            order_id: testRzpOrderId,
            amount: 49900,
            currency: "INR",
            status: "authorized"
        });
        let capturedAmount = 0;
        razorpayService.capturePayment = async (paymentId, amount) => {
            capturedAmount = amount;
            return {
                id: paymentId,
                status: "captured",
                amount: amount
            };
        };

        const req = {
            params: { orderId: mockOrder.orderId },
            headers: { "x-guest-token": testGuestToken },
            body: {
                razorpay_order_id: testRzpOrderId,
                razorpay_payment_id: testPaymentId,
                razorpay_signature: validSig
            }
        };
        const res = createMockRes();

        await verifyRazorpayPayment(req, res);

        assert.equal(res.statusCode, 200);
        assert.equal(res.body.success, true);
        assert.equal(capturedAmount, 49900);
        assert.equal(res.body.order.paymentStatus, "paid");
    });

    it("9. Ownership Enforcement: Blocks unauthorized requests lacking valid guest access token", async () => {
        const req = {
            params: { orderId: mockOrder.orderId },
            headers: { "x-guest-token": "wrong_attacker_token" },
            body: {
                razorpay_order_id: testRzpOrderId,
                razorpay_payment_id: testPaymentId,
                razorpay_signature: createValidSignature(testRzpOrderId, testPaymentId)
            }
        };
        const res = createMockRes();

        await verifyRazorpayPayment(req, res);

        assert.equal(res.statusCode, 403);
        assert.equal(res.body.success, false);
        assert.match(res.body.message, /unauthorized/i);
    });
});
