'use client'
import { useState } from 'react'
import { useAuth } from '../../context/AuthProvider'


export default function Profile(){
const { user } = useAuth()
const [name, setName] = useState(user?.name || '')
const [msg, setMsg] = useState(null)


if (!user) return <div className="p-8">Not logged in</div>


const submit = async e => {
e.preventDefault()
try {
const r = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/users/me', { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
const b = await r.json()
if (r.ok) setMsg('Profile updated')
else setMsg(b.message || 'Error')
} catch (e) { setMsg('Error') }
}


return (
<main className="p-8 max-w-md mx-auto">
<h2>Profile</h2>
<form onSubmit={submit} className="mt-4 space-y-3">
<input value={name} onChange={e=>setName(e.target.value)} className="w-full p-2 border rounded" />
<button className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
</form>
{msg && <div className="mt-3">{msg}</div>}
</main>
)
}