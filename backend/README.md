# POS System - Backend

Backend API for the Point of Sale (POS) system built with Express.js, TypeScript, Prisma, and MySQL.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download here](https://dev.mysql.com/downloads/mysql/)
- **npm** (comes with Node.js)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
touch .env
```

Add the following environment variables to the `.env` file:

```env
DATABASE_URL="mysql://username:password@localhost:3306/pos_system"
JWT_SECRET="your-secret-key-here"
```

**Important:** Replace the database credentials with your MySQL credentials:
- `username` - your MySQL username (default is usually `root`)
- `password` - your MySQL password
- `pos_system` - the database name (you can change this if needed)

**Example:**
```env
DATABASE_URL="mysql://root:mypassword@localhost:3306/pos_system"
JWT_SECRET="pos-system-secret-key-2026"
```

### 3. Setup Database

#### Create the Database

First, create the database in MySQL:

```bash
mysql -u root -p
```

Then in the MySQL prompt:

```sql
CREATE DATABASE pos_system;
EXIT;
```

#### Run Migrations

Generate the Prisma Client and run database migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

This will create all the necessary tables in your database.

### 4. Seed the Database

Populate the database with default users:

```bash
npm run seed
```

This creates two default users:
- **Admin:** username: `admin`, password: `admin123`
- **Cashier:** username: `cashier`, password: `cashier123`

### 5. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:4000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript code for production
- `npm start` - Start the production server
- `npm run seed` - Seed the database with default data

## API Endpoints

The API runs on **port 4000** by default.

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Database seeding script
│   └── migrations/            # Database migrations
├── src/
│   ├── controllers/           # Request handlers
│   ├── routes/                # API routes
│   ├── middlewares/           # Custom middleware
│   ├── utils/                 # Utility functions
│   ├── lib/                   # Third-party library configs
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
├── .env                       # Environment variables (create this)
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

## Database Schema

The system uses the following main tables:
- **User** - System users (Admin/Cashier)
- **Product** - Product inventory
- **Category** - Product categories
- **Transaction** - Sales and stock-in transactions
- **TransactionItem** - Individual items in transactions
- **Setting** - System settings (tax rate)
- **Discount** - Product discounts

## Troubleshooting

### Port Already in Use
If port 4000 is already in use, you can change it in `src/server.ts`:

```typescript
const PORT = 4000; // Change this to another port
```

### Database Connection Error
- Make sure MySQL is running
- Check your database credentials in `.env`
- Verify the database exists: `SHOW DATABASES;` in MySQL

### Prisma Client Error
If you get a Prisma Client error, try:

```bash
npx prisma generate
```

### Migration Issues
To reset the database (⚠️ this will delete all data):

```bash
npx prisma migrate reset
npm run seed
```

## Tech Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **MySQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

## Need Help?

If you encounter any issues:
1. Make sure all prerequisites are installed
2. Check that your `.env` file is configured correctly
3. Verify MySQL is running
4. Try deleting `node_modules` and running `npm install` again

---

Happy coding! 🚀
