export interface GroceryItem {
  id: string;
  name: string;
  brand?: string;
  category: GroceryCategory;
  description?: string;
  image?: string;
  nutrition?: NutritionInfo;
  barcode?: string;
  tags: string[];
}

export interface GroceryPrice {
  id: string;
  itemId: string;
  storeId: string;
  price: number;
  unit: string; // 'lb', 'kg', 'each', 'oz', etc.
  size: string; // '1 lb', '16 oz', etc.
  salePrice?: number;
  saleEndDate?: string;
  inStock: boolean;
  lastUpdated: string;
}

export interface GroceryStore {
  id: string;
  name: string;
  chain: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  website?: string;
  logo?: string;
  distance?: number; // in miles
  coordinates: {
    latitude: number;
    longitude: number;
  };
  hours: StoreHours[];
  features: string[]; // 'organic', 'pharmacy', 'deli', etc.
  permanentlyClosed?: boolean;
}

export interface StoreHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export type GroceryCategory = 
  | 'produce'
  | 'meat'
  | 'dairy'
  | 'bakery'
  | 'pantry'
  | 'frozen'
  | 'beverages'
  | 'snacks'
  | 'health'
  | 'personal-care'
  | 'household';

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: string;
}

export interface PriceComparison {
  item: GroceryItem;
  prices: (GroceryPrice & { store: GroceryStore })[];
  lowestPrice: GroceryPrice & { store: GroceryStore };
  averagePrice: number;
  savings: number; // potential savings vs average
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingListItem[];
  totalEstimatedCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListItem {
  id: string;
  itemId: string;
  item: GroceryItem;
  quantity: number;
  unit: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  purchased: boolean;
  selectedStore?: string;
  estimatedPrice?: number;
}

export interface PriceAlert {
  id: string;
  itemId: string;
  item: GroceryItem;
  targetPrice: number;
  currentPrice: number;
  storeId?: string;
  active: boolean;
  createdAt: string;
}

export interface GrocerySearchFilters {
  category?: GroceryCategory;
  maxDistance?: number;
  onSale?: boolean;
  inStock?: boolean;
  stores?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy?: 'price' | 'distance' | 'name' | 'rating';
}