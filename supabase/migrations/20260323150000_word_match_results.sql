-- Word Match results table
-- Stores scores, attempt counts, and timestamps for the word-matching game

CREATE TABLE IF NOT EXISTS public.word_match_results (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_key text NOT NULL DEFAULT 'kitty',
  story_title text NOT NULL,
  child_name  text,
  score       integer NOT NULL DEFAULT 0,
  total       integer NOT NULL DEFAULT 5,
  attempts    integer NOT NULL DEFAULT 1,
  date_time   timestamptz NOT NULL DEFAULT now(),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookups by profile
CREATE INDEX IF NOT EXISTS word_match_results_profile_key_idx
  ON public.word_match_results (profile_key);

-- Index for ordering by date
CREATE INDEX IF NOT EXISTS word_match_results_date_time_idx
  ON public.word_match_results (date_time DESC);

-- Enable Row Level Security
ALTER TABLE public.word_match_results ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anonymous users (app uses profile_key for isolation)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'word_match_results' AND policyname = 'allow_all_word_match'
  ) THEN
    CREATE POLICY allow_all_word_match ON public.word_match_results
      FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
