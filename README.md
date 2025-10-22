# 🧩 Tasq — Task Management System

Tasq is a full-stack **Task Management Platform** built with **React, Node.js, Express, and MongoDB**, allowing users to create, organize, and track tasks efficiently.  
It supports **file attachments**, **analytics**, and **Google OAuth login** for a seamless experience.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- Register and login using **email/password**
- **Google OAuth** integration (`Continue with Google`)
- **JWT-based authentication** stored in **HTTP-only cookies**
- Client-side and server-side input validation

### 🧠 Task Management
- Create, view, update, and delete tasks (soft delete)
- Task fields: `title`, `description`, `status`, `priority`, `due_date`, `tags`, `assigned_to`
- Filter, search, sort, and paginate tasks
- **File attachments** (multiple files per task) stored in **Cloudinary**

### 📊 Analytics & Insights
- Task overview statistics (by status, priority)
- User productivity metrics
- Task trends over time

### ⚙️ Performance & Optimization
- **Lazy loading** for route-based components
- **Debounced searching** to reduce API load
- Modular folder structure for scalability

### ☁️ File Storage
- Cloud storage handled via **Cloudinary**
- Secure upload with unique file URLs

### 🧱 Tech Stack
| Layer | Technology |
|-------|-------------|
| Frontend | React + Vite + TypeScript + Plain CSS |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose ODM) |
| File Storage | Cloudinary |
| Authentication | JWT + Google OAuth |
| Deployment | Vercel (Frontend), AWS EC2 (Backend) |

---

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/tasq.git
cd tasq
