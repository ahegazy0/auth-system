'use client';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  return (
    <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-md mb-4">
      <h2 className="text-lg font-semibold mb-1">Error</h2>
      <p>{message}</p>
    </div>
  );
}
