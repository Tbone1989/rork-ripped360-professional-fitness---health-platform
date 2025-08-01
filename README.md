# Rip360 Fitness App

A comprehensive fitness and health tracking app built with React Native and Expo.

## Features

### 🏋️ Workouts
- AI-powered workout generation
- Exercise library with detailed instructions
- Progress tracking and analytics
- Custom workout creation

### 🍽️ Nutrition
- Barcode scanning for food logging
- AI meal plan generation
- Macro tracking and analysis
- Recipe suggestions

### 🩺 Health & Medical
- Bloodwork analysis with AI insights
- Supplement tracking and recommendations
- Health metrics monitoring
- Medical document upload and analysis

### 🛒 Shop
- Product catalog with barcode scanning
- Supplement and fitness product recommendations
- Shopping cart and checkout
- Order tracking

### 👤 Profile & Coaching
- Personal coaching sessions
- Progress tracking and analytics
- Goal setting and achievement
- Community features

## API Integration

The app integrates with Rip360 APIs for enhanced functionality:

### Environment Variables

Create a `.env` file in the root directory with your API keys:

```env
EXPO_PUBLIC_RIP360_NINJA_API_KEY=your_ninja_api_key_here
EXPO_PUBLIC_RIP360_NUTRITION_API_KEY=your_nutrition_api_key_here
EXPO_PUBLIC_RIP360_HEALTH_FDA_API_KEY=your_health_fda_api_key_here
```

### API Endpoints

- **Rip360_Ninja API**: Fitness tracking and workout generation
- **Rip360_Nutrition API**: Food database and meal planning
- **Rip360_Health FDA API**: Medical analysis and supplement data

## Features Implemented

### Barcode Scanning
- Food products (meals/scan)
- Supplements and medications (medical/scan)
- Shop products (shop/scan)

### AI-Powered Features
- Workout generation based on preferences
- Meal plan creation with nutritional goals
- Bloodwork analysis with health recommendations
- Food search and nutritional analysis

### Real-time Search
- Food database search with API integration
- Supplement and medication lookup
- Exercise library search

## Technical Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Styling**: React Native StyleSheet
- **Camera**: Expo Camera for barcode scanning
- **Icons**: Lucide React Native
- **Image Handling**: Expo Image

## Getting Started

1. Install dependencies:
   ```bash
   bun install
   ```

2. Set up environment variables (see above)

3. Start the development server:
   ```bash
   bun start
   ```

4. Use Expo Go app to scan the QR code and run on your device

## App Structure

```
app/
├── (tabs)/           # Tab navigation screens
│   ├── index.tsx     # Home/Dashboard
│   ├── workouts.tsx  # Workouts tab
│   ├── meals.tsx     # Nutrition tab
│   ├── medical.tsx   # Health tab
│   ├── shop.tsx      # Shop tab
│   └── profile.tsx   # Profile tab
├── meals/            # Meal-related screens
│   ├── scan.tsx      # Food barcode scanner
│   ├── log.tsx       # Food logging
│   ├── plans.tsx     # Meal plans
│   └── add.tsx       # Add custom food
├── medical/          # Health-related screens
│   ├── scan.tsx      # Medical product scanner
│   └── upload.tsx    # Bloodwork upload
├── workouts/         # Workout screens
│   └── generate.tsx  # AI workout generator
└── shop/             # Shopping screens
    ├── scan.tsx      # Product scanner
    └── cart.tsx      # Shopping cart

services/
└── api.ts            # API service layer

components/
└── ui/               # Reusable UI components
```

## Key Features

### Smart Scanning
- Multi-purpose barcode scanner for food, supplements, and products
- Real-time product recognition and data retrieval
- Fallback to manual entry when products aren't found

### AI Integration
- Intelligent workout generation based on user preferences
- Personalized meal planning with nutritional optimization
- Advanced bloodwork analysis with health insights
- Smart food recommendations and macro tracking

### Comprehensive Health Tracking
- Complete nutrition logging with macro breakdown
- Supplement and medication tracking
- Health metrics monitoring and trends
- Integration with medical data and lab results

### User Experience
- Clean, modern dark theme design
- Intuitive navigation with tab-based structure
- Real-time search and filtering
- Offline-capable with smart caching

## Development Notes

- The app uses mock data as fallback when API calls fail
- All API integrations are handled through the centralized `services/api.ts` file
- Camera functionality is conditionally loaded for web compatibility
- State management is handled with Zustand for optimal performance

## Contributing

This is a production-ready fitness and health tracking application with comprehensive API integration and modern React Native best practices.