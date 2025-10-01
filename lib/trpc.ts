import React, { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

export type TrpcProviderProps = { children: ReactNode };

function getBaseUrl(): string {
  try {
    const origin = typeof globalThis !== "undefined" && (globalThis as any)?.location?.origin ? String((globalThis as any).location.origin) : "";
    if (origin) return origin;
  } catch {}
  return "";
}

async function trpcCall(path: string, input?: unknown): Promise<any> {
  const url = `${getBaseUrl()}/api/trpc/${path}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ input }),
    });
    const json = await res.json().catch(() => ({} as any));
    const data = (json?.result?.data ?? json?.data ?? json) as unknown;
    return data;
  } catch (e) {
    console.log("trpcCall error", path, e);
    return [];
  }
}

export const trpc = {
  Provider: ({ children }: TrpcProviderProps) => React.createElement(React.Fragment, null, children),
  shop: {
    products: {
      useQuery(input?: Record<string, unknown>) {
        return useQuery({
          queryKey: ["shop.products", input ?? {}],
          queryFn: async () => {
            const data = await trpcCall("shop.products", input ?? {});
            if (Array.isArray(data)) return data;
            const maybeArr: unknown = (data as any)?.json ?? (data as any)?.items ?? [];
            return Array.isArray(maybeArr) ? maybeArr : [];
          },
        });
      },
    },
  },
} as const;

export const trpcClient = {
  shop: {
    async products(input?: Record<string, unknown>) {
      return trpcCall("shop.products", input ?? {});
    },
  },
} as const;
