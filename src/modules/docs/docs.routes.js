import { Router } from 'express';
import * as controller from './docs.controller.js';

const router = Router();

router.get('/', controller.renderModulesIndex);
router.get('/endpoints', controller.renderDocs);

export default router;


