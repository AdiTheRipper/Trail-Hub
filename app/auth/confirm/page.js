'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

/**
 * Supabase redirects users here after clicking the email confirmation link.
 * The URL contains a `code` param that we exchange for a session.
 */
export default function ConfirmPage() {
  const router = useRouter()
  const [status, setStatus] = useState('verifying') // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function confirmEmail() {
      const supabase = createClient()
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')

      if (!code) {
        setStatus('error')
        setMessage('No confirmation code found in the link. Please try signing up again.')
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        setStatus('error')
        setMessage(error.message)
      } else {
        setStatus('success')
        // Redirect to dashboard after a short delay
        setTimeout(() => router.push('/dashboard'), 2000)
      }
    }

    confirmEmail()
  }, [])

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === 'verifying' && (
          <>
            <div className="text-5xl mb-6 animate-spin">⚙️</div>
            <h1 className="text-2xl font-bold text-stone-900 mb-2">Confirming your email…</h1>
            <p className="text-stone-500 text-sm">Just a moment</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-2xl font-bold text-stone-900 mb-2">You're in, hiker! 🏔️</h1>
            <p className="text-stone-500 text-sm">Email confirmed. Redirecting you to your dashboard…</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-2xl font-bold text-stone-900 mb-2">Something went wrong</h1>
            <p className="text-stone-500 text-sm mb-6">{message}</p>
            <a
              href="/auth/signup"
              className="inline-block px-6 py-3 bg-forest-700 text-white rounded-lg text-sm font-medium hover:bg-forest-800 transition-colors"
            >
              Try signing up again
            </a>
          </>
        )}
      </div>
    </div>
  )
}
