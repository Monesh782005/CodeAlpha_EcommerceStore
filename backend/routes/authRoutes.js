const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", requireAuth, getMe);

module.exports = router;
