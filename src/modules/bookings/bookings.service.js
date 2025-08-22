import { prisma } from '../../config/prisma.js';

export async function create({ name, phone, time, date, service1, service2, email = "guest@example.com", userId = null, selectedServices = null, totalPrice = null }) {
  const parsedTime = new Date(`1970-01-01T${time}:00`);
  const parsedDate = new Date(date);
  const y = parsedDate.getUTCFullYear();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const F = monthNames[parsedDate.getUTCMonth()];
  const j = parsedDate.getUTCDate();
  const date2 = `${y}-${F}-${j}`; // PHP: date("Y-F-j")
  
  // If userId is provided, find the user and use their email
  let userEmail = email;
  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      userEmail = user.email;
    }
  }
  
  // Store additional service data as JSON in remarks field for now
  // In a production system, you might want to create separate tables for this
  let remarks = '';
  if (selectedServices && selectedServices.length > 0) {
    const serviceDetails = selectedServices.map(s => `${s.category}: ${s.name} (₱${s.price})`).join(', ');
    remarks = `Services: ${serviceDetails}. Total: ₱${totalPrice || 0}`;
  }
  
  return prisma.event.create({
    data: {
      name,
      email: userEmail,
      phone,
      time: parsedTime,
      date: parsedDate,
      date2,
      service1,
      service2,
      userId: userId,
      remarks: remarks || undefined,
    },
  });
}

export function listMine(user) {
  return prisma.event.findMany({ where: { email: user.email, status: 1 }, orderBy: { date: 'asc' } });
}

export async function cancelByDateTime(user, date, time, remarks = 'cancelled') {
  const parsedDate = new Date(date);
  // Align with how times are stored (no explicit timezone suffix)
  const parsedTime = new Date(`1970-01-01T${time}:00`);
  return prisma.event.updateMany({
    where: { email: user.email, date: parsedDate, time: parsedTime, status: 1 },
    data: { status: 0, remarks },
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


