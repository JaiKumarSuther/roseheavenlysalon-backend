import { prisma } from '../../config/prisma.js';

export async function create({ user, name, phone, time, date, service1, service2 }) {
  const parsedTime = new Date(`1970-01-01T${time}:00`);
  const parsedDate = new Date(date);
  const y = parsedDate.getUTCFullYear();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const F = monthNames[parsedDate.getUTCMonth()];
  const j = parsedDate.getUTCDate();
  const date2 = `${y}-${F}-${j}`; // PHP: date("Y-F-j")
  return prisma.event.create({
    data: {
      name,
      email: user.email,
      phone,
      time: parsedTime,
      date: parsedDate,
      date2,
      service1,
      service2,
      user: { connect: { id: user.id } },
    },
  });
}

export function listMine(user) {
  return prisma.event.findMany({ where: { email: user.email, status: 1 }, orderBy: { date: 'asc' } });
}

export async function cancelByDateTime(user, date, time) {
  const parsedDate = new Date(date);
  const parsedTime = new Date(`1970-01-01T${time}:00Z`);
  return prisma.event.updateMany({
    where: { email: user.email, date: parsedDate, time: parsedTime, status: 1 },
    data: { status: 0, remarks: 'canceled' },
  });
}

export async function listToday() {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  return prisma.event.findMany({ where: { status: 1, date: { gte: start, lte: end } }, orderBy: [{ date: 'asc' }, { time: 'asc' }] });
}

export function updateStatus(id, remarks) {
  return prisma.event.update({ where: { id: Number(id) }, data: { remarks, status: 0 } });
}

export function searchByName(q) {
  return prisma.event.findMany({ where: { name: { contains: q }, status: 1 }, orderBy: [{ date: 'asc' }, { time: 'asc' }] });
}


