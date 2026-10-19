
const Product = require("../models/product");

// GET /api/products
const getProducts = async (req, res) => {
    try {
        const { search, category } = req.query;
        const filter = {};

        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        if (category) {
            filter.category = { $regex: `^${category}$`, $options: "i" };
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: error.message
        });
    }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        let product = null;

        if (require("mongoose").Types.ObjectId.isValid(id)) {
            product = await Product.findById(id);
        }

        if (!product) {
            product = await Product.findOne({ productId: id });
        }

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid product ID or request",
            error: error.message
        });
    }
};

// POST /api/products
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create product",
            error: error.message
        });
    }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update product",
            error: error.message
        });
    }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to delete product",
            error: error.message
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
