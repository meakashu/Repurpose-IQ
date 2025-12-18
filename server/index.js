import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize database
import { initDatabase, seedDatabase } from './database/db.js';
initDatabase();
seedDatabase();

// Routes
import authRoutes from './routes/auth.js';
import queryRoutes from './routes/query.js';
import dashboardRoutes from './routes/dashboard.js';
import uploadRoutes from './routes/upload.js';
import reportRoutes from './routes/reports.js';
import conversationRoutes from './routes/conversations.js';
import auditRoutes from './routes/audit.js';
import syntheticQueriesRoutes from './routes/syntheticQueries.js';

app.use('/api/auth', authRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/synthetic-queries', syntheticQueriesRoutes);

// Analytics route
import analyticsRoutes from './routes/analytics.js';
app.use('/api/analytics', analyticsRoutes);

// Monitoring route
import monitoringRoutes from './routes/monitoring.js';
app.use('/api/monitoring', monitoringRoutes);

// Contact route
import contactRoutes from './routes/contact.js';
app.use('/api/contact', contactRoutes);


// Vision/Multi-modal route
import visionRoutes from './routes/vision.js';
app.use('/api/vision', visionRoutes);

// Workflows route
import workflowRoutes from './routes/workflows.js';
app.use('/api/workflows', workflowRoutes);

// Query suggestions route
import suggestionsRoutes from './routes/suggestions.js';
app.use('/api/suggestions', suggestionsRoutes);

// Sentiment analysis route
import sentimentRoutes from './routes/sentiment.js';
app.use('/api/sentiment', sentimentRoutes);

// User preferences route
import userRoutes from './routes/user.js';
app.use('/api/user', userRoutes);

// Knowledge Graph route (proxies to Python service)
import graphRoutes from './routes/graph.js';
app.use('/api/graph', graphRoutes);

// Predictions route (proxies to Python service)
import predictionsRoutes from './routes/predictions.js';
app.use('/api/predictions', predictionsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Root route - API information
app.get('/', (req, res) => {
  res.json({
    message: 'RepurposeIQ - Intelligent Drug Repurposing Platform',
    version: '2.0.0',
    status: 'running',
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
    },
    frontend: process.env.CLIENT_URL || 'http://localhost:5173',
    documentation: 'Access the frontend application at the URL above'
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

// Create HTTP server for WebSocket support
const httpServer = createServer(app);

// Setup WebSocket
import { setupWebSocket } from './services/websocketService.js';
const io = setupWebSocket(httpServer);

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 WebSocket server ready`);
});

