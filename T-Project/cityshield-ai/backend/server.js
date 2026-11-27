import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import governmentRoutes from './routes/governmentRoutes.js';
import routingRoutes from './routes/routingRoutes.js';
import exploreRoutes from './routes/exploreRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import communityRoutes from './routes/communityRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

app.set('io', io);

// Real-time notification channel
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  
  socket.on('join_ward', (wardNumber) => {
    socket.join(`ward_${wardNumber}`);
    console.log(`Client ${socket.id} joined ward_${wardNumber}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Security & Utility Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(morgan('dev'));

// Rate limiting (exempt health and read routes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests from this client. Please try again later.' }
});
app.use('/api', apiLimiter);

// Serve uploads directory statically
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'CityShield AI Core API Gateway',
    timestamp: new Date(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/government', governmentRoutes);
app.use('/api/routing', routingRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/community', communityRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5001;

// Connect to DB and Start Server
connectDB().then(async () => {
  // Auto-seed if database is empty
  try {
    const seedModule = await import('./seeds/seedData.js');
    await seedModule.seedDatabaseIfEmpty();
    const communityController = await import('./controllers/communityController.js');
    await communityController.seedInitialCommunityPosts();
  } catch (seedErr) {
    console.warn('[Seed] Seed check warning:', seedErr.message);
  }

  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  CITYSHIELD AI CORE BACKEND RUNNING ON PORT ${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}).catch(err => {
  console.error('Fatal database startup failure:', err);
  process.exit(1);
});

export { app, server };
