import React, { ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

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
  coaching: {
    list: {
      useQuery(input?: Record<string, unknown>) {
        return useQuery({
          queryKey: ["coaching.list", input ?? {}],
          queryFn: async () => {
            const data = await trpcCall("coaching.list", input ?? {});
            return data;
          },
        });
      },
    },
    sessions: {
      list: {
        useQuery(input?: Record<string, unknown>) {
          return useQuery({
            queryKey: ["coaching.sessions.list", input ?? {}],
            queryFn: async () => {
              const data = await trpcCall("coaching.sessions.list", input ?? {});
              return data;
            },
          });
        },
      },
      book: {
        useMutation() {
          return useMutation({
            mutationFn: async (input: Record<string, unknown>) => {
              const data = await trpcCall("coaching.sessions.book", input);
              return data;
            },
          });
        },
      },
    },
    messages: {
      conversations: {
        useQuery(input?: Record<string, unknown>) {
          return useQuery({
            queryKey: ["coaching.messages.conversations", input ?? {}],
            queryFn: async () => {
              const data = await trpcCall("coaching.messages.conversations", input ?? {});
              return data;
            },
          });
        },
      },
      list: {
        useQuery(input?: Record<string, unknown>) {
          return useQuery({
            queryKey: ["coaching.messages.list", input ?? {}],
            queryFn: async () => {
              const data = await trpcCall("coaching.messages.list", input ?? {});
              return data;
            },
          });
        },
      },
      send: {
        useMutation() {
          return useMutation({
            mutationFn: async (input: Record<string, unknown>) => {
              const data = await trpcCall("coaching.messages.send", input);
              return data;
            },
          });
        },
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
  coaching: {
    async list(input?: Record<string, unknown>) {
      return trpcCall("coaching.list", input ?? {});
    },
    sessions: {
      async list(input?: Record<string, unknown>) {
        return trpcCall("coaching.sessions.list", input ?? {});
      },
      async book(input: Record<string, unknown>) {
        return trpcCall("coaching.sessions.book", input);
      },
    },
    messages: {
      async conversations(input?: Record<string, unknown>) {
        return trpcCall("coaching.messages.conversations", input ?? {});
      },
      async list(input?: Record<string, unknown>) {
        return trpcCall("coaching.messages.list", input ?? {});
      },
      async send(input: Record<string, unknown>) {
        return trpcCall("coaching.messages.send", input);
      },
    },
  },
} as const;
