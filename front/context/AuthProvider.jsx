'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { getMe, refreshToken as apiRefresh } from '../lib/api'


const AuthContext = createContext(null)


export default function AuthProvider({ children }){
const [user, setUser] = useState(null)
const [accessToken, setAccessToken] = useState(null)
const [loading, setLoading] = useState(true)


useEffect(() => {
  (async () => {
    try {
      const { accessToken } = await apiRefresh()
      if (accessToken) {
        setAccessToken(accessToken)
        const me = await getMe(accessToken)
        setUser(me)
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false)
    }
  })()
}, [])


const logout = async () => {
try {
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`, {
method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Authorization: accessToken ? `Bearer ${accessToken}` : '' }
})
} catch (e) {
// ignore
} finally {
setAccessToken(null); setUser(null)
}
}


return (
<AuthContext.Provider value={{ user, accessToken, setAccessToken, setUser, logout, loading }}>
{children}
</AuthContext.Provider>
)
}


export const useAuth = () => {
const ctx = useContext(AuthContext)
if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
return ctx
}
