import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
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
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
    }),
  ],
});