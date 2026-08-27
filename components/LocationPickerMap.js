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

function ClickHandler({ onLocationSelect, position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng)
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng)
      }
    }
  })
  return position ? <Marker position={position} icon={makeIcon()} /> : null
}

export default function LocationPickerMap({ onLocationSelect }) {
  useEffect(() => fixLeafletIcons(), [])
  const [position, setPosition] = useState(null)

  return (
    <MapContainer
      center={[18.9, 73.6]} // Center roughly on Sahyadri
      zoom={7}
      style={{ height: '100%', width: '100%', zIndex: 10 }}
    >
      <TileLayer 
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
      />
      <ClickHandler onLocationSelect={onLocationSelect} position={position} setPosition={setPosition} />
    </MapContainer>
  )
}
