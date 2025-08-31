'use client';

import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md card p-8 mobile-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-100">{title}</h1>
          {subtitle && <p className="mt-2 text-gray-400">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
