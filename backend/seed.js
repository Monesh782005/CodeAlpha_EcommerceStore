/**
 * Trendora Database Seeder
 * Populates MongoDB with the complete 78-product catalog from js/products.js
 * Uses upsert operations based on stable productId so rerunning does not create duplicates.
 * Preserves existing products (such as Classic Casual T-Shirt test document).
 */

const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const path = require("path");
const fs = require("fs");
const vm = require("vm");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const Product = require("./models/product");

// Load the exact catalog from js/products.js
function loadCatalog() {
    const productsFilePath = path.join(__dirname, "..", "js", "products.js");
    if (!fs.existsSync(productsFilePath)) {
        throw new Error(`Products catalog file not found at: ${productsFilePath}`);
    }

    const scriptCode = fs.readFileSync(productsFilePath, "utf8");
    const sandbox = {
        window: {},
        document: {},
        console,
        Intl,
        Set,
        Array,
        Number,
        String,
        Boolean,
        Math,
        setTimeout,
        clearTimeout
    };

    vm.createContext(sandbox);
    const result = vm.runInContext(
        scriptCode + "; ({ catalog: typeof DEFAULT_PRODUCTS !== 'undefined' ? DEFAULT_PRODUCTS : PRODUCTS });",
        sandbox
    );

    if (!result || !Array.isArray(result.catalog) || result.catalog.length === 0) {
        throw new Error("Failed to extract product catalog from js/products.js");
    }

    return result.catalog;
}

async function seedDatabase() {
    console.log("=========================================");
    console.log("Trendora MongoDB Catalog Seeder");
    console.log("=========================================");

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("Error: MONGODB_URI is not defined in backend/.env");
        process.exit(1);
    }

    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri);
        console.log("Connected successfully to MongoDB.");

        const catalog = loadCatalog();
        console.log(`Loaded ${catalog.length} products from js/products.js`);

        let importedCount = 0;
        let updatedCount = 0;
        let skippedCount = 0;

        for (const item of catalog) {
            const productId = item.id;
            if (!productId) {
                console.warn(`Skipping item without id: "${item.name}"`);
                skippedCount++;
                continue;
            }

            const docData = {
                productId: productId,
                name: item.name,
                category: item.category || "Casual",
                dressStyle: item.dressStyle || "Casual",
                gender: item.gender || "Unisex",
                description: item.description || "",
                price: Number(item.price) || 0,
                originalPrice: item.originalPrice !== null && item.originalPrice !== undefined ? Number(item.originalPrice) : null,
                discountPercent: item.discountPercent !== null && item.discountPercent !== undefined ? Number(item.discountPercent) : null,
                rating: typeof item.rating === "number" ? item.rating : 4.5,
                reviewCount: typeof item.reviewCount === "number" ? item.reviewCount : 0,
                colors: Array.isArray(item.colors) ? item.colors : [],
                sizes: Array.isArray(item.sizes) ? item.sizes : [],
                image: item.image,
                galleryImages: Array.isArray(item.galleryImages) && item.galleryImages.length > 0 ? item.galleryImages : [item.image],
                isNewArrival: Boolean(item.isNewArrival),
                isTopSelling: Boolean(item.isTopSelling)
            };

            const existingDoc = await Product.findOne({ productId });

            if (!existingDoc) {
                await Product.create(docData);
                importedCount++;
            } else {
                await Product.updateOne({ productId }, { $set: docData });
                updatedCount++;
            }
        }

        const totalInDb = await Product.countDocuments();

        console.log("-----------------------------------------");
        console.log("Seeding Summary:");
        console.log(`  Imported (New):  ${importedCount}`);
        console.log(`  Updated (Exist): ${updatedCount}`);
        console.log(`  Skipped:         ${skippedCount}`);
        console.log(`  Total in DB:     ${totalInDb}`);
        console.log("-----------------------------------------");
        console.log("Catalog seeding completed successfully!");

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed with error:", error.message);
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
}

if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase, loadCatalog };
