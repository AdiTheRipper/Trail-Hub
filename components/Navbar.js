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
    router.push('/')
    router.refresh()
  }

  function navLink(href, label) {
    const active = pathname === href
    return (
      <Link
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
      {/* Thin accent stripe at very top */}
      <div className="h-0.5 bg-gradient-to-r from-green-600 via-emerald-400 to-green-700" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 py-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">⛰️</span>
            <div>
              <span className="font-bold text-stone-900 group-hover:text-green-800 transition-colors text-base leading-tight block">
                Sahyadri Trail Hub
              </span>
              <span className="text-xs text-stone-400 leading-none hidden sm:block">Maharashtra's hiking journal</span>
            </div>
          </Link>

          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navLink('/trails', 'Explore')}
            {user && navLink('/dashboard', 'My Timeline')}
            {user && navLink('/log', 'Log Entry')}
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="w-20 h-8 bg-stone-100 rounded-lg animate-pulse" />
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-green-800 transition-colors"
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
        </div>
      </div>
    </nav>
  )
}
