import { Router } from 'express';
import * as controller from './bookings.controller.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';

const router = Router();

// Documentation route (ALWAYS at the top within this module)
export const endpoints = [
  {
    path: '/api/bookings',
    method: 'POST',
    description: 'Create a new booking',
    params: ['name','phone','time','date','service1','service2'],
    attributes: [
      { name: 'name', in: 'body', type: 'string', required: true, description: 'Customer full name', example: 'Jane Doe' },
      { name: 'phone', in: 'body', type: 'string', required: true, description: 'Contact number', example: '0917...' },
      { name: 'time', in: 'body', type: 'string', required: true, description: 'HH:MM 24h time', example: '10:00' },
      { name: 'date', in: 'body', type: 'string', required: true, description: 'YYYY-MM-DD date', example: '2025-01-20' },
      { name: 'service1', in: 'body', type: 'string', required: true, description: 'Primary service', example: 'Hair' },
      { name: 'service2', in: 'body', type: 'string', required: true, description: 'Secondary service', example: 'Haircut' }
    ],
    sampleRequest: { name: 'Jane', phone: '0917...', time: '10:00', date: '2025-01-20', service1: 'Hair', service2: 'Haircut' },
    sampleResponse: { id: 1 }
  },
  {
    path: '/api/bookings/me',
    method: 'GET',
    description: 'Get all active bookings for the logged-in user',
    params: [],
    attributes: [],
    sampleRequest: {},
    sampleResponse: [{ id: 1 }]
  },
  {
    path: '/api/bookings/cancel',
    method: 'POST',
    description: 'Cancel booking by date+time for current user (optional remarks)',
    params: ['date','time','remarks?'],
    attributes: [
      { name: 'date', in: 'body', type: 'string', required: true, description: 'YYYY-MM-DD date', example: '2025-01-20' },
      { name: 'time', in: 'body', type: 'string', required: true, description: 'HH:MM 24h time', example: '10:00' },
      { name: 'remarks', in: 'body', type: 'string', required: false, description: 'Optional remarks', example: 'cancelled' }
    ],
    sampleRequest: { date: '2025-01-20', time: '10:00', remarks: 'cancelled' },
    sampleResponse: { updated: 1 }
  },
  {
    path: '/api/bookings/today',
    method: 'GET',
    description: 'Admin: today’s active bookings',
    params: [],
    attributes: [],
    sampleRequest: {},
    sampleResponse: [{ id: 1 }]
  },
  {
    path: '/api/bookings/:id/done',
    method: 'POST',
    description: 'Admin: mark booking done',
    params: ['id'],
    attributes: [
      { name: 'id', in: 'path', type: 'number', required: true, description: 'Booking ID', example: 1 }
    ],
    sampleRequest: {},
    sampleResponse: { message: 'updated' }
  },
  {
    path: '/api/bookings/:id/cancel',
    method: 'POST',
    description: 'Admin: cancel booking',
    params: ['id'],
    attributes: [
      { name: 'id', in: 'path', type: 'number', required: true, description: 'Booking ID', example: 1 }
    ],
    sampleRequest: {},
    sampleResponse: { message: 'updated' }
  },
  {
    path: '/api/bookings/:id/reschedule',
    method: 'POST',
    description: 'Admin: reschedule booking',
    params: ['id'],
    attributes: [
      { name: 'id', in: 'path', type: 'number', required: true, description: 'Booking ID', example: 1 }
    ],
    sampleRequest: {},
    sampleResponse: { message: 'updated' }
  },
  {
    path: '/api/bookings/search?q=',
    method: 'GET',
    description: 'Admin: search bookings by customer name',
    queryParams: ['q'],
    attributes: [
      { name: 'q', in: 'query', type: 'string', required: true, description: 'Search term for customer name', example: 'Jane' }
    ],
    sampleRequest: {},
    sampleResponse: [{ id: 1 }]
  }
];

const createSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(5),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  service1: z.string().min(1),
  service2: z.string().min(1),
});
router.post('/', validate(createSchema), controller.createBooking);

router.get('/me', requireAuth, controller.listMyBookings);
router.post(
  '/cancel',
  requireAuth,
  validate(
    z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      time: z.string().regex(/^\d{2}:\d{2}$/),
      remarks: z.string().optional(),
    })
  ),
  controller.cancelBookingByDateTime
);

router.get('/today', requireAuth, requireAdmin, controller.listTodayBookings);
router.post('/:id/done', requireAuth, requireAdmin, controller.markDone);
router.post('/:id/cancel', requireAuth, requireAdmin, controller.markCancelled);
router.post('/:id/reschedule', requireAuth, requireAdmin, controller.markRescheduled);
router.get('/search', requireAuth, requireAdmin, validate(z.object({ q: z.string().min(1) }), 'query'), controller.searchByName);

export default router;


