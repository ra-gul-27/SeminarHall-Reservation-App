# College Seminar Hall Reservation App

A comprehensive full-stack application for college staff to seamlessly reserve seminar halls, manage bookings, and view availability. The app is designed to replace manual paper records, bringing efficiency, security, and a beautiful user interface for all college faculty and administrators.

## Tech Stack

This project is built on the **PERN Stack** (with a mobile twist):
- **PostgreSQL**: Robust relational database to store users, halls, and reservations securely.
- **Express.js**: Fast, unopinionated backend web framework for Node.js.
- **React Native (Expo)**: The frontend framework used to build cross-platform mobile apps (and responsive web apps).
- **Node.js**: The JavaScript runtime environment executing the backend.

### Additional Key Technologies
- **Prisma ORM**: A next-generation Node.js and TypeScript ORM for easy database access and schema management.
- **NativeWind & Tailwind CSS**: Used on the frontend for rapid, beautiful, and consistent UI styling.
- **TypeScript**: Ensures type safety and improves developer experience across both client and backend.

---

## 📁 Project Structure

The project is structured into a monorepo setup to cleanly separate the client and backend logic while maintaining a cohesive codebase.

### 1. `client/` (Frontend)
This directory houses the entire React Native / Expo application. 

- **`client/src/`**: The main source code directory for the UI.
  - **`components/`**: Reusable UI components (like buttons, bottom navigation bars, cards) to maintain design consistency and avoid code duplication.
  - **`screens/`**: Individual pages of the app (e.g., `LoginScreen.tsx`, `HomeScreen.tsx`, `AdminDashboardScreen.tsx`). Each file maps to a specific view the user interacts with.
  - **`navigation/`**: Contains the routing logic (React Navigation stack and tab navigators) to manage transitions between screens smoothly.
  - **`assets/`**: Static files such as images, icons, and custom fonts.
  - **`hooks/`**: Custom React hooks for shared logic (e.g., authentication state, fetching data).
  - **`services/`**: API client functions to communicate seamlessly with the backend endpoints.
  - **`theme/`**: Centralized configuration for styling tokens, colors, and typography used across NativeWind.

### 2. `backend/` (Server API)
This directory contains the Node.js Express server and database configuration.

- **`backend/src/`**: The core server logic.
  - **`index.ts`**: The main entry point for the Express server. It sets up middlewares, configures CORS, and handles the API routing.
- **`backend/prisma/`**: 
  - Contains the `schema.prisma` file, which is the single source of truth for the PostgreSQL database schema (defining Users, Halls, Reservations, etc.).
- **`backend/seed.ts` & `backend/seed.js`**: Scripts used to seed the initial database with default data (like admin accounts or default seminar halls) to quickly get a fresh environment up and running.
- **`.env`**: Holds secure environment variables like the Database Connection URL and JWT Secrets.

---

##  Why This Structure?

This architecture is chosen to guarantee **scalability** and **maintainability** for future developers:
- **Separation of Concerns**: The backend handles exclusively data and business logic, while the client focuses purely on presentation and state. This means a developer can update the UI without touching the database schema, and vice versa.
- **Component-Based UI**: Storing reusable elements in `client/src/components` ensures that a change to a button style automatically propagates everywhere.
- **Type Safety via TypeScript**: Having a structured `src` folder with `.ts/.tsx` extensions drastically reduces runtime errors by catching bugs during the compilation phase.
- **Prisma ORM**: Removes the need to write raw SQL queries, keeping database operations readable and predictable for JavaScript developers.

## Getting Started for Future Developers

1. **Prerequisites**: Ensure you have `Node.js`, `npm` (or `yarn`), and `PostgreSQL` installed locally.
2. **Backend Setup**:
   - Navigate to `/backend`.
   - Run `npm install` to download dependencies.
   - Configure your `.env` file with the correct Postgres connection string.
   - Run `npx prisma db push` or `npx prisma migrate dev` to sync the database schema or (npx prisma generate)<-best.
   - Run `npm start` or `npm run dev` to start the API server.
3.**SUR**
-DATABASE_URL="postgresql://postgres:Ragul@2006@localhost:5432/seminar_halls?schema=public"
-JWT_SECRET="super-secret-seminar-key-change-in-production"
PORT=5000

4. **Client Setup**:
   - Navigate to `/client`.
   - Run `npm install` to download dependencies.
   - Run `npx expo start` to launch the Metro bundler.
   - Press `w` to view the app in a web browser or scan the QR code using the Expo Go app on your physical mobile device.
