'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SuccessContent() {
  const params = useSearchParams()
  const trail = params.get('trail') || 'your trail'
  const type = params.get('type') || 'trek'

  const isTrek = type === 'trek'

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">

        {/* Big icon */}
        <div className="text-7xl mb-6">{isTrek ? '🥾' : '🌿'}</div>

        <h1 className="text-3xl font-bold text-stone-900 mb-3">
          {isTrek ? 'Trek logged!' : 'Trail visit logged!'}
        </h1>
        <p className="text-stone-500 mb-2 text-lg">
          <span className="font-semibold text-stone-800">{trail}</span> is now on your timeline.
        </p>
        <p className="text-stone-400 text-sm mb-10">
          {isTrek
            ? 'Your hike is saved. Stories, conditions, and photos are all part of your permanent Sahyadri record.'
            : 'Your trail visit is saved and will appear in your activity timeline.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors"
          >
            View my timeline →
          </Link>
          <Link
            href="/log"
            className="px-6 py-3 border border-stone-200 text-stone-700 font-semibold rounded-xl hover:bg-stone-50 transition-colors"
          >
            Log another
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-stone-400">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  )
}
