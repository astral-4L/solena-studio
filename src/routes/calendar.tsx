import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import resonancePortrait from "@/assets/resonance-portrait.png.asset.json";
import gravityLandscape from "@/assets/gravity-landscape.png.asset.json";
import gravityPortrait from "@/assets/gravity-portrait.png.asset.json";
import viePortrait2 from "@/assets/vie-portrait-2.png.asset.json";
import resonanceVideo from "@/assets/resonance-video.mp4.asset.json";

import {
  EnvironmentCanvas,
  SolenaPage,
  type Stratum,
} from "@/components/solena/environment";
import { NavBar, Footer } from "@/components/solena/chrome";
import { SECTORS } from "@/components/solena/orbital";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Editorial Calendar — SOLENA" },
      {
        name: "description",
        content:
          "A living editorial calendar: the cadence of essays, dispatches, and sector briefs Solena publishes across the year.",
      },
      { property: "og:title", content: "The Editorial Calendar — SOLENA" },
      {
        property: "og:description",
        content:
          "A cadence the studio can sustain for a century. Published, dated, and open.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: resonancePortrait.url },
      { name: "twitter:image", content: resonancePortrait.url },
    ],
  }),
  component: CalendarPage,
});

type Status = "published" | "in-studio" | "scheduled" | "open";

type Entry = {
  id: string;
  cycle: string;
  window: string;
  title: string;
  format: string;
  sector: string | null;
  status: Status;
  note: string;
};

const STATUS_LABEL: Record<Status, string> = {
  published: "Published",
  "in-studio": "In studio",
  scheduled: "Scheduled",
  open: "Held open",
};

const ENTRIES: Entry[] = [
  {
    id: "c-01",
    cycle: "Cycle I",
    window: "Jan — Feb",
    title: "On the Architecture of Patience",
    format: "Essay · 12 min",
    sector: null,
    status: "published",
    note: "Opening instrument of the year. Sets the reading frame for every brief that follows.",
  },
  {
    id: "c-02",
    cycle: "Cycle I",
    window: "Feb",
    title: "Buildings as Gravity Wells",
    format: "Sector brief",
    sector: "real-estate",
    status: "published",
    note: "First of the sector briefs — the built environment graded on irreversibility.",
  },
  {
    id: "c-03",
    cycle: "Cycle II",
    window: "Mar — Apr",
    title: "Why Markets Misprice Silence",
    format: "Thesis · 8 min",
    sector: null,
    status: "published",
    note: "Restraint as an asset class. Instrumented with the decay curve.",
  },
  {
    id: "c-04",
    cycle: "Cycle II",
    window: "Apr",
    title: "Tools Built as Artifacts",
    format: "Sector brief",
    sector: "technology",
    status: "published",
    note: "Software judged by the transfer test rather than adoption velocity.",
  },
  {
    id: "c-05",
    cycle: "Cycle III",
    window: "May — Jun",
    title: "Service Designed as Ritual",
    format: "Sector brief",
    sector: "hospitality",
    status: "published",
    note: "Hotels as the most legible test of designed ritual at scale.",
  },
  {
    id: "c-06",
    cycle: "Cycle III",
    window: "Jun",
    title: "Engineering the Heirloom Brand",
    format: "Case · 18 min",
    sector: "luxury",
    status: "in-studio",
    note: "Longest instrument of the year; the transfer test written out in full.",
  },
  {
    id: "c-07",
    cycle: "Cycle IV",
    window: "Jul — Aug",
    title: "Channels That Operate as Institutions",
    format: "Sector brief",
    sector: "media",
    status: "in-studio",
    note: "Media graded as infrastructure rather than distribution.",
  },
  {
    id: "c-08",
    cycle: "Cycle IV",
    window: "Aug",
    title: "Patient Money, Stated Plainly",
    format: "Doctrine note",
    sector: "capital",
    status: "scheduled",
    note: "Companion reading to the Capital Doctrine in the governance set.",
  },
  {
    id: "c-09",
    cycle: "Cycle V",
    window: "Sep — Oct",
    title: "Vehicles as Heirloom-Grade Objects",
    format: "Sector brief",
    sector: "automotive",
    status: "scheduled",
    note: "Motion bloc, part one. Cabin and object graded on the same criteria as a building.",
  },
  {
    id: "c-10",
    cycle: "Cycle V",
    window: "Oct",
    title: "Air Travel Restored to Ritual",
    format: "Sector brief",
    sector: "airlines",
    status: "scheduled",
    note: "Motion bloc, part two.",
  },
  {
    id: "c-11",
    cycle: "Cycle VI",
    window: "Nov",
    title: "Journeys Engineered to Be Remembered",
    format: "Sector brief",
    sector: "tourism",
    status: "scheduled",
    note: "Motion bloc, part three. Closes the 2026 sector sequence.",
  },
  {
    id: "c-12",
    cycle: "Cycle VI",
    window: "Dec",
    title: "Held open",
    format: "Reserved slot",
    sector: null,
    status: "open",
    note: "Deliberately unfilled. Editorial Standard 4.1 — an empty entry is preferable to a filled one.",
  },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "published", label: STATUS_LABEL.published },
  { id: "in-studio", label: STATUS_LABEL["in-studio"] },
  { id: "scheduled", label: STATUS_LABEL.scheduled },
  { id: "open", label: STATUS_LABEL.open },
] as const;

const CADENCE = [
  { k: "Cycles", v: "Six per year" },
  { k: "Instruments", v: "12 planned · 1 held open" },
  { k: "Minimum", v: "One sector brief per cycle" },
  { k: "Standard", v: "DOC 04 — Editorial" },
];

const STRATA: Stratum[] = [
  {
    id: "c-hero",
    img: resonancePortrait.url,
    imgPortrait: resonancePortrait.url,
    scale: 1.55,
    blend: "screen",
    baseOpacity: 0.44,
    depth: 0.18,
    origin: "50% 40%",
  },
  {
    id: "c-grid",
    img: gravityLandscape.url,
    imgPortrait: gravityPortrait.url,
    scale: 1.7,
    blend: "soft-light",
    baseOpacity: 0.26,
    depth: 0.24,
    origin: "45% 50%",
  },
  {
    id: "c-coda",
    img: viePortrait2.url,
    imgPortrait: viePortrait2.url,
    scale: 1.9,
    blend: "screen",
    baseOpacity: 0.18,
    depth: 0.14,
    origin: "55% 55%",
  },
];

function sectorName(slug: string | null) {
  if (!slug) return null;
  return SECTORS.find((s) => s.slug === slug)?.name ?? null;
}

function CalendarPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");

  const cycles = useMemo(() => {
    const visible = ENTRIES.filter(
      (e) => filter === "all" || e.status === filter,
    );
    const order: string[] = [];
    const map = new Map<string, Entry[]>();
    for (const e of visible) {
      if (!map.has(e.cycle)) {
        map.set(e.cycle, []);
        order.push(e.cycle);
      }
      map.get(e.cycle)!.push(e);
    }
    return order.map((cycle) => ({ cycle, entries: map.get(cycle)! }));
  }, [filter]);

  const publishedShare = Math.round(
    (ENTRIES.filter((e) => e.status === "published").length / ENTRIES.length) *
      100,
  );

  return (
    <SolenaPage strata={STRATA}>
      <EnvironmentCanvas
        strata={STRATA}
        videos={[
          {
            id: "c-res",
            src: resonanceVideo.url,
            zone: "c-hero",
            peakOpacity: 0.22,
          },
        ]}
      />
      <NavBar />

      <main className="relative z-10">
        <section
          data-zone="c-hero"
          data-section="c-hero"
          data-section-label="Calendar"
          className="relative flex min-h-[70vh] items-end px-6 pb-16 pt-40 md:px-12"
        >
          <div className="mx-auto w-full max-w-6xl">
            <p className="eyebrow mb-8">VI — The Cadence</p>
            <h1 className="font-display text-5xl font-extralight leading-[1.02] tracking-tight text-ivory sm:text-7xl md:text-[7.5rem]">
              Editorial
              <br />
              <span className="font-signature italic text-bronze-glow">
                Calendar.
              </span>
            </h1>
            <p className="mt-10 max-w-xl text-base leading-relaxed text-stone/85 md:text-lg">
              A living record of what the studio is writing, when, and for which
              sector. Six cycles a year, one slot held deliberately open.
            </p>
          </div>
        </section>

        <section
          data-section="c-cadence"
          data-section-label="Cadence"
          data-section-level={2}
          className="px-6 md:px-12"
        >
          <div className="mx-auto max-w-6xl border-t border-ivory/10 py-20">
            <div className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {CADENCE.map((c) => (
                <div key={c.k}>
                  <p className="text-[0.55rem] uppercase tracking-[0.42em] text-stone/55">
                    {c.k}
                  </p>
                  <p className="mt-4 text-sm font-light leading-relaxed text-ivory/85">
                    {c.v}
                  </p>
                </div>
              ))}
            </div>

            {/* Year gauge — micrometer reading of the cycle */}
            <div className="mt-16">
              <div className="flex items-end justify-between text-[0.55rem] uppercase tracking-[0.42em] text-stone/55">
                <span>Year progress</span>
                <span className="text-ivory/80">{publishedShare}% published</span>
              </div>
              <div className="relative mt-4 h-px w-full bg-ivory/12">
                <div
                  className="absolute left-0 top-0 h-px bg-bronze"
                  style={{ width: `${publishedShare}%` }}
                />
                <div
                  aria-hidden
                  className="absolute inset-x-0 -top-2 flex justify-between"
                >
                  {Array.from({ length: 13 }).map((_, i) => (
                    <span
                      key={i}
                      className="block w-px bg-ivory/20"
                      style={{ height: i % 3 === 0 ? "10px" : "5px" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          data-zone="c-grid"
          data-section="c-entries"
          data-section-label="Entries"
          data-section-level={2}
          className="px-6 pb-24 md:px-12"
        >
          <div className="mx-auto max-w-6xl border-t border-ivory/10 pt-14">
            <div className="flex flex-wrap gap-3">
              {FILTERS.map((f) => {
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-2 text-[0.6rem] uppercase tracking-[0.34em] backdrop-blur transition-colors ${
                      active
                        ? "border-bronze/60 bg-bronze/10 text-bronze-glow"
                        : "border-ivory/12 bg-obsidian/40 text-stone/70 hover:text-ivory"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-16">
              {cycles.map(({ cycle, entries }) => (
                <div
                  key={cycle}
                  data-section={`c-${cycle.replace(/\s+/g, "-").toLowerCase()}`}
                  data-section-label={cycle}
                  data-section-level={3}
                  className="border-t border-ivory/10 py-16 first:border-t-0 first:pt-0"
                >
                  <p className="font-signature text-xs italic text-bronze-glow">
                    {cycle}
                  </p>

                  <ul className="mt-8 space-y-0">
                    {entries.map((e) => {
                      const name = sectorName(e.sector);
                      return (
                        <li
                          key={e.id}
                          className="grid grid-cols-1 gap-4 border-b border-ivory/[0.07] py-8 md:grid-cols-[7rem_1fr_10rem] md:items-start md:gap-10"
                        >
                          <p className="text-[0.6rem] uppercase tracking-[0.38em] text-stone/55">
                            {e.window}
                          </p>

                          <div>
                            <h3 className="font-display text-xl font-light leading-snug text-ivory md:text-2xl">
                              {e.title}
                            </h3>
                            <p className="mt-3 text-[0.6rem] uppercase tracking-[0.34em] text-stone/55">
                              {e.format}
                              {name && (
                                <>
                                  {" · "}
                                  <Link
                                    to="/sectors/$sector"
                                    params={{ sector: e.sector! }}
                                    className="bronze-line text-ivory/80 hover:text-bronze-glow"
                                  >
                                    {name}
                                  </Link>
                                </>
                              )}
                            </p>
                            <p className="mt-5 max-w-xl text-sm leading-relaxed text-stone/80">
                              {e.note}
                            </p>
                          </div>

                          <p className="md:text-right">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.3em] ${
                                e.status === "published"
                                  ? "border-bronze/50 bg-bronze/10 text-bronze-glow"
                                  : e.status === "in-studio"
                                    ? "border-ivory/20 bg-ivory/[0.04] text-ivory/85"
                                    : e.status === "scheduled"
                                      ? "border-ivory/12 bg-transparent text-stone/70"
                                      : "border-dashed border-stone/30 bg-transparent text-stone/55"
                              }`}
                            >
                              {STATUS_LABEL[e.status]}
                            </span>
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              {cycles.length === 0 && (
                <p className="border-t border-ivory/10 py-20 text-sm text-stone/60">
                  No entries at this status.
                </p>
              )}
            </div>
          </div>
        </section>

        <section
          data-zone="c-coda"
          data-section="c-next"
          data-section-label="Next"
          className="px-6 pb-40 md:px-12"
        >
          <div className="mx-auto max-w-6xl border-t border-ivory/10 py-28">
            <p className="max-w-xl font-display text-xl font-light leading-snug text-ivory/90 md:text-2xl">
              The cadence is bound by DOC 04 and recorded against the timeline.
            </p>
            <div className="mt-10 flex flex-wrap gap-8">
              <Link
                to="/governance"
                className="bronze-line border-b border-stone/30 pb-2 text-[0.65rem] uppercase tracking-[0.4em] text-ivory hover:text-bronze-glow"
              >
                Governance →
              </Link>
              <Link
                to="/timeline"
                className="bronze-line border-b border-stone/30 pb-2 text-[0.65rem] uppercase tracking-[0.4em] text-ivory hover:text-bronze-glow"
              >
                Timeline →
              </Link>
              <Link
                to="/journal"
                className="bronze-line border-b border-stone/30 pb-2 text-[0.65rem] uppercase tracking-[0.4em] text-ivory hover:text-bronze-glow"
              >
                Journal →
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </SolenaPage>
  );
}
