# API Testing Documentation

## Overview
This document outlines the API testing suite implemented for the Ripped360 fitness app, which integrates with three main APIs:
- **Rip360_Ninja**: Fitness tracking and workout generation
- **Rip360_Nutrition**: Nutrition lookup and meal planning  
- **Rip360_Health FDA**: Medical/health APIs and supplement information

## Test Sequence

### 1. Workout Generation → Rip360_Ninja
- **Endpoint**: `/fitness/workout/generate`
- **Test**: Generate a workout with specific preferences
- **Validation**: 
  - Workout structure (name, exercises, duration)
  - Exercise relevance to requested muscle groups
  - Difficulty level matching
  - Reasonable duration estimates

### 2. Nutrition Lookup → Rip360_Nutrition  
- **Endpoint**: `/nutrition/search`
- **Test**: Search for food items by name
- **Validation**:
  - Relevant search results
  - Complete nutrition data (calories, protein, carbs, fat)
  - Reasonable nutritional values
  - Serving size information

### 3. Food Barcode Scanning → Rip360_Nutrition
- **Endpoint**: `/nutrition/barcode/{barcode}`
- **Test**: Lookup food by barcode
- **Validation**:
  - Barcode matching in response
  - Complete product information
  - Brand and name data

### 4. Supplement Check → Rip360_Health FDA
- **Endpoint**: `/health/supplements/search`
- **Test**: Search for supplements
- **Validation**:
  - Relevant supplement results
  - Ingredient lists
  - Safety warnings and benefits
  - FDA compliance information

### 5. Cross-Reference Data Accuracy
- **Process**: Compare nutrition and supplement data for consistency
- **Validation**:
  - Data consistency between APIs
  - Protein content matching
  - Ingredient cross-referencing

## Accuracy Metrics

Each test calculates an accuracy score based on:
- **Structure Validation**: Correct data format and required fields
- **Content Relevance**: Results matching search criteria
- **Data Completeness**: All expected fields populated
- **Value Reasonableness**: Nutritional/fitness values within expected ranges

## Running Tests

### Via Test Suite Screen
1. Navigate to Profile → API Test Suite
2. Click "Run All Tests"
3. View individual test results and accuracy scores
4. Check cross-reference analysis

### Via Individual Screens
- **Workout Generation**: Generate workout screen shows API response time
- **Nutrition Scanning**: Meal scan screen displays API status in alerts
- **Supplement Details**: Product scanning includes API validation

### Environment Setup
```bash
# Create .env file with API keys
EXPO_PUBLIC_RIP360_NINJA_API_KEY=your_ninja_api_key
EXPO_PUBLIC_RIP360_NUTRITION_API_KEY=your_nutrition_api_key  
EXPO_PUBLIC_RIP360_HEALTH_FDA_API_KEY=your_health_fda_api_key
```

## Test Results Interpretation

### Success Criteria
- ✅ **API Response**: Successful HTTP response (200-299)
- ✅ **Data Structure**: Valid JSON with expected fields
- ✅ **Content Quality**: Relevant and accurate data
- ✅ **Performance**: Response time < 5 seconds

### Accuracy Scoring
- **90-100%**: Excellent - All validations passed
- **70-89%**: Good - Minor issues with data completeness
- **50-69%**: Fair - Some structural or content issues
- **Below 50%**: Poor - Significant problems requiring attention

### Common Issues
1. **Missing API Keys**: Check environment variables
2. **Network Connectivity**: Verify internet connection
3. **API Rate Limits**: Wait between test runs
4. **Invalid Responses**: Check API endpoint URLs
5. **Data Format Changes**: Update validation logic

## Monitoring and Alerts

The test suite provides:
- Real-time test status updates
- Response time measurements
- Accuracy percentage calculations
- Cross-reference consistency scores
- Detailed error reporting
- Environment validation

## Integration Points

### Workout Generation
- Used in: Workout tab, AI workout generator
- Fallback: Mock workout data
- Key metrics: Exercise relevance, difficulty matching

### Nutrition APIs  
- Used in: Meal scanning, food search, meal planning
- Fallback: Local food database
- Key metrics: Search accuracy, barcode recognition

### Health/Medical APIs
- Used in: Supplement scanning, bloodwork analysis
- Fallback: Basic supplement database
- Key metrics: FDA compliance, safety information

## Troubleshooting

### API Key Issues
1. Verify keys are set in environment
2. Check key format and validity
3. Confirm API permissions and quotas
4. Test individual endpoints manually

### Data Quality Issues
1. Review API documentation for changes
2. Update validation criteria
3. Check for API version updates
4. Verify test data relevance

### Performance Issues
1. Monitor response times
2. Check network conditions
3. Implement request caching
4. Consider API rate limiting

## Future Enhancements

1. **Automated Testing**: Schedule regular API health checks
2. **Performance Monitoring**: Track response times over time
3. **Data Quality Metrics**: Advanced accuracy algorithms
4. **Error Recovery**: Improved fallback mechanisms
5. **User Feedback**: Collect accuracy reports from users