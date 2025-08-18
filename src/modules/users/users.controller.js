import * as service from './users.service.js';

export async function getMe(req, res) {
  const user = await service.getById(req.user.id);
  return res.json(user);
}

export async function updateMe(req, res) {
  const result = await service.updateMe(req.user.id, req.body);
  if (result.error) return res.status(400).json({ message: result.error });
  return res.json(result.user);
}


