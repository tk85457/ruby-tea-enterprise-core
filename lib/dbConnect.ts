import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Only check for MONGODB_URI during runtime, not build time
if (!MONGODB_URI && typeof window === 'undefined' && process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: {
    conn: any;
    promise: any;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!MONGODB_URI) {
    // During build time, return early to avoid errors
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn('Skipping database connection during build phase');
      return null;
    }
    throw new Error('MONGODB_URI is not defined');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
