-- Migration: fill_in_blanks_results table
-- Stores Kitty's Fill in the Blanks activity scores for parent dashboard monitoring
-- Designed to be extensible — future activities follow the same pattern

CREATE TABLE IF NOT EXISTS public.fill_in_blanks_results (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_key TEXT NOT NULL DEFAULT 'kitty',
  story_title TEXT NOT NULL,
  score       INTEGER NOT NULL DEFAULT 0,
  total       INTEGER NOT NULL DEFAULT 0,
  date_time   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_fill_in_blanks_profile_key ON public.fill_in_blanks_results(profile_key);
CREATE INDEX IF NOT EXISTS idx_fill_in_blanks_created_at  ON public.fill_in_blanks_results(created_at DESC);

ALTER TABLE public.fill_in_blanks_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_access_fill_in_blanks_results" ON public.fill_in_blanks_results;
CREATE POLICY "public_access_fill_in_blanks_results"
  ON public.fill_in_blanks_results
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
