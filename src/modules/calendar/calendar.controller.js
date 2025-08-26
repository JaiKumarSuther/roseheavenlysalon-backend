import * as service from './calendar.service.js';

export async function getCalendar(req, res) {
  const data = await service.getCounts(req.query.year, req.query.month);
  return res.json(data);
}

export async function getEventsByDate(req, res) {
  const { date } = req.query; // yyyy-mm-dd
  const items = await service.getEvents(date);
  return res.json({ 
    events: items.map(i => ({ 
      ...i, 
      time: new Date(i.time).toISOString().substring(11, 16) 
    })) 
  });
}

export async function getMonthlyEvents(req, res) {
  const { year, month } = req.query;
  const events = await service.getMonthlyEvents(year, month);
  return res.json({ 
    events: events.map(event => ({
      ...event,
      time: new Date(event.time).toISOString().substring(11, 16),
      date: event.date.toISOString().split('T')[0]
    }))
  });
}


