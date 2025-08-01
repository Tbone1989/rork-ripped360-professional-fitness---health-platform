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

const getMockSupplements = (): SupplementData[] => {
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
    {
      id: '2',
      name: 'Creatine Monohydrate',
      brand: 'MuscleTech',
      category: 'Performance',
      ingredients: ['Creatine Monohydrate'],
      dosage: '5g daily',
      benefits: ['Increased strength', 'Enhanced performance', 'Muscle growth'],
      warnings: ['Drink plenty of water', 'May cause stomach upset if taken on empty stomach'],
      price: 24.99,
      rating: 4.7,
      reviews: 890,
    },
    {
      id: '3',
      name: 'Multivitamin',
      brand: 'Centrum',
      category: 'Vitamins',
      ingredients: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'B-Complex', 'Iron', 'Calcium'],
      dosage: '1 tablet daily with food',
      benefits: ['Overall health', 'Immune support', 'Energy metabolism'],
      warnings: ['Do not exceed recommended dose', 'Keep away from children'],
      price: 19.99,
      rating: 4.5,
      reviews: 2100,
    },
  ];
};

export default publicProcedure
  .input(z.object({ query: z.string() }))
  .query(async ({ input }) => {
    console.log(`💊 Searching supplements for: ${input.query}`);
    
    const supplements = getMockSupplements();
    const filtered = supplements.filter(supplement => 
      supplement.name.toLowerCase().includes(input.query.toLowerCase()) ||
      supplement.brand.toLowerCase().includes(input.query.toLowerCase()) ||
      supplement.category.toLowerCase().includes(input.query.toLowerCase())
    );
    
    console.log(`✅ Found ${filtered.length} supplements`);
    return filtered;
  });