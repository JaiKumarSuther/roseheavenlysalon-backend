import * as service from './docs.service.js';

export async function jsonAll(_req, res) {
  return res.json(service.getEndpoints());
}

export async function jsonModule(req, res) {
  const key = req.params.module;
  const endpoints = service.getEndpointsByModule(key);
  if (!endpoints || endpoints.length === 0) return res.status(404).json({ message: 'Module not found' });
  return res.json(endpoints);
}


