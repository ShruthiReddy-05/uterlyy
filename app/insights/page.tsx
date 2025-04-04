'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { useRouter } from 'next/navigation';
import { TabType } from '../types';

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('insights');
  const router = useRouter();

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    router.push(`/${tab === 'calendar' ? '' : tab}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 pb-20">
        <h1 className="text-2xl font-bold mb-6 text-primary">Insights</h1>
        <div className="grid gap-6">
          <div className="bg-card rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-3 text-card-foreground">Cycle Analysis</h2>
            <p className="text-card-foreground">Your cycle analysis and statistics will be displayed here...</p>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-3 text-card-foreground">Symptoms Trends</h2>
            <p className="text-card-foreground">Your symptom trends and patterns will be shown here...</p>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-3 text-card-foreground">Mood Patterns</h2>
            <p className="text-card-foreground">Your mood patterns throughout your cycle will be analyzed here...</p>
          </div>
        </div>
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}