import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import { prisma } from './config/prisma.js';
import adminRoutes from './modules/admin/admin.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import bookingsRoutes from './modules/bookings/bookings.routes.js';
import calendarRoutes from './modules/calendar/calendar.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import uploadsRoutes from './modules/uploads/uploads.routes.js';
import docsRoutes from './modules/docs/docs.routes.js';
import { getEndpoints } from './modules/docs/docs.service.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost on any port for development
    if (origin.match(/^https?:\/\/localhost:\d+$/) || 
        origin.match(/^https?:\/\/127\.0\.0\.1:\d+$/)) {
      return callback(null, true);
    }
    
    // Allow specific production domains if needed
    if (origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static public assets (docs UI, etc.)
app.use('/public', express.static(path.join(__dirname, 'public')));

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use(`/static/${uploadDir}`, express.static(path.join(__dirname, `../${uploadDir}`)));

// Root route -> JSON listing of all endpoints
app.get('/', (req, res) => {
  const endpoints = getEndpoints();
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.json({ baseUrl, endpoints });
});

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected' });
  } catch (e) {
    res.status(500).json({ status: 'error', db: 'disconnected', error: e.message });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/uploads', uploadsRoutes);

// Docs UI and JSON (no view engine)
app.use('/docs', docsRoutes);

// 404 handler for API
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Not Found', path: req.originalUrl });
});

const PORT = process.env.PORT || 4000;
async function start() {
  try {
    await prisma.$connect();
    console.log('Prisma connected to database');
  } catch (e) {
    console.error('Database connection failed:', e.message);
  }
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

start();


