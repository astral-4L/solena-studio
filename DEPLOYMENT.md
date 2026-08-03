# Deploying SOLENA anywhere

The app is a TanStack Start site. Nitro can output for every major host — pick a
preset via the `NITRO_PRESET` environment variable at build time.

| Host | Preset | Build | Start |
|---|---|---|---|
| Vercel | auto (`vercel`) | `bun run build` | managed |
| Render | `node-server` | `bun run build` | `node .output/server/index.mjs` |
| Railway | `node-server` | `bun run build` | `node .output/server/index.mjs` |
| Fly / Cloud Run / Docker | `node-server` | `Dockerfile` | `node .output/server/index.mjs` |
| Static host / Caddy / S3 | `static` | `bun run build` | serve `dist/server` |
| Lovable | default | managed | managed |

Config files included: `vercel.json`, `render.yaml`, `railway.json`, `Dockerfile`,
`Caddyfile`.

## Required environment variables

Copy `.env.example` into the host's environment settings:

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`
  — baked into the browser bundle **at build time**. If they are missing during
  the build, the admin dashboard and analytics will fail at runtime. On Docker
  pass them as `--build-arg`.
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` — used during SSR.
- `NITRO_PRESET` — deployment target (see table).

No service-role key is required; the dashboard runs entirely on row-level
security with the publishable key.

## Health check

`GET /api/public/health` returns `{"status":"ok"}` — wired into `render.yaml` and
`railway.json`, and safe to use for Fly/Cloud Run/Kubernetes probes.

## Media

All images and video are served from the public Cloud Storage bucket with
absolute URLs, so media resolves identically on every host, including
self-hosted environments.

## Verifying a deployment

Sign in at `/auth`, then open **Admin → Deployment**. That page probes the live
environment (origin, host platform, build mode, database/auth/storage/media
reachability, and the health endpoint) and reports pass/fail per check — run it
once after each new deploy target.
