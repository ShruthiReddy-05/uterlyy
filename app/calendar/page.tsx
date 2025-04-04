'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { useRouter } from 'next/navigation';
import { TabType } from '../types';

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
  const router = useRouter();

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    router.push(`/${tab === 'calendar' ? '' : tab}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 pb-20">
        <h1 className="text-2xl font-bold mb-6 text-primary">Calendar</h1>
        <div className="bg-card rounded-lg p-4 shadow-md">
          <p className="text-card-foreground">Your period tracking calendar will be displayed here...</p>
        </div>
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}