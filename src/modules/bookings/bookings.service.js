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
  return prisma.event.findMany({ 
    where: { email: user.email }, 
    orderBy: { date: 'asc' } 
  });
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

export async function listAll() {
  return prisma.event.findMany({ 
    where: { status: 1 }, 
    orderBy: [{ date: 'desc' }, { time: 'asc' }] 
  });
}

export async function listByDate(date) {
  const parsedDate = new Date(date);
  const start = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
  const end = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), 23, 59, 59);
  
  return prisma.event.findMany({ 
    where: { 
      status: 1, 
      date: { gte: start, lte: end } 
    }, 
    orderBy: [{ date: 'asc' }, { time: 'asc' }] 
  });
}

export async function listByDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  return prisma.event.findMany({ 
    where: { 
      status: 1, 
      date: { gte: start, lte: end } 
    }, 
    orderBy: [{ date: 'asc' }, { time: 'asc' }] 
  });
}

export async function searchByName(query) {
  return prisma.event.findMany({
    where: {
      status: 1,
      name: {
        contains: query,
        mode: 'insensitive'
      }
    },
    orderBy: [{ date: 'desc' }, { time: 'asc' }]
  });
}

export function updateStatus(id, status) {
  // Map status strings to numeric values
  let statusValue = 1; // default to active (pending)
  if (status === 'cancelled') {
    statusValue = 0; // inactive
  } else if (status === 'done') {
    statusValue = 2; // completed
  }
  
  return prisma.event.update({
    where: { id: parseInt(id) },
    data: { 
      status: statusValue,
      remarks: status 
    }
  });
}


