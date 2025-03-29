import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  addDays,
  subDays,
  format,
  isSameDay,
  differenceInDays,
  addMonths,
  subMonths,
  isWithinInterval,
  parseISO
} from 'date-fns';

/**
 * Get all days in a month, including days from previous and next month to complete week rows
 */
export function getCalendarDays(date: Date) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get day of the week of the first day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  // Adjust for Monday as first day of week
  const startDay = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1;
  
  // Get previous month days to fill the first row
  const prevMonthDays = startDay > 0 
    ? Array.from({ length: startDay }, (_, i) => 
        addDays(monthStart, -startDay + i)
      )
    : [];
  
  // Get next month days to fill the last row (total 42 days - 6 weeks)
  const daysAfter = 42 - (prevMonthDays.length + monthDays.length);
  const nextMonthDays = daysAfter > 0 
    ? Array.from({ length: daysAfter }, (_, i) => 
        addDays(monthEnd, i + 1)
      )
    : [];
  
  return [...prevMonthDays, ...monthDays, ...nextMonthDays];
}

/**
 * Format a date as ISO string (YYYY-MM-DD)
 */
export function formatISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Parse an ISO string to Date
 */
export function parseDate(dateString: string): Date {
  return parseISO(dateString);
}

/**
 * Format a date for display
 */
export function formatDisplayDate(date: Date, formatStr: string = 'MMM d, yyyy'): string {
  return format(date, formatStr);
}

/**
 * Check if two dates are the same day
 */
export function isSameDate(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isSameDay(d1, d2);
}

/**
 * Get the difference in days between two dates
 */
export function getDaysBetween(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return differenceInDays(end, start);
}

/**
 * Check if a date is within a range
 */
export function isDateInRange(date: Date, startDate: Date | string, endDate: Date | string): boolean {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return isWithinInterval(date, { start, end });
}
