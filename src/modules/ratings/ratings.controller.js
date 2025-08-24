import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const submitRating = async (req, res) => {
  try {
    const { rating, comment, service, eventId, userId } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Validate required fields
    if (!service || !userId) {
      return res.status(400).json({ error: 'Service and userId are required' });
    }

    const newRating = await prisma.rating.create({
      data: {
        rating: parseInt(rating),
        comment: comment || null,
        service,
        userId: parseInt(userId),
        eventId: eventId ? parseInt(eventId) : null
      }
    });

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: newRating
    });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
};

export const getRatings = async (req, res) => {
  try {
    const { service, userId, eventId } = req.query;
    
    const where = {};
    
    if (service) where.service = service;
    if (userId) where.userId = parseInt(userId);
    if (eventId) where.eventId = parseInt(eventId);

    const ratings = await prisma.rating.findMany({
      where,
      include: {
        user: {
          select: {
            firstname: true,
            lastname: true,
            email: true
          }
        },
        event: {
          select: {
            name: true,
            service1: true,
            service2: true,
            date: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(ratings);
  } catch (error) {
    console.error('Error getting ratings:', error);
    res.status(500).json({ error: 'Failed to get ratings' });
  }
};

export const getAverageRating = async (req, res) => {
  try {
    const { service } = req.query;
    
    const where = {};
    if (service) where.service = service;

    const result = await prisma.rating.aggregate({
      where,
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    res.json({
      averageRating: result._avg.rating || 0,
      totalRatings: result._count.rating || 0
    });
  } catch (error) {
    console.error('Error getting average rating:', error);
    res.status(500).json({ error: 'Failed to get average rating' });
  }
};

export const getRatingStats = async (req, res) => {
  try {
    // Get rating distribution (1-5 stars)
    const ratingDistribution = await prisma.rating.groupBy({
      by: ['rating'],
      _count: {
        rating: true
      }
    });

    // Get average rating by service
    const serviceRatings = await prisma.rating.groupBy({
      by: ['service'],
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    // Get recent ratings
    const recentRatings = await prisma.rating.findMany({
      take: 10,
      include: {
        user: {
          select: {
            firstname: true,
            lastname: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      ratingDistribution,
      serviceRatings,
      recentRatings
    });
  } catch (error) {
    console.error('Error getting rating stats:', error);
    res.status(500).json({ error: 'Failed to get rating statistics' });
  }
};
