'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SuccessContent() {
  const params = useSearchParams()
  const trailName = params.get('trail') || 'your trail'
  const isFort = params.get('fort') === 'true'
  const isVerified = params.get('verified') === 'true'

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-7xl mb-6">🏅</div>

        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 ${
          isVerified
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-amber-100 text-amber-800 border border-amber-200'
        }`}>
          {isVerified ? '✅ Verified Badge' : '📖 Memoir Badge'}
        </div>

        <h1 className="text-3xl font-bold text-stone-900 mb-3">
          Trek logged! 🎉
        </h1>
        <p className="text-stone-500 mb-2 text-lg">
          You earned the{' '}
          <strong>{isFort ? '🏯' : '🥾'} {trailName}</strong> badge!
        </p>
        <p className="text-stone-400 text-sm mb-10">
          {isVerified
            ? 'GPS-verified at the trailhead — this is a gold verified badge.'
            : 'Memoir badge — the badge is silver and shows up in your timeline.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors"
          >
            View my dashboard →
          </Link>
          <Link
            href="/log"
            className="px-6 py-3 border border-stone-200 text-stone-700 font-semibold rounded-xl hover:bg-stone-50 transition-colors"
          >
            Log another trek
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><div className="text-stone-400 animate-pulse">Loading…</div></div>}>
      <SuccessContent />
    </Suspense>
  )
}
