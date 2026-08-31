import { createFileRoute, Link } from "@tanstack/react-router";

import gravityLandscape from "@/assets/gravity-landscape.png.asset.json";
import gravityPortrait from "@/assets/gravity-portrait.png.asset.json";
import seedPortrait from "@/assets/seed-portrait.png.asset.json";
import resonancePortrait from "@/assets/resonance-portrait.png.asset.json";
import viePortrait2 from "@/assets/vie-portrait-2.png.asset.json";
import seedVideo from "@/assets/seed-video.mp4.asset.json";

import {
  EnvironmentCanvas,
  SolenaPage,
  type Stratum,
} from "@/components/solena/environment";
import { NavBar, Footer } from "@/components/solena/chrome";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Timeline — SOLENA" },
      {
        name: "description",
        content:
          "The Solena timeline: the recorded formation of an institution, era by era, from first principle to century mandate.",
      },
      { property: "og:title", content: "The Timeline — SOLENA" },
      {
        property: "og:description",
        content:
          "Institutions are not launched. They accumulate. A record of Solena's formation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: gravityPortrait.url },
      { name: "twitter:image", content: gravityPortrait.url },
    ],
  }),
  component: TimelinePage,
});

type Era = {
  id: string;
  label: string;
  year: string;
  title: string;
  body: string;
  markers: { k: string; v: string }[];
};

const ERAS: Era[] = [
  {
    id: "tl-origin",
    label: "Origin",
    year: "2019",
    title: "A refusal, written down",
    body: "Solena begins as a written refusal: that attention is not a business model, that visibility is not authority, and that anything engineered for a quarter cannot survive a decade. The first document is one page long and has not been revised since.",
    markers: [
      { k: "Artifact", v: "The One Page" },
      { k: "Posture", v: "Private" },
    ],
  },
  {
    id: "tl-instrument",
    label: "Instrumentation",
    year: "2020 — 2021",
    title: "Building the measuring tools first",
    body: "Before building brands, Solena built the instruments to grade them: gravity indices, decay curves, and the transfer test — does this object survive its founder's interest? Studio work in this era is deliberately unpublished.",
    markers: [
      { k: "Instruments", v: "Gravity index · Decay curve" },
      { k: "Mandates", v: "4 · unpublished" },
    ],
  },
  {
    id: "tl-first-orbit",
    label: "First Orbit",
    year: "2022",
    title: "The first sector enters orbit",
    body: "Real estate becomes the first sector formally admitted to the orbit — chosen because buildings cannot be undone cheaply, which forces honest design. The orbital model is drafted here: a center of gravity, concentric energy rings, and sectors that move as one field.",
    markers: [
      { k: "Sectors", v: "Real Estate" },
      { k: "Model", v: "Orbit v1" },
    ],
  },
  {
    id: "tl-field",
    label: "The Field",
    year: "2023",
    title: "From portfolio to field",
    body: "Technology, hotels, luxury, and media are admitted. The studio stops describing its work as a portfolio — a portfolio is a list, a field is a force. Governance is separated from practice so that admission decisions cannot be made by the people selling the work.",
    markers: [
      { k: "Sectors", v: "5 in orbit" },
      { k: "Separation", v: "Council · Studio" },
    ],
  },
  {
    id: "tl-capital",
    label: "Capital",
    year: "2024",
    title: "Patient capital, formalized",
    body: "Ventures and capital enter the orbit with a stated holding horizon measured in decades, not exits. Culture is admitted alongside them — the position being that taste is infrastructure and must be capitalized as such.",
    markers: [
      { k: "Horizon", v: "20 years minimum" },
      { k: "Sectors", v: "8 in orbit" },
    ],
  },
  {
    id: "tl-motion",
    label: "Motion",
    year: "2025",
    title: "Automotive, airlines, tourism",
    body: "Three motion sectors are admitted in a single cycle — the first time Solena expands as a bloc rather than a sequence. Movement is treated as a designed ritual: the vehicle, the cabin, and the journey graded on the same heirloom criteria as a building.",
    markers: [
      { k: "Admitted", v: "Automotive · Airlines · Tourism" },
      { k: "Sectors", v: "11 in orbit" },
    ],
  },
  {
    id: "tl-mandate",
    label: "Mandate",
    year: "2026 →",
    title: "The century mandate",
    body: "The current era: institutional layers made legible. Governance documents published, the editorial calendar opened, the timeline recorded. Solena's operating assumption is that the work will be audited by people who are not yet born.",
    markers: [
      { k: "Now", v: "Institutional layers" },
      { k: "Audit", v: "Public record" },
    ],
  },
];

const STRATA: Stratum[] = [
  {
    id: "tl-origin",
    img: seedPortrait.url,
    imgPortrait: seedPortrait.url,
    scale: 1.6,
    blend: "screen",
    baseOpacity: 0.42,
    depth: 0.18,
    origin: "50% 40%",
  },
  {
    id: "tl-first-orbit",
    img: gravityLandscape.url,
    imgPortrait: gravityPortrait.url,
    scale: 1.7,
    blend: "soft-light",
    baseOpacity: 0.3,
    depth: 0.26,
    origin: "35% 50%",
  },
  {
    id: "tl-capital",
    img: resonancePortrait.url,
    imgPortrait: resonancePortrait.url,
    scale: 1.55,
    blend: "screen",
    baseOpacity: 0.3,
    depth: 0.22,
    origin: "65% 50%",
  },
  {
    id: "tl-mandate",
    img: viePortrait2.url,
    imgPortrait: viePortrait2.url,
    scale: 1.85,
    blend: "soft-light",
    baseOpacity: 0.2,
    depth: 0.14,
    origin: "50% 55%",
  },
];

function TimelinePage() {
  return (
    <SolenaPage strata={STRATA}>
      <EnvironmentCanvas
        strata={STRATA}
        videos={[
          {
            id: "tl-seed",
            src: seedVideo.url,
            zone: "tl-origin",
            peakOpacity: 0.24,
          },
        ]}
      />
      <NavBar />

      <main className="relative z-10">
        <section
          data-zone="tl-origin"
          data-section="tl-hero"
          data-section-label="Timeline"
          className="relative flex min-h-[70vh] items-end px-6 pb-16 pt-40 md:px-12"
        >
          <div className="mx-auto w-full max-w-6xl">
            <p className="eyebrow mb-8">IV — The Record</p>
            <h1 className="font-display text-5xl font-extralight leading-[1.02] tracking-tight text-ivory sm:text-7xl md:text-[7.5rem]">
              The
              <br />
              <span className="font-signature italic text-bronze-glow">
                Timeline.
              </span>
            </h1>
            <p className="mt-10 max-w-xl text-base leading-relaxed text-stone/85 md:text-lg">
              Institutions are not launched. They accumulate. This is the
              recorded formation of Solena — era by era, instrument by
              instrument, sector by sector.
            </p>
          </div>
        </section>

        <div className="px-6 pb-40 md:px-12">
          <div className="mx-auto max-w-6xl">
            {ERAS.map((era, i) => (
              <section
                key={era.id}
                data-zone={era.id}
                data-section={era.id}
                data-section-label={era.label}
                data-section-level={2}
                className="relative grid grid-cols-1 gap-8 border-t border-ivory/10 py-24 md:grid-cols-[10rem_1fr] md:gap-16 md:py-32"
              >
                {/* Left rail — era marker, micrometer-gauge style */}
                <div className="relative md:pt-2">
                  <p className="font-signature text-xs italic text-bronze-glow">
                    {era.label}
                  </p>
                  <p className="mt-3 font-display text-2xl font-extralight tracking-tight text-ivory md:text-3xl">
                    {era.year}
                  </p>
                  <div
                    aria-hidden
                    className="mt-6 flex items-center gap-[3px] md:flex-col md:items-start md:gap-[3px]"
                  >
                    {Array.from({ length: 9 }).map((_, t) => (
                      <span
                        key={t}
                        className="block bg-ivory/25 md:h-px"
                        style={{
                          height: t % 4 === 0 ? "10px" : "5px",
                          width: t % 4 === 0 ? "1px" : "1px",
                          opacity: t <= i + 2 ? 0.55 : 0.18,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="excavate font-display text-3xl font-light leading-tight text-ivory sm:text-4xl md:text-5xl">
                    <span>{era.title}</span>
                  </h2>
                  <p className="mt-8 max-w-2xl text-base leading-relaxed text-stone/85 md:text-lg">
                    {era.body}
                  </p>
                  <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4">
                    {era.markers.map((m) => (
                      <div key={m.k}>
                        <dt className="text-[0.55rem] uppercase tracking-[0.42em] text-stone/55">
                          {m.k}
                        </dt>
                        <dd className="mt-2 text-sm font-light text-ivory/90">
                          {m.v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </section>
            ))}

            <section
              data-section="tl-next"
              data-section-label="Next"
              className="border-t border-ivory/10 py-28"
            >
              <p className="max-w-xl font-display text-xl font-light leading-snug text-ivory/90 md:text-2xl">
                The record continues in the governance documents and the
                editorial calendar.
              </p>
              <div className="mt-10 flex flex-wrap gap-8">
                <Link
                  to="/governance"
                  className="bronze-line border-b border-stone/30 pb-2 text-[0.65rem] uppercase tracking-[0.4em] text-ivory hover:text-bronze-glow"
                >
                  Governance →
                </Link>
                <Link
                  to="/calendar"
                  className="bronze-line border-b border-stone/30 pb-2 text-[0.65rem] uppercase tracking-[0.4em] text-ivory hover:text-bronze-glow"
                >
                  Editorial Calendar →
                </Link>
              </div>
            </section>
          </div>
        </div>

        <Footer />
      </main>
    </SolenaPage>
  );
}
