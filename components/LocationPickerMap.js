'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

function fixLeafletIcons() {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

function makeIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;background:#dc2626;border:2.5px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

function MapController({ position, onLocationSelect }) {
  const map = useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng)
      }
    }
  })

  useEffect(() => {
    if (position && !isNaN(position.lat) && !isNaN(position.lng)) {
      // Smoothly pan map to new position without changing zoom unless fully zoomed out
      map.flyTo([position.lat, position.lng], map.getZoom() < 10 ? 12 : map.getZoom(), {
        animate: true,
        duration: 0.5
      })
    }
  }, [position, map])

  return position && !isNaN(position.lat) && !isNaN(position.lng) ? (
    <Marker position={position} icon={makeIcon()} />
  ) : null
}

export default function LocationPickerMap({ onLocationSelect, lat, lng }) {
  useEffect(() => fixLeafletIcons(), [])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const position = (lat && lng) ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null

  async function handleSearch(e) {
    if (e && e.preventDefault) e.preventDefault()
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      if (data && data.length > 0) {
        const newLat = parseFloat(data[0].lat)
        const newLng = parseFloat(data[0].lon)
        if (onLocationSelect) onLocationSelect(newLat, newLng)
      } else {
        alert('Location not found')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Search overlay (absolute so it sits on top of map tiles) */}
      <div className="absolute top-2 right-2 left-12 z-[400]">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search map (e.g. Rajgad, Pune)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(e) }}
            className="flex-1 px-3 py-1.5 text-sm rounded border border-stone-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
          />
          <button 
            type="button" 
            onClick={handleSearch}
            disabled={isSearching} 
            className="px-3 py-1.5 bg-white text-sm font-medium rounded border border-stone-300 shadow-sm hover:bg-stone-50 disabled:opacity-50 transition-colors"
          >
            {isSearching ? '...' : 'Search'}
          </button>
        </div>
      </div>

      <MapContainer
        center={[18.9, 73.6]} // Center roughly on Sahyadri
        zoom={7}
        style={{ flex: 1, width: '100%', zIndex: 10 }}
      >
        <TileLayer 
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        />
        <MapController position={position} onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  )
}
