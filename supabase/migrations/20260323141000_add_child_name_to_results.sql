-- Migration: Add child_name column to quiz_results and fill_in_blanks_results tables
-- Timestamp: 20260323141000

ALTER TABLE public.quiz_results
ADD COLUMN IF NOT EXISTS child_name TEXT;

ALTER TABLE public.fill_in_blanks_results
ADD COLUMN IF NOT EXISTS child_name TEXT;
