import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const schema = z.object({
  desk: z.enum(["michelle", "yirui", "novy", "ulla", "kendy"]),
  sector: z.string().trim().min(1).max(60),
  title: z.string().trim().max(160).optional(),
  notes: z.string().trim().min(40, "Add at least a few sentences of notes").max(12000),
});

export const generateEditorialBrief = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data, context }) => {
    const [admin, editor] = await Promise.all([
      context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
      context.supabase.rpc("has_role", { _user_id: context.userId, _role: "editor" }),
    ]);
    if (!admin.data && !editor.data) throw new Error("Only Solena editors can generate briefs.");

    const { generateBrief } = await import("@/lib/ai/brief.server");
    const brief = await generateBrief(data);
    return { brief };
  });
