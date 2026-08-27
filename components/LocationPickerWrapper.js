'use client'

import dynamic from 'next/dynamic'

const LocationPickerMap = dynamic(() => import('@/components/LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-stone-100 flex items-center justify-center">
      <div className="text-stone-400 text-sm animate-pulse">Loading map…</div>
    </div>
  ),
})

export default function LocationPickerWrapper({ onLocationSelect }) {
  return <LocationPickerMap onLocationSelect={onLocationSelect} />
}
