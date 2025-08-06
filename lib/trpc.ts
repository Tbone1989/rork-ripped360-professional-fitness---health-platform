import { createTRPCReact } from "@trpc/react-query";
import { httpLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  // Check if we have a custom API base URL from environment
  const customBaseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  if (customBaseUrl) {
    return customBaseUrl;
  }
  
  // In development, use the current origin for web or localhost for native
  if (typeof window !== 'undefined') {
    // Web environment - use current origin
    return window.location.origin;
  } else {
    // Native environment - use localhost (will be tunneled by Expo)
    return 'http://localhost:3000';
  }
};

export const trpcClient = trpc.createClient({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      fetch: async (url, options) => {
        console.log('🔄 tRPC Request:', url);
        try {
          const response = await fetch(url, {
            ...options,
            headers: {
              ...options?.headers,
              'Content-Type': 'application/json',
            },
          });
          
          console.log('📡 tRPC Response:', response.status, response.statusText);
          
          if (!response.ok) {
            console.error('❌ tRPC Error Response:', response.status, response.statusText);
            
            // Get response text to check if it's HTML
            const responseText = await response.text();
            console.log('Response text preview:', responseText.substring(0, 100));
            
            // Check if response is HTML (backend not running or wrong endpoint)
            if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
              throw new Error('Backend server endpoint not found. The tRPC server may not be running or configured correctly.');
            }
            
            // Try to parse as JSON for proper error handling
            try {
              const errorData = JSON.parse(responseText);
              console.error('❌ tRPC JSON Error:', errorData);
            } catch {
              console.error('❌ tRPC Non-JSON Error:', responseText);
            }
            
            // Create a new response with the text we already read
            return new Response(responseText, {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
            });
          }
          
          return response;
        } catch (error) {
          console.error('❌ tRPC Network Error:', error);
          
          // Provide more specific error messages
          if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new Error('Cannot connect to backend server. Please ensure the backend is running on the correct port.');
          }
          
          throw error;
        }
      },
    }),
  ],
});