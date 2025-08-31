import { createTRPCReact } from "@trpc/react-query";
import { httpLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import { Platform } from "react-native";
import Constants from "expo-constants";

export const trpc = createTRPCReact<AppRouter>();

const normalizeUrl = (url: string) => url.replace(/\/$/, "");

const getBaseOrigin = () => {
  const customBaseUrlRaw = process.env.EXPO_PUBLIC_RORK_API_BASE_URL ?? process.env.EXPO_PUBLIC_BACKEND_URL;
  const customBaseUrl = typeof customBaseUrlRaw === "string" ? customBaseUrlRaw.trim() : undefined;
  if (customBaseUrl) {
    if (/^https?:\/\//i.test(customBaseUrl)) {
      return normalizeUrl(customBaseUrl);
    }
    console.warn("EXPO_PUBLIC_RORK_API_BASE_URL provided without protocol. Prepending http://");
    return normalizeUrl(`http://${customBaseUrl}`);
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
  ordered.push("/api/trpc");
  if (cleanBase) {
    const withApi = `${cleanBase}${cleanBase.endsWith("/api") || /(\/api)(\b|\/)/.test(cleanBase) ? "" : "/api"}`.replace(/\/+$/, "");
    ordered.push(`${withApi}/trpc`);
    ordered.push(`${cleanBase}/trpc`);
  }
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
                ...(options?.headers ?? {}),
                "Content-Type": "application/json",
              },
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

        if (lastErr instanceof TypeError && (lastErr as TypeError).message === "Failed to fetch") {
          throw new Error(
            `Cannot connect to backend. If you are on a device, set EXPO_PUBLIC_RORK_API_BASE_URL to your machine or tunnel URL (e.g. http://192.168.1.10:8081 or https://<tunnel>.ngrok-free.app).`
          );
        }
        throw (lastErr as Error) ?? new Error("Unknown tRPC connection error");
      },
    }),
  ],
});
