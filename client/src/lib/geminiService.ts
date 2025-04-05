// Client-side types for Gemini Service

export interface PeriodAnalysisData {
  periodLogs: {
    date: string;
    flow?: 'light' | 'medium' | 'heavy' | 'none';
    symptoms?: string[];
    mood?: string;
    notes?: string;
  }[];
  cycles: {
    startDate: string;
    endDate?: string;
    periodLength?: number;
    cycleLength?: number;
  }[];
}