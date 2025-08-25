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
    return "";
  }

  const hostUri: string | undefined = (Constants as any)?.expoConfig?.hostUri ?? undefined;
  if (hostUri) {
    const clean = hostUri.split("?")[0];
    const host = clean.split(":")[0];
    return `http://${host}:19000`;
  }

  return "http://localhost:19000";
};

const endpointUrl = Platform.OS === "web" ? "/api/trpc" : `${getBaseUrl()}/api/trpc`;

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
              `Cannot connect to backend at ${endpointUrl}. If you are on a device, set EXPO_PUBLIC_RORK_API_BASE_URL to your machine URL (e.g. http://192.168.1.10:19000).`
            );
          }

          throw error as Error;
        }
      },
    }),
  ],
});
