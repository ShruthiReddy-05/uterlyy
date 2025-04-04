'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { useRouter } from 'next/navigation';
import { TabType } from '../types';

export default function RemindersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('reminders');
  const router = useRouter();

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    router.push(`/${tab === 'calendar' ? '' : tab}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Reminders</h1>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors">
            Add New
          </button>
        </div>
        
        <div className="grid gap-4">
          {/* Sample reminder items - these will be populated from API in actual implementation */}
          <div className="bg-card rounded-lg p-4 shadow-md flex justify-between items-center">
            <div>
              <h3 className="font-medium text-card-foreground">Period Reminder</h3>
              <p className="text-sm text-muted-foreground">2 days before period</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-muted-foreground hover:text-primary transition-colors">Edit</button>
              <div className="w-12 h-6 bg-muted rounded-full flex items-center px-1 cursor-pointer">
                <div className="w-4 h-4 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-md flex justify-between items-center">
            <div>
              <h3 className="font-medium text-card-foreground">Ovulation Day</h3>
              <p className="text-sm text-muted-foreground">On ovulation day</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-muted-foreground hover:text-primary transition-colors">Edit</button>
              <div className="w-12 h-6 bg-muted rounded-full flex items-center px-1 cursor-pointer">
                <div className="w-4 h-4 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-md flex justify-between items-center">
            <div>
              <h3 className="font-medium text-card-foreground">Medication Reminder</h3>
              <p className="text-sm text-muted-foreground">Daily at 9:00 AM</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-muted-foreground hover:text-primary transition-colors">Edit</button>
              <div className="w-12 h-6 bg-muted rounded-full flex items-center justify-end px-1 cursor-pointer">
                <div className="w-4 h-4 bg-muted-foreground rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}