import * as service from './admin.service.js';

export async function getPromos(req, res) {
  const list = await service.getPromos();
  return res.json(list);
}

export async function updatePromoImage(req, res) {
  const id = Number(req.params.id);
  const { img_url } = req.body; // in real use, use uploads module to get URL
  const updated = await service.updatePromoImage(id, img_url);
  return res.json(updated);
}


