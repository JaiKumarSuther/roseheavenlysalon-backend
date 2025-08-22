import * as service from './bookings.service.js';

export async function createBooking(req, res) {
  try {
    console.log('Received booking request:', req.body);
    
    const { name, phone, time, date, service1, service2, email, selectedServices, totalPrice } = req.body;
    
    // If user is authenticated, associate booking with user
    let userId = null;
    let userEmail = email;
    
    if (req.user) {
      userId = req.user.id;
      userEmail = req.user.email;
    }
    
    const booking = await service.create({ 
      name, 
      phone, 
      time, 
      date, 
      service1, 
      service2, 
      email: userEmail,
      userId,
      selectedServices,
      totalPrice
    });
    
    console.log('Booking created successfully:', booking);
    return res.status(201).json(booking);
  } catch (e) {
    console.error('Error creating booking:', e);
    return res.status(500).json({ message: 'Failed to create booking', error: e.message });
  }
}

export async function listMyBookings(req, res) {
  const list = await service.listMine(req.user);
  return res.json(list);
}

export async function cancelBookingByDateTime(req, res) {
  const { date, time, remarks } = req.body;
  const updated = await service.cancelByDateTime(req.user, date, time, remarks);
  return res.json({ updated: updated.count });
}

export async function listTodayBookings(req, res) {
  const rows = await service.listToday();
  return res.json(rows);
}

export async function markDone(req, res) {
  await service.updateStatus(req.params.id, 'done');
  return res.json({ message: 'updated' });
}

export async function markCancelled(req, res) {
  await service.updateStatus(req.params.id, 'cancelled');
  return res.json({ message: 'updated' });
}

export async function markRescheduled(req, res) {
  await service.updateStatus(req.params.id, 'rescheduled');
  return res.json({ message: 'updated' });
}

export async function searchByName(req, res) {
  const { q } = req.query;
  const items = await service.searchByName(q);
  return res.json(items);
}


