
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        productId: { type: String, unique: true, sparse: true },
        name: { type: String, required: true, trim: true },
        category: String,
        dressStyle: String,
        gender: String,
        description: String,
        price: { type: Number, required: true, min: 0 },
        originalPrice: { type: Number, default: null },
        discountPercent: { type: Number, default: null },
        rating: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 },
        colors: [String],
        sizes: [String],
        image: String,
        galleryImages: [String],
        isNewArrival: { type: Boolean, default: false },
        isTopSelling: { type: Boolean, default: false },
        stock: { type: Number, default: 0 },
        isFeatured: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
