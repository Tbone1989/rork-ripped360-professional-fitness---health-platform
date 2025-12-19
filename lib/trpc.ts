import React, { ReactNode } from "react";
import { useQuery, useMutation, UseQueryOptions } from "@tanstack/react-query";

export type TrpcProviderProps = { children: ReactNode };

function getWebOrigin(): string {
  try {
    const origin =
      typeof globalThis !== "undefined" && (globalThis as any)?.location?.origin
        ? String((globalThis as any).location.origin)
        : "";
    if (origin) return origin;
  } catch {}
  return "";
}

export function getApiBaseUrl(): string {
  const envUrl = (process.env.EXPO_PUBLIC_RORK_API_BASE_URL ?? "").trim();
  if (envUrl) return envUrl.replace(/\/+$/, "");

  const origin = getWebOrigin();
  if (origin) return origin.replace(/\/+$/, "");

  return "";
}

function getTrpcBaseUrl(): string {
  const base = getApiBaseUrl();
  if (!base) return "";

  // If base already points at a Rork project endpoint like .../api/p/<projectId>,
  // the backend is exposed under /trpc.
  if (base.includes("/api/p/")) return `${base}/trpc`;

  // Otherwise assume same-origin backend with /api/trpc mounted.
  return `${base}/api/trpc`;
}

async function trpcCall(path: string, input?: unknown): Promise<any> {
  const base = getTrpcBaseUrl();
  const url = base ? `${base}/${path}` : `/api/trpc/${path}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ input }),
    });

    const json = await res.json().catch(() => ({} as any));
    const data = (json?.result?.data ?? json?.data ?? json) as unknown;

    if (!res.ok) {
      const message = (json as any)?.error?.message ?? `HTTP ${res.status}`;
      throw new Error(message);
    }

    return data;
  } catch (e) {
    console.log("trpcCall error", { url, path, e });
    throw e;
  }
}

export const trpc = {
  Provider: ({ children }: TrpcProviderProps) => React.createElement(React.Fragment, null, children),
  example: {
    hi: {
      useMutation() {
        return useMutation({
          mutationFn: async (input: Record<string, unknown>) => trpcCall("example.hi", input),
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
      useQuery(input?: Record<string, unknown>, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
        return useQuery({
          queryKey: ["nutrition.barcode", input ?? {}],
          queryFn: async () => trpcCall("nutrition.barcode", input ?? {}),
          ...options,
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
      useMutation() {
        return useMutation({
          mutationFn: async (input: Record<string, unknown>) => trpcCall("health.digestive", input),
        });
      },
    },
    detox: {
      useMutation() {
        return useMutation({
          mutationFn: async (input: Record<string, unknown>) => trpcCall("health.detox", input),
        });
      },
    },
    issues: {
      useMutation() {
        return useMutation({
          mutationFn: async (input: Record<string, unknown>) => trpcCall("health.issues", input),
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

type TrpcQueryFn<TInput extends Record<string, unknown> | undefined, TOutput> = (input?: TInput) => Promise<TOutput>;

type TrpcQueryWrapper<TInput extends Record<string, unknown> | undefined, TOutput> = {
  query: TrpcQueryFn<TInput, TOutput>;
};

type TrpcMutationWrapper<TInput extends Record<string, unknown>, TOutput> = {
  mutate: (input: TInput) => Promise<TOutput>;
};

export const trpcClient = {
  example: {
    hi: {
      mutate: (input: Record<string, unknown>) => trpcCall("example.hi", input),
    } satisfies TrpcMutationWrapper<Record<string, unknown>, unknown>,
  },
  system: {
    apiStatus: {
      query: (input?: Record<string, unknown>) => trpcCall("system.apiStatus", input ?? {}),
    } satisfies TrpcQueryWrapper<Record<string, unknown> | undefined, unknown>,
  },
  shop: {
    products: {
      query: (input?: Record<string, unknown>) => trpcCall("shop.products", input ?? {}),
    } satisfies TrpcQueryWrapper<Record<string, unknown> | undefined, unknown>,
  },
  fitness: {
    exercises: {
      query: (input?: Record<string, unknown>) => trpcCall("fitness.exercises", input ?? {}),
    } satisfies TrpcQueryWrapper<Record<string, unknown> | undefined, unknown>,
    generate: {
      mutate: (input: Record<string, unknown>) => trpcCall("fitness.generate", input),
    } satisfies TrpcMutationWrapper<Record<string, unknown>, unknown>,
  },
  nutrition: {
    search: {
      query: (input?: Record<string, unknown>) => trpcCall("nutrition.search", input ?? {}),
    } satisfies TrpcQueryWrapper<Record<string, unknown> | undefined, unknown>,
    barcode: {
      query: (input?: Record<string, unknown>) => trpcCall("nutrition.barcode", input ?? {}),
    } satisfies TrpcQueryWrapper<Record<string, unknown> | undefined, unknown>,
    mealPlan: {
      mutate: (input: Record<string, unknown>) => trpcCall("nutrition.mealPlan", input),
    } satisfies TrpcMutationWrapper<Record<string, unknown>, unknown>,
  },
  health: {
    bloodwork: {
      mutate: (input: Record<string, unknown>) => trpcCall("health.bloodwork", input),
    } satisfies TrpcMutationWrapper<Record<string, unknown>, unknown>,
    digestive: {
      mutate: (input: Record<string, unknown>) => trpcCall("health.digestive", input),
    } satisfies TrpcMutationWrapper<Record<string, unknown>, unknown>,
    detox: {
      mutate: (input: Record<string, unknown>) => trpcCall("health.detox", input),
    } satisfies TrpcMutationWrapper<Record<string, unknown>, unknown>,
    issues: {
      mutate: (input: Record<string, unknown>) => trpcCall("health.issues", input),
    } satisfies TrpcMutationWrapper<Record<string, unknown>, unknown>,
    supplements: {
      search: {
        query: (input?: Record<string, unknown>) => trpcCall("health.supplements.search", input ?? {}),
      } satisfies TrpcQueryWrapper<Record<string, unknown> | undefined, unknown>,
      barcode: {
        mutate: (input: Record<string, unknown>) => trpcCall("health.supplements.barcode", input),
      } satisfies TrpcMutationWrapper<Record<string, unknown>, unknown>,
    },
  },
  coaching: {
    list: {
      query: (input?: Record<string, unknown>) => trpcCall("coaching.list", input ?? {}),
    } satisfies TrpcQueryWrapper<Record<string, unknown> | undefined, unknown>,
    clients: {
      query: (input?: Record<string, unknown>) => trpcCall("coaching.clients", input ?? {}),
    } satisfies TrpcQueryWrapper<Record<string, unknown> | undefined, unknown>,
    clientAttachments: {
      query: (input?: Record<string, unknown>) => trpcCall("coaching.clientAttachments", input ?? {}),
    } satisfies TrpcQueryWrapper<Record<string, unknown> | undefined, unknown>,
    sessions: {
      list: {
        query: (input?: Record<string, unknown>) => trpcCall("coaching.sessions.list", input ?? {}),
      } satisfies TrpcQueryWrapper<Record<string, unknown> | undefined, unknown>,
      book: {
        mutate: (input: Record<string, unknown>) => trpcCall("coaching.sessions.book", input),
      } satisfies TrpcMutationWrapper<Record<string, unknown>, unknown>,
    },
    messages: {
      conversations: {
        query: (input?: Record<string, unknown>) => trpcCall("coaching.messages.conversations", input ?? {}),
      } satisfies TrpcQueryWrapper<Record<string, unknown> | undefined, unknown>,
      list: {
        query: (input?: Record<string, unknown>) => trpcCall("coaching.messages.list", input ?? {}),
      } satisfies TrpcQueryWrapper<Record<string, unknown> | undefined, unknown>,
      send: {
        mutate: (input: Record<string, unknown>) => trpcCall("coaching.messages.send", input),
      } satisfies TrpcMutationWrapper<Record<string, unknown>, unknown>,
    },
  },
} as const;
