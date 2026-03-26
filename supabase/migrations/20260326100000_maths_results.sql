CREATE TABLE IF NOT EXISTS public.maths_results (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_key TEXT NOT NULL DEFAULT 'kitty',
  child_name  TEXT,
  set_id      TEXT NOT NULL,
  set_title   TEXT NOT NULL,
  topic       TEXT NOT NULL,
  class_level INTEGER NOT NULL,
  score       INTEGER NOT NULL DEFAULT 0,
  total       INTEGER NOT NULL DEFAULT 0,
  date_time   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_maths_results_profile ON public.maths_results(profile_key);
CREATE INDEX IF NOT EXISTS idx_maths_results_child ON public.maths_results(child_name);
CREATE INDEX IF NOT EXISTS idx_maths_results_created ON public.maths_results(created_at DESC);
ALTER TABLE public.maths_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_access_maths_results" ON public.maths_results;
CREATE POLICY "public_access_maths_results" ON public.maths_results FOR ALL TO public USING (true) WITH CHECK (true);
