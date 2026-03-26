-- Migration: quiz_results and practice_words tables
-- These tables store Kitty's quiz progress and saved practice words
-- No auth required — data is keyed by a profile_key (device/app identifier)

-- ── quiz_results ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_key TEXT NOT NULL DEFAULT 'kitty',
  story_title TEXT NOT NULL,
  score       INTEGER NOT NULL DEFAULT 0,
  total       INTEGER NOT NULL DEFAULT 0,
  date_time   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quiz_results_profile_key ON public.quiz_results(profile_key);
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at  ON public.quiz_results(created_at DESC);

ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_access_quiz_results" ON public.quiz_results;
CREATE POLICY "public_access_quiz_results"
  ON public.quiz_results
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- ── practice_words ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.practice_words (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_key    TEXT NOT NULL DEFAULT 'kitty',
  word           TEXT NOT NULL,
  source         TEXT NOT NULL DEFAULT 'story',
  story_title    TEXT,
  added_at       BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT * 1000,
  practiced      BOOLEAN NOT NULL DEFAULT false,
  practice_count INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_practice_words_profile_key ON public.practice_words(profile_key);
CREATE INDEX IF NOT EXISTS idx_practice_words_word        ON public.practice_words(profile_key, word);

ALTER TABLE public.practice_words ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_access_practice_words" ON public.practice_words;
CREATE POLICY "public_access_practice_words"
  ON public.practice_words
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- ── updated_at trigger for practice_words ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_practice_words_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_practice_words_updated_at ON public.practice_words;
CREATE TRIGGER trg_practice_words_updated_at
  BEFORE UPDATE ON public.practice_words
  FOR EACH ROW
  EXECUTE FUNCTION public.update_practice_words_updated_at();
