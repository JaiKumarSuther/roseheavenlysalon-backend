import * as service from './calendar.service.js';

export async function getCalendar(req, res) {
  const data = await service.getCounts(req.query.year, req.query.month);
  return res.json(data);
}

export async function getEventsByDate(req, res) {
  const { date } = req.query; // yyyy-mm-dd
  const items = await service.getEvents(date);
  return res.json({ events: items.map(i => ({ ...i, time: new Date(i.time).toISOString().substring(11, 16) })) });
}


