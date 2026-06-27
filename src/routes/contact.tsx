import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";


import resonancePortrait from "@/assets/resonance-portrait.png.asset.json";
import viePortrait2 from "@/assets/vie-portrait-2.png.asset.json";
import seedPortrait from "@/assets/seed-portrait.png.asset.json";
import resonanceVideo from "@/assets/resonance-video.mp4.asset.json";

import {
  EnvironmentCanvas,
  SolenaPage,
  type Stratum,
} from "@/components/solena/environment";
import { NavBar, Footer } from "@/components/solena/chrome";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SOLENA" },
      {
        name: "description",
        content:
          "Begin a conversation with Solena. We work with the rare few building for the century.",
      },
      { property: "og:title", content: "Contact — SOLENA" },
      {
        property: "og:description",
        content: "Begin a conversation with Solena.",
      },
      { property: "og:image", content: resonancePortrait.url },
    ],
  }),
  component: ContactPage,
});

const STRATA: Stratum[] = [
  {
    id: "c-hero",
    img: resonancePortrait.url,
    imgPortrait: resonancePortrait.url,
    scale: 1.4,
    blend: "screen",
    baseOpacity: 0.55,
    depth: 0.15,
    origin: "50% 35%",
  },
  {
    id: "c-form",
    img: viePortrait2.url,
    imgPortrait: viePortrait2.url,
    scale: 1.7,
    blend: "soft-light",
    baseOpacity: 0.28,
    depth: 0.22,
    origin: "70% 50%",
  },
  {
    id: "c-coda",
    img: seedPortrait.url,
    imgPortrait: seedPortrait.url,
    scale: 1.9,
    blend: "screen",
    baseOpacity: 0.22,
    depth: 0.18,
    origin: "50% 50%",
  },
];

function ContactPage() {
  return (
    <SolenaPage strata={STRATA}>
      <EnvironmentCanvas
        strata={STRATA}
        videos={[
          {
            id: "c-res",
            src: resonanceVideo.url,
            zone: "c-hero",
            peakOpacity: 0.3,
          },
        ]}
      />
      <NavBar />

      <main className="relative z-10">
        <section
          data-zone="c-hero"
          className="relative flex min-h-[80vh] items-end px-6 pb-20 pt-40 md:px-12"
        >
          <div className="mx-auto w-full max-w-5xl">
            <p className="eyebrow mb-8">Begin a Conversation</p>
            <h1 className="font-display text-5xl font-extralight leading-[1.02] tracking-tight text-ivory sm:text-7xl md:text-[7.5rem]">
              <span className="font-signature italic text-bronze-glow">
                Contact.
              </span>
            </h1>
            <p className="mt-10 max-w-xl text-base leading-relaxed text-stone/85 md:text-lg">
              Solena partners with founders, families, and institutions whose
              ambitions extend beyond their lifetime. Engagements begin with a
              private correspondence.
            </p>
          </div>
        </section>

        <section
          data-zone="c-form"
          className="relative px-6 py-32 md:px-12"
        >
          <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1.1fr_1fr]">
            <ContactForm />

            <aside className="space-y-10">
              <div>
                <p className="eyebrow mb-4">Studio</p>
                <p className="font-display text-2xl font-light text-ivory">
                  studio@solena.co
                </p>
              </div>
              <div>
                <p className="eyebrow mb-4">Press</p>
                <p className="font-display text-2xl font-light text-ivory">
                  press@solena.co
                </p>
              </div>
              <div>
                <p className="eyebrow mb-4">Cadence</p>
                <p className="max-w-sm text-sm leading-relaxed text-stone/80">
                  We respond within five business days. Engagements are
                  reviewed quarterly and accepted by invitation.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section
          data-zone="c-coda"
          className="relative px-6 py-40 text-center md:px-12"
        >
          <p className="excavate font-display text-3xl font-extralight italic text-ivory sm:text-4xl md:text-5xl">
            <span>
              For the rare few
              <br />
              building for the century.
            </span>
          </p>
        </section>

        <Footer />
      </main>
    </SolenaPage>
  );
}
