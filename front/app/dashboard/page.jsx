'use client'
import { useEffect } from 'react'
import { useAuth } from '../../context/AuthProvider'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LodingSpinner'
import SubmitButton from '@/components/SubmitButton'

export default function Dashboard() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user === null) router.push('/login')
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (user === null) return null

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Welcome, {user.name}
        </h2>
        <div className="text-gray-300 mb-2">
          <span className="font-medium">Email:</span> {user.email}
        </div>
        <div className="text-gray-300 mb-6">
          <span className="font-medium">Role:</span> {user.role}
        </div>

        <SubmitButton
          text="Logout"
          type="button"
          isLoading={false}
          className="bg-blue-600"
          onClick={handleLogout}
        />
      </div>
    </main>
  )
}
