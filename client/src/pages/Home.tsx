import { useState } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import CalendarTab from './CalendarTab';
import InsightsTab from './InsightsTab';
import RemindersTab from './RemindersTab';
import ChatbotTab from './ChatbotTab';
import PCOSDetectionTab from './PCOSDetectionTab';
import { TabType } from '../types';
import { format } from 'date-fns';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
  
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };
  
  return (
    <div className="h-screen flex bg-neutral-50">
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="flex-1 overflow-auto pl-16">
        {/* Main content area */}
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">HI,USER</h1>
            <p className="text-lg text-gray-600">How are you feeling today?</p>
            
            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="text-sm text-gray-500">{format(new Date(), 'dd MMMM, yyyy')}</p>
              </div>
              
              <div className="flex space-x-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
                  const isToday = index === 4; // For example, making Thursday active
                  return (
                    <div 
                      key={index} 
                      className={`rounded-full w-8 h-8 flex items-center justify-center text-xs
                      ${isToday 
                        ? 'bg-primary text-white' 
                        : 'bg-pink-100 text-gray-800'}`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Tab Content */}
          <div>
            {activeTab === 'calendar' && <CalendarTab />}
            {activeTab === 'insights' && <InsightsTab />}
            {activeTab === 'reminders' && <RemindersTab />}
            {activeTab === 'chat' && <ChatbotTab />}
            {activeTab === 'pcos' && <PCOSDetectionTab />}
          </div>
        </div>
      </main>
    </div>
  );
}
