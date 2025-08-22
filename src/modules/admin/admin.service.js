import { prisma } from '../../config/prisma.js';
import bcrypt from 'bcryptjs';

export function getPromos() {
  return prisma.image.findMany({ orderBy: { id: 'asc' } });
}

export function updatePromoImage(id, img_url) {
  return prisma.image.update({ where: { id: Number(id) }, data: { img_url } });
}

export async function registerAdmin({ username, email, phone, password }) {
  const existingByEmail = await prisma.user.findUnique({ where: { email } });
  if (existingByEmail) return { error: 'Email already exists' };
  const existingByUsername = await prisma.user.findFirst({ where: { username } });
  if (existingByUsername) return { error: 'Username already exists' };
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      phone,
      password: passwordHash,
      user_type: 'admin',
  
    },
    select: { id: true, username: true, email: true, phone: true, user_type: true },
  });
  return { user };
}


