import { Router } from 'express';
import * as controller from './calendar.controller.js';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';

const router = Router();

router.get('/', validate(z.object({ year: z.string().optional(), month: z.string().optional() }), 'query'), controller.getCalendar);
router.get('/events', validate(z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }), 'query'), controller.getEventsByDate);

export default router;


