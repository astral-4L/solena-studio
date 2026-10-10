import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import vieLandscape from "@/assets/vie-halo-landscape.png.asset.json";
import viePortrait from "@/assets/vie-halo-portrait.png.asset.json";
import gravityPortrait2 from "@/assets/gravity-portrait-2.png.asset.json";
import seedPortrait from "@/assets/seed-portrait.png.asset.json";
import seedVideo from "@/assets/seed-video.mp4.asset.json";

import yirui from "@/assets/team-Yirui_Pendo.jpg.asset.json";
import michelle from "@/assets/team-michelle.jpg.asset.json";
import novy from "@/assets/team-Novy.jpg.asset.json";
import ulla from "@/assets/team-ulla.jpg.asset.json";
import kendy from "@/assets/team-kendy.jpg.asset.json";

import { EnvironmentCanvas, SolenaPage, type Stratum } from "@/components/solena/environment";
import { NavBar, Footer } from "@/components/solena/chrome";
import { SectorGlyph } from "@/components/solena/sector-glyph";

type SectorBrief = {
  slug: string;
  label: string;
  lens: string;
  questions: string[];
  watching: string;
};

type Desk = {
  slug: string;
  code: string;
  name: string;
  role: string;
  desk: string;
  portrait: string;
  mandate: string;
  method: { k: string; v: string }[];
  sectors: SectorBrief[];
  reading: string[];
};

const DESKS: Desk[] = [
  {
    slug: "michelle",
    code: "DESK 01",
    name: "Michelle Wanjiru",
    role: "Editor-in-Chief",
    desk: "Standards & Admission",
    portrait: michelle.url,
    mandate:
      "Decides what Solena puts its name to. The admission desk reviews every mandate, clause and published object against one test: would a successor be proud to inherit it?",
    method: [
      { k: "Admission review", v: "Every new mandate is read by three desks before it enters the orbit." },
      { k: "Held slots", v: "She may hold any cadence slot open when nothing meets the line." },
      { k: "Signature", v: "No object ships without a named steward and a dated claim." },
    ],
    sectors: [
      {
        slug: "capital",
        label: "Capital",
        lens: "Capital is the slowest promise an institution makes. The desk reads funds and partners for patience, not velocity.",
        questions: ["Who holds the asset in thirty years?", "What does the partner refuse to do?", "Is the return measured in decades?"],
        watching: "Long-horizon family capital moving into cultural infrastructure.",
      },
      {
        slug: "media",
        label: "Media",
        lens: "Media is where an institution's voice is tested daily. The desk protects the line from the pace of the feed.",
        questions: ["Would this still read true in ten years?", "Who is the claim's named author?", "Is the correction path public?"],
        watching: "Publishers rebuilding trust through visible correction registers.",
      },
    ],
    reading: ["Admission Charter, Clause 1.1", "The Held Slot Doctrine", "Standards Register 2026"],
  },
  {
    slug: "yirui",
    code: "DESK 02",
    name: "Yirui Pendo",
    role: "Editorial Director, Longform",
    desk: "Doctrine & Process Briefs",
    portrait: yirui.url,
    mandate:
      "Turns doctrine into instruments. The longform desk writes the process briefs a stranger could run — slowly, deliberately, and only once they have survived a season unread.",
    method: [
      { k: "Seasonal drafts", v: "Briefs rest for a full season before they are read aloud." },
      { k: "Operable prose", v: "Every brief is tested by someone outside the studio." },
      { k: "Serial numbers", v: "Doctrine is versioned; nothing is silently rewritten." },
    ],
    sectors: [
      {
        slug: "real-estate",
        label: "Real Estate",
        lens: "Buildings outlast their briefs. The desk writes development doctrine that the third operator can still follow.",
        questions: ["What does the site already insist on?", "Who operates it after handover?", "Which promise is written into the stone?"],
        watching: "Mixed-use districts governed by published design charters.",
      },
      {
        slug: "hospitality",
        label: "Hotels",
        lens: "A hotel is a ritual repeated nightly. The desk documents the ritual so it survives staff, owners and decades.",
        questions: ["What does a guest remember on the tenth stay?", "Which rituals are written, which are inherited?", "Can a new GM run it from the brief?"],
        watching: "Independent houses codifying service as written practice.",
      },
    ],
    reading: ["Process Brief Template v4", "On Writing for Successors", "Hotel Ritual Ledger"],
  },
  {
    slug: "novy",
    code: "DESK 03",
    name: "Novy Achieng",
    role: "Field Editor",
    desk: "Sectors & Instrumentation",
    portrait: novy.url,
    mandate:
      "Reports from inside the mandates. The field desk instruments every performance claim — occupancy, retention, transfer — so no sentence about gravity is printed without a measurement behind it.",
    method: [
      { k: "Instrument first", v: "Metrics are defined before the claim is drafted." },
      { k: "Re-measure", v: "Every published figure is checked again a year later." },
      { k: "Field notes", v: "Dated observations from site, published as written." },
    ],
    sectors: [
      {
        slug: "tourism",
        label: "Tourism",
        lens: "Destinations are fragile systems. The desk measures what a visitor leaves behind, not only what they spend.",
        questions: ["What returns to the community?", "How does the place change after ten seasons?", "Which visitors come back?"],
        watching: "Regenerative destination models along the East African coast.",
      },
      {
        slug: "airlines",
        label: "Airlines",
        lens: "An airline is a promise kept at altitude, thousands of times a day. The desk tracks reliability as character.",
        questions: ["What does on-time mean to the passenger?", "Where is the brand felt in the cabin?", "Which routes build loyalty, not just load?"],
        watching: "Regional carriers competing on consistency over price.",
      },
    ],
    reading: ["Field Instrumentation Manual", "Gravity, Measured Twice", "Route Loyalty Study"],
  },
  {
    slug: "ulla",
    code: "DESK 04",
    name: "Ulla Marikit",
    role: "Design Editor",
    desk: "Form, Type & Object",
    portrait: ulla.url,
    mandate:
      "Guards the visual grammar — the micrometer marks, the bronze line, the restraint. The design desk treats layout as governance: a page that shouts is a page that will need replacing.",
    method: [
      { k: "Subtraction review", v: "Each object is reviewed for what can be removed." },
      { k: "Material honesty", v: "Type, paper and pixel are chosen to age well." },
      { k: "One grammar", v: "Every sector speaks in the same visual language." },
    ],
    sectors: [
      {
        slug: "luxury",
        label: "Luxury",
        lens: "Luxury is restraint made visible. The desk reads houses for what they decline to show.",
        questions: ["What is withheld on purpose?", "Does the object improve with age?", "Is the craft visible without being announced?"],
        watching: "Maisons returning to repair and lifetime service.",
      },
      {
        slug: "culture",
        label: "Culture",
        lens: "Culture is where institutions earn their meaning. The desk designs for permanence, not the opening night.",
        questions: ["Who is this archive for in fifty years?", "Does the form serve the work?", "What will the room feel like empty?"],
        watching: "Museums commissioning long-term visual identities instead of campaigns.",
      },
    ],
    reading: ["Solena Visual Grammar", "The Bronze Line", "On Removing Things"],
  },
  {
    slug: "kendy",
    code: "DESK 05",
    name: "Kendy Mahiri",
    role: "Managing Editor, Cadence",
    desk: "Calendar & Corrections",
    portrait: kendy.url,
    mandate:
      "Runs the living calendar and the corrections register. The cadence desk keeps the studio at a pace it can sustain for a century and prints every correction at the weight of the original.",
    method: [
      { k: "Sustainable cadence", v: "The calendar is planned for decades, not quarters." },
      { k: "Equal corrections", v: "Errors are corrected on the page the mistake had." },
      { k: "Public register", v: "Every change to a published claim is logged and dated." },
    ],
    sectors: [
      {
        slug: "technology",
        label: "Technology",
        lens: "Technology moves fast; institutions should not. The desk asks which tools will still matter after the hype cycle.",
        questions: ["Will this system be maintained in ten years?", "Who owns the data when we leave?", "What breaks quietly?"],
        watching: "Open, durable infrastructure replacing rented platforms.",
      },
      {
        slug: "ventures",
        label: "Ventures",
        lens: "Ventures are early drafts of future institutions. The desk tracks founders building for succession.",
        questions: ["Can the company outlive its founder?", "Is the governance written yet?", "What is the cadence of honest reporting?"],
        watching: "Founder-led companies publishing their own correction logs.",
      },
    ],
    reading: ["Living Calendar 2026", "Corrections Register", "A Century of Cadence"],
  },
];

const STRATA: Stratum[] = [
  { id: "desk-hero", img: vieLandscape.url, imgPortrait: viePortrait.url, scale: 1.6, blend: "screen", baseOpacity: 0.42, depth: 0.18, origin: "50% 38%" },
  { id: "desk-sectors", img: gravityPortrait2.url, imgPortrait: gravityPortrait2.url, scale: 1.7, blend: "soft-light", baseOpacity: 0.26, depth: 0.24, origin: "62% 50%" },
  { id: "desk-reading", img: seedPortrait.url, imgPortrait: seedPortrait.url, scale: 1.9, blend: "screen", baseOpacity: 0.2, depth: 0.16, origin: "42% 55%" },
];

export const Route = createFileRoute("/editorial/$desk")({
  loader: ({ params }) => {
    const desk = DESKS.find((d) => d.slug === params.desk);
    if (!desk) throw notFound();
    return { desk };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Desk not found — SOLENA" }, { name: "robots", content: "noindex" }] };
    const d = loaderData.desk;
    const title = `${d.name}, ${d.role} — SOLENA`;
    const desc = `${d.desk}: ${d.mandate.slice(0, 140)}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: DeskNotFound,
  component: DeskPage,
});

function DeskNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-obsidian text-ivory">
      <p className="eyebrow">No such desk</p>
      <Link to="/editorial" className="text-xs uppercase tracking-[0.4em] hover:text-bronze-glow">
        ← Editorial Team
      </Link>
    </div>
  );
}

function DeskPage() {
  const { desk: d } = Route.useLoaderData();
  const idx = DESKS.findIndex((x) => x.slug === d.slug);
  const next = DESKS[(idx + 1) % DESKS.length];

  return (
    <SolenaPage strata={STRATA}>
      <EnvironmentCanvas strata={STRATA} videos={[{ id: "desk-seed", src: seedVideo.url, zone: "desk-hero", peakOpacity: 0.2 }]} />
      <NavBar />
      <main className="relative z-10">
        <section data-zone="desk-hero" data-section="desk-hero" data-section-label={d.name} className="px-6 pb-20 pt-40 md:px-12">
          <div className="mx-auto grid max-w-6xl items-end gap-12 md:grid-cols-[1fr_20rem]">
            <div>
              <Link to="/editorial" className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/60 hover:text-bronze-glow">
                ← Editorial Team
              </Link>
              <p className="eyebrow mb-6 mt-10">{d.code} · {d.desk}</p>
              <h1 className="font-display text-5xl font-extralight leading-[1.02] tracking-tight text-ivory sm:text-7xl">
                {d.name.split(" ")[0]}
                <br />
                <span className="font-signature italic text-bronze-glow">{d.name.split(" ").slice(1).join(" ")}.</span>
              </h1>
              <p className="mt-6 text-[0.6rem] uppercase tracking-[0.42em] text-stone/60">{d.role}</p>
              <p className="mt-10 max-w-xl text-base leading-relaxed text-stone/85 md:text-lg">{d.mandate}</p>
            </div>
            <figure className="glass overflow-hidden">
              <img src={d.portrait} alt={`${d.name}, ${d.role}`} className="aspect-[4/5] w-full object-cover opacity-90" />
            </figure>
          </div>
        </section>

        <section data-section="desk-method" data-section-label="Method" data-section-level={2} className="px-6 md:px-12">
          <div className="mx-auto grid max-w-6xl gap-10 border-t border-ivory/10 py-20 sm:grid-cols-3">
            {d.method.map((m) => (
              <div key={m.k}>
                <p className="text-[0.55rem] uppercase tracking-[0.42em] text-stone/55">{m.k}</p>
                <p className="mt-4 text-sm font-light leading-relaxed text-ivory/85">{m.v}</p>
              </div>
            ))}
          </div>
        </section>

        <div data-zone="desk-sectors" className="px-6 md:px-12">
          <div className="mx-auto max-w-6xl">
            {d.sectors.map((s) => (
              <section key={s.slug} data-section={`desk-${s.slug}`} data-section-label={s.label} data-section-level={2} className="grid gap-12 border-t border-ivory/10 py-24 md:grid-cols-[16rem_1fr]">
                <div className="glass flex aspect-square items-center justify-center p-8 text-bronze-glow">
                  <SectorGlyph slug={s.slug} />
                </div>
                <div>
                  <p className="eyebrow mb-4">Sector focus</p>
                  <h2 className="font-display text-4xl font-light text-ivory md:text-5xl">{s.label}</h2>
                  <p className="mt-8 max-w-2xl text-base leading-relaxed text-stone/85 md:text-lg">{s.lens}</p>
                  <p className="mt-10 text-[0.55rem] uppercase tracking-[0.42em] text-stone/55">Questions the desk asks</p>
                  <ol className="mt-4 space-y-3">
                    {s.questions.map((q, i) => (
                      <li key={q} className="flex gap-4 text-sm font-light text-ivory/85">
                        <span className="text-bronze">0{i + 1}</span>
                        {q}
                      </li>
                    ))}
                  </ol>
                  <blockquote className="mt-10 max-w-2xl border-l border-bronze/40 pl-6">
                    <p className="text-[0.55rem] uppercase tracking-[0.42em] text-stone/55">Watching</p>
                    <p className="mt-2 font-signature text-lg italic text-ivory/90">{s.watching}</p>
                  </blockquote>
                  <Link to="/sectors/$sector" params={{ sector: s.slug }} className="bronze-line mt-10 inline-block border-b border-stone/30 pb-1 text-[0.6rem] uppercase tracking-[0.36em] text-ivory hover:text-bronze-glow">
                    Open {s.label} sector →
                  </Link>
                </div>
              </section>
            ))}
          </div>
        </div>

        <section data-zone="desk-reading" data-section="desk-reading" data-section-label="Desk reading" className="px-6 py-28 md:px-12">
          <div className="mx-auto grid max-w-6xl gap-16 border-t border-ivory/10 pt-20 md:grid-cols-2">
            <div>
              <p className="eyebrow mb-6">On the desk</p>
              <ul className="space-y-4">
                {d.reading.map((r) => (
                  <li key={r} className="font-display text-xl font-light text-ivory">{r}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-8">
              <p className="eyebrow">Next desk</p>
              <Link to="/editorial/$desk" params={{ desk: next.slug }} className="block font-display text-3xl font-light text-ivory hover:text-bronze-glow">
                {next.name} →
              </Link>
              <p className="text-sm text-stone/70">{next.desk}</p>
              <Link to="/editorial" hash="ed-contact" className="bronze-line inline-block border-b border-stone/30 pb-2 text-[0.65rem] uppercase tracking-[0.4em] text-ivory hover:text-bronze-glow">
                Write to this desk →
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </SolenaPage>
  );
}
