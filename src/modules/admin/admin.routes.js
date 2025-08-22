import { Router } from 'express';
import * as controller from './admin.controller.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';

const router = Router();

export const endpoints = [
  { path: '/api/admin/promos', method: 'GET', description: 'List promo images', params: [], attributes: [], sampleRequest: {}, sampleResponse: [{ id: 1, img_url: 'IMG-...' }] },
  { path: '/api/admin/promos/:id', method: 'PUT', description: 'Update promo image', params: ['img_url'], attributes: [
    { name: 'id', in: 'path', type: 'number', required: true, description: 'Promo ID', example: 1 },
    { name: 'img_url', in: 'body', type: 'string', required: true, description: 'New image URL or filename', example: 'IMG-xyz.png' }
  ], sampleRequest: { img_url: 'IMG-xyz.png' }, sampleResponse: { id: 1, img_url: 'IMG-xyz.png' } },
  { path: '/api/admin/register', method: 'POST', description: 'Register a new admin user', params: ['username','email','phone','password'], attributes: [
    { name: 'username', in: 'body', type: 'string', required: true, description: 'Unique admin username', example: 'admin1' },
    { name: 'email', in: 'body', type: 'string', required: true, description: 'Admin email', example: 'a@b.com' },
    { name: 'phone', in: 'body', type: 'string', required: true, description: 'Admin phone', example: '0917...' },
    { name: 'password', in: 'body', type: 'string', required: true, description: 'Password (min 8 chars)', example: 'secret123' }
  ], sampleRequest: { username: 'admin1', email: 'a@b.com', phone: '0917...', password: 'secret123' }, sampleResponse: { id: 10, username: 'admin1' } },
];

router.post(
  '/register',
  requireAuth,
  requireAdmin,
  validate(z.object({ username: z.string().min(3), email: z.string().email(), phone: z.string().min(5), password: z.string().min(8) })),
  controller.registerAdmin
);

router.use(requireAuth, requireAdmin);

router.get('/promos', controller.getPromos);
router.put('/promos/:id', controller.updatePromoImage);

export default router;


