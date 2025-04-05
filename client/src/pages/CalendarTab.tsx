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
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [activeFlow, setActiveFlow] = useState<string | null>(null);

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
      return apiRequest('/api/period-logs', {
        method: 'POST',
        body: log
      }).then(res => res.json());
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
      : 5, // Hardcoded to match design
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

  const moods = [
    { label: 'Happy', icon: '😊' },
    { label: 'Sad', icon: '😢' },
    { label: 'Angry', icon: '😠' },
    { label: 'Great', icon: '😃' }
  ];

  const flows = [
    { label: 'Light', icon: '💧' },
    { label: 'Medium', icon: '💧💧' },
    { label: 'Heavy', icon: '💧💧💧' }
  ];

  const resources = [
    { title: "Luteal Phase", image: "https://via.placeholder.com/100" },
    { title: "Nourish Your Body", image: "https://via.placeholder.com/100" },
    { title: "Chance of Pregnancy", image: "https://via.placeholder.com/100" },
    { title: "Chance of Pregnancy", image: "https://via.placeholder.com/100" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-8">
        <section>
          <h3 className="text-gray-700 font-medium mb-4">Mood</h3>
          <div className="flex space-x-4">
            {moods.map((mood) => (
              <button
                key={mood.label}
                className={`flex flex-col items-center p-3 rounded-lg w-20 ${
                  activeMood === mood.label ? "bg-primary/20" : "bg-gray-100"
                }`}
                onClick={() => setActiveMood(mood.label)}
              >
                <span className="text-2xl mb-1">{mood.icon}</span>
                <span className="text-xs text-gray-600">{mood.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-gray-700 font-medium mb-4">Menstrual Flow</h3>
          <p className="text-sm text-gray-500 mb-4">Your average daily flow</p>
          <div className="flex space-x-4">
            {flows.map((flow) => (
              <button
                key={flow.label}
                className={`flex flex-col items-center p-3 rounded-lg w-20 ${
                  activeFlow === flow.label ? "bg-primary/20" : "bg-gray-100"
                }`}
                onClick={() => setActiveFlow(flow.label)}
              >
                <span className="text-2xl mb-1">{flow.icon}</span>
                <span className="text-xs text-gray-600">{flow.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-700 font-medium">Featured Resources</h3>
            <button className="text-primary text-sm">See More</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                <img 
                  src={resource.image}
                  alt={resource.title}
                  className="w-full h-24 object-cover rounded-lg mb-2"
                />
                <p className="text-xs text-gray-700">{resource.title}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="relative w-48 h-48 mx-auto">
            <div className="w-full h-full rounded-full overflow-hidden border-8 border-gray-100 flex items-center justify-center">
              <div className="bg-primary/20 rounded-full w-4/5 h-4/5 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="text-lg font-bold text-primary">DAY {cycleData.currentDay}</div>
                  <div className="text-4xl mt-2">😣</div>
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2 bg-pink-100 text-xs px-2 py-1 rounded-full text-primary">● Period phase</div>
            <div className="absolute bottom-2 right-2 bg-blue-100 text-xs px-2 py-1 rounded-full text-blue-600">● Fertile window</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="mb-2">
            <p className="text-gray-700 font-medium">Current Cycle Day</p>
            <p className="text-primary text-xl font-bold">Day {cycleData.currentDay}</p>
          </div>
          <div className="mb-2">
            <p className="text-gray-700 font-medium">Next Period</p>
            <p className="text-gray-800">In {Math.round((nextPeriodDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-gray-700 font-medium mb-2">Your Health Insights</h3>
          <div className="space-y-3">
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex justify-between">
                <p className="text-purple-800 font-medium">Cycle Length</p>
                <span className="text-purple-800">♡</span>
              </div>
              <p className="text-sm text-purple-600">Average {cycleData.averageLength} days</p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg">
              <div className="flex justify-between">
                <p className="text-indigo-800 font-medium">Sleep Pattern</p>
                <span className="text-indigo-800">♡</span>
              </div>
              <p className="text-sm text-indigo-600">~7.5 hours average</p>
            </div>
          </div>
        </div>

        <button className="w-full bg-primary text-white py-3 rounded-lg font-medium">
          Chat with AI Assistant
        </button>
      </div>
    </div>
  );
}
