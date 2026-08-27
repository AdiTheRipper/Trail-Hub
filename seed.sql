-- ============================================================
-- Seed data for Sahyadri Trail Hub
-- Paste this into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

INSERT INTO public.trails (name, slug, description, region, latitude, longitude, elevation_meters, difficulty, is_fort, is_community_submitted)
VALUES
  ('Rajgad Fort', 'rajgad-fort', 'The King of Forts — Shivaji Maharaj''s capital for 26 years.', 'Pune', 18.2463, 73.6826, 1376, 'hard', true, false),
  ('Harishchandragad', 'harishchandragad', 'Famous for the stunning Konkan Kada cliff.', 'Ahmednagar', 19.3869, 73.7796, 1424, 'expert', true, false),
  ('Kalsubai Peak', 'kalsubai-peak', 'The highest peak in Maharashtra.', 'Nashik', 19.5986, 73.7149, 1646, 'moderate', false, false),
  ('Torna Fort', 'torna-fort', 'The first fort captured by Shivaji Maharaj.', 'Pune', 18.2742, 73.6218, 1403, 'hard', true, false),
  ('Sinhagad Fort', 'sinhagad-fort', 'Historic fort with sweeping views of Pune city.', 'Pune', 18.3667, 73.7549, 1312, 'easy', true, false),
  ('Lohagad Fort', 'lohagad-fort', 'Iron Fort near Lonavala — a scenic and easy climb.', 'Pune', 18.7333, 73.4667, 1033, 'easy', true, false),
  ('Rajmachi Fort', 'rajmachi-fort', 'Twin forts Shrivardhan & Manaranjan.', 'Pune', 18.7483, 73.3667, 830, 'moderate', true, false),
  ('Kalu Waterfall', 'kalu-waterfall', 'A stunning monsoon waterfall.', 'Thane', 19.1300, 73.5200, 600, 'easy', false, false)
ON CONFLICT (slug) DO NOTHING;
