import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/admin/deployment")({
  ssr: false,
  component: DeploymentPage,
});

type Check = {
  key: string;
  label: string;
  detail: string;
  status: "pending" | "pass" | "fail";
};

function detectPlatform(host: string): string {
  if (host.includes("localhost") || host.includes("127.0.0.1")) return "Local dev";
  if (host.includes("lovable.app")) return "Lovable";
  if (host.includes("vercel.app")) return "Vercel";
  if (host.includes("onrender.com")) return "Render";
  if (host.includes("up.railway.app") || host.includes("railway.app")) return "Railway";
  if (host.includes("fly.dev")) return "Fly.io";
  if (host.includes("netlify.app")) return "Netlify";
  if (host.includes("pages.dev") || host.includes("workers.dev")) return "Cloudflare";
  if (host.includes("run.app")) return "Cloud Run";
  return "Custom host";
}

function Row({ c }: { c: Check }) {
  return (
    <div className="flex items-start gap-4 border-b border-ivory/5 px-6 py-4 last:border-0">
      <span className="mt-0.5 shrink-0">
        {c.status === "pending" ? (
          <Loader2 size={15} className="animate-spin text-stone/50" />
        ) : c.status === "pass" ? (
          <CheckCircle2 size={15} className="text-bronze-glow" />
        ) : (
          <XCircle size={15} className="text-red-400" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-ivory">{c.label}</p>
        <p className="mt-1 break-words text-xs text-stone/60">{c.detail}</p>
      </div>
    </div>
  );
}

function DeploymentPage() {
  const [env, setEnv] = useState<Record<string, string>>({});
  const [checks, setChecks] = useState<Check[]>([]);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    const host = window.location.host;
    setEnv({
      Platform: detectPlatform(host),
      Origin: window.location.origin,
      Protocol: window.location.protocol.replace(":", ""),
      Mode: import.meta.env.MODE,
      "Backend project": import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "not set",
      "Backend URL": import.meta.env.VITE_SUPABASE_URL ? "configured" : "MISSING",
      "Publishable key": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? "configured" : "MISSING",
      Language: navigator.language,
      Timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    const initial: Check[] = [
      { key: "env", label: "Build-time backend credentials", detail: "Checking bundled VITE_ values…", status: "pending" },
      { key: "db", label: "Database read (RLS)", detail: "Querying page_views…", status: "pending" },
      { key: "write", label: "Analytics write path", detail: "Inserting a diagnostic page view…", status: "pending" },
      { key: "auth", label: "Auth session", detail: "Resolving current session…", status: "pending" },
      { key: "realtime", label: "Realtime channel", detail: "Subscribing to submissions channel…", status: "pending" },
      { key: "health", label: "Health endpoint /api/public/health", detail: "Requesting…", status: "pending" },
      { key: "media", label: "Global media delivery", detail: "Fetching a hero asset…", status: "pending" },
    ];
    setChecks(initial);

    const set = (key: string, status: "pass" | "fail", detail: string) =>
      setChecks((cs) => cs.map((c) => (c.key === key ? { ...c, status, detail } : c)));

    async function run() {
      // env
      const hasEnv = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
      set("env", hasEnv ? "pass" : "fail", hasEnv
        ? "VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY were present at build time."
        : "Missing at build time. Set them in the host's env vars and rebuild (they are baked into the bundle).");

      // db read
      try {
        const { count, error } = await supabase.from("page_views").select("*", { count: "exact", head: true });
        if (error) throw error;
        set("db", "pass", `Reachable — ${count ?? 0} page views stored.`);
      } catch (e) {
        set("db", "fail", e instanceof Error ? e.message : "Read failed.");
      }

      // write
      try {
        const { error } = await supabase.from("page_views").insert({
          path: "/admin/deployment/_diagnostic",
          device: "diagnostic",
          session_id: "diagnostic",
          user_agent: navigator.userAgent.slice(0, 500),
        });
        if (error) throw error;
        set("write", "pass", "Anonymous insert accepted — visitor tracking will work on this host.");
      } catch (e) {
        set("write", "fail", e instanceof Error ? e.message : "Insert rejected.");
      }

      // auth
      try {
        const { data } = await supabase.auth.getSession();
        set("auth", data.session ? "pass" : "fail", data.session
          ? `Session active for ${data.session.user.email ?? "user"} — token refresh working.`
          : "No session resolved on this origin.");
      } catch (e) {
        set("auth", "fail", e instanceof Error ? e.message : "Session lookup failed.");
      }

      // realtime
      await new Promise<void>((resolve) => {
        let done = false;
        const ch = supabase.channel(`diag-${Date.now()}`).subscribe((status) => {
          if (done) return;
          if (status === "SUBSCRIBED") {
            done = true;
            set("realtime", "pass", "WebSocket connected — live submission alerts will arrive.");
            supabase.removeChannel(ch);
            resolve();
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            done = true;
            set("realtime", "fail", `Channel status: ${status}. Check that the host allows WebSocket upgrades.`);
            supabase.removeChannel(ch);
            resolve();
          }
        });
        setTimeout(() => {
          if (!done) {
            done = true;
            set("realtime", "fail", "Timed out after 8s — proxy may be blocking WebSockets.");
            supabase.removeChannel(ch);
            resolve();
          }
        }, 8000);
      });

      // health endpoint
      try {
        const t0 = performance.now();
        const res = await fetch("/api/public/health", { cache: "no-store" });
        const ms = Math.round(performance.now() - t0);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = (await res.json()) as { status?: string; runtime?: string };
        set("health", "pass", `200 OK in ${ms}ms · runtime ${body.runtime ?? "unknown"} — safe for host health probes.`);
      } catch (e) {
        set("health", "fail", `${e instanceof Error ? e.message : "Request failed"} — static-only hosts will not serve this route.`);
      }

      // media
      try {
        const el = document.querySelector<HTMLImageElement>("img[src^='http']");
        const url = el?.src ?? "/robots.txt";
        const t0 = performance.now();
        const res = await fetch(url, { method: "GET", cache: "no-store" });
        const ms = Math.round(performance.now() - t0);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        set("media", "pass", `Asset fetched in ${ms}ms from ${new URL(url, window.location.origin).host}.`);
      } catch (e) {
        set("media", "fail", e instanceof Error ? e.message : "Asset fetch failed.");
      }
    }

    void run();
  }, [nonce]);

  const passed = checks.filter((c) => c.status === "pass").length;
  const failed = checks.filter((c) => c.status === "fail").length;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Infrastructure</p>
          <h1 className="mt-2 font-display text-3xl font-extralight text-ivory">Deployment Diagnostics</h1>
          <p className="mt-1 text-sm text-stone/60">
            Live probe of this host — run after every deploy to Vercel, Render, Railway or self-hosted.
          </p>
        </div>
        <button
          onClick={() => setNonce((n) => n + 1)}
          className="inline-flex items-center gap-2 border border-ivory/20 px-4 py-2 text-[0.65rem] uppercase tracking-[0.35em] text-ivory hover:border-bronze-glow hover:text-bronze-glow"
        >
          <RefreshCw size={13} /> Re-run
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass p-5">
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Passing</p>
          <p className="mt-2 font-display text-3xl text-ivory">{passed}</p>
        </div>
        <div className="glass p-5">
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Failing</p>
          <p className={`mt-2 font-display text-3xl ${failed ? "text-red-300" : "text-ivory"}`}>{failed}</p>
        </div>
        <div className="glass p-5">
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Platform</p>
          <p className="mt-2 font-display text-2xl text-ivory">{env["Platform"] ?? "—"}</p>
        </div>
      </div>

      <div className="glass overflow-hidden">
        <p className="border-b border-ivory/10 px-6 py-4 text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">
          Runtime checks
        </p>
        {checks.map((c) => <Row key={c.key} c={c} />)}
      </div>

      <div className="glass overflow-hidden">
        <p className="border-b border-ivory/10 px-6 py-4 text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">
          Environment
        </p>
        <dl className="divide-y divide-ivory/5">
          {Object.entries(env).map(([k, v]) => (
            <div key={k} className="flex flex-wrap items-baseline justify-between gap-2 px-6 py-3">
              <dt className="text-xs uppercase tracking-[0.3em] text-stone/50">{k}</dt>
              <dd className={`break-all text-sm ${v === "MISSING" ? "text-red-300" : "text-ivory"}`}>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
