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
      fetch: (url, options) => {
        console.log('🔄 tRPC Request:', url);
        return fetch(url, {
          ...options,
          headers: {
            ...options?.headers,
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          console.log('📡 tRPC Response:', response.status, response.statusText);
          if (!response.ok) {
            console.error('❌ tRPC Error Response:', response.status, response.statusText);
          }
          return response;
        }).catch((error) => {
          console.error('❌ tRPC Network Error:', error);
          throw error;
        });
      },
    }),
  ],
});