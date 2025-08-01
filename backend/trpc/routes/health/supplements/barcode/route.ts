import { z } from "zod";
import { publicProcedure } from "../../../../create-context";

interface SupplementData {
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

const getMockSupplementByBarcode = (barcode: string): SupplementData => {
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
};

export default publicProcedure
  .input(z.object({ barcode: z.string() }))
  .query(async ({ input }) => {
    console.log(`💊 Looking up supplement by barcode: ${input.barcode}`);
    
    const result = getMockSupplementByBarcode(input.barcode);
    console.log(`✅ Found supplement: ${result.name}`);
    
    return result;
  });