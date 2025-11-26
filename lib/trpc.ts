import React, { ReactNode } from "react";
import { useQuery, useMutation, UseQueryOptions } from "@tanstack/react-query";

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
  example: {
    hi: {
      useQuery(input?: Record<string, unknown>, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
        return useQuery({
          queryKey: ["example.hi", input ?? {}],
          queryFn: async () => trpcCall("example.hi", input ?? {}),
          ...options,
        });
      },
    },
  },
  system: {
    apiStatus: {
      useQuery(input?: Record<string, unknown>, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
        return useQuery({
          queryKey: ["system.apiStatus", input ?? {}],
          queryFn: async () => trpcCall("system.apiStatus", input ?? {}),
          ...options,
        });
      },
    },
  },
  shop: {
    products: {
      useQuery(input?: Record<string, unknown>, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
        return useQuery({
          queryKey: ["shop.products", input ?? {}],
          queryFn: async () => {
            const data = await trpcCall("shop.products", input ?? {});
            if (Array.isArray(data)) return data;
            const maybeArr: unknown = (data as any)?.json ?? (data as any)?.items ?? [];
            return Array.isArray(maybeArr) ? maybeArr : [];
          },
          ...options,
        });
      },
    },
  },
  fitness: {
    exercises: {
      useQuery(input?: Record<string, unknown>, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
        return useQuery({
          queryKey: ["fitness.exercises", input ?? {}],
          queryFn: async () => trpcCall("fitness.exercises", input ?? {}),
          ...options,
        });
      },
    },
    generate: {
      useMutation() {
        return useMutation({
          mutationFn: async (input: Record<string, unknown>) => trpcCall("fitness.generate", input),
        });
      },
    },
  },
  nutrition: {
    search: {
      useQuery(input?: Record<string, unknown>, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
        return useQuery({
          queryKey: ["nutrition.search", input ?? {}],
          queryFn: async () => trpcCall("nutrition.search", input ?? {}),
          ...options,
        });
      },
    },
    barcode: {
      useMutation() {
        return useMutation({
          mutationFn: async (input: Record<string, unknown>) => trpcCall("nutrition.barcode", input),
        });
      },
    },
    mealPlan: {
      useMutation() {
        return useMutation({
          mutationFn: async (input: Record<string, unknown>) => trpcCall("nutrition.mealPlan", input),
        });
      },
    },
  },
  health: {
    bloodwork: {
      useMutation() {
        return useMutation({
          mutationFn: async (input: Record<string, unknown>) => trpcCall("health.bloodwork", input),
        });
      },
    },
    digestive: {
      useQuery(input?: Record<string, unknown>, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
        return useQuery({
          queryKey: ["health.digestive", input ?? {}],
          queryFn: async () => trpcCall("health.digestive", input ?? {}),
          ...options,
        });
      },
    },
    detox: {
      useQuery(input?: Record<string, unknown>, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
        return useQuery({
          queryKey: ["health.detox", input ?? {}],
          queryFn: async () => trpcCall("health.detox", input ?? {}),
          ...options,
        });
      },
    },
    issues: {
      useQuery(input?: Record<string, unknown>, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
        return useQuery({
          queryKey: ["health.issues", input ?? {}],
          queryFn: async () => trpcCall("health.issues", input ?? {}),
          ...options,
        });
      },
    },
    supplements: {
      search: {
        useQuery(input?: Record<string, unknown>, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
          return useQuery({
            queryKey: ["health.supplements.search", input ?? {}],
            queryFn: async () => trpcCall("health.supplements.search", input ?? {}),
            ...options,
          });
        },
      },
      barcode: {
        useMutation() {
          return useMutation({
            mutationFn: async (input: Record<string, unknown>) => trpcCall("health.supplements.barcode", input),
          });
        },
      },
    },
  },
  coaching: {
    list: {
      useQuery(input?: Record<string, unknown>, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
        return useQuery({
          queryKey: ["coaching.list", input ?? {}],
          queryFn: async () => {
            const data = await trpcCall("coaching.list", input ?? {});
            return data;
          },
          ...options,
        });
      },
    },
    clients: {
      useQuery(input?: Record<string, unknown>, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
        return useQuery({
          queryKey: ["coaching.clients", input ?? {}],
          queryFn: async () => trpcCall("coaching.clients", input ?? {}),
          ...options,
        });
      },
    },
    clientAttachments: {
      useQuery(input?: Record<string, unknown>, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
        return useQuery({
          queryKey: ["coaching.clientAttachments", input ?? {}],
          queryFn: async () => trpcCall("coaching.clientAttachments", input ?? {}),
          ...options,
        });
      },
    },
    sessions: {
      list: {
        useQuery(input?: Record<string, unknown>, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
          return useQuery({
            queryKey: ["coaching.sessions.list", input ?? {}],
            queryFn: async () => {
              const data = await trpcCall("coaching.sessions.list", input ?? {});
              return data;
            },
            ...options,
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
        useQuery(input?: Record<string, unknown>, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
          return useQuery({
            queryKey: ["coaching.messages.conversations", input ?? {}],
            queryFn: async () => {
              const data = await trpcCall("coaching.messages.conversations", input ?? {});
              return data;
            },
            ...options,
          });
        },
      },
      list: {
        useQuery(input?: Record<string, unknown>, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
          return useQuery({
            queryKey: ["coaching.messages.list", input ?? {}],
            queryFn: async () => {
              const data = await trpcCall("coaching.messages.list", input ?? {});
              return data;
            },
            ...options,
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
  example: {
    async hi(input?: Record<string, unknown>) {
      return trpcCall("example.hi", input ?? {});
    },
  },
  system: {
    async apiStatus(input?: Record<string, unknown>) {
      return trpcCall("system.apiStatus", input ?? {});
    },
  },
  shop: {
    async products(input?: Record<string, unknown>) {
      return trpcCall("shop.products", input ?? {});
    },
  },
  fitness: {
    async exercises(input?: Record<string, unknown>) {
      return trpcCall("fitness.exercises", input ?? {});
    },
    async generate(input: Record<string, unknown>) {
      return trpcCall("fitness.generate", input);
    },
  },
  nutrition: {
    async search(input?: Record<string, unknown>) {
      return trpcCall("nutrition.search", input ?? {});
    },
    async barcode(input: Record<string, unknown>) {
      return trpcCall("nutrition.barcode", input);
    },
    async mealPlan(input: Record<string, unknown>) {
      return trpcCall("nutrition.mealPlan", input);
    },
  },
  health: {
    async bloodwork(input: Record<string, unknown>) {
      return trpcCall("health.bloodwork", input);
    },
    async digestive(input?: Record<string, unknown>) {
      return trpcCall("health.digestive", input ?? {});
    },
    async detox(input?: Record<string, unknown>) {
      return trpcCall("health.detox", input ?? {});
    },
    async issues(input?: Record<string, unknown>) {
      return trpcCall("health.issues", input ?? {});
    },
    supplements: {
      async search(input?: Record<string, unknown>) {
        return trpcCall("health.supplements.search", input ?? {});
      },
      async barcode(input: Record<string, unknown>) {
        return trpcCall("health.supplements.barcode", input);
      },
    },
  },
  coaching: {
    async list(input?: Record<string, unknown>) {
      return trpcCall("coaching.list", input ?? {});
    },
    async clients(input?: Record<string, unknown>) {
      return trpcCall("coaching.clients", input ?? {});
    },
    async clientAttachments(input?: Record<string, unknown>) {
      return trpcCall("coaching.clientAttachments", input ?? {});
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
