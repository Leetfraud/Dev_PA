import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/devprofile-analyzer',
  githubToken: process.env.GITHUB_TOKEN,
  openaiApiKey: process.env.OPENAI_API_KEY,
  cacheTtl: parseInt(process.env.CACHE_TTL) || 86400,
  profileCacheHours: parseInt(process.env.PROFILE_CACHE_HOURS) || 24,
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

export const validateEnv = () => {
  const required = ['GITHUB_TOKEN', 'MONGODB_URI'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
    console.warn('⚠️  Some features may not work properly');
  }
  
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY not set - AI suggestions will be disabled');
  }
};
