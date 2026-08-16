# ShopNest — Full-Stack E-Commerce Application

An Amazon-inspired e-commerce app: Spring Boot + MySQL backend, React + Tailwind frontend,
Razorpay payments, JWT auth with customer/admin roles.

```
ShopNest/
├── backend/    Spring Boot 3 REST API (Java 17, MySQL, Spring Security + JWT, Razorpay)
└── frontend/   React 18 + Vite + Tailwind CSS
```

## Features

- **Auth** — register/login with hashed passwords, JWT tokens, `CUSTOMER` / `ADMIN` roles
- **Products** — browse, search, filter by category; admin CRUD
- **Cart** — persisted per user; guest cart works locally before sign-in
- **Orders** — checkout creates an order from the cart, decrements stock
- **Payments** — Razorpay order creation + signature verification on the backend
- **Admin panel** — manage products and update order status
- **UI** — Amazon-style layout: sticky nav + search, category chips, promo banner carousel,
  "Picked for you" personalized rail, product grid with ratings/discount badges, sticky
  slide-in cart drawer, fully responsive/mobile-first

## 1. Backend setup

**Requirements:** Java 17+, Maven, MySQL 8+

```bash
cd backend

# Create the database (or let Hibernate auto-create it — see application.properties)
mysql -u root -p -e "CREATE DATABASE shopnest;"

# Configure credentials — either edit application.properties directly or export env vars:
export DB_USERNAME=root
export DB_PASSWORD=your_mysql_password
export JWT_SECRET=some-long-random-string
export RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
export RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
export CORS_ORIGINS=http://localhost:5173

mvn spring-boot:run
```

The backend starts on `http://localhost:8080`. On first boot, `DataSeeder` creates:
- An admin account: `admin@shopnest.com` / `Admin@123`
- A handful of demo products (so `/api/products` isn't empty out of the box)

**Key endpoints:**

| Method | Path                                | Auth       | Purpose                          |
|--------|--------------------------------------|------------|-----------------------------------|
| POST   | `/api/auth/register`                | Public     | Create account                    |
| POST   | `/api/auth/login`                   | Public     | Get JWT                           |
| GET    | `/api/products`                     | Public     | List/search/filter products       |
| GET    | `/api/products/recommended`         | Public     | "Picked for you" feed             |
| GET    | `/api/products/{id}`                | Public     | Product detail                    |
| GET/POST/PUT/DELETE | `/api/cart/**`         | Customer   | Manage cart                       |
| POST   | `/api/orders`                       | Customer   | Checkout from cart                |
| GET    | `/api/orders`                       | Customer   | Your order history                |
| POST   | `/api/payments/razorpay/order/{id}` | Customer   | Create Razorpay order             |
| POST   | `/api/payments/razorpay/verify`     | Customer   | Verify payment signature          |
| POST/PUT/DELETE | `/api/admin/products/**`   | Admin      | Manage catalog                    |
| GET/PATCH | `/api/admin/orders/**`           | Admin      | View/update orders                |

Swagger UI: `http://localhost:8080/swagger-ui.html`

**Run tests:**
```bash
mvn test
```

## 2. Frontend setup

**Requirements:** Node.js 18+

```bash
cd frontend
npm install
npm run dev
```

Opens on `http://localhost:5173`. The Vite dev server proxies `/api/**` to
`http://localhost:8080` (see `vite.config.js`), so no CORS config is needed locally.

> **Note:** the frontend is designed to keep working even if the backend isn't running —
> product listings and the cart fall back to local mock data/localStorage so you can preview
> the UI standalone. Once the backend is up, real data and persistence take over automatically.

**Razorpay checkout:** the checkout page loads Razorpay's script client-side and opens the
payment widget using the order details returned by `/api/payments/razorpay/order/{id}`. Use
Razorpay's test mode keys during development — test card/UPI details are in the
[Razorpay test docs](https://razorpay.com/docs/payments/payments/test-card-upi-details/).

## 3. Deployment

- **Backend** → Render / Railway / AWS EC2. Set `DB_*`, `JWT_SECRET`, `RAZORPAY_*`, and
  `CORS_ORIGINS` (your deployed frontend URL) as environment variables.
- **Frontend** → Vercel / Netlify. Set the API base URL to your deployed backend
  (update the axios `baseURL` in `src/api/client.js` or wire up `VITE_API_BASE_URL`).

## 4. Project structure highlights

```
backend/src/main/java/com/shopnest/
├── model/         JPA entities
├── repository/     Spring Data repositories
├── dto/            Request/response DTOs
├── service/         Business logic (Auth, Product, Cart, Order, Payment)
├── controller/       REST controllers
├── security/         JWT filter, UserDetails, JwtUtil
├── config/            SecurityConfig, CORS, DataSeeder
└── exception/          Custom exceptions + global handler

frontend/src/
├── components/    Navbar, CategoryChips, PromoBanner, ProductCard/Grid,
│                     PickedForYou, CartSidebar, Footer, StarRating
├── pages/          Home, ProductDetail, Login, Register, Checkout, Orders, Admin
├── context/         AuthContext, CartContext
├── api/              axios client + endpoint wrappers
└── data/              mock product data (offline/demo fallback)
```

## Color theme

| Purpose        | Hex       |
|----------------|-----------|
| Primary (Navy) | `#111827` |
| Accent (Violet)| `#7C3AED` |
| Accent hover   | `#6D28D9` |
| Background     | `#F8FAFC` |
| Cards          | `#FFFFFF` |
| Main text      | `#0F172A` |
| Secondary text | `#64748B` |
| Border         | `#E2E8F0` |
| Success        | `#10B981` |
| Discount/Error | `#EF4444` |

Defined in `frontend/tailwind.config.js` as `navy`, `violet`, `surface`, `card`, `ink`,
`slate`, `slate-border`, `success`, `discount`.
