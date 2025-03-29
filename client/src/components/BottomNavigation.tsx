import { Calendar, LineChart, Bell, User } from 'lucide-react';

type TabType = 'calendar' | 'insights' | 'reminders';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] px-5 py-2">
      <div className="flex justify-around">
        <button 
          className="p-2 flex flex-col items-center" 
          onClick={() => onTabChange('calendar')}
        >
          <Calendar className={`h-5 w-5 ${activeTab === 'calendar' ? 'text-primary' : 'text-slate-500'}`} />
          <span className={`text-xs font-medium ${activeTab === 'calendar' ? 'text-primary' : 'text-slate-500'}`}>
            Calendar
          </span>
        </button>
        
        <button 
          className="p-2 flex flex-col items-center" 
          onClick={() => onTabChange('insights')}
        >
          <LineChart className={`h-5 w-5 ${activeTab === 'insights' ? 'text-primary' : 'text-slate-500'}`} />
          <span className={`text-xs font-medium ${activeTab === 'insights' ? 'text-primary' : 'text-slate-500'}`}>
            Insights
          </span>
        </button>
        
        <button 
          className="p-2 flex flex-col items-center" 
          onClick={() => onTabChange('reminders')}
        >
          <Bell className={`h-5 w-5 ${activeTab === 'reminders' ? 'text-primary' : 'text-slate-500'}`} />
          <span className={`text-xs font-medium ${activeTab === 'reminders' ? 'text-primary' : 'text-slate-500'}`}>
            Reminders
          </span>
        </button>
        
        <button className="p-2 flex flex-col items-center">
          <User className="h-5 w-5 text-slate-500" />
          <span className="text-xs font-medium text-slate-500">Profile</span>
        </button>
      </div>
    </nav>
  );
}
