import { 
  users, 
  type User, 
  type InsertUser,
  periodLogs,
  type PeriodLog,
  type InsertPeriodLog,
  cycles,
  type Cycle,
  type InsertCycle,
  reminders,
  type Reminder,
  type InsertReminder,
  pcosDetections,
  type PcosDetection,
  type InsertPcosDetection
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Period logs methods
  getPeriodLogs(userId: number): Promise<PeriodLog[]>;
  getPeriodLogById(id: number): Promise<PeriodLog | undefined>;
  getPeriodLogByDate(userId: number, date: string): Promise<PeriodLog | undefined>;
  createPeriodLog(log: InsertPeriodLog): Promise<PeriodLog>;
  updatePeriodLog(id: number, log: Partial<PeriodLog>): Promise<PeriodLog | undefined>;
  deletePeriodLog(id: number): Promise<boolean>;
  
  // Cycles methods
  getCycles(userId: number): Promise<Cycle[]>;
  getCycleById(id: number): Promise<Cycle | undefined>;
  createCycle(cycle: InsertCycle): Promise<Cycle>;
  updateCycle(id: number, cycle: Partial<Cycle>): Promise<Cycle | undefined>;
  deleteCycle(id: number): Promise<boolean>;
  
  // Reminders methods
  getReminders(userId: number): Promise<Reminder[]>;
  getReminderById(id: number): Promise<Reminder | undefined>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminder(id: number, reminder: Partial<Reminder>): Promise<Reminder | undefined>;
  deleteReminder(id: number): Promise<boolean>;
  
  // PCOS Detection methods
  getPcosDetections(userId: number): Promise<PcosDetection[]>;
  getPcosDetectionById(id: number): Promise<PcosDetection | undefined>;
  createPcosDetection(detection: InsertPcosDetection): Promise<PcosDetection>;
  updatePcosDetection(id: number, detection: Partial<PcosDetection>): Promise<PcosDetection | undefined>;
  deletePcosDetection(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private periodLogs: Map<number, PeriodLog>;
  private cycles: Map<number, Cycle>;
  private reminders: Map<number, Reminder>;
  private pcosDetections: Map<number, PcosDetection>;
  
  private userId: number;
  private periodLogId: number;
  private cycleId: number;
  private reminderId: number;
  private pcosDetectionId: number;

  constructor() {
    this.users = new Map();
    this.periodLogs = new Map();
    this.cycles = new Map();
    this.reminders = new Map();
    this.pcosDetections = new Map();
    
    this.userId = 1;
    this.periodLogId = 1;
    this.cycleId = 1;
    this.reminderId = 1;
    this.pcosDetectionId = 1;
    
    // Add a default user
    this.createUser({
      username: 'default',
      password: 'password'
    });
    
    // Add sample data for better chatbot functionality
    this.initializeSampleData();
  }
  
  // Initialize sample period data for the chatbot to analyze
  private async initializeSampleData() {
    const userId = 1;
    const today = new Date();
    
    // Generate dates for the past 6 months
    const generatePastDate = (daysAgo: number) => {
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      return date.toISOString();
    };
    
    // Create a sample reminder
    await this.createReminder({
      userId: 1,
      type: 'period',
      timing: { days: 2, when: 'before' },
      time: '08:00',
      message: 'Your period is coming soon',
      enabled: true
    });
    
    // Sample period logs for past 6 months (approximately 6 cycles)
    const sampleLogs = [
      // Most recent period started 30 days ago
      {
        userId,
        date: generatePastDate(30),
        flow: 'medium',
        symptoms: ['Cramps', 'Bloating'],
        mood: 'Irritable',
        notes: 'First day of period, more intense symptoms'
      },
      {
        userId,
        date: generatePastDate(31),
        flow: 'heavy',
        symptoms: ['Cramps', 'Backache'],
        mood: 'Tired',
        notes: 'Second day of period'
      },
      {
        userId,
        date: generatePastDate(32),
        flow: 'medium',
        symptoms: ['Cramps'],
        mood: 'Better',
        notes: 'Third day of period'
      },
      {
        userId,
        date: generatePastDate(33),
        flow: 'light',
        symptoms: [],
        mood: 'Normal',
        notes: 'Fourth day of period'
      },
      
      // Period from 2 months ago
      {
        userId,
        date: generatePastDate(58),
        flow: 'medium',
        symptoms: ['Cramps', 'Headache'],
        mood: 'Irritable',
        notes: 'First day of period'
      },
      {
        userId,
        date: generatePastDate(59),
        flow: 'heavy',
        symptoms: ['Cramps', 'Nausea'],
        mood: 'Tired',
        notes: 'Second day, heavy flow'
      },
      {
        userId,
        date: generatePastDate(60),
        flow: 'medium',
        symptoms: ['Cramps'],
        mood: 'Better',
        notes: 'Third day of period'
      },
      {
        userId,
        date: generatePastDate(61),
        flow: 'light',
        symptoms: [],
        mood: 'Normal',
        notes: 'Last day of period'
      },
      
      // Period from 3 months ago
      {
        userId,
        date: generatePastDate(88),
        flow: 'light',
        symptoms: ['Headache'],
        mood: 'Anxious',
        notes: 'Started period'
      },
      {
        userId,
        date: generatePastDate(89),
        flow: 'medium',
        symptoms: ['Cramps', 'Bloating'],
        mood: 'Irritable',
        notes: 'Second day'
      },
      {
        userId,
        date: generatePastDate(90),
        flow: 'medium',
        symptoms: ['Cramps'],
        mood: 'Tired',
        notes: 'Third day'
      },
      {
        userId,
        date: generatePastDate(91),
        flow: 'light',
        symptoms: [],
        mood: 'Better',
        notes: 'Last day'
      },
      
      // Period from 4 months ago
      {
        userId,
        date: generatePastDate(118),
        flow: 'medium',
        symptoms: ['Cramps', 'Backache'],
        mood: 'Irritable',
        notes: 'Started period'
      },
      {
        userId,
        date: generatePastDate(119),
        flow: 'heavy',
        symptoms: ['Cramps', 'Nausea', 'Bloating'],
        mood: 'Tired',
        notes: 'Heavy day'
      },
      {
        userId,
        date: generatePastDate(120),
        flow: 'medium',
        symptoms: ['Cramps'],
        mood: 'Better',
        notes: 'Third day'
      },
      {
        userId,
        date: generatePastDate(121),
        flow: 'light',
        symptoms: [],
        mood: 'Normal',
        notes: 'Fourth day'
      },
      {
        userId,
        date: generatePastDate(122),
        flow: 'light',
        symptoms: [],
        mood: 'Normal',
        notes: 'Last day'
      }
    ];
    
    // Add the sample logs to the database
    for (const log of sampleLogs) {
      await this.createPeriodLog(log);
    }
    
    // Create corresponding cycles
    const cycleDates = [
      { 
        userId,
        startDate: generatePastDate(33), 
        endDate: generatePastDate(30), 
        periodLength: 4, 
        cycleLength: 28 
      },
      { 
        userId,
        startDate: generatePastDate(61), 
        endDate: generatePastDate(58), 
        periodLength: 4, 
        cycleLength: 28 
      },
      { 
        userId,
        startDate: generatePastDate(91), 
        endDate: generatePastDate(88), 
        periodLength: 4, 
        cycleLength: 30 
      },
      { 
        userId,
        startDate: generatePastDate(122), 
        endDate: generatePastDate(118), 
        periodLength: 5, 
        cycleLength: 29 
      }
    ];
    
    for (const cycle of cycleDates) {
      await this.createCycle(cycle);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Period logs methods
  async getPeriodLogs(userId: number): Promise<PeriodLog[]> {
    return Array.from(this.periodLogs.values())
      .filter(log => log.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async getPeriodLogById(id: number): Promise<PeriodLog | undefined> {
    return this.periodLogs.get(id);
  }
  
  async getPeriodLogByDate(userId: number, date: string): Promise<PeriodLog | undefined> {
    return Array.from(this.periodLogs.values()).find(
      log => log.userId === userId && log.date === date
    );
  }
  
  async createPeriodLog(log: InsertPeriodLog): Promise<PeriodLog> {
    const id = this.periodLogId++;
    // Ensure all fields have proper null values when undefined
    const newLog: PeriodLog = { 
      id, 
      userId: log.userId,
      date: log.date,
      flow: log.flow ?? null, 
      symptoms: log.symptoms ?? null,
      mood: log.mood ?? null,
      notes: log.notes ?? null
    };
    this.periodLogs.set(id, newLog);
    
    // Update cycle data automatically when logging periods
    this.updateCyclesFromPeriodLogs(log.userId);
    
    return newLog;
  }
  
  async updatePeriodLog(id: number, log: Partial<PeriodLog>): Promise<PeriodLog | undefined> {
    const existingLog = this.periodLogs.get(id);
    if (!existingLog) return undefined;
    
    const updatedLog = { ...existingLog, ...log };
    this.periodLogs.set(id, updatedLog);
    
    // Update cycle data when period logs change
    this.updateCyclesFromPeriodLogs(existingLog.userId);
    
    return updatedLog;
  }
  
  async deletePeriodLog(id: number): Promise<boolean> {
    const log = this.periodLogs.get(id);
    if (!log) return false;
    
    const deleted = this.periodLogs.delete(id);
    
    // Update cycle data when period logs are deleted
    if (deleted) {
      this.updateCyclesFromPeriodLogs(log.userId);
    }
    
    return deleted;
  }
  
  // Cycles methods
  async getCycles(userId: number): Promise<Cycle[]> {
    return Array.from(this.cycles.values())
      .filter(cycle => cycle.userId === userId)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }
  
  async getCycleById(id: number): Promise<Cycle | undefined> {
    return this.cycles.get(id);
  }
  
  async createCycle(cycle: InsertCycle): Promise<Cycle> {
    const id = this.cycleId++;
    // Ensure all fields have proper null values when undefined
    const newCycle: Cycle = { 
      id,
      userId: cycle.userId,
      startDate: cycle.startDate,
      endDate: cycle.endDate ?? null,
      periodLength: cycle.periodLength ?? null,
      cycleLength: cycle.cycleLength ?? null
    };
    this.cycles.set(id, newCycle);
    return newCycle;
  }
  
  async updateCycle(id: number, cycle: Partial<Cycle>): Promise<Cycle | undefined> {
    const existingCycle = this.cycles.get(id);
    if (!existingCycle) return undefined;
    
    const updatedCycle = { ...existingCycle, ...cycle };
    this.cycles.set(id, updatedCycle);
    return updatedCycle;
  }
  
  async deleteCycle(id: number): Promise<boolean> {
    return this.cycles.delete(id);
  }
  
  // Reminders methods
  async getReminders(userId: number): Promise<Reminder[]> {
    return Array.from(this.reminders.values())
      .filter(reminder => reminder.userId === userId)
      .sort((a, b) => a.id - b.id);
  }
  
  async getReminderById(id: number): Promise<Reminder | undefined> {
    return this.reminders.get(id);
  }
  
  async createReminder(reminder: InsertReminder): Promise<Reminder> {
    const id = this.reminderId++;
    // Ensure all fields have proper null values when undefined
    const newReminder: Reminder = { 
      id,
      userId: reminder.userId,
      type: reminder.type,
      timing: reminder.timing,
      time: reminder.time,
      message: reminder.message ?? null,
      enabled: reminder.enabled ?? true
    };
    this.reminders.set(id, newReminder);
    return newReminder;
  }
  
  async updateReminder(id: number, reminder: Partial<Reminder>): Promise<Reminder | undefined> {
    const existingReminder = this.reminders.get(id);
    if (!existingReminder) return undefined;
    
    const updatedReminder = { ...existingReminder, ...reminder };
    this.reminders.set(id, updatedReminder);
    return updatedReminder;
  }
  
  async deleteReminder(id: number): Promise<boolean> {
    return this.reminders.delete(id);
  }
  
  // PCOS Detection methods
  async getPcosDetections(userId: number): Promise<PcosDetection[]> {
    return Array.from(this.pcosDetections.values())
      .filter(detection => detection.userId === userId)
      .sort((a, b) => {
        // Sort by creation date (newest first)
        // @ts-ignore - createdAt is a timestamp, so comparing works
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
  
  async getPcosDetectionById(id: number): Promise<PcosDetection | undefined> {
    return this.pcosDetections.get(id);
  }
  
  async createPcosDetection(detection: InsertPcosDetection): Promise<PcosDetection> {
    const id = this.pcosDetectionId++;
    const now = new Date();
    
    // Ensure all fields have proper null values when undefined
    const newDetection: PcosDetection = { 
      id,
      userId: detection.userId,
      imageUrl: detection.imageUrl,
      imageId: detection.imageId,
      pcosLikelihood: detection.pcosLikelihood,
      isPcos: detection.isPcos,
      notes: detection.notes ?? null,
      createdAt: now.toISOString()
    };
    
    this.pcosDetections.set(id, newDetection);
    return newDetection;
  }
  
  async updatePcosDetection(id: number, detection: Partial<PcosDetection>): Promise<PcosDetection | undefined> {
    const existingDetection = this.pcosDetections.get(id);
    if (!existingDetection) return undefined;
    
    const updatedDetection = { ...existingDetection, ...detection };
    this.pcosDetections.set(id, updatedDetection);
    return updatedDetection;
  }
  
  async deletePcosDetection(id: number): Promise<boolean> {
    return this.pcosDetections.delete(id);
  }
  
  // Helper functions
  private updateCyclesFromPeriodLogs(userId: number): void {
    const logs = Array.from(this.periodLogs.values())
      .filter(log => log.userId === userId && log.flow && log.flow !== 'none')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (logs.length === 0) return;
    
    // Group logs into cycles
    const cycleLogs: PeriodLog[][] = [];
    let currentCycleLogs: PeriodLog[] = [logs[0]];
    
    for (let i = 1; i < logs.length; i++) {
      const prevDate = new Date(logs[i-1].date);
      const currDate = new Date(logs[i].date);
      const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // If days are consecutive or within 2 days, they're part of the same period
      if (diffDays <= 2) {
        currentCycleLogs.push(logs[i]);
      } else {
        // Start a new cycle
        cycleLogs.push(currentCycleLogs);
        currentCycleLogs = [logs[i]];
      }
    }
    
    // Add the last cycle
    if (currentCycleLogs.length > 0) {
      cycleLogs.push(currentCycleLogs);
    }
    
    // Clear existing cycles for this user
    Array.from(this.cycles.values())
      .filter(cycle => cycle.userId === userId)
      .forEach(cycle => this.cycles.delete(cycle.id));
    
    // Create new cycles
    cycleLogs.forEach((periodLogs, index) => {
      const startDate = periodLogs[0].date;
      const endDate = periodLogs[periodLogs.length - 1].date;
      const periodLength = periodLogs.length;
      
      // Calculate cycle length based on the time between this cycle's start and the next cycle's start
      let cycleLength: number | undefined;
      if (index < cycleLogs.length - 1) {
        const nextCycleStart = new Date(cycleLogs[index + 1][0].date);
        const thisStart = new Date(startDate);
        cycleLength = Math.floor((nextCycleStart.getTime() - thisStart.getTime()) / (1000 * 60 * 60 * 24));
      }
      
      this.createCycle({
        userId,
        startDate,
        endDate,
        periodLength,
        cycleLength
      });
    });
  }
}

export const storage = new MemStorage();
