import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import viePortrait from "@/assets/vie-halo-portrait.png.asset.json";
import vieLandscape from "@/assets/vie-halo-landscape.png.asset.json";
import gravityPortrait2 from "@/assets/gravity-portrait-2.png.asset.json";
import seedPortrait from "@/assets/seed-portrait.png.asset.json";
import seedVideo from "@/assets/seed-video.mp4.asset.json";

import yirui from "@/assets/team-Yirui_Pendo.jpg.asset.json";
import michelle from "@/assets/team-michelle.jpg.asset.json";
import novy from "@/assets/team-Novy.jpg.asset.json";
import ulla from "@/assets/team-ulla.jpg.asset.json";
import kendy from "@/assets/team-kendy.jpg.asset.json";

import {
  EnvironmentCanvas,
  SolenaPage,
  type Stratum,
} from "@/components/solena/environment";
import { NavBar, Footer } from "@/components/solena/chrome";

export const Route = createFileRoute("/editorial")({
  head: () => ({
    meta: [
      { title: "Editorial Team — SOLENA" },
      {
        name: "description",
        content:
          "The editorial team of Solena: the desks, the standards they hold, and what each steward believes about building institutions that outlive their founders.",
      },
      { property: "og:title", content: "Editorial Team — SOLENA" },
      {
        property: "og:description",
        content:
          "Five desks, one standard. The people who hold Solena's editorial line.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: viePortrait.url },
      { name: "twitter:image", content: viePortrait.url },
    ],
  }),
  component: EditorialPage,
});

type Member = {
  id: string;
  code: string;
  name: string;
  role: string;
  desk: string;
  portrait: string;
  bio: string;
  quote: string;
  sectors: { slug: string; label: string }[];
};

const MEMBERS: Member[] = [
  {
    id: "ed-michelle",
    code: "DESK 01",
    name: "Michelle Wanjiru",
    role: "Editor-in-Chief",
    desk: "Standards & Admission",
    portrait: michelle.url,
    bio: "Holds the editorial line and chairs admission review. Every clause published under Solena's name passes her desk, and she is the only steward empowered to hold a cadence slot open rather than fill it.",
    quote:
      "An empty slot is a statement. We would rather publish nothing this quarter than publish something a successor has to apologise for.",
    sectors: [
      { slug: "capital", label: "Capital" },
      { slug: "media", label: "Media" },
    ],
  },
  {
    id: "ed-yirui",
    code: "DESK 02",
    name: "Yirui Pendo",
    role: "Editorial Director, Longform",
    desk: "Doctrine & Process Briefs",
    portrait: yirui.url,
    bio: "Writes the process briefs that turn Solena's doctrine into instruments a stranger could operate. Works at the pace of the archive, not the feed — most of her drafts sit for a season before they are read aloud.",
    quote:
      "If the document cannot be run by someone who never met us, it is not doctrine. It is a preference wearing a serial number.",
    sectors: [
      { slug: "real-estate", label: "Real Estate" },
      { slug: "hospitality", label: "Hotels" },
    ],
  },
  {
    id: "ed-novy",
    code: "DESK 03",
    name: "Novy Achieng",
    role: "Field Editor",
    desk: "Sectors & Instrumentation",
    portrait: novy.url,
    bio: "Reports from inside the mandates. She instruments claims before they are printed — occupancy, retention, transfer — so that every sentence about performance carries a date and a measurement behind it.",
    quote:
      "We do not describe gravity. We measure it, then wait a year and measure it again.",
    sectors: [
      { slug: "tourism", label: "Tourism" },
      { slug: "airlines", label: "Airlines" },
    ],
  },
  {
    id: "ed-ulla",
    code: "DESK 04",
    name: "Ulla Marikit",
    role: "Design Editor",
    desk: "Form, Type & Object",
    portrait: ulla.url,
    bio: "Guards the visual grammar: the micrometer marks, the bronze line, the restraint. She treats layout as governance — a page that shouts is a page that will need replacing.",
    quote:
      "Luxury is not decoration. It is the discipline of removing everything that was only there to be noticed.",
    sectors: [
      { slug: "luxury", label: "Luxury" },
      { slug: "culture", label: "Culture" },
    ],
  },
  {
    id: "ed-kendy",
    code: "DESK 05",
    name: "Kendy Mahiri",
    role: "Managing Editor, Cadence",
    desk: "Calendar & Corrections",
    portrait: kendy.url,
    bio: "Runs the living calendar and the corrections register. Keeps the studio to a cadence it can sustain for a century, and publishes every correction at the same weight as the original claim.",
    quote:
      "A correction printed quietly is a second error. We give it the same page the mistake had.",
    sectors: [
      { slug: "technology", label: "Technology" },
      { slug: "ventures", label: "Ventures" },
    ],
  },
];

const STANDARDS = [
  { k: "One desk, one signature", v: "Every published object has a named steward." },
  { k: "Dated claims", v: "Nothing about performance is printed undated." },
  { k: "Held slots", v: "An open cadence entry beats a filled one." },
  { k: "Equal corrections", v: "Errors are corrected at original weight." },
];

const STRATA: Stratum[] = [
  {
    id: "ed-hero",
    img: vieLandscape.url,
    imgPortrait: viePortrait.url,
    scale: 1.6,
    blend: "screen",
    baseOpacity: 0.46,
    depth: 0.18,
    origin: "50% 38%",
  },
  {
    id: "ed-novy",
    img: gravityPortrait2.url,
    imgPortrait: gravityPortrait2.url,
    scale: 1.7,
    blend: "soft-light",
    baseOpacity: 0.26,
    depth: 0.24,
    origin: "62% 50%",
  },
  {
    id: "ed-contact",
    img: seedPortrait.url,
    imgPortrait: seedPortrait.url,
    scale: 1.9,
    blend: "screen",
    baseOpacity: 0.2,
    depth: 0.16,
    origin: "42% 55%",
  },
];

function EditorialPage() {
  return (
    <SolenaPage strata={STRATA}>
      <EnvironmentCanvas
        strata={STRATA}
        videos={[
          {
            id: "ed-seed",
            src: seedVideo.url,
            zone: "ed-hero",
            peakOpacity: 0.22,
          },
        ]}
      />
      <NavBar />

      <main className="relative z-10">
        <section
          data-zone="ed-hero"
          data-section="ed-hero"
          data-section-label="Editorial"
          className="relative flex min-h-[70vh] items-end px-6 pb-16 pt-40 md:px-12"
        >
          <div className="mx-auto w-full max-w-6xl">
            <p className="eyebrow mb-8">VI — The Stewards</p>
            <h1 className="font-display text-5xl font-extralight leading-[1.02] tracking-tight text-ivory sm:text-7xl md:text-[7.5rem]">
              The
              <br />
              <span className="font-signature italic text-bronze-glow">
                Editorial Team.
              </span>
            </h1>
            <p className="mt-10 max-w-xl text-base leading-relaxed text-stone/85 md:text-lg">
              Five desks hold the line between what Solena believes and what
              Solena prints. Each steward owns a standard, a set of sectors in
              the orbit, and a signature that outlasts the argument.
            </p>
          </div>
        </section>

        <section
          data-section="ed-standards"
          data-section-label="Standards"
          data-section-level={2}
          className="px-6 md:px-12"
        >
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-12 gap-y-10 border-t border-ivory/10 py-20 sm:grid-cols-2 lg:grid-cols-4">
            {STANDARDS.map((s) => (
              <div key={s.k}>
                <p className="text-[0.55rem] uppercase tracking-[0.42em] text-stone/55">
                  {s.k}
                </p>
                <p className="mt-4 text-sm font-light leading-relaxed text-ivory/85">
                  {s.v}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="px-6 md:px-12">
          <div className="mx-auto max-w-6xl">
            {MEMBERS.map((m, i) => (
              <section
                key={m.id}
                data-zone={m.id}
                data-section={m.id}
                data-section-label={m.name}
                data-section-level={2}
                className={`relative grid grid-cols-1 items-start gap-10 border-t border-ivory/10 py-20 md:gap-16 md:py-28 ${
                  i % 2 === 0
                    ? "md:grid-cols-[18rem_1fr]"
                    : "md:grid-cols-[1fr_18rem]"
                }`}
              >
                <figure
                  className={`glass relative overflow-hidden ${i % 2 === 0 ? "" : "md:order-2"}`}
                >
                  <img
                    src={m.portrait}
                    alt={`${m.name}, ${m.role} at Solena`}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover opacity-90 grayscale-[35%] transition-all duration-1000 hover:opacity-100 hover:grayscale-0"
                  />
                  <figcaption className="absolute bottom-0 left-0 right-0 bg-obsidian/60 px-4 py-3 text-[0.55rem] uppercase tracking-[0.38em] text-stone/70 backdrop-blur">
                    {m.code} · {m.desk}
                  </figcaption>
                </figure>

                <div className={i % 2 === 0 ? "" : "md:order-1"}>
                  <p className="text-[0.55rem] uppercase tracking-[0.42em] text-stone/55">
                    {m.role}
                  </p>
                  <h2 className="excavate mt-4 font-display text-3xl font-light leading-tight text-ivory sm:text-4xl md:text-5xl">
                    <span>{m.name}</span>
                  </h2>
                  <p className="mt-8 max-w-2xl text-base leading-relaxed text-stone/85 md:text-lg">
                    {m.bio}
                  </p>

                  <blockquote className="mt-10 max-w-2xl border-l border-bronze/40 pl-6">
                    <p className="font-signature text-lg italic leading-relaxed text-ivory/90 md:text-xl">
                      “{m.quote}”
                    </p>
                  </blockquote>

                  <div className="mt-10 flex flex-wrap items-center gap-6">
                    <span className="text-[0.55rem] uppercase tracking-[0.42em] text-stone/55">
                      Orbit
                    </span>
                    {m.sectors.map((s) => (
                      <Link
                        key={s.slug}
                        to="/sectors/$sector"
                        params={{ sector: s.slug }}
                        className="bronze-line border-b border-stone/25 pb-1 text-[0.6rem] uppercase tracking-[0.36em] text-ivory hover:text-bronze-glow"
                      >
                        {s.label} →
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>

        <section
          data-zone="ed-contact"
          data-section="ed-contact"
          data-section-label="Reach a desk"
          className="relative px-6 py-32 md:px-12"
        >
          <div className="mx-auto grid max-w-6xl gap-16 border-t border-ivory/10 pt-20 md:grid-cols-[1.1fr_1fr]">
            <EditorialForm />
            <aside className="space-y-10">
              <div>
                <p className="eyebrow mb-4">Editorial desk</p>
                <p className="font-display text-2xl font-light text-ivory">
                  editorial@solena.co
                </p>
              </div>
              <div>
                <p className="eyebrow mb-4">Corrections</p>
                <p className="max-w-sm text-sm leading-relaxed text-stone/80">
                  Send the claim, the date, and the evidence. Corrections are
                  published at the same weight as the original.
                </p>
              </div>
              <div>
                <p className="eyebrow mb-4">Cadence</p>
                <p className="max-w-sm text-sm leading-relaxed text-stone/80">
                  Pitches are reviewed against the living calendar. We reply
                  within five business days.
                </p>
              </div>
              <Link
                to="/calendar"
                className="bronze-line inline-block border-b border-stone/30 pb-2 text-[0.65rem] uppercase tracking-[0.4em] text-ivory hover:text-bronze-glow"
              >
                Editorial Calendar →
              </Link>
            </aside>
          </div>
        </section>

        <Footer />
      </main>
    </SolenaPage>
  );
}

const pitchSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  organization: z.string().trim().max(150).optional(),
  email: z.string().trim().email("Enter a valid email").max(255),
  desk: z.string().trim().max(100),
  message: z.string().trim().min(1, "Add a short note").max(2000),
});

function EditorialForm() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = pitchSchema.safeParse({
      name: fd.get("name"),
      organization: fd.get("org") || undefined,
      email: fd.get("email"),
      desk: fd.get("desk") || "Any desk",
      message: fd.get("msg"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: parsed.data.name,
        organization: parsed.data.organization ?? null,
        email: parsed.data.email,
        message: `[Editorial · ${parsed.data.desk}] ${parsed.data.message}`,
        user_agent:
          typeof navigator !== "undefined"
            ? navigator.userAgent.slice(0, 500)
            : null,
      });
      if (error) throw error;
      setSent(true);
      form.reset();
      toast.success("Received. The desk replies within five business days.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="glass flex flex-col items-start justify-center gap-4 p-12">
        <p className="eyebrow">Received</p>
        <p className="font-display text-2xl font-light text-ivory">
          Thank you. The desk will be in touch.
        </p>
        <button
          onClick={() => setSent(false)}
          className="text-xs uppercase tracking-[0.35em] text-stone/60 hover:text-bronze-glow"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="glass space-y-8 p-8 md:p-12" onSubmit={onSubmit}>
      <div>
        <p className="eyebrow mb-2">Reach a desk</p>
        <p className="text-sm leading-relaxed text-stone/75">
          Pitches, corrections, and requests for the record.
        </p>
      </div>
      {[
        { id: "name", label: "Name", type: "text", required: true },
        { id: "org", label: "Organization", type: "text", required: false },
        { id: "email", label: "Email", type: "email", required: true },
      ].map((f) => (
        <div key={f.id}>
          <label
            htmlFor={`ed-${f.id}`}
            className="block text-[0.6rem] uppercase tracking-[0.4em] text-stone/60"
          >
            {f.label}
          </label>
          <input
            id={`ed-${f.id}`}
            name={f.id}
            type={f.type}
            required={f.required}
            className="mt-3 w-full border-b border-ivory/15 bg-transparent pb-3 font-display text-xl font-light text-ivory placeholder:text-stone/40 focus:border-bronze-glow focus:outline-none"
          />
        </div>
      ))}
      <div>
        <label
          htmlFor="ed-desk"
          className="block text-[0.6rem] uppercase tracking-[0.4em] text-stone/60"
        >
          Desk
        </label>
        <select
          id="ed-desk"
          name="desk"
          defaultValue="Any desk"
          className="mt-3 w-full border-b border-ivory/15 bg-transparent pb-3 font-display text-lg font-light text-ivory focus:border-bronze-glow focus:outline-none"
        >
          {["Any desk", ...MEMBERS.map((m) => `${m.desk} — ${m.name}`)].map(
            (d) => (
              <option key={d} value={d} className="bg-obsidian text-ivory">
                {d}
              </option>
            ),
          )}
        </select>
      </div>
      <div>
        <label
          htmlFor="ed-msg"
          className="block text-[0.6rem] uppercase tracking-[0.4em] text-stone/60"
        >
          Note
        </label>
        <textarea
          id="ed-msg"
          name="msg"
          rows={5}
          required
          className="mt-3 w-full resize-none border-b border-ivory/15 bg-transparent pb-3 font-display text-lg font-light text-ivory placeholder:text-stone/40 focus:border-bronze-glow focus:outline-none"
          placeholder="What should the record contain?"
        />
      </div>
      <button
        type="submit"
        disabled={busy}
        className="bronze-line inline-flex items-center gap-4 border-b border-stone/30 pb-2 text-xs uppercase tracking-[0.45em] text-ivory transition-colors duration-700 hover:text-bronze-glow disabled:opacity-50"
      >
        <span>{busy ? "Sending…" : "Send to Desk"}</span>
        <span aria-hidden className="text-bronze">
          →
        </span>
      </button>
    </form>
  );
}
