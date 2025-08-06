import { z } from "zod";
import { publicProcedure } from "../../../create-context";

interface ApiStatus {
  name: string;
  key: string;
  configured: boolean;
  status: 'active' | 'placeholder' | 'missing';
  endpoint?: string;
}

export const checkApiStatusRoute = publicProcedure
  .query(async () => {
    console.log('🔍 Checking API key configuration status...');
    
    const apiKeys = [
      {
        name: 'RIP360 Ninja API',
        key: process.env.EXPO_PUBLIC_RIP360_NINJA_API_KEY || '',
        endpoint: process.env.EXPO_PUBLIC_NINJA_API_URL || 'https://api.rip360.com/fitness'
      },
      {
        name: 'RIP360 Nutrition API',
        key: process.env.EXPO_PUBLIC_RIP360_NUTRITION_API_KEY || '',
        endpoint: process.env.EXPO_PUBLIC_NUTRITION_API_URL || 'https://api.rip360.com/nutrition'
      },
      {
        name: 'RIP360 Health FDA API',
        key: process.env.EXPO_PUBLIC_RIP360_HEALTH_FDA_API_KEY || '',
        endpoint: process.env.EXPO_PUBLIC_FDA_API_URL || 'https://api.rip360.com/health'
      },
      {
        name: 'API Ninjas',
        key: process.env.EXPO_PUBLIC_API_NINJAS_KEY || '',
        endpoint: 'https://api.api-ninjas.com/v1'
      },
      {
        name: 'Edamam Food Database',
        key: `${process.env.EXPO_PUBLIC_EDAMAM_APP_ID || ''}:${process.env.EXPO_PUBLIC_EDAMAM_APP_KEY || ''}`,
        endpoint: 'https://api.edamam.com/api/food-database/v2'
      },
      {
        name: 'USDA FoodData Central',
        key: process.env.EXPO_PUBLIC_USDA_API_KEY || '',
        endpoint: 'https://api.nal.usda.gov/fdc/v1'
      },
      {
        name: 'Google Places API',
        key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '',
        endpoint: 'https://maps.googleapis.com/maps/api'
      },
      {
        name: 'OpenAI API',
        key: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
        endpoint: 'https://api.openai.com/v1'
      },
      {
        name: 'Health API',
        key: process.env.EXPO_PUBLIC_HEALTH_API_KEY || '',
        endpoint: 'Custom health API endpoint'
      },
      {
        name: 'Nutrition Analysis API',
        key: process.env.EXPO_PUBLIC_NUTRITION_ANALYSIS_API_KEY || '',
        endpoint: 'Custom nutrition analysis endpoint'
      },
      {
        name: 'Supplement API',
        key: process.env.EXPO_PUBLIC_SUPPLEMENT_API_KEY || '',
        endpoint: 'Custom supplement API endpoint'
      }
    ];

    const apiStatuses: ApiStatus[] = apiKeys.map(api => {
      let status: 'active' | 'placeholder' | 'missing';
      let configured = false;

      if (!api.key || api.key.trim() === '') {
        status = 'missing';
        configured = false;
      } else if (
        api.key.includes('_active') || 
        api.key.includes('_key_here') ||
        api.key.includes('your_') ||
        api.key === ':'
      ) {
        status = 'placeholder';
        configured = false;
      } else {
        status = 'active';
        configured = true;
      }

      return {
        name: api.name,
        key: api.key ? `${api.key.substring(0, 8)}...` : 'Not set', // Show first 8 chars for security
        configured,
        status,
        endpoint: api.endpoint
      };
    });

    const summary = {
      total: apiStatuses.length,
      configured: apiStatuses.filter(api => api.configured).length,
      placeholder: apiStatuses.filter(api => api.status === 'placeholder').length,
      missing: apiStatuses.filter(api => api.status === 'missing').length,
      active: apiStatuses.filter(api => api.status === 'active').length
    };

    console.log('📊 API Status Summary:', summary);
    console.log('🔑 Configured APIs:', apiStatuses.filter(api => api.configured).map(api => api.name));
    console.log('⚠️ Placeholder APIs:', apiStatuses.filter(api => api.status === 'placeholder').map(api => api.name));
    console.log('❌ Missing APIs:', apiStatuses.filter(api => api.status === 'missing').map(api => api.name));

    return {
      apis: apiStatuses,
      summary,
      recommendations: [
        summary.active === 0 ? 'No real API keys detected. All APIs will use mock data.' : null,
        summary.placeholder > 0 ? `${summary.placeholder} API keys are still using placeholder values.` : null,
        summary.missing > 0 ? `${summary.missing} API keys are missing completely.` : null,
        summary.configured > 0 ? `${summary.configured} API keys are properly configured and ready to use.` : null
      ].filter(Boolean),
      timestamp: new Date().toISOString()
    };
  });

export default checkApiStatusRoute;