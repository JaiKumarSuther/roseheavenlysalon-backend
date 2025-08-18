Setup

1) Copy .env.example to .env and update DATABASE_URL and SMTP_*.
2) Install deps: npm install
3) Generate client: npm run prisma:generate
4) Migrate DB (creates tables matching PHP app): npm run prisma:migrate -- --name init
5) Start: npm run dev

API Overview

- POST /api/auth/signup { firstname, lastname, username, email, address, phone, password }
- POST /api/auth/verify-otp { otp }
- POST /api/auth/login { email, password }
- POST /api/auth/forgot-password { email }
- POST /api/auth/reset-password { email, otp, password }

- GET /api/users/me (Bearer)
- PUT /api/users/me { firstname, lastname, username, address, phone, password } (password = current password for verification)

- POST /api/bookings (Bearer) { name, phone, time: HH:MM, date: YYYY-MM-DD, service1, service2 }
- GET /api/bookings/me (Bearer)
- POST /api/bookings/cancel (Bearer) { date: YYYY-MM-DD, time: HH:MM }

- GET /api/bookings/today (Admin)
- POST /api/bookings/:id/done (Admin)
- POST /api/bookings/:id/cancel (Admin)
- POST /api/bookings/:id/reschedule (Admin)
- GET /api/bookings/search?q=name (Admin)

- GET /api/calendar?year=YYYY&month=MM
- GET /api/calendar/events?date=YYYY-MM-DD

- POST /api/uploads/image (Admin, multipart/form-data field "image") → { url }

This structure mirrors the original PHP application behavior.

