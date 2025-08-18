import * as service from './bookings.service.js';

export async function createBooking(req, res) {
  try {
    const { name, phone, time, date, service1, service2 } = req.body;
    const booking = await service.create({ user: req.user, name, phone, time, date, service1, service2 });
    return res.status(201).json(booking);
  } catch (e) {
    return res.status(500).json({ message: 'Failed to create booking', error: e.message });
  }
}

export async function listMyBookings(req, res) {
  const list = await service.listMine(req.user);
  return res.json(list);
}

export async function cancelBookingByDateTime(req, res) {
  const { date, time } = req.body; // mirrors PHP cancel_apnt.php
  const updated = await service.cancelByDateTime(req.user, date, time);
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


