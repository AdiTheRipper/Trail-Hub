-- ============================================================
-- Fix Permissions
-- Paste this into: Supabase Dashboard → SQL Editor → Run
-- This resolves the "permission denied for table trails" error.
-- ============================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
