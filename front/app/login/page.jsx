'use client'
import { useState , useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '../../lib/api'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useAuth } from '../../context/AuthProvider'
import Link from 'next/link'

// NEW UI imports (presentation only)
import AuthLayout from '../../components/AuthLayout'
import ErrorMessage from '../../components/ErrorMessage'
import SubmitButton from '../../components/SubmitButton'
import OAuthButtons from '../../components/OAuthButtons'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setAccessToken, setUser } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const res = await login(email, password)
      const token = res.accessToken
      setAccessToken(token)
      const me = await (await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/auth/me', { headers: { Authorization: `Bearer ${token}` } })).json()
      setUser(me.user)
      router.push('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const oauth = (provider) => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/${provider}`
  }
  return (
    <AuthLayout title="Sign in to your account" subtitle="Enter your credentials to continue">
      {error && <ErrorMessage message={error} />}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
          <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email" type="email" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" />
        </div>

        <div className="flex justify-between text-sm">
          <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300">Forgot password?</Link>
          <Link href="/register" className="text-blue-400 hover:text-blue-300">Create an account!</Link>
        </div>

        <SubmitButton isLoading={isLoading} text="Sign in" />
      </form>

      <OAuthButtons onOAuthClick={oauth} />
    </AuthLayout>
  )
}
