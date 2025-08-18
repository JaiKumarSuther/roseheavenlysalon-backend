import { prisma } from '../../config/prisma.js';

export function getPromos() {
  return prisma.image.findMany({ orderBy: { id: 'asc' } });
}

export function updatePromoImage(id, img_url) {
  return prisma.image.update({ where: { id: Number(id) }, data: { img_url } });
}


