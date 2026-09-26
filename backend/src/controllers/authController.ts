import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const SALT_ROUNDS = 10;

/** Turns a JWT for a given user ID, signed with our server secret. */
function signToken(userId: string): string {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ userId }, secret, { expiresIn } as jwt.SignOptions);
}

/** Shapes a User document into the safe, public fields we send to the frontend. */
function toPublicUser(user: InstanceType<typeof User>) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
    bio: user.bio,
    location: user.location,
    dietaryPreferences: user.dietaryPreferences,
    notificationSettings: user.notificationSettings,
    privacySettings: user.privacySettings,
    followers: user.followers,
    following: user.following,
  };
}

/** Turns "Jamie Okafor" into a unique username like "jamieokafor", "jamieokafor2", etc. */
async function generateUniqueUsername(name: string): Promise<string> {
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || 'chef';
  let candidate = base;
  let suffix = 1;
  // Keep trying candidate names until we find one that's not taken.
  while (await User.exists({ username: candidate })) {
    suffix += 1;
    candidate = `${base}${suffix}`;
  }
  return candidate;
}

export async function signup(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are all required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with that email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const username = await generateUniqueUsername(name);

    const user = await User.create({ name, email, passwordHash, username });

    const token = signToken(user._id.toString());
    return res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Something went wrong creating your account.' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    // Deliberately vague error message — don't reveal whether the email exists.
    if (!user) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    const token = signToken(user._id.toString());
    return res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Something went wrong logging you in.' });
  }
}

/**
 * Forgot-password stub.
 *
 * A real implementation would: generate a one-time reset token, save its
 * hash + expiry on the user, and email the person a link containing the
 * raw token. Wiring up an email provider (e.g. SendGrid, Postmark, AWS
 * SES) is outside the scope of this build, so for now we just log what
 * *would* be emailed, and always return a generic success message —
 * that's intentional: it stops someone from using this endpoint to
 * check which emails are registered.
 */
export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (user) {
    // TODO: generate a real reset token + send a real email here.
    console.log(`[forgot-password] Would send a reset link to ${email}`);
  }

  return res.json({
    message: 'If an account with that email exists, a reset link has been sent.',
  });
}

export async function getMe(req: Request, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  return res.json({ user: toPublicUser(user) });
}
