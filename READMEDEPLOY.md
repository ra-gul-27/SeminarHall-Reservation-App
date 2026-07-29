# Deployment Guide: Seminar Hall Reservation App

This document outlines the complete deployment strategy for the Seminar Hall Reservation App. It details the platforms chosen for the database, backend API, and frontend client, along with step-by-step instructions on how the full stack was deployed.

---

## 🏗️ Architecture & Platform Choices

When planning the deployment for this application, we chose a modern, serverless, and highly scalable cloud architecture to ensure fast global delivery, easy maintenance, and zero-downtime deployments.

1. **Database: Supabase (PostgreSQL)**
   - **Why we chose it:** Supabase provides a fully managed, scalable PostgreSQL database. It comes with built-in connection pooling (PgBouncer/Supavisor), which is crucial for serverless backend environments to prevent connection limits from being exhausted.
2. **Backend (API): Vercel**
   - **Why we chose it:** Vercel offers seamless serverless deployments for Node.js and Express. It automatically provides HTTPS, global edge network distribution, and CI/CD integration directly with GitHub. It's perfectly suited for stateless REST APIs.
3. **Frontend (Mobile App): EAS (Expo Application Services)**
   - **Why we chose it:** Expo EAS allows us to build standalone native binaries (APK/AAB for Android, IPA for iOS) entirely in the cloud. This removes the need for complex local build environments (Android Studio/Xcode) and simplifies over-the-air updates.

---

## 🗄️ Step 1: Database Deployment (Supabase)

The first step is provisioning the live database so the backend has a place to store data.

1. **Create a Supabase Project:**
   - Go to [Supabase](https://supabase.com/) and create a new project.
   - Note down the **Database Password**.
2. **Obtain Connection Strings:**
   - Go to **Project Settings > Database**.
   - Copy the **Connection Pooling** URL (port 6543, with `pgbouncer=true`). This will be your `DATABASE_URL`.
   - Copy the **Direct Connection** URL (port 5432). This will be your `DIRECT_URL`.
3. **Run Prisma Migrations to the Live DB:**
   - On your local machine, inside the `backend/` folder, update your `.env` with the Supabase connection strings.
   - Run the command to push the schema to the cloud:
     ```bash
     npx prisma db push
     ```
     *(Alternatively, you can run `npx prisma migrate deploy` if you are using migration history).*

---

## ⚙️ Step 2: Backend Deployment (Vercel)

With the database ready, we deploy the Node.js API to Vercel.

1. **Prepare `vercel.json`:**
   Ensure the `backend/vercel.json` file is properly configured to map the Express routes to Vercel's serverless functions.
2. **Connect to Vercel:**
   - Go to the [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
   - Import the GitHub repository for this project.
3. **Configure Project Details:**
   - **Root Directory:** Set the root directory to `backend`.
   - **Build Command:** Set to `npm run build` (or leave default if Vercel detects TypeScript `tsc`).
   - **Install Command:** Set to `npm install` (this will also trigger the `postinstall` script to run `prisma generate`).
4. **Environment Variables:**
   - In the Vercel deployment settings, add the following Environment Variables:
     - `DATABASE_URL` (The pooled Supabase URL)
     - `DIRECT_URL` (The direct Supabase URL)
     - `JWT_SECRET` (Your secure secret key)
5. **Deploy:**
   - Click **Deploy**. Vercel will install dependencies, generate the Prisma client, and expose your API on a secure `https://` domain (e.g., `https://your-api-url.vercel.app`).

---

## 📱 Step 3: Frontend Deployment (Expo EAS)

With the backend API live, the final step is building the React Native client app.

1. **Configure the Client API URL:**
   - Inside the `client/` codebase, update your API base URL (e.g., inside `src/services/api.ts` or via an `.env` file) to point to the new live Vercel backend URL (e.g., `https://your-api-url.vercel.app/api`).
2. **Login to Expo:**
   - Open your terminal, navigate to the `client/` folder, and authenticate:
     ```bash
     npx expo login
     ```
3. **Initialize EAS (If not already done):**
   - Ensure the `eas.json` file is correctly configured. If not, run:
     ```bash
     eas build:configure
     ```
4. **Build the Android App:**
   - Trigger a cloud build for Android to generate an APK (for direct sideloading) or an AAB (for the Google Play Store):
     ```bash
     eas build --platform android --profile preview
     ```
   - *Note: You can change the profile to `production` for app store releases.*
5. **Download and Distribute:**
   - Once the build is complete (usually takes 10-15 minutes on the Expo servers), a link and QR code will be provided in your terminal.
   - You can download the `.apk` file directly to your Android device to install and use the fully live app!

---

## 🔄 Continuous Integration & Deployment (CI/CD)

- **Backend Updates:** Because the project is linked to Vercel, any code pushed to the `main` branch inside the `backend/` directory will automatically trigger a new serverless deployment.
- **Frontend Updates:** For the client app, minor JavaScript or UI changes can be deployed seamlessly to users without a new app store download using **EAS Update**:
  ```bash
  eas update --branch production --message "Updated UI styling"
  ```

And that’s it! The application is fully deployed, utilizing a highly scalable database, a serverless backend, and a cloud-built native mobile frontend.

---

## 💸 Free Plan Limitations & Quotas

Since this architecture relies on modern cloud services, it's important to be aware of the limitations imposed by their respective Free (Hobby) tiers to ensure the app runs without interruptions.

### 1. Supabase (Database)
The Supabase **Hobby Plan** provides an excellent starting point, but note the following constraints:
- **Project Pausing:** If your database receives no traffic or connections for 7 consecutive days, Supabase will temporarily pause the project to save resources. You must manually log in and click "Restore" to bring it back online.
- **Storage Limit:** You get up to **500 MB** of database space, which is typically more than enough for thousands of reservation records.
- **Connections:** Limited to 2 active projects per account on the free tier.
- **Bandwidth:** 5 GB of egress bandwidth per month.

### 2. Vercel (Backend API)
Vercel’s **Hobby Plan** is highly generous but includes strict limits to prevent abuse:
- **Execution Timeout:** Serverless functions (your API routes) have a strict **10-second maximum execution timeout**. Any API request that takes longer than 10 seconds will fail.
- **Bandwidth:** 100 GB of bandwidth per month.
- **Commercial Use:** The Hobby tier is strictly for personal, non-commercial use.
- **Cold Starts:** Since it is serverless, the API may take an extra second or two to respond if it hasn't received a request in a while (cold start).

### 3. Expo / EAS (Frontend Builds)
The **Free Tier** for Expo Application Services (EAS) is great for development but has monthly limits:
- **Build Limits:** You are allotted **30 free EAS Builds per month** (combined across Android and iOS). 
- **Queue Times:** As a free user, your builds are placed in a shared priority queue. During peak hours, it may take 10–20 minutes before your build actually begins processing.
- **EAS Update:** If using Over-The-Air (OTA) updates, you are limited to 1,000 monthly active users receiving those updates for free.
- **Concurrency:** Only 1 build can run at a time.
