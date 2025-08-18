import { Router } from 'express';
import * as controller from './users.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, controller.getMe);
router.put('/me', requireAuth, controller.updateMe);

export default router;


