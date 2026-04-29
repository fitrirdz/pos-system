# POS System

A full-stack Point of Sale (POS) application with role-based access for Admin and Cashier users.

## Project Snapshot

- Backend: Express + TypeScript + Prisma + MySQL
- Frontend: React + TypeScript + Vite + Tailwind + React Query
- Auth: JWT in httpOnly cookie (`token`), with role-based route protection
- Roles: `ADMIN`, `CASHIER`

## Main Features

- Authentication: login, logout, current user session (`/api/auth/me`)
- Product and category management
- Sales and stock-in transaction recording
- Dashboard analytics (stats, monthly sales, 7-day sales, top products)
- User management (admin only): create user, activate/deactivate, role updates
- Tax/discount and payment method support in transactions

## Repository Structure

```text
pos-system/
├── backend/   # REST API, Prisma schema/migrations, seed script
└── frontend/  # React app (admin + cashier UI)
```

## Quick Start

### 1) Prerequisites

- Node.js 18+
- MySQL 8+

### 2) Backend setup

```bash
cd backend
npm install
```

Create `.env` in `backend/`:

```env
DATABASE_URL="mysql://username:password@localhost:3306/pos_system"
JWT_SECRET="your-secret-key"
```

Run database migration and seed:

```bash
npx prisma generate
npx prisma migrate dev
npm run seed
```

Start backend:

```bash
npm run dev
```

Backend runs at `http://localhost:4000`.

### 3) Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Default Seeded Users

- Admin: `admin` / `admin123`
- Cashier: `cashier` / `cashier123`

## API Base

- Base URL: `http://localhost:4000/api`
- Key route groups:
  - `/auth`
  - `/products`
  - `/categories`
  - `/transactions`
  - `/dashboard`
  - `/users`

## Short Analysis (Current State)

- The codebase is cleanly separated into backend and frontend apps, with a clear role-based flow in the UI routes.
- Backend CORS and frontend API base URL are configured for local development (`5173` -> `4000`).
- Prisma migrations are already tracked, which makes environment setup reproducible.
- For production readiness, the next priorities are environment-based configuration (CORS origin, secure cookies, ports), stronger validation, and automated tests.

## Useful Scripts

Backend:

- `npm run dev` - run API in development mode
- `npm run build` - compile TypeScript
- `npm start` - run compiled server
- `npm run seed` - seed default users

Frontend:

- `npm run dev` - run Vite dev server
- `npm run build` - type-check and build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint
