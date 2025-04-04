import React from 'react';
import { useQuery } from '@tanstack/react-query';
import ChatBot from '@/components/ChatBot';
import { PeriodAnalysisData } from '@/lib/geminiService';
import { PeriodLog, Cycle } from '@shared/schema';
import { Card } from '@/components/ui/card';

// Define type for flow values
type FlowType = 'light' | 'medium' | 'heavy' | 'none' | undefined;

export default function ChatbotTab() {
  // Fetch period logs
  const { 
    data: periodLogs = [],
    isLoading: isLoadingPeriodLogs 
  } = useQuery<PeriodLog[]>({ 
    queryKey: ['/api/period-logs'] 
  });

  // Fetch cycles
  const { 
    data: cycles = [],
    isLoading: isLoadingCycles 
  } = useQuery<Cycle[]>({ 
    queryKey: ['/api/cycles'] 
  });

  // Combine loading states
  const isLoading = isLoadingPeriodLogs || isLoadingCycles;

  // Map period logs to the format expected by the chatbot
  const mappedPeriodLogs = React.useMemo(() => {
    return periodLogs.map(log => {
      const flowValue = log.flow as unknown as FlowType;
      return {
        date: log.date,
        flow: flowValue,
        symptoms: log.symptoms ? [...log.symptoms] : undefined,
        mood: log.mood || undefined,
        notes: log.notes || undefined
      };
    });
  }, [periodLogs]);
  
  // Map cycles to the format expected by the chatbot
  const mappedCycles = React.useMemo(() => {
    return cycles.map(cycle => ({
      startDate: cycle.startDate,
      endDate: cycle.endDate || undefined,
      periodLength: cycle.periodLength || undefined,
      cycleLength: cycle.cycleLength || undefined
    }));
  }, [cycles]);

  // Prepare data for the chatbot
  const periodData: PeriodAnalysisData = {
    periodLogs: mappedPeriodLogs,
    cycles: mappedCycles
  };

  return (
    <div className="container px-4 py-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Chat Assistant</h1>
      
      <div className="grid gap-4">
        <div className="col-span-1">
          <p className="text-sm text-muted-foreground mb-4">
            Chat with your AI assistant about your period, cycle patterns, and get personalized insights.
            The assistant analyzes your logged data to provide helpful answers about your menstrual health.
          </p>
        </div>
        
        <div className="col-span-1">
          <ChatBot 
            periodData={periodData}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}