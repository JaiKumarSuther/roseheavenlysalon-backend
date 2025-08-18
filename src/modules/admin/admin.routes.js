import { Router } from 'express';
import * as controller from './admin.controller.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';

const router = Router();

const endpoints = [
  { path: '/api/admin/promos', method: 'GET', description: 'List promo images', params: [], sampleRequest: {}, sampleResponse: [{ id: 1, img_url: 'IMG-...' }] },
  { path: '/api/admin/promos/:id', method: 'PUT', description: 'Update promo image', params: ['img_url'], sampleRequest: { img_url: 'IMG-xyz.png' }, sampleResponse: { id: 1, img_url: 'IMG-xyz.png' } },
];
router.get('/docs', (req, res) => res.render('docs', { endpoints }));

router.use(requireAuth, requireAdmin);

router.get('/promos', controller.getPromos);
router.put('/promos/:id', controller.updatePromoImage);

export default router;


