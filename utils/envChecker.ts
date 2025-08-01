export interface EnvStatus {
  key: string;
  name: string;
  isSet: boolean;
  value?: string;
  masked?: string;
}

export class EnvironmentChecker {
  private static instance: EnvironmentChecker;
  
  public static getInstance(): EnvironmentChecker {
    if (!EnvironmentChecker.instance) {
      EnvironmentChecker.instance = new EnvironmentChecker();
    }
    return EnvironmentChecker.instance;
  }

  checkApiKeys(): EnvStatus[] {
    const keys = [
      {
        key: 'EXPO_PUBLIC_RIP360_NINJA_API_KEY',
        name: 'Rip360_Ninja API'
      },
      {
        key: 'EXPO_PUBLIC_RIP360_NUTRITION_API_KEY',
        name: 'Rip360_Nutrition API'
      },
      {
        key: 'EXPO_PUBLIC_RIP360_HEALTH_FDA_API_KEY',
        name: 'Rip360_Health FDA API'
      }
    ];

    return keys.map(({ key, name }) => {
      const value = process.env[key];
      const isSet = Boolean(value && value.length > 0);
      
      return {
        key,
        name,
        isSet,
        value: isSet ? value : undefined,
        masked: isSet ? this.maskApiKey(value!) : undefined
      };
    });
  }

  private maskApiKey(key: string): string {
    if (key.length <= 8) {
      return '*'.repeat(key.length);
    }
    
    const start = key.substring(0, 4);
    const end = key.substring(key.length - 4);
    const middle = '*'.repeat(key.length - 8);
    
    return `${start}${middle}${end}`;
  }

  getApiKeyInstructions(): string {
    const envStatus = this.checkApiKeys();
    const missingKeys = envStatus.filter(env => !env.isSet).map(env => env.key);
    
    return `🔧 API Key Setup Instructions:

${missingKeys.length > 0 ? `❌ Missing Keys: ${missingKeys.length}/3` : '✅ All Keys Present'}

1. Create a .env file in your project root
2. Add the following variables:

EXPO_PUBLIC_RIP360_NINJA_API_KEY=your_ninja_api_key_here
EXPO_PUBLIC_RIP360_NUTRITION_API_KEY=your_nutrition_api_key_here
EXPO_PUBLIC_RIP360_HEALTH_FDA_API_KEY=your_health_fda_api_key_here

3. Restart your development server:
   npx expo start --clear

4. Run the API tests to verify connectivity

📋 Current Status:
${envStatus.map(env => `${env.isSet ? '✅' : '❌'} ${env.name}: ${env.isSet ? 'Set' : 'Missing'}`).join('\n')}

🔗 Get API Keys:
- Visit your Rip360 developer dashboard
- Generate keys for each service
- Copy the .env.example file as a template

⚠️ Important:
- Keys must start with EXPO_PUBLIC_ to work in Expo
- Restart the dev server after adding keys
- Check console logs for detailed error messages`;
  }

  validateApiKeyFormat(key: string): boolean {
    // Basic validation - adjust based on actual API key format
    return key.length >= 16 && /^[a-zA-Z0-9_-]+$/.test(key);
  }

  getConnectionStatus(): 'online' | 'offline' {
    // Simple network check - in a real app, you might ping the API endpoints
    return navigator.onLine ? 'online' : 'offline';
  }

  getSystemInfo(): any {
    const envStatus = this.checkApiKeys();
    const keysSet = envStatus.filter(env => env.isSet).length;
    
    return {
      platform: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      connection: this.getConnectionStatus(),
      apiKeysConfigured: `${keysSet}/3`,
      developmentMode: keysSet < 3,
      readyForTesting: keysSet === 3 && this.getConnectionStatus() === 'online'
    };
  }

  getDiagnosticReport(): string {
    const systemInfo = this.getSystemInfo();
    const envStatus = this.checkApiKeys();
    
    return `🔍 API Diagnostic Report

📊 System Status:
- Platform: ${systemInfo.platform}
- Connection: ${systemInfo.connection}
- API Keys: ${systemInfo.apiKeysConfigured}
- Development Mode: ${systemInfo.developmentMode ? 'Yes' : 'No'}
- Ready for Testing: ${systemInfo.readyForTesting ? 'Yes' : 'No'}

🔑 API Key Details:
${envStatus.map(env => {
  const status = env.isSet ? '✅ SET' : '❌ MISSING';
  const masked = env.masked ? ` (${env.masked})` : '';
  return `- ${env.name}: ${status}${masked}`;
}).join('\n')}

🎯 Next Steps:
${systemInfo.readyForTesting ? 
  '✅ All systems ready! Run API tests to verify connectivity.' : 
  `❌ Setup required:\n${envStatus.filter(env => !env.isSet).map(env => `  - Add ${env.key} to .env file`).join('\n')}`
}

📝 Generated: ${new Date().toLocaleString()}`;
  }
}

export const envChecker = EnvironmentChecker.getInstance();