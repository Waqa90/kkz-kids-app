CREATE TABLE IF NOT EXISTS public.subject_results (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_key   TEXT NOT NULL DEFAULT 'kitty',
  child_name    TEXT,
  activity_id   TEXT NOT NULL,
  activity_title TEXT NOT NULL,
  subject       TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  class_level   INTEGER NOT NULL,
  score         INTEGER NOT NULL DEFAULT 0,
  total         INTEGER NOT NULL DEFAULT 0,
  date_time     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_subject_results_profile ON public.subject_results(profile_key);
CREATE INDEX IF NOT EXISTS idx_subject_results_child ON public.subject_results(child_name);
CREATE INDEX IF NOT EXISTS idx_subject_results_subject ON public.subject_results(subject);
CREATE INDEX IF NOT EXISTS idx_subject_results_created ON public.subject_results(created_at DESC);
ALTER TABLE public.subject_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_access_subject_results" ON public.subject_results;
CREATE POLICY "public_access_subject_results" ON public.subject_results FOR ALL TO public USING (true) WITH CHECK (true);
