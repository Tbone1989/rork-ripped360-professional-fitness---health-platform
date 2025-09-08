import { createTRPCReact } from "@trpc/react-query";
import { httpLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import { Platform } from "react-native";
import Constants from "expo-constants";

export const trpc = createTRPCReact<AppRouter>();

const normalizeUrl = (url: string) => url.replace(/\/$/, "");

const getBaseOrigin = () => {
  const customBaseUrlRaw = process.env.EXPO_PUBLIC_TRPC_BASE_URL || process.env.EXPO_PUBLIC_API_BASE_URL || "";
  const customBaseUrl = typeof customBaseUrlRaw === "string" ? customBaseUrlRaw.trim() : "";

  if (customBaseUrl) {
    if (/^https?:\/\//i.test(customBaseUrl)) {
      return normalizeUrl(customBaseUrl);
    }
    console.warn("EXPO_PUBLIC_TRPC_BASE_URL provided without protocol. Prepending https://");
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
    c?.expoGoConfig?.debuggerHost ||
    c?.expoGoConfig?.hostUri ||
    c?.expoConfig?.hostUri ||
    c?.manifest?.debuggerHost ||
    c?.manifest?.hostUri ||
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

  console.warn("Could not resolve hostUri from Expo Constants. Set EXPO_PUBLIC_TRPC_BASE_URL to your dev server (e.g. http://192.168.1.10:8081).");
  return "";
};

const getTrpcEndpointCandidates = (): string[] => {
  const forced = (process.env.EXPO_PUBLIC_TRPC_URL ?? "").trim();
  const base = getBaseOrigin();
  const cleanBase = base ? base.replace(/\/$/, "") : "";

  const ordered: string[] = [];
  if (forced) ordered.push(forced);

  // Prefer relative endpoints first so same-origin works on web and dev
  ordered.push("/api/trpc");
  ordered.push("/trpc");

  if (cleanBase) {
    const withApi = `${cleanBase}${cleanBase.endsWith("/api") || /(\/api)(\b|\/)/.test(cleanBase) ? "" : "/api"}`.replace(/\/+$/, "");
    ordered.push(`${withApi}/trpc`);
    ordered.push(`${cleanBase}/trpc`);
  }

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

const createFallbackResponse = (error: any) => {
  const message = (error && (error as any).message) ? (error as any).message : "unknown";
  console.warn("tRPC: Using fallback response due to backend unavailability:", message);
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    headers: new Headers({ "content-type": "application/json" }),
    text: async () => JSON.stringify({ result: { data: { json: null } } }),
    json: async () => ({ result: { data: { json: null } } }),
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
                Accept: "application/json",
                "Content-Type": "application/json",
                ...(options?.headers ?? {}),
              },
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

        const msg = (lastErr && (lastErr as any).message) ? (lastErr as any).message : "unknown";
        if (lastErr instanceof TypeError && (msg === "Failed to fetch" || msg.includes("Network"))) {
          const baseUrl = getBaseOrigin();
          const debugInfo = {
            baseUrl,
            endpointCandidates,
            platform: Platform.OS,
            customUrl: process.env.EXPO_PUBLIC_TRPC_BASE_URL ?? process.env.EXPO_PUBLIC_API_BASE_URL,
            trpcUrl: process.env.EXPO_PUBLIC_TRPC_URL,
            error: msg,
          };
          console.error("❌ tRPC Connection Failed - Debug Info:", debugInfo);
          console.error("Ensure your backend is mounted at /api/trpc or set EXPO_PUBLIC_TRPC_URL.");

          return createFallbackResponse(lastErr);
        }

        console.error("tRPC Request Failed:", lastErr);
        return createFallbackResponse(lastErr || new Error("Unknown tRPC connection error"));
      },
    }),
  ],
});
