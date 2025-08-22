import { Router } from 'express';
import * as controller from './docs.controller.js';
import { getModules, getEndpointsByModule } from './docs.service.js';

const router = Router();
// JSON docs endpoints
router.get('/', (req, res) => {
  const modules = getModules();
  res.json({ modules });
});
router.get('/json/all', controller.jsonAll);
router.get('/json/:module', controller.jsonModule);

// Place parameterized route after the '/json/*' routes to avoid collisions
router.get('/:module', (req, res) => {
  const key = req.params.module;
  const endpoints = getEndpointsByModule(key);
  if (!endpoints || endpoints.length === 0) return res.status(404).json({ message: 'Module not found' });
  res.json({ key, endpoints });
});

export default router;


