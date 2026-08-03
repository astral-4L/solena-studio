import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/health")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(
          {
            status: "ok",
            service: "solena",
            runtime: typeof process !== "undefined" ? "node-compatible" : "edge",
            time: new Date().toISOString(),
          },
          { headers: { "cache-control": "no-store" } },
        );
      },
    },
  },
});
