import { createTRPCReact } from "@trpc/react-query";
import { httpLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
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
            
            // Check if response is HTML (backend not running)
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
              throw new Error('Backend server is not running. Please start the backend server.');
            }
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