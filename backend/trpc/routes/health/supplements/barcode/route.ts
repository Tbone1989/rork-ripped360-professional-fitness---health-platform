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

const API_KEYS = {
  RIP360_HEALTH_FDA: process.env.EXPO_PUBLIC_RIP360_HEALTH_FDA_API_KEY ?? '',
};

const API_ENDPOINTS = {
  RIP360_HEALTH_FDA: process.env.EXPO_PUBLIC_FDA_API_URL ?? 'https://api.rip360.com/health',
  FDA: 'https://api.fda.gov',
};

const getMockSupplementByBarcode = (barcode: string): SupplementData => {
  return {
    id: 'mock-1',
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
  const data = await response.json();
  console.log('✅ API Success for supplement barcode');
  return data;
};

const fetchWithRip360 = async (barcode: string): Promise<SupplementData> => {
  if (!API_KEYS.RIP360_HEALTH_FDA) throw new Error('RIP360_HEALTH_FDA API key not found');
  const url = `${API_ENDPOINTS.RIP360_HEALTH_FDA}/supplements/barcode/${encodeURIComponent(barcode)}`;
  const data = await makeApiRequest(url, { 'X-API-Key': API_KEYS.RIP360_HEALTH_FDA });
  const result = (data?.result ?? data) as any;
  return {
    id: String(result.id ?? barcode),
    name: String(result.name ?? 'Unknown Supplement'),
    brand: String(result.brand ?? result.manufacturer ?? 'Unknown Brand'),
    category: String(result.category ?? 'Supplement'),
    ingredients: Array.isArray(result.ingredients) ? result.ingredients.map((i: any) => String(i)) : [],
    dosage: String(result.dosage ?? 'See label'),
    benefits: Array.isArray(result.benefits) ? result.benefits.map((b: any) => String(b)) : [],
    warnings: Array.isArray(result.warnings) ? result.warnings.map((w: any) => String(w)) : [],
    price: Number(result.price ?? 0),
    rating: Number(result.rating ?? 0),
    reviews: Number(result.reviews ?? 0),
  };
};

const fetchWithFDA = async (barcode: string): Promise<SupplementData> => {
  const queries = [
    `drug/label.json?search=openfda.upc:${encodeURIComponent(barcode)}&limit=1`,
    `drug/ndc.json?search=package_ndc:${encodeURIComponent(barcode)}&limit=1`,
    `food/enforcement.json?search=product_code:${encodeURIComponent(barcode)}&limit=1`,
  ];

  for (const path of queries) {
    try {
      const url = `${API_ENDPOINTS.FDA}/${path}`;
      const data = await makeApiRequest(url, {});
      const result = data?.results?.[0];
      if (result) {
        const openfda = result.openfda ?? {};
        const activeIngredients = result.active_ingredient ?? [];
        return {
          id: String(openfda.spl_id?.[0] ?? barcode),
          name: String(openfda.brand_name?.[0] ?? result.product_description ?? 'Unknown Supplement'),
          brand: String(openfda.manufacturer_name?.[0] ?? result.firm_fei_number ?? 'Unknown Brand'),
          category: 'Supplement',
          ingredients: activeIngredients.map((i: any) => String(i).split(' ')[0]),
          dosage: result.dosage_and_administration?.[0] ?? 'See package instructions',
          benefits: result.indications_and_usage ? [String(result.indications_and_usage[0]).substring(0, 140)] : ['General health support'],
          warnings: result.warnings ? [String(result.warnings[0]).substring(0, 140)] : ['Consult healthcare provider'],
          price: 0,
          rating: 0,
          reviews: 0,
        };
      }
    } catch (err) {
      console.warn('FDA path failed:', err instanceof Error ? err.message : 'Unknown error');
      continue;
    }
  }
  throw new Error('No FDA data found');
};

export default publicProcedure
  .input(z.object({ barcode: z.string() }))
  .query(async ({ input }) => {
    console.log(`💊 Looking up supplement by barcode: ${input.barcode}`);

    const attempts = [
      { name: 'RIP360', fn: () => fetchWithRip360(input.barcode) },
      { name: 'FDA', fn: () => fetchWithFDA(input.barcode) },
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

    const result = getMockSupplementByBarcode(input.barcode);
    console.log(`✅ Mock fallback: ${result.name}`);
    return result;
  });