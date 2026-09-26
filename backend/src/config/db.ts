import mongoose from 'mongoose';

/**
 * Connects to MongoDB using the connection string in MONGODB_URI.
 *
 * Mongoose keeps a single connection pool for the whole app, so we
 * only ever need to call this once, when the server starts.
 */
export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. Copy .env.example to .env and fill in your MongoDB connection string.'
    );
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    // Exit the process — there's no point running an API that can't reach its database.
    process.exit(1);
  }
}
