import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

// Make sure the uploads folder exists before multer tries to write into it.
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    // e.g. "1699999999999-a1b2c3.jpg" — timestamp + random string keeps names unique.
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB, matches the "up to 10MB" copy in AddRecipe.tsx
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WebP, and GIF images are allowed.'));
    }
  },
});

/**
 * NOTE on scaling: right now uploaded images are saved to this server's
 * local disk and served from /uploads. That's simple and works great
 * for development and small deployments. If you outgrow a single
 * server (or deploy somewhere with an ephemeral filesystem, like most
 * free hosting tiers), swap this out for a cloud storage bucket
 * (e.g. AWS S3, Cloudinary, or Google Cloud Storage) — the rest of
 * the app doesn't need to change, since it just stores whatever URL
 * this layer gives it.
 */
