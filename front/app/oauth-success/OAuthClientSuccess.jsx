'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../context/AuthProvider'
import LoadingSpinner from '@/components/LodingSpinner'

export default function OAuthClientSuccess() {
  const search = useSearchParams()
  const token = search.get('accessToken')
  const router = useRouter()
  const { setAccessToken, setUser } = useAuth()

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    (async () => {
      setAccessToken(token)
      try {
        await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/auth/refresh-token', {
          method: 'POST',
          credentials: 'include',
        })
        const me = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json())
        setUser(me.data.user)
      } catch (e) {
        // ignore errors
      } finally {
        router.push('/dashboard')
      }
    })()
  }, [token, router, setAccessToken, setUser])

  return (
    <div className="p-8">
      <LoadingSpinner size="md" />
    </div>
  )
}

