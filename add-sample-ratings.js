import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addSampleRatings() {
  try {
    // Check if we have users and events, create them if they don't exist
    let users = await prisma.user.findMany({
      where: { user_type: 'user' },
      take: 5
    });

    let events = await prisma.event.findMany({
      take: 10
    });

    // Create sample users if none exist
    if (users.length === 0) {
      console.log('Creating sample users...');
      const sampleUsers = [
        { firstname: 'Maria', lastname: 'Santos', username: 'maria.santos', email: 'maria@example.com', phone: '09123456789', password: 'password123' },
        { firstname: 'Juan', lastname: 'Cruz', username: 'juan.cruz', email: 'juan@example.com', phone: '09123456790', password: 'password123' },
        { firstname: 'Ana', lastname: 'Reyes', username: 'ana.reyes', email: 'ana@example.com', phone: '09123456791', password: 'password123' },
        { firstname: 'Pedro', lastname: 'Garcia', username: 'pedro.garcia', email: 'pedro@example.com', phone: '09123456792', password: 'password123' },
        { firstname: 'Carmen', lastname: 'Lopez', username: 'carmen.lopez', email: 'carmen@example.com', phone: '09123456793', password: 'password123' }
      ];

      for (const userData of sampleUsers) {
        await prisma.user.create({
          data: {
            ...userData,
            user_type: 'user',
            code: 0
          }
        });
      }

      users = await prisma.user.findMany({
        where: { user_type: 'user' },
        take: 5
      });
      console.log(`Created ${users.length} sample users`);
    }

    // Create sample events if none exist
    if (events.length === 0) {
      console.log('Creating sample events...');
      const sampleEvents = [
        { name: 'Maria Santos', email: 'maria@example.com', phone: '09123456789', time: new Date('2024-01-15T10:00:00'), date: new Date('2024-01-15'), service1: 'Manicure & Pedicure (with Footspa)', service2: '', remarks: 'done' },
        { name: 'Juan Cruz', email: 'juan@example.com', phone: '09123456790', time: new Date('2024-01-16T14:00:00'), date: new Date('2024-01-16'), service1: 'Haircut & Styling', service2: '', remarks: 'done' },
        { name: 'Ana Reyes', email: 'ana@example.com', phone: '09123456791', time: new Date('2024-01-17T11:00:00'), date: new Date('2024-01-17'), service1: 'Facial Treatment', service2: '', remarks: 'done' },
        { name: 'Pedro Garcia', email: 'pedro@example.com', phone: '09123456792', time: new Date('2024-01-18T15:00:00'), date: new Date('2024-01-18'), service1: 'Massage Therapy', service2: '', remarks: 'done' },
        { name: 'Carmen Lopez', email: 'carmen@example.com', phone: '09123456793', time: new Date('2024-01-19T13:00:00'), date: new Date('2024-01-19'), service1: 'Nail Art & Design', service2: '', remarks: 'done' }
      ];

      for (const eventData of sampleEvents) {
        await prisma.event.create({
          data: {
            ...eventData,
            status: 1
          }
        });
      }

      events = await prisma.event.findMany({
        take: 10
      });
      console.log(`Created ${events.length} sample events`);
    }

    // Sample ratings data
    const sampleRatings = [
      { rating: 5, comment: 'Excellent service! Very professional and friendly staff.', service: 'Manicure & Pedicure (with Footspa)' },
      { rating: 4, comment: 'Good experience overall. Would recommend.', service: 'Haircut & Styling' },
      { rating: 5, comment: 'Amazing facial treatment. My skin feels so refreshed!', service: 'Facial Treatment' },
      { rating: 3, comment: 'Service was okay, but could be better.', service: 'Manicure & Pedicure (with Footspa)' },
      { rating: 5, comment: 'Best massage I\'ve ever had! Very relaxing.', service: 'Massage Therapy' },
      { rating: 4, comment: 'Professional service and clean environment.', service: 'Haircut & Styling' },
      { rating: 5, comment: 'Outstanding nail art! Exactly what I wanted.', service: 'Nail Art & Design' },
      { rating: 4, comment: 'Good value for money. Staff is very helpful.', service: 'Facial Treatment' },
      { rating: 5, comment: 'Perfect service from start to finish!', service: 'Massage Therapy' },
      { rating: 4, comment: 'Nice atmosphere and skilled technicians.', service: 'Manicure & Pedicure (with Footspa)' },
      { rating: 5, comment: 'Highly recommend! Will definitely come back.', service: 'Haircut & Styling' },
      { rating: 3, comment: 'Service was fine, but a bit expensive.', service: 'Facial Treatment' },
      { rating: 5, comment: 'Wonderful experience! Very satisfied.', service: 'Nail Art & Design' },
      { rating: 4, comment: 'Good quality service and friendly staff.', service: 'Massage Therapy' },
      { rating: 5, comment: 'Excellent work! Exceeded my expectations.', service: 'Manicure & Pedicure (with Footspa)' }
    ];

    console.log('Adding sample ratings...');

    for (let i = 0; i < sampleRatings.length; i++) {
      const ratingData = sampleRatings[i];
      const user = users[i % users.length];
      const event = events[i % events.length];

      await prisma.rating.create({
        data: {
          rating: ratingData.rating,
          comment: ratingData.comment,
          service: ratingData.service,
          userId: user.id,
          eventId: event.id
        }
      });

      console.log(`Added rating ${i + 1}/${sampleRatings.length}: ${ratingData.rating} stars for ${ratingData.service}`);
    }

    console.log('Sample ratings added successfully!');

    // Show the new average rating
    const result = await prisma.rating.aggregate({
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    console.log(`\nNew average rating: ${result._avg.rating?.toFixed(1) || 0}/5`);
    console.log(`Total ratings: ${result._count.rating || 0}`);

  } catch (error) {
    console.error('Error adding sample ratings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleRatings();
