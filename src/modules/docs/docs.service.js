// Central docs registry built from per-module route exports
import { endpoints as authEndpoints } from '../auth/auth.routes.js';
import { endpoints as usersEndpoints } from '../users/users.routes.js';
import { endpoints as bookingsEndpoints } from '../bookings/bookings.routes.js';
import { endpoints as calendarEndpoints } from '../calendar/calendar.routes.js';
import { endpoints as uploadsEndpoints } from '../uploads/uploads.routes.js';
import { endpoints as adminEndpoints } from '../admin/admin.routes.js';

function withModuleName(items, module) {
  return items.map(e => ({ ...e, module }));
}

const registry = [
  ...withModuleName(authEndpoints || [], 'auth'),
  ...withModuleName(usersEndpoints || [], 'users'),
  ...withModuleName(bookingsEndpoints || [], 'bookings'),
  ...withModuleName(calendarEndpoints || [], 'calendar'),
  ...withModuleName(uploadsEndpoints || [], 'uploads'),
  ...withModuleName(adminEndpoints || [], 'admin'),
];

const moduleMeta = [
  { key: 'auth', name: 'Auth', link: '/docs/auth', description: 'Signup, OTP, login, password reset' },
  { key: 'users', name: 'Users', link: '/docs/users', description: 'Profile management' },
  { key: 'bookings', name: 'Bookings', link: '/docs/bookings', description: 'Create/cancel bookings, admin views' },
  { key: 'calendar', name: 'Calendar', link: '/docs/calendar', description: 'Counts and daily events' },
  { key: 'uploads', name: 'Uploads', link: '/docs/uploads', description: 'Admin image uploads' },
  { key: 'admin', name: 'Admin', link: '/docs/admin', description: 'Promo images and admin ops' },
];

export function getEndpoints() {
  return registry;
}

export function getModules() {
  return moduleMeta;
}

export function getEndpointsByModule(key) {
  return registry.filter(e => e.module === key);
}

export function getModuleMeta(key) {
  return moduleMeta.find(m => m.key === key);
}


