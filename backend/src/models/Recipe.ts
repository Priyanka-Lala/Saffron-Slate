import { Schema, model, Document, Types } from 'mongoose';

interface Ingredient {
  amount: string;
  item: string;
}

export interface RecipeDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  image: string;
  time: string; // kept as a display string (e.g. "45 min") to match the UI
  servings: number;
  calories: number;
  rating: number;
  ratingCount: number;
  category: string;
  cuisine: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  description: string;
  ingredients: Ingredient[];
  steps: string[];
  author: Types.ObjectId; // ref to the User who created this recipe
  createdAt: Date;
  updatedAt: Date;
}

const recipeSchema = new Schema<RecipeDocument>(
  {
    title: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    time: { type: String, required: true },
    servings: { type: Number, required: true, min: 1 },
    calories: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
    category: { type: String, required: true },
    cuisine: { type: String, default: '' },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    tags: { type: [String], default: [] },
    description: { type: String, default: '' },
    ingredients: [
      {
        amount: { type: String, required: true },
        item: { type: String, required: true },
      },
    ],
    steps: { type: [String], default: [] },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Speeds up the Recipes page filters (category/cuisine/difficulty) and search.
recipeSchema.index({ title: 'text', tags: 'text' });
recipeSchema.index({ category: 1 });
recipeSchema.index({ cuisine: 1 });
recipeSchema.index({ difficulty: 1 });
recipeSchema.index({ author: 1 });

export const Recipe = model<RecipeDocument>('Recipe', recipeSchema);
