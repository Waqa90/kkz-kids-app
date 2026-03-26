-- Migration: Create opposite_words_results table
-- Matches the pattern of word_match_results and rhyme_match_results

CREATE TABLE IF NOT EXISTS public.opposite_words_results (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_key text NOT NULL DEFAULT 'kitty',
  story_title text NOT NULL,
  child_name  text,
  score       integer NOT NULL DEFAULT 0,
  total       integer NOT NULL DEFAULT 7,
  attempts    integer NOT NULL DEFAULT 1,
  date_time   timestamptz NOT NULL DEFAULT now(),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookups by profile
CREATE INDEX IF NOT EXISTS opposite_words_results_profile_key_idx
  ON public.opposite_words_results (profile_key);

-- Index for ordering by date
CREATE INDEX IF NOT EXISTS opposite_words_results_date_time_idx
  ON public.opposite_words_results (date_time DESC);

-- Enable Row Level Security
ALTER TABLE public.opposite_words_results ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (app uses profile_key for scoping)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'opposite_words_results'
      AND policyname = 'Allow all for opposite_words_results'
  ) THEN
    CREATE POLICY "Allow all for opposite_words_results"
      ON public.opposite_words_results
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END;
$$;
