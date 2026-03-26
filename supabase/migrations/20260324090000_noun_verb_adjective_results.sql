-- Migration: noun_verb_adjective_results
-- Stores results from the Noun, Verb, Adjective Sorting activity

CREATE TABLE IF NOT EXISTS public.noun_verb_adjective_results (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_key text NOT NULL DEFAULT 'kitty',
  story_title text NOT NULL,
  child_name  text,
  score       integer NOT NULL DEFAULT 0,
  total       integer NOT NULL DEFAULT 15,
  attempts    integer NOT NULL DEFAULT 1,
  date_time   timestamptz NOT NULL DEFAULT now(),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookups by profile
CREATE INDEX IF NOT EXISTS idx_noun_verb_adjective_results_profile
  ON public.noun_verb_adjective_results (profile_key, date_time DESC);

-- Enable Row Level Security
ALTER TABLE public.noun_verb_adjective_results ENABLE ROW LEVEL SECURITY;

-- Allow all operations for the app (anon key access)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'noun_verb_adjective_results'
      AND policyname = 'allow_all_noun_verb_adjective_results'
  ) THEN
    CREATE POLICY allow_all_noun_verb_adjective_results
      ON public.noun_verb_adjective_results
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
