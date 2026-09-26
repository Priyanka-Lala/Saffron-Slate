import { Request, Response } from 'express';
import { Recipe } from '../models/Recipe';
import { User } from '../models/User';

/**
 * Shapes a Recipe document (with its author populated) into the exact
 * JSON shape the frontend's `Recipe` type expects — including the
 * nested `chef` object, which the DB doesn't store directly; we build
 * it from the populated author.
 */
function toPublicRecipe(recipe: any) {
  const author = recipe.author;
  return {
    id: recipe._id.toString(),
    title: recipe.title,
    image: recipe.image,
    time: recipe.time,
    servings: recipe.servings,
    calories: recipe.calories,
    rating: recipe.rating,
    ratingCount: recipe.ratingCount,
    category: recipe.category,
    cuisine: recipe.cuisine,
    difficulty: recipe.difficulty,
    tags: recipe.tags,
    description: recipe.description,
    chef: {
      name: author?.name ?? 'Unknown Chef',
      avatar: author?.avatar ?? '',
    },
    authorId: author?._id?.toString() ?? recipe.author?.toString(),
    ingredients: recipe.ingredients,
    steps: recipe.steps,
  };
}

/**
 * GET /api/recipes
 * Supports the filters used on the Recipes page: search, category,
 * cuisine, difficulty, and sort — plus optional pagination.
 */
export async function listRecipes(req: Request, res: Response) {
  const { search, category, cuisine, difficulty, sort } = req.query as Record<string, string>;

  const filter: Record<string, any> = {};
  if (category && category !== 'All') filter.category = category;
  if (cuisine && cuisine !== 'All') filter.cuisine = cuisine;
  if (difficulty && difficulty !== 'All') filter.difficulty = difficulty;
  if (search) {
    // Matches the frontend's current behaviour: search title OR tags.
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  let sortOption: Record<string, 1 | -1> = { createdAt: -1 }; // "Newest" is the natural default
  if (sort === 'Most Popular') sortOption = { ratingCount: -1 };
  if (sort === 'Highest Rated') sortOption = { rating: -1 };
  if (sort === 'Newest') sortOption = { createdAt: -1 };
  // "Quickest" would need a numeric prep-time field to sort properly —
  // `time` is a display string like "45 min", so we leave the default
  // order for that option rather than sorting on unparsed text. If you
  // want real quickest-first sorting, add a numeric `prepMinutes`
  // field alongside `time` and sort on that instead.

  const recipes = await Recipe.find(filter).sort(sortOption).populate('author', 'name avatar');

  return res.json({ recipes: recipes.map(toPublicRecipe) });
}

/** GET /api/recipes/mine — recipes authored by the logged-in user (Profile "Your Recipes" tab). */
export async function listMyRecipes(req: Request, res: Response) {
  const recipes = await Recipe.find({ author: req.userId })
    .sort({ createdAt: -1 })
    .populate('author', 'name avatar');
  return res.json({ recipes: recipes.map(toPublicRecipe) });
}

/** GET /api/recipes/:id */
export async function getRecipe(req: Request, res: Response) {
  const recipe = await Recipe.findById(req.params.id).populate('author', 'name avatar');
  if (!recipe) return res.status(404).json({ message: 'Recipe not found.' });
  return res.json({ recipe: toPublicRecipe(recipe) });
}

/** POST /api/recipes — create a new recipe. Requires auth. Accepts multipart/form-data with an optional "image" file. */
export async function createRecipe(req: Request, res: Response) {
  try {
    const {
      title,
      description,
      category,
      cuisine,
      difficulty,
      time, // "prep time" from the form, e.g. "30 min"
      servings,
      calories,
      tags, // comma-separated string from the form
      ingredients, // JSON string: [{amount, item}, ...]
      steps, // JSON string: ["step 1", "step 2", ...]
    } = req.body;

    if (!title || !category || !difficulty || !time || !servings) {
      return res.status(400).json({
        message: 'Title, category, difficulty, prep time, and servings are required.',
      });
    }

    // The form sends ingredients/steps/tags as strings (multipart/form-data
    // can't carry nested arrays directly), so we parse them back out here.
    const parsedIngredients = ingredients ? JSON.parse(ingredients) : [];
    const parsedSteps = steps ? JSON.parse(steps) : [];
    const parsedTags = tags
      ? String(tags).split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    // If an image file was uploaded, multer put it at req.file and we
    // expose it at /uploads/<filename> (see index.ts for the static route).
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=900&h=560&fit=crop&auto=format'; // fallback placeholder

    const recipe = await Recipe.create({
      title,
      description: description || '',
      category,
      cuisine: cuisine || '',
      difficulty,
      time,
      servings: Number(servings),
      calories: calories ? Number(calories) : 0,
      tags: parsedTags,
      ingredients: parsedIngredients,
      steps: parsedSteps,
      image: imageUrl,
      author: req.userId,
    });

    const populated = await recipe.populate('author', 'name avatar');
    return res.status(201).json({ recipe: toPublicRecipe(populated) });
  } catch (err) {
    console.error('Create recipe error:', err);
    return res.status(500).json({ message: 'Something went wrong publishing your recipe.' });
  }
}

/** PUT /api/recipes/:id — update a recipe. Requires auth AND ownership. */
export async function updateRecipe(req: Request, res: Response) {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found.' });

  if (recipe.author.toString() !== req.userId) {
    return res.status(403).json({ message: "You can only edit your own recipes." });
  }

  const updatable = [
    'title', 'description', 'category', 'cuisine', 'difficulty',
    'time', 'servings', 'calories',
  ] as const;
  for (const field of updatable) {
    if (req.body[field] !== undefined) (recipe as any)[field] = req.body[field];
  }
  if (req.body.tags) {
    recipe.tags = String(req.body.tags).split(',').map((t: string) => t.trim()).filter(Boolean);
  }
  if (req.body.ingredients) recipe.ingredients = JSON.parse(req.body.ingredients);
  if (req.body.steps) recipe.steps = JSON.parse(req.body.steps);
  if (req.file) recipe.image = `/uploads/${req.file.filename}`;

  await recipe.save();
  const populated = await recipe.populate('author', 'name avatar');
  return res.json({ recipe: toPublicRecipe(populated) });
}

/** DELETE /api/recipes/:id — Requires auth AND ownership. */
export async function deleteRecipe(req: Request, res: Response) {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found.' });

  if (recipe.author.toString() !== req.userId) {
    return res.status(403).json({ message: 'You can only delete your own recipes.' });
  }

  await recipe.deleteOne();
  // Also remove it from anyone's favorites list so we don't leave dangling references.
  await User.updateMany({ favorites: recipe._id }, { $pull: { favorites: recipe._id } });

  return res.json({ message: 'Recipe deleted.' });
}
