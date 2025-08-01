import { z } from "zod";
import { publicProcedure } from "../../../create-context";

const API_KEYS = {
  NUTRITION: process.env.EXPO_PUBLIC_RIP360_NUTRITION_API_KEY || '',
};

const API_ENDPOINTS = {
  NUTRITION: process.env.EXPO_PUBLIC_NUTRITION_API_URL || 'https://api.edamam.com/api/food-database/v2',
};

interface NutritionData {
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: string;
  barcode?: string;
  image?: string;
}

const getMockFoodData = (query: string): NutritionData[] => {
  const mockFoods: NutritionData[] = [
    {
      name: 'Grilled Chicken Breast',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      servingSize: '100g',
    },
    {
      name: 'Brown Rice',
      calories: 111,
      protein: 2.6,
      carbs: 23,
      fat: 0.9,
      fiber: 1.8,
      sugar: 0.4,
      sodium: 5,
      servingSize: '100g cooked',
    },
    {
      name: 'Greek Yogurt',
      brand: 'Chobani',
      calories: 59,
      protein: 10,
      carbs: 3.6,
      fat: 0.4,
      fiber: 0,
      sugar: 3.2,
      sodium: 36,
      servingSize: '100g',
    },
    {
      name: 'Salmon Fillet',
      calories: 208,
      protein: 25,
      carbs: 0,
      fat: 12,
      fiber: 0,
      sugar: 0,
      sodium: 59,
      servingSize: '100g',
    },
    {
      name: 'Avocado',
      calories: 160,
      protein: 2,
      carbs: 9,
      fat: 15,
      fiber: 7,
      sugar: 0.7,
      sodium: 7,
      servingSize: '100g',
    },
  ];
  
  return mockFoods.filter(food => 
    food.name.toLowerCase().includes(query.toLowerCase()) ||
    (food.brand && food.brand.toLowerCase().includes(query.toLowerCase()))
  );
};

export default publicProcedure
  .input(z.object({ query: z.string() }))
  .query(async ({ input }) => {
    console.log(`🔍 Searching food for: ${input.query}`);
    
    // For now, always return mock data since we don't have real API keys
    const results = getMockFoodData(input.query);
    console.log(`✅ Found ${results.length} food items`);
    
    return results;
  });