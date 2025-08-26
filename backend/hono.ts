import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

// This app is mounted by the host at /api, so routes here should NOT prefix with /api
const app = new Hono();

// Enable CORS for all routes
app.use("*", async (c, next) => {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (c.req.method === "OPTIONS") {
    return c.text("", 200);
  }
  await next();
});

// Mount tRPC router at /trpc to match client baseUrl + /api/trpc
app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
  })
);

// Simple health check endpoint at / (host mounts at /api)
app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

export default app;