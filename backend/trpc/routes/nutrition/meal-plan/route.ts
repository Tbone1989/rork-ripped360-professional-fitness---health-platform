import { z } from "zod";
import { publicProcedure } from "../../../create-context";

const getMockMealPlan = () => {
  return {
    id: 'plan-1',
    name: 'Custom Meal Plan',
    duration: '7 days',
    meals: [
      {
        day: 1,
        breakfast: {
          name: 'Protein Oatmeal',
          calories: 350,
          protein: 25,
          carbs: 45,
          fat: 8,
        },
        lunch: {
          name: 'Grilled Chicken Salad',
          calories: 400,
          protein: 35,
          carbs: 15,
          fat: 18,
        },
        dinner: {
          name: 'Salmon with Sweet Potato',
          calories: 500,
          protein: 40,
          carbs: 35,
          fat: 20,
        },
      },
      {
        day: 2,
        breakfast: {
          name: 'Greek Yogurt Bowl',
          calories: 320,
          protein: 20,
          carbs: 30,
          fat: 12,
        },
        lunch: {
          name: 'Turkey Wrap',
          calories: 450,
          protein: 30,
          carbs: 40,
          fat: 15,
        },
        dinner: {
          name: 'Lean Beef with Rice',
          calories: 520,
          protein: 45,
          carbs: 40,
          fat: 18,
        },
      },
    ],
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
    
    const mealPlan = getMockMealPlan();
    console.log(`✅ Generated meal plan: ${mealPlan.name}`);
    
    return mealPlan;
  });