import { createTRPCReact } from "@trpc/react-query";
import { httpLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import { Platform } from "react-native";
import Constants from "expo-constants";

export const trpc = createTRPCReact<AppRouter>();

const normalizeUrl = (url: string) => url.replace(/\/$/, "");

const getBaseOrigin = () => {
  // Use the RORK API URL directly
  const rorkApiUrl = "https://rork.com/api/p/as5h45pls18cy2nuagueu";
  const customBaseUrlRaw = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || rorkApiUrl;
  const customBaseUrl = typeof customBaseUrlRaw === "string" ? customBaseUrlRaw.trim() : rorkApiUrl;
  
  if (customBaseUrl) {
    if (/^https?:\/\//i.test(customBaseUrl)) {
      return normalizeUrl(customBaseUrl);
    }
    console.warn("EXPO_PUBLIC_RORK_API_BASE_URL provided without protocol. Prepending https://");
    return normalizeUrl(`https://${customBaseUrl}`);
  }

  if (Platform.OS === "web") {
    try {
      const origin = (globalThis as any)?.location?.origin as string | undefined;
      if (origin && typeof origin === "string") return normalizeUrl(origin);
    } catch {}
    return "";
  }

  const c: any = Constants;
  const hostUri: string | undefined =
    c?.expoConfig?.hostUri ||
    c?.expoGoConfig?.hostUri ||
    c?.expoGoConfig?.debuggerHost ||
    c?.manifest?.hostUri ||
    c?.manifest?.debuggerHost ||
    undefined;

  if (hostUri) {
    const clean = hostUri.split("?")[0];
    const prefixed = /^https?:\/\//i.test(clean) ? clean : `http://${clean}`;
    try {
      const u = new URL(prefixed.includes("http") ? prefixed : `http://${prefixed}`);
      const base = `${u.protocol}//${u.host}`;
      return normalizeUrl(base);
    } catch {
      return normalizeUrl(prefixed);
    }
  }

  console.warn("Could not resolve hostUri from Expo Constants. Set EXPO_PUBLIC_RORK_API_BASE_URL to your dev server (e.g. http://192.168.1.10:8081).");
  return "";
};

const getTrpcEndpointCandidates = (): string[] => {
  const forced = (process.env.EXPO_PUBLIC_TRPC_URL ?? "").trim();
  const base = getBaseOrigin();
  const cleanBase = base ? base.replace(/\/$/, "") : "";

  const ordered: string[] = [];
  if (forced) ordered.push(forced);
  
  // For RORK API, the tRPC endpoint is at /api/trpc
  if (cleanBase) {
    // If the base already includes /api/p/xxx, add /api/trpc
    if (cleanBase.includes("/api/p/")) {
      ordered.push(`${cleanBase}/api/trpc`);
    } else {
      // Otherwise try standard patterns
      const withApi = `${cleanBase}${cleanBase.endsWith("/api") || /(\/api)(\b|\/)/.test(cleanBase) ? "" : "/api"}`.replace(/\/+$/, "");
      ordered.push(`${withApi}/trpc`);
      ordered.push(`${cleanBase}/trpc`);
    }
  }
  
  // Fallback to relative paths
  ordered.push("/api/trpc");
  ordered.push("/trpc");

  const seen = new Set<string>();
  const deduped = ordered.filter((u) => {
    if (!u) return false;
    const key = u.replace(/\/+$/, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return deduped;
};

const endpointCandidates = getTrpcEndpointCandidates();
console.log("tRPC endpoint candidates:", endpointCandidates);

// Create a fallback client that returns mock data when backend is unavailable
const createFallbackResponse = (error: any) => {
  console.warn('tRPC: Using fallback response due to backend unavailability:', error.message);
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers({ 'content-type': 'application/json' }),
    text: async () => JSON.stringify({ result: { data: { json: null } } }),
    json: async () => ({ result: { data: { json: null } } })
  } as Response;
};

export const trpcClient = trpc.createClient({
  links: [
    loggerLink({
      enabled: () => process.env.NODE_ENV === "development" && Platform.OS !== "web",
    }),
    httpLink({
      url: endpointCandidates[0] ?? "/api/trpc",
      transformer: superjson,
      fetch: async (url, options) => {
        const tryUrls = [url, ...endpointCandidates.filter((u) => u !== url)];
        let lastErr: unknown;
        for (const u of tryUrls) {
          try {
            console.log("🔄 tRPC Request:", u);
            const response = await fetch(u, {
              ...options,
              ...(Platform.OS === "web" ? { mode: "cors" as const } : {}),
              headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                ...(options?.headers ?? {}),
              },
              // Add timeout for better error handling
              signal: AbortSignal.timeout ? AbortSignal.timeout(30000) : undefined,
            });

            console.log("📡 tRPC Response:", response.status, response.statusText);

            if (!response.ok) {
              const responseText = await response.text();
              console.error("❌ tRPC Error Response:", response.status, response.statusText);
              console.log("Response text preview:", responseText.substring(0, 120));

              if (
                response.status === 404 ||
                responseText.includes("<!DOCTYPE") ||
                responseText.includes("<html")
              ) {
                continue;
              }

              return new Response(responseText, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
              });
            }

            return response;
          } catch (error) {
            lastErr = error;
            console.error("❌ tRPC Network Error:", error);
            continue;
          }
        }

        if (lastErr instanceof TypeError && ((lastErr as TypeError).message === "Failed to fetch" || (lastErr as TypeError).message.includes("Network"))) {
          const baseUrl = getBaseOrigin();
          const debugInfo = {
            baseUrl,
            endpointCandidates,
            platform: Platform.OS,
            customUrl: process.env.EXPO_PUBLIC_RORK_API_BASE_URL,
            trpcUrl: process.env.EXPO_PUBLIC_TRPC_URL,
            error: lastErr.message
          };
          console.error("❌ tRPC Connection Failed - Debug Info:", debugInfo);
          console.error("Please ensure:");
          console.error("1. Your RORK backend is running");
          console.error("2. The API URL is correct: https://rork.com/api/p/as5h45pls18cy2nuagueu");
          console.error("3. CORS is properly configured on the backend");
          
          // Return a fallback response for graceful degradation
          return createFallbackResponse(lastErr);
        }
        
        // For other errors, also try to handle gracefully
        console.error("tRPC Request Failed:", lastErr);
        return createFallbackResponse(lastErr || new Error("Unknown tRPC connection error"));
      },
    }),
  ],
});
