"use client"

import { useState, useEffect } from "react"
import { format, addDays, startOfWeek } from "date-fns"

interface CalendarWeekProps {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
}

export function CalendarWeek({ selectedDate = new Date(), onDateSelect }: CalendarWeekProps) {
  const [weekDays, setWeekDays] = useState<Date[]>([])
  const [selected, setSelected] = useState<Date>(selectedDate)

  // Generate week days only once on initial render or when selectedDate prop changes
  useEffect(() => {
    // Generate week days starting from Sunday
    const startDate = startOfWeek(selectedDate)
    const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))
    setWeekDays(days)
    // Also update the selected date when the prop changes
    setSelected(selectedDate)
  }, [selectedDate]) // Only depend on the selectedDate prop

  const handleDateClick = (date: Date) => {
    setSelected(date)
    if (onDateSelect) {
      onDateSelect(date)
    }
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    )
  }

  return (
    <div className="flex space-x-1">
      {weekDays.map((day, index) => (
        <button
          key={index}
          onClick={() => handleDateClick(day)}
          className={`flex flex-col items-center justify-center w-8 h-16 rounded-full text-xs transition-all ${
            isSelected(day)
              ? "bg-[var(--color-darker)] text-white"
              : isToday(day)
                ? "bg-[var(--color-lighter)] text-[var(--color-text)]"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          <span className="uppercase">{format(day, "E").charAt(0)}</span>
          <span className="font-medium">{format(day, "dd")}</span>
        </button>
      ))}
    </div>
  )
}

