# 🔐 Secure Auth System (Next.js + Node/Express + MongoDB)

A production-ready authentication system featuring:

- **JWT access + refresh rotation** 
- **Secure HTTP-only cookies** 
- **OAuth providers (Google, GitHub, Microsoft)** 
- **Email verification & password reset** 
- **Next.js frontend with animated UI** 

🌐 **Live Frontend:** https://auth-system-gilt.vercel.app


🚀 **Postman Collections:** /docs/auth-system.postman_collection

---

## 📦 Architecture

- Next.js (App Router) >> Axios (withCredentials + refresh interceptor)
- Express API (REST /api/v1)
- MongoDB (Mongoose)

---

## ✨ Features

- User register, login, logout 
- JWT access tokens + refresh rotation 
- Email verification link 
- Forgot/reset password flow 
- OAuth (Google, GitHub, Microsoft) 
- Responsive frontend UI with animated background 
- Axios interceptor for silent refresh 

---

## 📡 API Endpoints (v1)

| Method | Path                                  | Auth        | Description |
|--------|---------------------------------------|-------------|-------------|
| POST   | `/api/v1/auth/register`               | Public      | Register new user |
| GET    | `/api/v1/auth/verify-email?token=...` | Public      | Verify email |
| POST   | `/api/v1/auth/login`                  | Public      | Login (sets refresh cookie + returns access token) |
| POST   | `/api/v1/auth/logout`                 | Cookie      | Logout and clear cookie |
| POST   | `/api/v1/auth/refresh-token`          | Cookie      | Rotate refresh cookie & issue new access token |
| GET    | `/api/v1/auth/me`                     | Bearer      | Get current user |
| POST   | `/api/v1/auth/forgot-password`        | Public      | Send password reset email |
| PATCH  | `/api/v1/auth/reset-password?token=.` | Public      | Reset password |
| GET    | `/api/v1/auth/google`                 | Public      | Start Google OAuth |
| GET    | `/api/v1/auth/github`                 | Public      | Start GitHub OAuth |
| GET    | `/api/v1/auth/microsoft`              | Public      | Start Microsoft OAuth |
| PATCH  | `/api/v1/users/me`                    | Bearer      | Update profile |

---

## 🚀 Quick Start (Local)


# Clone repo
git clone https://github.com/ahegazy0/auth-system.git

cd auth-system

# Backend
cd back

cp .env.example .env

npm install

npm run dev

# Frontend
cd front

cp .env.example .env.local

npm install

npm run dev



