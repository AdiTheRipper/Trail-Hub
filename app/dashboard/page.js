'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

// ── Helpers ──────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function difficultyColor(d) {
  return {
    easy: 'bg-green-100 text-green-800',
    moderate: 'bg-amber-100 text-amber-800',
    hard: 'bg-red-100 text-red-800',
    expert: 'bg-purple-100 text-purple-800',
  }[d] || 'bg-stone-100 text-stone-600'
}

function entryIcon(log) {
  if (log.trails?.is_fort) return '🏯'
  if (log.log_type === 'trail_visit') return '🌿'
  return '🥾'
}

// ── 52-week Activity Heatmap ──────────────────────────────────
function ActivityHeatmap({ logs }) {
  const weeks = 52
  const today = new Date()

  // Build a map of date → count
  const countMap = {}
  logs.forEach(l => {
    const d = l.date_climbed
    if (d) countMap[d] = (countMap[d] || 0) + 1
  })

  // Build grid: 52 columns (weeks), 7 rows (days)
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - (weeks * 7 - 1))

  const grid = [] // array of weeks, each week is 7 days
  let current = new Date(startDate)

  for (let w = 0; w < weeks; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const iso = current.toISOString().split('T')[0]
      week.push({ date: iso, count: countMap[iso] || 0 })
      current.setDate(current.getDate() + 1)
    }
    grid.push(week)
  }

  function cellColor(count) {
    if (count === 0) return 'bg-stone-100'
    if (count === 1) return 'bg-green-200'
    if (count === 2) return 'bg-green-400'
    return 'bg-green-600'
  }

  const totalThisYear = logs.filter(l => l.date_climbed?.startsWith(String(today.getFullYear()))).length

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-stone-900">Activity</h2>
        <span className="text-xs text-stone-400">{totalThisYear} entries this year</span>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-[3px]" style={{ minWidth: '650px' }}>
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.date}
                  title={day.count > 0 ? `${day.date}: ${day.count} entry` : day.date}
                  className={`w-[11px] h-[11px] rounded-[2px] ${cellColor(day.count)} cursor-default`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 text-xs text-stone-400 justify-end">
        <span>Less</span>
        {['bg-stone-100', 'bg-green-200', 'bg-green-400', 'bg-green-600'].map((c, i) => (
          <div key={i} className={`w-[11px] h-[11px] rounded-[2px] ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}

// ── Stats Bar ─────────────────────────────────────────────────
function StatsBar({ logs }) {
  const totalTreks = logs.filter(l => !l.log_type || l.log_type === 'trek').length
  const totalVisits = logs.filter(l => l.log_type === 'trail_visit').length
  const uniqueTrails = new Set(logs.map(l => l.trail_id)).size
  const totalElevation = logs.reduce((sum, l) => sum + (l.trails?.elevation_meters || 0), 0)
  const verified = logs.filter(l => l.is_verified).length

  const stats = [
    { label: 'Treks', value: totalTreks, icon: '🥾' },
    { label: 'Trail Visits', value: totalVisits, icon: '🌿' },
    { label: 'Unique Trails', value: uniqueTrails, icon: '🗺️' },
    { label: 'Elevation (m)', value: totalElevation.toLocaleString(), icon: '⛰️' },
    { label: 'GPS Verified', value: verified, icon: '✅' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      {stats.map(s => (
        <div key={s.label} className="bg-white rounded-xl border border-stone-100 shadow-sm p-4 text-center">
          <div className="text-2xl mb-1">{s.icon}</div>
          <div className="text-2xl font-bold text-stone-900">{s.value}</div>
          <div className="text-xs text-stone-400 mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

// ── Timeline Entry Card ───────────────────────────────────────
function TimelineCard({ log }) {
  const [expanded, setExpanded] = useState(false)
  const trail = log.trails || {}
  const story = log.story || ''
  const PREVIEW = 180

  return (
    <div className="relative pl-8">
      {/* Timeline dot */}
      <div className="absolute left-0 top-5 w-3 h-3 rounded-full border-2 border-white bg-green-500 shadow ring-2 ring-green-100" />

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 hover:shadow-md transition-shadow">
        <div className="flex flex-wrap items-start gap-2 mb-3">
          {/* Icon + name */}
          <span className="text-lg">{entryIcon(log)}</span>
          <span className="font-bold text-stone-900 text-base">{trail.name || 'Unknown trail'}</span>
          {log.is_verified && (
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium">✅ GPS Verified</span>
          )}
          {log.log_type === 'trail_visit' && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">Trail Visit</span>
          )}
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            {trail.difficulty && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColor(trail.difficulty)}`}>
                {trail.difficulty.charAt(0).toUpperCase() + trail.difficulty.slice(1)}
              </span>
            )}
            {trail.elevation_meters && (
              <span className="text-xs text-stone-400">{trail.elevation_meters}m</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-stone-400 mb-3">
          <span>{formatDate(log.date_climbed)}</span>
          {trail.region && <><span>·</span><span>{trail.region}</span></>}
          {log.rating > 0 && (
            <><span>·</span>
            <span className="text-amber-400">{'★'.repeat(log.rating)}<span className="text-stone-200">{'★'.repeat(5 - log.rating)}</span></span></>
          )}
        </div>

        {/* Conditions */}
        {log.conditions_review && (
          <p className="text-xs text-stone-500 bg-stone-50 rounded-lg px-3 py-2 mb-3 italic">
            "{log.conditions_review}"
          </p>
        )}

        {/* Story */}
        {story && (
          <div className="text-sm text-stone-600 leading-relaxed mb-3">
            {expanded || story.length <= PREVIEW ? story : story.slice(0, PREVIEW) + '…'}
            {story.length > PREVIEW && (
              <button
                onClick={() => setExpanded(e => !e)}
                className="ml-1 text-green-700 font-medium hover:underline text-xs"
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        )}

        {/* Photo links */}
        {(log.google_photos_url || log.drive_folder_url) && (
          <div className="flex gap-3 flex-wrap">
            {log.google_photos_url && (
              <a href={log.google_photos_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-green-700 transition-colors">
                📷 Google Photos →
              </a>
            )}
            {log.drive_folder_url && (
              <a href={log.drive_folder_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-green-700 transition-colors">
                📁 Drive folder →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const supabaseRef = useRef(null)

  const [hiker, setHiker] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabaseRef.current = supabase

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push('/auth/login')
        return
      }

      // Load hiker profile
      const { data: hikerData } = await supabase
        .from('hikers')
        .select('*')
        .eq('id', session.user.id)
        .single()
      setHiker(hikerData)

      // Load all trek logs with trail info
      const { data: logsData } = await supabase
        .from('trek_logs')
        .select('*, trails(name, region, difficulty, elevation_meters, is_fort, latitude, longitude)')
        .eq('hiker_id', session.user.id)
        .order('date_climbed', { ascending: false })

      setLogs(logsData || [])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-stone-400 animate-pulse">Loading your timeline…</div>
      </div>
    )
  }

  // Group logs by year for section headers
  const byYear = {}
  logs.forEach(l => {
    const yr = l.date_climbed?.slice(0, 4) || 'Unknown'
    if (!byYear[yr]) byYear[yr] = []
    byYear[yr].push(l)
  })
  const years = Object.keys(byYear).sort((a, b) => b - a)

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 mb-1">
            {hiker?.full_name ? `${hiker.full_name}'s timeline` : 'My timeline'}
          </h1>
          <p className="text-stone-400 text-sm">
            {hiker?.home_city ? `Based in ${hiker.home_city} · ` : ''}
            @{hiker?.username}
          </p>
        </div>
        <Link
          href="/log"
          className="flex-shrink-0 px-5 py-2.5 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors text-sm shadow-md shadow-green-900/20"
        >
          + Log entry
        </Link>
      </div>

      {logs.length === 0 ? (
        /* Empty state */
        <div className="text-center py-24 border-2 border-dashed border-stone-200 rounded-2xl">
          <div className="text-5xl mb-4">🏔️</div>
          <h2 className="text-xl font-semibold text-stone-700 mb-2">Your timeline is empty</h2>
          <p className="text-stone-400 mb-6 max-w-sm mx-auto">
            Log your first trek or trail visit and it'll appear here with a beautiful activity history.
          </p>
          <Link href="/log" className="px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors">
            Log your first entry →
          </Link>
        </div>
      ) : (
        <>
          {/* Stats */}
          <StatsBar logs={logs} />

          {/* Activity Heatmap */}
          <div className="mb-8">
            <ActivityHeatmap logs={logs} />
          </div>

          {/* Timeline by year */}
          <div className="space-y-10">
            {years.map(year => (
              <div key={year}>
                {/* Year label */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-bold text-stone-400 text-sm uppercase tracking-widest">{year}</span>
                  <div className="flex-1 h-px bg-stone-100" />
                  <span className="text-xs text-stone-300">{byYear[year].length} {byYear[year].length === 1 ? 'entry' : 'entries'}</span>
                </div>

                {/* Vertical timeline */}
                <div className="relative space-y-4 border-l-2 border-stone-100 ml-1.5">
                  {byYear[year].map(log => (
                    <TimelineCard key={log.id} log={log} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
