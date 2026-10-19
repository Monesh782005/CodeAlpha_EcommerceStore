# Trendora — Full-Stack E-Commerce Storefront

**Trendora.** | *Fashion for a Better You*

Trendora is a full-stack, responsive fashion e-commerce web application featuring high-end editorial styling, a catalog of 79 categorized products, persistent shopping cart management, user authentication via JSON Web Tokens (JWT), server-authoritative checkout with promo codes, order history tracking, and a secure Razorpay test-mode payment gateway integration.

---

## 🌟 Highlights & Architecture

- **Clean Native Frontend**: Built with semantic **HTML5**, **CSS3 (Vanilla)**, and modern **Vanilla JavaScript (ES6+)**. No heavy frontend frameworks or external CSS bloat.
- **RESTful Express.js Backend**: Modular Express architecture featuring controllers, Mongoose models, and route separation.
- **Persistent MongoDB Database**: Real MongoDB Atlas / local MongoDB persistence with Mongoose schemas for Users, Products, and Orders.
- **JWT Authentication & Authorization**: Secure password hashing with bcrypt, stateless JWT issuance, authentication middleware (`requireAuth` / `optionalAuth`), and protected customer endpoints.
- **Dynamic Frontend API Configuration**: Centralized API abstraction in `js/config.js` that seamlessly toggles between local multi-server development and deployed production hosting.
- **Server-Authoritative Pricing & Stock Management**: Product prices, promo discounts (`SHOP20`, `SALE20`, `VIP30`), and delivery fees are strictly computed on the backend. Stock is reserved atomically on order placement to prevent overselling.
- **Secure Razorpay Integration (Test Mode)**: Cryptographically verifies HMAC-SHA256 signatures server-side using the backend secret key. No orders are marked as paid via client-side callbacks alone.
- **Guest & Customer Order Privacy**: Authenticated orders are bound to user accounts; guest orders are secured with high-entropy `guestAccessToken` tokens transmitted via headers (`x-guest-token`).
- **Responsive Across All Devices**: Native CSS media queries tailored for Desktop, Tablet, and Mobile devices with touch-friendly drawer navigation.

---

## 📁 Repository Structure

```
CodeAlpha_EcommerceStore/
│
├── index.html              # Homepage: Hero, Brand Strip, Arrivals, Dress Styles & Testimonials
├── shop.html               # Catalog: Faceted sidebar filters (category, dress style, price, colors, sizes) & sorting
├── product.html            # Product Details: Interactive multi-angle gallery, size/color selectors, reviews
├── cart.html               # Shopping Cart: Quantity stepper, item removal, promo discounts, subtotal calculations
├── checkout.html           # Checkout: Contact info, address validation, COD and Razorpay payment options
├── my-orders.html          # Order History: Itemized order tracking, status badges, and receipt modal
├── login.html              # User Sign In: Form validation, password toggle, JWT session creation
├── register.html           # User Registration: Validation, duplicate account handling, automatic login
├── .gitignore              # Git ignore rules for node_modules, .env secrets, logs, and artifacts
├── README.md               # Complete project documentation
│
├── css/
│   ├── style.css           # Core design system tokens, typography, colors, layout & reset
│   ├── components.css      # Reusable UI components (buttons, cards, badges, pills, tabs, steppers)
│   └── responsive.css      # Tablet and mobile breakpoints, sliding drawer, responsive layouts
│
├── js/
│   ├── config.js           # Centralized dynamic API endpoint resolver (local vs. deployed)
│   ├── products.js         # Centralized product catalog engine, card renderers, and API fetchers
│   ├── main.js             # Global state, cart badge sync, header account states, search, newsletter
│   ├── shop.js             # Faceted multi-attribute filtering, price range slider, and sort handler
│   ├── product-details.js  # Image gallery switcher, swatch selectors, and Add-to-Cart logic
│   ├── cart.js             # Cart items manager, quantity stepper, promo codes, and totals
│   ├── checkout.js         # Form validation, order creation, and Razorpay checkout modal handler
│   ├── auth.js             # Client authentication helper, session storage, and form submissions
│   └── my-orders.js        # Authenticated customer order history, pagination, and modal receipts
│
├── backend/
│   ├── config/
│   │   └── db.js           # Mongoose MongoDB connection handler
│   ├── controllers/
│   │   ├── authController.js    # Register, login, and profile verification handlers
│   │   ├── orderController.js   # Order creation, authoritative totals, stock management, Razorpay logic
│   │   └── productController.js # Product catalog, category filtering, and product details lookup
│   ├── middleware/
│   │   └── authMiddleware.js    # Strict (requireAuth) and optional (optionalAuth) JWT middlewares
│   ├── models/
│   │   ├── order.js        # Mongoose Order schema (items, totals, customer, payment details, guest token)
│   │   ├── product.js      # Mongoose Product schema (catalog metadata, images, pricing, stock)
│   │   └── user.js         # Mongoose User schema (name, unique email, bcrypt password hash)
│   ├── routes/
│   │   ├── authRoutes.js   # /api/auth routes
│   │   ├── orderRoutes.js  # /api/orders routes
│   │   └── productRoutes.js# /api/products routes
│   ├── .env.example        # Environment variable template with safe placeholders
│   ├── package.json        # Backend dependencies and scripts
│   ├── seed.js             # Database seeder to populate catalog into MongoDB
│   └── server.js           # Express application entry point, CORS, security headers, and error handler
│
└── assets/
    └── images/             # Product photography, category assets, and brand logos
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Vanilla), JavaScript (ES6+), Razorpay Checkout SDK |
| **Backend** | Node.js, Express.js, Mongoose (ODM), CORS, dotenv |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **Database** | MongoDB (Local or MongoDB Atlas) |
| **Payment Gateway** | Razorpay (Test Mode Integration with HMAC-SHA256 signature verification) |

---

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **MongoDB**: Local MongoDB community instance or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **Web Browser**: Chrome, Edge, Firefox, or Safari

---

## ⚙️ Environment Variables Setup

All sensitive credentials and database connection strings are managed through environment variables in `backend/.env`.

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Copy the template `.env.example` to create `.env`:
   ```bash
   copy .env.example .env      # Windows PowerShell / CMD
   cp .env.example .env        # macOS / Linux
   ```
3. Populate the variables with your values:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/trendora?retryWrites=true&w=majority
   JWT_SECRET=replace_with_a_secure_random_jwt_secret_key

   # Allowed frontend origin for CORS in production (e.g. https://your-trendora.vercel.app)
   # Leave as http://localhost:3000 or set to * for local development
   CLIENT_URL=http://localhost:3000

   # Razorpay Test Mode Credentials (obtained from Razorpay Dashboard -> Settings -> API Keys)
   RAZORPAY_KEY_ID=rzp_test_placeholder_key
   RAZORPAY_KEY_SECRET=rzp_test_placeholder_secret
   ```

> [!CAUTION]
> Never commit your real `.env` file, database passwords, or Razorpay secrets to GitHub. Ensure `.env` is listed in `.gitignore`.

---

## 🚀 How to Run Locally

### 1. Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

The Express server will start at **`http://localhost:5000`** and connect to your configured MongoDB database.

*(Optional)* To seed or re-seed the 79-product catalog into your MongoDB database:
```bash
npm run seed
```

### 2. Start the Frontend Storefront

Open a separate terminal in the root repository directory (`CodeAlpha_EcommerceStore`):

**Option A: Using Python (Recommended)**
```bash
python -m http.server 3000
```
Open **`http://localhost:3000`** in your browser.

**Option B: Using Node `npx serve`**
```bash
npx serve -l 3000 .
```

**Option C: Using VS Code Live Server**
Right-click on `index.html` and select **"Open with Live Server"**.

---

## 💳 Razorpay Test-Mode Payment Testing

Trendora supports Razorpay payments in **Test Mode**:

1. Obtain Test API keys from your [Razorpay Dashboard](https://dashboard.razorpay.com/) under **Settings > API Keys**.
2. Add your `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `backend/.env`.
3. In the checkout page (`checkout.html`):
   - Fill in contact and shipping details.
   - Choose **Razorpay Secure (Cards, UPI, Netbanking)**.
   - Click **Place Order**.
4. The Razorpay modal will open displaying the server-computed order amount in INR.
5. In the Razorpay modal, select **Test Mode** payment methods (e.g., standard test card credentials or UPI simulator).
6. Upon payment authorization, the frontend handler passes the cryptographic signature to `POST /api/orders/:orderId/verify-payment`. The backend verifies the HMAC-SHA256 signature and transitions the order status to `paid`.

> [!NOTE]
> Never enter real credit cards, bank accounts, or production credentials. If Razorpay keys are left as test placeholders, the backend safely simulates test order generation without contacting live payment rails.

---

## 📡 API Endpoints Overview

### Products API
- `GET /api/products` — Retrieve all catalog products with optional query filtering (`?category=...&search=...`)
- `GET /api/products/:id` — Retrieve a single product by MongoDB ID or `productId`

### Authentication API
- `POST /api/auth/register` — Create a new customer account (`name`, `email`, `password`)
- `POST /api/auth/login` — Sign in with email and password to receive a JWT Bearer token
- `GET /api/auth/me` — Verify session and retrieve profile of the authenticated user

### Orders & Payment API
- `POST /api/orders` — Create order with server-verified prices, stock deduction, and promo calculation (`optionalAuth`)
- `GET /api/orders/my-orders` — Retrieve authenticated user's order history with pagination (`requireAuth`)
- `GET /api/orders/my-orders/:orderId` — Retrieve specific itemized order receipt (`requireAuth`)
- `GET /api/orders/:orderId` — Secure order status lookup (`optionalAuth`, verified via user or `x-guest-token`)
- `POST /api/orders/:orderId/razorpay-order` — Initialize Razorpay order with server-calculated amount in paise
- `POST /api/orders/:orderId/verify-payment` — Cryptographically verify HMAC-SHA256 payment signature and update status

---

## 🚢 Deployment Guide

Trendora is architected for clean, decoupled deployment: the static frontend can be deployed to any static host (Vercel, Netlify, GitHub Pages), while the Express backend can be hosted on Render, Railway, Heroku, or AWS.

### 1. Deploying the Backend (e.g. Render / Railway)
1. Push your code to GitHub (ensuring `.env` is ignored).
2. Create a new **Web Service** pointing to your repository.
3. Configure the Root Directory as `backend`.
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`
6. Add the following **Environment Variables** in the hosting dashboard:
   - `NODE_ENV=production`
   - `PORT=5000` (or leave default assigned by platform)
   - `MONGODB_URI` (your MongoDB Atlas connection string)
   - `JWT_SECRET` (a strong random key)
   - `CLIENT_URL` (your deployed frontend URL, e.g. `https://trendora-store.vercel.app`)
   - `RAZORPAY_KEY_ID` (your Razorpay Test Key)
   - `RAZORPAY_KEY_SECRET` (your Razorpay Test Secret)
7. In **MongoDB Atlas > Network Access**, ensure IP `0.0.0.0/0` is whitelisted so your cloud host can connect.

### 2. Deploying the Frontend (e.g. Vercel / Netlify / GitHub Pages)
1. Deploy the root directory containing `index.html` to Vercel or Netlify.
2. In your deployment configuration, configure the backend URL by adding an environment variable or injecting it into your HTML:
   ```html
   <script>
     window.__TRENDORA_CONFIG__ = {
       API_BASE_URL: 'https://your-trendora-backend.onrender.com/api'
     };
   </script>
   ```
   Or set `trendora_api_base_url` in `localStorage` for testing:
   ```javascript
   localStorage.setItem('trendora_api_base_url', 'https://your-trendora-backend.onrender.com/api');
   ```

---

## 🔒 Security Best Practices Implemented

- **Password Hashing**: Passwords hashed with bcrypt and 10 salt rounds before storage.
- **Stateless Authorization**: JWT authentication with verified expiration and user validation.
- **HMAC Signature Verification**: Razorpay payment signatures are validated cryptographically server-side.
- **Idempotency Safeguards**: Payment verification operations are protected against duplicate requests and race conditions.
- **Server-Authoritative Math**: Client-supplied prices and totals are ignored; prices are queried directly from MongoDB.
- **Atomic Stock Reservation**: Prevents double deductions and race-condition overselling.
- **Guest Access Tokens**: Guest orders are shielded behind high-entropy guest tokens (`x-guest-token`).
- **HTTP Security Headers**: Express fingerprinting disabled (`x-powered-by`), MIME type sniffing prevention (`nosniff`), and frame protection (`DENY`).

---

## 📝 License & Attribution

Developed for the **CodeAlpha Frontend Internship**. Rebranded to **Trendora.** with custom editorial assets and architecture. All rights reserved.
