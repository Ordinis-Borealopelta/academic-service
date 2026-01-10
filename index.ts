import { serve } from "bun";
import { Hono } from "hono";

const app = new Hono();

const port = Bun.env.ACADEMIC_PORT || 4001;

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

serve({
  fetch: app.fetch,
  port,
  error: (error) => {
    console.error("Academic service error:", error.message);
  },
});

console.log(`Academic service started at http://localhost:${port}`);
