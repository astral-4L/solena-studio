import { useEffect, useState } from "react";

/**
 * Right-rail scroll tracker. Auto-scans the page for [data-section]
 * elements and highlights the one currently in view. Renders on all
 * viewport sizes (compact on mobile).
 */
export function ScrollTracker() {
  const [sections, setSections] = useState<{ id: string; label: string }[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const scan = () => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>("[data-section]"),
      );
      setSections(
        els.map((el) => ({
          id: el.dataset.section!,
          label:
            el.dataset.sectionLabel ||
            el.dataset.section!.replace(/[-_]/g, " "),
        })),
      );
    };
    scan();
    // re-scan after route transitions / lazy mounts
    const t = window.setTimeout(scan, 250);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!sections.length) return;
    const els = sections
      .map((s) => document.querySelector(`[data-section="${s.id}"]`))
      .filter(Boolean) as Element[];

    const io = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to top of viewport that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0])
          setActive(
            (visible[0].target as HTMLElement).dataset.section || null,
          );
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.6, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  if (!sections.length) return null;

  return (
    <nav
      aria-label="Page sections"
      className="pointer-events-auto fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 sm:block md:right-6"
    >
      <ul className="flex flex-col gap-3">
        {sections.map((s) => {
          const isActive = s.id === active;
          return (
            <li
              key={s.id}
              className={`tracker-row flex items-center justify-end gap-3 ${isActive ? "is-active" : ""}`}
            >
              <span
                className={`tracker-label font-signature text-[0.65rem] uppercase tracking-[0.3em] text-stone/70 opacity-0 transition-opacity duration-300 ${isActive ? "text-bronze-glow" : ""}`}
              >
                {s.label}
              </span>
              <a
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector(`[data-section="${s.id}"]`)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="tracker-tick block h-px bg-ivory/60"
                aria-label={`Jump to ${s.label}`}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
