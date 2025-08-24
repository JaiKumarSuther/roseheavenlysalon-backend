import { PrismaClient } from '@prisma/client';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subWeeks, subMonths, subYears } from 'date-fns';

const prisma = new PrismaClient();

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    // Get total bookings
    const totalBookings = await prisma.event.count();

    // Get today's bookings
    const todayBookings = await prisma.event.count({
      where: {
        date: {
          gte: startOfToday,
          lte: endOfToday
        }
      }
    });

    // Get completed bookings
    const completedBookings = await prisma.event.count({
      where: {
        remarks: 'done'
      }
    });

    // Get cancelled bookings
    const cancelledBookings = await prisma.event.count({
      where: {
        remarks: 'cancelled'
      }
    });

    // Get rescheduled bookings
    const rescheduledBookings = await prisma.event.count({
      where: {
        remarks: 'rescheduled'
      }
    });

    // Get total users
    const totalUsers = await prisma.user.count({
      where: {
        user_type: 'user'
      }
    });

    // Calculate total revenue (assuming each booking has a fixed price for now)
    // In a real scenario, you'd have a pricing table
    const basePrice = 150; // Average service price
    const totalRevenue = totalBookings * basePrice;

    // Calculate real average rating from ratings table
    const ratingsResult = await prisma.rating.aggregate({
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    const averageRating = ratingsResult._avg.rating || 0;
    const totalRatings = ratingsResult._count.rating || 0;

    res.json({
      totalBookings,
      todayBookings,
      completedBookings,
      cancelledBookings,
      rescheduledBookings,
      totalUsers,
      totalRevenue,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalRatings
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ error: 'Failed to get dashboard statistics' });
  }
};

export const getBookingStats = async (req, res) => {
  try {
    const { range = 'week' } = req.query;
    let startDate, endDate;

    const now = new Date();

    switch (range) {
      case 'week':
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'year':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      default:
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
    }

    const [completed, cancelled, rescheduled, pending] = await Promise.all([
      prisma.event.count({
        where: {
          date: { gte: startDate, lte: endDate },
          remarks: 'done'
        }
      }),
      prisma.event.count({
        where: {
          date: { gte: startDate, lte: endDate },
          remarks: 'cancelled'
        }
      }),
      prisma.event.count({
        where: {
          date: { gte: startDate, lte: endDate },
          remarks: 'rescheduled'
        }
      }),
      prisma.event.count({
        where: {
          date: { gte: startDate, lte: endDate },
          remarks: { not: { in: ['done', 'cancelled', 'rescheduled'] } }
        }
      })
    ]);

    res.json({
      completed,
      cancelled,
      rescheduled,
      pending
    });
  } catch (error) {
    console.error('Error getting booking stats:', error);
    res.status(500).json({ error: 'Failed to get booking statistics' });
  }
};

export const getRevenueStats = async (req, res) => {
  try {
    const { range = 'week' } = req.query;
    let startDate, endDate, previousStartDate, previousEndDate;

    const now = new Date();

    switch (range) {
      case 'week':
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        previousStartDate = startOfWeek(subWeeks(now, 1));
        previousEndDate = endOfWeek(subWeeks(now, 1));
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        previousStartDate = startOfMonth(subMonths(now, 1));
        previousEndDate = endOfMonth(subMonths(now, 1));
        break;
      case 'year':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        previousStartDate = startOfYear(subYears(now, 1));
        previousEndDate = endOfYear(subYears(now, 1));
        break;
      default:
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        previousStartDate = startOfWeek(subWeeks(now, 1));
        previousEndDate = endOfWeek(subWeeks(now, 1));
    }

    const basePrice = 150;

    const [currentBookings, previousBookings] = await Promise.all([
      prisma.event.count({
        where: {
          date: { gte: startDate, lte: endDate },
          remarks: 'done'
        }
      }),
      prisma.event.count({
        where: {
          date: { gte: previousStartDate, lte: previousEndDate },
          remarks: 'done'
        }
      })
    ]);

    const current = currentBookings * basePrice;
    const previous = previousBookings * basePrice;
    const growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;

    res.json({
      current,
      previous,
      growth: Math.round(growth * 10) / 10
    });
  } catch (error) {
    console.error('Error getting revenue stats:', error);
    res.status(500).json({ error: 'Failed to get revenue statistics' });
  }
};

export const getCustomerStats = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get new customers (registered in last 30 days)
    const newCustomers = await prisma.user.count({
      where: {
        user_type: 'user',
        createdAt: { gte: thirtyDaysAgo }
      }
    });

    // Get total customers
    const totalCustomers = await prisma.user.count({
      where: {
        user_type: 'user'
      }
    });

    const returningCustomers = totalCustomers - newCustomers;

    // Calculate average visit frequency
    const totalBookings = await prisma.event.count();
    const averageVisitFrequency = totalCustomers > 0 ? (totalBookings / totalCustomers) : 0;

    // Calculate real customer satisfaction from ratings
    const satisfactionResult = await prisma.rating.aggregate({
      _avg: {
        rating: true
      }
    });

    const customerSatisfaction = satisfactionResult._avg.rating || 0;

    res.json({
      newCustomers,
      returningCustomers,
      averageVisitFrequency: Math.round(averageVisitFrequency * 10) / 10,
      customerSatisfaction: Math.round(customerSatisfaction * 10) / 10
    });
  } catch (error) {
    console.error('Error getting customer stats:', error);
    res.status(500).json({ error: 'Failed to get customer statistics' });
  }
};

export const getServiceStats = async (req, res) => {
  try {
    // Get service statistics from bookings
    const serviceStats = await prisma.event.groupBy({
      by: ['service1'],
      _count: {
        service1: true
      },
      orderBy: {
        _count: {
          service1: 'desc'
        }
      },
      take: 10
    });

    const basePrice = 150;
    const services = serviceStats.map(stat => ({
      name: stat.service1,
      bookings: stat._count.service1,
      revenue: stat._count.service1 * basePrice
    }));

    res.json(services);
  } catch (error) {
    console.error('Error getting service stats:', error);
    res.status(500).json({ error: 'Failed to get service statistics' });
  }
};

export const getMonthlyStats = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    const basePrice = 150;

    const monthlyData = [];
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      const bookings = await prisma.event.count({
        where: {
          date: { gte: startDate, lte: endDate },
          remarks: 'done'
        }
      });

      monthlyData.push({
        month: months[month],
        bookings,
        revenue: bookings * basePrice
      });
    }

    res.json(monthlyData);
  } catch (error) {
    console.error('Error getting monthly stats:', error);
    res.status(500).json({ error: 'Failed to get monthly statistics' });
  }
};

export const getTopServices = async (req, res) => {
  try {
    const basePrice = 150;

    const topServices = await prisma.event.groupBy({
      by: ['service1'],
      _count: {
        service1: true
      },
      orderBy: {
        _count: {
          service1: 'desc'
        }
      },
      take: 5
    });

    const services = topServices.map(service => ({
      name: service.service1,
      bookings: service._count.service1,
      revenue: service._count.service1 * basePrice
    }));

    res.json(services);
  } catch (error) {
    console.error('Error getting top services:', error);
    res.status(500).json({ error: 'Failed to get top services' });
  }
};

export const getCustomerInsights = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get new customers
    const newCustomers = await prisma.user.count({
      where: {
        user_type: 'user',
        createdAt: { gte: thirtyDaysAgo }
      }
    });

    // Get total customers
    const totalCustomers = await prisma.user.count({
      where: {
        user_type: 'user'
      }
    });

    const returningCustomers = totalCustomers - newCustomers;

    // Calculate average visit frequency
    const totalBookings = await prisma.event.count();
    const averageVisitFrequency = totalCustomers > 0 ? (totalBookings / totalCustomers) : 0;

    // Calculate real customer satisfaction from ratings
    const satisfactionResult = await prisma.rating.aggregate({
      _avg: {
        rating: true
      }
    });

    const customerSatisfaction = satisfactionResult._avg.rating || 0;

    res.json({
      newCustomers,
      returningCustomers,
      averageVisitFrequency: Math.round(averageVisitFrequency * 10) / 10,
      customerSatisfaction: Math.round(customerSatisfaction * 10) / 10
    });
  } catch (error) {
    console.error('Error getting customer insights:', error);
    res.status(500).json({ error: 'Failed to get customer insights' });
  }
};
