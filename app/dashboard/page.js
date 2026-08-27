import Link from 'next/link'

/**
 * Dashboard placeholder — will be fully built in the next phase.
 * Shows the hiker's trek timeline, badges, and stats.
 */
export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center py-20">
        <div className="text-6xl mb-6">🏔️</div>
        <h1 className="text-3xl font-bold text-stone-900 mb-3">Your Trek Dashboard</h1>
        <p className="text-stone-500 mb-8 max-w-md mx-auto">
          This is where your trek timeline, badges, and stats will live.
          Coming soon — for now, go log your first trek!
        </p>
        <Link
          href="/log"
          className="inline-block px-8 py-3 bg-forest-700 text-white font-semibold rounded-xl hover:bg-forest-800 transition-colors"
        >
          Log a Trek →
        </Link>
      </div>
    </div>
  )
}
