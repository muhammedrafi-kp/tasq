# 🧠 Tasq – Task Management System

A **Task Management Platform** built with **React**, **Node.js**, **Express**, and **MongoDB**, enabling users to create, organize, and track tasks with file attachments, analytics, and Google OAuth login.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* Email/password registration and login (with encrypted passwords)
* Google OAuth (Continue with Google)
* JWT-based session handling (stored in HTTP-only cookies)

### ✅ Task Management

* Create, update, delete, and view tasks
* Attach multiple files per task (stored in Cloudinary)
* Filtering, searching (with debouncing), sorting, and pagination
* Soft delete for tasks

### 📊 Analytics & Insights

* Task overview statistics (counts by status, priority)
* User performance metrics
* Task trends over time

### 💾 File Management

* Upload multiple files per task
* Securely stored on Cloudinary
* Retrieve or delete files as needed

### ⚙️ Optimizations

* Lazy loading for routes
* Client- and server-side validation
* Debouncing for better search performance

---

## 🛠️ Tech Stack

| Layer          | Technology                            |
| -------------- | ------------------------------------- |
| Frontend       | React + Vite + TypeScript + Plain CSS |
| Backend        | Node.js + Express                     |
| Database       | MongoDB (Atlas)                       |
| File Storage   | Cloudinary                            |
| Authentication | JWT + Google OAuth                    |
| Deployment     | AWS EC2 / Vercel                      |

---

## 📁 Project Structure

```
tasq/
│
├── client/                # React frontend
│   ├── src/
│   │   ├── pages/         # Dashboard, Tasks, Profile, Analytics
│   │   ├── components/    # Reusable components (FileAttachment, etc.)
│   │   ├── redux/         # State management
│   │   ├── services/      # API service layer
│   │   └── validators/    # Client-side validation
│   └── public/
│
└── server/                # Node.js backend
    ├── src/
    │   ├── controllers/   # Request handlers
    │   ├── routes/        # Express routes
    │   ├── services/      # Business logic
    │   ├── dtos/          # DTOs for request/response
    │   ├── utils/         # Reusable helpers (file upload, etc.)
    │   └── models/        # Mongoose schemas
    └── dist/              # Compiled JS (if using TypeScript)
```

---

## ⚙️ Environment Variables

### 🧩 Client (.env)

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
```

### 🧩 Server (.env)

```env
PORT=3000
MONGO_URI=<your-mongodb-uri>
GOOGLE_CLIENT_ID=<your-google-client-id>
JWT_ACCESS_SECRET=<your-jwt-secret>
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

> ⚠️ Do **not** commit `.env` files to version control.

---

## 🧰 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/muhammedrafi-kp/tasq.git
cd tasq
```

### 2️⃣ Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3️⃣ Set Up Environment Variables

Create `.env` files in both `client` and `server` directories.

### 4️⃣ Run the Application

#### Development Mode

```bash
# Backend
cd server
npm run dev

# Frontend
cd ../client
npm run dev
```

#### Production Build

```bash
# Build frontend
cd client
npm run build

# Start backend
cd ../server
npm start
```

Frontend: [http://localhost:5173](http://localhost:5173)
Backend: [http://localhost:3000/api](http://localhost:3000/api)

---

## 🏗️ Architecture Decisions

* Monolithic architecture for simplicity
* Separation of concerns via DTOs, services, controllers
* Cloudinary for file uploads
* JWT authentication for stateless sessions
* Google OAuth for easy onboarding
* Lazy loading and debouncing to optimize performance

---

## 💭 Assumptions Made

* Users are authenticated before performing task operations
* Each task supports multiple file attachments
* Soft delete is sufficient (no permanent deletion yet)
* Analytics are based on current stored task data
* Email notifications, caching, and real-time updates will be added in the future

---

## 🔮 Coming Soon

* Real-time updates (WebSockets)
* Email notifications
* Background job processing
* Caching layer
* Markdown support in comments
* Dark mode
* Testing suite
* Docker setup

---

## 👨‍💻 Author

**Muhammed Rafi**
🌐 [mhdrafi.online](https://mhdrafi.online)
