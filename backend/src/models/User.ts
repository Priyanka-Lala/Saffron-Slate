import { Schema, model, Document, Types } from 'mongoose';

/**
 * Notification + privacy + dietary settings live directly on the User
 * document. They're simple key/value toggles, so there's no need for
 * a separate collection — this keeps reads fast (one query gets you
 * everything the Settings page needs).
 */
interface NotificationSettings {
  newFollower: boolean;
  recipeComments: boolean;
  weeklyDigest: boolean;
  trending: boolean;
  savedReminders: boolean;
}

interface PrivacySettings {
  publicProfile: boolean;
  showRecipeCount: boolean;
  allowRecipeSaves: boolean;
}

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  dietaryPreferences: string[];
  notificationSettings: NotificationSettings;
  privacySettings: PrivacySettings;
  favorites: Types.ObjectId[]; // Recipe IDs this user has saved
  followers: number;
  following: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // We never store the plain-text password — only its bcrypt hash.
    passwordHash: { type: String, required: true },
    username: { type: String, required: true, unique: true, trim: true },
    avatar: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&auto=format',
    },
    bio: { type: String, default: '', maxlength: 200 },
    location: { type: String, default: '' },
    dietaryPreferences: { type: [String], default: [] },
    notificationSettings: {
      newFollower: { type: Boolean, default: true },
      recipeComments: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: false },
      trending: { type: Boolean, default: true },
      savedReminders: { type: Boolean, default: false },
    },
    privacySettings: {
      publicProfile: { type: Boolean, default: true },
      showRecipeCount: { type: Boolean, default: true },
      allowRecipeSaves: { type: Boolean, default: true },
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

export const User = model<UserDocument>('User', userSchema);
