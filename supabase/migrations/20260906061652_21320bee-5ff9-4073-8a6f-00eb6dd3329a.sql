CREATE TABLE public.calendar_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle text NOT NULL,
  window_label text NOT NULL,
  title text NOT NULL,
  format text NOT NULL,
  sector text,
  status text NOT NULL DEFAULT 'scheduled',
  note text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT calendar_entries_status_check CHECK (status IN ('published','in-studio','scheduled','open')),
  CONSTRAINT calendar_entries_title_len CHECK (char_length(title) BETWEEN 1 AND 200)
);

GRANT SELECT ON public.calendar_entries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.calendar_entries TO authenticated;
GRANT ALL ON public.calendar_entries TO service_role;

ALTER TABLE public.calendar_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read calendar entries" ON public.calendar_entries
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Editors insert calendar entries" ON public.calendar_entries
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors update calendar entries" ON public.calendar_entries
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors delete calendar entries" ON public.calendar_entries
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER calendar_entries_touch_updated_at
  BEFORE UPDATE ON public.calendar_entries
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.calendar_entries (cycle, window_label, title, format, sector, status, note, sort_order) VALUES
('Cycle I','Jan — Feb','On the Architecture of Patience','Essay · 12 min',NULL,'published','Opening instrument of the year. Sets the reading frame for every brief that follows.',1),
('Cycle I','Feb','Buildings as Gravity Wells','Sector brief','real-estate','published','First of the sector briefs — the built environment graded on irreversibility.',2),
('Cycle II','Mar — Apr','Why Markets Misprice Silence','Thesis · 8 min',NULL,'published','Restraint as an asset class. Instrumented with the decay curve.',3),
('Cycle II','Apr','Tools Built as Artifacts','Sector brief','technology','published','Software judged by the transfer test rather than adoption velocity.',4),
('Cycle III','May — Jun','Service Designed as Ritual','Sector brief','hospitality','published','Hotels as the most legible test of designed ritual at scale.',5),
('Cycle III','Jun','Engineering the Heirloom Brand','Case · 18 min','luxury','in-studio','Longest instrument of the year; the transfer test written out in full.',6),
('Cycle IV','Jul — Aug','Channels That Operate as Institutions','Sector brief','media','in-studio','Media graded as infrastructure rather than distribution.',7),
('Cycle IV','Aug','Patient Money, Stated Plainly','Doctrine note','capital','scheduled','Companion reading to the Capital Doctrine in the governance set.',8),
('Cycle V','Sep — Oct','Vehicles as Heirloom-Grade Objects','Sector brief','automotive','scheduled','Motion bloc, part one. Cabin and object graded on the same criteria as a building.',9),
('Cycle V','Oct','Air Travel Restored to Ritual','Sector brief','airlines','scheduled','Motion bloc, part two.',10),
('Cycle VI','Nov','Journeys Engineered to Be Remembered','Sector brief','tourism','scheduled','Motion bloc, part three. Closes the 2026 sector sequence.',11),
('Cycle VI','Dec','Held open','Reserved slot',NULL,'open','Deliberately unfilled. Editorial Standard 4.1 — an empty entry is preferable to a filled one.',12);