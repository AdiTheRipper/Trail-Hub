'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet's default icon paths broken by webpack
function fixLeafletIcons() {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

// Custom green marker for forts, blue for trails
function makeIcon(color = 'green') {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:14px;height:14px;
      background:${color === 'green' ? '#15803d' : '#2563eb'};
      border:2.5px solid white;
      border-radius:50%;
      box-shadow:0 1px 4px rgba(0,0,0,0.4)
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  })
}

// 8 famous Sahyadri trails & forts
const FEATURED_TRAILS = [
  {
    name: 'Rajgad Fort',
    lat: 18.2463, lng: 73.6826,
    difficulty: 'Hard', elevation: '1376m',
    region: 'Pune', isFort: true,
    desc: 'The "King of Forts" — Shivaji Maharaj\'s capital for 26 years.',
  },
  {
    name: 'Harishchandragad',
    lat: 19.3869, lng: 73.7796,
    difficulty: 'Expert', elevation: '1424m',
    region: 'Ahmednagar', isFort: true,
    desc: 'Famous for the stunning Konkan Kada cliff — a must-do overnight trek.',
  },
  {
    name: 'Kalsubai Peak',
    lat: 19.5986, lng: 73.7149,
    difficulty: 'Moderate', elevation: '1646m',
    region: 'Nashik', isFort: false,
    desc: 'The highest peak in Maharashtra — a rewarding climb with panoramic views.',
  },
  {
    name: 'Torna Fort',
    lat: 18.2742, lng: 73.6218,
    difficulty: 'Hard', elevation: '1403m',
    region: 'Pune', isFort: true,
    desc: 'The first fort captured by Shivaji Maharaj at just 16 years old.',
  },
  {
    name: 'Sinhagad Fort',
    lat: 18.3667, lng: 73.7549,
    difficulty: 'Easy', elevation: '1312m',
    region: 'Pune', isFort: true,
    desc: 'Historic fort with sweeping views of Pune city — great for beginners.',
  },
  {
    name: 'Lohagad Fort',
    lat: 18.7333, lng: 73.4667,
    difficulty: 'Easy', elevation: '1033m',
    region: 'Pune', isFort: true,
    desc: 'Iron Fort near Lonavala — a scenic and easy climb perfect for families.',
  },
  {
    name: 'Rajmachi Fort',
    lat: 18.7483, lng: 73.3667,
    difficulty: 'Moderate', elevation: '830m',
    region: 'Pune', isFort: true,
    desc: 'Twin forts Shrivardhan & Manaranjan with breathtaking Sahyadri views.',
  },
  {
    name: 'Kalu Waterfall',
    lat: 19.1300, lng: 73.5200,
    difficulty: 'Easy', elevation: '600m',
    region: 'Thane', isFort: false,
    desc: 'A stunning monsoon waterfall surrounded by lush green Western Ghats.',
  },
]

const DIFFICULTY_COLOR = {
  Easy: '#16a34a',
  Moderate: '#d97706',
  Hard: '#dc2626',
  Expert: '#7c3aed',
}

export default function TrailMap() {
  useEffect(() => {
    fixLeafletIcons()
  }, [])

  return (
    <MapContainer
      center={[18.9, 73.6]}
      zoom={8}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {FEATURED_TRAILS.map((trail) => (
        <Marker
          key={trail.name}
          position={[trail.lat, trail.lng]}
          icon={makeIcon(trail.isFort ? 'green' : 'blue')}
        >
          <Popup maxWidth={220}>
            <div style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: 1.4 }}>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: 4 }}>
                {trail.isFort ? '🏯' : '🥾'} {trail.name}
              </div>
              <div style={{ fontSize: '12px', color: '#57534e', marginBottom: 6 }}>
                {trail.desc}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 600, padding: '1px 7px',
                  borderRadius: 99, background: DIFFICULTY_COLOR[trail.difficulty] + '20',
                  color: DIFFICULTY_COLOR[trail.difficulty]
                }}>
                  {trail.difficulty}
                </span>
                <span style={{ fontSize: '11px', color: '#78716c' }}>
                  ↑ {trail.elevation}
                </span>
                <span style={{ fontSize: '11px', color: '#78716c' }}>
                  📍 {trail.region}
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
