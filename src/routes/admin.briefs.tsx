import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { generateEditorialBrief } from "@/lib/briefs.functions";
import { SECTORS } from "@/components/solena/orbital";

export const Route = createFileRoute("/admin/briefs")({
  ssr: false,
  component: BriefsPage,
});

const DESKS = [
  { slug: "michelle", label: "Michelle Wanjiru — Standards & Admission" },
  { slug: "yirui", label: "Yirui Pendo — Doctrine & Process Briefs" },
  { slug: "novy", label: "Novy Achieng — Sectors & Instrumentation" },
  { slug: "ulla", label: "Ulla Marikit — Form, Type & Object" },
  { slug: "kendy", label: "Kendy Mahiri — Calendar & Corrections" },
] as const;

const field =
  "mt-2 w-full border-b border-ivory/15 bg-transparent pb-2 text-ivory focus:border-bronze-glow focus:outline-none";
const label = "block text-[0.6rem] uppercase tracking-[0.4em] text-stone/60";

function BriefsPage() {
  const run = useServerFn(generateEditorialBrief);
  const [desk, setDesk] = useState<(typeof DESKS)[number]["slug"]>("novy");
  const [sector, setSector] = useState(SECTORS[0].name);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [brief, setBrief] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await run({ data: { desk, sector, title: title || undefined, notes } });
      setBrief(res.brief);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate the brief");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Research desk</p>
        <h1 className="mt-2 font-display text-3xl font-extralight text-ivory">Editorial Briefs</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone/70">
          Submit raw research notes for a sector. AI-powered drafting turns them into a brief written to the chosen desk's standard.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={submit} className="glass space-y-6 p-6">
          <div>
            <label className={label} htmlFor="b-desk">Desk</label>
            <select id="b-desk" value={desk} onChange={(e) => setDesk(e.target.value as typeof desk)} className={field}>
              {DESKS.map((d) => (
                <option key={d.slug} value={d.slug} className="bg-obsidian">{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="b-sector">Sector</label>
            <select id="b-sector" value={sector} onChange={(e) => setSector(e.target.value)} className={field}>
              {SECTORS.map((s) => (
                <option key={s.slug} value={s.name} className="bg-obsidian">{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="b-title">Working title (optional)</label>
            <input id="b-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={160} className={field} />
          </div>
          <div>
            <label className={label} htmlFor="b-notes">Research notes</label>
            <textarea
              id="b-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={12}
              maxLength={12000}
              required
              placeholder="Field observations, figures with dates, sources, quotes…"
              className={`${field} resize-y text-sm`}
            />
            <p className="mt-1 text-right text-[0.6rem] text-stone/50">{notes.length} / 12000</p>
          </div>
          <button
            type="submit"
            disabled={busy || notes.trim().length < 40}
            className="border border-ivory/20 px-5 py-2 text-xs uppercase tracking-[0.35em] text-ivory hover:border-bronze-glow hover:text-bronze-glow disabled:opacity-40"
          >
            {busy ? "Drafting brief…" : "Generate brief"}
          </button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>

        <section className="glass flex min-h-[24rem] flex-col p-6">
          <div className="flex items-center justify-between">
            <p className={label}>Brief</p>
            {brief && (
              <button
                onClick={() => navigator.clipboard.writeText(brief).then(() => toast.success("Copied"))}
                className="text-[0.6rem] uppercase tracking-[0.35em] text-stone/60 hover:text-bronze-glow"
              >
                Copy
              </button>
            )}
          </div>
          {busy ? (
            <p className="m-auto text-sm text-stone/60">The desk is reading your notes…</p>
          ) : brief ? (
            <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-relaxed text-stone/90">{brief}</pre>
          ) : (
            <p className="m-auto text-sm text-stone/50">Your brief will appear here.</p>
          )}
        </section>
      </div>
    </div>
  );
}
