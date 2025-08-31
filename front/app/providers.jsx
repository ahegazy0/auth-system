'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import AuthProvider from '../context/AuthProvider'


export default function Providers({ children }){
const [qc] = useState(() => new QueryClient())
return (
<QueryClientProvider client={qc}>
<AuthProvider>{children}</AuthProvider>
</QueryClientProvider>
)
}