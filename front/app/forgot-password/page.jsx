'use client'
import { useState } from 'react'
import Input from '../../components/Input'
import SubmitButton from '../../components/SubmitButton'
import AuthLayout from '../../components/AuthLayout'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    try {
      const r = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const b = await r.json()
      setMsg(b.message || 'If an account exists, a reset link was sent.')
    } catch {
      setMsg('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your email to reset password">
      {msg && (
        <div className="bg-green-900/30 border border-green-700/50 text-green-300 px-4 py-3 rounded-md mb-4">
          <p>{msg}</p>
        </div>
      )}
      <form onSubmit={submit} className="space-y-4">
        <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" />
        <SubmitButton isLoading={loading} text="Send reset link" />
      </form>
    </AuthLayout>
  )
}
