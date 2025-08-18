import { Router } from 'express';
import * as controller from './bookings.controller.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';

const router = Router();

// Documentation route (ALWAYS at the top within this module)
const endpoints = [
  {
    path: '/api/bookings',
    method: 'POST',
    description: 'Create a new booking',
    params: ['name','phone','time','date','service1','service2'],
    sampleRequest: { name: 'Jane', phone: '0917...', time: '10:00', date: '2025-01-20', service1: 'Hair', service2: 'Haircut' },
    sampleResponse: { id: 1 }
  },
  {
    path: '/api/bookings/me',
    method: 'GET',
    description: 'Get all active bookings for the logged-in user',
    params: [],
    sampleRequest: {},
    sampleResponse: [{ id: 1 }]
  },
  {
    path: '/api/bookings/cancel',
    method: 'POST',
    description: 'Cancel booking by date+time for current user',
    params: ['date','time'],
    sampleRequest: { date: '2025-01-20', time: '10:00' },
    sampleResponse: { updated: 1 }
  },
  {
    path: '/api/bookings/today',
    method: 'GET',
    description: 'Admin: today’s active bookings',
    params: [],
    sampleRequest: {},
    sampleResponse: [{ id: 1 }]
  },
  {
    path: '/api/bookings/:id/done',
    method: 'POST',
    description: 'Admin: mark booking done',
    params: ['id'],
    sampleRequest: {},
    sampleResponse: { message: 'updated' }
  },
  {
    path: '/api/bookings/:id/cancel',
    method: 'POST',
    description: 'Admin: cancel booking',
    params: ['id'],
    sampleRequest: {},
    sampleResponse: { message: 'updated' }
  },
  {
    path: '/api/bookings/:id/reschedule',
    method: 'POST',
    description: 'Admin: reschedule booking',
    params: ['id'],
    sampleRequest: {},
    sampleResponse: { message: 'updated' }
  },
  {
    path: '/api/bookings/search?q=',
    method: 'GET',
    description: 'Admin: search bookings by customer name',
    queryParams: ['q'],
    sampleRequest: {},
    sampleResponse: [{ id: 1 }]
  }
];
router.get('/docs', (req, res) => res.render('docs', { endpoints }));

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

router.get('/today', requireAuth, requireAdmin, controller.listTodayBookings);
router.post('/:id/done', requireAuth, requireAdmin, controller.markDone);
router.post('/:id/cancel', requireAuth, requireAdmin, controller.markCancelled);
router.post('/:id/reschedule', requireAuth, requireAdmin, controller.markRescheduled);
router.get('/search', requireAuth, requireAdmin, validate(z.object({ q: z.string().min(1) }), 'query'), controller.searchByName);

export default router;


