import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Promotes the calling authenticated user to admin ONLY when no admin exists yet.
 * Runs entirely server-side with the privileged client; clients cannot grant
 * themselves a role directly.
 */
export const bootstrapFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { count, error: countError } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");

    if (countError) {
      console.error("[bootstrapFirstAdmin] count failed", countError);
      throw new Error("Unable to verify admin state");
    }

    if ((count ?? 0) > 0) return { promoted: false };

    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });

    if (error && error.code !== "23505") {
      console.error("[bootstrapFirstAdmin] insert failed", error);
      throw new Error("Unable to complete setup");
    }

    return { promoted: true };
  });
