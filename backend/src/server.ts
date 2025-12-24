import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import categoryRoutes from './routes/categories';
import missionRoutes from './routes/missions';
import selectedTaskRoutes from './routes/selectedTasks';
import { startDailyReset } from './utils/dailyReset';
import pool from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS configuration
const getCorsOrigin = () => {
  if (NODE_ENV === 'production') {
    if (!process.env.FRONTEND_URL) {
      console.warn('WARNING: FRONTEND_URL not set in production. CORS may not work correctly.');
      return '*';
    }
    return process.env.FRONTEND_URL;
  }
  return '*';
};

const corsOptions = {
  origin: getCorsOrigin(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json());

// Request logging middleware (production)
if (NODE_ENV === 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/selected-tasks', selectedTaskRoutes);

// Health check with database connectivity
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await pool.execute('SELECT 1');
    res.json({ 
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

// Start daily reset cron job
startDailyReset();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});

