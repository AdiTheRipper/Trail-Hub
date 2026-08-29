-- ============================================================
-- Migration: Add log_type column to trek_logs
-- Paste this into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

ALTER TABLE public.trek_logs
  ADD COLUMN IF NOT EXISTS log_type text DEFAULT 'trek';

-- Also run fix-permissions in case you see "permission denied" errors:
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
