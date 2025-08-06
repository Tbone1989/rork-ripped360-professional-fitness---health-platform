import { z } from "zod";
import { publicProcedure } from "../../../create-context";

const API_KEYS = {
  RIP360_NUTRITION: process.env.EXPO_PUBLIC_RIP360_NUTRITION_API_KEY || '',
  EDAMAM_APP_ID: process.env.EXPO_PUBLIC_EDAMAM_APP_ID || '',
  EDAMAM_APP_KEY: process.env.EXPO_PUBLIC_EDAMAM_APP_KEY || '',
  USDA_API_KEY: process.env.EXPO_PUBLIC_USDA_API_KEY || '',
  API_NINJAS: process.env.EXPO_PUBLIC_API_NINJAS_KEY || '',
};

const API_ENDPOINTS = {
  RIP360_NUTRITION: process.env.EXPO_PUBLIC_NUTRITION_API_URL || 'https://api.rip360.com/nutrition',
  EDAMAM: 'https://api.edamam.com/api/food-database/v2',
  USDA: 'https://api.nal.usda.gov/fdc/v1',
  API_NINJAS: 'https://api.api-ninjas.com/v1',
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

const makeApiRequest = async (url: string, headers: Record<string, string>): Promise<any> => {
  console.log(`🌐 Making API request to: ${url}`);
  console.log(`🔑 Headers:`, Object.keys(headers));
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Rip360-Mobile-App/1.0',
      ...headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ API Error: ${response.status} ${response.statusText}`, errorText);
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`✅ API Success: Received data`);
  return data;
};

const searchWithRip360 = async (query: string): Promise<NutritionData[]> => {
  if (!API_KEYS.RIP360_NUTRITION) throw new Error('RIP360_NUTRITION API key not found');
  
  const url = `${API_ENDPOINTS.RIP360_NUTRITION}/search?q=${encodeURIComponent(query)}`;
  const data = await makeApiRequest(url, {
    'X-API-Key': API_KEYS.RIP360_NUTRITION,
  });
  
  return data.results || data;
};

const searchWithEdamam = async (query: string): Promise<NutritionData[]> => {
  if (!API_KEYS.EDAMAM_APP_ID || !API_KEYS.EDAMAM_APP_KEY) {
    throw new Error('Edamam API keys not found');
  }
  
  const url = `${API_ENDPOINTS.EDAMAM}/parser?app_id=${API_KEYS.EDAMAM_APP_ID}&app_key=${API_KEYS.EDAMAM_APP_KEY}&ingr=${encodeURIComponent(query)}`;
  const data = await makeApiRequest(url, {});
  
  return data.hints?.map((hint: any) => {
    const food = hint.food;
    const nutrients = food.nutrients || {};
    
    return {
      name: food.label || food.knownAs || 'Unknown Food',
      brand: food.brand,
      calories: Math.round(nutrients.ENERC_KCAL || 0),
      protein: Math.round((nutrients.PROCNT || 0) * 10) / 10,
      carbs: Math.round((nutrients.CHOCDF || 0) * 10) / 10,
      fat: Math.round((nutrients.FAT || 0) * 10) / 10,
      fiber: Math.round((nutrients.FIBTG || 0) * 10) / 10,
      sugar: Math.round((nutrients.SUGAR || 0) * 10) / 10,
      sodium: Math.round((nutrients.NA || 0) * 10) / 10,
      servingSize: '100g',
      image: food.image,
    };
  }) || [];
};

const searchWithUSDA = async (query: string): Promise<NutritionData[]> => {
  if (!API_KEYS.USDA_API_KEY) throw new Error('USDA API key not found');
  
  const url = `${API_ENDPOINTS.USDA}/foods/search?api_key=${API_KEYS.USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=10`;
  const data = await makeApiRequest(url, {});
  
  return data.foods?.map((food: any) => {
    const nutrients = food.foodNutrients || [];
    const getNutrient = (id: number) => {
      const nutrient = nutrients.find((n: any) => n.nutrientId === id);
      return nutrient ? nutrient.value : 0;
    };
    
    return {
      name: food.description || 'Unknown Food',
      brand: food.brandOwner,
      calories: Math.round(getNutrient(1008)),
      protein: Math.round(getNutrient(1003) * 10) / 10,
      carbs: Math.round(getNutrient(1005) * 10) / 10,
      fat: Math.round(getNutrient(1004) * 10) / 10,
      fiber: Math.round(getNutrient(1079) * 10) / 10,
      sugar: Math.round(getNutrient(2000) * 10) / 10,
      sodium: Math.round(getNutrient(1093) * 10) / 10,
      servingSize: '100g',
    };
  }) || [];
};

const searchWithApiNinjas = async (query: string): Promise<NutritionData[]> => {
  if (!API_KEYS.API_NINJAS) throw new Error('API Ninjas key not found');
  
  const url = `${API_ENDPOINTS.API_NINJAS}/nutrition?query=${encodeURIComponent(query)}`;
  const data = await makeApiRequest(url, {
    'X-Api-Key': API_KEYS.API_NINJAS,
  });
  
  if (Array.isArray(data)) {
    return data.map((item: any) => ({
      name: item.name || 'Unknown Food',
      calories: Math.round(item.calories || 0),
      protein: Math.round((item.protein_g || 0) * 10) / 10,
      carbs: Math.round((item.carbohydrates_total_g || 0) * 10) / 10,
      fat: Math.round((item.fat_total_g || 0) * 10) / 10,
      fiber: Math.round((item.fiber_g || 0) * 10) / 10,
      sugar: Math.round((item.sugar_g || 0) * 10) / 10,
      sodium: Math.round((item.sodium_mg || 0) * 10) / 10,
      servingSize: `${item.serving_size_g || 100}g`,
    }));
  }
  
  return [];
};

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
    
    // Try APIs in order of preference
    const apiAttempts = [
      { name: 'RIP360', fn: () => searchWithRip360(input.query) },
      { name: 'Edamam', fn: () => searchWithEdamam(input.query) },
      { name: 'USDA', fn: () => searchWithUSDA(input.query) },
      { name: 'API Ninjas', fn: () => searchWithApiNinjas(input.query) },
    ];
    
    for (const api of apiAttempts) {
      try {
        console.log(`🔄 Trying ${api.name} API...`);
        const results = await api.fn();
        if (results && results.length > 0) {
          console.log(`✅ ${api.name} API success: Found ${results.length} food items`);
          return results;
        }
      } catch (error) {
        console.warn(`⚠️ ${api.name} API failed:`, error instanceof Error ? error.message : 'Unknown error');
        continue;
      }
    }
    
    // Fallback to mock data
    console.log('🔄 All APIs failed, using mock data');
    const results = getMockFoodData(input.query);
    console.log(`✅ Mock data: Found ${results.length} food items`);
    
    return results;
  });