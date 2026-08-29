'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const REGIONS = ['All', 'Pune', 'Nashik', 'Mumbai', 'Thane', 'Raigad', 'Ratnagiri', 'Satara', 'Kolhapur', 'Ahmednagar', 'Other']
const DIFFICULTIES = ['all', 'easy', 'moderate', 'hard', 'expert']

function difficultyColor(d) {
  return {
    easy: 'bg-green-100 text-green-800',
    moderate: 'bg-amber-100 text-amber-800',
    hard: 'bg-red-100 text-red-800',
    expert: 'bg-purple-100 text-purple-800',
  }[d] || 'bg-stone-100 text-stone-600'
}

export default function TrailsPage() {
  const [trails, setTrails] = useState([])
  const [loading, setLoading] = useState(true)
  const [region, setRegion] = useState('All')
  const [difficulty, setDifficulty] = useState('all')
  const [fortsOnly, setFortsOnly] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('trails')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setTrails(data || [])
        setLoading(false)
      })
  }, [])

  const filtered = trails.filter(t => {
    if (region !== 'All' && t.region !== region) return false
    if (difficulty !== 'all' && t.difficulty !== difficulty) return false
    if (fortsOnly && !t.is_fort) return false
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Sahyadri Trails</h1>
        <p className="text-stone-500">
          {trails.length > 0 ? `${trails.length} trails and forts in the database` : 'Explore the trails of the Western Ghats'}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search */}
          <div className="flex-1 min-w-48">
            <input
              type="text"
              placeholder="Search trails…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Region */}
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            className="px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            {REGIONS.map(r => <option key={r}>{r}</option>)}
          </select>

          {/* Difficulty */}
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            className="px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            {DIFFICULTIES.map(d => (
              <option key={d} value={d}>{d === 'all' ? 'All difficulties' : d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </select>

          {/* Forts only */}
          <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={fortsOnly}
              onChange={e => setFortsOnly(e.target.checked)}
              className="rounded border-stone-300 text-green-600 focus:ring-green-500"
            />
            Forts only 🏯
          </label>
        </div>
      </div>

      {/* Trail grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-stone-100 h-36 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-stone-500">No trails match your filters.</p>
          {trails.length === 0 && (
            <p className="text-stone-400 text-sm mt-2">
              The database is empty — run <code className="bg-stone-100 px-1 rounded">seed.sql</code> in Supabase SQL Editor to add sample trails.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start gap-2 mb-3">
                <span className="text-xl">{t.is_fort ? '🏯' : '🥾'}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-stone-900 text-sm leading-tight">{t.name}</h3>
                  <p className="text-stone-400 text-xs mt-0.5">{t.region}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColor(t.difficulty)}`}>
                  {t.difficulty.charAt(0).toUpperCase() + t.difficulty.slice(1)}
                </span>
                {t.elevation_meters && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-stone-100 text-stone-600">
                    {t.elevation_meters}m
                  </span>
                )}
                {t.length_km && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-stone-100 text-stone-600">
                    {t.length_km}km
                  </span>
                )}
                {t.is_community_submitted && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-600">Community</span>
                )}
              </div>

              {t.description && (
                <p className="text-stone-500 text-xs leading-relaxed mb-3 flex-1">{t.description}</p>
              )}

              <Link
                href={`/log?trail=${t.id}`}
                className="mt-auto block text-center text-xs font-medium px-4 py-2 bg-stone-50 hover:bg-green-50 hover:text-green-700 text-stone-600 rounded-lg border border-stone-100 hover:border-green-200 transition-colors"
              >
                Log a trek here →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
