import { createFileRoute, Link } from "@tanstack/react-router";

import viePortrait from "@/assets/vie-halo-portrait.png.asset.json";
import vieLandscape from "@/assets/vie-halo-landscape.png.asset.json";
import gravityPortrait2 from "@/assets/gravity-portrait-2.png.asset.json";
import seedPortrait from "@/assets/seed-portrait.png.asset.json";
import vieVideo from "@/assets/vie-video.mp4.asset.json";

import {
  EnvironmentCanvas,
  SolenaPage,
  type Stratum,
} from "@/components/solena/environment";
import { NavBar, Footer } from "@/components/solena/chrome";

export const Route = createFileRoute("/governance")({
  head: () => ({
    meta: [
      { title: "Governance — SOLENA" },
      {
        name: "description",
        content:
          "The governance documents of Solena: the charter, admission standard, capital doctrine, editorial standard, and stewardship covenant.",
      },
      { property: "og:title", content: "Governance — SOLENA" },
      {
        property: "og:description",
        content:
          "Rules written before they are convenient. The documents that bind the studio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: viePortrait.url },
      { name: "twitter:image", content: viePortrait.url },
    ],
  }),
  component: GovernancePage,
});

type Doc = {
  id: string;
  code: string;
  label: string;
  title: string;
  summary: string;
  status: string;
  revised: string;
  clauses: { n: string; text: string }[];
};

const DOCS: Doc[] = [
  {
    id: "gv-charter",
    code: "DOC 01",
    label: "Charter",
    title: "The Charter",
    summary:
      "The founding instrument. Establishes Solena as a studio whose output is measured in decades and whose authority derives from restraint rather than reach.",
    status: "Ratified",
    revised: "Unrevised since origin",
    clauses: [
      {
        n: "1.1",
        text: "Solena exists to build gravity — institutions, objects, and narratives that attract without solicitation.",
      },
      {
        n: "1.2",
        text: "No mandate is accepted whose value depends on a campaign. If it dies when the spend stops, it was never built.",
      },
      {
        n: "1.3",
        text: "The studio commits to legibility: every standing rule is written, dated, and published.",
      },
    ],
  },
  {
    id: "gv-admission",
    code: "DOC 02",
    label: "Admission",
    title: "The Admission Standard",
    summary:
      "Governs which sectors enter the orbit and which mandates are declined. Admission is a governance act, never a commercial one.",
    status: "In force",
    revised: "Revised twice",
    clauses: [
      {
        n: "2.1",
        text: "A sector is admitted only when its failures are expensive to reverse. Cheap reversibility invites dishonest design.",
      },
      {
        n: "2.2",
        text: "Admission decisions are made separately from the people who sell the work.",
      },
      {
        n: "2.3",
        text: "The transfer test governs every mandate: does the object survive its founder's interest?",
      },
    ],
  },
  {
    id: "gv-capital",
    code: "DOC 03",
    label: "Capital",
    title: "The Capital Doctrine",
    summary:
      "Patient capital, stated plainly. Horizons are declared before capital is deployed, and are not renegotiated by market conditions.",
    status: "In force",
    revised: "Revised once",
    clauses: [
      {
        n: "3.1",
        text: "The minimum stated holding horizon is twenty years. Exits are outcomes, not objectives.",
      },
      {
        n: "3.2",
        text: "Capital may not purchase admission to the orbit; admission precedes investment.",
      },
      {
        n: "3.3",
        text: "Leverage that shortens the horizon is prohibited regardless of return.",
      },
    ],
  },
  {
    id: "gv-editorial",
    code: "DOC 04",
    label: "Editorial",
    title: "The Editorial Standard",
    summary:
      "Binds everything Solena publishes. The studio publishes on a cadence it can sustain for a century, or it does not publish.",
    status: "In force",
    revised: "Revised annually",
    clauses: [
      {
        n: "4.1",
        text: "Nothing is published to occupy a slot. An empty cadence entry is preferable to a filled one.",
      },
      {
        n: "4.2",
        text: "Claims about the studio's work are dated and, where possible, instrumented.",
      },
      {
        n: "4.3",
        text: "Corrections are published at the same weight as the original.",
      },
    ],
  },
  {
    id: "gv-stewardship",
    code: "DOC 05",
    label: "Stewardship",
    title: "The Stewardship Covenant",
    summary:
      "Governs succession. The studio is designed to be inherited, which requires that no individual is structurally indispensable.",
    status: "Ratified",
    revised: "Unrevised",
    clauses: [
      {
        n: "5.1",
        text: "Every standing instrument, index, and process brief is documented well enough for a successor to operate it.",
      },
      {
        n: "5.2",
        text: "No person may hold both admission authority and commercial authority indefinitely.",
      },
      {
        n: "5.3",
        text: "The record — timeline, governance, calendar — is maintained as a public audit surface.",
      },
    ],
  },
];

const PRINCIPLES = [
  { k: "Written first", v: "Rules are set before they become inconvenient." },
  { k: "Separated powers", v: "Admission, capital, and sales do not share a hand." },
  { k: "Dated record", v: "Every clause carries a status and a revision history." },
  { k: "Auditable", v: "Written for readers who are not yet born." },
];

const STRATA: Stratum[] = [
  {
    id: "gv-charter",
    img: vieLandscape.url,
    imgPortrait: viePortrait.url,
    scale: 1.6,
    blend: "screen",
    baseOpacity: 0.44,
    depth: 0.18,
    origin: "50% 40%",
  },
  {
    id: "gv-capital",
    img: gravityPortrait2.url,
    imgPortrait: gravityPortrait2.url,
    scale: 1.7,
    blend: "soft-light",
    baseOpacity: 0.28,
    depth: 0.24,
    origin: "60% 50%",
  },
  {
    id: "gv-stewardship",
    img: seedPortrait.url,
    imgPortrait: seedPortrait.url,
    scale: 1.9,
    blend: "screen",
    baseOpacity: 0.2,
    depth: 0.14,
    origin: "40% 55%",
  },
];

function GovernancePage() {
  return (
    <SolenaPage strata={STRATA}>
      <EnvironmentCanvas
        strata={STRATA}
        videos={[
          {
            id: "gv-vie",
            src: vieVideo.url,
            zone: "gv-charter",
            peakOpacity: 0.2,
          },
        ]}
      />
      <NavBar />

      <main className="relative z-10">
        <section
          data-zone="gv-charter"
          data-section="gv-hero"
          data-section-label="Governance"
          className="relative flex min-h-[70vh] items-end px-6 pb-16 pt-40 md:px-12"
        >
          <div className="mx-auto w-full max-w-6xl">
            <p className="eyebrow mb-8">V — The Instruments</p>
            <h1 className="font-display text-5xl font-extralight leading-[1.02] tracking-tight text-ivory sm:text-7xl md:text-[7.5rem]">
              The
              <br />
              <span className="font-signature italic text-bronze-glow">
                Governance.
              </span>
            </h1>
            <p className="mt-10 max-w-xl text-base leading-relaxed text-stone/85 md:text-lg">
              Five standing documents bind the studio. They are written before
              they are convenient, dated when they change, and published so
              that the work can be audited long after us.
            </p>
          </div>
        </section>

        <section
          data-section="gv-principles"
          data-section-label="Principles"
          data-section-level={2}
          className="px-6 md:px-12"
        >
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-12 gap-y-10 border-t border-ivory/10 py-20 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p) => (
              <div key={p.k}>
                <p className="text-[0.55rem] uppercase tracking-[0.42em] text-stone/55">
                  {p.k}
                </p>
                <p className="mt-4 text-sm font-light leading-relaxed text-ivory/85">
                  {p.v}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="px-6 pb-40 md:px-12">
          <div className="mx-auto max-w-6xl">
            {DOCS.map((doc) => (
              <section
                key={doc.id}
                data-zone={doc.id}
                data-section={doc.id}
                data-section-label={doc.label}
                data-section-level={2}
                className="relative grid grid-cols-1 gap-8 border-t border-ivory/10 py-24 md:grid-cols-[12rem_1fr] md:gap-16 md:py-32"
              >
                <div>
                  <p className="font-signature text-xs italic text-bronze-glow">
                    {doc.code}
                  </p>
                  <p className="mt-4 text-[0.55rem] uppercase tracking-[0.42em] text-stone/55">
                    Status
                  </p>
                  <p className="mt-2 text-sm font-light text-ivory/90">
                    {doc.status}
                  </p>
                  <p className="mt-6 text-[0.55rem] uppercase tracking-[0.42em] text-stone/55">
                    Revision
                  </p>
                  <p className="mt-2 text-sm font-light text-ivory/70">
                    {doc.revised}
                  </p>
                </div>

                <div>
                  <h2 className="excavate font-display text-3xl font-light leading-tight text-ivory sm:text-4xl md:text-5xl">
                    <span>{doc.title}</span>
                  </h2>
                  <p className="mt-8 max-w-2xl text-base leading-relaxed text-stone/85 md:text-lg">
                    {doc.summary}
                  </p>
                  <ol className="mt-12 space-y-8">
                    {doc.clauses.map((c) => (
                      <li
                        key={c.n}
                        className="grid grid-cols-[3.5rem_1fr] gap-4 border-l border-ivory/10 pl-6"
                      >
                        <span className="font-display text-sm tracking-[0.2em] text-bronze">
                          {c.n}
                        </span>
                        <p className="max-w-2xl text-sm leading-relaxed text-ivory/85 md:text-base">
                          {c.text}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            ))}

            <section
              data-section="gv-next"
              data-section-label="Next"
              className="border-t border-ivory/10 py-28"
            >
              <p className="max-w-xl font-display text-xl font-light leading-snug text-ivory/90 md:text-2xl">
                Governance is only credible alongside the record it governs.
              </p>
              <div className="mt-10 flex flex-wrap gap-8">
                <Link
                  to="/timeline"
                  className="bronze-line border-b border-stone/30 pb-2 text-[0.65rem] uppercase tracking-[0.4em] text-ivory hover:text-bronze-glow"
                >
                  Timeline →
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
