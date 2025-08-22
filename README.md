# Rose Heavenly Salon - Complete Backend-Frontend Integration

A full-stack beauty salon management system with modern React frontend and Node.js backend.

## 🚀 Features

### Backend (Node.js + Express + Prisma)
- **Authentication System**: JWT-based auth with email verification (OTP)
- **User Management**: Registration, login, profile management
- **Booking System**: Create, view, cancel appointments
- **Calendar Integration**: Event counts and daily event listings
- **Admin Panel**: Promo management, user administration
- **File Upload**: Image upload functionality
- **Database**: MySQL with Prisma ORM
- **Validation**: Zod schema validation
- **Security**: Helmet, CORS, bcrypt password hashing

### Frontend (Next.js 15 + React 19)
- **Modern UI**: Tailwind CSS with beautiful gradients and animations
- **State Management**: Zustand for authentication state
- **API Integration**: React Query + Axios for efficient data fetching
- **Form Handling**: React Hook Form with validation
- **Authentication**: Complete login/signup flow with OTP verification
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Optimistic updates and cache invalidation
- **Error Handling**: Comprehensive error handling with toast notifications

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT + bcryptjs
- **Validation**: Zod
- **Email**: Nodemailer
- **File Upload**: Multer
- **Security**: Helmet, CORS

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Animations**: Framer Motion

## 📁 Project Structure

```
roseheavenlysalon-backend/
├── src/
│   ├── config/
│   │   └── prisma.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validate.js
│   ├── modules/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── bookings/
│   │   ├── calendar/
│   │   ├── docs/
│   │   ├── uploads/
│   │   └── users/
│   └── server.js
├── prisma/
│   └── schema.prisma
└── package.json

roseheavenlysalon-frontend/
├── app/
│   ├── account/
│   ├── calendar/
│   ├── login/
│   ├── package/
│   ├── schedule/
│   ├── signup/
│   ├── user-otp/
│   └── layout.jsx
├── components/
│   ├── NavBar.jsx
│   └── Footer.jsx
├── lib/
│   ├── api.js
│   ├── auth-store.js
│   ├── hooks.js
│   └── providers.jsx
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MySQL database
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd roseheavenlysalon-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file with:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/salon_db"
   JWT_SECRET="your-jwt-secret"
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-email-password"
   FRONTEND_URL="http://localhost:3000"
   ```

4. **Database Setup**:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the server**:
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:4000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd roseheavenlysalon-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup** (optional):
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/verify-otp` - Email verification
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/me` - Get user bookings
- `POST /api/bookings/cancel` - Cancel booking
- `GET /api/bookings/today` - Get today's bookings

### Calendar
- `GET /api/calendar` - Get monthly event counts
- `GET /api/calendar/events` - Get daily events

### Users
- `GET /api/users/me` - Get user profile
- `PUT /api/users/me` - Update user profile

### Admin
- `GET /api/admin/promos` - Get promo images
- `PUT /api/admin/promos/:id` - Update promo image
- `POST /api/admin/register` - Register admin

## 🎨 Key Features Implemented

### 1. Complete Authentication Flow
- User registration with email verification
- Secure login with JWT tokens
- Protected routes and API endpoints
- Persistent authentication state

### 2. Modern UI/UX
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Responsive design for all devices
- Loading states and error handling
- Toast notifications for user feedback

### 3. Advanced Form Handling
- React Hook Form integration
- Real-time validation
- Error messages and field highlighting
- Password visibility toggles

### 4. Efficient Data Management
- React Query for server state management
- Optimistic updates
- Automatic cache invalidation
- Background refetching

### 5. Booking System
- Create appointments with validation
- View booking history
- Calendar integration
- Real-time updates

### 6. Error Handling
- Comprehensive error boundaries
- User-friendly error messages
- Network error handling
- Form validation errors

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS configuration
- Helmet security headers
- Input validation with Zod
- Protected API routes

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interfaces
- Adaptive layouts

## 🚀 Performance Optimizations

- React Query caching
- Optimistic updates
- Lazy loading
- Image optimization
- Bundle splitting

## 🧪 Testing the Integration

1. **Start both servers** (backend on port 4000, frontend on port 3000)
2. **Visit** `http://localhost:3000`
3. **Test the signup flow**:
   - Create a new account
   - Verify email with OTP
   - Login with credentials
4. **Test booking system**:
   - Create a new appointment
   - View calendar
   - Check booking history
5. **Test admin features** (if admin user):
   - Access admin panel
   - Manage promo images

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**:
   - Ensure MySQL is running
   - Check DATABASE_URL in .env
   - Run `npx prisma migrate dev`

2. **Email Not Working**:
   - Check EMAIL_USER and EMAIL_PASS in .env
   - Enable "Less secure app access" for Gmail
   - Or use app-specific passwords

3. **CORS Issues**:
   - Verify FRONTEND_URL in backend .env
   - Check CORS configuration in server.js

4. **Port Conflicts**:
   - Backend: Change port in package.json scripts
   - Frontend: Use `npm run dev -- -p 3001`

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="mysql://username:password@localhost:3306/salon_db"
JWT_SECRET="your-super-secret-jwt-key"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-email-password"
FRONTEND_URL="http://localhost:3000"
PORT=4000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review the API documentation
- Open an issue on GitHub

---

**Rose Heavenly Salon** - Complete Backend-Frontend Integration ✅

