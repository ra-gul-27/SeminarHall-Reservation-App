# Installation and Setup Guide for Developers

Welcome to the **Seminar Hall Reservation App** repository! This guide provides a detailed, step-by-step walkthrough to get the project up and running smoothly on your local machine for future development.

## 📌 Project Overview

This project is structured as a monorepo containing two main folders:
1. **`client/`** - The React Native frontend built with Expo and NativeWind (Tailwind CSS for React Native).
2. **`backend/`** - The Node.js/Express REST API utilizing TypeScript and Prisma ORM (connected to a Supabase PostgreSQL database).

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your system:
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **Git**
- **Expo Go** app installed on your physical smartphone (iOS/Android) for testing, OR an Android Studio Emulator / iOS Simulator set up on your machine.

---

## 🚀 Step 1: Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/ra-gul-27/SeminarHall-Reservation-App.git
cd SeminarHall-Reservation-App
```

---

## ⚙️ Step 2: Backend Setup (Node.js + Express + Prisma)

The backend handles API requests, authentication, and database connections.

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   > **Note:** The backend `package.json` contains a `postinstall` script (`npx prisma generate && npx prisma db push --accept-data-loss`). This will automatically generate the Prisma client and push the schema to the database.

3. **Environment Variables:**
   Create a `.env` file in the root of the `backend/` directory (if it doesn't already exist) and configure the database and JWT secrets. Example:
   ```env
   # Connect to Supabase via connection pooling with Supavisor
   DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   
   # Direct connection to the database (Used for migrations)
   DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
   
   # Secret key for signing JWT tokens
   JWT_SECRET="your-super-secret-key-123"
   ```

4. **Start the backend development server:**
   ```bash
   npm run dev
   ```
   The backend should now be running locally (usually on `http://localhost:3000` or port 5000 depending on the `index.ts` setup).

---

## 📱 Step 3: Client Setup (React Native + Expo)

The client is a cross-platform mobile application powered by Expo.

1. **Open a new terminal window** (keep the backend running) and navigate to the client directory:
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo server:**
   ```bash
   npm start
   ```
   Alternatively, you can run:
   - `npm run android` (to start directly on an Android emulator)
   - `npm run ios` (to start directly on an iOS simulator)

4. **Test the app:**
   - A QR code will appear in your terminal. 
   - Open the **Expo Go** app on your phone and scan the QR code to run the application on your physical device.

> **Important Note for Physical Devices:** Ensure that both your development machine and your smartphone are connected to the **same Wi-Fi network**. If the app fails to connect to the backend, ensure your API endpoints in the client code point to your computer's local IP address (e.g., `http://192.168.x.x:3000`) rather than `localhost`.

---

## 📦 Key Technologies & Packages Used

### Client
- **Expo** (`~57.0.6`) - Framework for universal React Native apps.
- **NativeWind** (`^4.2.6`) - Tailwind CSS adaptation for React Native, styling components using standard Tailwind utility classes.
- **React Navigation** (`@react-navigation/native`) - Routing and navigation for Expo apps.
- **Axios / Fetch** - Used for API calls to the backend.

### Backend
- **Express.js** (`^5.2.1`) - Fast, unopinionated web framework for Node.js.
- **Prisma** (`^7.8.0`) - Next-generation Node.js and TypeScript ORM for database modeling and migrations.
- **JSON Web Token (JWT)** (`^9.0.3`) - Handles secure authentication and sessions.
- **Bcrypt.js** (`^3.0.3`) - Password hashing algorithm.

---

## 🛠️ Common Troubleshooting

- **Prisma Client Issues:** If you encounter database errors regarding unknown models, ensure you run `npx prisma generate` in the `backend/` directory to update the client.
- **Metro Bundler Cache Issues:** If the React Native app looks visually broken or refuses to update code changes, start the Expo server and clear the cache using: `npx expo start -c`
- **Port Clashes:** If port 3000 is occupied, you can change the backend port in `backend/src/index.ts` and update the respective API base URLs in the client.

//just for edu purpose alone access my supabase as(.env)
DATABASE_URL="postgresql://postgres.wmwguctlqgjzbqflkiiv:Ragul_%3F%402006@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.wmwguctlqgjzbqflkiiv:Ragul_%3F%402006@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

JWT_SECRET="my-super-secret-key-123"
//
Happy Coding! 🚀
