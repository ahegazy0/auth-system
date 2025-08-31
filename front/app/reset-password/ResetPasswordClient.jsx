'use client'
import { useState } from 'react'
import Input from '../../components/Input'
import SubmitButton from '../../components/SubmitButton'
import AuthLayout from '../../components/AuthLayout'
import { useSearchParams, useRouter } from 'next/navigation'

export default function ResetPasswordClient() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [msg, setMsg] = useState(null)
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMsg('Passwords do not match')
      setIsError(true)
      return
    }

    setLoading(true)
    try {
      const r = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/reset-password?token=${token}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            password,
            passwordConfirm: confirmPassword,
          }),
        }
      )

      const b = await r.json()
      if (!r.ok) throw new Error(b.message || 'Failed to reset password')

      setMsg(b.message || 'Password has been reset successfully.')
      setIsError(false)

      setTimeout(() => router.push('/login'), 1000)
    } catch (err) {
      let errorMsg = err.message || 'Error resetting password'
      if (errorMsg.includes('fails to match the required pattern')) {
        errorMsg =
          'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      }
      setMsg(errorMsg)
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Enter a new password for your account">
      {msg && (
        <div
          className={`px-4 py-3 rounded-md mb-4 border ${
            isError
              ? 'bg-red-900/30 border-red-700/50 text-red-300'
              : 'bg-green-900/30 border-green-700/50 text-green-300'
          }`}
        >
          <p>{msg}</p>
        </div>
      )}
      <form onSubmit={submit} className="space-y-4">
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
        />
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
        />
        <SubmitButton isLoading={loading} text="Reset password" />
      </form>
    </AuthLayout>
  )
}
