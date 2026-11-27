import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodInstance = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cityshield';
  
  try {
    // Attempt connecting to the configured MongoDB URI with a short timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] MongoDB Connected to external daemon: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[Database] Standard MongoDB daemon unavailable at ${uri}: ${err.message}`);
    console.log('[Database] Initializing high-performance MongoDB In-Memory Server with 2dsphere indexing support...');
    
    try {
      mongodInstance = await MongoMemoryServer.create({
        binary: {
          version: '7.0.14'
        }
      });
      const memUri = mongodInstance.getUri();
      await mongoose.connect(memUri);
      console.log(`[Database] MongoDB In-Memory Server ready & connected: ${memUri}`);
    } catch (memErr) {
      console.error('[Database] Failed to initialize MongoMemoryServer:', memErr.message);
      throw memErr;
    }
  }

  // Ensure 2dsphere indexes are registered
  try {
    const IssueReport = (await import('../models/IssueReport.js')).default;
    const Ward = (await import('../models/Ward.js')).default;
    const HazardZone = (await import('../models/HazardZone.js')).default;
    await IssueReport.init();
    await Ward.init();
    await HazardZone.init();
    console.log('[Database] 2dsphere geospatial indexes successfully initialized.');
  } catch (idxErr) {
    console.warn('[Database] Geospatial index warning:', idxErr.message);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
