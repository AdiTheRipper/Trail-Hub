import Image from 'next/image'
import Link from 'next/link'
import TrailMapWrapper from '@/components/TrailMapWrapper'

// Local images for background and badges
const HERO_PHOTO = {
  src: '/hero-bg.jpg',
  alt: 'Sahyadri mountain landscape',
}

const GALLERY = [
  {
    id: '1464822759023-fed622ff2c3b',
    credit: 'Kalen Emsley',
    alt: 'Green mountain valley with clouds',
  },
  {
    id: '1551632811-561732d1e306',
    credit: 'Clemens van Lay',
    alt: 'Hiker on rocky mountain trail',
  },
  {
    id: '1580654712603-eb6b4b4b4b4b',
    credit: 'Unsplash',
    alt: 'Ancient hilltop fort at sunset',
  },
]

const FEATURED_TRAILS = [
  { name: 'Rajgad Fort', region: 'Pune', difficulty: 'Hard', elevation: '1376m', isFort: true },
  { name: 'Harishchandragad', region: 'Ahmednagar', difficulty: 'Expert', elevation: '1424m', isFort: true },
  { name: 'Kalsubai Peak', region: 'Nashik', difficulty: 'Moderate', elevation: '1646m', isFort: false },
  { name: 'Torna Fort', region: 'Pune', difficulty: 'Hard', elevation: '1403m', isFort: true },
  { name: 'Sinhagad Fort', region: 'Pune', difficulty: 'Easy', elevation: '1312m', isFort: true },
  { name: 'Lohagad Fort', region: 'Pune', difficulty: 'Easy', elevation: '1033m', isFort: true },
]

const DIFFICULTY_STYLE = {
  Easy:     'bg-green-100 text-green-800',
  Moderate: 'bg-amber-100 text-amber-800',
  Hard:     'bg-red-100 text-red-800',
  Expert:   'bg-purple-100 text-purple-800',
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative h-[92vh] min-h-[560px] flex items-center justify-center overflow-hidden">

        {/* Full-bleed background photo */}
        <Image
          src={HERO_PHOTO.src}
          alt={HERO_PHOTO.alt}
          fill
          priority
          className="object-cover object-center"
        />

        {/* Gradient overlay — darker at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />

        {/* Hero content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-sm font-medium mb-6 border border-white/25">
            🌿 Built for Sahyadri hikers
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold leading-tight mb-6 drop-shadow-lg">
            Every summit.<br />
            <span className="text-green-400">Every story.</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/85 leading-relaxed mb-10 max-w-2xl mx-auto drop-shadow">
            Log your Sahyadri treks, earn AI-generated badges, and join a community
            of Maharashtra hikers. Past or present — your entire journey, finally in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-8 py-3.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-all text-base shadow-xl shadow-black/30 hover:scale-105"
            >
              Start your trek journal →
            </Link>
            <a
              href="#map"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-semibold rounded-xl transition-all text-base border border-white/30"
            >
              Explore trails ↓
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce text-white/60">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <section className="bg-stone-900 text-white py-5">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-center">
          {[
            { value: '200+', label: 'Sahyadri trails' },
            { value: '50+', label: 'Historic forts' },
            { value: 'Free', label: 'Always & forever' },
            { value: 'AI', label: 'Badge per trail' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-green-400">{s.value}</div>
              <div className="text-xs text-stone-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTERACTIVE MAP ───────────────────────────────────── */}
      <section id="map" className="py-16 px-4 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-stone-900 mb-2">
                Explore the Sahyadri
              </h2>
              <p className="text-stone-500">
                Famous trails and forts across Maharashtra — click any pin for details.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-stone-500 flex-shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-forest-700 inline-block" />
                Fort
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                Trail
              </span>
            </div>
          </div>

          {/* Map container */}
          <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-lg" style={{ height: '480px' }}>
            <TrailMapWrapper />
          </div>

          {/* Trail cards below map */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
            {FEATURED_TRAILS.map(t => (
              <div
                key={t.name}
                className="bg-white rounded-xl p-3 border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-lg mb-1">{t.isFort ? '🏯' : '🥾'}</div>
                <div className="font-semibold text-stone-800 text-xs leading-tight mb-1.5">{t.name}</div>
                <div className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block ${DIFFICULTY_STYLE[t.difficulty]}`}>
                  {t.difficulty}
                </div>
                <div className="text-xs text-stone-400 mt-1">↑ {t.elevation}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-stone-900 mb-3">
            Everything a Sahyadri hiker needs
          </h2>
          <p className="text-center text-stone-500 mb-14 max-w-xl mx-auto">
            Not a generic hiking app. Built specifically for Maharashtra's forts and trails.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📓', title: 'Trek Memoir', desc: 'Log hikes from years ago. Build a complete personal history from your very first summit.' },
              { icon: '📅', title: 'Activity Timeline', desc: 'GitHub-style heatmap and year-grouped timeline. See every trek and trail visit at a glance.' },
              { icon: '📍', title: 'GPS Verification', desc: 'On location? Your browser verifies your GPS — get a Verified stamp, no app download needed.' },
              { icon: '🗺️', title: 'Explore Directory', desc: 'Forts and trails across Pune, Nashik, Konkan — the full Sahyadri range, searchable and filterable.' },
              { icon: '📸', title: 'Photo Memories', desc: 'Link your Google Photos albums — we store the link, your photos stay in your own Google account.' },
              { icon: '🤝', title: 'Community Reports', desc: 'Real conditions from real hikers. Know trail status before you go.' },
            ].map(f => (
              <div key={f.title} className="bg-stone-50 rounded-2xl p-6 border border-stone-100 hover:border-stone-200 transition-colors">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-stone-900 text-lg mb-2">{f.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEMOIR SECTION ────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
              📖 New — Memoir Mode
            </div>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">
              Log treks from years ago
            </h2>
            <p className="text-stone-500 leading-relaxed mb-6">
              Did Harishchandragad in 2019? Log it. Your entire journey as a hiker — not just future
              treks. Add stories, photos, ratings for every summit you've ever done.
            </p>
            <div className="space-y-3">
              {[
                '✅ Any past date — go back years',
                '📸 Link your Google Photos albums',
                '📅 Shows in your personal activity timeline',
                '🗺️ Included in your stats and heatmap',
              ].map(item => (
                <div key={item} className="text-sm text-stone-600">{item}</div>
              ))}
            </div>
            <Link
              href="/auth/signup"
              className="inline-block mt-8 px-6 py-3 bg-stone-900 text-white font-semibold rounded-xl hover:bg-stone-700 transition-colors text-sm"
            >
              Start logging your history →
            </Link>
          </div>

          {/* Fake timeline card */}
          <div className="flex-1 w-full max-w-xs mx-auto">
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 space-y-4">
              <div className="font-semibold text-stone-700 text-sm mb-2">🗓️ Aditya's Timeline</div>
              {[
                { year: '2024', trail: 'Rajmachi Fort', verified: true },
                { year: '2024', trail: 'Kalu Waterfall', verified: true },
                { year: '2022', trail: 'Kalsubai Peak', verified: false },
                { year: '2019', trail: 'Harishchandragad', verified: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 text-xs text-stone-400 font-medium">{item.year}</div>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.verified ? 'bg-green-500' : 'bg-amber-400'}`} />
                  <div className="text-sm text-stone-700">{item.trail}</div>
                  <div className="ml-auto text-xs text-stone-400">{item.verified ? '✅' : '📖'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-green-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to log your first trek?</h2>
          <p className="text-green-300 mb-8">Free forever. No credit card. No subscriptions.</p>
          <Link
            href="/auth/signup"
            className="inline-block px-10 py-4 bg-white text-green-900 hover:bg-green-50 font-bold rounded-xl transition-colors text-lg shadow-xl"
          >
            Create your hiker profile →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="py-8 px-4 bg-stone-950 text-stone-500 text-center text-sm">
        <p>
          Sahyadri Trail Hub · Built with ❤️ for Maharashtra's hikers ·{' '}
          <span className="text-stone-600">Powered by Supabase + Vercel</span>
        </p>
      </footer>
    </div>
  )
}
