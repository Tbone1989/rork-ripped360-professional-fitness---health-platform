import { z } from "zod";
import { publicProcedure } from "../../../create-context";

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

const API_KEYS = {
  RIP360_NUTRITION: process.env.EXPO_PUBLIC_RIP360_NUTRITION_API_KEY || '',
  EDAMAM_APP_ID: process.env.EXPO_PUBLIC_EDAMAM_APP_ID || '',
  EDAMAM_APP_KEY: process.env.EXPO_PUBLIC_EDAMAM_APP_KEY || '',
};

const API_ENDPOINTS = {
  RIP360_NUTRITION: process.env.EXPO_PUBLIC_NUTRITION_API_URL || 'https://api.rip360.com/nutrition',
  EDAMAM: 'https://api.edamam.com/api/food-database/v2',
  OPENFOODFACTS: 'https://world.openfoodfacts.org/api/v2',
};

const makeApiRequest = async (url: string, headers: Record<string, string>): Promise<any> => {
  console.log(`🌐 Making API request to: ${url}`);
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

  return response.json();
};

const fetchWithRip360 = async (barcode: string): Promise<NutritionData> => {
  if (!API_KEYS.RIP360_NUTRITION) throw new Error('RIP360_NUTRITION API key not found');
  const url = `${API_ENDPOINTS.RIP360_NUTRITION}/barcode/${encodeURIComponent(barcode)}`;
  const data = await makeApiRequest(url, { 'X-API-Key': API_KEYS.RIP360_NUTRITION });
  return data as NutritionData;
};

const fetchWithEdamam = async (barcode: string): Promise<NutritionData> => {
  if (!API_KEYS.EDAMAM_APP_ID || !API_KEYS.EDAMAM_APP_KEY) throw new Error('Edamam keys not found');
  const url = `${API_ENDPOINTS.EDAMAM}/parser?upc=${encodeURIComponent(barcode)}&app_id=${API_KEYS.EDAMAM_APP_ID}&app_key=${API_KEYS.EDAMAM_APP_KEY}`;
  const data = await makeApiRequest(url, {});
  const food = data.parsed?.[0]?.food || data.hints?.[0]?.food;
  if (!food) throw new Error('No food found for barcode');
  const nutrients = food.nutrients || {};
  const result: NutritionData = {
    name: food.label || 'Unknown Food',
    brand: food.brand,
    calories: Math.round(nutrients.ENERC_KCAL || 0),
    protein: Math.round((nutrients.PROCNT || 0) * 10) / 10,
    carbs: Math.round((nutrients.CHOCDF || 0) * 10) / 10,
    fat: Math.round((nutrients.FAT || 0) * 10) / 10,
    fiber: Math.round((nutrients.FIBTG || 0) * 10) / 10,
    sugar: Math.round((nutrients.SUGAR || 0) * 10) / 10,
    sodium: Math.round((nutrients.NA || 0) * 10) / 10,
    servingSize: '100g',
    barcode,
    image: food.image,
  };
  return result;
};

const fetchWithOpenFoodFacts = async (barcode: string): Promise<NutritionData> => {
  const url = `${API_ENDPOINTS.OPENFOODFACTS}/product/${encodeURIComponent(barcode)}.json`;
  const data = await makeApiRequest(url, {});
  const product = data.product;
  if (!product) throw new Error('OpenFoodFacts: product not found');
  const nutriments = product.nutriments || {};
  const kcal = nutriments['energy-kcal_100g'] ?? nutriments['energy-kcal'] ?? 0;
  const protein = nutriments['proteins_100g'] ?? 0;
  const carbs = nutriments['carbohydrates_100g'] ?? 0;
  const fat = nutriments['fat_100g'] ?? 0;
  const fiber = nutriments['fiber_100g'] ?? 0;
  const sugar = nutriments['sugars_100g'] ?? 0;
  const sodium = nutriments['sodium_100g'] ?? ((nutriments['salt_100g'] ?? 0) * 400); // convert salt g to mg sodium approx

  const result: NutritionData = {
    name: product.product_name || 'Unknown Item',
    brand: product.brands || product.brand_owner,
    calories: Math.round(Number(kcal) || 0),
    protein: Math.round(Number(protein) * 10) / 10,
    carbs: Math.round(Number(carbs) * 10) / 10,
    fat: Math.round(Number(fat) * 10) / 10,
    fiber: Math.round(Number(fiber) * 10) / 10,
    sugar: Math.round(Number(sugar) * 10) / 10,
    sodium: Math.round(Number(sodium) * 1000) / 1000,
    servingSize: '100g',
    barcode,
    image: product.image_url,
  };
  return result;
};

const getMockFoodByBarcode = (barcode: string): NutritionData => {
  return {
    name: 'Unknown Item',
    brand: 'Unknown',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    servingSize: '100g',
    barcode,
  };
};

export default publicProcedure
  .input(z.object({ barcode: z.string() }))
  .query(async ({ input }) => {
    console.log(`🔍 Looking up food by barcode: ${input.barcode}`);

    const attempts = [
      { name: 'RIP360', fn: () => fetchWithRip360(input.barcode) },
      { name: 'Edamam', fn: () => fetchWithEdamam(input.barcode) },
      { name: 'OpenFoodFacts', fn: () => fetchWithOpenFoodFacts(input.barcode) },
    ];

    for (const api of attempts) {
      try {
        console.log(`🔄 Trying ${api.name} API...`);
        const result = await api.fn();
        console.log(`✅ ${api.name} success: ${result.name}`);
        return result;
      } catch (e) {
        console.warn(`⚠️ ${api.name} failed:`, e instanceof Error ? e.message : 'Unknown error');
        continue;
      }
    }

    const result = getMockFoodByBarcode(input.barcode);
    console.log(`✅ Mock fallback: ${result.name}`);
    return result;
  });