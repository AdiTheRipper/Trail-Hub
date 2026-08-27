'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  // Store client in a ref so it's created once, browser-side only
  const supabaseRef = useRef(null)

  useEffect(() => {
    // createClient() is only called here — inside useEffect = browser only,
    // never runs during Next.js server-side prerendering
    const supabase = createClient()
    supabaseRef.current = supabase

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth state changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    if (supabaseRef.current) {
      await supabaseRef.current.auth.signOut()
    }
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">⛰️</span>
            <span className="font-bold text-stone-900 group-hover:text-forest-700 transition-colors">
              Sahyadri Trail Hub
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/trails"
              className="text-sm font-medium text-stone-600 hover:text-forest-700 transition-colors"
            >
              Trails
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-stone-600 hover:text-forest-700 transition-colors"
              >
                My Dashboard
              </Link>
            )}
            {user && (
              <Link
                href="/log"
                className="text-sm font-medium text-stone-600 hover:text-forest-700 transition-colors"
              >
                Log a Trek
              </Link>
            )}
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-8 bg-stone-100 rounded-lg animate-pulse" />
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-stone-700 hover:text-forest-700 transition-colors"
                >
                  {user.email?.split('@')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium px-4 py-2 rounded-lg border border-stone-200 hover:bg-stone-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-stone-700 hover:text-forest-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm font-medium px-4 py-2 bg-forest-700 text-white rounded-lg hover:bg-forest-800 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
