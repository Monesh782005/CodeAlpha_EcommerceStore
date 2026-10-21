# Trendora — Full-Stack Fashion E-Commerce Store

**Fashion for a Better You** ✨

Trendora is a modern, responsive fashion e-commerce web application built using HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB. It provides a complete shopping experience with product browsing, filtering, user authentication, cart management, checkout, order tracking, and Razorpay payment integration in Test Mode.

## 🌟 Features

### 🛍️ Shopping Experience
- Responsive fashion storefront with editorial-style design.
- Product catalog with 79 categorized products.
- Product details with image galleries, sizes, and color options.
- Category filtering, search, sorting, and price filtering.
- Shopping cart with quantity management and item removal.
- Promo code support and delivery fee calculations.
- Responsive layouts for desktop, tablet, and mobile devices.

### 👤 User Authentication
- Customer registration and login.
- Password hashing using bcrypt.
- JSON Web Token (JWT) authentication.
- Protected customer and order endpoints.
- Authenticated customer and guest order access.

### 📦 Checkout and Order Management
- Server-side product price and discount calculations.
- Stock validation and atomic inventory updates.
- Shipping address and customer information collection.
- Order creation and persistent MongoDB storage.
- Customer order history and order receipt views.
- Order status and payment status tracking.

### 💳 Razorpay Payment Integration
- Razorpay Checkout integration in Test Mode.
- Backend-created Razorpay orders using server-calculated amounts.
- Server-side HMAC-SHA256 payment signature verification.
- Timing-safe signature comparison.
- Server-side payment entity retrieval and validation of order ID, amount, and currency.
- Payment capture handling for authorized payments.
- Orders are marked as paid only after the backend validates the payment and confirms capture.
- Duplicate verification safeguards and atomic order status updates.
- Automated payment-verification regression tests.

**Payment disclaimer:** Razorpay is configured for testing. No real-money payment processing is claimed. Use Razorpay test credentials and simulated payment methods when testing the application.

## 🧰 Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Payment Gateway | Razorpay Checkout |
| API Communication | REST APIs, Fetch API |
| Deployment | Vercel (frontend), Render (backend) |
| Testing | Node.js native test runner |

## 🏗️ Project Structure

```text
CodeAlpha_EcommerceStore/
├── index.html
├── shop.html
├── product.html
├── cart.html
├── checkout.html
├── my-orders.html
├── login.html
├── register.html
├── css/
│   ├── style.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── config.js
│   ├── products.js
│   ├── main.js
│   ├── shop.js
│   ├── product-details.js
│   ├── cart.js
│   ├── checkout.js
│   ├── auth.js
│   └── my-orders.js
├── assets/
│   └── images/
└── backend/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── orderController.js
    │   └── productController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── order.js
    │   ├── product.js
    │   └── user.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── orderRoutes.js
    │   └── productRoutes.js
    ├── tests/
    │   └── orderPaymentVerification.test.js
    ├── .env.example
    ├── package.json
    ├── seed.js
    └── server.js
```

## ⚙️ Prerequisites

Install the following before running the project locally:

- [Node.js](https://nodejs.org/) — version 18 or later.
- [MongoDB Atlas](https://www.mongodb.com/atlas) or a local MongoDB instance.
- A modern web browser.
- Razorpay test API credentials for testing payments.

## 🚀 Run the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/Monesh782005/CodeAlpha_EcommerceStore.git
cd CodeAlpha_EcommerceStore
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory using `.env.example` as a template.

Configure the following variables with your own values:

```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_jwt_secret
CLIENT_URL=http://localhost:3000
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

Never commit the real `.env` file or expose credentials in source code, screenshots, or public repositories.

### 3. Start the backend

From the `backend` directory, run:

```bash
npm run dev
```

If the project does not have a development script, use:

```bash
npm start
```

The backend should start on `http://localhost:5000`, subject to your configuration.

### 4. Start the frontend

Open another terminal at the project root:

```bash
python -m http.server 3000
```

Then open:

`http://localhost:3000`

Ensure that the frontend API configuration points to your local backend when running locally.

### 5. Seed the product catalog (optional)

If you want to populate the database using the project's seed script, run this from the `backend` directory:

```bash
npm run seed
```

Check the script and database configuration before reseeding an existing database.

## 🧪 Automated Tests

The backend includes a regression test suite for Razorpay payment verification.

From the `backend` directory, run:

```bash
npm test
```

The latest reported local test run completed with **13 tests passed and 0 failures**.

Coverage includes:

- Invalid payment signatures.
- Mismatched Razorpay order IDs.
- Incorrect payment amounts.
- Incorrect currency.
- Uncaptured and failed payments.
- Razorpay API errors.
- Duplicate verification requests and race conditions.
- Successful payment verification and capture.
- Order ownership enforcement.

These are local automated test results; they do not replace end-to-end testing against the deployed Razorpay test environment.

## 🔌 API Endpoints

### Products

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/products` | Retrieve products and supported filters |
| GET | `/api/products/:id` | Retrieve product details |

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a customer |
| POST | `/api/auth/login` | Authenticate a customer |
| GET | `/api/auth/me` | Retrieve the authenticated profile |

### Orders and Payments

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/orders` | Create an order |
| GET | `/api/orders/my-orders` | Retrieve customer order history |
| GET | `/api/orders/my-orders/:orderId` | Retrieve an order receipt |
| GET | `/api/orders/:orderId` | Retrieve an authorized order |
| POST | `/api/orders/:orderId/razorpay-order` | Create a Razorpay order |
| POST | `/api/orders/:orderId/verify-payment` | Verify and confirm payment |

Refer to the backend routes and controllers for authentication requirements, request formats, and response details.

## 🔐 Security Practices

Trendora implements several security measures:

- Password hashing using bcrypt.
- JWT-based authentication and authorization.
- Server-side product pricing and checkout calculations.
- Server-side Razorpay signature verification.
- Payment entity validation against the expected order, amount, and currency.
- Payment capture confirmation before marking orders as paid.
- Idempotency safeguards for repeated payment verification.
- Atomic stock updates to reduce overselling risks.
- Access checks for customer and guest orders.
- Environment variables for sensitive credentials.
- HTTP security headers and configured CORS policies.

### Payment reliability limitation

The current browser-driven verification flow may leave an order pending if a customer completes payment but closes the browser before the frontend submits the verification request. A verified Razorpay webhook is a recommended future enhancement for handling asynchronous payment events and recovery.

## 🌐 Live Demo and Repository

**Live Website:**  
https://code-alpha-ecommerce-store-backend-liard.vercel.app

**Backend Service:**  
https://codealpha-ecommercestore-r299.onrender.com

**GitHub Repository:**  
https://github.com/Monesh782005/CodeAlpha_EcommerceStore

The backend may take additional time to respond after periods of inactivity, depending on the hosting plan.

## 📸 Screenshots and Demo

Add screenshots of the following pages to your repository or README when available:

- Homepage and product catalog.
- Product details.
- Shopping cart.
- Login and registration.
- Checkout in Razorpay Test Mode.
- Successful order confirmation.
- My Orders page.

A short demonstration video can also show the shopping flow and test-payment process.

## 🎯 Project Objective

The objective of Trendora is to demonstrate full-stack web development skills through a functional e-commerce application, integrating responsive frontend design, REST API development, database persistence, authentication, inventory management, and payment verification.

## 👨‍💻 Internship Project

**Program:** CodeAlpha Full Stack Development Internship  
**Project:** CodeAlpha_EcommerceStore  
**Application Name:** Trendora — Fashion for a Better You

Developed as a full-stack e-commerce project to demonstrate practical web development, integration, testing, and deployment skills.
```

## Final steps, bro

1. Replace the content of your existing `README.md` with this version.
2. Check that the project structure and scripts match your actual repository.
3. Save the file and run these commands from `M:\CodeAlpha_EcommerceStore`:

```powershell
git add README.md
git commit -m "Update Trendora project documentation"
git push origin main
```

4. Open your GitHub repository and verify the README renders correctly.

**One final reminder:** keep Razorpay in Test Mode for your internship demo, and never publish real secrets or customer information.

Bro, after this README is pushed, your project documentation will be ready for the final submission review.
