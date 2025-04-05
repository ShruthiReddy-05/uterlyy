export interface CycleData {
  id?: number;
  userId?: number;
  startDate: string;
  endDate?: string;
  periodLength?: number;
  cycleLength?: number;
}

export interface PeriodLogData {
  id?: number;
  userId?: number;
  date: string;
  flow?: 'light' | 'medium' | 'heavy' | 'none';
  symptoms?: string[];
  mood?: string;
  notes?: string;
}

export interface ReminderData {
  id?: number;
  userId?: number;
  type: 'period' | 'fertile' | 'ovulation' | 'medication' | 'custom';
  timing: {
    days: number;
    when: 'before' | 'after' | 'on';
  };
  time: string;
  message?: string;
  enabled: boolean;
}

export interface ReminderSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  quietHours: {
    from: string;
    to: string;
  };
}

export interface PcosDetectionData {
  id?: number;
  userId?: number;
  imageUrl: string;
  imageId: string;
  pcosLikelihood: number;
  isPcos: boolean;
  notes?: string;
  createdAt: string;
}

export type TabType = 'calendar' | 'insights' | 'reminders' | 'chat' | 'pcos';
