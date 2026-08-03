# Cross-platform image: works on Railway, Render, Fly.io, Cloud Run, any Docker host.
FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock* bunfig.toml ./
RUN bun install --frozen-lockfile || bun install
COPY . .
ENV NITRO_PRESET=node-server
# Public (VITE_*) values are baked at build time — pass them as build args.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_SUPABASE_PROJECT_ID
RUN bun run build

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
