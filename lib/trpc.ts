import { createTRPCReact } from "@trpc/react-query";
import { httpLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import { Platform } from "react-native";
import Constants from "expo-constants";

export const trpc = createTRPCReact<AppRouter>();

const getBaseOrigin = () => {
  const customBaseUrlRaw = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  const customBaseUrl = typeof customBaseUrlRaw === 'string' ? customBaseUrlRaw.trim() : undefined;
  if (customBaseUrl && /^https?:\/\//i.test(customBaseUrl) && !/your_backend_api_base_url_here/i.test(customBaseUrl)) {
    return customBaseUrl.replace(/\/$/, "");
  } else if (customBaseUrl && !/^https?:\/\//i.test(customBaseUrl)) {
    console.warn("EXPO_PUBLIC_RORK_API_BASE_URL is set but not a valid URL. Ignoring.");
  }

  if (Platform.OS === "web") {
    try {
      const origin = (window as any)?.location?.origin as string | undefined;
      if (origin && typeof origin === "string") return origin.replace(/\/$/, "");
    } catch {}
    return "";
  }

  const hostUri: string | undefined =
    (Constants as any)?.expoConfig?.hostUri ??
    (Constants as any)?.expoGoConfig?.debuggerHost ??
    undefined;

  if (hostUri) {
    const clean = hostUri.split("?")[0];
    const prefixed = /^https?:\/\//i.test(clean) ? clean : `http://${clean}`;
    return prefixed.replace(/\/$/, "");
  }

  console.warn("Could not resolve hostUri from Expo Constants. Falling back to relative API.");
  return "";
};

const getTrpcEndpoint = () => {
  const base = getBaseOrigin();
  const withoutTrailing = base.replace(/\/$/, "");
  const hasApi = /\/(api)(\b|\/)/.test(withoutTrailing);
  const baseWithApi = hasApi ? withoutTrailing : `${withoutTrailing}/api`;
  return `${baseWithApi.replace(/\/+$/, "")}/trpc`;
};

const endpointUrl = getTrpcEndpoint();
console.log("tRPC endpoint resolved:", endpointUrl);

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
              Accept: "application/json",
              ...(options?.headers ?? {}),
              "Content-Type": "application/json",
            },
          });

          console.log("📡 tRPC Response:", response.status, response.statusText);

          if (!response.ok) {
            console.error("❌ tRPC Error Response:", response.status, response.statusText);

            const responseText = await response.text();
            console.log("Response text preview:", responseText.substring(0, 100));

            if (response.status === 404 || responseText.includes("<!DOCTYPE") || responseText.includes("<html")) {
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
