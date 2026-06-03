import express from 'express';
import {
  getProfile,
  compareProfiles,
  getSuggestions,
  getSearchHistory,
  getRateLimitStatus,
} from '../controllers/profileController.js';
import { cacheMiddleware } from '../middleware/cache.js';
import { strictLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/profile/:username', getProfile);

router.get('/compare', cacheMiddleware(3600), compareProfiles);

router.get('/suggestions/:username', strictLimiter, getSuggestions);

router.get('/history', cacheMiddleware(300), getSearchHistory);

router.get('/rate-limit', getRateLimitStatus);

export default router;
