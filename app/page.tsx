'use client';

import React, { useState } from 'react';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import { useRouter } from 'next/navigation';
import { TabType } from './types';

export default function HomePage() {
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
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">Current Cycle</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-secondary/50 p-3 rounded-md">
                <span className="text-sm text-muted-foreground">Cycle Day</span>
                <p className="text-3xl font-bold text-primary">14</p>
              </div>
              <div className="bg-secondary/50 p-3 rounded-md">
                <span className="text-sm text-muted-foreground">Next Period</span>
                <p className="text-lg font-semibold text-card-foreground">In 14 days</p>
              </div>
              <div className="bg-secondary/50 p-3 rounded-md">
                <span className="text-sm text-muted-foreground">Cycle Length</span>
                <p className="text-lg font-semibold text-card-foreground">28 days</p>
              </div>
              <div className="bg-secondary/50 p-3 rounded-md">
                <span className="text-sm text-muted-foreground">Period Length</span>
                <p className="text-lg font-semibold text-card-foreground">5 days</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">Month View</h2>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              <div className="text-sm font-medium text-muted-foreground">S</div>
              <div className="text-sm font-medium text-muted-foreground">M</div>
              <div className="text-sm font-medium text-muted-foreground">T</div>
              <div className="text-sm font-medium text-muted-foreground">W</div>
              <div className="text-sm font-medium text-muted-foreground">T</div>
              <div className="text-sm font-medium text-muted-foreground">F</div>
              <div className="text-sm font-medium text-muted-foreground">S</div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {/* Calendar cells would be dynamically generated */}
              {Array.from({ length: 35 }).map((_, index) => {
                // Example styling for different day types
                let dayClass = "h-10 flex items-center justify-center rounded-full";
                
                if (index === 14) {
                  // Current day
                  dayClass += " bg-primary text-primary-foreground";
                } else if ([3, 4, 5, 6, 7].includes(index)) {
                  // Period days
                  dayClass += " bg-primary/20 text-primary";
                } else if ([18, 19, 20].includes(index)) {
                  // Fertile days
                  dayClass += " bg-blue-100 text-blue-800";
                } else if (index === 17) {
                  // Ovulation day
                  dayClass += " bg-blue-200 text-blue-900";
                } else {
                  // Regular days
                  dayClass += " hover:bg-secondary/50 text-card-foreground";
                }
                
                return (
                  <div key={index} className={dayClass}>
                    {(index % 31) + 1}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-3 text-card-foreground">Log Today</h2>
            <button className="w-full py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors">
              Add Period Log
            </button>
          </div>
        </div>
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}