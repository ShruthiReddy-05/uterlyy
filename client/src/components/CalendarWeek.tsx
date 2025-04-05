import React, { useState } from 'react';
import { useTheme } from './ThemeProviderCustom';
import { format, addDays, subDays, isToday, isSameDay } from 'date-fns';

interface CalendarWeekProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export function CalendarWeek({ selectedDate = new Date(), onDateSelect }: CalendarWeekProps) {
  const { colors } = useTheme();
  const [selectedDay, setSelectedDay] = useState(selectedDate);
  const [displayWeekStart, setDisplayWeekStart] = useState(
    subDays(selectedDate, selectedDate.getDay())
  );

  const days = Array.from({ length: 7 }, (_, i) => addDays(displayWeekStart, i));

  const handleDateClick = (date: Date) => {
    setSelectedDay(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const isSelected = (date: Date) => {
    return isSameDay(date, selectedDay);
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="flex justify-between items-center bg-white p-3 mb-4">
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setDisplayWeekStart(subDays(displayWeekStart, 7))}
        >
          &lt;
        </button>
        <div className="text-sm font-medium">
          {format(displayWeekStart, 'MMMM yyyy')}
        </div>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setDisplayWeekStart(addDays(displayWeekStart, 7))}
        >
          &gt;
        </button>
      </div>
      <div className="flex justify-between">
        {days.map((day, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center p-2 cursor-pointer rounded-lg w-10 transition-all
              ${isSelected(day) ? 'bg-[var(--color-darker)] text-white' : 'hover:bg-gray-100'}
              ${isToday(day) && !isSelected(day) ? 'border-[var(--color-darker)] border' : ''}
            `}
            onClick={() => handleDateClick(day)}
          >
            <div className="text-xs">{format(day, 'EEE')}</div>
            <div className="text-lg font-semibold">{format(day, 'd')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}