'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import AuthLayout from '@/components/AuthLayout'
import LoadingSpinner from '@/components/LodingSpinner'
import ErrorMessage from '@/components/ErrorMessage'
import Link from 'next/link'
import { verifyEmail } from '@/lib/api'

export default function VerifyEmailClient() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const runVerification = async () => {
      if (!token) {
        setStatus('error')
        setError('Invalid or missing verification token')
        return
      }

      try {
        await verifyEmail(token)
        setStatus('success')
      } catch (err) {
        setStatus('error')
        setError(err.response?.data?.message || 'Email verification failed')
      }
    }

    runVerification()
  }, [token])

  if (status === 'loading') {
    return (
      <AuthLayout title="Verifying your email" subtitle={undefined}>
        <div className="text-center py-8">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-400">
            Please wait while we verify your email address...
          </p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title={status === 'success' ? 'Email Verified' : 'Verification Failed'}
      subtitle={undefined}
    >
      {status === 'success' ? (
        <div className="bg-green-900/30 border border-green-700/50 text-green-300 px-4 py-3 rounded-md mb-6">
          <h2 className="text-xl font-semibold mb-2">Email verified successfully!</h2>
          <p>Your email has been verified. You can now log in to your account.</p>
        </div>
      ) : (
        <div>
          <ErrorMessage message={error} />
          <p className="text-gray-400 text-sm mb-4">
            Please try again or request a new verification link.
          </p>
        </div>
      )}

      <Link
        href="/login"
        className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium 
             text-white bg-blue-600 block py-2 rounded-md"
      >
        Go to login
      </Link>
    </AuthLayout>
  )
}
