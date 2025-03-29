import { useState } from 'react';
import CycleOverview from '@/components/CycleOverview';
import CalendarView from '@/components/CalendarView';
import TodayLog from '@/components/TodayLog';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { type PeriodLog } from '@shared/schema';
import { addDays } from 'date-fns';
import { toast } from '@/hooks/use-toast';

export default function CalendarTab() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Fetch period logs
  const { data: periodLogs, isLoading: isLoadingLogs } = useQuery<PeriodLog[]>({
    queryKey: ['/api/period-logs'],
  });

  // Fetch cycles data
  const { data: cycles, isLoading: isLoadingCycles } = useQuery({
    queryKey: ['/api/cycles'],
  });

  // Create a new period log
  const createPeriodLog = useMutation({
    mutationFn: (log: Omit<PeriodLog, 'id'>) => {
      return apiRequest('POST', '/api/period-logs', log)
        .then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/period-logs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/cycles'] });
      toast({
        title: 'Log saved',
        description: 'Your period log has been saved successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to save period log: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  // Calculate cycle data for the overview
  const currentCycle = cycles?.[0];
  const averageCycleLength = cycles?.reduce((sum, cycle) => sum + (cycle.cycleLength || 28), 0) 
    / (cycles?.length || 1);
  const averagePeriodLength = cycles?.reduce((sum, cycle) => sum + (cycle.periodLength || 5), 0) 
    / (cycles?.length || 1);

  // Calculate next period start date
  const nextPeriodDate = currentCycle?.startDate 
    ? addDays(new Date(currentCycle.startDate), Math.round(averageCycleLength))
    : addDays(new Date(), 28);

  const cycleData = {
    currentDay: currentCycle 
      ? Math.floor((new Date().getTime() - new Date(currentCycle.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 
      : 0,
    startDate: currentCycle?.startDate,
    predictedEndDate: currentCycle?.endDate,
    averageLength: Math.round(averageCycleLength) || 28,
    periodLength: Math.round(averagePeriodLength) || 5,
    nextPeriod: nextPeriodDate,
  };

  // Handle saving today's log
  const handleSaveLog = (logData: Omit<PeriodLog, 'id' | 'userId'>) => {
    createPeriodLog.mutate({
      ...logData,
      userId: 1, // This would come from the authenticated user in a real app
    });
  };

  return (
    <div>
      <CycleOverview 
        cycleData={cycleData} 
        isLoading={isLoadingCycles} 
      />
      
      <CalendarView 
        periodLogs={periodLogs || []} 
        cycles={cycles || []} 
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        isLoading={isLoadingLogs}
      />
      
      <TodayLog 
        date={selectedDate} 
        existingLog={periodLogs?.find(log => 
          new Date(log.date).toDateString() === selectedDate.toDateString()
        )}
        onSave={handleSaveLog}
        isSubmitting={createPeriodLog.isPending}
      />
    </div>
  );
}
