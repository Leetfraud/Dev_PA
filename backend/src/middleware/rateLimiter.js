import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

export const apiLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Too many requests for this endpoint, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
