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


export async function getMe(accessToken: string) {
  if (!accessToken) return null
  const r = await api.get('/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  return r.data.data.user
}



export async function logout(accessToken: any){
const r = await api.post('/auth/logout', {}, { headers: { Authorization: accessToken ? `Bearer ${accessToken}` : '' } })
return r.data
}


export async function verifyEmail(token: string) {
  const r = await api.get(`/auth/verify-email?token=${token}`)
  return r.data
}
