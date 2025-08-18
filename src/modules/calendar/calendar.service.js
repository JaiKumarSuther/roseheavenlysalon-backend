import { prisma } from '../../config/prisma.js';

export async function getCounts(year, month) {
  const y = Number(year) || new Date().getFullYear();
  const m = Number(month) || new Date().getMonth() + 1;
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0, 23, 59, 59);

  const rows = await prisma.event.groupBy({
    by: ['date'],
    where: { status: 1, date: { gte: start, lte: end } },
    _count: { _all: true },
    orderBy: { date: 'asc' },
  });

  const counts = rows.map(r => ({ d: r.date, c: r._count._all }));
  return { year: y, month: m, counts };
}

export function getEvents(date) {
  return prisma.event.findMany({
    where: { date: new Date(date), status: 1 },
    select: { service1: true, service2: true, time: true, name: true, phone: true },
    orderBy: { time: 'asc' },
  });
}


