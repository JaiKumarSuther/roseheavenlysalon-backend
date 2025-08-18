import { Router } from 'express';
import * as controller from './admin.controller.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/promos', controller.getPromos);
router.put('/promos/:id', controller.updatePromoImage);

export default router;


