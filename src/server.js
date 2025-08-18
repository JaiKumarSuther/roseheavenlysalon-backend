import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from './config/prisma.js';

import adminRoutes from './modules/admin/admin.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import bookingsRoutes from './modules/bookings/bookings.routes.js';
import calendarRoutes from './modules/calendar/calendar.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import uploadsRoutes from './modules/uploads/uploads.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use(`/static/${uploadDir}`, express.static(path.join(__dirname, `../${uploadDir}`)));

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected' });
  } catch (e) {
    res.status(500).json({ status: 'error', db: 'disconnected', error: e.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/uploads', uploadsRoutes);

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


