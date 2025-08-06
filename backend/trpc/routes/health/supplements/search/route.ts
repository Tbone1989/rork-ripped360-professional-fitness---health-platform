import { z } from "zod";
import { publicProcedure } from "../../../../create-context";

const API_KEYS = {
  RIP360_HEALTH_FDA: process.env.EXPO_PUBLIC_RIP360_HEALTH_FDA_API_KEY || '',
  HEALTH_API: process.env.EXPO_PUBLIC_HEALTH_API_KEY || '',
  SUPPLEMENT_API: process.env.EXPO_PUBLIC_SUPPLEMENT_API_KEY || '',
};

const API_ENDPOINTS = {
  RIP360_HEALTH_FDA: process.env.EXPO_PUBLIC_FDA_API_URL || 'https://api.rip360.com/health',
  FDA: 'https://api.fda.gov',
};

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

const searchWithRip360 = async (query: string): Promise<SupplementData[]> => {
  if (!API_KEYS.RIP360_HEALTH_FDA) throw new Error('RIP360_HEALTH_FDA API key not found');
  
  const url = `${API_ENDPOINTS.RIP360_HEALTH_FDA}/supplements/search?q=${encodeURIComponent(query)}`;
  const data = await makeApiRequest(url, {
    'X-API-Key': API_KEYS.RIP360_HEALTH_FDA,
  });
  
  return data.results || data;
};

const searchWithFDA = async (query: string): Promise<SupplementData[]> => {
  // FDA API for dietary supplements
  const url = `${API_ENDPOINTS.FDA}/drug/label.json?search=openfda.product_type:"HUMAN+PRESCRIPTION+DRUG"+AND+${encodeURIComponent(query)}&limit=10`;
  
  try {
    const data = await makeApiRequest(url, {});
    
    return data.results?.map((result: any, index: number) => {
      const product = result.openfda || {};
      const activeIngredients = result.active_ingredient || [];
      
      return {
        id: `fda-${index}`,
        name: product.brand_name?.[0] || product.generic_name?.[0] || 'Unknown Product',
        brand: product.manufacturer_name?.[0] || 'Unknown Brand',
        category: 'Supplement',
        ingredients: activeIngredients.map((ing: string) => ing.split(' ')[0]),
        dosage: result.dosage_and_administration?.[0]?.substring(0, 100) || 'See package instructions',
        benefits: result.indications_and_usage ? [result.indications_and_usage[0].substring(0, 100)] : ['General health support'],
        warnings: result.warnings ? [result.warnings[0].substring(0, 100)] : ['Consult healthcare provider'],
        price: 0, // FDA doesn't provide pricing
        rating: 0,
        reviews: 0,
      };
    }) || [];
  } catch (error) {
    console.warn('FDA API search failed:', error);
    return [];
  }
};

// Enhanced mock data with peptides and supplements from your list
const getMockSupplements = (query: string): SupplementData[] => {
  const allSupplements: SupplementData[] = [
    // Peptides and Advanced Supplements
    {
      id: '1',
      name: 'Semaglutide',
      brand: 'Rip360 Peptides',
      category: 'GLP-1 Peptide',
      ingredients: ['Semaglutide'],
      dosage: '0.25mg weekly, titrate as needed',
      benefits: ['Weight loss', 'Appetite suppression', 'Blood sugar control'],
      warnings: ['Prescription required', 'Monitor for side effects', 'Not for pregnant women'],
      price: 299.99,
      rating: 4.9,
      reviews: 450,
    },
    {
      id: '2',
      name: 'Tirzepatide',
      brand: 'Rip360 Peptides',
      category: 'GLP-1/GIP Peptide',
      ingredients: ['Tirzepatide'],
      dosage: '2.5mg weekly, titrate as needed',
      benefits: ['Superior weight loss', 'Dual hormone action', 'Metabolic improvement'],
      warnings: ['Prescription required', 'Monitor blood sugar', 'Gastrointestinal effects possible'],
      price: 399.99,
      rating: 4.9,
      reviews: 320,
    },
    {
      id: '3',
      name: 'BPC-157',
      brand: 'Rip360 Peptides',
      category: 'Healing Peptide',
      ingredients: ['BPC-157 Acetate'],
      dosage: '250-500mcg daily',
      benefits: ['Tissue repair', 'Gut healing', 'Anti-inflammatory'],
      warnings: ['Research peptide', 'Inject subcutaneously', 'Store refrigerated'],
      price: 89.99,
      rating: 4.7,
      reviews: 680,
    },
    {
      id: '4',
      name: 'TB-500',
      brand: 'Rip360 Peptides',
      category: 'Recovery Peptide',
      ingredients: ['Thymosin Beta-4 Acetate'],
      dosage: '2-5mg twice weekly',
      benefits: ['Muscle recovery', 'Injury healing', 'Flexibility improvement'],
      warnings: ['Research peptide', 'Proper injection technique required'],
      price: 149.99,
      rating: 4.8,
      reviews: 420,
    },
    {
      id: '5',
      name: 'Ipamorelin',
      brand: 'Rip360 Peptides',
      category: 'Growth Hormone Peptide',
      ingredients: ['Ipamorelin'],
      dosage: '200-300mcg before bed',
      benefits: ['Growth hormone release', 'Better sleep', 'Recovery enhancement'],
      warnings: ['Research peptide', 'Cycle usage recommended'],
      price: 119.99,
      rating: 4.6,
      reviews: 550,
    },
    {
      id: '6',
      name: 'CJC-1295 No DAC',
      brand: 'Rip360 Peptides',
      category: 'GHRH Peptide',
      ingredients: ['CJC-1295 without DAC'],
      dosage: '100mcg 2-3x daily',
      benefits: ['Growth hormone release', 'Muscle growth', 'Fat loss'],
      warnings: ['Research peptide', 'Combine with GHRP for best results'],
      price: 99.99,
      rating: 4.5,
      reviews: 380,
    },
    {
      id: '7',
      name: 'Melanotan 2 (MT-2)',
      brand: 'Rip360 Peptides',
      category: 'Tanning Peptide',
      ingredients: ['Melanotan 2 Acetate'],
      dosage: '0.25-1mg daily',
      benefits: ['Skin tanning', 'Appetite suppression', 'Libido enhancement'],
      warnings: ['Research peptide', 'Start with low dose', 'UV protection still needed'],
      price: 79.99,
      rating: 4.4,
      reviews: 720,
    },
    {
      id: '8',
      name: 'NAD+',
      brand: 'Rip360 Peptides',
      category: 'Anti-Aging',
      ingredients: ['Nicotinamide Adenine Dinucleotide'],
      dosage: '250-500mg IV or subcutaneous',
      benefits: ['Cellular repair', 'Energy boost', 'Anti-aging'],
      warnings: ['Professional administration recommended', 'High-quality source essential'],
      price: 199.99,
      rating: 4.8,
      reviews: 290,
    },
    {
      id: '9',
      name: 'Retatrutide',
      brand: 'Rip360 Peptides',
      category: 'Triple Agonist Peptide',
      ingredients: ['Retatrutide'],
      dosage: '2mg weekly, titrate carefully',
      benefits: ['Maximum weight loss', 'Triple hormone action', 'Metabolic optimization'],
      warnings: ['Experimental peptide', 'Professional supervision required', 'Monitor closely'],
      price: 499.99,
      rating: 4.9,
      reviews: 150,
    },
    {
      id: '10',
      name: 'Cagrilintide',
      brand: 'Rip360 Peptides',
      category: 'Amylin Analog',
      ingredients: ['Cagrilintide'],
      dosage: '0.6mg weekly',
      benefits: ['Appetite control', 'Gastric emptying delay', 'Weight management'],
      warnings: ['Research peptide', 'Combine with GLP-1 for synergy', 'Monitor blood sugar'],
      price: 349.99,
      rating: 4.7,
      reviews: 180,
    },
    // Traditional Supplements
    {
      id: '11',
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
      id: '12',
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
  ];
  
  return allSupplements.filter(supplement => 
    supplement.name.toLowerCase().includes(query.toLowerCase()) ||
    supplement.brand.toLowerCase().includes(query.toLowerCase()) ||
    supplement.category.toLowerCase().includes(query.toLowerCase()) ||
    supplement.ingredients.some(ing => ing.toLowerCase().includes(query.toLowerCase()))
  );
};

export default publicProcedure
  .input(z.object({ query: z.string() }))
  .query(async ({ input }) => {
    console.log(`💊 Searching supplements for: ${input.query}`);
    
    // Try APIs in order of preference
    const apiAttempts = [
      { name: 'RIP360', fn: () => searchWithRip360(input.query) },
      { name: 'FDA', fn: () => searchWithFDA(input.query) },
    ];
    
    for (const api of apiAttempts) {
      try {
        console.log(`🔄 Trying ${api.name} API...`);
        const results = await api.fn();
        if (results && results.length > 0) {
          console.log(`✅ ${api.name} API success: Found ${results.length} supplements`);
          return results;
        }
      } catch (error) {
        console.warn(`⚠️ ${api.name} API failed:`, error instanceof Error ? error.message : 'Unknown error');
        continue;
      }
    }
    
    // Fallback to enhanced mock data
    console.log('🔄 All APIs failed, using enhanced mock data');
    const results = getMockSupplements(input.query);
    console.log(`✅ Enhanced mock data: Found ${results.length} supplements`);
    
    return results;
  });