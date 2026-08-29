-- ============================================================
-- Seed data for Sahyadri Trail Hub
-- Paste into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

INSERT INTO public.trails (name, slug, description, region, latitude, longitude, elevation_meters, length_km, difficulty, is_fort, is_community_submitted)
VALUES
  -- ── PUNE REGION ────────────────────────────────────────────
  ('Rajgad Fort', 'rajgad-fort', 'The King of Forts — Shivaji Maharaj''s capital for 26 years. A must-do multi-day trek with sweeping views of the Sahyadri range.', 'Pune', 18.2463, 73.6826, 1376, 14, 'hard', true, false),
  ('Torna Fort', 'torna-fort', 'The first fort captured by Shivaji Maharaj at age 16. One of the highest forts in Maharashtra.', 'Pune', 18.2742, 73.6218, 1403, 8, 'hard', true, false),
  ('Sinhagad Fort', 'sinhagad-fort', 'Historic fort overlooking Pune. Famous for the midnight battle of Sinhagad and for its puranpoli. A popular sunrise trek.', 'Pune', 18.3667, 73.7549, 1312, 5, 'easy', true, false),
  ('Lohagad Fort', 'lohagad-fort', 'Iron Fort near Lonavala — a scenic and easy climb. Fantastic views of Visapur and Pawna lake.', 'Pune', 18.7333, 73.4667, 1033, 4, 'easy', true, false),
  ('Visapur Fort', 'visapur-fort', 'Twin fort of Lohagad, located across the valley. Larger than Lohagad with ancient rock-cut cisterns.', 'Pune', 18.7274, 73.5054, 1084, 5, 'moderate', true, false),
  ('Rajmachi Fort', 'rajmachi-fort', 'Twin forts Shrivardhan and Manaranjan near Lonavala. A stunning overnight trek with firefly season in monsoon.', 'Pune', 18.7483, 73.3667, 830, 16, 'moderate', true, false),
  ('Tikona Fort', 'tikona-fort', 'Pyramid-shaped fort near Pawna lake. Short but steep — stunning views of the lake and Lohagad.', 'Pune', 18.6583, 73.5134, 1033, 3.5, 'moderate', true, false),
  ('Tung Fort', 'tung-fort', 'Small but beautiful fort near Pawna lake with a distinctive rocky peak. Great views of Pawna reservoir.', 'Pune', 18.6721, 73.4831, 1075, 2.5, 'easy', true, false),
  ('Purandar Fort', 'purandar-fort', 'Historic fort where Shivaji''s son Sambhaji was born. Twin forts — Purandar and Vajragad.', 'Pune', 18.2767, 73.9784, 1390, 6, 'moderate', true, false),
  ('Raigad Fort', 'raigad-fort', 'Shivaji Maharaj''s coronation capital. Now accessible by ropeway. One of the most important forts in Maratha history.', 'Raigad', 18.2331, 73.4463, 820, 7, 'moderate', true, false),

  -- ── NASHIK REGION ──────────────────────────────────────────
  ('Kalsubai Peak', 'kalsubai-peak', 'The highest peak in Maharashtra at 1646m — often called the Everest of Maharashtra. Stunning 360° views.', 'Nashik', 19.5986, 73.7149, 1646, 7, 'moderate', false, false),
  ('Harishchandragad', 'harishchandragad', 'Famous for the stunning overhanging Konkan Kada cliff. Ancient temple and multiple route options. A true epic trek.', 'Ahmednagar', 19.3869, 73.7796, 1424, 12, 'expert', true, false),
  ('Alang Fort', 'alang-fort', 'Part of the AMK (Alang-Madan-Kulang) trio — considered one of the most challenging treks in Maharashtra.', 'Nashik', 19.7800, 73.6900, 1350, 18, 'expert', true, false),
  ('Kulang Fort', 'kulang-fort', 'Part of the AMK trio. Tall monolithic rock — requires rope climbing to summit. For experienced trekkers only.', 'Nashik', 19.7967, 73.6950, 1459, 18, 'expert', true, false),
  ('Salher Fort', 'salher-fort', 'The highest fort in Maharashtra at 1567m. Scene of the famous Battle of Salher in 1672.', 'Nashik', 20.6010, 73.8080, 1567, 10, 'hard', true, false),
  ('Trimbakeshwar Hills', 'trimbakeshwar', 'Spiritual trek starting from the famous Trimbakeshwar Jyotirlinga temple. Source of the Godavari river.', 'Nashik', 19.9333, 73.5278, 1300, 8, 'moderate', false, false),

  -- ── THANE / KONKAN REGION ──────────────────────────────────
  ('Kalu Waterfall', 'kalu-waterfall', 'Stunning monsoon waterfall near Murbad. The cascading falls through dense forest make it magical in July-August.', 'Thane', 19.1300, 73.5200, 600, 4, 'easy', false, false),
  ('Bhandardara Trek', 'bhandardara', 'Scenic trek around the Arthur Lake reservoir and Ratangad fort. Perfect basecamp for multiple trails.', 'Ahmednagar', 19.5333, 73.7583, 900, 12, 'moderate', false, false),
  ('Gorakhgad Fort', 'gorakhgad-fort', 'A hidden gem in the Murbad area. Distinctive rock-cut caves and a dramatic rock face.', 'Thane', 19.4167, 73.5333, 952, 5, 'hard', true, false),
  ('Mahuli Fort', 'mahuli-fort', 'The highest peak in the Thane district. A tough climb with lush monsoon greenery.', 'Thane', 19.5500, 73.4000, 858, 6, 'hard', true, false),
  ('Prabalgad Fort', 'prabalgad-fort', 'Also known as Kalavantin Durg''s neighbour. Relatively easier but equally scenic fort near Panvel.', 'Raigad', 18.9327, 73.2250, 703, 6, 'moderate', true, false),
  ('Kalavantin Durg', 'kalavantin-durg', 'The most dramatic fort pinnacle in Maharashtra — essentially a vertical rock staircase. Not for the faint-hearted.', 'Raigad', 18.9283, 73.2205, 690, 5, 'expert', true, false),
  ('Irshalgad Fort', 'irshalgad-fort', 'Quick but steep fort near Kalyan. Perfect for a half-day trek, with a natural rock cave and a stunning view.', 'Thane', 19.2250, 73.2667, 679, 3, 'moderate', true, false),

  -- ── SATARA / KOLHAPUR REGION ───────────────────────────────
  ('Ajinkyatara Fort', 'ajinkyatara-fort', 'Historic fort right in the heart of Satara city. Easy climb with panoramic views of Satara valley.', 'Satara', 17.6805, 73.9985, 924, 3, 'easy', true, false),
  ('Pratapgad Fort', 'pratapgad-fort', 'Famous for the Battle of Pratapgad (1659) where Shivaji defeated Afzal Khan. One of Maharashtra''s most visited forts.', 'Satara', 17.9404, 73.5791, 1080, 2, 'easy', true, false),
  ('Vastangad Fort', 'vastangad-fort', 'Remote fort in the Patan region of Satara. Less visited but historically significant and trek is very scenic.', 'Satara', 17.5800, 73.7200, 1100, 8, 'hard', true, false),
  ('Kas Plateau', 'kas-plateau', 'UNESCO World Heritage Site — Valley of Flowers of Maharashtra. Best visited September-October for wildflower bloom.', 'Satara', 17.7167, 73.8167, 1200, 5, 'easy', false, false),

  -- ── PUNE/SAHYADRI WATERFALLS ──────────────────────────────
  ('Lingmala Waterfall', 'lingmala-waterfall', 'One of the highest waterfalls near Mahabaleshwar. A short scenic trail through the forest.', 'Satara', 17.9402, 73.6578, 1200, 2, 'easy', false, false),
  ('Devkund Waterfall', 'devkund-waterfall', 'Hidden gem near Bhira dam. A jungle trek ending at a pristine waterfall with a natural swimming pool.', 'Raigad', 18.3367, 73.2867, 400, 8, 'moderate', false, false),
  ('Randha Falls', 'randha-falls', 'Impressive waterfall on the Pravara river near Bhandardara. Spectacular during monsoon.', 'Ahmednagar', 19.5167, 73.7833, 700, 1, 'easy', false, false)

ON CONFLICT (slug) DO UPDATE
  SET description = EXCLUDED.description,
      elevation_meters = EXCLUDED.elevation_meters,
      length_km = EXCLUDED.length_km,
      difficulty = EXCLUDED.difficulty;
