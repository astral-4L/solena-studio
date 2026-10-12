import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

import { createLovableAiGatewayRunIdFetch } from "./run-id.server";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

export const DESK_PROFILES: Record<string, string> = {
  michelle:
    "Michelle Wanjiru, Editor-in-Chief, Standards & Admission. Tests every claim against: would a successor be proud to inherit it? Favours held slots over weak publication.",
  yirui:
    "Yirui Pendo, Editorial Director, Doctrine & Process Briefs. Writes operable doctrine a stranger could run; slow, versioned, written for successors.",
  novy:
    "Novy Achieng, Field Editor, Sectors & Instrumentation. Every performance claim must carry a date and a measurement; re-measure a year later.",
  ulla:
    "Ulla Marikit, Design Editor, Form, Type & Object. Restraint as governance; remove what is only there to be noticed.",
  kendy:
    "Kendy Mahiri, Managing Editor, Cadence. Sustainable century-long cadence; corrections printed at the weight of the original.",
};

const INSTRUCTIONS = `You are the editorial engine of Solena, a studio building institutions designed to outlive their founders.
Voice: restrained, precise, architectural, unhurried. No hype, no exclamation marks, no marketing clichés.
Turn the editor's raw research notes into an editorial brief aligned with the named desk's standard.
Never invent figures, dates or sources. If a claim lacks a date or measurement, flag it under "Open questions".
Output Markdown with exactly these sections:
# <Title>
**Desk:** … · **Sector:** …
## Thesis (2–3 sentences)
## Key observations (bulleted, each grounded in the notes)
## Desk lens (how this desk's standard shapes the piece)
## Process brief (4 numbered steps: Diagnostic, Composition, Instrumentation, Stewardship)
## Open questions (claims needing verification)
## Recommended cadence (publish, hold, or schedule — and why)`;

export async function generateBrief(input: {
  desk: string;
  sector: string;
  title?: string;
  notes: string;
  signal?: AbortSignal;
}) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("AI is not configured for this project.");

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: GATEWAY,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  let failure: unknown;
  const result = streamText({
    model: provider.responses(MODEL),
    system: INSTRUCTIONS,
    messages: [
      {
        role: "user",
        content: `Desk: ${DESK_PROFILES[input.desk]}\nSector: ${input.sector}\nWorking title: ${input.title || "(none)"}\n\nResearch notes:\n${input.notes}`,
      },
    ],
    maxRetries: 0,
    abortSignal: input.signal,
    onError: ({ error }) => {
      failure = error;
    },
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "medium",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  const text = await result.text;
  if (!text.trim()) {
    const status = (failure as { statusCode?: number } | undefined)?.statusCode;
    if (status === 402) throw new Error("AI credits are used up. Add credits in workspace billing to continue.");
    if (status === 429) throw new Error("The AI service is busy. Please try again in a moment.");
    if (status === 403) throw new Error("AI access is blocked for this workspace.");
    throw new Error("The model returned no brief. Please try again.");
  }
  return text;
}
