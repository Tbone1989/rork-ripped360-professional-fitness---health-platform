import { z } from "zod";
import { publicProcedure } from "../../../create-context";

const getMockMealPlan = (input: { calories: number; protein: number; carbs: number; fat: number; meals: number; restrictions: string[] }) => {
  const mealTemplates = {
    breakfast: [
      { name: 'Protein Oatmeal with Berries', base_calories: 350, protein: 25, carbs: 45, fat: 8 },
      { name: 'Greek Yogurt Parfait', base_calories: 320, protein: 20, carbs: 30, fat: 12 },
      { name: 'Scrambled Eggs with Avocado Toast', base_calories: 420, protein: 22, carbs: 25, fat: 28 },
      { name: 'Protein Smoothie Bowl', base_calories: 380, protein: 30, carbs: 35, fat: 15 },
      { name: 'Cottage Cheese Pancakes', base_calories: 340, protein: 28, carbs: 32, fat: 10 },
    ],
    lunch: [
      { name: 'Grilled Chicken Caesar Salad', base_calories: 400, protein: 35, carbs: 15, fat: 18 },
      { name: 'Turkey and Hummus Wrap', base_calories: 450, protein: 30, carbs: 40, fat: 15 },
      { name: 'Quinoa Buddha Bowl', base_calories: 480, protein: 20, carbs: 55, fat: 18 },
      { name: 'Tuna Poke Bowl', base_calories: 420, protein: 32, carbs: 45, fat: 12 },
      { name: 'Chicken Burrito Bowl', base_calories: 520, protein: 38, carbs: 48, fat: 20 },
    ],
    dinner: [
      { name: 'Salmon with Sweet Potato', base_calories: 500, protein: 40, carbs: 35, fat: 20 },
      { name: 'Lean Beef Stir-fry with Rice', base_calories: 520, protein: 45, carbs: 40, fat: 18 },
      { name: 'Grilled Chicken with Quinoa', base_calories: 480, protein: 42, carbs: 38, fat: 16 },
      { name: 'Baked Cod with Roasted Vegetables', base_calories: 420, protein: 35, carbs: 30, fat: 15 },
      { name: 'Turkey Meatballs with Pasta', base_calories: 550, protein: 40, carbs: 50, fat: 22 },
    ],
    snack: [
      { name: 'Protein Shake with Banana', base_calories: 200, protein: 25, carbs: 20, fat: 3 },
      { name: 'Greek Yogurt with Nuts', base_calories: 180, protein: 15, carbs: 12, fat: 8 },
      { name: 'Apple with Almond Butter', base_calories: 220, protein: 8, carbs: 25, fat: 12 },
      { name: 'Protein Bar', base_calories: 250, protein: 20, carbs: 22, fat: 9 },
      { name: 'Cottage Cheese with Berries', base_calories: 160, protein: 18, carbs: 15, fat: 4 },
    ],
    'pre-workout': [
      { name: 'Banana with Peanut Butter', base_calories: 280, protein: 8, carbs: 35, fat: 12 },
      { name: 'Oatmeal with Honey', base_calories: 220, protein: 6, carbs: 42, fat: 4 },
      { name: 'Energy Smoothie', base_calories: 240, protein: 12, carbs: 38, fat: 6 },
    ],
    'post-workout': [
      { name: 'Whey Protein Shake', base_calories: 180, protein: 30, carbs: 8, fat: 2 },
      { name: 'Chocolate Milk', base_calories: 200, protein: 12, carbs: 28, fat: 5 },
      { name: 'Recovery Smoothie', base_calories: 220, protein: 25, carbs: 22, fat: 4 },
    ],
  };

  const generateDayMeals = (dayNum: number) => {
    const dayMeals: any = { day: dayNum };
    const caloriesPerMeal = Math.floor(input.calories / input.meals);
    
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack', 'pre-workout', 'post-workout'];
    const selectedMealTypes = mealTypes.slice(0, input.meals);
    
    // Ensure we always have breakfast, lunch, dinner for 3+ meals
    if (input.meals >= 3) {
      selectedMealTypes[0] = 'breakfast';
      selectedMealTypes[1] = 'lunch';
      selectedMealTypes[2] = 'dinner';
    }
    
    selectedMealTypes.forEach((mealType, index) => {
      const templates = mealTemplates[mealType as keyof typeof mealTemplates] || mealTemplates.snack;
      const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
      
      // Adjust calories based on meal distribution
      const calorieMultiplier = caloriesPerMeal / selectedTemplate.base_calories;
      
      dayMeals[mealType] = {
        name: selectedTemplate.name,
        calories: Math.round(selectedTemplate.base_calories * calorieMultiplier),
        protein: Math.round(selectedTemplate.protein * calorieMultiplier),
        carbs: Math.round(selectedTemplate.carbs * calorieMultiplier),
        fat: Math.round(selectedTemplate.fat * calorieMultiplier),
        time: getMealTime(mealType, index),
      };
    });
    
    return dayMeals;
  };
  
  const getMealTime = (mealType: string, index: number) => {
    const times = {
      breakfast: '7:00 AM',
      'pre-workout': '9:00 AM',
      lunch: '12:00 PM',
      snack: '3:00 PM',
      'post-workout': '5:00 PM',
      dinner: '7:00 PM',
    };
    return times[mealType as keyof typeof times] || `${8 + index * 2}:00 ${index < 3 ? 'AM' : 'PM'}`;
  };

  // Generate 7 days of meals
  const meals = Array.from({ length: 7 }, (_, i) => generateDayMeals(i + 1));

  return {
    id: `plan-${Date.now()}`,
    name: `Custom ${input.meals}-Meal Plan`,
    duration: '7 days',
    totalCalories: input.calories,
    totalProtein: input.protein,
    totalCarbs: input.carbs,
    totalFat: input.fat,
    mealsPerDay: input.meals,
    restrictions: input.restrictions,
    meals,
  };
};

export default publicProcedure
  .input(z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    meals: z.number(),
    restrictions: z.array(z.string())
  }))
  .mutation(async ({ input }) => {
    console.log(`🍽️ Generating meal plan - calories: ${input.calories}, protein: ${input.protein}g, meals: ${input.meals}/day`);
    
    const mealPlan = getMockMealPlan(input);
    console.log(`✅ Generated meal plan: ${mealPlan.name} with ${mealPlan.mealsPerDay} meals per day`);
    
    return mealPlan;
  });