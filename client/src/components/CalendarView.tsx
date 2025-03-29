import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  addDays
} from 'date-fns';
import { Cycle, PeriodLog } from '@shared/schema';
import { 
  isInPeriod, 
  isFertileDay, 
  isOvulationDay,
  isPredictedPeriodDay
} from '@/lib/cycleUtils';

interface CalendarViewProps {
  periodLogs: PeriodLog[];
  cycles: Cycle[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  isLoading: boolean;
}

export default function CalendarView({ 
  periodLogs, 
  cycles, 
  selectedDate,
  onSelectDate,
  isLoading 
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  // Get all days of the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get day of the week of the first day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  // Adjust for Monday as first day of week
  const startDay = getDay(monthStart) === 0 ? 6 : getDay(monthStart) - 1;
  
  // Get previous month days to fill the first row
  const prevMonthDays = startDay > 0 
    ? Array.from({ length: startDay }, (_, i) => 
        addDays(monthStart, -startDay + i)
      )
    : [];
  
  // Get next month days to fill the last row
  const daysAfter = 42 - (prevMonthDays.length + monthDays.length);
  const nextMonthDays = daysAfter > 0 
    ? Array.from({ length: daysAfter }, (_, i) => 
        addDays(monthEnd, i + 1)
      )
    : [];
  
  // Combine all days
  const allDays = [...prevMonthDays, ...monthDays, ...nextMonthDays];

  // Day classification helpers
  const getDayClass = (day: Date) => {
    let classNames = "calendar-day flex items-center justify-center rounded-md ";
    
    if (!isSameMonth(day, currentMonth)) {
      classNames += "text-slate-300 ";
    }
    
    if (isSameDay(day, selectedDate)) {
      classNames += "bg-white border-2 border-accent ";
    } else {
      if (isInPeriod(day, periodLogs)) {
        classNames += "period ";
      } else if (isOvulationDay(day, cycles)) {
        classNames += "ovulation ";
      } else if (isFertileDay(day, cycles)) {
        classNames += "fertile ";
      } else if (isPredictedPeriodDay(day, cycles)) {
        classNames += "prediction ";
      }
    }
    
    return classNames;
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center mb-5">
          <button className="p-2 hover:bg-neutral-100 rounded-full" disabled>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <Skeleton className="h-5 w-32" />
          <button className="p-2 hover:bg-neutral-100 rounded-full" disabled>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-xs text-slate-500 font-medium">
              <span>{day}</span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 42 }).map((_, index) => (
            <Skeleton key={index} className="aspect-ratio-1/1 rounded-md" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center mb-5">
        <button 
          className="p-2 hover:bg-neutral-100 rounded-full"
          onClick={prevMonth}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-base font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button 
          className="p-2 hover:bg-neutral-100 rounded-full"
          onClick={nextMonth}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="text-xs text-slate-500 font-medium">
            <span>{day}</span>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {allDays.map((day) => (
          <div 
            key={day.toString()} 
            className={getDayClass(day)}
            onClick={() => onSelectDate(day)}
          >
            <span className="text-sm">{format(day, 'd')}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-around text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-period mr-1"></div>
          <span>Period</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-fertile mr-1"></div>
          <span>Fertile</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-ovulation mr-1"></div>
          <span>Ovulation</span>
        </div>
      </div>
    </div>
  );
}
