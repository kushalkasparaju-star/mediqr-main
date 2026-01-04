
# MediQR – Smart Health Record Management System

MediQR is a secure, QR-based digital health record management platform designed to simplify how medical data is stored, accessed, and shared.  
Patients can manage their medical records digitally, and hospitals or healthcare providers can instantly access them by scanning a QR code.

---

## 📌 Problem Statement

Traditional medical record systems rely heavily on paper documents and disconnected digital systems.  
This causes:
- Loss of important medical history
- Delays in emergency situations
- Difficulty in accessing past reports
- Poor coordination between hospitals

---

## 💡 Solution Overview

MediQR solves these problems by providing:
- A **centralized digital health record system**
- **QR code–based instant access** to patient records
- Separate interfaces for **patients** and **hospitals**
- Fast, simple, and secure access to medical data

---

## ✨ Key Features

- 🔐 Secure digital storage of health records
- 📱 QR code generation for each patient
- 📷 Camera-based QR scanning
- 👤 Patient registration and login
- 🏥 Hospital dashboard for record access
- ⚡ Fast and responsive UI
- 🧩 Modular and scalable frontend architecture

---

## 🛠️ Technology Stack

- **Frontend:** React (TypeScript)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **QR Code:** qrcode.react, html5-qrcode
- **Language:** TypeScript
- **Package Manager:** npm

---

## 📦 Prerequisites

Before running the project, ensure you have:

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)

Check installation:
```bash
node -v
npm -v

Run the app: npm run dev

mediqr/
│
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Application pages
│   ├── services/          # Authentication & helpers
│   ├── types/             # TypeScript types
│   ├── App.tsx            # Main app component
│   └── index.tsx          # Entry point
│
├── public/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
