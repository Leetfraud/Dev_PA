import NodeCache from 'node-cache';
import { config } from '../config/env.js';

const cache = new NodeCache({
  stdTTL: config.cacheTtl,
  checkperiod: 600,
  useClones: false,
});

export const cacheMiddleware = (duration = config.cacheTtl) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json({
        ...cachedResponse,
        cached: true,
      });
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode === 200 && body.success !== false) {
        cache.set(key, body, duration);
      }
      return originalJson(body);
    };

    next();
  };
};

export const clearCache = (pattern) => {
  if (pattern) {
    const keys = cache.keys();
    keys.forEach(key => {
      if (key.includes(pattern)) {
        cache.del(key);
      }
    });
  } else {
    cache.flushAll();
  }
};

export default cache;
