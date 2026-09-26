// Shared shapes returned by the backend API. These mirror (and extend
// slightly, e.g. with `id`/email/settings) the `Recipe` type already
// defined in ../data.ts, so existing components keep working unchanged.

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  dietaryPreferences: string[];
  notificationSettings: {
    newFollower: boolean;
    recipeComments: boolean;
    weeklyDigest: boolean;
    trending: boolean;
    savedReminders: boolean;
  };
  privacySettings: {
    publicProfile: boolean;
    showRecipeCount: boolean;
    allowRecipeSaves: boolean;
  };
  followers: number;
  following: number;
  recipeCount?: number;
}
