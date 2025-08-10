import { GroceryItem, GroceryStore, GroceryPrice, PriceComparison } from '@/types/grocery';

export const mockGroceryStores: GroceryStore[] = [
  {
    id: '1',
    name: 'Walmart Supercenter',
    chain: 'Walmart',
    address: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    phone: '(555) 123-4567',
    logo: 'https://logos-world.net/wp-content/uploads/2020/09/Walmart-Logo.png',
    distance: 0.8,
    coordinates: { latitude: 39.7817, longitude: -89.6501 },
    hours: [
      { day: 'Monday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Tuesday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Wednesday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Thursday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Friday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Saturday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Sunday', open: '6:00 AM', close: '11:00 PM' }
    ],
    features: ['pharmacy', 'grocery', 'electronics', 'clothing']
  },
  {
    id: '2',
    name: 'Kroger',
    chain: 'Kroger',
    address: '456 Oak Ave',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62702',
    phone: '(555) 234-5678',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Kroger-Logo.png',
    distance: 1.2,
    coordinates: { latitude: 39.7901, longitude: -89.6440 },
    hours: [
      { day: 'Monday', open: '6:00 AM', close: '12:00 AM' },
      { day: 'Tuesday', open: '6:00 AM', close: '12:00 AM' },
      { day: 'Wednesday', open: '6:00 AM', close: '12:00 AM' },
      { day: 'Thursday', open: '6:00 AM', close: '12:00 AM' },
      { day: 'Friday', open: '6:00 AM', close: '12:00 AM' },
      { day: 'Saturday', open: '6:00 AM', close: '12:00 AM' },
      { day: 'Sunday', open: '6:00 AM', close: '12:00 AM' }
    ],
    features: ['pharmacy', 'deli', 'bakery', 'organic']
  },
  {
    id: '3',
    name: 'Target',
    chain: 'Target',
    address: '789 Elm St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62703',
    phone: '(555) 345-6789',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Target-Logo.png',
    distance: 1.5,
    coordinates: { latitude: 39.7756, longitude: -89.6370 },
    hours: [
      { day: 'Monday', open: '8:00 AM', close: '10:00 PM' },
      { day: 'Tuesday', open: '8:00 AM', close: '10:00 PM' },
      { day: 'Wednesday', open: '8:00 AM', close: '10:00 PM' },
      { day: 'Thursday', open: '8:00 AM', close: '10:00 PM' },
      { day: 'Friday', open: '8:00 AM', close: '10:00 PM' },
      { day: 'Saturday', open: '8:00 AM', close: '10:00 PM' },
      { day: 'Sunday', open: '8:00 AM', close: '9:00 PM' }
    ],
    features: ['pharmacy', 'clothing', 'electronics', 'home']
  },
  {
    id: '4',
    name: 'Whole Foods Market',
    chain: 'Whole Foods',
    address: '321 Pine St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62704',
    phone: '(555) 456-7890',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Whole-Foods-Market-Logo.png',
    distance: 2.1,
    coordinates: { latitude: 39.7990, longitude: -89.6200 },
    hours: [
      { day: 'Monday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Tuesday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Wednesday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Thursday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Friday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Saturday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Sunday', open: '7:00 AM', close: '9:00 PM' }
    ],
    features: ['organic', 'deli', 'bakery', 'prepared-foods']
  },
  {
    id: '5',
    name: 'ALDI',
    chain: 'ALDI',
    address: '654 Maple Dr',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62705',
    phone: '(555) 567-8901',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Aldi-Logo.png',
    distance: 2.8,
    coordinates: { latitude: 39.7650, longitude: -89.6100 },
    hours: [
      { day: 'Monday', open: '9:00 AM', close: '8:00 PM' },
      { day: 'Tuesday', open: '9:00 AM', close: '8:00 PM' },
      { day: 'Wednesday', open: '9:00 AM', close: '8:00 PM' },
      { day: 'Thursday', open: '9:00 AM', close: '8:00 PM' },
      { day: 'Friday', open: '9:00 AM', close: '8:00 PM' },
      { day: 'Saturday', open: '9:00 AM', close: '8:00 PM' },
      { day: 'Sunday', open: '9:00 AM', close: '8:00 PM' }
    ],
    features: ['discount', 'organic', 'special-buys']
  },
  // Chicago stores
  {
    id: '6',
    name: 'Jewel-Osco',
    chain: 'Jewel-Osco',
    address: '100 N State St',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    phone: '(312) 555-0100',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Jewel-Osco-Logo.png',
    distance: 3.2,
    coordinates: { latitude: 41.8781, longitude: -87.6298 },
    hours: [
      { day: 'Monday', open: '6:00 AM', close: '12:00 AM' },
      { day: 'Tuesday', open: '6:00 AM', close: '12:00 AM' },
      { day: 'Wednesday', open: '6:00 AM', close: '12:00 AM' },
      { day: 'Thursday', open: '6:00 AM', close: '12:00 AM' },
      { day: 'Friday', open: '6:00 AM', close: '12:00 AM' },
      { day: 'Saturday', open: '6:00 AM', close: '12:00 AM' },
      { day: 'Sunday', open: '6:00 AM', close: '11:00 PM' }
    ],
    features: ['pharmacy', 'deli', 'bakery', 'floral']
  },
  {
    id: '7',
    name: 'Mariano\'s',
    chain: 'Mariano\'s',
    address: '40 S State St',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60603',
    phone: '(312) 555-0200',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Marianos-Logo.png',
    distance: 3.5,
    coordinates: { latitude: 41.8819, longitude: -87.6278 },
    hours: [
      { day: 'Monday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Tuesday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Wednesday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Thursday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Friday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Saturday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Sunday', open: '6:00 AM', close: '10:00 PM' }
    ],
    features: ['pharmacy', 'deli', 'bakery', 'sushi', 'prepared-foods']
  },
  // Peoria stores
  {
    id: '8',
    name: 'Hy-Vee',
    chain: 'Hy-Vee',
    address: '2900 W Lake Ave',
    city: 'Peoria',
    state: 'IL',
    zipCode: '61602',
    phone: '(309) 555-0300',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Hy-Vee-Logo.png',
    distance: 4.1,
    coordinates: { latitude: 40.6936, longitude: -89.5890 },
    hours: [
      { day: 'Monday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Tuesday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Wednesday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Thursday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Friday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Saturday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Sunday', open: '6:00 AM', close: '10:00 PM' }
    ],
    features: ['pharmacy', 'deli', 'bakery', 'floral', 'fuel']
  },
  // South Florida stores
  {
    id: '9',
    name: 'Publix Super Market',
    chain: 'Publix',
    address: '1615 S Federal Hwy',
    city: 'Delray Beach',
    state: 'FL',
    zipCode: '33483',
    phone: '(561) 555-0101',
    logo: 'https://1000logos.net/wp-content/uploads/2020/09/Publix-Logo.png',
    distance: 1.2,
    coordinates: { latitude: 26.4416, longitude: -80.0730 },
    hours: [
      { day: 'Monday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Tuesday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Wednesday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Thursday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Friday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Saturday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Sunday', open: '7:00 AM', close: '9:00 PM' }
    ],
    features: ['pharmacy', 'bakery', 'deli', 'seafood']
  },
  {
    id: '10',
    name: 'Walmart Neighborhood Market',
    chain: 'Walmart',
    address: '16205 S Military Trl',
    city: 'Delray Beach',
    state: 'FL',
    zipCode: '33484',
    phone: '(561) 555-0102',
    logo: 'https://logos-world.net/wp-content/uploads/2020/09/Walmart-Logo.png',
    distance: 3.0,
    coordinates: { latitude: 26.4455, longitude: -80.1350 },
    hours: [
      { day: 'Monday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Tuesday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Wednesday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Thursday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Friday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Saturday', open: '6:00 AM', close: '11:00 PM' },
      { day: 'Sunday', open: '6:00 AM', close: '11:00 PM' }
    ],
    features: ['pharmacy', 'grocery']
  },
  {
    id: '11',
    name: 'ALDI',
    chain: 'ALDI',
    address: '14530 S Military Trl',
    city: 'Delray Beach',
    state: 'FL',
    zipCode: '33484',
    phone: '(561) 555-0103',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Aldi-Logo.png',
    distance: 2.6,
    coordinates: { latitude: 26.4552, longitude: -80.1253 },
    hours: [
      { day: 'Monday', open: '9:00 AM', close: '8:00 PM' },
      { day: 'Tuesday', open: '9:00 AM', close: '8:00 PM' },
      { day: 'Wednesday', open: '9:00 AM', close: '8:00 PM' },
      { day: 'Thursday', open: '9:00 AM', close: '8:00 PM' },
      { day: 'Friday', open: '9:00 AM', close: '8:00 PM' },
      { day: 'Saturday', open: '9:00 AM', close: '8:00 PM' },
      { day: 'Sunday', open: '9:00 AM', close: '8:00 PM' }
    ],
    features: ['discount', 'organic']
  },
  // Additional South Florida stores
  {
    id: '12',
    name: 'Trader Joe\'s Boca Raton',
    chain: 'Trader Joe\'s',
    address: '855 S Federal Hwy',
    city: 'Boca Raton',
    state: 'FL',
    zipCode: '33432',
    phone: '(561) 555-0203',
    logo: 'https://1000logos.net/wp-content/uploads/2023/01/Trader-Joes-logo.png',
    distance: 6.5,
    coordinates: { latitude: 26.3398, longitude: -80.0866 },
    hours: [
      { day: 'Monday', open: '8:00 AM', close: '9:00 PM' },
      { day: 'Tuesday', open: '8:00 AM', close: '9:00 PM' },
      { day: 'Wednesday', open: '8:00 AM', close: '9:00 PM' },
      { day: 'Thursday', open: '8:00 AM', close: '9:00 PM' },
      { day: 'Friday', open: '8:00 AM', close: '9:00 PM' },
      { day: 'Saturday', open: '8:00 AM', close: '9:00 PM' },
      { day: 'Sunday', open: '8:00 AM', close: '9:00 PM' }
    ],
    features: ['organic', 'prepared-foods']
  },
  {
    id: '13',
    name: 'The Fresh Market Boca Raton',
    chain: 'The Fresh Market',
    address: '1000 N Federal Hwy',
    city: 'Boca Raton',
    state: 'FL',
    zipCode: '33432',
    phone: '(561) 555-0303',
    logo: 'https://1000logos.net/wp-content/uploads/2022/12/The-Fresh-Market-Logo.png',
    distance: 7.1,
    coordinates: { latitude: 26.365, longitude: -80.074 },
    hours: [
      { day: 'Monday', open: '8:00 AM', close: '9:00 PM' },
      { day: 'Tuesday', open: '8:00 AM', close: '9:00 PM' },
      { day: 'Wednesday', open: '8:00 AM', close: '9:00 PM' },
      { day: 'Thursday', open: '8:00 AM', close: '9:00 PM' },
      { day: 'Friday', open: '8:00 AM', close: '9:00 PM' },
      { day: 'Saturday', open: '8:00 AM', close: '9:00 PM' },
      { day: 'Sunday', open: '8:00 AM', close: '9:00 PM' }
    ],
    features: ['produce', 'seafood', 'butcher']
  },
  {
    id: '14',
    name: 'Winn-Dixie Delray Beach',
    chain: 'Winn-Dixie',
    address: '14595 S Military Trl',
    city: 'Delray Beach',
    state: 'FL',
    zipCode: '33484',
    phone: '(561) 555-0404',
    logo: 'https://1000logos.net/wp-content/uploads/2020/05/Winn-Dixie-logo.png',
    distance: 2.9,
    coordinates: { latitude: 26.4571, longitude: -80.1333 },
    hours: [
      { day: 'Monday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Tuesday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Wednesday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Thursday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Friday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Saturday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Sunday', open: '7:00 AM', close: '10:00 PM' }
    ],
    features: ['pharmacy', 'deli', 'bakery']
  },
  {
    id: '15',
    name: 'Whole Foods Market Boca Raton',
    chain: 'Whole Foods',
    address: '1400 Glades Rd',
    city: 'Boca Raton',
    state: 'FL',
    zipCode: '33431',
    phone: '(561) 555-0505',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Whole-Foods-Market-Logo.png',
    distance: 9.2,
    coordinates: { latitude: 26.3683, longitude: -80.1289 },
    hours: [
      { day: 'Monday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Tuesday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Wednesday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Thursday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Friday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Saturday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Sunday', open: '7:00 AM', close: '9:00 PM' }
    ],
    features: ['organic', 'deli', 'bakery', 'prepared-foods']
  },
  {
    id: '16',
    name: 'Target Boca Raton',
    chain: 'Target',
    address: '21637 State Road 7',
    city: 'Boca Raton',
    state: 'FL',
    zipCode: '33428',
    phone: '(561) 555-0606',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Target-Logo.png',
    distance: 11.0,
    coordinates: { latitude: 26.355, longitude: -80.207 },
    hours: [
      { day: 'Monday', open: '8:00 AM', close: '10:00 PM' },
      { day: 'Tuesday', open: '8:00 AM', close: '10:00 PM' },
      { day: 'Wednesday', open: '8:00 AM', close: '10:00 PM' },
      { day: 'Thursday', open: '8:00 AM', close: '10:00 PM' },
      { day: 'Friday', open: '8:00 AM', close: '10:00 PM' },
      { day: 'Saturday', open: '8:00 AM', close: '10:00 PM' },
      { day: 'Sunday', open: '8:00 AM', close: '9:00 PM' }
    ],
    features: ['pharmacy', 'grocery']
  },
  {
    id: '17',
    name: 'Costco Boca Raton',
    chain: 'Costco',
    address: '17800 Congress Ave',
    city: 'Boca Raton',
    state: 'FL',
    zipCode: '33487',
    phone: '(561) 555-0707',
    logo: 'https://1000logos.net/wp-content/uploads/2017/05/Costco-logo.png',
    distance: 8.3,
    coordinates: { latitude: 26.4003, longitude: -80.0967 },
    hours: [
      { day: 'Monday', open: '10:00 AM', close: '8:30 PM' },
      { day: 'Tuesday', open: '10:00 AM', close: '8:30 PM' },
      { day: 'Wednesday', open: '10:00 AM', close: '8:30 PM' },
      { day: 'Thursday', open: '10:00 AM', close: '8:30 PM' },
      { day: 'Friday', open: '10:00 AM', close: '8:30 PM' },
      { day: 'Saturday', open: '9:30 AM', close: '6:00 PM' },
      { day: 'Sunday', open: '10:00 AM', close: '6:00 PM' }
    ],
    features: ['wholesale', 'pharmacy']
  },
  {
    id: '18',
    name: 'Sprouts Farmers Market Boca Raton',
    chain: 'Sprouts',
    address: '22100 S State Road 7',
    city: 'Boca Raton',
    state: 'FL',
    zipCode: '33428',
    phone: '(561) 555-0808',
    logo: 'https://1000logos.net/wp-content/uploads/2021/05/Sprouts-Logo.png',
    distance: 10.6,
    coordinates: { latitude: 26.348, longitude: -80.2078 },
    hours: [
      { day: 'Monday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Tuesday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Wednesday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Thursday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Friday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Saturday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Sunday', open: '7:00 AM', close: '9:00 PM' }
    ],
    features: ['organic', 'bulk']
  },
  {
    id: '19',
    name: 'Aldi Boca Raton',
    chain: 'ALDI',
    address: '21759 State Road 7',
    city: 'Boca Raton',
    state: 'FL',
    zipCode: '33428',
    phone: '(561) 555-0909',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Aldi-Logo.png',
    distance: 10.9,
    coordinates: { latitude: 26.3555, longitude: -80.2064 },
    hours: [
      { day: 'Monday', open: '9:00 AM', close: '8:00 PM' },
      { day: 'Tuesday', open: '9:00 AM', close: '8:00 PM' },
      { day: 'Wednesday', open: '9:00 AM', close: '8:00 PM' },
      { day: 'Thursday', open: '9:00 AM', close: '8:00 PM' },
      { day: 'Friday', open: '9:00 AM', close: '8:00 PM' },
      { day: 'Saturday', open: '9:00 AM', close: '8:00 PM' },
      { day: 'Sunday', open: '9:00 AM', close: '8:00 PM' }
    ],
    features: ['discount']
  },
  {
    id: '20',
    name: 'Publix Super Market at Linton Commons',
    chain: 'Publix',
    address: '4801 Linton Blvd',
    city: 'Delray Beach',
    state: 'FL',
    zipCode: '33445',
    phone: '(561) 555-1010',
    logo: 'https://1000logos.net/wp-content/uploads/2020/09/Publix-Logo.png',
    distance: 3.4,
    coordinates: { latitude: 26.4385, longitude: -80.1158 },
    hours: [
      { day: 'Monday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Tuesday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Wednesday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Thursday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Friday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Saturday', open: '7:00 AM', close: '10:00 PM' },
      { day: 'Sunday', open: '7:00 AM', close: '9:00 PM' }
    ],
    features: ['pharmacy', 'bakery', 'deli']
  }
];

export const mockGroceryItems: GroceryItem[] = [
  {
    id: '1',
    name: 'Bananas',
    category: 'produce',
    description: 'Fresh yellow bananas',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300',
    nutrition: {
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
      fiber: 3.1,
      sugar: 14.4,
      sodium: 1,
      servingSize: '1 medium (118g)'
    },
    tags: ['potassium', 'vitamin-c', 'natural-sugar']
  },
  {
    id: '2',
    name: 'Chicken Breast',
    brand: 'Perdue',
    category: 'meat',
    description: 'Boneless skinless chicken breast',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300',
    nutrition: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      servingSize: '100g'
    },
    tags: ['high-protein', 'lean', 'versatile']
  },
  {
    id: '3',
    name: 'Greek Yogurt',
    brand: 'Chobani',
    category: 'dairy',
    description: 'Plain Greek yogurt, 0% fat',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300',
    nutrition: {
      calories: 100,
      protein: 18,
      carbs: 6,
      fat: 0,
      fiber: 0,
      sugar: 4,
      sodium: 65,
      servingSize: '170g container'
    },
    tags: ['high-protein', 'probiotics', 'low-fat']
  },
  {
    id: '4',
    name: 'Brown Rice',
    brand: 'Uncle Ben\'s',
    category: 'pantry',
    description: 'Whole grain brown rice',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300',
    nutrition: {
      calories: 216,
      protein: 5,
      carbs: 45,
      fat: 1.8,
      fiber: 3.5,
      sugar: 0.7,
      sodium: 10,
      servingSize: '1 cup cooked (195g)'
    },
    tags: ['whole-grain', 'fiber', 'complex-carbs']
  },
  {
    id: '5',
    name: 'Broccoli',
    category: 'produce',
    description: 'Fresh broccoli crowns',
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=300',
    nutrition: {
      calories: 25,
      protein: 3,
      carbs: 5,
      fat: 0.4,
      fiber: 2.3,
      sugar: 1.5,
      sodium: 33,
      servingSize: '1 cup chopped (91g)'
    },
    tags: ['vitamin-c', 'vitamin-k', 'antioxidants']
  },
  {
    id: '6',
    name: 'Salmon Fillet',
    category: 'meat',
    description: 'Fresh Atlantic salmon fillet',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300',
    nutrition: {
      calories: 208,
      protein: 22,
      carbs: 0,
      fat: 12,
      fiber: 0,
      sugar: 0,
      sodium: 59,
      servingSize: '100g'
    },
    tags: ['omega-3', 'high-protein', 'heart-healthy']
  },
  {
    id: '7',
    name: 'Avocado',
    category: 'produce',
    description: 'Hass avocados',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300',
    nutrition: {
      calories: 234,
      protein: 2.9,
      carbs: 12,
      fat: 21,
      fiber: 10,
      sugar: 0.9,
      sodium: 7,
      servingSize: '1 medium (150g)'
    },
    tags: ['healthy-fats', 'fiber', 'potassium']
  },
  {
    id: '8',
    name: 'Oats',
    brand: 'Quaker',
    category: 'pantry',
    description: 'Old fashioned rolled oats',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300',
    nutrition: {
      calories: 150,
      protein: 5,
      carbs: 27,
      fat: 3,
      fiber: 4,
      sugar: 1,
      sodium: 0,
      servingSize: '1/2 cup dry (40g)'
    },
    tags: ['whole-grain', 'fiber', 'heart-healthy']
  }
];

export const mockGroceryPrices: GroceryPrice[] = [
  // Bananas
  { id: '1', itemId: '1', storeId: '1', price: 0.68, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '2', itemId: '1', storeId: '2', price: 0.79, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '3', itemId: '1', storeId: '3', price: 0.89, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '4', itemId: '1', storeId: '4', price: 1.29, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '5', itemId: '1', storeId: '5', price: 0.59, unit: 'lb', size: '1 lb', salePrice: 0.49, saleEndDate: '2024-01-20', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  
  // Chicken Breast
  { id: '6', itemId: '2', storeId: '1', price: 3.98, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '7', itemId: '2', storeId: '2', price: 4.49, unit: 'lb', size: '1 lb', salePrice: 3.99, saleEndDate: '2024-01-18', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '8', itemId: '2', storeId: '3', price: 4.29, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '9', itemId: '2', storeId: '4', price: 6.99, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '10', itemId: '2', storeId: '5', price: 3.79, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  
  // Greek Yogurt
  { id: '11', itemId: '3', storeId: '1', price: 1.28, unit: 'each', size: '170g', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '12', itemId: '3', storeId: '2', price: 1.49, unit: 'each', size: '170g', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '13', itemId: '3', storeId: '3', price: 1.39, unit: 'each', size: '170g', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '14', itemId: '3', storeId: '4', price: 1.79, unit: 'each', size: '170g', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '15', itemId: '3', storeId: '5', price: 1.19, unit: 'each', size: '170g', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  
  // Brown Rice
  { id: '16', itemId: '4', storeId: '1', price: 2.48, unit: 'each', size: '2 lb bag', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '17', itemId: '4', storeId: '2', price: 2.79, unit: 'each', size: '2 lb bag', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '18', itemId: '4', storeId: '3', price: 2.69, unit: 'each', size: '2 lb bag', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '19', itemId: '4', storeId: '4', price: 3.49, unit: 'each', size: '2 lb bag', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '20', itemId: '4', storeId: '5', price: 2.29, unit: 'each', size: '2 lb bag', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  
  // Broccoli
  { id: '21', itemId: '5', storeId: '1', price: 1.98, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '22', itemId: '5', storeId: '2', price: 2.29, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '23', itemId: '5', storeId: '3', price: 2.19, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '24', itemId: '5', storeId: '4', price: 2.99, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '25', itemId: '5', storeId: '5', price: 1.79, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  
  // Salmon
  { id: '26', itemId: '6', storeId: '1', price: 8.98, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '27', itemId: '6', storeId: '2', price: 9.99, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '28', itemId: '6', storeId: '3', price: 9.49, unit: 'lb', size: '1 lb', inStock: false, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '29', itemId: '6', storeId: '4', price: 12.99, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '30', itemId: '6', storeId: '5', price: 8.49, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  
  // Avocado
  { id: '31', itemId: '7', storeId: '1', price: 1.28, unit: 'each', size: '1 each', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '32', itemId: '7', storeId: '2', price: 1.49, unit: 'each', size: '1 each', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '33', itemId: '7', storeId: '3', price: 1.39, unit: 'each', size: '1 each', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '34', itemId: '7', storeId: '4', price: 1.99, unit: 'each', size: '1 each', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '35', itemId: '7', storeId: '5', price: 1.19, unit: 'each', size: '1 each', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  
  // Oats
  { id: '36', itemId: '8', storeId: '1', price: 3.48, unit: 'each', size: '18 oz', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '37', itemId: '8', storeId: '2', price: 3.79, unit: 'each', size: '18 oz', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '38', itemId: '8', storeId: '3', price: 3.69, unit: 'each', size: '18 oz', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '39', itemId: '8', storeId: '4', price: 4.29, unit: 'each', size: '18 oz', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '40', itemId: '8', storeId: '5', price: 3.29, unit: 'each', size: '18 oz', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  // South Florida prices (Publix 9, Walmart NM 10, ALDI 11)
  // Bananas
  { id: '41', itemId: '1', storeId: '9', price: 0.69, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '42', itemId: '1', storeId: '10', price: 0.58, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '43', itemId: '1', storeId: '11', price: 0.49, unit: 'lb', size: '1 lb', salePrice: 0.45, saleEndDate: '2024-01-20', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  // Chicken Breast
  { id: '44', itemId: '2', storeId: '9', price: 4.49, unit: 'lb', size: '1 lb', salePrice: 3.99, saleEndDate: '2024-01-18', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '45', itemId: '2', storeId: '10', price: 3.89, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '46', itemId: '2', storeId: '11', price: 3.69, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  // Greek Yogurt
  { id: '47', itemId: '3', storeId: '9', price: 1.39, unit: 'each', size: '170g', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '48', itemId: '3', storeId: '10', price: 1.19, unit: 'each', size: '170g', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '49', itemId: '3', storeId: '11', price: 1.09, unit: 'each', size: '170g', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  // Brown Rice
  { id: '50', itemId: '4', storeId: '9', price: 2.79, unit: 'each', size: '2 lb bag', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '51', itemId: '4', storeId: '10', price: 2.39, unit: 'each', size: '2 lb bag', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '52', itemId: '4', storeId: '11', price: 2.09, unit: 'each', size: '2 lb bag', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  // Broccoli
  { id: '53', itemId: '5', storeId: '9', price: 2.29, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '54', itemId: '5', storeId: '10', price: 1.98, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '55', itemId: '5', storeId: '11', price: 1.79, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  // Salmon
  { id: '56', itemId: '6', storeId: '9', price: 12.49, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '57', itemId: '6', storeId: '10', price: 9.29, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '58', itemId: '6', storeId: '11', price: 8.99, unit: 'lb', size: '1 lb', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  // Avocado
  { id: '59', itemId: '7', storeId: '9', price: 1.49, unit: 'each', size: '1 each', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '60', itemId: '7', storeId: '10', price: 1.18, unit: 'each', size: '1 each', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '61', itemId: '7', storeId: '11', price: 0.99, unit: 'each', size: '1 each', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  // Oats
  { id: '62', itemId: '8', storeId: '9', price: 3.79, unit: 'each', size: '18 oz', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '63', itemId: '8', storeId: '10', price: 3.39, unit: 'each', size: '18 oz', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' },
  { id: '64', itemId: '8', storeId: '11', price: 3.19, unit: 'each', size: '18 oz', inStock: true, lastUpdated: '2024-01-15T10:00:00Z' }
];

function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  const x = Math.sin(h) * 10000;
  return x - Math.floor(x);
}

function priceRangeForItem(itemId: string): { min: number; max: number } {
  switch (itemId) {
    case '1': return { min: 0.39, max: 0.99 }; // bananas per lb
    case '2': return { min: 3.49, max: 6.99 }; // chicken breast per lb
    case '3': return { min: 0.89, max: 1.99 }; // greek yogurt each
    case '4': return { min: 1.79, max: 3.99 }; // brown rice 2lb
    case '5': return { min: 1.29, max: 3.49 }; // broccoli per lb
    case '6': return { min: 7.99, max: 13.99 }; // salmon per lb
    case '7': return { min: 0.79, max: 1.99 }; // avocado each
    case '8': return { min: 2.99, max: 4.99 }; // oats 18oz
    default: return { min: 1.0, max: 10.0 };
  }
}

export function createPriceComparisons(): PriceComparison[] {
  return mockGroceryItems.map(item => {
    const existing = mockGroceryPrices.filter(price => price.itemId === item.id);
    const withStores = mockGroceryStores.map(store => {
      const found = existing.find(p => p.storeId === store.id);
      if (found) {
        return { ...found, store };
      }
      const rng = seededRandom(`${item.id}-${store.id}`);
      const range = priceRangeForItem(item.id);
      const base = range.min + (range.max - range.min) * rng;
      const sale = rng > 0.85 ? parseFloat((base * 0.85).toFixed(2)) : undefined;
      return {
        id: `${item.id}-${store.id}-gen`,
        itemId: item.id,
        storeId: store.id,
        price: parseFloat(base.toFixed(2)),
        salePrice: sale,
        unit: existing[0]?.unit || 'each',
        size: existing[0]?.size || '1 each',
        inStock: rng > 0.1,
        lastUpdated: new Date().toISOString(),
        store,
      } as any;
    });

    const itemPrices = withStores.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    const prices = itemPrices.map(p => p.salePrice || p.price);
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const lowestPrice = itemPrices[0];
    const savings = averagePrice - (lowestPrice.salePrice || lowestPrice.price);

    return {
      item,
      prices: itemPrices,
      lowestPrice,
      averagePrice,
      savings,
    };
  });
}
