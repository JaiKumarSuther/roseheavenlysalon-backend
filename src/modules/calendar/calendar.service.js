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

  const counts = rows.map(r => ({ 
    d: r.date.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
    c: r._count._all 
  }));
  
  return { year: y, month: m, counts };
}

export async function getEvents(date) {
  // Create date range for the entire day
  const startOfDay = new Date(date + 'T00:00:00.000Z');
  const endOfDay = new Date(date + 'T23:59:59.999Z');
  
  const events = await prisma.event.findMany({
    where: { 
      date: { 
        gte: startOfDay, 
        lte: endOfDay 
      }, 
      status: 1 
    },
    select: { service1: true, service2: true, time: true, name: true, phone: true },
    orderBy: { time: 'asc' },
  });
  
  return events;
}


