import { Home, Users, MessageCircle, BookOpen, Menu } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="fixed left-0 top-0 bottom-0 bg-primary w-16 flex flex-col items-center py-6 space-y-8">
      <button 
        className="p-2 flex flex-col items-center w-12 h-12 rounded-md" 
        onClick={() => onTabChange('calendar')}
      >
        <Home className="h-7 w-7 text-white" />
      </button>
      
      <button 
        className="p-2 flex flex-col items-center w-12 h-12 rounded-md" 
        onClick={() => onTabChange('insights')}
      >
        <Users className="h-7 w-7 text-white" />
      </button>
      
      <button 
        className="p-2 flex flex-col items-center w-12 h-12 rounded-md" 
        onClick={() => onTabChange('reminders')}
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </button>
      
      <button 
        className="p-2 flex flex-col items-center w-12 h-12 rounded-md" 
        onClick={() => onTabChange('chat')}
      >
        <BookOpen className="h-7 w-7 text-white" />
      </button>
      
      <div className="mt-auto">
        <button 
          className="p-2 flex flex-col items-center w-12 h-12 rounded-md" 
          onClick={() => onTabChange('pcos')}
        >
          <Menu className="h-7 w-7 text-white" />
        </button>
      </div>
    </div>
  );
}
