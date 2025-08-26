import { Router } from 'express';
import * as controller from './calendar.controller.js';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';

const router = Router();

export const endpoints = [
  { path: '/api/calendar', method: 'GET', description: 'Calendar counts per day', queryParams: ['year','month'], attributes: [
    { name: 'year', in: 'query', type: 'number', required: false, description: 'Year (defaults to current year if omitted)', example: 2025 },
    { name: 'month', in: 'query', type: 'number', required: false, description: 'Month 1-12 (defaults to current month if omitted)', example: 1 }
  ], sampleRequest: {}, sampleResponse: { year: 2025, month: 1, counts: [] } },
  { path: '/api/calendar/events', method: 'GET', description: 'Events by date', queryParams: ['date'], attributes: [
    { name: 'date', in: 'query', type: 'string', required: true, description: 'Date in YYYY-MM-DD', example: '2025-01-20' }
  ], sampleRequest: {}, sampleResponse: [] },
  { path: '/api/calendar/monthly', method: 'GET', description: 'Monthly events', queryParams: ['year','month'], attributes: [
    { name: 'year', in: 'query', type: 'number', required: false, description: 'Year (defaults to current year if omitted)', example: 2025 },
    { name: 'month', in: 'query', type: 'number', required: false, description: 'Month 1-12 (defaults to current month if omitted)', example: 1 }
  ], sampleRequest: {}, sampleResponse: { events: [] } },
];

router.get('/', validate(z.object({ year: z.string().optional(), month: z.string().optional() }), 'query'), controller.getCalendar);
router.get('/events', validate(z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }), 'query'), controller.getEventsByDate);
router.get('/monthly', validate(z.object({ year: z.string().optional(), month: z.string().optional() }), 'query'), controller.getMonthlyEvents);

export default router;


