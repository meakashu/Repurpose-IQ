/**
 * Vercel Serverless Function Entry Point
 * This file wraps the Express app for Vercel deployment
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for Vercel
}));
app.use(compression());
// CORS configuration for Vercel
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.VERCEL_URL,
  process.env.NEXT_PUBLIC_VERCEL_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      // For production, allow Vercel domains
      if (origin.includes('.vercel.app') || origin.includes('.vercel.dev')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize database (for Vercel, we'll use a serverless-compatible approach)
import { initDatabase, seedDatabase } from '../server/database/db.js';

// Initialize database on first request (Vercel serverless functions are stateless)
// Each function invocation may need to reinitialize, but we'll cache per instance
let dbInitialized = false;
function ensureDatabase() {
  if (!dbInitialized) {
    try {
      console.log('[Vercel] Initializing database...');
      initDatabase();
      seedDatabase();
      dbInitialized = true;
      console.log('[Vercel] Database initialized successfully');
    } catch (error) {
      console.error('[Vercel] Database initialization error:', error);
      // Don't throw - allow app to continue (database might already exist)
    }
  }
}

// Routes
import authRoutes from '../server/routes/auth.js';
import queryRoutes from '../server/routes/query.js';
import dashboardRoutes from '../server/routes/dashboard.js';
import uploadRoutes from '../server/routes/upload.js';
import reportRoutes from '../server/routes/reports.js';
import conversationRoutes from '../server/routes/conversations.js';
import auditRoutes from '../server/routes/audit.js';
import syntheticQueriesRoutes from '../server/routes/syntheticQueries.js';
import analyticsRoutes from '../server/routes/analytics.js';
import monitoringRoutes from '../server/routes/monitoring.js';
import contactRoutes from '../server/routes/contact.js';
import visionRoutes from '../server/routes/vision.js';
import workflowRoutes from '../server/routes/workflows.js';
import suggestionsRoutes from '../server/routes/suggestions.js';
import sentimentRoutes from '../server/routes/sentiment.js';
import userRoutes from '../server/routes/user.js';
import graphRoutes from '../server/routes/graph.js';
import predictionsRoutes from '../server/routes/predictions.js';

// Initialize database before routes
app.use((req, res, next) => {
  ensureDatabase();
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/synthetic-queries', syntheticQueriesRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/vision', visionRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/suggestions', suggestionsRoutes);
app.use('/api/sentiment', sentimentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/graph', graphRoutes);
app.use('/api/predictions', predictionsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'production',
    vercel: !!process.env.VERCEL
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'RepurposeIQ - Intelligent Drug Repurposing Platform',
    version: '2.0.0',
    status: 'running',
    environment: process.env.NODE_ENV || 'production',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      query: '/api/query',
      dashboard: '/api/dashboard',
      upload: '/api/upload',
      reports: '/api/reports',
      conversations: '/api/conversations',
      analytics: '/api/analytics',
      audit: '/api/audit',
      graph: '/api/graph',
      predictions: '/api/predictions',
      user: '/api/user'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.DEBUG === 'true' && { stack: err.stack })
  });
});

// Note: WebSocket is not supported in Vercel serverless functions
// Socket.io will gracefully degrade to polling or fail silently
// Real-time features will use REST API fallback on Vercel

// Export for Vercel
export default app;
