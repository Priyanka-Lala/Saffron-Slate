import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express's Request type so TypeScript knows about req.userId
// after our middleware runs.
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

interface TokenPayload {
  userId: string;
}

/**
 * Reads the "Authorization: Bearer <token>" header, verifies the JWT,
 * and attaches the logged-in user's ID to the request as req.userId.
 *
 * Any route that needs the user to be logged in should use this
 * middleware, e.g.:
 *
 *   router.post('/recipes', requireAuth, createRecipe);
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'You must be logged in to do that.' });
  }

  const token = authHeader.slice('Bearer '.length);

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not set on the server.');

    const payload = jwt.verify(token, secret) as TokenPayload;
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
  }
}

/**
 * Like requireAuth, but doesn't block the request if there's no token —
 * it just attaches req.userId if a valid one is present. Useful for
 * routes like GET /recipes/:id, which work for everyone, but behave
 * slightly differently for a logged-in user (e.g. later features like
 * "is this my own recipe?").
 */
export function attachUserIfPresent(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return next();

  const token = authHeader.slice('Bearer '.length);
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return next();
    const payload = jwt.verify(token, secret) as TokenPayload;
    req.userId = payload.userId;
  } catch {
    // Invalid/expired token on an optional-auth route — just proceed as a guest.
  }
  next();
}
