'use client';

import React from 'react';
import { CalendarDays, LineChart, Bell, MessageCircle } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="container mx-auto">
        <div className="flex justify-around">
          <button
            onClick={() => onTabChange('calendar')}
            className={`flex flex-col items-center py-3 px-5 transition-colors ${
              activeTab === 'calendar' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <CalendarDays className="h-6 w-6 mb-1" />
            <span className="text-xs">Calendar</span>
          </button>
          
          <button
            onClick={() => onTabChange('insights')}
            className={`flex flex-col items-center py-3 px-5 transition-colors ${
              activeTab === 'insights' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <LineChart className="h-6 w-6 mb-1" />
            <span className="text-xs">Insights</span>
          </button>
          
          <button
            onClick={() => onTabChange('reminders')}
            className={`flex flex-col items-center py-3 px-5 transition-colors ${
              activeTab === 'reminders' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Bell className="h-6 w-6 mb-1" />
            <span className="text-xs">Reminders</span>
          </button>
          
          <button
            onClick={() => onTabChange('chat')}
            className={`flex flex-col items-center py-3 px-5 transition-colors ${
              activeTab === 'chat' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <MessageCircle className="h-6 w-6 mb-1" />
            <span className="text-xs">Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}