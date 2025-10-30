# 🎬 Media Verse

A full-stack web application to manage your favorite movies, shows, and other media types — built with **React (Vite)**, **Express**, **TypeScript**, **Prisma**, and **MySQL**.

---

## Project Overview

**Media Verse** allows users to add, view, and manage their favorite media entries with rich metadata such as title, type, director, budget, duration, location, and release year.  
It’s designed with a clean architecture separating **frontend** and **backend** for easy scalability and maintenance.

---

**Note**

This application runs **locally** (not hosted publicly) and provides a secure **user authentication system** — users must **sign up or log in** before accessing or managing media content.  

---

## 🏗️ Tech Stack

### Frontend
- ⚛️ **React (Vite)**
- 🎨 **TailwindCSS**
- 🔊 **Framer Motion**
- 🧭 **React Router DOM**
- 🧰 Axios for API calls
- 🔍 Fuse.js for fuzzy search
- ⚙️ React Hook Form + Zod for validation
- 🌀 React Query for caching and data fetching

### Backend
- 🧩 **Node.js (Express)**
- 🗄️ **MySQL** with **Prisma ORM**
- 🔐 **Multer** for file uploads
- 🛡️ **Zod** for schema validation
- 🔑 **JWT Authentication**
- 🧱 **TypeScript** for strong typing

---

## 📂 Folder Structure

```
favorite-media-app/
├── frontend/        # React Vite frontend
└── backend/         # Express + Prisma + MySQL backend
└── Readme.md         
```

---

## ⚙️ Setup Instructions

### 1️ Clone the Repository

```bash
git clone https://github.com/manognya66/favorite-media-app.git
cd favorite-media-app
```

---

### 2️ Backend Setup

```bash
cd backend
npm install
```

#### Create `.env` file inside `/backend`
```env
DATABASE_URL="mysql://user:password@localhost:3306/favorite_media_db"
PORT=5000
```

#### Run Prisma
```bash
npx prisma migrate dev
npx prisma generate
```

#### Start the Server
```bash
npm run dev
```

By default, backend runs on **http://localhost:5000**

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

By default, frontend runs on **http://localhost:5173**

---

## 🧱 Build Commands

If you want to create production builds:

```bash
cd frontend
npm run build

# Backend build 
cd ../backend
npm run build
```

---

## 🧪 Testing the App

Once both servers are running:
- Visit **http://localhost:5173**
- Add new media entries using the UI
- Media records will be stored in your MySQL database

--- 

## 🧍 Example Credentials

📝 Signup Example:

- Name: test
- Email: test@gmail.com
- Password: test@123

🔑 Login Example:

- Email: test@gmail.com
- Password: test@123
---

## 🧰 Useful Developer Tools

| Tool | Command | Description |
|------|----------|-------------|
| Prisma Studio | `npx prisma studio` | View and manage database visually |
| MySQL CLI | `mysql -u root -p` | Interact with database manually |

---

## 🧠 Key Features

- 📁 Add / Edit / Delete Media Entries  
- 🖼️ Upload and display media images  
- 🔍 Search and filter functionality  
- 🧾 MySQL + Prisma data handling  
- ⚡ Responsive and minimal UI  
- 🔐 Secure user authentication (JWT + bcrypt)

---

## 👨‍💻 Author

**R. Shashank Manognya**  
💼 Developer & Network Enthusiast  
📧 Contact: shashankmanognya717@gmail.com 
🌐 GitHub: https://github.com/manognya66/

---

## 📝 License

This project is licensed under the **MIT License** — you’re free to modify and distribute it.

---

> “Simplicity and elegance are the essence of great design.”




