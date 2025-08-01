# API Setup Guide - Achieving 100% Accuracy

## Current Status
- **Rip360_Ninja API**: 50% accuracy
- **Rip360_Nutrition API**: 33% accuracy
- **Target**: 100% accuracy for both APIs

## Issues Identified

### 1. Missing API Keys ❌
Your app is currently running in development mode because API keys are not configured.

### 2. API Endpoint Verification ❌
The current endpoints may not be correct or accessible.

### 3. Mock Data Fallback ❌
The system falls back to mock data instead of real API responses.

## Step-by-Step Solution

### Step 1: Set Up API Keys

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Get your API keys from Rip360 dashboard:**
   - Visit your Rip360 developer portal
   - Generate API keys for each service:
     - Ninja API (fitness/workout generation)
     - Nutrition API (food database/meal planning)
     - Health FDA API (supplements/medical data)

3. **Add keys to .env file:**
   ```env
   EXPO_PUBLIC_RIP360_NINJA_API_KEY=your_actual_ninja_key_here
   EXPO_PUBLIC_RIP360_NUTRITION_API_KEY=your_actual_nutrition_key_here
   EXPO_PUBLIC_RIP360_HEALTH_FDA_API_KEY=your_actual_health_fda_key_here
   ```

4. **Restart your development server:**
   ```bash
   npx expo start --clear
   ```

### Step 2: Verify API Endpoints

The current base URL is `https://api.rip360.com`. If this is incorrect:

1. **Update the API base URL in `services/api.ts`:**
   ```typescript
   const API_BASE_URL = 'https://your-correct-api-url.com';
   ```

2. **Or set custom endpoints in .env:**
   ```env
   EXPO_PUBLIC_NINJA_API_URL=https://ninja-api.rip360.com/v1
   EXPO_PUBLIC_NUTRITION_API_URL=https://nutrition-api.rip360.com/v2
   EXPO_PUBLIC_FDA_API_URL=https://health-api.rip360.com/v1
   ```

### Step 3: Test API Connectivity

1. **Run the API test suite:**
   - Open your app
   - Go to Profile → API Test Suite
   - Click "Run All Tests"

2. **Check the console logs:**
   - Look for detailed API request/response logs
   - Verify API keys are being sent
   - Check response status codes

### Step 4: Alternative APIs (If Rip360 APIs are unavailable)

If Rip360 APIs are not ready, you can use these alternatives:

#### For Fitness Data (Ninja API alternative):
```env
EXPO_PUBLIC_API_NINJAS_KEY=your_api_ninjas_key
```
- Get free key from: https://api.api-ninjas.com/

#### For Nutrition Data:
```env
EXPO_PUBLIC_EDAMAM_APP_ID=your_edamam_app_id
EXPO_PUBLIC_EDAMAM_APP_KEY=your_edamam_app_key
```
- Get free key from: https://developer.edamam.com/

#### For FDA/Health Data:
```env
EXPO_PUBLIC_USDA_API_KEY=your_usda_key
```
- Get free key from: https://fdc.nal.usda.gov/api-guide.html

## Expected Results After Setup

### 100% Accuracy Criteria:

#### Rip360_Ninja API:
- ✅ Successful HTTP responses (200-299)
- ✅ Valid workout structure with exercises
- ✅ Exercises match requested muscle groups
- ✅ Difficulty levels are appropriate
- ✅ Reasonable duration estimates

#### Rip360_Nutrition API:
- ✅ Successful HTTP responses (200-299)
- ✅ Relevant food search results
- ✅ Complete nutrition data (calories, protein, carbs, fat)
- ✅ Accurate serving size information
- ✅ Valid barcode lookups

## Troubleshooting

### Issue: Still getting "Development Mode" errors
**Solution:** 
1. Verify all 3 API keys are set in .env
2. Restart Expo development server
3. Check console for "API Key present: true"

### Issue: "Failed to fetch" errors
**Solution:**
1. Verify API endpoints are correct
2. Check network connectivity
3. Verify API keys have proper permissions
4. Check CORS settings if testing on web

### Issue: Invalid API responses
**Solution:**
1. Check API documentation for correct request format
2. Verify required headers are being sent
3. Update request/response validation logic

### Issue: Rate limiting
**Solution:**
1. Implement request throttling
2. Add retry logic with exponential backoff
3. Cache responses to reduce API calls

## Testing Commands

```bash
# Test individual APIs
curl -H "X-API-Key: YOUR_KEY" https://api.rip360.com/fitness/exercises

# Check environment variables
npx expo config --type introspect

# Clear cache and restart
npx expo start --clear --reset-cache
```

## Monitoring API Health

The app includes built-in monitoring:
- Real-time accuracy scoring
- Response time tracking
- Error rate monitoring
- Cross-reference validation

## Next Steps

1. **Set up API keys** (highest priority)
2. **Verify endpoints** are correct
3. **Run test suite** to confirm 100% accuracy
4. **Monitor performance** in production
5. **Implement caching** for better performance

## Support

If you continue to experience issues:
1. Check the console logs for detailed error messages
2. Verify your API key permissions with Rip360
3. Test endpoints manually using curl or Postman
4. Contact Rip360 support for API documentation updates