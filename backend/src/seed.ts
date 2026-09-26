import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db';
import { User } from './models/User';
import { Recipe } from './models/Recipe';
import seedData from './seedData.json';

/**
 * Populates a fresh database with:
 *  - A demo account you can log in with immediately (see printed credentials below)
 *  - One account per "chef" from the original design mockups
 *  - All 8 sample recipes, correctly linked to their chef's account
 *
 * Run with: npm run seed
 * Safe to re-run — it wipes existing Users/Recipes first, so you always
 * start from a clean, known state.
 */
async function seed() {
  await connectDB();

  console.log('🗑️  Clearing existing users and recipes...');
  await User.deleteMany({});
  await Recipe.deleteMany({});

  const DEMO_PASSWORD = 'password123';
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // 1. Create the "you are logged in as" demo account, matching the
  //    CURRENT_USER placeholder that used to be hardcoded in the frontend.
  const demoUser = await User.create({
    name: seedData.currentUser.name,
    email: 'demo@saffronandslate.com',
    passwordHash,
    username: seedData.currentUser.username.replace('@', ''),
    avatar: seedData.currentUser.avatar,
    bio: seedData.currentUser.bio,
    location: seedData.currentUser.location,
    followers: seedData.currentUser.followers,
    following: seedData.currentUser.following,
    dietaryPreferences: ['Vegetarian'],
  });
  console.log(`👤 Created demo user: ${demoUser.email}`);

  // 2. Create one account per chef referenced in the sample recipes.
  const chefUsers: Record<string, InstanceType<typeof User>> = {};
  for (const [chefName, avatar] of Object.entries(seedData.chefs)) {
    const username = chefName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const chefUser = await User.create({
      name: chefName,
      email: `${username}@saffronandslate.com`,
      passwordHash, // same demo password for all seeded chef accounts
      username,
      avatar: avatar as string,
      bio: `Recipe developer at Saffron & Slate.`,
    });
    chefUsers[chefName] = chefUser;
    console.log(`👨‍🍳 Created chef account: ${chefUser.email}`);
  }

  // 3. Create all sample recipes, linked to their chef's account.
  for (const recipe of seedData.recipes) {
    const { chefName, chefAvatar, ...recipeFields } = recipe as any;
    await Recipe.create({
      ...recipeFields,
      author: chefUsers[chefName]._id,
    });
  }
  console.log(`🍳 Created ${seedData.recipes.length} sample recipes`);

  console.log('\n✅ Seed complete!\n');
  console.log('Log in with:');
  console.log(`  Email:    ${demoUser.email}`);
  console.log(`  Password: ${DEMO_PASSWORD}`);
  console.log('\n(All seeded chef accounts also use this same password.)\n');

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
