export type Page =
  | 'home'
  | 'recipes'
  | 'recipe-detail'
  | 'favorites'
  | 'add-recipe'
  | 'profile'
  | 'edit-profile'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'settings';

export type NavigateFn = (page: Page, recipeId?: string) => void;

export interface Recipe {
  id: string;
  title: string;
  image: string;
  time: string;
  servings: number;
  calories: number;
  rating: number;
  ratingCount: number;
  category: string;
  cuisine: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  description: string;
  chef: { name: string; avatar: string };
  ingredients: { amount: string; item: string }[];
  steps: string[];
}

export const RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Saffron Risotto with Parmesan & Lemon',
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=900&h=560&fit=crop&auto=format',
    time: '45 min',
    servings: 4,
    calories: 480,
    rating: 4.9,
    ratingCount: 312,
    category: 'Main Course',
    cuisine: 'Italian',
    difficulty: 'Medium',
    tags: ['Vegetarian', 'Italian', 'Comfort Food'],
    description:
      'A luxurious golden risotto infused with saffron threads, finished with aged Parmesan and a bright squeeze of lemon. The perfect balance of creamy richness and delicate floral notes.',
    chef: {
      name: 'Elena Rossi',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format',
    },
    ingredients: [
      { amount: '2 cups', item: 'Arborio rice' },
      { amount: '6 cups', item: 'warm vegetable stock' },
      { amount: '1 generous pinch', item: 'saffron threads' },
      { amount: '1 cup', item: 'dry white wine' },
      { amount: '1 large', item: 'white onion, finely diced' },
      { amount: '3 cloves', item: 'garlic, minced' },
      { amount: '4 tbsp', item: 'unsalted butter, divided' },
      { amount: '2 tbsp', item: 'good olive oil' },
      { amount: '1 cup', item: 'finely grated Parmigiano-Reggiano' },
      { amount: '1', item: 'lemon, zested and juiced' },
      { amount: 'to taste', item: 'sea salt and white pepper' },
      { amount: 'small bunch', item: 'fresh chives, finely sliced' },
    ],
    steps: [
      'Steep the saffron threads in 3 tablespoons of warm water for 10 minutes until deeply golden.',
      'Warm the stock in a saucepan over low heat and keep it gently simmering throughout cooking.',
      'In a wide, heavy-bottomed pan, melt 2 tablespoons of butter with the olive oil over medium heat. Add the onion and cook for 5–6 minutes until completely soft and translucent. Add garlic and stir for 1 minute.',
      'Add the Arborio rice and stir to coat evenly in the fat. Toast for 2 minutes, stirring constantly, until the edges of each grain turn translucent.',
      'Pour in the white wine — it will sizzle dramatically. Stir until fully absorbed, about 2 minutes.',
      'Add the saffron water and stir until absorbed. Then add the warm stock one ladleful at a time, stirring continuously and adding the next ladle only once the previous has been absorbed. This takes 20–25 minutes.',
      'When the rice is al dente and the mixture is creamy and flowing, remove from heat. Vigorously stir in the remaining butter, the Parmesan, lemon zest, and a good squeeze of lemon juice.',
      'Season generously with sea salt and white pepper. Allow to rest for 2 minutes — it will continue to thicken slightly. Serve in warmed bowls, scattered with chives.',
    ],
  },
  {
    id: '2',
    title: 'Smashed Avocado Toast with Poached Eggs',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&h=560&fit=crop&auto=format',
    time: '15 min',
    servings: 2,
    calories: 320,
    rating: 4.7,
    ratingCount: 198,
    category: 'Breakfast',
    cuisine: 'Modern',
    difficulty: 'Easy',
    tags: ['Vegetarian', 'Quick', 'Breakfast'],
    description:
      'Perfectly poached eggs perched on creamy smashed avocado, layered over thick sourdough toast. Finished with chilli flakes, microgreens, and a drizzle of good olive oil.',
    chef: {
      name: 'Marcus Chen',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format',
    },
    ingredients: [
      { amount: '2 thick slices', item: 'sourdough bread' },
      { amount: '2 ripe', item: 'avocados' },
      { amount: '2', item: 'large eggs, very fresh' },
      { amount: '1 tbsp', item: 'white wine vinegar' },
      { amount: '1', item: 'lime, juiced' },
      { amount: 'pinch', item: 'chilli flakes' },
      { amount: 'handful', item: 'microgreens or rocket' },
      { amount: 'drizzle', item: 'extra virgin olive oil' },
      { amount: 'to taste', item: 'flaky sea salt' },
    ],
    steps: [
      'Toast the sourdough until golden and crisp on the outside but still a little yielding in the middle.',
      'Halve the avocados, remove the stones, and scoop the flesh into a bowl. Add lime juice and season with salt. Smash with a fork — keep it textured, not smooth.',
      'Bring a deep pan of water to a gentle simmer. Add the white wine vinegar. Crack each egg into a small cup.',
      'Create a gentle vortex in the water with a spoon. Slide each egg into the center. Poach for 3 minutes for a runny yolk.',
      'Spread the smashed avocado generously over each toast. Lift the eggs with a slotted spoon, blot dry, and place on top.',
      'Scatter with chilli flakes, microgreens, and a generous drizzle of olive oil. Finish with flaky salt.',
    ],
  },
  {
    id: '3',
    title: 'Spicy Thai Basil Chicken (Pad Krapao)',
    image:
      'https://images.unsplash.com/photo-1562802378-173f93e3c0f7?w=900&h=560&fit=crop&auto=format',
    time: '25 min',
    servings: 2,
    calories: 410,
    rating: 4.8,
    ratingCount: 276,
    category: 'Main Course',
    cuisine: 'Thai',
    difficulty: 'Easy',
    tags: ['Spicy', 'Thai', 'Quick'],
    description:
      'The quintessential Thai street-food dish — fiery minced chicken tossed with garlic, Thai chillies, and a generous handful of holy basil, all in a savoury glossy sauce.',
    chef: {
      name: 'Nisa Pattaya',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format',
    },
    ingredients: [
      { amount: '400g', item: 'minced chicken thigh' },
      { amount: '6 cloves', item: 'garlic, roughly chopped' },
      { amount: '4–6', item: 'Thai bird eye chillies, sliced' },
      { amount: '2 cups', item: 'fresh Thai or Italian basil leaves' },
      { amount: '2 tbsp', item: 'oyster sauce' },
      { amount: '1 tbsp', item: 'fish sauce' },
      { amount: '1 tsp', item: 'dark soy sauce' },
      { amount: '1 tsp', item: 'sugar' },
      { amount: '2 tbsp', item: 'neutral oil' },
      { amount: '2', item: 'fried eggs, to serve' },
      { amount: 'steamed jasmine rice', item: 'to serve' },
    ],
    steps: [
      'Mix oyster sauce, fish sauce, dark soy sauce, and sugar in a small bowl. Set aside.',
      'Heat the oil in a wok over the highest heat. Add garlic and chillies — stir-fry for 30 seconds until fragrant but not burnt.',
      'Add the minced chicken, breaking it up. Cook without stirring for 1 minute to get some browning, then stir-fry for another 2–3 minutes until cooked through.',
      'Pour in the sauce mixture and toss everything together until glossy and well combined.',
      'Remove from heat and fold in the basil leaves — they will wilt beautifully from the residual heat.',
      'Serve immediately over steamed jasmine rice, topped with a fried egg.',
    ],
  },
  {
    id: '4',
    title: 'Honey-Glazed Salmon with Sesame Bok Choy',
    image:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&h=560&fit=crop&auto=format',
    time: '20 min',
    servings: 2,
    calories: 390,
    rating: 4.6,
    ratingCount: 154,
    category: 'Main Course',
    cuisine: 'Asian',
    difficulty: 'Easy',
    tags: ['Healthy', 'Seafood', 'Quick'],
    description:
      'Pan-seared salmon fillets lacquered in a sweet soy-honey glaze, served alongside tender bok choy tossed in sesame oil. Fast, elegant, weeknight-perfect.',
    chef: {
      name: 'Marcus Chen',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format',
    },
    ingredients: [
      { amount: '2', item: 'salmon fillets, skin-on (about 180g each)' },
      { amount: '3 tbsp', item: 'honey' },
      { amount: '2 tbsp', item: 'soy sauce' },
      { amount: '1 tbsp', item: 'rice vinegar' },
      { amount: '1 tsp', item: 'fresh ginger, grated' },
      { amount: '2', item: 'baby bok choy, halved' },
      { amount: '1 tbsp', item: 'sesame oil' },
      { amount: '1 tbsp', item: 'sesame seeds, toasted' },
      { amount: '2 tbsp', item: 'neutral oil' },
    ],
    steps: [
      'Whisk together honey, soy sauce, rice vinegar, and ginger. Set aside.',
      'Pat the salmon dry and season with salt. Heat neutral oil in a non-stick pan over high heat.',
      'Place salmon skin-side down. Press gently for 30 seconds. Cook 4 minutes until the skin is deeply golden.',
      'Flip, reduce heat to medium, and pour over half the glaze. Cook 2–3 minutes, basting constantly.',
      'Meanwhile, in another pan, stir-fry bok choy in sesame oil for 2–3 minutes until tender.',
      'Serve the salmon over the bok choy. Drizzle with remaining glaze and scatter with sesame seeds.',
    ],
  },
  {
    id: '5',
    title: 'Classic Beef Bourguignon',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&h=560&fit=crop&auto=format',
    time: '3 hrs',
    servings: 6,
    calories: 620,
    rating: 4.9,
    ratingCount: 441,
    category: 'Main Course',
    cuisine: 'French',
    difficulty: 'Hard',
    tags: ['French', 'Slow Cook', 'Dinner Party'],
    description:
      "Julia Child made it famous. Tender beef braised low and slow in a rich Burgundy wine sauce with pearl onions, mushrooms, and lardons. A true weekend showstopper.",
    chef: {
      name: 'Elena Rossi',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format',
    },
    ingredients: [
      { amount: '1.5 kg', item: 'beef chuck, cut into 5cm cubes' },
      { amount: '750ml', item: 'good Burgundy or Pinot Noir' },
      { amount: '200g', item: 'lardons or thick-cut bacon' },
      { amount: '200g', item: 'pearl onions, peeled' },
      { amount: '300g', item: 'button mushrooms' },
      { amount: '2', item: 'carrots, roughly chopped' },
      { amount: '4 cloves', item: 'garlic, crushed' },
      { amount: '2 tbsp', item: 'tomato paste' },
      { amount: '500ml', item: 'beef stock' },
      { amount: '1 bouquet garni', item: '(thyme, bay, parsley)' },
      { amount: '2 tbsp', item: 'plain flour' },
      { amount: '3 tbsp', item: 'butter' },
    ],
    steps: [
      'The day before: marinate the beef in the wine with carrots and garlic overnight in the fridge.',
      'Remove beef, pat dry, and strain the marinade — reserve it.',
      'In a heavy Dutch oven, render the lardons until golden. Remove. Brown the beef in batches — do not crowd the pan. Remove.',
      'Soften the onions and carrots in the fat. Stir in flour and tomato paste, cook 2 minutes.',
      'Return beef and lardons. Pour over the reserved wine and add enough stock to barely cover. Add bouquet garni.',
      'Bring to a simmer, cover, and cook on very low heat (or 150°C oven) for 2.5–3 hours until the beef is fall-apart tender.',
      'In the last 30 minutes, sauté mushrooms in butter and add to the pot.',
      'Skim any fat, discard bouquet garni, adjust seasoning, and serve with crusty bread or buttered egg noodles.',
    ],
  },
  {
    id: '6',
    title: 'Shakshuka with Feta & Zhug',
    image:
      'https://images.unsplash.com/photo-1540189549336-e6e99eb4b9c?w=900&h=560&fit=crop&auto=format',
    time: '30 min',
    servings: 3,
    calories: 290,
    rating: 4.7,
    ratingCount: 187,
    category: 'Breakfast',
    cuisine: 'Middle Eastern',
    difficulty: 'Easy',
    tags: ['Vegetarian', 'Spiced', 'Brunch'],
    description:
      "Eggs poached directly in a fragrant, spiced tomato and pepper sauce. Finished with creamy feta crumbles and a drizzle of herbaceous zhug. Best eaten straight from the pan.",
    chef: {
      name: 'Layla Hassan',
      avatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&auto=format',
    },
    ingredients: [
      { amount: '6', item: 'large eggs' },
      { amount: '2 cans (400g each)', item: 'good-quality crushed tomatoes' },
      { amount: '2', item: 'red bell peppers, diced' },
      { amount: '1', item: 'large onion, diced' },
      { amount: '4 cloves', item: 'garlic, sliced' },
      { amount: '1 tsp each', item: 'cumin, coriander, smoked paprika' },
      { amount: '½ tsp', item: 'cayenne pepper' },
      { amount: '100g', item: 'feta cheese, crumbled' },
      { amount: '3 tbsp', item: 'zhug or harissa' },
      { amount: 'handful', item: 'fresh coriander leaves' },
    ],
    steps: [
      'In a wide skillet or cast-iron pan, soften the onion in olive oil over medium heat for 8 minutes.',
      'Add peppers and garlic, cook 5 minutes. Add all spices and stir for 1 minute.',
      'Pour in the tomatoes, season generously, and simmer for 10–12 minutes until the sauce has thickened.',
      'Make 6 wells in the sauce. Crack an egg into each well. Season the eggs.',
      'Cover and cook over medium-low heat for 6–8 minutes — whites should be just set, yolks still runny.',
      'Scatter with feta and coriander, drizzle with zhug, and bring straight to the table with warm flatbread.',
    ],
  },
  {
    id: '7',
    title: 'Rosemary Focaccia with Flaky Salt',
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&h=560&fit=crop&auto=format',
    time: '2 hrs + overnight',
    servings: 8,
    calories: 240,
    rating: 4.8,
    ratingCount: 203,
    category: 'Baking',
    cuisine: 'Italian',
    difficulty: 'Medium',
    tags: ['Vegan', 'Baking', 'Italian'],
    description:
      'The slow-proved focaccia with a gloriously crisp base, pillowy interior, and countless dimples collecting pools of good olive oil. Fragrant with rosemary and showered with flaky salt.',
    chef: {
      name: 'Layla Hassan',
      avatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&auto=format',
    },
    ingredients: [
      { amount: '500g', item: 'strong white bread flour' },
      { amount: '7g', item: 'instant dried yeast (1 sachet)' },
      { amount: '10g', item: 'fine sea salt' },
      { amount: '375ml', item: 'lukewarm water' },
      { amount: '100ml', item: 'good extra virgin olive oil, divided' },
      { amount: '4 sprigs', item: 'fresh rosemary' },
      { amount: 'generous pinch', item: 'flaky sea salt (Maldon or similar)' },
    ],
    steps: [
      'Combine flour, yeast, and fine salt. Add the water and 2 tablespoons of olive oil. Mix until a shaggy dough forms, then knead for 10 minutes until smooth.',
      'Oil a large bowl generously. Place dough inside, cover, and refrigerate overnight (or up to 3 days).',
      'Three hours before baking, oil a 25×35cm baking tray generously. Transfer dough to the tray and stretch it gently to fill. Cover and let rise at room temperature for 2 hours.',
      'Preheat oven to 230°C (210°C fan). Drizzle the remaining olive oil over the dough. Using all ten fingers, dimple the dough deeply all over.',
      'Press rosemary sprigs into the dimples. Scatter generously with flaky salt.',
      'Bake for 20–25 minutes until deeply golden. The base should sound hollow when tapped. Cool 10 minutes before cutting.',
    ],
  },
  {
    id: '8',
    title: 'Mango Coconut Panna Cotta',
    image:
      'https://images.unsplash.com/photo-1488477181946-3c5d4b169f9c?w=900&h=560&fit=crop&auto=format',
    time: '30 min + 4 hrs chill',
    servings: 4,
    calories: 310,
    rating: 4.5,
    ratingCount: 132,
    category: 'Dessert',
    cuisine: 'Fusion',
    difficulty: 'Medium',
    tags: ['Dessert', 'Dairy-Free option', 'Make-Ahead'],
    description:
      'Silky-smooth coconut panna cotta set in glasses and crowned with a vivid mango coulis. Sophisticated, tropical, and surprisingly forgiving to make.',
    chef: {
      name: 'Nisa Pattaya',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format',
    },
    ingredients: [
      { amount: '400ml', item: 'full-fat coconut milk' },
      { amount: '200ml', item: 'double cream' },
      { amount: '50g', item: 'caster sugar' },
      { amount: '2½ tsp', item: 'powdered gelatine' },
      { amount: '3 tbsp', item: 'cold water' },
      { amount: '1 tsp', item: 'vanilla extract' },
      { amount: '2 ripe', item: 'mangoes, peeled and diced' },
      { amount: '2 tbsp', item: 'lime juice' },
      { amount: '1 tbsp', item: 'icing sugar' },
      { amount: 'to decorate', item: 'toasted coconut flakes, mint leaves' },
    ],
    steps: [
      'Sprinkle gelatine over cold water in a small bowl. Let it bloom for 5 minutes.',
      'Heat coconut milk, cream, and caster sugar in a saucepan over medium heat. Stir until the sugar dissolves — do not boil.',
      'Remove from heat. Add the bloomed gelatine and stir until completely dissolved. Add vanilla.',
      'Pour into 4 glasses or ramekins. Refrigerate for at least 4 hours or overnight.',
      'For the coulis: blend most of the mango with lime juice and icing sugar until very smooth.',
      'Spoon the mango coulis over each panna cotta. Garnish with remaining mango pieces, toasted coconut, and a mint leaf.',
    ],
  },
];

export const CURRENT_USER = {
  name: 'Jamie Okafor',
  username: '@jamiecooks',
  avatar:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&auto=format',
  bio: 'Home cook, recipe developer, and avid farmers market hunter. Based in London. I believe good food is the best love language.',
  location: 'London, UK',
  followers: 1842,
  following: 234,
  recipeCount: 47,
};
