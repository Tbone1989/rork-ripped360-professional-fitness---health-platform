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

const getMockFoodByBarcode = (barcode: string): NutritionData => {
  return {
    name: 'Organic Greek Yogurt',
    brand: 'Chobani',
    calories: 100,
    protein: 18,
    carbs: 6,
    fat: 0,
    fiber: 0,
    sugar: 4,
    sodium: 65,
    servingSize: '170g',
    barcode,
  };
};

export default publicProcedure
  .input(z.object({ barcode: z.string() }))
  .query(async ({ input }) => {
    console.log(`🔍 Looking up food by barcode: ${input.barcode}`);
    
    const result = getMockFoodByBarcode(input.barcode);
    console.log(`✅ Found food: ${result.name}`);
    
    return result;
  });