import React from "react";

export type TrpcProviderProps = { children: React.ReactNode };

export const trpc = {
  Provider: ({ children }: TrpcProviderProps) => React.createElement(React.Fragment, null, children),
} as const;

export const trpcClient = null as unknown as Record<string, never>;
