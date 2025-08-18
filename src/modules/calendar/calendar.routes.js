import { Router } from 'express';
import * as controller from './calendar.controller.js';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';

const router = Router();

const endpoints = [
  { path: '/api/calendar', method: 'GET', description: 'Calendar counts per day', queryParams: ['year','month'], sampleRequest: {}, sampleResponse: { year: 2025, month: 1, counts: [] } },
  { path: '/api/calendar/events', method: 'GET', description: 'Events by date', queryParams: ['date'], sampleRequest: {}, sampleResponse: [] },
];
router.get('/docs', (req, res) => res.render('docs', { endpoints }));

router.get('/', validate(z.object({ year: z.string().optional(), month: z.string().optional() }), 'query'), controller.getCalendar);
router.get('/events', validate(z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }), 'query'), controller.getEventsByDate);

export default router;


