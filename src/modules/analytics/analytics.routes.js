import { Router } from 'express';
import * as controller from './analytics.controller.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';

const router = Router();

export const endpoints = [
  {
    path: '/api/analytics/dashboard',
    method: 'GET',
    description: 'Get dashboard statistics overview',
    params: [],
    attributes: [],
    sampleRequest: {},
    sampleResponse: {
      totalBookings: 156,
      totalRevenue: 23450,
      totalCustomers: 89,
      averageRating: 4.8
    }
  },
  {
    path: '/api/analytics/bookings',
    method: 'GET',
    description: 'Get booking statistics by time range',
    queryParams: ['range'],
    attributes: [
      { name: 'range', in: 'query', type: 'string', required: false, description: 'Time range (week, month, year)', example: 'week' }
    ],
    sampleRequest: {},
    sampleResponse: {
      completed: 142,
      cancelled: 8,
      rescheduled: 6,
      pending: 12
    }
  },
  {
    path: '/api/analytics/revenue',
    method: 'GET',
    description: 'Get revenue statistics by time range',
    queryParams: ['range'],
    attributes: [
      { name: 'range', in: 'query', type: 'string', required: false, description: 'Time range (week, month, year)', example: 'week' }
    ],
    sampleRequest: {},
    sampleResponse: {
      current: 23450,
      previous: 19800,
      growth: 18.4
    }
  },
  {
    path: '/api/analytics/customers',
    method: 'GET',
    description: 'Get customer statistics',
    params: [],
    attributes: [],
    sampleRequest: {},
    sampleResponse: {
      newCustomers: 23,
      returningCustomers: 66,
      averageVisitFrequency: 2.3,
      customerSatisfaction: 4.8
    }
  },
  {
    path: '/api/analytics/services',
    method: 'GET',
    description: 'Get service performance statistics',
    params: [],
    attributes: [],
    sampleRequest: {},
    sampleResponse: [
      { name: 'Hair Cut & Style', bookings: 45, revenue: 6750 }
    ]
  },
  {
    path: '/api/analytics/monthly',
    method: 'GET',
    description: 'Get monthly statistics for a year',
    queryParams: ['year'],
    attributes: [
      { name: 'year', in: 'query', type: 'number', required: false, description: 'Year for statistics', example: 2025 }
    ],
    sampleRequest: {},
    sampleResponse: [
      { month: 'Jan', bookings: 12, revenue: 1800 }
    ]
  },
  {
    path: '/api/analytics/top-services',
    method: 'GET',
    description: 'Get top performing services',
    params: [],
    attributes: [],
    sampleRequest: {},
    sampleResponse: [
      { name: 'Hair Cut & Style', bookings: 45, revenue: 6750 }
    ]
  },
  {
    path: '/api/analytics/customer-insights',
    method: 'GET',
    description: 'Get customer insights and analytics',
    params: [],
    attributes: [],
    sampleRequest: {},
    sampleResponse: {
      newCustomers: 23,
      returningCustomers: 66,
      averageVisitFrequency: 2.3,
      customerSatisfaction: 4.8
    }
  }
];

// All analytics routes require admin authentication
router.use(requireAuth, requireAdmin);

router.get('/dashboard', controller.getDashboardStats);
router.get('/bookings', validate(z.object({ range: z.enum(['week', 'month', 'year']).optional() }), 'query'), controller.getBookingStats);
router.get('/revenue', validate(z.object({ range: z.enum(['week', 'month', 'year']).optional() }), 'query'), controller.getRevenueStats);
router.get('/customers', controller.getCustomerStats);
router.get('/services', controller.getServiceStats);
router.get('/monthly', validate(z.object({ year: z.string().optional() }), 'query'), controller.getMonthlyStats);
router.get('/top-services', controller.getTopServices);
router.get('/customer-insights', controller.getCustomerInsights);

export default router;

