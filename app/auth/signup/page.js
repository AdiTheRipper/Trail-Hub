'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
    full_name: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          username: form.username.trim().toLowerCase(),
          full_name: form.full_name.trim(),
        },
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  // Confirmation sent screen
  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">📬</div>
          <h1 className="text-2xl font-bold text-stone-900 mb-3">Check your email</h1>
          <p className="text-stone-500 mb-6">
            We sent a confirmation link to <strong>{form.email}</strong>.
            Click it to activate your account and start logging treks!
          </p>
          <Link href="/auth/login" className="text-forest-700 hover:underline text-sm font-medium">
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-4xl">⛰️</span>
          <h1 className="text-2xl font-bold text-stone-900 mt-3 mb-1">Create your hiker profile</h1>
          <p className="text-stone-500 text-sm">Free forever. No credit card.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Aditya Sharma"
                required
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">@</span>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="sahyadri_hiker"
                  required
                  pattern="[a-zA-Z0-9_]+"
                  title="Only letters, numbers and underscores"
                  className="w-full pl-8 pr-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition"
                />
              </div>
              <p className="text-xs text-stone-400 mt-1">Letters, numbers, underscores only</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                required
                minLength={8}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-forest-700 hover:bg-forest-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-stone-500 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-forest-700 hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
