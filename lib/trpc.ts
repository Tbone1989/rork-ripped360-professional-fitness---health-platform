import { createTRPCReact } from "@trpc/react-query";
import { httpLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import { Platform } from "react-native";
import Constants from "expo-constants";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  const customBaseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  if (customBaseUrl) {
    return customBaseUrl;
  }

  if (Platform.OS === "web") {
    // Use same-origin on web so relative /api works in dev and prod
    return "";
  }

  // Try to derive the dev server host:port from Expo constants without forcing a port
  const hostUri: string | undefined =
    (Constants as any)?.expoConfig?.hostUri ??
    (Constants as any)?.expoGoConfig?.debuggerHost ??
    undefined;

  if (hostUri) {
    const clean = hostUri.split("?")[0]; // e.g. 192.168.1.10:8081
    // If clean already contains host:port, use it as-is
    return `http://${clean}`;
  }

  // Fallback to localhost typical Metro port
  return "http://127.0.0.1:8081";
};

const endpointUrl = `${getBaseUrl()}/api/trpc`;

export const trpcClient = trpc.createClient({
  links: [
    loggerLink({
      enabled: () => process.env.NODE_ENV === "development" && Platform.OS !== "web",
    }),
    httpLink({
      url: endpointUrl,
      transformer: superjson,
      fetch: async (url, options) => {
        console.log("🔄 tRPC Request:", url);
        try {
          const response = await fetch(url, {
            ...options,
            ...(Platform.OS === "web" ? { mode: "cors" as const } : {}),
            headers: {
              ...(options?.headers ?? {}),
              "Content-Type": "application/json",
            },
          });

          console.log("📡 tRPC Response:", response.status, response.statusText);

          if (!response.ok) {
            console.error("❌ tRPC Error Response:", response.status, response.statusText);

            const responseText = await response.text();
            console.log("Response text preview:", responseText.substring(0, 100));

            if (responseText.includes("<!DOCTYPE") || responseText.includes("<html")) {
              throw new Error(
                "Backend server endpoint not found. The tRPC server may not be running or configured correctly."
              );
            }

            try {
              const errorData = JSON.parse(responseText);
              console.error("❌ tRPC JSON Error:", errorData);
            } catch {
              console.error("❌ tRPC Non-JSON Error:", responseText);
            }

            return new Response(responseText, {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
            });
          }

          return response;
        } catch (error) {
          console.error("❌ tRPC Network Error:", error);

          if (error instanceof TypeError && (error as TypeError).message === "Failed to fetch") {
            throw new Error(
              `Cannot connect to backend at ${endpointUrl}. If you are on a device, set EXPO_PUBLIC_RORK_API_BASE_URL to your machine URL (e.g. http://192.168.1.10:8081).`
            );
          }

          throw error as Error;
        }
      },
    }),
  ],
});
