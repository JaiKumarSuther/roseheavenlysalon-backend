import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';

export function getById(id) {
  return prisma.user.findUnique({ where: { id }, select: { id: true, firstname: true, lastname: true, username: true, email: true, address1: true, phone: true } });
}

export async function updateMe(id, { firstname, lastname, username, address, phone, password }) {
  const current = await prisma.user.findUnique({ where: { id } });
  if (password && !(await bcrypt.compare(password, current.password))) {
    return { error: 'Wrong Password. Please try again' };
  }
  const u = username
    ? await prisma.user.findFirst({ where: { username, NOT: { id } } })
    : null;
  if (u) return { error: 'Username has been used. Please put another username' };
  const p = phone
    ? await prisma.user.findFirst({ where: { phone, NOT: { id } } })
    : null;
  if (p) return { error: 'Phone number has been used. Please put another phone number' };
  const updated = await prisma.user.update({
    where: { id },
    data: { firstname, lastname, username, address1: address, phone },
    select: { id: true, firstname: true, lastname: true, username: true, email: true, address1: true, phone: true },
  });
  return { user: updated };
}


