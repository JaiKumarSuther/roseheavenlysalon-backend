import { Router } from 'express';
import * as controller from './users.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';

const router = Router();

export const endpoints = [
  { path: '/api/users/me', method: 'GET', description: 'Get current user', params: [], attributes: [], sampleRequest: {}, sampleResponse: { id: 1, email: 'jane@example.com' } },
  { path: '/api/users/me', method: 'PUT', description: 'Update profile (requires current password)', params: ['firstname','lastname','username','address','phone','password'], attributes: [
    { name: 'firstname', in: 'body', type: 'string', required: false, description: 'First name', example: 'Jane' },
    { name: 'lastname', in: 'body', type: 'string', required: false, description: 'Last name', example: 'Doe' },
    { name: 'username', in: 'body', type: 'string', required: false, description: 'Username', example: 'jane' },
    { name: 'address', in: 'body', type: 'string', required: false, description: 'Address', example: '123 St' },
    { name: 'phone', in: 'body', type: 'string', required: false, description: 'Phone number', example: '0917...' },
    { name: 'password', in: 'body', type: 'string', required: true, description: 'Current password to authorize profile change', example: 'currentPass' }
  ], sampleRequest: { firstname: 'Jane', password: 'currentPass' }, sampleResponse: { id: 1 } },
];

router.get('/me', requireAuth, controller.getMe);
router.put(
  '/me',
  requireAuth,
  validate(
    z.object({
      firstname: z.string().optional(),
      lastname: z.string().optional(),
      username: z.string().min(3).optional(),
      address: z.string().optional(),
      phone: z.string().min(5).optional(),
      password: z.string().min(1), // required to authorize profile change
    })
  ),
  controller.updateMe
);

export default router;


