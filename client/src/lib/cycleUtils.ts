import { PeriodLog, Cycle } from '@shared/schema';
import { addDays, parseISO, isSameDay, isWithinInterval } from 'date-fns';

/**
 * Check if a date is during a period (based on logged period data)
 */
export function isInPeriod(date: Date, periodLogs: PeriodLog[]): boolean {
  return periodLogs.some(log => 
    log.flow && 
    log.flow !== 'none' && 
    isSameDay(date, new Date(log.date))
  );
}

/**
 * Check if a date is a predicted period day
 */
export function isPredictedPeriodDay(date: Date, cycles: Cycle[]): boolean {
  if (!cycles || cycles.length === 0) return false;
  
  // Get average cycle length from previous cycles
  const avgCycleLength = cycles.reduce((sum, cycle) => 
    sum + (cycle.cycleLength || 28), 0) / cycles.length;
  
  // Get the last recorded cycle
  const lastCycle = cycles[0];
  if (!lastCycle || !lastCycle.startDate) return false;
  
  // Calculate next period start date
  const lastStartDate = new Date(lastCycle.startDate);
  const nextPeriodStart = addDays(lastStartDate, Math.round(avgCycleLength));
  
  // Get average period length
  const avgPeriodLength = cycles.reduce((sum, cycle) => 
    sum + (cycle.periodLength || 5), 0) / cycles.length;
  
  // Check if the date is within the predicted period
  const nextPeriodEnd = addDays(nextPeriodStart, Math.round(avgPeriodLength) - 1);
  
  return isWithinInterval(date, { 
    start: nextPeriodStart, 
    end: nextPeriodEnd 
  });
}

/**
 * Check if a date is a fertile day
 * Fertile window is typically ~5 days before ovulation and ovulation day
 */
export function isFertileDay(date: Date, cycles: Cycle[]): boolean {
  if (!cycles || cycles.length === 0) return false;
  
  // Get average cycle length
  const avgCycleLength = cycles.reduce((sum, cycle) => 
    sum + (cycle.cycleLength || 28), 0) / cycles.length;
  
  // Get the last cycle start date
  const lastCycle = cycles[0];
  if (!lastCycle || !lastCycle.startDate) return false;
  
  const lastStartDate = new Date(lastCycle.startDate);
  
  // Ovulation typically occurs ~14 days before the next period
  const ovulationDay = addDays(lastStartDate, Math.round(avgCycleLength) - 14);
  
  // Fertile window starts ~5 days before ovulation
  const fertileStart = addDays(ovulationDay, -5);
  const fertileEnd = addDays(ovulationDay, 0);
  
  return isWithinInterval(date, {
    start: fertileStart,
    end: fertileEnd
  }) && !isSameDay(date, ovulationDay); // Exclude ovulation day (handled separately)
}

/**
 * Check if a date is the ovulation day
 */
export function isOvulationDay(date: Date, cycles: Cycle[]): boolean {
  if (!cycles || cycles.length === 0) return false;
  
  // Get average cycle length
  const avgCycleLength = cycles.reduce((sum, cycle) => 
    sum + (cycle.cycleLength || 28), 0) / cycles.length;
  
  // Get the last cycle start date
  const lastCycle = cycles[0];
  if (!lastCycle || !lastCycle.startDate) return false;
  
  const lastStartDate = new Date(lastCycle.startDate);
  
  // Ovulation typically occurs ~14 days before the next period
  const ovulationDay = addDays(lastStartDate, Math.round(avgCycleLength) - 14);
  
  return isSameDay(date, ovulationDay);
}

/**
 * Calculate the next period start date based on cycles
 */
export function calculateNextPeriodDate(cycles: Cycle[]): Date | null {
  if (!cycles || cycles.length === 0) return null;
  
  // Get average cycle length
  const avgCycleLength = cycles.reduce((sum, cycle) => 
    sum + (cycle.cycleLength || 28), 0) / cycles.length;
  
  // Get the last cycle start date
  const lastCycle = cycles[0];
  if (!lastCycle || !lastCycle.startDate) return null;
  
  const lastStartDate = new Date(lastCycle.startDate);
  
  // Calculate next period start date
  return addDays(lastStartDate, Math.round(avgCycleLength));
}

/**
 * Get current cycle day number
 */
export function getCurrentCycleDay(cycles: Cycle[]): number {
  if (!cycles || cycles.length === 0) return 0;
  
  const lastCycle = cycles[0];
  if (!lastCycle || !lastCycle.startDate) return 0;
  
  const lastStartDate = new Date(lastCycle.startDate);
  const today = new Date();
  
  const diffInMs = today.getTime() - lastStartDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  return diffInDays + 1; // +1 because day 1 is the start day
}
