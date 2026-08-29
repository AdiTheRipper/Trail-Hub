'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import LocationPickerWrapper from '@/components/LocationPickerWrapper'

const REGIONS = ['Pune', 'Nashik', 'Mumbai', 'Thane', 'Raigad', 'Ratnagiri', 'Satara', 'Kolhapur', 'Ahmednagar', 'Other']
const DIFFICULTIES = ['easy', 'moderate', 'hard', 'expert']

const DIFFICULTY_LABEL = {
  easy: '🟢 Easy',
  moderate: '🟡 Moderate',
  hard: '🔴 Hard',
  expert: '🟣 Expert',
}

const LOG_TYPES = [
  { key: 'trek', icon: '🥾', label: 'Trek / Climb', sub: 'Full hike, summit attempt' },
  { key: 'trail_visit', icon: '🌿', label: 'Trail Visit', sub: 'Casual walk, day trip' },
]

export default function LogTrekPage() {
  const router = useRouter()
  const supabaseRef = useRef(null)

  // Auth state
  const [user, setUser] = useState(null)
  const [hiker, setHiker] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // UI state
  const [logType, setLogType] = useState('trek')   // 'trek' | 'trail_visit'
  const [mode, setMode] = useState('memoir')        // 'memoir' | 'live'
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Trail search
  const [trailSearch, setTrailSearch] = useState('')
  const [trailResults, setTrailResults] = useState([])
  const [popularTrails, setPopularTrails] = useState([])
  const [selectedTrail, setSelectedTrail] = useState(null)
  const [addingNew, setAddingNew] = useState(false)

  // New trail fields
  const [newTrail, setNewTrail] = useState({
    name: '', region: 'Pune', latitude: '', longitude: '',
    elevation_meters: '', length_km: '', difficulty: 'moderate', is_fort: false,
  })

  // Trek log fields
  const [trekForm, setTrekForm] = useState({
    date_climbed: new Date().toISOString().split('T')[0],
    story: '',
    conditions_review: '',
    rating: 0,
    drive_folder_url: '',
    google_photos_url: '',
  })

  // GPS verification
  const [gpsStatus, setGpsStatus] = useState('idle') // idle | checking | success | fail | error
  const [gpsCoords, setGpsCoords] = useState(null)

  // ── Auth check & initial data ────────────────────────────────
  useEffect(() => {
    const supabase = createClient()
    supabaseRef.current = supabase

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push('/auth/login')
        return
      }
      setUser(session.user)

      // Load hiker profile
      const { data } = await supabase
        .from('hikers')
        .select('*')
        .eq('id', session.user.id)
        .single()
      setHiker(data)
      setAuthLoading(false)
    })

    // Prefetch popular trails
    const supabase2 = createClient()
    supabase2
      .from('trails')
      .select('id, name, region, difficulty, elevation_meters, is_fort')
      .limit(8)
      .then(({ data }) => { if (data) setPopularTrails(data) })
  }, [])

  // ── Trail search ─────────────────────────────────────────────
  useEffect(() => {
    if (!trailSearch.trim() || trailSearch.length < 2) {
      setTrailResults([])
      return
    }
    const supabase = supabaseRef.current
    if (!supabase) return

    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('trails')
        .select('id, name, region, difficulty, elevation_meters, is_fort')
        .ilike('name', `%${trailSearch}%`)
        .limit(6)
      setTrailResults(data || [])
    }, 300)

    return () => clearTimeout(timer)
  }, [trailSearch])

  // ── GPS verification ─────────────────────────────────────────
  function verifyGps() {
    if (!selectedTrail) return
    setGpsStatus('checking')

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setGpsCoords({ latitude, longitude })

        const R = 6371000
        const dLat = ((selectedTrail.latitude - latitude) * Math.PI) / 180
        const dLon = ((selectedTrail.longitude - longitude) * Math.PI) / 180
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((latitude * Math.PI) / 180) *
            Math.cos((selectedTrail.latitude * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2
        const distance = 2 * R * Math.asin(Math.sqrt(a))
        setGpsStatus(distance <= 500 ? 'success' : 'fail')
      },
      () => setGpsStatus('error')
    )
  }

  // ── Create new community trail ────────────────────────────────
  async function createTrail() {
    const supabase = supabaseRef.current
    const { data, error } = await supabase
      .from('trails')
      .insert({
        ...newTrail,
        slug: newTrail.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        latitude: parseFloat(newTrail.latitude),
        longitude: parseFloat(newTrail.longitude),
        elevation_meters: newTrail.elevation_meters ? parseInt(newTrail.elevation_meters) : null,
        length_km: newTrail.length_km ? parseFloat(newTrail.length_km) : null,
        is_community_submitted: true,
        submitted_by: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // ── Submit ────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedTrail && !addingNew) {
      setError('Please select or add a trail first.')
      return
    }
    setSubmitting(true)
    setError('')

    try {
      const supabase = supabaseRef.current

      let trail = selectedTrail
      if (addingNew) {
        trail = await createTrail()
      }

      if (!hiker) {
        throw new Error('Your hiker profile is missing. Please sign out and sign up again.')
      }

      const isVerified = mode === 'live' && gpsStatus === 'success'

      const { error: trekError } = await supabase
        .from('trek_logs')
        .insert({
          hiker_id: hiker.id,
          trail_id: trail.id,
          date_climbed: trekForm.date_climbed,
          story: trekForm.story || null,
          conditions_review: trekForm.conditions_review || null,
          rating: trekForm.rating || null,
          is_verified: isVerified,
          drive_folder_url: trekForm.drive_folder_url || null,
          google_photos_url: trekForm.google_photos_url || null,
          log_type: logType,
        })

      if (trekError) throw trekError

      router.push(`/log/success?trail=${encodeURIComponent(trail.name)}&type=${logType}`)
    } catch (err) {
      console.error('Trek submission failed:', err)
      setError(err.message || 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  // ── Loading ──────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-stone-400 animate-pulse">Loading…</div>
      </div>
    )
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Log an entry</h1>
        <p className="text-stone-500">
          Add a trek or trail visit to your Sahyadri timeline.
        </p>
      </div>

      {/* Log type toggle */}
      <div className="flex rounded-xl overflow-hidden border border-stone-200 mb-4 bg-stone-50">
        {LOG_TYPES.map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => setLogType(t.key)}
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
              logType === t.key
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {t.icon} {t.label}
            <span className="block text-xs font-normal text-stone-400">{t.sub}</span>
          </button>
        ))}
      </div>

      {/* Memoir / Live toggle (only for treks) */}
      {logType === 'trek' && (
        <div className="flex rounded-xl overflow-hidden border border-stone-200 mb-8 bg-stone-50">
          {[
            { key: 'memoir', label: '📖 Memoir', sub: 'Past trek' },
            { key: 'live', label: '📍 Live', sub: "I'm here now" },
          ].map(m => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                mode === m.key
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {m.label}
              <span className="block text-xs font-normal text-stone-400">{m.sub}</span>
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── TRAIL SELECTION ──────────────────────────── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h2 className="font-semibold text-stone-900 mb-4">1. Which trail?</h2>

          {!selectedTrail && !addingNew ? (
            <>
              <div className="relative">
                <input
                  type="text"
                  value={trailSearch}
                  onChange={e => setTrailSearch(e.target.value)}
                  placeholder="Search trails… e.g. Rajgad, Kalsubai"
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 transition"
                />
                {trailSearch && (
                  <button
                    type="button"
                    onClick={() => setTrailSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >✕</button>
                )}
              </div>

              {/* Search results */}
              {trailResults.length > 0 && (
                <div className="mt-2 rounded-lg border border-stone-100 overflow-hidden shadow-sm">
                  {trailResults.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => { setSelectedTrail(t); setTrailSearch('') }}
                      className="w-full text-left px-4 py-3 hover:bg-stone-50 transition-colors border-b border-stone-50 last:border-0"
                    >
                      <span className="font-medium text-stone-800 text-sm">{t.is_fort ? '🏯' : '🥾'} {t.name}</span>
                      <span className="text-stone-400 text-xs ml-2">{t.region} · {t.difficulty}</span>
                    </button>
                  ))}
                </div>
              )}

              {trailSearch.length >= 2 && trailResults.length === 0 && (
                <div className="mt-2 text-sm text-stone-500">
                  No trails found.{' '}
                  <button
                    type="button"
                    onClick={() => { setAddingNew(true); setNewTrail(n => ({ ...n, name: trailSearch })) }}
                    className="text-green-700 font-medium hover:underline"
                  >
                    Add "{trailSearch}" as a new trail →
                  </button>
                </div>
              )}

              {/* Popular trails */}
              {!trailSearch.trim() && popularTrails.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Popular Trails</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {popularTrails.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTrail(t)}
                        className="text-left px-3 py-2.5 border border-stone-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
                      >
                        <div className="font-medium text-stone-800 text-sm">{t.is_fort ? '🏯' : '🥾'} {t.name}</div>
                        <div className="text-stone-400 text-xs mt-0.5">{t.region} · {t.difficulty}{t.elevation_meters ? ` · ${t.elevation_meters}m` : ''}</div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 text-center">
                    <button
                      type="button"
                      onClick={() => setAddingNew(true)}
                      className="text-xs text-stone-400 hover:text-stone-600 underline"
                    >
                      Or add a new trail not listed here
                    </button>
                  </div>
                </div>
              )}

              {!trailSearch.trim() && popularTrails.length === 0 && (
                <div className="mt-4 text-center text-sm text-stone-400 py-4 border border-dashed border-stone-200 rounded-lg">
                  Type to search, or{' '}
                  <button type="button" onClick={() => setAddingNew(true)} className="text-green-700 underline">
                    add a new trail
                  </button>
                </div>
              )}
            </>
          ) : selectedTrail ? (
            <div className="flex items-center justify-between bg-green-50 rounded-lg px-4 py-3 border border-green-100">
              <div>
                <div className="font-semibold text-stone-800">{selectedTrail.is_fort ? '🏯' : '🥾'} {selectedTrail.name}</div>
                <div className="text-xs text-stone-500">{selectedTrail.region} · {selectedTrail.difficulty}{selectedTrail.elevation_meters ? ` · ${selectedTrail.elevation_meters}m` : ''}</div>
              </div>
              <button type="button" onClick={() => setSelectedTrail(null)} className="text-xs text-stone-400 hover:text-stone-600">Change</button>
            </div>
          ) : (
            /* New trail form */
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-stone-700">New community trail</span>
                <button type="button" onClick={() => setAddingNew(false)} className="text-xs text-stone-400 hover:text-stone-600">Cancel</button>
              </div>
              <input
                type="text"
                placeholder="Trail name *"
                value={newTrail.name}
                onChange={e => setNewTrail(n => ({ ...n, name: e.target.value }))}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
              <div className="h-52 rounded-lg overflow-hidden border border-stone-200">
                <LocationPickerWrapper
                  lat={newTrail.latitude}
                  lng={newTrail.longitude}
                  onLocationSelect={(lat, lng) => {
                    setNewTrail(n => ({
                      ...n,
                      latitude: lat.toFixed(5),
                      longitude: lng.toFixed(5)
                    }))
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Latitude *</label>
                  <input type="number" step="any" placeholder="e.g. 18.2463" value={newTrail.latitude}
                    onChange={e => setNewTrail(n => ({ ...n, latitude: e.target.value }))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600" required />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Longitude *</label>
                  <input type="number" step="any" placeholder="e.g. 73.6826" value={newTrail.longitude}
                    onChange={e => setNewTrail(n => ({ ...n, longitude: e.target.value }))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={newTrail.region} onChange={e => setNewTrail(n => ({ ...n, region: e.target.value }))}
                  className="px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600">
                  {REGIONS.map(r => <option key={r}>{r}</option>)}
                </select>
                <select value={newTrail.difficulty} onChange={e => setNewTrail(n => ({ ...n, difficulty: e.target.value }))}
                  className="px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600">
                  {DIFFICULTIES.map(d => <option key={d} value={d}>{DIFFICULTY_LABEL[d]}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Elevation (m)" value={newTrail.elevation_meters}
                  onChange={e => setNewTrail(n => ({ ...n, elevation_meters: e.target.value }))}
                  className="px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
                <input type="number" step="0.01" placeholder="Length (km)" value={newTrail.length_km}
                  onChange={e => setNewTrail(n => ({ ...n, length_km: e.target.value }))}
                  className="px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
              </div>
              <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
                <input type="checkbox" checked={newTrail.is_fort}
                  onChange={e => setNewTrail(n => ({ ...n, is_fort: e.target.checked }))}
                  className="rounded border-stone-300 text-green-600 focus:ring-green-500" />
                This is a fort / historical site
              </label>
              <p className="text-xs text-stone-400">📍 Click on the map to set coordinates, or type them manually above.</p>
            </div>
          )}
        </div>

        {/* ── DETAILS ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h2 className="font-semibold text-stone-900 mb-4">2. Details</h2>
          <div className="space-y-4">

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                {mode === 'live' ? 'Today' : logType === 'trek' ? 'Date climbed' : 'Date visited'}
              </label>
              <input
                type="date"
                value={trekForm.date_climbed}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => setTrekForm(f => ({ ...f, date_climbed: e.target.value }))}
                required
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Star rating */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setTrekForm(f => ({ ...f, rating: star }))}
                    className={`text-2xl transition-transform hover:scale-110 ${
                      trekForm.rating >= star ? 'text-amber-400' : 'text-stone-200'
                    }`}
                  >★</button>
                ))}
                {trekForm.rating > 0 && (
                  <button type="button" onClick={() => setTrekForm(f => ({ ...f, rating: 0 }))}
                    className="text-xs text-stone-400 hover:text-stone-600 self-center ml-1">clear</button>
                )}
              </div>
            </div>

            {/* Conditions */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Trail conditions <span className="text-stone-400 font-normal">(helps others)</span>
              </label>
              <textarea
                value={trekForm.conditions_review}
                onChange={e => setTrekForm(f => ({ ...f, conditions_review: e.target.value }))}
                placeholder="e.g. Trail was slippery after rain. Stream crossing knee-deep. Summit views were amazing."
                rows={3}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
              />
            </div>

            {/* Story */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Your story <span className="text-stone-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={trekForm.story}
                onChange={e => setTrekForm(f => ({ ...f, story: e.target.value }))}
                placeholder="Tell the story of this trek…"
                rows={4}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
              />
            </div>

            {/* Photo links */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                📸 Google Drive folder <span className="text-stone-400 font-normal">(optional)</span>
              </label>
              <input
                type="url"
                value={trekForm.drive_folder_url}
                onChange={e => setTrekForm(f => ({ ...f, drive_folder_url: e.target.value }))}
                placeholder="https://drive.google.com/drive/folders/…"
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                📷 Google Photos album <span className="text-stone-400 font-normal">(optional)</span>
              </label>
              <input
                type="url"
                value={trekForm.google_photos_url}
                onChange={e => setTrekForm(f => ({ ...f, google_photos_url: e.target.value }))}
                placeholder="https://photos.app.goo.gl/…"
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>
        </div>

        {/* ── GPS VERIFICATION (live trek only) ───────────────── */}
        {logType === 'trek' && mode === 'live' && (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <h2 className="font-semibold text-stone-900 mb-2">3. Verify location</h2>
            <p className="text-stone-500 text-sm mb-4">
              Confirm you're at the trailhead to get a ✅ Verified stamp on your timeline.
            </p>

            {gpsStatus === 'idle' && (
              <button
                type="button"
                onClick={verifyGps}
                disabled={!selectedTrail && !addingNew}
                className="w-full py-3 border-2 border-dashed border-stone-200 rounded-xl text-stone-500 hover:border-green-400 hover:text-green-700 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                📍 Check my GPS location
              </button>
            )}
            {gpsStatus === 'checking' && (
              <div className="text-center py-3 text-stone-400 text-sm animate-pulse">Getting your location…</div>
            )}
            {gpsStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm font-medium">
                ✅ Verified! You're at the trailhead.
              </div>
            )}
            {gpsStatus === 'fail' && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm">
                📍 You're more than 500m from the trailhead. Entry will be logged without verification.
              </div>
            )}
            {gpsStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                Location access denied. Enable GPS in your browser to verify, or skip.
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || (!selectedTrail && !addingNew)}
          className="w-full py-4 bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors text-base shadow-lg shadow-green-900/20"
        >
          {submitting
            ? 'Saving…'
            : logType === 'trek'
              ? '🥾 Save trek to timeline'
              : '🌿 Save trail visit to timeline'}
        </button>
      </form>
    </div>
  )
}
