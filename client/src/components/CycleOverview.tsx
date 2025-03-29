import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface CycleData {
  currentDay: number;
  startDate?: string;
  predictedEndDate?: string;
  averageLength: number;
  periodLength: number;
  nextPeriod: Date;
}

interface CycleOverviewProps {
  cycleData: CycleData;
  isLoading: boolean;
}

export default function CycleOverview({ cycleData, isLoading }: CycleOverviewProps) {
  const cycleProgress = (cycleData.currentDay / cycleData.averageLength) * 100;
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-3 w-full mb-3" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
        
        <div className="flex justify-between mt-5">
          <div className="text-center">
            <Skeleton className="h-3 w-20 mb-2 mx-auto" />
            <Skeleton className="h-5 w-16 mx-auto" />
          </div>
          <div className="text-center">
            <Skeleton className="h-3 w-20 mb-2 mx-auto" />
            <Skeleton className="h-5 w-16 mx-auto" />
          </div>
          <div className="text-center">
            <Skeleton className="h-3 w-20 mb-2 mx-auto" />
            <Skeleton className="h-5 w-16 mx-auto" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Current Cycle</h2>
        <span className="text-sm text-primary font-medium">
          Day {cycleData.currentDay}
        </span>
      </div>
      
      <div className="relative w-full h-3 bg-neutral-100 rounded-full overflow-hidden mb-3">
        <div 
          className="absolute left-0 top-0 h-full bg-primary rounded-full" 
          style={{ width: `${Math.min(cycleProgress, 100)}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-slate-500">
        <span>
          {cycleData.startDate ? format(new Date(cycleData.startDate), 'MMM d') : 'N/A'}
        </span>
        <span>
          {cycleData.predictedEndDate ? format(new Date(cycleData.predictedEndDate), 'MMM d') : 'N/A'}
        </span>
      </div>
      
      <div className="flex justify-between mt-5">
        <div className="text-center">
          <span className="block text-xs text-slate-500 mb-1">Avg. Length</span>
          <span className="font-semibold">{cycleData.averageLength} days</span>
        </div>
        <div className="text-center">
          <span className="block text-xs text-slate-500 mb-1">Period Length</span>
          <span className="font-semibold">{cycleData.periodLength} days</span>
        </div>
        <div className="text-center">
          <span className="block text-xs text-slate-500 mb-1">Next Period</span>
          <span className="font-semibold text-primary">
            {format(cycleData.nextPeriod, 'MMM d')}
          </span>
        </div>
      </div>
    </div>
  );
}
