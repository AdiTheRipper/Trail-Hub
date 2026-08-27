'use client'

import dynamic from 'next/dynamic'

// Leaflet is browser-only — dynamic import with ssr:false must be in a Client Component
const TrailMap = dynamic(() => import('@/components/TrailMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-stone-100 flex items-center justify-center rounded-2xl">
      <div className="text-stone-400 text-sm animate-pulse">Loading map…</div>
    </div>
  ),
})

export default function TrailMapWrapper({ className, style }) {
  return <TrailMap className={className} style={style} />
}
