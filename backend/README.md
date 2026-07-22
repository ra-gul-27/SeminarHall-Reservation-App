# CLGRES - Backend Service

This directory contains the backend service for the College Seminar Reservation System (CLGRES). It provides a robust REST API to manage user authentication, hall reservations, and admin operations.

## 🛠 Tech Stack (PERN - Partial)

* **Runtime:** Node.js
* **Framework:** Express.js (v5)
* **Language:** TypeScript
* **Database ORM:** Prisma (v7.8)
* **Database:** PostgreSQL (`pg` adapter)
* **Authentication:** JWT (JSON Web Tokens) & bcryptjs for password hashing

## 📂 Folder Structure

The backend is kept lightweight and straightforward. Here is an overview of the key files and directories:

```text
backend/
├── prisma/                 # Database schema and configuration
│   └── schema.prisma       # Prisma schema defining User, Reservation, and Hall models
├── src/                    # Source code
│   └── index.ts            # Main application entry point containing all Express routes and logic
├── .env                    # Environment variables (Database URL, JWT Secret)
├── package.json            # Project dependencies and npm scripts
├── seed.ts                 # Database seeding script (populates initial Admin and Staff users)
└── tsconfig.json           # TypeScript configuration
```

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have Node.js and PostgreSQL installed and running on your machine.

### 2. Environment Setup
You must have a `.env` file in the root of the `backend/` directory. It should look like this:
```env
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/clgres?schema=public"
JWT_SECRET="your_super_secret_jwt_key_here"
```

### 3. Install Dependencies
Run the following command to install all required Node modules:
```bash
npm install
```

### 4. Database Setup & Seeding
Push the Prisma schema to your PostgreSQL database and seed it with the default users (Admin and Staff):
```bash
npx prisma db push
npx prisma generate
npx tsx seed.ts
```

### 5. Running the Server
To start the server in development mode (with hot-reloading powered by `nodemon` and `tsx`):
```bash
npm run dev
```
The server will start on port `5000` (or whichever port is defined in your environment).

## 📡 API Endpoints Summary

The `src/index.ts` file exposes several key routes:

* **Auth:** `/api/auth/login` (Returns a JWT token)
* **Reservations (Staff):** 
  * `GET /api/reservations` (Fetch all reservations)
  * `POST /api/reservations` (Create a new reservation)
* **Reservations (Admin):** 
  * `DELETE /api/reservations/:id` (Cancel/delete a specific reservation)

## 🔐 Authentication Flow
The backend uses a standard JWT Bearer token approach. Once a user logs in, the client receives a token which must be sent in the `Authorization: Bearer <token>` header for any protected endpoints.
