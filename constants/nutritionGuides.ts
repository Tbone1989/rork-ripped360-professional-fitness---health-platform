export interface TipSection {
  id: string;
  title: string;
  description?: string;
  tips: string[];
}

export interface FoodItemGuide {
  id: string;
  name: string;
  bestFor: string[];
  watchouts?: string[];
  notes?: string[];
}

export interface FoodCategoryGuide {
  id: string;
  title: string;
  items: FoodItemGuide[];
}

export const restaurantGuide: TipSection = {
  id: 'restaurant-ordering',
  title: 'Ordering at Restaurants',
  description:
    'Stay on plan when eating out by prioritizing protein, controlling sauces, and managing carbs/fats based on your goal.',
  tips: [
    'Ask for protein grilled/blackened; avoid breading and heavy sauces',
    'Swap fries/rice for double veggies or a side salad; request dressing on the side',
    'Choose lean proteins (chicken, fish, steak sirloin) and ask for simple seasonings',
    'Build a bowl: base of greens/veggies + lean protein + one carb (rice/potato) + light sauce',
    'For burritos/bowls: go bowl-style, skip sour cream/cheese; use salsa or pico for flavor',
    'At breakfast: egg whites + whole eggs, turkey bacon or Canadian bacon; fruit or oats instead of pancakes',
    'Hydration: water/sparkling water; limit alcohol to spirits with zero-cal mixers if used',
  ],
};

export const foodBasics: FoodCategoryGuide = {
  id: 'food-basics',
  title: 'Smart Food Choices',
  items: [
    {
      id: 'carbs',
      name: 'Carbohydrates',
      bestFor: ['Training fuel', 'Glycogen replenishment', 'Recovery'],
      notes: ['Choose mostly complex carbs (rice, potatoes, oats, fruit) and time bigger servings around training'],
    },
    {
      id: 'proteins',
      name: 'Proteins',
      bestFor: ['Muscle repair', 'Satiety'],
      notes: ['Aim 0.7–1.0g per lb of goal bodyweight; lean sources if cutting, fattier cuts if bulking'],
    },
    {
      id: 'fats',
      name: 'Fats',
      bestFor: ['Hormonal support', 'Satiety'],
      watchouts: ['Restaurant cooking oils add hidden calories; request light oil/no butter'],
    },
    {
      id: 'veggies',
      name: 'Vegetables & Fruit',
      bestFor: ['Micronutrients', 'Fiber', 'Satiety'],
      notes: ['Get 2+ cups veggies and 1–2 servings fruit daily; diversify colors'],
    },
  ],
};

export const smartSwaps: TipSection = {
  id: 'smart-swaps',
  title: 'Smart Swaps',
  tips: [
    'Mayo → mustard/Greek yogurt; creamy dressings → vinaigrette',
    'Fried sides → roasted/steamed veggies',
    'Sugary drinks → water/sparkling water/zero-cal',
    'Bread/buns → lettuce wrap or open-face when cutting',
    'Dessert → fruit/Greek yogurt with berries',
  ],
};
