import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import recipeRoutes from './routes/recipeRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 4000;

// --- CORS ---
// FRONTEND_URL can be a single origin or a comma-separated list, e.g.:
//   FRONTEND_URL=http://localhost:5173,http://192.168.1.12:8443
// This matters any time the frontend isn't loaded from plain
// "localhost" — a LAN IP, a different port, a proxied/tunnelled dev
// preview, etc. all count as a different "origin" to the browser, and
// an origin that isn't explicitly allowed here gets silently blocked
// (which shows up in the browser as "Failed to fetch").
const DEFAULT_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
  : DEFAULT_ORIGINS;

console.log('🌐 Allowed frontend origins:', allowedOrigins.join(', '));

app.use(
  cors({
    origin: (origin, callback) => {
      // requests with no origin (e.g. curl, mobile apps, server-to-server) are always allowed
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️  Blocked a request from an origin that isn't in FRONTEND_URL: ${origin}`);
        console.warn(`   If this is expected, add it to FRONTEND_URL in backend/.env and restart.`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// --- Middleware ---
app.use(express.json()); // parses application/json request bodies
app.use(express.urlencoded({ extended: true })); // parses form fields alongside multipart uploads

// Serve uploaded images (recipe photos, avatars) as static files at /uploads/<filename>
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/users', userRoutes);

// Simple health check — useful for confirming the server is up (and for deployment platforms).
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// --- Error handling ---
// Catches errors thrown in any route above (including multer file-type errors),
// so the client always gets a clean JSON error instead of an HTML stack trace.
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong on our end.' });
});

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Saffron & Slate API running at http://localhost:${PORT}`);
  });
}

start();
