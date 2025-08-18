import { Router } from 'express';
import * as controller from './users.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

const endpoints = [
  { path: '/api/users/me', method: 'GET', description: 'Get current user', params: [], sampleRequest: {}, sampleResponse: { id: 1, email: 'jane@example.com' } },
  { path: '/api/users/me', method: 'PUT', description: 'Update profile (requires current password)', params: ['firstname','lastname','username','address','phone','password'], sampleRequest: { firstname: 'Jane', password: 'currentPass' }, sampleResponse: { id: 1 } },
];
router.get('/docs', (req, res) => res.render('docs', { endpoints }));

router.get('/me', requireAuth, controller.getMe);
router.put('/me', requireAuth, controller.updateMe);

export default router;


