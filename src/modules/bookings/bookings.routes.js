import { Router } from 'express';
import * as controller from './bookings.controller.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';

const router = Router();

// user endpoints
const createSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(5),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  service1: z.string().min(1),
  service2: z.string().min(1),
});
router.post('/', requireAuth, validate(createSchema), controller.createBooking);
router.get('/me', requireAuth, controller.listMyBookings);
router.post('/cancel', requireAuth, validate(z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), time: z.string().regex(/^\d{2}:\d{2}$/) })), controller.cancelBookingByDateTime);

// admin endpoints (mirror admin-schedule and process.php)
router.get('/today', requireAuth, requireAdmin, controller.listTodayBookings);
router.post('/:id/done', requireAuth, requireAdmin, controller.markDone);
router.post('/:id/cancel', requireAuth, requireAdmin, controller.markCancelled);
router.post('/:id/reschedule', requireAuth, requireAdmin, controller.markRescheduled);
router.get('/search', requireAuth, requireAdmin, validate(z.object({ q: z.string().min(1) }), 'query'), controller.searchByName);

export default router;


