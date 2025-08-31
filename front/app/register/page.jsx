'use client'
import { useState } from 'react'
import { register } from '../../lib/api'
import Input from '../../components/Input'
import SubmitButton from '../../components/SubmitButton'
import AuthLayout from '../../components/AuthLayout'
import ErrorMessage from '../../components/ErrorMessage'
import Link from 'next/link'
import { useEffect } from "react";


export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register({ name, email, password, passwordConfirm })
      setSuccess('Registered successfully! Please check your email to verify.')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Create an account" subtitle="Fill in your details to register">
      {error && (
        <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-md mb-4">
          <h2 className="text-lg font-semibold mb-1">Registration failed</h2>
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-900/30 border border-green-700/50 text-green-300 px-4 py-3 rounded-md mb-4">
          <h2 className="text-lg font-semibold mb-1">Registration successful</h2>
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <Input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" />
        <Input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" />
        <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
        <Input type="password" value={passwordConfirm} onChange={e=>setPasswordConfirm(e.target.value)} placeholder="Confirm password" />

        <SubmitButton isLoading={loading} text="Register" />
      </form>

      <div className="text-sm mt-4 text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-400 hover:text-blue-300">Sign in</Link>
      </div>
    </AuthLayout>
  )
}

