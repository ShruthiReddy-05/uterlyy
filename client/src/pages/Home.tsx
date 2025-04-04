import { useState } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import CalendarTab from './CalendarTab';
import InsightsTab from './InsightsTab';
import RemindersTab from './RemindersTab';
import ChatbotTab from './ChatbotTab';

type TabType = 'calendar' | 'insights' | 'reminders' | 'chat';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
  
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };
  
  return (
    <div className="h-screen flex flex-col bg-neutral-100">
      <Header />
      
      <main className="flex-1 overflow-auto">
        {/* Tab Navigation */}
        <div className="bg-white mb-4 shadow-sm">
          <div className="flex">
            <button 
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'calendar' ? 'text-primary border-b-2 border-primary' : 'text-dark'}`} 
              onClick={() => handleTabChange('calendar')}
            >
              Calendar
            </button>
            <button 
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'insights' ? 'text-primary border-b-2 border-primary' : 'text-dark'}`}
              onClick={() => handleTabChange('insights')}
            >
              Insights
            </button>
            <button 
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'reminders' ? 'text-primary border-b-2 border-primary' : 'text-dark'}`}
              onClick={() => handleTabChange('reminders')}
            >
              Reminders
            </button>
            <button 
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'chat' ? 'text-primary border-b-2 border-primary' : 'text-dark'}`}
              onClick={() => handleTabChange('chat')}
            >
              Chat
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="px-4 pb-20">
          {activeTab === 'calendar' && <CalendarTab />}
          {activeTab === 'insights' && <InsightsTab />}
          {activeTab === 'reminders' && <RemindersTab />}
          {activeTab === 'chat' && <ChatbotTab />}
        </div>
      </main>
      
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
