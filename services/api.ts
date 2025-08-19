// API Configuration
// TODO: Replace with actual API endpoints once provided
const API_BASE_URL = 'https://api.rip360.com';

// Alternative endpoints for testing (replace with real ones)
const API_ENDPOINTS = {
  NINJA: process.env.EXPO_PUBLIC_NINJA_API_URL || 'https://api.api-ninjas.com/v1',
  NUTRITION: process.env.EXPO_PUBLIC_NUTRITION_API_URL || 'https://api.edamam.com/api/food-database/v2',
  HEALTH_FDA: process.env.EXPO_PUBLIC_FDA_API_URL || 'https://api.fda.gov'
};

// API Keys - These should be set in your environment variables
const API_KEYS = {
  NINJA: process.env.EXPO_PUBLIC_RIP360_NINJA_API_KEY || '',
  NUTRITION: process.env.EXPO_PUBLIC_RIP360_NUTRITION_API_KEY || '',
  HEALTH_FDA: process.env.EXPO_PUBLIC_RIP360_HEALTH_FDA_API_KEY || '',
};

// Development mode - use mock data when API keys are not available
const isDevelopmentMode = !API_KEYS.NINJA || !API_KEYS.NUTRITION || !API_KEYS.HEALTH_FDA;

// Types
export interface NutritionData {
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

export interface WorkoutData {
  id: string;
  name: string;
  type: string;
  muscle: string[];
  equipment: string;
  difficulty: string;
  instructions: string[];
}

export interface BloodworkAnalysis {
  id: string;
  testName: string;
  value: number;
  unit: string;
  referenceRange: {
    min: number;
    max: number;
  };
  status: 'normal' | 'low' | 'high' | 'critical';
  recommendations: string[];
}

export interface SupplementData {
  id: string;
  name: string;
  brand: string;
  category: string;
  ingredients: string[];
  dosage: string;
  benefits: string[];
  warnings: string[];
  price: number;
  rating: number;
  reviews: number;
}

// API Service Class
import { trpcClient } from '@/lib/trpc';

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    apiKey: string,
    baseUrl: string = API_BASE_URL
  ): Promise<T> {
    // Enhanced error handling and logging
    console.log(`🔄 API Request: ${baseUrl}${endpoint}`);
    console.log(`🔑 API Key present: ${!!apiKey}`);
    
    // If in development mode or no API key, provide detailed error
    if (isDevelopmentMode || !apiKey) {
      console.warn('⚠️ Development mode or missing API key - using mock data');
      throw new Error('DEVELOPMENT_MODE');
    }

    const url = `${baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
          'User-Agent': 'Rip360-Mobile-App/1.0',
          ...options.headers,
        },
      });

      console.log(`📡 Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ API Success: Received ${JSON.stringify(data).length} characters`);
      return data;
    } catch (error) {
      console.error('❌ Network request failed:', error);
      throw error;
    }
  }

  // Nutrition API Methods
  async searchFood(query: string): Promise<NutritionData[]> {
    try {
      return await this.makeRequest<NutritionData[]>(
        `/nutrition/search?q=${encodeURIComponent(query)}`,
        { method: 'GET' },
        API_KEYS.NUTRITION
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage === 'DEVELOPMENT_MODE' || isDevelopmentMode) {
        console.log('Development mode: Using mock food data for query:', query);
      } else {
        console.error('Error searching food:', error);
      }
      return this.getMockFoodData(query);
    }
  }

  async getFoodByBarcode(barcode: string): Promise<NutritionData | null> {
    try {
      console.log('Using tRPC nutrition.barcode for lookup', barcode);
      const data = await trpcClient.nutrition.barcode.query({ barcode });
      return data as NutritionData;
    } catch (trpcError) {
      console.warn('tRPC nutrition.barcode failed, falling back to HTTP', trpcError);
      try {
        return await this.makeRequest<NutritionData>(
          `/nutrition/barcode/${barcode}`,
          { method: 'GET' },
          API_KEYS.NUTRITION
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if (errorMessage === 'DEVELOPMENT_MODE' || isDevelopmentMode) {
          console.log('Development mode: Using mock food data for barcode:', barcode);
        } else {
          console.error('Error getting food by barcode:', error);
        }
        return this.getMockFoodByBarcode(barcode);
      }
    }
  }

  async generateMealPlan(preferences: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    meals: number;
    restrictions: string[];
  }): Promise<any> {
    try {
      return await this.makeRequest(
        '/nutrition/meal-plan/generate',
        {
          method: 'POST',
          body: JSON.stringify(preferences),
        },
        API_KEYS.NUTRITION
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage === 'DEVELOPMENT_MODE' || isDevelopmentMode) {
        console.log('Development mode: Using mock meal plan data');
      } else {
        console.error('Error generating meal plan:', error);
      }
      return this.getMockMealPlan();
    }
  }

  // Fitness API Methods
  async searchExercises(muscle?: string, type?: string): Promise<WorkoutData[]> {
    try {
      const params = new URLSearchParams();
      if (muscle) params.append('muscle', muscle);
      if (type) params.append('type', type);
      
      return await this.makeRequest<WorkoutData[]>(
        `/fitness/exercises?${params.toString()}`,
        { method: 'GET' },
        API_KEYS.NINJA
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage === 'DEVELOPMENT_MODE' || isDevelopmentMode) {
        console.log('Development mode: Using mock exercise data');
      } else {
        console.error('Error searching exercises:', error);
      }
      return this.getMockExercises();
    }
  }

  async generateWorkout(preferences: {
    type: string;
    muscle: string[];
    difficulty: string;
    duration: number;
  }): Promise<any> {
    try {
      return await this.makeRequest(
        '/fitness/workout/generate',
        {
          method: 'POST',
          body: JSON.stringify(preferences),
        },
        API_KEYS.NINJA
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage === 'DEVELOPMENT_MODE' || isDevelopmentMode) {
        console.log('Development mode: Using mock workout data');
      } else {
        console.error('Error generating workout:', error);
      }
      return this.getMockWorkout();
    }
  }

  // Health/Medical API Methods
  async analyzeBloodwork(data: any): Promise<BloodworkAnalysis[]> {
    try {
      return await this.makeRequest<BloodworkAnalysis[]>(
        '/health/bloodwork/analyze',
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
        API_KEYS.HEALTH_FDA
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage === 'DEVELOPMENT_MODE' || isDevelopmentMode) {
        console.log('Development mode: Using mock bloodwork analysis data');
      } else {
        console.error('Error analyzing bloodwork:', error);
      }
      return this.getMockBloodworkAnalysis();
    }
  }

  async searchSupplements(query: string): Promise<SupplementData[]> {
    try {
      return await this.makeRequest<SupplementData[]>(
        `/health/supplements/search?q=${encodeURIComponent(query)}`,
        { method: 'GET' },
        API_KEYS.HEALTH_FDA
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage === 'DEVELOPMENT_MODE' || isDevelopmentMode) {
        console.log('Development mode: Using mock supplement data for query:', query);
      } else {
        console.error('Error searching supplements:', error);
      }
      return this.getMockSupplements();
    }
  }

  async getSupplementByBarcode(barcode: string): Promise<SupplementData | null> {
    try {
      return await this.makeRequest<SupplementData>(
        `/health/supplements/barcode/${barcode}`,
        { method: 'GET' },
        API_KEYS.HEALTH_FDA
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage === 'DEVELOPMENT_MODE' || isDevelopmentMode) {
        console.log('Development mode: Using mock supplement data for barcode:', barcode);
      } else {
        console.error('Error getting supplement by barcode:', error);
      }
      return this.getMockSupplementByBarcode(barcode);
    }
  }

  // Mock Data Methods (for development/fallback)
  private getMockFoodData(query: string): NutritionData[] {
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
    ];
    
    return mockFoods.filter(food => 
      food.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  private getMockFoodByBarcode(barcode: string): NutritionData | null {
    console.log('Mock barcode lookup fallback triggered for', barcode);
    return null;
  }

  private getMockExercises(): WorkoutData[] {
    return [
      {
        id: '1',
        name: 'Push-ups',
        type: 'strength',
        muscle: ['chest', 'shoulders', 'triceps'],
        equipment: 'body_only',
        difficulty: 'beginner',
        instructions: [
          'Start in a plank position with hands slightly wider than shoulders',
          'Lower your body until chest nearly touches the floor',
          'Push back up to starting position',
          'Repeat for desired reps'
        ],
      },
      {
        id: '2',
        name: 'Squats',
        type: 'strength',
        muscle: ['quadriceps', 'glutes', 'hamstrings'],
        equipment: 'body_only',
        difficulty: 'beginner',
        instructions: [
          'Stand with feet shoulder-width apart',
          'Lower your body as if sitting back into a chair',
          'Keep chest up and knees behind toes',
          'Return to starting position'
        ],
      },
    ];
  }

  private getMockWorkout(): any {
    return {
      id: 'workout-1',
      name: 'Upper Body Strength',
      duration: 45,
      exercises: [
        {
          name: 'Push-ups',
          sets: 3,
          reps: 12,
          rest: 60,
        },
        {
          name: 'Pull-ups',
          sets: 3,
          reps: 8,
          rest: 90,
        },
      ],
    };
  }

  private getMockBloodworkAnalysis(): BloodworkAnalysis[] {
    return [
      {
        id: '1',
        testName: 'Total Cholesterol',
        value: 180,
        unit: 'mg/dL',
        referenceRange: { min: 125, max: 200 },
        status: 'normal',
        recommendations: [
          'Maintain current diet and exercise routine',
          'Continue regular monitoring'
        ],
      },
      {
        id: '2',
        testName: 'Vitamin D',
        value: 25,
        unit: 'ng/mL',
        referenceRange: { min: 30, max: 100 },
        status: 'low',
        recommendations: [
          'Consider vitamin D supplementation',
          'Increase sun exposure',
          'Include vitamin D rich foods in diet'
        ],
      },
    ];
  }

  private getMockSupplements(): SupplementData[] {
    return [
      {
        id: '1',
        name: 'Whey Protein Isolate',
        brand: 'Optimum Nutrition',
        category: 'Protein',
        ingredients: ['Whey Protein Isolate', 'Natural Flavors', 'Lecithin'],
        dosage: '1 scoop (30g) daily',
        benefits: ['Muscle building', 'Recovery', 'High protein content'],
        warnings: ['Contains milk', 'Not suitable for lactose intolerant'],
        price: 49.99,
        rating: 4.8,
        reviews: 1250,
      },
    ];
  }

  private getMockSupplementByBarcode(barcode: string): SupplementData {
    return {
      id: '1',
      name: 'Whey Protein Isolate',
      brand: 'Optimum Nutrition',
      category: 'Protein',
      ingredients: ['Whey Protein Isolate', 'Natural Flavors', 'Lecithin'],
      dosage: '1 scoop (30g) daily',
      benefits: ['Muscle building', 'Recovery', 'High protein content'],
      warnings: ['Contains milk', 'Not suitable for lactose intolerant'],
      price: 49.99,
      rating: 4.8,
      reviews: 1250,
    };
  }

  private getMockMealPlan(): any {
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
      ],
    };
  }
}

export const apiService = new ApiService();
export default apiService;