import { useState, useRef } from 'react';
import type { NavigateFn } from '../data';
import { UploadIcon, PlusIcon, XIcon } from '../components/Icons';
import * as recipesApi from '../api/recipes';

interface AddRecipeProps {
  navigate: NavigateFn;
}

interface Ingredient {
  amount: string;
  item: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB, matches the copy in the dropzone below
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function AddRecipe({ navigate }: AddRecipeProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [servings, setServings] = useState('');
  const [calories, setCalories] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ amount: '', item: '' }, { amount: '', item: '' }]);
  const [steps, setSteps] = useState<string[]>(['', '']);
  const [tags, setTags] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addIngredient = () => setIngredients([...ingredients, { amount: '', item: '' }]);
  const removeIngredient = (i: number) => setIngredients(ingredients.filter((_, idx) => idx !== i));
  const updateIngredient = (i: number, field: keyof Ingredient, val: string) =>
    setIngredients(ingredients.map((ing, idx) => idx === i ? { ...ing, [field]: val } : ing));

  const addStep = () => setSteps([...steps, '']);
  const removeStep = (i: number) => setSteps(steps.filter((_, idx) => idx !== i));
  const updateStep = (i: number, val: string) =>
    setSteps(steps.map((s, idx) => idx === i ? val : s));

  const handleFile = (file: File | undefined | null) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please choose a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be 10MB or smaller.');
      return;
    }
    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handlePublish = async () => {
    setError('');
    if (!title || !category || !difficulty || !prepTime || !servings) {
      setError('Please fill in the required fields: title, category, difficulty, prep time, and servings.');
      return;
    }
    const cleanIngredients = ingredients.filter((i) => i.amount.trim() || i.item.trim());
    const cleanSteps = steps.filter((s) => s.trim());

    setIsSubmitting(true);
    try {
      await recipesApi.createRecipe({
        title,
        description,
        category,
        cuisine,
        difficulty,
        time: prepTime,
        servings,
        calories,
        tags,
        ingredients: cleanIngredients,
        steps: cleanSteps,
        imageFile,
      });
      navigate('profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong publishing your recipe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    if (confirm('Discard this recipe draft? Anything you\'ve entered will be lost.')) {
      navigate('home');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[860px] mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-1">Create</p>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Add a New Recipe</h1>
          <p className="text-muted text-sm mt-1">Share your culinary creation with the Saffron & Slate community.</p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* Photo upload */}
          <div className="bg-card rounded-2xl border border-warm-border overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-warm-border">
              <h2 className="font-serif font-bold text-lg text-charcoal">Cover Photo</h2>
            </div>
            <div className="p-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-warm-border">
                  <img src={imagePreview} alt="Recipe cover preview" className="w-full h-64 object-cover" />
                  <button
                    onClick={() => { setImageFile(null); setImagePreview(''); }}
                    className="absolute top-3 right-3 bg-charcoal/70 hover:bg-charcoal text-white p-2 rounded-full transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-16 transition-colors cursor-pointer ${
                    dragOver ? 'border-gold bg-gold-light' : 'border-warm-border bg-cream hover:border-gold hover:bg-gold-light'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
                >
                  <UploadIcon className="w-10 h-10 text-muted mb-3" />
                  <p className="font-semibold text-charcoal-mid text-sm mb-1">Drag & drop a photo here</p>
                  <p className="text-muted text-xs mb-4">or click to browse — JPG, PNG, WebP up to 10MB</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="bg-gold hover:bg-gold-dark text-charcoal text-xs font-semibold px-5 py-2 rounded-full transition-colors"
                  >
                    Choose File
                  </button>
                </div>
              )}
              <p className="text-xs text-muted mt-3">
                No photo? We'll use a placeholder image until you add one.
              </p>
            </div>
          </div>

          {/* Basic info */}
          <div className="bg-card rounded-2xl border border-warm-border overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-warm-border">
              <h2 className="font-serif font-bold text-lg text-charcoal">Recipe Info</h2>
            </div>
            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Recipe Title *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Roasted Tomato Pasta with Burrata"
                  className="w-full px-4 py-3 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal placeholder:text-muted text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your dish — what makes it special, where the inspiration came from..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal placeholder:text-muted text-sm resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Tags</label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. Vegetarian, Quick, Italian (comma-separated)"
                  className="w-full px-4 py-3 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal placeholder:text-muted text-sm"
                />
              </div>

              {/* Row: Category + Cuisine + Difficulty */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal text-sm appearance-none"
                  >
                    <option value="">Select...</option>
                    <option>Main Course</option>
                    <option>Breakfast</option>
                    <option>Dessert</option>
                    <option>Baking</option>
                    <option>Starter</option>
                    <option>Soup</option>
                    <option>Salad</option>
                    <option>Drinks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Cuisine</label>
                  <select
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal text-sm appearance-none"
                  >
                    <option value="">Select...</option>
                    <option>Italian</option>
                    <option>French</option>
                    <option>Thai</option>
                    <option>Asian</option>
                    <option>Middle Eastern</option>
                    <option>Modern</option>
                    <option>Fusion</option>
                    <option>American</option>
                    <option>Mexican</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Difficulty *</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal text-sm appearance-none"
                  >
                    <option value="">Select...</option>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>

              {/* Row: Prep time + Servings + Calories */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Prep Time *</label>
                  <input
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="e.g. 30 min"
                    className="w-full px-4 py-3 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal placeholder:text-muted text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Servings *</label>
                  <input
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    placeholder="e.g. 4"
                    min="1"
                    className="w-full px-4 py-3 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal placeholder:text-muted text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Calories (kcal)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="e.g. 420"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal placeholder:text-muted text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-card rounded-2xl border border-warm-border overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-warm-border flex items-center justify-between">
              <h2 className="font-serif font-bold text-lg text-charcoal">Ingredients</h2>
              <span className="text-xs text-muted">{ingredients.length} item{ingredients.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="p-6 space-y-3">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-6 text-xs font-bold text-muted text-right shrink-0">{i + 1}</span>
                  <input
                    value={ing.amount}
                    onChange={(e) => updateIngredient(i, 'amount', e.target.value)}
                    placeholder="Amount"
                    className="w-28 px-3 py-2.5 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal placeholder:text-muted text-sm"
                  />
                  <input
                    value={ing.item}
                    onChange={(e) => updateIngredient(i, 'item', e.target.value)}
                    placeholder="Ingredient name and preparation..."
                    className="flex-1 px-3 py-2.5 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal placeholder:text-muted text-sm"
                  />
                  <button
                    onClick={() => removeIngredient(i)}
                    disabled={ingredients.length <= 1}
                    className="p-2 rounded-lg text-muted hover:text-red-400 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addIngredient}
                className="flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-dark transition-colors mt-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add Ingredient
              </button>
            </div>
          </div>

          {/* Steps */}
          <div className="bg-card rounded-2xl border border-warm-border overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-warm-border flex items-center justify-between">
              <h2 className="font-serif font-bold text-lg text-charcoal">Method</h2>
              <span className="text-xs text-muted">{steps.length} step{steps.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="p-6 space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gold text-charcoal flex items-center justify-center text-xs font-bold mt-2">
                    {i + 1}
                  </div>
                  <div className="flex-1 relative">
                    <textarea
                      value={step}
                      onChange={(e) => updateStep(i, e.target.value)}
                      placeholder={`Step ${i + 1}: describe what to do...`}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal placeholder:text-muted text-sm resize-none"
                    />
                  </div>
                  <button
                    onClick={() => removeStep(i)}
                    disabled={steps.length <= 1}
                    className="p-2 rounded-lg text-muted hover:text-red-400 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors self-start mt-2"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addStep}
                className="flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-dark transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Add Step
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 pb-8">
            <button
              onClick={handleDiscard}
              disabled={isSubmitting}
              className="text-sm font-semibold text-muted hover:text-charcoal border border-warm-border px-6 py-3 rounded-full transition-colors disabled:opacity-50"
            >
              Discard Draft
            </button>
            <button
              onClick={handlePublish}
              disabled={isSubmitting}
              className="bg-gold hover:bg-gold-dark text-charcoal font-semibold px-8 py-3 rounded-full transition-colors shadow-sm disabled:opacity-60"
            >
              {isSubmitting ? 'Publishing…' : 'Publish Recipe'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
