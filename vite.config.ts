// @lovable.dev/vite-tanstack-config already includes tanstackStart, viteReact, tailwind,
// tsConfigPaths, nitro (default cloudflare-module), VITE_* env injection, @ path alias,
// React/TanStack dedupe, error logger plugins, and sandbox detection.
//
// Cross-platform deployment:
//   - Vercel                -> auto-detected (`vercel` preset, .vercel/output)
//   - Render / Railway /    -> set NITRO_PRESET=node-server (runs .output/server/index.mjs)
//     Fly / Docker / any Node host
//   - Static hosts / Caddy  -> set NITRO_PRESET=static (serves dist/server)
//   - Lovable / default     -> cloudflare-module
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const preset =
  process.env.NITRO_PRESET ?? (process.env.VERCEL ? "vercel" : undefined);

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  ...(preset ? { nitro: { preset } } : {}),
});
