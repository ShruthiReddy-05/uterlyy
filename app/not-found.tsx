'use client';

import React from 'react';
import Link from 'next/link';
import Header from './components/Header';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 pb-20 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4 text-primary">404 - Page Not Found</h1>
        <p className="text-lg mb-6 text-card-foreground">Sorry, the page you are looking for does not exist.</p>
        <Link 
          href="/" 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors"
        >
          Return Home
        </Link>
      </main>
    </div>
  );
}