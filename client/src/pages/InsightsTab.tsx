import { useQuery } from '@tanstack/react-query';
import { PeriodLog, Cycle } from '@shared/schema';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, HeartPulse, Frown, Zap } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format, differenceInDays } from 'date-fns';

export default function InsightsTab() {
  // Fetch period logs
  const { data: periodLogs, isLoading: isLoadingLogs } = useQuery<PeriodLog[]>({
    queryKey: ['/api/period-logs'],
  });
  
  // Fetch cycles data
  const { data: cycles, isLoading: isLoadingCycles } = useQuery<Cycle[]>({
    queryKey: ['/api/cycles'],
  });
  
  // Prepare chart data from cycles
  const chartData = cycles?.slice(0, 6).map(cycle => ({
    month: cycle.startDate ? format(new Date(cycle.startDate), 'MMM') : '',
    days: cycle.cycleLength || differenceInDays(
      cycle.endDate ? new Date(cycle.endDate) : new Date(),
      cycle.startDate ? new Date(cycle.startDate) : new Date()
    )
  })).reverse();
  
  // Calculate cycle statistics
  const averageCycleLength = cycles?.reduce((sum, cycle) => sum + (cycle.cycleLength || 28), 0) 
    / (cycles?.length || 1);
  
  const averagePeriodLength = cycles?.reduce((sum, cycle) => sum + (cycle.periodLength || 5), 0) 
    / (cycles?.length || 1);
  
  // Calculate cycle regularity (standard deviation)
  const cycleLengths = cycles?.map(c => c.cycleLength || 28) || [];
  const cycleVariation = cycles && cycles.length > 1
    ? Math.sqrt(
        cycleLengths.reduce((sum, length) => sum + Math.pow(length - averageCycleLength, 2), 0) 
        / cycleLengths.length
      )
    : 0;
  
  const cycleRegularity = cycleVariation <= 2 
    ? 'High' 
    : cycleVariation <= 5 
      ? 'Moderate' 
      : 'Low';
  
  // Calculate common symptoms
  const symptomCounts: Record<string, number> = {};
  periodLogs?.forEach(log => {
    if (log.symptoms) {
      log.symptoms.forEach(symptom => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      });
    }
  });
  
  const commonSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([symptom, count]) => ({
      symptom,
      percentage: Math.round((count / (periodLogs?.length || 1)) * 100)
    }));
  
  const getSymptomIcon = (symptom: string) => {
    switch(symptom.toLowerCase()) {
      case 'headache': return <Brain className="mr-2" />;
      case 'cramps': return <HeartPulse className="mr-2" />;
      case 'mood swings': return <Frown className="mr-2" />;
      case 'fatigue': return <Zap className="mr-2" />;
      default: return null;
    }
  };
  
  if (isLoadingLogs || isLoadingCycles) {
    return (
      <div className="space-y-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Cycle Insights</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Cycle Length History</h2>
          <Skeleton className="h-60 w-full rounded-md" />
        </Card>
        
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Common Symptoms</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Cycle Stats */}
      <Card className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4">Cycle Insights</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Average cycle length</span>
            <span className="font-medium">{Math.round(averageCycleLength)} days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Average period length</span>
            <span className="font-medium">{Math.round(averagePeriodLength)} days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Cycle regularity</span>
            <span className="font-medium">{cycleRegularity}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Last 3 cycles variation</span>
            <span className="font-medium">±{Math.round(cycleVariation)} day{cycleVariation !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </Card>
      
      {/* Cycle Chart */}
      <Card className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4">Cycle Length History</h2>
        <div className="h-60 w-full">
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis 
                  domain={[0, 'dataMax + 5']} 
                  allowDecimals={false}
                  label={{ value: 'Days', angle: -90, position: 'insideLeft', offset: 10 }} 
                />
                <Tooltip formatter={value => [`${value} days`, 'Length']} />
                <Bar 
                  dataKey="days" 
                  name="Cycle Length" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              Not enough cycle data to display chart
            </div>
          )}
        </div>
        <div className="mt-3 text-xs text-slate-500 text-center">
          Based on your last {chartData?.length || 0} cycles
        </div>
      </Card>
      
      {/* Symptom Patterns */}
      <Card className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4">Common Symptoms</h2>
        
        <div className="space-y-3">
          {commonSymptoms.length > 0 ? (
            commonSymptoms.map(({ symptom, percentage }) => (
              <div key={symptom} className="flex justify-between items-center">
                <span className="text-sm flex items-center">
                  {getSymptomIcon(symptom)} {symptom}
                </span>
                <span className="font-medium text-sm">{percentage}% of cycles</span>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-500 text-sm py-4">
              No symptom data available yet
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
