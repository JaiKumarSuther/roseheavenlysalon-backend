export function getEndpoints() {
  return [
    { method: 'POST', path: '/api/auth/signup', description: 'Register new user and send OTP', params: ['firstname','lastname','username','email','address','phone','password'], sampleRequest: { firstname: 'Jane', lastname: 'Doe', username: 'jane', email: 'jane@example.com', address: '123 St', phone: '0917...', password: 'secret123' }, sampleResponse: { message: 'Signup successful, verification code sent', userId: 1 } },
    { method: 'POST', path: '/api/auth/verify-otp', description: 'Verify OTP and return token', params: ['otp'], sampleRequest: { otp: 123456 }, sampleResponse: { message: 'Verified', token: '<jwt>' } },
    { method: 'POST', path: '/api/auth/login', description: 'Login and return token', params: ['email','password'], sampleRequest: { email: 'jane@example.com', password: 'secret123' }, sampleResponse: { token: '<jwt>' } },
    { method: 'GET', path: '/api/users/me', description: 'Get current user', sampleRequest: {}, sampleResponse: { id: 1, email: 'jane@example.com', username: 'jane' } },
    { method: 'PUT', path: '/api/users/me', description: 'Update profile (requires current password)', params: ['firstname','lastname','username','address','phone','password'], sampleRequest: { firstname: 'Jane', password: 'secret123' }, sampleResponse: { id: 1, username: 'jane' } },
    { method: 'POST', path: '/api/bookings', description: 'Create booking', params: ['name','phone','time','date','service1','service2'], sampleRequest: { name: 'Jane', phone: '0917...', time: '10:00', date: '2025-01-20', service1: 'Hair', service2: 'Haircut' }, sampleResponse: { id: 1 } },
    { method: 'GET', path: '/api/bookings/me', description: 'List my active bookings', sampleRequest: {}, sampleResponse: [{ id: 1 }] },
    { method: 'POST', path: '/api/bookings/cancel', description: 'Cancel by date+time', params: ['date','time'], sampleRequest: { date: '2025-01-20', time: '10:00' }, sampleResponse: { updated: 1 } },
    { method: 'GET', path: '/api/bookings/today', description: 'Admin: today bookings', sampleRequest: {}, sampleResponse: [{ id: 1 }] },
    { method: 'GET', path: '/api/bookings/search', description: 'Admin: search by name', queryParams: ['q'], sampleRequest: {}, sampleResponse: [{ id: 1 }] },
    { method: 'GET', path: '/api/calendar', description: 'Calendar counts per day', queryParams: ['year','month'], sampleRequest: {}, sampleResponse: { counts: [] } },
    { method: 'GET', path: '/api/calendar/events', description: 'Events by date', queryParams: ['date'], sampleRequest: {}, sampleResponse: [] },
    { method: 'POST', path: '/api/uploads/image', description: 'Admin: upload promo image', params: ['image'], sampleRequest: {}, sampleResponse: { url: '/static/uploads/IMG-...' } },
    { method: 'GET', path: '/api/admin/promos', description: 'Admin: list promo images', sampleRequest: {}, sampleResponse: [{ id:1, img_url:'...' }] },
    { method: 'PUT', path: '/api/admin/promos/:id', description: 'Admin: update promo image', params: ['img_url'], sampleRequest: { img_url: 'IMG-xyz.png' }, sampleResponse: { id:1, img_url:'...' } },
  ];
}

export function getModules() {
  return [
    { name: 'Auth', link: '/docs/endpoints#auth', description: 'Signup, OTP, login, password reset' },
    { name: 'Users', link: '/docs/endpoints#users', description: 'Profile management' },
    { name: 'Bookings', link: '/docs/endpoints#bookings', description: 'Create/cancel bookings, admin views' },
    { name: 'Calendar', link: '/docs/endpoints#calendar', description: 'Counts and daily events' },
    { name: 'Uploads', link: '/docs/endpoints#uploads', description: 'Admin image uploads' },
    { name: 'Admin', link: '/docs/endpoints#admin', description: 'Promo image management' },
  ];
}


