import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

app.use("*", async (c, next) => {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (c.req.method === "OPTIONS") {
    return c.text("", 200);
  }
  await next();
});

// Support both /trpc/* and /api/trpc/* to avoid 404s regardless of mount path
const trpcHandler = trpcServer({ router: appRouter, createContext });
app.use("/trpc/*", trpcHandler);
app.use("/api/trpc/*", trpcHandler);

// Health checks at both / and /api
app.get("/", (c) => c.json({ status: "ok", message: "API is running" }));
app.get("/api", (c) => c.json({ status: "ok", message: "API root ok" }));

export default app;