-- Pronunciation reports table for Teacher X AI assessment results

CREATE TABLE IF NOT EXISTS public.pronunciation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_key TEXT NOT NULL DEFAULT 'kitty',
  story_id TEXT NOT NULL,
  story_title TEXT NOT NULL,
  session_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  overall_score INTEGER NOT NULL DEFAULT 0,
  words_attempted INTEGER NOT NULL DEFAULT 0,
  words_correct INTEGER NOT NULL DEFAULT 0,
  weak_words JSONB NOT NULL DEFAULT '[]'::jsonb,
  pronunciation_issues JSONB NOT NULL DEFAULT '[]'::jsonb,
  strengths TEXT NOT NULL DEFAULT '',
  improvements_needed TEXT NOT NULL DEFAULT '',
  teacher_feedback TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pronunciation_reports_profile_key ON public.pronunciation_reports(profile_key);
CREATE INDEX IF NOT EXISTS idx_pronunciation_reports_created_at ON public.pronunciation_reports(created_at DESC);

ALTER TABLE public.pronunciation_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pronunciation_reports_open_access" ON public.pronunciation_reports;
CREATE POLICY "pronunciation_reports_open_access"
  ON public.pronunciation_reports
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
