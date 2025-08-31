'use client'
import Link from 'next/link'

export default function Home(){
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="card p-8 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-white">Auth Demo !</h1>

        <p className="mt-2 text-white">Welcome to our Website.. let's get started !</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/login" className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium 
             text-white bg-blue-600 hover:bg--700 focus:outline-none 
             focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 
             disabled:cursor-not-allowed transition-colors">Sign in</Link>
          <Link href="/register" className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium 
             text-white bg-blue-600 hover:bg--700 focus:outline-none 
             focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 
             disabled:cursor-not-allowed transition-colors">Get Started !</Link>
        </div>
      </div>
    </main>
  )
}
