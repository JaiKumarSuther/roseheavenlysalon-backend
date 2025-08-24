import express from 'express';
import { submitRating, getRatings, getAverageRating, getRatingStats } from './ratings.controller.js';

const router = express.Router();

// Submit a new rating
router.post('/submit', submitRating);

// Get ratings with optional filters
router.get('/', getRatings);

// Get average rating
router.get('/average', getAverageRating);

// Get rating statistics
router.get('/stats', getRatingStats);

export default router;
