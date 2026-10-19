
const express = require("express");
const router = express.Router();

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

// GET all products, with optional search and category filters
router.get("/", getProducts);

// GET a single product by ID
router.get("/:id", getProductById);

// CREATE a product
router.post("/", createProduct);

// UPDATE a product
router.put("/:id", updateProduct);

// DELETE a product
router.delete("/:id", deleteProduct);

module.exports = router;
