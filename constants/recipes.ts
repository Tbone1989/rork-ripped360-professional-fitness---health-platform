export type Recipe = {
  id: string;
  title: string;
  summary: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  time?: string;
  image?: string;
  ingredients: string[];
  steps: string[];
};

export const healthyRecipes: Recipe[] = [
  {
    id: 'r1',
    title: 'High-Protein Greek Yogurt Parfait',
    summary: 'Quick breakfast with probiotics and antioxidants',
    calories: 350,
    protein: 30,
    carbs: 35,
    fat: 9,
    time: '5 min',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1200',
    ingredients: ['1 cup non-fat Greek yogurt', '1/2 cup mixed berries', '1 tbsp honey', '2 tbsp granola', '1 scoop vanilla whey (optional)'],
    steps: ['Layer yogurt and berries in a bowl', 'Drizzle honey', 'Top with granola', 'Add whey and mix if desired'],
  },
  {
    id: 'r2',
    title: 'Lean Chicken Bowl',
    summary: 'Balanced lunch for muscle building',
    calories: 520,
    protein: 45,
    carbs: 55,
    fat: 14,
    time: '20 min',
    image: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200',
    ingredients: ['150g grilled chicken breast', '1 cup brown rice', '1 cup broccoli', '1/4 avocado', 'Salt & pepper'],
    steps: ['Grill chicken', 'Steam broccoli', 'Assemble bowl with rice, chicken, broccoli, avocado', 'Season to taste'],
  },
  {
    id: 'r3',
    title: 'Overnight Oats with Chia',
    summary: 'Easy make-ahead carbs with fiber',
    calories: 420,
    protein: 20,
    carbs: 55,
    fat: 12,
    time: '10 min + overnight',
    image: 'https://images.unsplash.com/photo-1484980859177-5ac1249fda6f?q=80&w=1200',
    ingredients: ['1/2 cup rolled oats', '1 cup almond milk', '1 tbsp chia seeds', '1 tsp cinnamon', 'Banana slices'],
    steps: ['Combine oats, milk, chia, cinnamon in jar', 'Refrigerate overnight', 'Top with banana before serving'],
  },
];
