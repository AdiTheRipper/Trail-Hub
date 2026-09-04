'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabaseRef = useRef(null)

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    const supabase = createClient()
    supabaseRef.current = supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    if (supabaseRef.current) await supabaseRef.current.auth.signOut()
    setMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  function navLink(href, label, mobile = false) {
    const active = pathname === href
    if (mobile) {
      return (
        <Link
          key={href}
          href={href}
          onClick={() => setMenuOpen(false)}
          className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            active
              ? 'bg-green-50 text-green-800 font-semibold'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          {label}
        </Link>
      )
    }
    return (
      <Link
        key={href}
        href={href}
        className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
          active
            ? 'bg-green-50 text-green-800 font-semibold'
            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
      {/* Accent stripe */}
      <div className="h-0.5 bg-gradient-to-r from-green-600 via-emerald-400 to-green-700" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <span className="text-2xl">⛰️</span>
            <div>
              <span className="font-bold text-stone-900 group-hover:text-green-800 transition-colors text-base leading-tight block">
                Sahyadri Trail Hub
              </span>
              <span className="text-xs text-stone-400 leading-none hidden sm:block">Maharashtra's hiking journal</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLink('/trails', 'Explore')}
            {user && navLink('/dashboard', 'My Timeline')}
            {user && navLink('/log', 'Log Entry')}
          </div>

          {/* Desktop auth + Hamburger */}
          <div className="flex items-center gap-2">
            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-2">
              {loading ? (
                <div className="w-20 h-8 bg-stone-100 rounded-lg animate-pulse" />
              ) : user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-green-800 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs font-bold">
                      {(user.user_metadata?.username || user.email)?.[0]?.toUpperCase()}
                    </div>
                    <span>{user.user_metadata?.username || user.email?.split('@')[0]}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 transition-colors text-stone-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors px-3 py-1.5"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="text-sm font-medium px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors shadow-sm shadow-green-900/20"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-5 h-5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ───────────────────────────────────── */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-stone-100 pt-3">
            {navLink('/trails', '🗺️  Explore', true)}
            {user && navLink('/dashboard', '📅  My Timeline', true)}
            {user && navLink('/log', '🥾  Log Entry', true)}

            <div className="border-t border-stone-100 mt-2 pt-2">
              {loading ? (
                <div className="h-8 bg-stone-100 rounded-lg animate-pulse mx-4" />
              ) : user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-sm font-bold">
                      {(user.user_metadata?.username || user.email)?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-stone-800">{user.user_metadata?.username || user.email?.split('@')[0]}</div>
                      <div className="text-xs text-stone-400">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 px-1">
                  <Link
                    href="/auth/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm font-medium border border-stone-200 rounded-xl text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm font-medium bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
