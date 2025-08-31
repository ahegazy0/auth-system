'use client'

import LoadingSpinner from './LodingSpinner'

interface SubmitButtonProps {
  text: string
  isLoading?: boolean
  className?: string
  type?: 'button' | 'submit' // allow both button and submit
  onClick?: () => void
}

export default function SubmitButton({
  text,
  isLoading,
  className = '',
  type = 'submit',
  onClick,
}: SubmitButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium 
             text-white bg-blue-600 hover:bg-blue-700 focus:outline-none 
             focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 
             disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <LoadingSpinner size="sm" />
          <span>Processing…</span>
        </div>
      ) : (
        text
      )}
    </button>
  )
}
