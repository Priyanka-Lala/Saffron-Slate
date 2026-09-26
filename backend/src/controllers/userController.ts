import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Recipe } from '../models/Recipe';

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

/** GET /api/users/me — profile + live recipe count (used on the Profile page stats row). */
export async function getMyProfile(req: Request, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  const recipeCount = await Recipe.countDocuments({ author: user._id });

  return res.json({ user: { ...toPublicUser(user), recipeCount } });
}

/** PUT /api/users/me — update display name, username, bio, location (Edit Profile form). */
export async function updateMyProfile(req: Request, res: Response) {
  const { name, username, bio, location } = req.body;

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  if (bio !== undefined && String(bio).length > 200) {
    return res.status(400).json({ message: 'Bio must be 200 characters or fewer.' });
  }

  if (username && username !== user.username) {
    const taken = await User.exists({ username, _id: { $ne: user._id } });
    if (taken) return res.status(409).json({ message: 'That username is already taken.' });
    user.username = username;
  }

  if (name !== undefined) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (location !== undefined) user.location = location;

  await user.save();
  return res.json({ user: toPublicUser(user) });
}

/** POST /api/users/me/avatar — upload a new profile photo. Requires multipart/form-data with an "avatar" file. */
export async function updateMyAvatar(req: Request, res: Response) {
  if (!req.file) return res.status(400).json({ message: 'No image file was uploaded.' });

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  user.avatar = `/uploads/${req.file.filename}`;
  await user.save();

  return res.json({ user: toPublicUser(user) });
}

/** PUT /api/users/me/password — change password. Requires the current password for verification. */
export async function changePassword(req: Request, res: Response) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are both required.' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters.' });
  }

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  const matches = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!matches) return res.status(401).json({ message: 'Current password is incorrect.' });

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  return res.json({ message: 'Password updated successfully.' });
}

/** PUT /api/users/me/settings — update dietary preferences, notification toggles, and privacy toggles. */
export async function updateMySettings(req: Request, res: Response) {
  const { dietaryPreferences, notificationSettings, privacySettings } = req.body;

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  if (dietaryPreferences !== undefined) user.dietaryPreferences = dietaryPreferences;
  if (notificationSettings !== undefined) {
    user.notificationSettings = { ...user.notificationSettings, ...notificationSettings };
  }
  if (privacySettings !== undefined) {
    user.privacySettings = { ...user.privacySettings, ...privacySettings };
  }

  await user.save();
  return res.json({ user: toPublicUser(user) });
}

/** DELETE /api/users/me — permanently delete the account (Settings > Privacy > Delete Account). */
export async function deleteMyAccount(req: Request, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  // Also clean up recipes this user authored, and remove them from
  // everyone else's favorites lists, so we don't leave orphaned data.
  const myRecipes = await Recipe.find({ author: user._id }, '_id');
  const myRecipeIds = myRecipes.map((r) => r._id);

  await Recipe.deleteMany({ author: user._id });
  await User.updateMany({ favorites: { $in: myRecipeIds } }, { $pull: { favorites: { $in: myRecipeIds } } });
  await user.deleteOne();

  return res.json({ message: 'Account deleted.' });
}
