import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config, validateEnv } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import profileRoutes from './routes/profileRoutes.js';

validateEnv();

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiLimiter);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'DevProfile Analyzer API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

app.use('/api', profileRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(config.port, () => {
      console.log(`\n🚀 Server running on port ${config.port}`);
      console.log(`📊 Environment: ${config.nodeEnv}`);
      console.log(`🔗 API: http://localhost:${config.port}/api`);
      console.log(`💚 Health: http://localhost:${config.port}/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});
