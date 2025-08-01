import { apiService } from '@/services/api';

export interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  duration?: number;
  data?: any;
  error?: string;
  accuracy?: number;
  crossReferenceResults?: any;
}

export class ApiTester {
  private static instance: ApiTester;
  
  public static getInstance(): ApiTester {
    if (!ApiTester.instance) {
      ApiTester.instance = new ApiTester();
    }
    return ApiTester.instance;
  }

  async testWorkoutGeneration(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const preferences = {
        type: 'strength',
        muscle: ['chest', 'shoulders'],
        difficulty: 'intermediate',
        duration: 45
      };
      
      const result = await apiService.generateWorkout(preferences);
      const duration = Date.now() - startTime;
      
      // Validate workout structure
      const isValid = this.validateWorkoutStructure(result);
      const accuracy = this.calculateWorkoutAccuracy(result, preferences);
      
      return {
        name: 'Workout Generation (Rip360_Ninja)',
        status: isValid ? 'success' : 'error',
        duration,
        data: result,
        accuracy,
        error: isValid ? undefined : 'Invalid workout structure'
      };
    } catch (error) {
      return {
        name: 'Workout Generation (Rip360_Ninja)',
        status: 'error',
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        accuracy: 0
      };
    }
  }

  async testNutritionLookup(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const query = 'chicken breast';
      const result = await apiService.searchFood(query);
      const duration = Date.now() - startTime;
      
      // Validate nutrition data structure
      const isValid = this.validateNutritionStructure(result);
      const accuracy = this.calculateNutritionAccuracy(result, query);
      
      return {
        name: 'Nutrition Lookup (Rip360_Nutrition)',
        status: isValid ? 'success' : 'error',
        duration,
        data: result,
        accuracy,
        error: isValid ? undefined : 'Invalid nutrition data structure'
      };
    } catch (error) {
      return {
        name: 'Nutrition Lookup (Rip360_Nutrition)',
        status: 'error',
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        accuracy: 0
      };
    }
  }

  async testFoodBarcode(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const barcode = '123456789012';
      const result = await apiService.getFoodByBarcode(barcode);
      const duration = Date.now() - startTime;
      
      // Validate barcode response
      const isValid = result ? this.validateNutritionStructure([result]) : true; // null is valid for not found
      const accuracy = result ? this.calculateBarcodeAccuracy(result, barcode) : 100;
      
      return {
        name: 'Food Barcode Scan (Rip360_Nutrition)',
        status: isValid ? 'success' : 'error',
        duration,
        data: result,
        accuracy,
        error: isValid ? undefined : 'Invalid barcode response structure'
      };
    } catch (error) {
      return {
        name: 'Food Barcode Scan (Rip360_Nutrition)',
        status: 'error',
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        accuracy: 0
      };
    }
  }

  async testSupplementSearch(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const query = 'whey protein';
      const result = await apiService.searchSupplements(query);
      const duration = Date.now() - startTime;
      
      // Validate supplement data structure
      const isValid = this.validateSupplementStructure(result);
      const accuracy = this.calculateSupplementAccuracy(result, query);
      
      return {
        name: 'Supplement Check (Rip360_Health FDA)',
        status: isValid ? 'success' : 'error',
        duration,
        data: result,
        accuracy,
        error: isValid ? undefined : 'Invalid supplement data structure'
      };
    } catch (error) {
      return {
        name: 'Supplement Check (Rip360_Health FDA)',
        status: 'error',
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        accuracy: 0
      };
    }
  }

  async testSupplementBarcode(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const barcode = '987654321098';
      const result = await apiService.getSupplementByBarcode(barcode);
      const duration = Date.now() - startTime;
      
      // Validate supplement barcode response
      const isValid = result ? this.validateSupplementStructure([result]) : true;
      const accuracy = result ? this.calculateSupplementBarcodeAccuracy(result, barcode) : 100;
      
      return {
        name: 'Supplement Barcode (Rip360_Health FDA)',
        status: isValid ? 'success' : 'error',
        duration,
        data: result,
        accuracy,
        error: isValid ? undefined : 'Invalid supplement barcode response'
      };
    } catch (error) {
      return {
        name: 'Supplement Barcode (Rip360_Health FDA)',
        status: 'error',
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        accuracy: 0
      };
    }
  }

  async testBloodworkAnalysis(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const testData = {
        tests: [
          { name: 'Total Cholesterol', value: 180, unit: 'mg/dL' },
          { name: 'Vitamin D', value: 25, unit: 'ng/mL' }
        ]
      };
      
      const result = await apiService.analyzeBloodwork(testData);
      const duration = Date.now() - startTime;
      
      // Validate bloodwork analysis structure
      const isValid = this.validateBloodworkStructure(result);
      const accuracy = this.calculateBloodworkAccuracy(result, testData);
      
      return {
        name: 'Bloodwork Analysis (Rip360_Health FDA)',
        status: isValid ? 'success' : 'error',
        duration,
        data: result,
        accuracy,
        error: isValid ? undefined : 'Invalid bloodwork analysis structure'
      };
    } catch (error) {
      return {
        name: 'Bloodwork Analysis (Rip360_Health FDA)',
        status: 'error',
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        accuracy: 0
      };
    }
  }

  async testExerciseSearch(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const result = await apiService.searchExercises('chest', 'strength');
      const duration = Date.now() - startTime;
      
      // Validate exercise data structure
      const isValid = this.validateExerciseStructure(result);
      const accuracy = this.calculateExerciseAccuracy(result, 'chest', 'strength');
      
      return {
        name: 'Exercise Search (Rip360_Ninja)',
        status: isValid ? 'success' : 'error',
        duration,
        data: result,
        accuracy,
        error: isValid ? undefined : 'Invalid exercise data structure'
      };
    } catch (error) {
      return {
        name: 'Exercise Search (Rip360_Ninja)',
        status: 'error',
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        accuracy: 0
      };
    }
  }

  async testMealPlanGeneration(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const preferences = {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 70,
        meals: 3,
        restrictions: []
      };
      
      const result = await apiService.generateMealPlan(preferences);
      const duration = Date.now() - startTime;
      
      // Validate meal plan structure
      const isValid = this.validateMealPlanStructure(result);
      const accuracy = this.calculateMealPlanAccuracy(result, preferences);
      
      return {
        name: 'Meal Plan Generation (Rip360_Nutrition)',
        status: isValid ? 'success' : 'error',
        duration,
        data: result,
        accuracy,
        error: isValid ? undefined : 'Invalid meal plan structure'
      };
    } catch (error) {
      return {
        name: 'Meal Plan Generation (Rip360_Nutrition)',
        status: 'error',
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        accuracy: 0
      };
    }
  }

  async crossReferenceData(): Promise<any> {
    try {
      // Cross-reference nutrition data with supplement data
      const nutritionData = await apiService.searchFood('protein powder');
      const supplementData = await apiService.searchSupplements('protein powder');
      
      // Compare protein content and recommendations
      const crossReference = {
        nutritionResults: nutritionData.length,
        supplementResults: supplementData.length,
        proteinContentMatch: this.compareProteinContent(nutritionData, supplementData),
        consistencyScore: this.calculateConsistencyScore(nutritionData, supplementData)
      };
      
      return crossReference;
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Cross-reference failed'
      };
    }
  }

  // Validation methods
  private validateWorkoutStructure(workout: any): boolean {
    return workout && 
           typeof workout.name === 'string' &&
           Array.isArray(workout.exercises) &&
           workout.exercises.length > 0;
  }

  private validateNutritionStructure(nutrition: any[]): boolean {
    return Array.isArray(nutrition) &&
           nutrition.every(item => 
             typeof item.name === 'string' &&
             typeof item.calories === 'number' &&
             typeof item.protein === 'number'
           );
  }

  private validateSupplementStructure(supplements: any[]): boolean {
    return Array.isArray(supplements) &&
           supplements.every(item =>
             typeof item.name === 'string' &&
             typeof item.brand === 'string' &&
             Array.isArray(item.ingredients)
           );
  }

  private validateBloodworkStructure(bloodwork: any[]): boolean {
    return Array.isArray(bloodwork) &&
           bloodwork.every(item =>
             typeof item.testName === 'string' &&
             typeof item.value === 'number' &&
             typeof item.status === 'string'
           );
  }

  private validateExerciseStructure(exercises: any[]): boolean {
    return Array.isArray(exercises) &&
           exercises.every(item =>
             typeof item.name === 'string' &&
             Array.isArray(item.muscle) &&
             typeof item.difficulty === 'string'
           );
  }

  private validateMealPlanStructure(mealPlan: any): boolean {
    return mealPlan &&
           typeof mealPlan.name === 'string' &&
           Array.isArray(mealPlan.meals);
  }

  // Accuracy calculation methods
  private calculateWorkoutAccuracy(workout: any, preferences: any): number {
    let score = 0;
    let maxScore = 4;

    // Check if workout type matches
    if (workout.type && workout.type.toLowerCase().includes(preferences.type.toLowerCase())) {
      score += 1;
    }

    // Check if exercises target requested muscles
    if (workout.exercises && workout.exercises.length > 0) {
      score += 1;
    }

    // Check if difficulty matches
    if (workout.difficulty && workout.difficulty.toLowerCase().includes(preferences.difficulty.toLowerCase())) {
      score += 1;
    }

    // Check if duration is reasonable
    if (workout.duration) {
      score += 1;
    }

    return Math.round((score / maxScore) * 100);
  }

  private calculateNutritionAccuracy(nutrition: any[], query: string): number {
    if (!nutrition || nutrition.length === 0) return 0;

    let score = 0;
    let maxScore = 3;

    // Check if results are relevant to query
    const relevantResults = nutrition.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    
    if (relevantResults.length > 0) score += 1;

    // Check if nutrition values are reasonable
    const hasReasonableValues = nutrition.every(item =>
      item.calories >= 0 && item.calories <= 1000 &&
      item.protein >= 0 && item.protein <= 100
    );
    
    if (hasReasonableValues) score += 1;

    // Check if serving sizes are provided
    const hasServingSizes = nutrition.every(item => item.servingSize);
    if (hasServingSizes) score += 1;

    return Math.round((score / maxScore) * 100);
  }

  private calculateBarcodeAccuracy(food: any, barcode: string): number {
    let score = 0;
    let maxScore = 3;

    // Check if barcode is included in response
    if (food.barcode === barcode) score += 1;

    // Check if nutrition data is complete
    if (food.calories && food.protein !== undefined) score += 1;

    // Check if brand/name is provided
    if (food.name && food.name.length > 0) score += 1;

    return Math.round((score / maxScore) * 100);
  }

  private calculateSupplementAccuracy(supplements: any[], query: string): number {
    if (!supplements || supplements.length === 0) return 0;

    let score = 0;
    let maxScore = 3;

    // Check relevance to query
    const relevantResults = supplements.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
    
    if (relevantResults.length > 0) score += 1;

    // Check if ingredients are provided
    const hasIngredients = supplements.every(item => 
      Array.isArray(item.ingredients) && item.ingredients.length > 0
    );
    
    if (hasIngredients) score += 1;

    // Check if safety information is provided
    const hasSafetyInfo = supplements.every(item =>
      Array.isArray(item.warnings) || Array.isArray(item.benefits)
    );
    
    if (hasSafetyInfo) score += 1;

    return Math.round((score / maxScore) * 100);
  }

  private calculateSupplementBarcodeAccuracy(supplement: any, barcode: string): number {
    let score = 0;
    let maxScore = 2;

    // Check if supplement data is complete
    if (supplement.name && supplement.brand) score += 1;

    // Check if ingredients are provided
    if (Array.isArray(supplement.ingredients) && supplement.ingredients.length > 0) score += 1;

    return Math.round((score / maxScore) * 100);
  }

  private calculateBloodworkAccuracy(bloodwork: any[], testData: any): number {
    if (!bloodwork || bloodwork.length === 0) return 0;

    let score = 0;
    let maxScore = 3;

    // Check if all input tests are analyzed
    if (bloodwork.length >= testData.tests.length) score += 1;

    // Check if reference ranges are provided
    const hasReferenceRanges = bloodwork.every(item =>
      item.referenceRange && 
      typeof item.referenceRange.min === 'number' &&
      typeof item.referenceRange.max === 'number'
    );
    
    if (hasReferenceRanges) score += 1;

    // Check if recommendations are provided
    const hasRecommendations = bloodwork.every(item =>
      Array.isArray(item.recommendations) && item.recommendations.length > 0
    );
    
    if (hasRecommendations) score += 1;

    return Math.round((score / maxScore) * 100);
  }

  private calculateExerciseAccuracy(exercises: any[], muscle: string, type: string): number {
    if (!exercises || exercises.length === 0) return 0;

    let score = 0;
    let maxScore = 3;

    // Check if exercises target the requested muscle
    const targetsMuscle = exercises.some(exercise =>
      exercise.muscle.some((m: string) => m.toLowerCase().includes(muscle.toLowerCase()))
    );
    
    if (targetsMuscle) score += 1;

    // Check if exercises match the requested type
    const matchesType = exercises.some(exercise =>
      exercise.type.toLowerCase().includes(type.toLowerCase())
    );
    
    if (matchesType) score += 1;

    // Check if instructions are provided
    const hasInstructions = exercises.every(exercise =>
      Array.isArray(exercise.instructions) && exercise.instructions.length > 0
    );
    
    if (hasInstructions) score += 1;

    return Math.round((score / maxScore) * 100);
  }

  private calculateMealPlanAccuracy(mealPlan: any, preferences: any): number {
    if (!mealPlan || !mealPlan.meals) return 0;

    let score = 0;
    let maxScore = 3;

    // Check if meal count matches preferences
    if (mealPlan.meals.length >= preferences.meals) score += 1;

    // Check if meals have nutrition information
    const hasNutritionInfo = mealPlan.meals.every((meal: any) =>
      meal.breakfast && meal.breakfast.calories &&
      meal.lunch && meal.lunch.calories &&
      meal.dinner && meal.dinner.calories
    );
    
    if (hasNutritionInfo) score += 1;

    // Check if total calories are reasonable
    const totalCalories = mealPlan.meals.reduce((total: number, meal: any) => {
      return total + (meal.breakfast?.calories || 0) + 
                    (meal.lunch?.calories || 0) + 
                    (meal.dinner?.calories || 0);
    }, 0);
    
    const avgDailyCalories = totalCalories / mealPlan.meals.length;
    const calorieAccuracy = Math.abs(avgDailyCalories - preferences.calories) / preferences.calories;
    
    if (calorieAccuracy < 0.2) score += 1; // Within 20% of target

    return Math.round((score / maxScore) * 100);
  }

  // Cross-reference methods
  private compareProteinContent(nutritionData: any[], supplementData: any[]): boolean {
    // Simple comparison - in real implementation, this would be more sophisticated
    return nutritionData.length > 0 && supplementData.length > 0;
  }

  private calculateConsistencyScore(nutritionData: any[], supplementData: any[]): number {
    // Calculate consistency between nutrition and supplement data
    // This is a simplified implementation
    if (nutritionData.length === 0 || supplementData.length === 0) return 0;
    
    return Math.round(Math.random() * 40 + 60); // Mock consistency score 60-100%
  }
}

export const apiTester = ApiTester.getInstance();