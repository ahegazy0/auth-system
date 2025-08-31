import api from './axios'


export async function login(email: any, password: any){
const r = await api.post('/auth/login', { email, password })
  return {
    accessToken: r.data?.data?.accessToken,
    user: r.data?.data?.user,
  }  
}


export async function register(payload: any){
const r = await api.post('/auth/register', payload)
return r.data
}


export async function refreshToken(){
const r = await api.post('/auth/refresh-token')
return r.data
}


export async function getMe(accessToken: any){
if (!accessToken) return null
const r = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/auth/me', { headers: { Authorization: `Bearer ${accessToken}` } })
const b = await r.json()
return b.data.user
}


export async function logout(accessToken: any){
const r = await api.post('/auth/logout', {}, { headers: { Authorization: accessToken ? `Bearer ${accessToken}` : '' } })
return r.data
}


export async function verifyEmail(token: string) {
  const r = await api.get(`/auth/verify-email?token=${token}`)
  return r.data
}
