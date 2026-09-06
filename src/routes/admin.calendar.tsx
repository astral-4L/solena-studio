import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { SECTORS } from "@/components/solena/orbital";

export const Route = createFileRoute("/admin/calendar")({
  ssr: false,
  component: CalendarAdminPage,
});

type Status = "published" | "in-studio" | "scheduled" | "open";

type Entry = {
  id: string;
  cycle: string;
  window_label: string;
  title: string;
  format: string;
  sector: string | null;
  status: Status;
  note: string;
  sort_order: number;
};

type Draft = Omit<Entry, "id"> & { id?: string };

const STATUSES: Status[] = ["published", "in-studio", "scheduled", "open"];

const STATUS_LABEL: Record<Status, string> = {
  published: "Published",
  "in-studio": "In studio",
  scheduled: "Scheduled",
  open: "Held open",
};

const EMPTY: Draft = {
  cycle: "Cycle I",
  window_label: "",
  title: "",
  format: "Sector brief",
  sector: null,
  status: "scheduled",
  note: "",
  sort_order: 0,
};

const inputClass =
  "w-full rounded border border-ivory/10 bg-obsidian/60 px-3 py-2 text-sm text-ivory outline-none placeholder:text-stone/40 focus:border-bronze-glow";
const labelClass = "block text-[0.6rem] uppercase tracking-[0.35em] text-stone/55";

function CalendarAdminPage() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft | null>(null);

  const list = useQuery({
    queryKey: ["calendar-entries-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calendar_entries")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Entry[];
    },
  });

  const save = useMutation({
    mutationFn: async (d: Draft) => {
      const payload = {
        cycle: d.cycle.trim(),
        window_label: d.window_label.trim(),
        title: d.title.trim(),
        format: d.format.trim(),
        sector: d.sector,
        status: d.status,
        note: d.note.trim(),
        sort_order: Number(d.sort_order) || 0,
      };
      if (d.id) {
        const { error } = await supabase.from("calendar_entries").update(payload).eq("id", d.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("calendar_entries").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["calendar-entries-admin"] });
      qc.invalidateQueries({ queryKey: ["calendar-entries"] });
      setDraft(null);
      toast.success("Calendar updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const { error } = await supabase.from("calendar_entries").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["calendar-entries-admin"] });
      qc.invalidateQueries({ queryKey: ["calendar-entries"] });
      toast.success("Status changed");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("calendar_entries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["calendar-entries-admin"] });
      qc.invalidateQueries({ queryKey: ["calendar-entries"] });
      setDraft(null);
      toast.success("Entry removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/50">Editorial</p>
          <h1 className="mt-2 font-display text-3xl font-extralight text-ivory">Calendar</h1>
        </div>
        <button
          onClick={() =>
            setDraft({ ...EMPTY, sort_order: (list.data?.length ?? 0) + 1 })
          }
          className="border border-ivory/20 px-4 py-2 text-xs uppercase tracking-[0.35em] text-ivory hover:border-bronze-glow hover:text-bronze-glow"
        >
          New entry
        </button>
      </header>

      <div className="glass overflow-hidden">
        {list.isLoading ? (
          <div className="p-10 text-center text-sm text-stone/60">Loading…</div>
        ) : !list.data?.length ? (
          <div className="p-10 text-center text-sm text-stone/60">No entries yet.</div>
        ) : (
          <div className="divide-y divide-ivory/5">
            {list.data.map((e) => (
              <div key={e.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                <button
                  onClick={() => setDraft({ ...e })}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[0.6rem] uppercase tracking-[0.35em] text-stone/50">
                      {e.cycle} · {e.window_label}
                    </span>
                    <p className="truncate font-display text-base text-ivory">{e.title}</p>
                  </div>
                  <p className="mt-1 truncate text-xs text-stone/60">
                    {e.format}
                    {e.sector ? ` · ${e.sector}` : ""}
                  </p>
                </button>
                <select
                  value={e.status}
                  onChange={(ev) =>
                    setStatus.mutate({ id: e.id, status: ev.target.value as Status })
                  }
                  className="rounded border border-ivory/10 bg-obsidian/60 px-2 py-1.5 text-[0.65rem] uppercase tracking-[0.25em] text-ivory"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {draft && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 p-4 backdrop-blur"
          onClick={() => setDraft(null)}
        >
          <div
            className="glass max-h-[88vh] w-full max-w-2xl overflow-auto p-8"
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display text-2xl text-ivory">
                {draft.id ? "Edit entry" : "New entry"}
              </h2>
              <button onClick={() => setDraft(null)} className="text-stone/60 hover:text-ivory">
                ✕
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="cycle">Cycle</label>
                <input id="cycle" className={`mt-2 ${inputClass}`} value={draft.cycle}
                  onChange={(ev) => setDraft({ ...draft, cycle: ev.target.value })} />
              </div>
              <div>
                <label className={labelClass} htmlFor="window">Window</label>
                <input id="window" className={`mt-2 ${inputClass}`} placeholder="Jan — Feb" value={draft.window_label}
                  onChange={(ev) => setDraft({ ...draft, window_label: ev.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="title">Title</label>
                <input id="title" className={`mt-2 ${inputClass}`} value={draft.title}
                  onChange={(ev) => setDraft({ ...draft, title: ev.target.value })} />
              </div>
              <div>
                <label className={labelClass} htmlFor="format">Format</label>
                <input id="format" className={`mt-2 ${inputClass}`} placeholder="Essay · 12 min" value={draft.format}
                  onChange={(ev) => setDraft({ ...draft, format: ev.target.value })} />
              </div>
              <div>
                <label className={labelClass} htmlFor="sector">Sector</label>
                <select id="sector" className={`mt-2 ${inputClass}`} value={draft.sector ?? ""}
                  onChange={(ev) => setDraft({ ...draft, sector: ev.target.value || null })}>
                  <option value="">None</option>
                  {SECTORS.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="status">Status</label>
                <select id="status" className={`mt-2 ${inputClass}`} value={draft.status}
                  onChange={(ev) => setDraft({ ...draft, status: ev.target.value as Status })}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="order">Order</label>
                <input id="order" type="number" className={`mt-2 ${inputClass}`} value={draft.sort_order}
                  onChange={(ev) => setDraft({ ...draft, sort_order: Number(ev.target.value) })} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="note">Note</label>
                <textarea id="note" rows={4} className={`mt-2 ${inputClass}`} value={draft.note}
                  onChange={(ev) => setDraft({ ...draft, note: ev.target.value })} />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <button
                disabled={!draft.title.trim() || save.isPending}
                onClick={() => save.mutate(draft)}
                className="border border-ivory/20 px-4 py-2 text-xs uppercase tracking-[0.35em] text-ivory hover:border-bronze-glow hover:text-bronze-glow disabled:opacity-40"
              >
                {save.isPending ? "Saving…" : "Save"}
              </button>
              {draft.status !== "published" && (
                <button
                  onClick={() => save.mutate({ ...draft, status: "published" })}
                  className="border border-bronze/50 bg-bronze/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-bronze-glow"
                >
                  Save & publish
                </button>
              )}
              {draft.id && (
                <button
                  onClick={() => {
                    if (confirm("Remove this entry?")) del.mutate(draft.id!);
                  }}
                  className="ml-auto border border-red-500/30 px-4 py-2 text-xs uppercase tracking-[0.35em] text-red-300 hover:bg-red-500/10"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
