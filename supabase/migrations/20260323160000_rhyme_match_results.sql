-- Migration: rhyme_match_results table
-- Stores rhyme matching activity scores per child per story

CREATE TABLE IF NOT EXISTS public.rhyme_match_results (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_key  text NOT NULL DEFAULT 'kitty',
  story_title  text NOT NULL,
  child_name   text,
  score        integer NOT NULL DEFAULT 0,
  total        integer NOT NULL DEFAULT 0,
  attempts     integer NOT NULL DEFAULT 1,
  date_time    timestamptz NOT NULL DEFAULT now(),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookups by profile
CREATE INDEX IF NOT EXISTS rhyme_match_results_profile_key_idx
  ON public.rhyme_match_results (profile_key);

-- RLS
ALTER TABLE public.rhyme_match_results ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'rhyme_match_results'
      AND policyname = 'Allow all for profile key'
  ) THEN
    CREATE POLICY "Allow all for profile key"
      ON public.rhyme_match_results
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
